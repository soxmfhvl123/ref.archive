import {
  getWebReferences,
  getPosterReferences,
  getFurnitureReferences,
  getFashionReferences,
  getAllTags,
  getAllPosterTags,
  getAllFurnitureTags,
  getAllFashionTags,
} from '@/lib/data/references';
import ArchiveApp from '@/components/ArchiveApp';

export default async function HomePage() {
  const [webReferences, posterReferences, furnitureReferences, fashionReferences] = await Promise.all([
    getWebReferences(),
    getPosterReferences(),
    getFurnitureReferences(),
    getFashionReferences(),
  ]);
  const webTags = getAllTags(webReferences);
  const posterTags = getAllPosterTags(posterReferences);
  const furnitureTags = getAllFurnitureTags(furnitureReferences);
  const fashionTags = getAllFashionTags(fashionReferences);

  return (
    <ArchiveApp
      initialWebReferences={webReferences}
      initialPosterReferences={posterReferences}
      initialFurnitureReferences={furnitureReferences}
      initialFashionReferences={fashionReferences}
      initialTags={webTags}
      initialPosterTags={posterTags}
      initialFurnitureTags={furnitureTags}
      initialFashionTags={fashionTags}
    />
  );
}
