import { getWebReferences, getPosterReferences, getAllTags, getAllPosterTags } from '@/lib/data/references';
import ArchiveApp from '@/components/ArchiveApp';

export default async function HomePage() {
  const [webReferences, posterReferences] = await Promise.all([
    getWebReferences(),
    getPosterReferences(),
  ]);
  const webTags = getAllTags(webReferences);
  const posterTags = getAllPosterTags(posterReferences);

  return (
    <ArchiveApp
      initialWebReferences={webReferences}
      initialPosterReferences={posterReferences}
      initialTags={webTags}
      initialPosterTags={posterTags}
    />
  );
}
