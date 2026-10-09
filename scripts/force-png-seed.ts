import * as fs from 'fs';
import * as path from 'path';
import { SEED_REFERENCES } from '../lib/data/seed';

const SEED_FILE = path.join(process.cwd(), 'lib', 'data', 'seed.ts');

const updatedSeed = SEED_REFERENCES.map((item) => ({
  ...item,
  imageUrl: `/captures/${item.id}.png`,
}));

const fileContent = `import { Reference } from '../types';

export const SEED_REFERENCES: Reference[] = ${JSON.stringify(updatedSeed, null, 2)};
`;

fs.writeFileSync(SEED_FILE, fileContent, 'utf-8');
console.log('Force updated all reference image URLs to real PNG screenshots.');
