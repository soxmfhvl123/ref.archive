import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const VIDEOS_DIR = path.resolve('public/videos');
const CAPTURES_DIR = path.resolve('public/captures');

async function optimizeVideos() {
  const files = fs.readdirSync(VIDEOS_DIR).filter(f => f.endsWith('.webm'));
  console.log(`Found ${files.length} videos in ${VIDEOS_DIR}`);

  // Only target videos > 500KB
  const targets = [];
  for (const f of files) {
    const fullPath = path.join(VIDEOS_DIR, f);
    const stat = fs.statSync(fullPath);
    if (stat.size > 500 * 1024) {
      targets.push({ file: f, path: fullPath, size: stat.size });
    }
  }

  targets.sort((a, b) => b.size - a.size);
  console.log(`Targeting ${targets.length} videos larger than 500KB for optimization`);

  let totalSaved = 0;
  let completed = 0;

  // Process with concurrency of 4
  const CONCURRENCY = 4;
  const queue = [...targets];

  async function worker() {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) break;

      const tmpOut = `/tmp/opt_${Date.now()}_${Math.random().toString(36).slice(2)}_${item.file}`;
      try {
        await execFileAsync('ffmpeg', [
          '-y',
          '-i', item.path,
          '-vf', 'scale=960:-2',
          '-c:v', 'libvpx-vp9',
          '-crf', '36',
          '-b:v', '0',
          '-an',
          tmpOut
        ]);

        if (fs.existsSync(tmpOut)) {
          const newStat = fs.statSync(tmpOut);
          if (newStat.size < item.size && newStat.size > 1000) {
            const saved = item.size - newStat.size;
            fs.copyFileSync(tmpOut, item.path);
            totalSaved += saved;
            console.log(`[${++completed}/${targets.length}] ${item.file}: ${(item.size / 1024 / 1024).toFixed(2)}MB -> ${(newStat.size / 1024 / 1024).toFixed(2)}MB (saved ${(saved / 1024 / 1024).toFixed(2)}MB)`);
          } else {
            console.log(`[${++completed}/${targets.length}] ${item.file}: skipped (not smaller)`);
          }
          fs.unlinkSync(tmpOut);
        }
      } catch (err) {
        console.error(`Error optimizing ${item.file}:`, err.message);
        if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  console.log(`Total video space saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
}

async function optimizeCaptures() {
  const files = fs.readdirSync(CAPTURES_DIR).filter(f => f.endsWith('.png'));
  console.log(`Found ${files.length} PNGs in ${CAPTURES_DIR}`);

  const targets = [];
  for (const f of files) {
    const fullPath = path.join(CAPTURES_DIR, f);
    const stat = fs.statSync(fullPath);
    if (stat.size > 500 * 1024) { // > 500KB
      targets.push({ file: f, path: fullPath, size: stat.size });
    }
  }

  console.log(`Targeting ${targets.length} PNGs larger than 500KB for resize (sips -Z 1080)`);
  let totalSaved = 0;

  for (let i = 0; i < targets.length; i++) {
    const item = targets[i];
    try {
      await execFileAsync('sips', ['-Z', '1080', item.path]);
      const newStat = fs.statSync(item.path);
      const saved = item.size - newStat.size;
      totalSaved += Math.max(0, saved);
      console.log(`[${i + 1}/${targets.length}] ${item.file}: ${(item.size / 1024 / 1024).toFixed(2)}MB -> ${(newStat.size / 1024 / 1024).toFixed(2)}MB`);
    } catch (err) {
      console.error(`Error resizing ${item.file}:`, err.message);
    }
  }

  console.log(`Total capture PNG space saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
}

async function main() {
  await optimizeVideos();
  await optimizeCaptures();
}

main().catch(console.error);
