import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { POSTER_REFERENCES } from '../lib/data/posters';

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadFile(redirectUrl, dest).then(resolve).catch(reject);
          return;
        }
      }
      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        reject(new Error(`Failed to download ${url}: status ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log(`Starting Pinterest poster scraping for ${POSTER_REFERENCES.length} categories...`);
  const outputDir = path.join(process.cwd(), 'public', 'captures', 'posters');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 }
  });

  const CONCURRENCY = 3;
  let currentIndex = 0;
  const results: Record<string, string> = {};

  async function worker(workerId: number) {
    const page = await context.newPage();
    while (currentIndex < POSTER_REFERENCES.length) {
      const idx = currentIndex++;
      const item = POSTER_REFERENCES[idx];
      const query = `${item.title} graphic design poster`;
      const searchUrl = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`;
      const targetFile = path.join(outputDir, `${item.id}.jpg`);

      console.log(`[Worker ${workerId}] (${idx + 1}/${POSTER_REFERENCES.length}) Searching: ${item.title}...`);

      try {
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 25000 });
        await page.waitForTimeout(2500);

        const imgUrls = await page.evaluate(() => {
          const imgs = Array.from(document.querySelectorAll('img'))
            .map(i => i.src)
            .filter(s => s && s.includes('pinimg.com') && (s.includes('236x') || s.includes('474x') || s.includes('736x')));
          return imgs;
        });

        if (imgUrls.length > 0) {
          // Prefer second or first image (first is usually a top related poster)
          const chosenUrl = imgUrls[0].replace(/\/\d+x\//, '/736x/');
          await downloadFile(chosenUrl, targetFile);
          const stat = fs.statSync(targetFile);
          console.log(`[Worker ${workerId}] ✓ ${item.title} saved (${(stat.size / 1024).toFixed(1)} KB) -> ${chosenUrl}`);
          results[item.id] = `/captures/posters/${item.id}.jpg`;
        } else {
          console.warn(`[Worker ${workerId}] ⚠️ No pins found for ${item.title}`);
        }
      } catch (err: any) {
        console.error(`[Worker ${workerId}] ❌ Error fetching ${item.title}:`, err.message);
      }

      // Small pause between searches
      await page.waitForTimeout(500);
    }
    await page.close();
  }

  const workers = Array.from({ length: CONCURRENCY }, (_, i) => worker(i + 1));
  await Promise.all(workers);
  await browser.close();

  console.log(`\nCompleted! Successfully fetched ${Object.keys(results).length} / ${POSTER_REFERENCES.length} Pinterest posters.`);
}

main().catch(console.error);
