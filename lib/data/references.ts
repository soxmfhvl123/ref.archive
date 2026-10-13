import { Reference } from '../types';
import { SEED_REFERENCES } from './seed';
import { POSTER_REFERENCES, getAllPosterTags } from './posters';
import { FURNITURE_REFERENCES, getAllFurnitureTags } from './furniture';
import { supabase, isSupabaseConfigured } from '../supabase/client';

export { getAllPosterTags, getAllFurnitureTags };

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
          tags: item.tags || [],
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

export async function getReferences(): Promise<Reference[]> {
  const [web, posters, furniture] = await Promise.all([
    getWebReferences(),
    getPosterReferences(),
    getFurnitureReferences(),
  ]);
  return [...web, ...posters, ...furniture];
}

export async function getReferenceById(id: string): Promise<Reference | null> {
  const references = await getReferences();
  return references.find((r) => r.id === id) || null;
}

export function getAllTags(references: Reference[]): string[] {
  const tagCount = new Map<string, number>();
  references.forEach((ref) => {
    ref.tags.forEach((tag) => {
      tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
    });
  });

  const sortedTags = Array.from(tagCount.keys()).sort((a, b) => {
    return (tagCount.get(b) || 0) - (tagCount.get(a) || 0);
  });

  return ['전체', ...sortedTags];
}

