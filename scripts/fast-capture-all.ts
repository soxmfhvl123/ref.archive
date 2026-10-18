import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { SEED_REFERENCES } from '../lib/data/seed';
import { FURNITURE_REFERENCES } from '../lib/data/furniture';

const CAPTURE_DIR = path.join(process.cwd(), 'public', 'captures');
const CONCURRENCY = 6;

export async function fastCaptureAll() {
  if (!fs.existsSync(CAPTURE_DIR)) {
    fs.mkdirSync(CAPTURE_DIR, { recursive: true });
  }

  const allItems = [...SEED_REFERENCES, ...FURNITURE_REFERENCES];
  console.log(`Starting Fast Parallel Screenshot Worker (${CONCURRENCY} workers, ${allItems.length} items)...`);
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const queue = [...allItems];
  
  async function worker(workerId: number) {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) break;

      const targetPath = item.imageUrl 
        ? path.join(process.cwd(), 'public', item.imageUrl.replace(/^\//, ''))
        : path.join(CAPTURE_DIR, `${item.id}.png`);
      
      const targetDir = path.dirname(targetPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // Skip if file already exists and is valid
      if (fs.existsSync(targetPath) && fs.statSync(targetPath).size > 15000) {
        continue;
      }

      console.log(`[Worker ${workerId}] Capturing ${item.id} (${item.url})...`);
      let page;
      try {
        const context = await browser.newContext({
          viewport: { width: 1440, height: 900 },
        });
        page = await context.newPage();
        await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
        await page.waitForTimeout(5000);
        if (targetPath.endsWith('.jpg') || targetPath.endsWith('.jpeg')) {
          await page.screenshot({ path: targetPath, type: 'jpeg', quality: 80, fullPage: false });
        } else {
          await page.screenshot({ path: targetPath, fullPage: false });
        }
        console.log(`✓ [Worker ${workerId}] Saved: ${path.basename(targetPath)}`);
        await context.close();
      } catch (err) {
        console.error(`X [Worker ${workerId}] Error capturing ${item.url}:`, err);
      }
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, (_, i) => worker(i + 1));
  await Promise.all(workers);

  await browser.close();
  console.log('Fast Parallel Screenshot Worker finished.');
}

if (require.main === module) {
  fastCaptureAll().catch(console.error);
}
