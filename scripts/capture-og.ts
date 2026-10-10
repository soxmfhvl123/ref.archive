import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3891;
const OUT_DIR = path.join(process.cwd(), 'out');

// Simple static server that serves files from OUT_DIR, stripping '/ref.archive' prefix
const server = http.createServer((req, res) => {
  let reqPath = req.url ? req.url.split('?')[0] : '/';
  if (reqPath.startsWith('/ref.archive')) {
    reqPath = reqPath.replace('/ref.archive', '');
  }
  if (reqPath === '' || reqPath === '/') {
    reqPath = '/index.html';
  }

  const filePath = path.join(OUT_DIR, reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.png': 'image/png',
      '.svg': 'image/svg+xml',
      '.jpg': 'image/jpeg',
      '.webm': 'video/webm',
    };
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not Found: ' + reqPath);
  }
});

async function captureOg() {
  server.listen(PORT, async () => {
    console.log(`Server listening on port ${PORT}...`);
    try {
      const browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      // Standard OpenGraph aspect ratio: 1200x630
      const context = await browser.newContext({
        viewport: { width: 1200, height: 630 },
        deviceScaleFactor: 2, // 2x Retina quality for crisp thumbnail
      });

      const page = await context.newPage();
      await page.goto(`http://localhost:${PORT}/ref.archive/`, {
        waitUntil: 'domcontentloaded',
        timeout: 20000,
      });

      // Wait a moment for images to settle
      await page.waitForTimeout(3000);

      const targetPath = path.join(process.cwd(), 'public', 'og-image.png');
      await page.screenshot({
        path: targetPath,
        fullPage: false,
      });

      console.log(`✓ OG Image successfully captured and saved to ${targetPath}`);

      await browser.close();
    } catch (err) {
      console.error('Error capturing OG image:', err);
    } finally {
      server.close();
      process.exit(0);
    }
  });
}

captureOg();
