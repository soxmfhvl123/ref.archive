import * as fs from 'fs';
import * as path from 'path';

const rawData = JSON.parse(fs.readFileSync('./scratch_clean_candidates.json', 'utf-8'));

// Filter out non-content utilities
const IGNORE_PATTERNS = [
  'account.squarespace.com', 'myworkdayjobs.com', 'chatgpt.com', 'behance.net/search',
  'wcostream.com', 'blog.naver.com', 'reader.exacteditions.com', 'designshack.net',
  'swag.com', 'vimeo.com/search'
];

const cleaned = rawData.filter((item: any) => {
  return !IGNORE_PATTERNS.some((pattern) => item.url.includes(pattern));
});

console.log(`Final High-Quality Design Candidates: ${cleaned.length}`);

fs.writeFileSync('./scratch_final_candidates.json', JSON.stringify(cleaned, null, 2), 'utf-8');
