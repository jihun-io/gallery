import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { sortByCapture, formatTimestamp } from '@/lib/gallery-utils';
import PhotoDetail from '../../../components/PhotoDetail';

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

  return (
    <PhotoDetail
      image={image}
      adjacentIds={adjacentIds}
      allImages={sortedImages.map((img) => ({
        id: img.id,
        categorySlug: img.category.slug,
        timestamp: formatTimestamp(new Date(img.captureDate)),
        thumbnailUrl: img.thumbnailUrl,
        imageUrl: img.imageUrl,
      }))}
    />
  );
}
