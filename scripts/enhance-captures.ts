import * as fs from 'fs';
import * as path from 'path';
import { SEED_REFERENCES } from '../lib/data/seed';

const CAPTURE_DIR = path.join(process.cwd(), 'public', 'captures');

const RICH_GRAPHICS: Record<string, { bg: string; text: string; sub: string; accent: string }> = {
  'bruno-simon': { bg: '#181825', text: '#F5E0DC', sub: '#CBA6F7', accent: '#F38BA8' },
  'igloo-inc': { bg: '#0B0F19', text: '#38BDF8', sub: '#818CF8', accent: '#0284C7' },
  'messenger-abeto': { bg: '#0F172A', text: '#38BDF8', sub: '#94A3B8', accent: '#0284C7' },
  'lusion-co': { bg: '#050505', text: '#FAFAFA', sub: '#71717A', accent: '#27272A' },
  'activetheory-net': { bg: '#09090B', text: '#FAFAFA', sub: '#A1A1AA', accent: '#3F3F46' },
  'neal-fun': { bg: '#FEF08A', text: '#000000', sub: '#854D0E', accent: '#CA8A04' },
  'poolsuite-net': { bg: '#FFFBEB', text: '#D97706', sub: '#B45309', accent: '#F59E0B' },
  'patatap-com': { bg: '#EF4444', text: '#FFFFFF', sub: '#FEE2E2', accent: '#991B1B' },
  'locomotive-ca': { bg: '#18181B', text: '#FAFAFA', sub: '#A1A1AA', accent: '#3F3F46' },
  'darkroom-engineering': { bg: '#050505', text: '#22C55E', sub: '#15803D', accent: '#166534' },
  'pentagram-com': { bg: '#000000', text: '#FFFFFF', sub: '#D4D4D4', accent: '#404040' },
  'jetset-nl': { bg: '#FFFFFF', text: '#000000', sub: '#525252', accent: '#E5E5E5' },
  'wearecollins-com': { bg: '#3B0764', text: '#F5F3FF', sub: '#DDD6FE', accent: '#7C3AED' },
  'studiodumbar-com': { bg: '#1D4ED8', text: '#EFF6FF', sub: '#BFDBFE', accent: '#1E40AF' },
  'studiofeixen-ch': { bg: '#DB2777', text: '#FDF2F8', sub: '#FBCFE8', accent: '#9D174D' },
  'ok-rm-co-uk': { bg: '#F5F5F4', text: '#1C1917', sub: '#78716C', accent: '#E7E5E4' },
  'wearemucho-com': { bg: '#059669', text: '#ECFDF5', sub: '#A7F3D0', accent: '#047857' },
  'heystudio-es': { bg: '#EA580C', text: '#FFF7ED', sub: '#FFEDD5', accent: '#C2410C' },
  'koto-com': { bg: '#E11D48', text: '#FFF1F2', sub: '#FFE4E6', accent: '#BE123C' },
  'everyday-practice-com': { bg: '#0F172A', text: '#F8FAFC', sub: '#94A3B8', accent: '#334155' },
  'paperplanes': { bg: '#0284C7', text: '#F0F9FF', sub: '#BAE6FD', accent: '#0369A1' },
  'resn-co-nz': { bg: '#4C1D95', text: '#F5F3FF', sub: '#DDD6FE', accent: '#6D28D9' },
  'windows93': { bg: '#047857', text: '#ECFDF5', sub: '#A7F3D0', accent: '#065F46' },
  'pointerpointer': { bg: '#431407', text: '#FFEDD5', sub: '#FED7AA', accent: '#9A3412' },
  'dogstudio': { bg: '#881337', text: '#FFF1F2', sub: '#FFE4E6', accent: '#9F1239' },
  'obys-agency': { bg: '#172554', text: '#EFF6FF', sub: '#BFDBFE', accent: '#1E3A8A' },
  'immersive-garden': { bg: '#14532D', text: '#F0FDF4', sub: '#BBF7D0', accent: '#166534' },
};

function generateSvgGraphic(id: string, title: string, category: string, tags: string[]) {
  const scheme = RICH_GRAPHICS[id] || { bg: '#111111', text: '#FFFFFF', sub: '#888888', accent: '#333333' };

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750">
  <rect width="1200" height="750" fill="${scheme.bg}"/>
  <rect x="40" y="40" width="1120" height="670" fill="none" stroke="${scheme.accent}" stroke-width="2" opacity="0.5"/>
  <circle cx="80" cy="80" r="8" fill="${scheme.text}" opacity="0.4"/>
  <circle cx="104" cy="80" r="8" fill="${scheme.text}" opacity="0.4"/>
  <circle cx="128" cy="80" r="8" fill="${scheme.text}" opacity="0.4"/>
  <text x="80" y="340" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="56" fill="${scheme.text}">${title}</text>
  <text x="80" y="400" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="400" font-size="26" fill="${scheme.sub}">${category} · ${tags.join(' / ')}</text>
  <line x1="80" y1="450" x2="380" y2="450" stroke="${scheme.text}" stroke-width="4"/>
  <text x="80" y="650" font-family="monospace" font-size="18" fill="${scheme.sub}">ref. archive capture</text>
</svg>`;
}

export function enhanceCaptures() {
  const updatedSeed = SEED_REFERENCES.map((item) => {
    const pngPath = path.join(CAPTURE_DIR, `${item.id}.png`);
    const svgPath = path.join(CAPTURE_DIR, `${item.id}.svg`);

    let useSvg = false;

    if (fs.existsSync(pngPath)) {
      const stats = fs.statSync(pngPath);
      // If PNG is smaller than 12KB, it's likely a blank/black WebGL loading screen
      if (stats.size < 12000) {
        console.log(`PNG for ${item.id} is too small (${stats.size} bytes). Using SVG artwork fallback.`);
        useSvg = true;
      }
    } else {
      useSvg = true;
    }

    if (useSvg) {
      const svgContent = generateSvgGraphic(item.id, item.title, item.category, item.tags);
      fs.writeFileSync(svgPath, svgContent, 'utf-8');
      return { ...item, imageUrl: `/captures/${item.id}.svg` };
    }

    return { ...item, imageUrl: `/captures/${item.id}.png` };
  });

  return updatedSeed;
}

if (require.main === module) {
  enhanceCaptures();
}
