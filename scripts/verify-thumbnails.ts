import * as fs from 'fs';
import * as path from 'path';
import { SEED_REFERENCES } from '../lib/data/seed';

const CAPTURE_DIR = path.join(process.cwd(), 'public', 'captures');

export function checkAndFixImages() {
  const missing: string[] = [];

  const updatedSeed = SEED_REFERENCES.map((ref) => {
    const pngPath = path.join(CAPTURE_DIR, `${ref.id}.png`);
    const svgPath = path.join(CAPTURE_DIR, `${ref.id}.svg`);

    let finalPath = ref.imageUrl;

    if (fs.existsSync(pngPath)) {
      finalPath = `/captures/${ref.id}.png`;
    } else if (fs.existsSync(svgPath)) {
      finalPath = `/captures/${ref.id}.svg`;
    } else {
      missing.push(ref.id);
      // create fallback SVG
      const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
        <rect width="1200" height="800" fill="#111111"/>
        <text x="100" y="400" font-family="-apple-system, sans-serif" font-weight="700" font-size="48" fill="#ffffff">${ref.title}</text>
      </svg>`;
      fs.writeFileSync(svgPath, fallbackSvg, 'utf-8');
      finalPath = `/captures/${ref.id}.svg`;
    }

    return { ...ref, imageUrl: finalPath };
  });

  console.log('Checked references. Missing PNGs fixed with SVG:', missing);
  return updatedSeed;
}

if (require.main === module) {
  checkAndFixImages();
}
