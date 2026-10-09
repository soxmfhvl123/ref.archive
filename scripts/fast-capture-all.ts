import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { SEED_REFERENCES } from '../lib/data/seed';

const CAPTURE_DIR = path.join(process.cwd(), 'public', 'captures');
const CONCURRENCY = 4;

export async function fastCaptureAll() {
  if (!fs.existsSync(CAPTURE_DIR)) {
    fs.mkdirSync(CAPTURE_DIR, { recursive: true });
  }

  console.log(`Starting Fast Parallel Screenshot Worker (${CONCURRENCY} workers, ${SEED_REFERENCES.length} items)...`);
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const queue = [...SEED_REFERENCES];
  
  async function worker(workerId: number) {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) break;

      const pngPath = path.join(CAPTURE_DIR, `${item.id}.png`);
      
      // Skip if PNG already exists and is valid
      if (fs.existsSync(pngPath) && fs.statSync(pngPath).size > 15000) {
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
        await page.waitForTimeout(2000);
        await page.screenshot({ path: pngPath, fullPage: false });
        console.log(`✓ [Worker ${workerId}] Saved: ${item.id}.png`);
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
