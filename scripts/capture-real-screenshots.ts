import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { SEED_REFERENCES } from '../lib/data/seed';

const CAPTURE_DIR = path.join(process.cwd(), 'public', 'captures');

export async function captureRealScreenshots() {
  if (!fs.existsSync(CAPTURE_DIR)) {
    fs.mkdirSync(CAPTURE_DIR, { recursive: true });
  }

  console.log('Launching Playwright for full real website screenshots...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  for (const item of SEED_REFERENCES) {
    const filename = `${item.id}.png`;
    const outputPath = path.join(CAPTURE_DIR, filename);

    console.log(`[REAL CAPTURE] ${item.title} (${item.url}) ...`);
    let page;
    try {
      page = await context.newPage();
      // Allow navigation to complete
      await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 25000 }).catch(() => {});
      
      // Additional wait for WebGL, canvas, fonts, and animations
      await page.waitForTimeout(4000);

      // Simulate slight scroll or mouse move to trigger interactive canvas/animations
      await page.mouse.move(720, 450).catch(() => {});
      await page.evaluate(() => window.scrollBy(0, 10)).catch(() => {});
      await page.waitForTimeout(1000);

      await page.screenshot({ path: outputPath, fullPage: false });
      console.log(`✓ Saved real screenshot: ${filename}`);
    } catch (err) {
      console.error(`X Failed capturing ${item.url}:`, err);
    } finally {
      if (page) await page.close().catch(() => {});
    }
  }

  await browser.close();
  console.log('Completed capturing real website screenshots.');
}

if (require.main === module) {
  captureRealScreenshots().catch(console.error);
}
