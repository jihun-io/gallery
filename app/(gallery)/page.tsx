import { prisma } from '@/lib/prisma';
import { sortByCapture } from '@/lib/gallery-utils';
import PhotoGrid from './components/PhotoGrid';

export default async function GalleryPage() {
  const images = await prisma.image.findMany({
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });

  const sortedImages = sortByCapture(images);

  return (
    <main className="container mx-auto px-4 py-8">
      <PhotoGrid images={sortedImages} showCategory />
    </main>
  );
}
