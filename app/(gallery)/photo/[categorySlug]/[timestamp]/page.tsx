import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { sortByCapture, formatTimestamp } from '@/lib/gallery-utils';
import PhotoDetail from '../../../components/PhotoDetail';
import ThumbnailStrip from '../../../components/ThumbnailStrip';

export default async function PhotoDetailPage({
  params,
}: {
  params: Promise<{ categorySlug: string; timestamp: string }>;
}) {
  const { categorySlug, timestamp } = await params;
  const decodedSlug = decodeURIComponent(categorySlug);

  // Find the image ID by category slug and timestamp (without metadata for performance)
  const imagesInCategory = await prisma.image.findMany({
    where: {
      category: {
        slug: decodedSlug,
      },
    },
    select: {
      id: true,
      captureDate: true,
    },
  });

  const imageId = imagesInCategory.find((img) => {
    return formatTimestamp(new Date(img.captureDate)) === timestamp;
  })?.id;

  if (!imageId) {
    notFound();
  }

  // Get the full image data with metadata only for the current image
  const image = await prisma.image.findUnique({
    where: { id: imageId },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });

  if (!image) {
    notFound();
  }

  // Get all images for navigation (without metadata for performance)
  const allImagesGlobal = await prisma.image.findMany({
    select: {
      id: true,
      captureDate: true,
      thumbnailUrl: true,
      imageUrl: true,
      category: {
        select: {
          slug: true,
        },
      },
    },
  });

  const sortedImages = sortByCapture(allImagesGlobal);
  const currentIndex = sortedImages.findIndex((img) => img.id === image.id);

  const adjacentIds = {
    prev:
      currentIndex > 0
        ? {
            categorySlug: sortedImages[currentIndex - 1].category.slug,
            timestamp: formatTimestamp(new Date(sortedImages[currentIndex - 1].captureDate)),
          }
        : null,
    next:
      currentIndex < sortedImages.length - 1
        ? {
            categorySlug: sortedImages[currentIndex + 1].category.slug,
            timestamp: formatTimestamp(new Date(sortedImages[currentIndex + 1].captureDate)),
          }
        : null,
  };

  const allImages = sortedImages.map((img) => ({
    id: img.id,
    categorySlug: img.category.slug,
    timestamp: formatTimestamp(new Date(img.captureDate)),
    thumbnailUrl: img.thumbnailUrl,
    imageUrl: img.imageUrl,
  }));

  return (
    <main className="h-full">
      {/* PhotoDetail - 이미지와 EXIF 정보 */}
      <PhotoDetail image={image} adjacentIds={adjacentIds} />

      {/* ThumbnailStrip - 썸네일 내비게이션 (하단 고정) */}
      <nav aria-label="사진 탐색" className="fixed bottom-0 left-0 right-0 z-20">
        <ThumbnailStrip images={allImages} currentId={image.id} />
      </nav>
    </main>
  );
}
