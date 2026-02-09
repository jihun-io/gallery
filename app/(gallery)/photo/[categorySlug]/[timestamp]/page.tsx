import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { sortByCapture, formatTimestamp } from "@/lib/gallery-utils";
import PhotoDetail from "../../../components/PhotoDetail";
import ThumbnailStrip from "../../../components/ThumbnailStrip";

// ISR: 10분마다 자동 재생성
export const revalidate = 600;

const getPhotoDetailData = unstable_cache(
  async (categorySlug: string, timestamp: string) => {
    // Find the image ID by category slug and timestamp
    const imagesInCategory = await prisma.image.findMany({
      where: {
        category: {
          slug: categorySlug,
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
      return null;
    }

    // Get the full image data with metadata
    const image = await prisma.image.findUnique({
      where: { id: imageId },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    });

    if (!image) {
      return null;
    }

    // Get all images for navigation
    const allImagesGlobal = await prisma.image.findMany({
      select: {
        id: true,
        captureDate: true,
        thumbnailUrl: true,
        imageUrl: true,
        webpThumbnailUrl: true,
        webpImageUrl: true,
        category: {
          select: {
            slug: true,
            name: true,
          },
        },
        title: true,
        description: true,
      },
    });

    return { image, allImagesGlobal };
  },
  ["photo-detail"],
  { revalidate: 600, tags: ["images"] },
);

export default async function PhotoDetailPage({
  params,
}: {
  params: Promise<{ categorySlug: string; timestamp: string }>;
}) {
  const { categorySlug, timestamp } = await params;
  const decodedSlug = decodeURIComponent(categorySlug);

  const data = await getPhotoDetailData(decodedSlug, timestamp);

  if (!data) {
    notFound();
  }

  const { image, allImagesGlobal } = data;

  const sortedImages = sortByCapture(allImagesGlobal);

  // 각 카테고리별 인덱스 계산 (DESC 순서이므로 최신이 1번)
  const categoryIndexMap = new Map<string, number>();
  const allImages = sortedImages.map((img) => {
    const categorySlug = img.category.slug;
    const currentIndex = categoryIndexMap.get(categorySlug) || 0;
    categoryIndexMap.set(categorySlug, currentIndex + 1);

    return {
      id: img.id,
      categorySlug: img.category.slug,
      timestamp: formatTimestamp(new Date(img.captureDate)),
      thumbnailUrl: img.thumbnailUrl,
      imageUrl: img.imageUrl,
      webpThumbnailUrl: img.webpThumbnailUrl,
      webpImageUrl: img.webpImageUrl,
      category: {
        name: img.category.name,
      },
      index: currentIndex,
      title: img.title,
      description: img.description,
    };
  });

  return (
    <main className="h-full">
      {/* PhotoDetail - 이미지와 EXIF 정보 */}
      <PhotoDetail image={image} isDetailPage={true} />

      {/* ThumbnailStrip - 썸네일 내비게이션 (하단 고정) */}
      <nav
        aria-label="사진 탐색"
        className="fixed bottom-0 left-0 right-0 z-20"
      >
        <ThumbnailStrip images={allImages} currentId={image.id} />
      </nav>
    </main>
  );
}
