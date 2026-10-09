import { NextResponse } from 'next/server';
import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

export async function POST(request: Request) {
  try {
    const { url, id } = await request.json();

    if (!url || !id) {
      return NextResponse.json({ error: 'Missing url or id parameter' }, { status: 400 });
    }

    const captureDir = path.join(process.cwd(), 'public', 'captures');
    if (!fs.existsSync(captureDir)) {
      fs.mkdirSync(captureDir, { recursive: true });
    }

    const filename = `${id}.png`;
    const outputPath = path.join(captureDir, filename);

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: outputPath });
    await browser.close();

    return NextResponse.json({
      success: true,
      imageUrl: `/captures/${filename}`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Capture failed' }, { status: 500 });
  }
}
