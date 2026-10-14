import { chromium } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';
import * as http from 'http';
import { execSync } from 'child_process';

function startLocalServer(dir: string, port: number): Promise<http.Server> {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = decodeURIComponent(req.url?.split('?')[0] || '/');
      if (reqPath.endsWith('/')) reqPath += 'index.html';
      
      let filePath = path.join(dir, reqPath);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }

      if (!fs.existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes: Record<string, string> = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.webm': 'video/webm',
        '.mp4': 'video/mp4',
        '.ico': 'image/x-icon',
        '.txt': 'text/plain',
      };

      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    });

    server.listen(port, () => {
      console.log(`Local server listening on http://localhost:${port}`);
      resolve(server);
    });
  });
}

async function main() {
  const rootDir = process.cwd();
  const outDir = path.join(rootDir, 'out');
  const tempVideoDir = path.join(rootDir, 'scratch_video');
  const port = 3333;
  
  if (!fs.existsSync(tempVideoDir)) {
    fs.mkdirSync(tempVideoDir, { recursive: true });
  }

  const server = await startLocalServer(outDir, port);

  console.log('Launching browser...');
  const browser = await chromium.launch({
    headless: true,
  });

  const width = 1440;
  const height = 900;

  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
    recordVideo: {
      dir: tempVideoDir,
      size: { width, height },
    },
  });

  const page = await context.newPage();

  console.log(`Navigating to http://localhost:${port}/#furniture ...`);
  await page.goto(`http://localhost:${port}/#furniture`, { waitUntil: 'networkidle' });

  // Ensure layout is ready
  await page.waitForTimeout(2000);

  // Initial pause before scroll (1 second)
  console.log('Starting 10-second smooth scroll...');
  await page.waitForTimeout(1000);

  // 10 seconds smooth continuous scroll using raw string evaluation
  await page.evaluate(`
    new Promise((resolve) => {
      const duration = 10000; // 10,000ms = 10s
      const start = performance.now();
      const startScroll = window.scrollY;
      const targetScroll = 3800; // gentle scrolling speed showing furniture items

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Linear smooth scroll
        window.scrollTo(0, startScroll + targetScroll * progress);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          resolve();
        }
      }
      requestAnimationFrame(step);
    })
  `);

  // Pause at the end for 1 second
  console.log('Scroll completed. Holding 1 second...');
  await page.waitForTimeout(1000);

  // Get video object before closing page
  const videoObj = page.video();
  const rawVideoPath = await videoObj?.path();

  await page.close();
  await context.close();
  await browser.close();
  server.close();

  if (rawVideoPath && fs.existsSync(rawVideoPath)) {
    console.log('Raw video saved at:', rawVideoPath);
    const targetMp4 = path.join(rootDir, 'furniture-scroll-10s.mp4');
    const targetWebm = path.join(rootDir, 'furniture-scroll-10s.webm');

    // Copy webm
    fs.copyFileSync(rawVideoPath, targetWebm);
    console.log('Exported WEBM to:', targetWebm);

    // Convert to high-quality MP4 using ffmpeg
    console.log('Transcoding to MP4 with ffmpeg...');
    execSync(`ffmpeg -y -i "${rawVideoPath}" -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p "${targetMp4}"`, {
      stdio: 'inherit',
    });
    console.log('Exported MP4 to:', targetMp4);

    // Clean up temp video directory
    fs.rmSync(tempVideoDir, { recursive: true, force: true });
    console.log('Video recording completed successfully!');
  } else {
    console.error('Video file was not found!');
  }
}

main().catch((err) => {
  console.error('Error recording video:', err);
  process.exit(1);
});
