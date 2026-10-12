// Dynamic Key Color Extraction & Curated Brand Palette System
import { Reference } from './types';

// Curated brand key colors for iconic reference sites
const CURATED_BRAND_COLORS: Record<string, [string, string]> = {
  'bruno-simon': ['#ff5e3a', '#ff9900'],
  'poolsuite-net': ['#00d2ff', '#ff6b4a'],
  'activetheory-net': ['#00f5d4', '#7b2cbf'],
  'lusion-co': ['#ff007f', '#00f0ff'],
  'gentle-monster': ['#ff2a00', '#111111'],
  'adult-swim-music': ['#00ff87', '#ff007f'],
  'david-li': ['#00d4ff', '#0047ff'],
  'paper-design': ['#f59e0b', '#ec4899'],
  'ilithya-rocks': ['#a855f7', '#ec4899'],
  'stink-studios': ['#ef4444', '#3b82f6'],
  'windows93': ['#ff00ff', '#00ffff'],
  'cameronsworld': ['#ff007f', '#00f5ff'],
  'patatap-com': ['#f43f5e', '#fbbf24'],
  'resn-co-nz': ['#ff006e', '#3a86ff'],
  'teamlab': ['#05d550', '#0072ff'],
  'monopo-london': ['#4facfe', '#00f2fe'],
  'apple-hig': ['#0071e3', '#43bfe5'],
  'raycast': ['#ff6363', '#8b5cf6'],
  'superplastic': ['#ff007f', '#facc15'],
  'linear-app': ['#5e6ad2', '#00d2be'],
  'cursor-com': ['#00c7be', '#5e6ad2'],
  'lemaire': ['#8c7355', '#2b2621'],
  'byredo': ['#d97706', '#18181b'],
  'tamburins': ['#e11d48', '#262626'],
  'kaws': ['#f43f5e', '#3b82f6'],
  'virgilabloh-com': ['#ff3300', '#222222'],
  'hypebeast': ['#dc2626', '#171717'],
  'stack-magazines': ['#f59e0b', '#dc2626'],
  'uncut': ['#6366f1', '#06b6d4'],
  'footer-design': ['#10b981', '#3b82f6'],
  'website-headlines': ['#8b5cf6', '#ec4899'],
  'maneken': ['#3b82f6', '#f59e0b'],
  'mockup-world': ['#06b6d4', '#10b981'],
};

// Base hues for each category
const CATEGORY_HUES: Record<string, [number, number]> = {
  '3D WebGL': [185, 215],
  '인터랙티브 모션': [195, 230],
  '실험적 웹': [275, 320],
  '디자인 스튜디오': [355, 25],
  '브랜드 아이덴티티': [215, 245],
  '타이포그래피': [230, 260],
  '에디토리얼 & 출판': [38, 55],
  '디자인 아카이브': [265, 295],
  '매거진 & 블로그': [340, 15],
  '모션 & 3D': [315, 345],
  '미디어 아트 & 전시': [165, 190],
  '일러스트 & 아티스트': [20, 45],
  '패션 & 컬처': [245, 275],
  '디지털 제품 & UI': [205, 235],
  '리소스 & 툴': [145, 175],
  '공간 & 전시 디자인': [30, 50],
  '오브제 & 아트토이': [45, 68],
};

// Simple string hash
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Memory cache for sampled image colors
const imageColorCache = new Map<string, [string, string]>();

/**
 * Deterministically generates a vibrant, aesthetic color pair for any reference
 */
export function getFallbackColors(ref: { id: string; category?: string; tags?: string[] }): [string, string] {
  if (CURATED_BRAND_COLORS[ref.id]) {
    return CURATED_BRAND_COLORS[ref.id];
  }

  const primaryTag = ref.tags?.[0] || ref.category || '기타';
  const hueRange = CATEGORY_HUES[primaryTag] || [200, 240];
  const hVal = hashString(ref.id);

  const span = Math.abs(hueRange[1] - hueRange[0]);
  const h1 = (hueRange[0] + (hVal % (span || 30))) % 360;
  const h2 = (h1 + 45 + (hVal % 40)) % 360;

  const color1 = `hsl(${h1}, 82%, 52%)`;
  const color2 = `hsl(${h2}, 86%, 56%)`;

  return [color1, color2];
}

/**
 * Samples the dominant colors from an image element using an offscreen 16x16 canvas
 */
export function extractColorsFromImage(imgElement: HTMLImageElement, id: string): [string, string] | null {
  if (imageColorCache.has(id)) {
    return imageColorCache.get(id)!;
  }

  try {
    if (!imgElement.naturalWidth || !imgElement.naturalHeight) {
      return null;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(imgElement, 0, 0, 16, 16);
    const data = ctx.getImageData(0, 0, 16, 16).data;

    // Collect candidates with saturation and brightness weighting
    const colorBuckets: Array<{ r: number; g: number; b: number; score: number }> = [];

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (a < 128) continue;

      // Filter near-white and near-black
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const delta = max - min;
      const brightness = (r + g + b) / 3;

      if (brightness > 235 || brightness < 20) continue;
      if (delta < 20) continue; // too gray

      const saturation = delta / max;
      const score = saturation * 2 + (brightness > 60 && brightness < 200 ? 1 : 0.5);

      colorBuckets.push({ r, g, b, score });
    }

    if (colorBuckets.length >= 2) {
      colorBuckets.sort((a, b) => b.score - a.score);
      const c1 = colorBuckets[0];
      let c2 = colorBuckets[1];

      // Pick a distinct second color
      for (let i = 2; i < colorBuckets.length; i++) {
        const candidate = colorBuckets[i];
        const dist = Math.abs(candidate.r - c1.r) + Math.abs(candidate.g - c1.g) + Math.abs(candidate.b - c1.b);
        if (dist > 80) {
          c2 = candidate;
          break;
        }
      }

      const res: [string, string] = [
        `rgb(${c1.r}, ${c1.g}, ${c1.b})`,
        `rgb(${c2.r}, ${c2.g}, ${c2.b})`,
      ];
      imageColorCache.set(id, res);
      return res;
    }
  } catch (e) {
    // Cross-origin or tainted canvas fallback
  }

  return null;
}

/**
 * Returns the key colors for a reference item
 */
export function getKeyColors(ref: Reference | null): [string, string] | null {
  if (!ref) return null;
  if (CURATED_BRAND_COLORS[ref.id]) return CURATED_BRAND_COLORS[ref.id];
  if (imageColorCache.has(ref.id)) return imageColorCache.get(ref.id)!;
  return getFallbackColors(ref);
}
