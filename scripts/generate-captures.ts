import * as fs from 'fs';
import * as path from 'path';
import { SEED_REFERENCES } from '../lib/data/seed';

const CAPTURE_DIR = path.join(process.cwd(), 'public', 'captures');

// Colors for rich aesthetic placeholder generation if Playwright output is delayed
const PRESET_COLORS: Record<string, { bg: string; text: string; sub: string; accent: string }> = {
  'bruno-simon': { bg: '#1E1E2E', text: '#F5E0DC', sub: '#CBA6F7', accent: '#F38BA8' },
  'igloo-inc': { bg: '#0F172A', text: '#F8FAFC', sub: '#38BDF8', accent: '#818CF8' },
  'messenger-abeto': { bg: '#18181B', text: '#FAFAFA', sub: '#A1A1AA', accent: '#E4E4E7' },
  'lusion-co': { bg: '#050505', text: '#FFFFFF', sub: '#525252', accent: '#A3A3A3' },
  'activetheory-net': { bg: '#09090B', text: '#FAFAFA', sub: '#71717A', accent: '#27272A' },
  'neal-fun': { bg: '#FEF08A', text: '#000000', sub: '#451A03', accent: '#CA8A04' },
  'poolsuite-net': { bg: '#FDF6E3', text: '#268BD2', sub: '#B58900', accent: '#D33682' },
  'patatap-com': { bg: '#EF4444', text: '#FFFFFF', sub: '#FEE2E2', accent: '#B91C1C' },
  'locomotive-ca': { bg: '#111111', text: '#FFFFFF', sub: '#888888', accent: '#444444' },
  'darkroom-engineering': { bg: '#0A0A0A', text: '#00FF66', sub: '#00B347', accent: '#141414' },
  'pentagram-com': { bg: '#000000', text: '#FFFFFF', sub: '#CCCCCC', accent: '#333333' },
  'jetset-nl': { bg: '#FFFFFF', text: '#000000', sub: '#444444', accent: '#EEEEEE' },
  'wearecollins-com': { bg: '#4C1D95', text: '#F5F3FF', sub: '#DDD6FE', accent: '#8B5CF6' },
  'studiodumbar-com': { bg: '#2563EB', text: '#EFF6FF', sub: '#BFDBFE', accent: '#1D4ED8' },
  'studiofeixen-ch': { bg: '#EC4899', text: '#FFF1F2', sub: '#FBCFE8', accent: '#BE185D' },
  'ok-rm-co-uk': { bg: '#F5F5F4', text: '#1C1917', sub: '#78716C', accent: '#E7E5E4' },
  'wearemucho-com': { bg: '#10B981', text: '#ECFDF5', sub: '#A7F3D0', accent: '#047857' },
  'heystudio-es': { bg: '#F97316', text: '#FFF7ED', sub: '#FFEDD5', accent: '#C2410C' },
  'koto-com': { bg: '#FB7185', text: '#FFF1F2', sub: '#FFE4E6', accent: '#E11D48' },
  'everyday-practice-com': { bg: '#1E293B', text: '#F8FAFC', sub: '#94A3B8', accent: '#475569' },
};

function generateSvgContent(id: string, title: string, category: string, tags: string[]) {
  const scheme = PRESET_COLORS[id] || { bg: '#111111', text: '#FFFFFF', sub: '#AAAAAA', accent: '#333333' };

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <rect width="1200" height="800" fill="${scheme.bg}"/>
  <rect x="60" y="60" width="1080" height="680" fill="none" stroke="${scheme.accent}" stroke-width="2" opacity="0.4"/>
  <circle cx="100" cy="100" r="10" fill="${scheme.text}" opacity="0.3"/>
  <circle cx="130" cy="100" r="10" fill="${scheme.text}" opacity="0.3"/>
  <circle cx="160" cy="100" r="10" fill="${scheme.text}" opacity="0.3"/>
  <text x="100" y="360" font-family="-apple-system, sans-serif" font-weight="800" font-size="64" fill="${scheme.text}">${title}</text>
  <text x="100" y="420" font-family="-apple-system, sans-serif" font-weight="400" font-size="28" fill="${scheme.sub}">${category} · ${tags.join(' / ')}</text>
  <line x1="100" y1="470" x2="400" y2="470" stroke="${scheme.text}" stroke-width="4"/>
  <text x="100" y="680" font-family="monospace" font-size="20" fill="${scheme.sub}">ref. archive capture</text>
</svg>`;
}

export function ensureCapturesExist() {
  if (!fs.existsSync(CAPTURE_DIR)) {
    fs.mkdirSync(CAPTURE_DIR, { recursive: true });
  }

  for (const item of SEED_REFERENCES) {
    const pngPath = path.join(CAPTURE_DIR, `${item.id}.png`);
    const svgPath = path.join(CAPTURE_DIR, `${item.id}.svg`);

    // If neither PNG nor SVG exists, generate SVG fallback capture
    if (!fs.existsSync(pngPath) && !fs.existsSync(svgPath)) {
      const svg = generateSvgContent(item.id, item.title, item.category, item.tags);
      fs.writeFileSync(svgPath, svg, 'utf-8');
      console.log(`Generated SVG fallback capture for ${item.id}`);
    }
  }
}

if (require.main === module) {
  ensureCapturesExist();
}
