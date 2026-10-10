import { getReferences, getAllTags } from '@/lib/data/references';
import ArchiveApp from '@/components/ArchiveApp';


export default async function HomePage() {
  const references = await getReferences();
  const tags = getAllTags(references);

  return <ArchiveApp initialReferences={references} initialTags={tags} />;
}
