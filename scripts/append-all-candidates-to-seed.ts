import * as fs from 'fs';
import * as path from 'path';
import { SEED_REFERENCES } from '../lib/data/seed';

const candidates = JSON.parse(fs.readFileSync('./scratch_final_candidates.json', 'utf-8'));

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/https?:\/\//, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const existingIds = new Set(SEED_REFERENCES.map((r) => r.id));

const newReferences = candidates.map((item: any) => {
  let id = slugify(item.domain || item.title);
  if (!id) id = `ref-${Math.random().toString(36).substring(2, 7)}`;
  if (existingIds.has(id)) {
    id = `${id}-bm`;
  }
  existingIds.add(id);

  const category = (item.category.includes('타이포') || item.category.includes('스튜디오') || item.category.includes('CMF'))
    ? 'Graphic Design Studio'
    : 'Interactive Web';

  const tags = [item.category.split(' & ')[0]];

  return {
    id,
    title: item.title,
    url: item.url,
    category,
    tags,
    shortDesc: item.category,
    anatomy: `${item.title} - 즐겨찾기 레퍼런스 아카이빙`,
    principle: `디자인 및 인터랙션 탐색을 위한 시각적/구조적 레퍼런스`,
    imageUrl: `/captures/${id}.png`,
    videoUrl: `/videos/${id}.webm`,
  };
});

const merged = [...SEED_REFERENCES, ...newReferences];

const seedFile = path.join(process.cwd(), 'lib', 'data', 'seed.ts');
const fileContent = `import { Reference } from '../types';

export const SEED_REFERENCES: Reference[] = ${JSON.stringify(merged, null, 2)};
`;

fs.writeFileSync(seedFile, fileContent, 'utf-8');
console.log(`Merged ${newReferences.length} new bookmark references into seed.ts! Total items: ${merged.length}`);
