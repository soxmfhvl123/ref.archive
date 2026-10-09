import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

import { SEED_REFERENCES } from '../lib/data/seed';

const CAPTURE_DIR = path.join(process.cwd(), 'public', 'captures');

export async function captureAllReferences() {
  if (!fs.existsSync(CAPTURE_DIR)) {
    fs.mkdirSync(CAPTURE_DIR, { recursive: true });
  }

  console.log('Starting Playwright Capture Worker...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });

  for (const item of SEED_REFERENCES) {
    const filename = `${item.id}.png`;
    const outputPath = path.join(CAPTURE_DIR, filename);

    console.log(`Capturing: ${item.title} (${item.url}) -> ${filename}`);
    try {
      const page = await context.newPage();
      await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(2000); // allow layout/fonts to render
      await page.screenshot({ path: outputPath, fullPage: false });
      await page.close();
      console.log(`Saved screenshot to ${outputPath}`);
    } catch (err) {
      console.error(`Failed to capture ${item.url}:`, err);
    }
  }

  await browser.close();
  console.log('Capture Worker completed.');
}

if (require.main === module) {
  captureAllReferences().catch(console.error);
}
