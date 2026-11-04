import { Reference } from '../types';
import { SEED_REFERENCES } from './seed';
import { POSTER_REFERENCES, getAllPosterTags } from './posters';
import { FURNITURE_REFERENCES, getAllFurnitureTags } from './furniture';
import { FASHION_REFERENCES, getAllFashionTags } from './fashion';
import { supabase, isSupabaseConfigured } from '../supabase/client';

export { getAllPosterTags, getAllFurnitureTags, getAllFashionTags };

export const WEB_MACRO_CATEGORIES = [
  '인터랙티브·3D',
  '스튜디오·브랜딩',
  '타이포·출판',
  '아트·오브제·공간',
  '패션·매거진',
  '아카이브·툴',
] as const;

export type WebMacroCategory = typeof WEB_MACRO_CATEGORIES[number];

const CATEGORY_TO_MACRO: Record<string, WebMacroCategory> = {
  'Interactive Web': '인터랙티브·3D',
  'Experimental Web': '인터랙티브·3D',
  'Motion & 3D Studio': '인터랙티브·3D',
  'Graphic Design Studio': '스튜디오·브랜딩',
  'Brand Identity': '스튜디오·브랜딩',
  'Typography': '타이포·출판',
  'Editorial & Print': '타이포·출판',
  'Media Art & Gallery': '아트·오브제·공간',
  'Object & Art Toy': '아트·오브제·공간',
  'Spatial & Exhibition': '아트·오브제·공간',
  'Illustration & Artist': '아트·오브제·공간',
  'Fashion & Culture': '패션·매거진',
  'Magazine & Blog': '패션·매거진',
  'Archive & Curation': '아카이브·툴',
  'Resource & Tool': '아카이브·툴',
  'Product & Tech UI': '아카이브·툴',
};

function ensureMacroTag(category: string, tags: string[] = []): string[] {
  const macro = CATEGORY_TO_MACRO[category];
  if (!macro) return tags;
  if (tags.includes(macro)) return tags;
  return [macro, ...tags];
}

export async function getWebReferences(): Promise<Reference[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('references').select('*');
      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          id: item.id,
          title: item.title,
          url: item.url,
          category: item.category,
          tags: ensureMacroTag(item.category, item.tags || []),
          shortDesc: item.short_desc || item.title,
          anatomy: item.anatomy,
          principle: item.principle,
          imageUrl: item.image_url,
          videoUrl: item.video_url || `/videos/${item.id}.webm`,
          capturedAt: item.created_at,
          majorCategory: 'WEB' as const,
          aspectRatio: 'landscape' as const,
        }));
      }
    } catch (err) {
      console.warn('Supabase query failed, using local seed data:', err);
    }
  }

  // Fallback to seed references with default videoUrl mapping
  return SEED_REFERENCES.map((ref) => ({
    ...ref,
    tags: ensureMacroTag(ref.category, ref.tags || []),
    majorCategory: 'WEB' as const,
    aspectRatio: 'landscape' as const,
    videoUrl: ref.videoUrl || `/videos/${ref.id}.webm`,
  }));
}

export async function getPosterReferences(): Promise<Reference[]> {
  return POSTER_REFERENCES;
}

export async function getFurnitureReferences(): Promise<Reference[]> {
  return FURNITURE_REFERENCES;
}

export async function getFashionReferences(): Promise<Reference[]> {
  return FASHION_REFERENCES;
}

export async function getReferences(): Promise<Reference[]> {
  const [web, posters, furniture, fashion] = await Promise.all([
    getWebReferences(),
    getPosterReferences(),
    getFurnitureReferences(),
    getFashionReferences(),
  ]);
  return [...web, ...posters, ...furniture, ...fashion];
}

export async function getReferenceById(id: string): Promise<Reference | null> {
  const references = await getReferences();
  return references.find((r) => r.id === id) || null;
}

export function getAllTags(references: Reference[]): string[] {
  const presentMacros = new Set<string>();
  references.forEach((ref) => {
    ref.tags.forEach((tag) => {
      if ((WEB_MACRO_CATEGORIES as readonly string[]).includes(tag)) {
        presentMacros.add(tag);
      }
    });
  });

  const orderedTags = WEB_MACRO_CATEGORIES.filter((tag) => presentMacros.has(tag));
  return ['전체', ...orderedTags];
}

