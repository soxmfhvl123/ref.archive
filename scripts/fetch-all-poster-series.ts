import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import https from 'https';

// The 70 base visual styles
const POSTER_STYLES = [
  // Trending (20)
  { id: "poster-heat-map", title: "Heat Map", group: "Trending" },
  { id: "poster-biomorphism", title: "Biomorphism", group: "Trending" },
  { id: "poster-3d-surrealism", title: "3D Surrealism", group: "Trending" },
  { id: "poster-frutiger-aero", title: "Frutiger Aero", group: "Trending" },
  { id: "poster-halftone", title: "Halftone", group: "Trending" },
  { id: "poster-hyper-bloom", title: "Hyper Bloom", group: "Trending" },
  { id: "poster-vaporwave", title: "Vaporwave", group: "Trending" },
  { id: "poster-ascii", title: "Ascii", group: "Trending" },
  { id: "poster-maximalism", title: "Maximalism", group: "Trending" },
  { id: "poster-neo-swiss", title: "Neo Swiss", group: "Trending" },
  { id: "poster-micro-industrial", title: "Micro Industrial", group: "Trending" },
  { id: "poster-acid-wave", title: "Acid Wave", group: "Trending" },
  { id: "poster-retro-futurism", title: "Retro Futurism", group: "Trending" },
  { id: "poster-pop-illustration", title: "Pop Illustration", group: "Trending" },
  { id: "poster-computer-vision", title: "Computer Vision", group: "Trending" },
  { id: "poster-dreamscape", title: "Dreamscape", group: "Trending" },
  { id: "poster-future-medieval", title: "Future Medieval", group: "Trending" },
  { id: "poster-trinket-design", title: "Trinket Design", group: "Trending" },
  { id: "poster-vector-surrealism", title: "Vector Surrealism", group: "Trending" },
  { id: "poster-y2k", title: "Y2K", group: "Trending" },

  // Typography (10)
  { id: "poster-neo-brutalism", title: "Neo Brutalism", group: "Typography" },
  { id: "poster-anti-design", title: "Anti-Design", group: "Typography" },
  { id: "poster-swiss-punk", title: "Swiss Punk", group: "Typography" },
  { id: "poster-experimental-type", title: "Experimental Type", group: "Typography" },
  { id: "poster-liquid-type", title: "Liquid Type", group: "Typography" },
  { id: "poster-blackletter-revival", title: "Blackletter Revival", group: "Typography" },
  { id: "poster-stretched-type", title: "Stretched Type", group: "Typography" },
  { id: "poster-monospace-terminal", title: "Monospace Terminal", group: "Typography" },
  { id: "poster-hand-scribble", title: "Hand Scribble", group: "Typography" },
  { id: "poster-kinetic-type", title: "Kinetic Type", group: "Typography" },

  // Print & Analog (10)
  { id: "poster-risograph", title: "Risograph", group: "Print & Analog" },
  { id: "poster-screen-print", title: "Screen Print", group: "Print & Analog" },
  { id: "poster-xerox-punk", title: "Xerox Punk", group: "Print & Analog" },
  { id: "poster-cut-paste-collage", title: "Cut & Paste Collage", group: "Print & Analog" },
  { id: "poster-diy-zine", title: "DIY Zine", group: "Print & Analog" },
  { id: "poster-duotone", title: "Duotone", group: "Print & Analog" },
  { id: "poster-gradient-grain", title: "Gradient Grain", group: "Print & Analog" },
  { id: "poster-scanography", title: "Scanography", group: "Print & Analog" },
  { id: "poster-sticker-bomb", title: "Sticker Bomb", group: "Print & Analog" },
  { id: "poster-grunge", title: "Grunge", group: "Print & Analog" },

  // Movement & Era (10)
  { id: "poster-bauhaus", title: "Bauhaus", group: "Movement & Era" },
  { id: "poster-constructivism", title: "Constructivism", group: "Movement & Era" },
  { id: "poster-mid-century-modern", title: "Mid-century Modern", group: "Movement & Era" },
  { id: "poster-psychedelic-60s", title: "Psychedelic 60s", group: "Movement & Era" },
  { id: "poster-memphis", title: "Memphis", group: "Movement & Era" },
  { id: "poster-op-art", title: "Op Art", group: "Movement & Era" },
  { id: "poster-art-nouveau-revival", title: "Art Nouveau Revival", group: "Movement & Era" },
  { id: "poster-showa-retro", title: "Showa Retro", group: "Movement & Era" },
  { id: "poster-newtro", title: "Newtro", group: "Movement & Era" },
  { id: "poster-archival", title: "Archival", group: "Movement & Era" },

  // Digital & 3D (10)
  { id: "poster-liquid-chrome", title: "Liquid Chrome", group: "Digital & 3D" },
  { id: "poster-glassmorphism", title: "Glassmorphism", group: "Digital & 3D" },
  { id: "poster-inflatable-3d", title: "Inflatable 3D", group: "Digital & 3D" },
  { id: "poster-claymorphism", title: "Claymorphism", group: "Digital & 3D" },
  { id: "poster-ps1-low-poly", title: "PS1 Low Poly", group: "Digital & 3D" },
  { id: "poster-holographic", title: "Holographic", group: "Digital & 3D" },
  { id: "poster-glitch-datamosh", title: "Glitch / Datamosh", group: "Digital & 3D" },
  { id: "poster-dithering", title: "Dithering", group: "Digital & 3D" },
  { id: "poster-pixel-art", title: "Pixel Art", group: "Digital & 3D" },
  { id: "poster-generative-code-art", title: "Generative / Code Art", group: "Digital & 3D" },

  // Mood & Subculture (10)
  { id: "poster-cyberpunk", title: "Cyberpunk", group: "Mood & Subculture" },
  { id: "poster-solarpunk", title: "Solarpunk", group: "Mood & Subculture" },
  { id: "poster-neon-noir", title: "Neon Noir", group: "Mood & Subculture" },
  { id: "poster-webcore", title: "Webcore", group: "Mood & Subculture" },
  { id: "poster-liminal-space", title: "Liminal Space", group: "Mood & Subculture" },
  { id: "poster-kawaii-maximal", title: "Kawaii Maximal", group: "Mood & Subculture" },
  { id: "poster-anime-graphic", title: "Anime Graphic", group: "Mood & Subculture" },
  { id: "poster-gothic-romance", title: "Gothic Romance", group: "Mood & Subculture" },
  { id: "poster-sci-fi-hud", title: "Sci-fi HUD", group: "Mood & Subculture" },
  { id: "poster-blueprint-wireframe", title: "Blueprint / Wireframe", group: "Mood & Subculture" },
];

