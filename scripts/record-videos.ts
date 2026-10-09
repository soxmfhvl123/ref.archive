import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { SEED_REFERENCES } from '../lib/data/seed';

const VIDEO_DIR = path.join(process.cwd(), 'public', 'videos');
const TEMP_DIR = path.join(process.cwd(), 'public', 'temp_rec');

export async function recordVideos() {
  if (!fs.existsSync(VIDEO_DIR)) {
    fs.mkdirSync(VIDEO_DIR, { recursive: true });
  }
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  console.log('Starting Playwright Video Recording Worker (8-second clips per reference)...');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const item of SEED_REFERENCES) {
    const targetVideoPath = path.join(VIDEO_DIR, `${item.id}.webm`);
    
    // Skip if video already exists and is non-empty
    if (fs.existsSync(targetVideoPath) && fs.statSync(targetVideoPath).size > 50000) {
      console.log(`Video already exists for ${item.id}, skipping.`);
      continue;
    }

    console.log(`[RECORDING VIDEO] ${item.title} (${item.url}) ...`);
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      recordVideo: {
        dir: TEMP_DIR,
        size: { width: 1280, height: 800 },
      },
    });

    const page = await context.newPage();
    try {
      await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 25000 }).catch(() => {});
      
      // Wait and simulate gentle mouse movement and scroll for dynamic video capture
      await page.waitForTimeout(2000);
      await page.mouse.move(640, 400);
      await page.waitForTimeout(1000);
      await page.mouse.move(800, 500);
      await page.evaluate(() => window.scrollBy(0, 100));
      await page.waitForTimeout(3000);
      await page.evaluate(() => window.scrollBy(0, -100));
      await page.waitForTimeout(2000);
    } catch (err) {
      console.error(`Failed to record video for ${item.url}:`, err);
    } finally {
      const video = page.video();
      await page.close();
      await context.close();

      if (video) {
        const savedPath = await video.path();
        if (fs.existsSync(savedPath)) {
          fs.copyFileSync(savedPath, targetVideoPath);
          fs.unlinkSync(savedPath);
          console.log(`✓ Saved video: ${targetVideoPath}`);
        }
      }
    }
  }

  await browser.close();
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  }

  console.log('Video Recording Worker completed.');
}

if (require.main === module) {
  recordVideos().catch(console.error);
}
