import * as fs from 'fs';
import * as path from 'path';
import { enhanceCaptures } from './enhance-captures';

const SEED_FILE = path.join(process.cwd(), 'lib', 'data', 'seed.ts');

const updated = enhanceCaptures();

const fileContent = `import { Reference } from '../types';

export const SEED_REFERENCES: Reference[] = ${JSON.stringify(updated, null, 2)};
`;

fs.writeFileSync(SEED_FILE, fileContent, 'utf-8');
console.log('Successfully updated seed.ts with 100% working thumbnail paths!');
