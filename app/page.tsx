import { getReferences, getAllTags } from '@/lib/data/references';
import ArchiveApp from '@/components/ArchiveApp';

export const metadata = {
  title: 'ref. archive',
  description: '아카이브는 침묵하고, 레퍼런스만 말하게 합니다.',
};

export default async function HomePage() {
  const references = await getReferences();
  const tags = getAllTags(references);

  return <ArchiveApp initialReferences={references} initialTags={tags} />;
}
