import {
  getWebReferences,
  getPosterReferences,
  getFurnitureReferences,
  getAllTags,
  getAllPosterTags,
  getAllFurnitureTags,
} from '@/lib/data/references';
import ArchiveApp from '@/components/ArchiveApp';

export default async function HomePage() {
  const [webReferences, posterReferences, furnitureReferences] = await Promise.all([
    getWebReferences(),
    getPosterReferences(),
    getFurnitureReferences(),
  ]);
  const webTags = getAllTags(webReferences);
  const posterTags = getAllPosterTags(posterReferences);
  const furnitureTags = getAllFurnitureTags(furnitureReferences);

  return (
    <ArchiveApp
      initialWebReferences={webReferences}
      initialPosterReferences={posterReferences}
      initialFurnitureReferences={furnitureReferences}
      initialTags={webTags}
      initialPosterTags={posterTags}
      initialFurnitureTags={furnitureTags}
    />
  );
}
