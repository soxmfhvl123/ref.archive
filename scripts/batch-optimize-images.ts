import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

// Disable sharp cache so it doesn't hold open file descriptors
sharp.cache(false);

async function optimizeInBatches<T>(
  items: T[],
  batchSize: number,
  handler: (item: T) => Promise<{ before: number; after: number; saved: boolean }>
): Promise<{ totalBefore: number; totalAfter: number; count: number }> {
  let totalBefore = 0;
  let totalAfter = 0;
  let count = 0;

  for (let i = 0; i < items.length; i += batchSize) {
    const chunk = items.slice(i, i + batchSize);
    const results = await Promise.all(chunk.map(handler));
    for (const r of results) {
      totalBefore += r.before;
      totalAfter += r.after;
      if (r.saved) count++;
    }
    if ((i + batchSize) % (batchSize * 10) === 0 || i + batchSize >= items.length) {
      const pct = ((1 - totalAfter / totalBefore) * 100).toFixed(1);
      console.log(
        `Processed ${Math.min(i + batchSize, items.length)}/${items.length} items. Saved: ${(
          (totalBefore - totalAfter) /
          (1024 * 1024)
        ).toFixed(1)}MB (-${pct}%)`
      );
    }
  }

  return { totalBefore, totalAfter, count };
}

async function main() {
  console.log('=== Starting RefArchive Image Optimization ===\n');

  // 1. Optimize Web PNGs
  const webCapturesDir = path.join(process.cwd(), 'public/captures');
  const webPngs = fs
    .readdirSync(webCapturesDir)
    .filter((f) => f.endsWith('.png'))
    .map((f) => path.join(webCapturesDir, f));

  console.log(`[1/3] Optimizing ${webPngs.length} Web PNG screenshots (maxWidth: 1280px, palette q80)...`);
  const webResult = await optimizeInBatches(webPngs, 16, async (filePath) => {
    const before = fs.statSync(filePath).size;
    try {
      const buffer = await sharp(filePath)
        .resize({ width: 1280, withoutEnlargement: true })
        .png({ quality: 80, compressionLevel: 9, palette: true })
        .toBuffer();

      if (buffer.length < before) {
        fs.writeFileSync(filePath, buffer);
        return { before, after: buffer.length, saved: true };
      }
      return { before, after: before, saved: false };
    } catch (err: any) {
      console.warn(`Error processing ${path.basename(filePath)}:`, err.message);
      return { before, after: before, saved: false };
    }
  });

  // 2. Optimize Poster JPGs
  const postersDir = path.join(process.cwd(), 'public/captures/posters');
  let posterJpgs: string[] = [];
  if (fs.existsSync(postersDir)) {
    posterJpgs = fs
      .readdirSync(postersDir)
      .filter((f) => f.endsWith('.jpg') || f.endsWith('.jpeg'))
      .map((f) => path.join(postersDir, f));
  }

  console.log(`\n[2/3] Optimizing ${posterJpgs.length} Poster JPGs (maxWidth: 600px, mozjpeg q75)...`);
  const posterResult = await optimizeInBatches(posterJpgs, 32, async (filePath) => {
    const before = fs.statSync(filePath).size;
    try {
      const buffer = await sharp(filePath)
        .resize({ width: 600, withoutEnlargement: true })
        .jpeg({ quality: 75, mozjpeg: true })
        .toBuffer();

      if (buffer.length < before) {
        fs.writeFileSync(filePath, buffer);
        return { before, after: buffer.length, saved: true };
      }
      return { before, after: before, saved: false };
    } catch (err: any) {
      console.warn(`Error processing ${path.basename(filePath)}:`, err.message);
      return { before, after: before, saved: false };
    }
  });

  // 3. Optimize Furniture & Fashion JPGs
  const otherDirs = [
    path.join(process.cwd(), 'public/captures/furniture'),
    path.join(process.cwd(), 'public/captures/fashion'),
  ];
  const otherJpgs: string[] = [];
  for (const dir of otherDirs) {
    if (fs.existsSync(dir)) {
      const files = fs
        .readdirSync(dir)
        .filter((f) => f.endsWith('.jpg') || f.endsWith('.jpeg'))
        .map((f) => path.join(dir, f));
      otherJpgs.push(...files);
    }
  }

  console.log(`\n[3/3] Optimizing ${otherJpgs.length} Furniture & Fashion JPGs (maxWidth: 800px, mozjpeg q80)...`);
  const otherResult = await optimizeInBatches(otherJpgs, 16, async (filePath) => {
    const before = fs.statSync(filePath).size;
    try {
      const buffer = await sharp(filePath)
        .resize({ width: 800, withoutEnlargement: true })
        .jpeg({ quality: 80, mozjpeg: true })
        .toBuffer();

      if (buffer.length < before) {
        fs.writeFileSync(filePath, buffer);
        return { before, after: buffer.length, saved: true };
      }
      return { before, after: before, saved: false };
    } catch (err: any) {
      console.warn(`Error processing ${path.basename(filePath)}:`, err.message);
      return { before, after: before, saved: false };
    }
  });

  // Summary
  const grandBefore = webResult.totalBefore + posterResult.totalBefore + otherResult.totalBefore;
  const grandAfter = webResult.totalAfter + posterResult.totalAfter + otherResult.totalAfter;
  const savedBytes = grandBefore - grandAfter;
  const savedPct = ((savedBytes / grandBefore) * 100).toFixed(1);

  console.log('\n========================================');
  console.log('🎉 Optimization Complete!');
  console.log(`Original Total: ${(grandBefore / (1024 * 1024)).toFixed(1)}MB`);
  console.log(`Optimized Total: ${(grandAfter / (1024 * 1024)).toFixed(1)}MB`);
  console.log(`Total Space Saved: ${(savedBytes / (1024 * 1024)).toFixed(1)}MB (-${savedPct}%)`);
  console.log('========================================\n');
}

main().catch(console.error);
