import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { SEED_REFERENCES } from '../lib/data/seed';
import { FURNITURE_REFERENCES } from '../lib/data/furniture';

const VIDEO_DIR = path.join(process.cwd(), 'public', 'videos');
const TEMP_DIR = path.join(process.cwd(), 'public', 'temp_rec');
const CONCURRENCY = 6;

export async function recordVideos() {
  if (!fs.existsSync(VIDEO_DIR)) {
    fs.mkdirSync(VIDEO_DIR, { recursive: true });
  }
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  const allItems = [...SEED_REFERENCES, ...FURNITURE_REFERENCES];
  console.log(`Starting Parallel Playwright Video Recording (${CONCURRENCY} workers, 5-second hover clips)...`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const queue = [...allItems];

  async function worker(workerId: number) {
    const workerTemp = path.join(TEMP_DIR, `worker_${workerId}`);
    if (!fs.existsSync(workerTemp)) {
      fs.mkdirSync(workerTemp, { recursive: true });
    }

    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) break;

      const targetVideoPath = path.join(VIDEO_DIR, `${item.id}.webm`);

      // Skip if video already exists and is non-empty
      if (fs.existsSync(targetVideoPath) && fs.statSync(targetVideoPath).size > 50000) {
        continue;
      }

      console.log(`[Worker ${workerId}] Recording video: ${item.id} (${item.url})...`);
      let context;
      let page;
      try {
        context = await browser.newContext({
          userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          viewport: { width: 1280, height: 800 },
          recordVideo: {
            dir: workerTemp,
            size: { width: 1280, height: 800 },
          },
        });

        page = await context.newPage();
        await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});

        // Dynamic motion & scroll simulation for rich preview
        await page.waitForTimeout(1500);
        await page.mouse.move(640, 400);
        await page.evaluate(() => window.scrollBy(0, 80));
        await page.waitForTimeout(2000);
        await page.evaluate(() => window.scrollBy(0, -80));
        await page.waitForTimeout(1500);
      } catch (err) {
        console.error(`[Worker ${workerId}] Error recording ${item.url}:`, err);
      } finally {
        if (page) {
          const video = page.video();
          await page.close().catch(() => {});
          if (context) await context.close().catch(() => {});

          if (video) {
            try {
              const savedPath = await video.path();
              if (fs.existsSync(savedPath) && fs.statSync(savedPath).size > 10000) {
                fs.copyFileSync(savedPath, targetVideoPath);
                fs.unlinkSync(savedPath);
                console.log(`✓ [Worker ${workerId}] Saved video: ${item.id}.webm`);
              }
            } catch (e) {
              // Ignore video path error on timeout/close
            }
          }
        }
      }
    }

    if (fs.existsSync(workerTemp)) {
      fs.rmSync(workerTemp, { recursive: true, force: true });
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, (_, i) => worker(i + 1));
  await Promise.all(workers);

  await browser.close();
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  }

  console.log('Video Recording Worker completed.');
}

if (require.main === module) {
  recordVideos().catch(console.error);
}
