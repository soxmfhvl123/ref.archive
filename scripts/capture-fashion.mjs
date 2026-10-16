import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const FASHION_TARGETS = [
  { id: 'fash-king-kroach', url: 'https://kingkroach.com/' },
  { id: 'fash-gaboratory', url: 'https://gaboratory.com/' },
  { id: 'fash-chin-teo', url: 'https://www.chinteo.com/' },
  { id: 'fash-oss', url: 'https://oss-oss.com/' },
  { id: 'fash-ma-plus', url: 'https://www.maurizioamadei.it/' },
  { id: 'fash-masnada', url: 'https://www.masnada.it/' },
  { id: 'fash-alyx', url: 'https://www.alyxstudio.com/' },
  { id: 'fash-number-nine', url: 'https://www.n-nine.com/' },
  { id: 'fash-the-viridi-anne', url: 'https://viridi-anne.jp/' },
  { id: 'fash-d-gnak', url: 'https://www.dgnak.com/' },
  { id: 'fash-thug-club', url: 'https://thug-club.com/' },
  { id: 'fash-mastermind-japan', url: 'https://www.mastermindjapan.com/' },
  { id: 'fash-guidi', url: 'https://guidi.it/' },
  { id: 'fash-taichi-murakami', url: 'https://taichimurakami.com/' },
];

const OUT_DIR = path.resolve('public/captures/fashion');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function capture() {
  console.log(`Starting capture for ${FASHION_TARGETS.length} fashion sites...`);
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1800 }, // Portrait aspect for fashion
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
  });

  for (let i = 0; i < FASHION_TARGETS.length; i++) {
    const item = FASHION_TARGETS[i];
    const outPng = path.join(OUT_DIR, `${item.id}.png`);
    const outJpg = path.join(OUT_DIR, `${item.id}.jpg`);

    console.log(`[${i + 1}/${FASHION_TARGETS.length}] Capturing ${item.id} from ${item.url}...`);
    const page = await context.newPage();
    try {
      await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(3000); // let animations settle

      // Take a viewport screenshot with 3:4 portrait ratio (900x1200)
      await page.setViewportSize({ width: 1200, height: 1600 });
      await page.screenshot({ path: outJpg, type: 'jpeg', quality: 85 });
      console.log(`  -> Saved ${outJpg} (${(fs.statSync(outJpg).size / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`  -> Failed capturing ${item.id}:`, err.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log('Capture completed!');
}

capture().catch(console.error);
