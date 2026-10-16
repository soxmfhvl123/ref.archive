import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const TARGETS = [
  // Existing ones to fix / refresh
  { id: 'fash-king-kroach', url: 'https://kingkroach.com/', isKingKroach: true },
  { id: 'fash-chin-teo', url: 'https://www.instagram.com/chin_teo/', isInstagram: true },
  { id: 'fash-ma-plus', url: 'https://www.instagram.com/m.across_maurizioamadei/', isInstagram: true },
  { id: 'fash-alyx', url: 'https://www.instagram.com/alyxstudio/', isInstagram: true },
  { id: 'fash-number-nine', url: 'https://www.n-nine.com/', isNumberNine: true },

  // 20 New Targets
  { id: 'fash-acronym', url: 'https://acrnm.com/' },
  { id: 'fash-balenciaga', url: 'https://www.balenciaga.com/' },
  { id: 'fash-han-kjobenhavn', url: 'https://hankjobenhavn.com/' },
  { id: 'fash-gmbh', url: 'https://www.gmbhgmbh.eu/' },
  { id: 'fash-ottolinger', url: 'https://ottolinger.com/' },
  { id: 'fash-dilara-findikoglu', url: 'https://dilarafindikoglu.com/' },
  { id: 'fash-knwls', url: 'https://knwls.com/' },
  { id: 'fash-charlie-constantinou', url: 'https://charlieconstantinou.com/' },
  { id: 'fash-a-cold-wall', url: 'https://a-cold-wall.com/' },
  { id: 'fash-ninamounah', url: 'https://ninamounah.com/' },
  { id: 'fash-misbhv', url: 'https://misbhv.com/' },
  { id: 'fash-44-label-group', url: 'https://44labelgroup.com/' },
  { id: 'fash-sankuanz', url: 'https://www.sankuanz.com/' },
  { id: 'fash-hyein-seo', url: 'https://hyeinseo.com/' },
  { id: 'fash-kusikohc', url: 'https://kusikohc.com/' },
  { id: 'fash-jaekim', url: 'https://jaekim.top/' },
  { id: 'fash-32dawn', url: 'https://www.32dawn.com/' },
  { id: 'fash-justine-clenquet', url: 'https://justineclenquet.com/' },
  { id: 'fash-vitaly', url: 'https://vitalydesign.com/' },
  { id: 'fash-struga', url: 'https://strugadesign.com/' },
];

const OUT_DIR = path.resolve('public/captures/fashion');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function run() {
  console.log(`Starting capture for ${TARGETS.length} fashion targets...`);
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1200, height: 1600 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
  });

  for (let i = 0; i < TARGETS.length; i++) {
    const item = TARGETS[i];
    const outJpg = path.join(OUT_DIR, `${item.id}.jpg`);
    console.log(`[${i + 1}/${TARGETS.length}] Capturing ${item.id} (${item.url})...`);

    const page = await context.newPage();
    try {
      if (item.isInstagram) {
        await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 25000 });
        await page.waitForTimeout(3000);
        // Click Close on modal
        const closeBtn = await page.$('svg[aria-label="Close"]');
        if (closeBtn) {
          await closeBtn.click().catch(() => {});
        }
        await page.waitForTimeout(1000);
      } else if (item.isKingKroach) {
        await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 25000 });
        await page.waitForTimeout(3000);
        const stayBtn = await page.$('text=Stay') || await page.$('.modal button');
        if (stayBtn) {
          await stayBtn.click().catch(() => {});
        }
        await page.waitForTimeout(1500);
      } else if (item.isNumberNine) {
        await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 25000 });
        await page.waitForTimeout(2000);
        // Accept cookies or dismiss banner if present
        const cookieBtn = await page.$('button:has-text("Accept")');
        if (cookieBtn) await cookieBtn.click().catch(() => {});
        await page.waitForTimeout(1000);
      } else {
        await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 25000 });
        await page.waitForTimeout(3000);
        // Dismiss common cookie/newsletter banners if easily clickable
        const cookieBtn = await page.$('button:has-text("Accept"), button:has-text("Agree"), button:has-text("Allow"), #onetrust-accept-btn-handler');
        if (cookieBtn) {
          await cookieBtn.click().catch(() => {});
          await page.waitForTimeout(500);
        }
      }

      await page.setViewportSize({ width: 1200, height: 1600 });
      await page.screenshot({ path: outJpg, type: 'jpeg', quality: 85 });
      const sizeKb = (fs.statSync(outJpg).size / 1024).toFixed(1);
      console.log(`  -> OK: ${outJpg} (${sizeKb} KB)`);
    } catch (err) {
      console.error(`  -> ERROR for ${item.id}:`, err.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log('All fashion captures finished!');
}

run();
