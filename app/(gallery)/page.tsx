import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { sortByCapture } from '@/lib/gallery-utils';
import PhotoGrid from './components/PhotoGrid';

// ISR: 10분마다 자동 재생성
export const revalidate = 600;

const getImages = unstable_cache(
  async () => {
    return await prisma.image.findMany({
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    });
  },
  ['gallery-images'],
  { revalidate: 600, tags: ['images'] }
);

export default async function GalleryPage() {
  const images = await getImages();
  const sortedImages = sortByCapture(images);

  return (
    <main className="container mx-auto px-4 py-8">
      <PhotoGrid images={sortedImages} showCategory />
    </main>
  );
}