const POSTERS_PER_STYLE = 8;

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
  const outputDir = path.join(process.cwd(), 'public', 'captures', 'posters');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Starting scrape of ${POSTER_STYLES.length} styles x ${POSTERS_PER_STYLE} posters = ${POSTER_STYLES.length * POSTERS_PER_STYLE} total posters...`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 }
  });

  const CONCURRENCY = 4;
  let currentIndex = 0;
  let totalDownloaded = 0;

  async function worker(workerId: number) {
    const page = await context.newPage();
    while (currentIndex < POSTER_STYLES.length) {
      const idx = currentIndex++;
      const item = POSTER_STYLES[idx];
      const query = `${item.title} graphic design poster`;
      const searchUrl = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`;

      // Check which numbers 1..POSTERS_PER_STYLE are missing
      const neededNumbers: number[] = [];
      for (let n = 1; n <= POSTERS_PER_STYLE; n++) {
        const filename = n === 1 ? `${item.id}.jpg` : `${item.id}-${n}.jpg`;
        const filepath = path.join(outputDir, filename);
        if (!fs.existsSync(filepath) || fs.statSync(filepath).size < 1000) {
          neededNumbers.push(n);
        }
      }

      if (neededNumbers.length === 0) {
        console.log(`[Worker ${workerId}] (${idx + 1}/${POSTER_STYLES.length}) ✓ ${item.title}: all ${POSTERS_PER_STYLE} posters already exist.`);
        continue;
      }

      console.log(`[Worker ${workerId}] (${idx + 1}/${POSTER_STYLES.length}) Searching: ${item.title} (needs ${neededNumbers.length} posters)...`);

      try {
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 25000 });
        await page.waitForTimeout(2500);

        const imgUrls = await page.evaluate(() => {
          const imgs = Array.from(document.querySelectorAll('img'))
            .map(i => i.src)
            .filter(s => s && s.includes('pinimg.com') && (s.includes('236x') || s.includes('474x') || s.includes('736x')));
          return imgs;
        });

        const unique = Array.from(new Set(imgUrls.map(s => s.replace(/\/\d+x\//, '/736x/'))));

        if (unique.length > 0) {
          let downloadPromises = [];
          for (let i = 0; i < Math.min(unique.length, POSTERS_PER_STYLE); i++) {
            const pinNum = i + 1;
            const filename = pinNum === 1 ? `${item.id}.jpg` : `${item.id}-${pinNum}.jpg`;
            const filepath = path.join(outputDir, filename);

            if (!fs.existsSync(filepath) || fs.statSync(filepath).size < 1000) {
              const pinUrl = unique[i];
              downloadPromises.push(
                downloadFile(pinUrl, filepath).then(() => {
                  totalDownloaded++;
                }).catch(err => {
                  console.warn(`Failed pin #${pinNum} for ${item.title}: ${err.message}`);
                })
              );
            }
          }

          await Promise.all(downloadPromises);
          console.log(`[Worker ${workerId}] ✓ ${item.title} processed (${neededNumbers.length} new downloaded, total available: ${unique.length})`);
        } else {
          console.warn(`[Worker ${workerId}] ⚠️ No pins found for ${item.title}`);
        }
      } catch (err: any) {
        console.error(`[Worker ${workerId}] ❌ Error fetching ${item.title}:`, err.message);
      }

      await page.waitForTimeout(400);
    }
    await page.close();
  }

  const workers = Array.from({ length: CONCURRENCY }, (_, i) => worker(i + 1));
  await Promise.all(workers);
  await browser.close();

  console.log(`\nAll done! Downloaded ${totalDownloaded} new poster images.`);
}

main().catch(console.error);
