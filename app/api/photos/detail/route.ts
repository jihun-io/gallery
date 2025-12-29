import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sortByCapture, formatTimestamp } from "@/lib/gallery-utils";
import { PhotoDetailResponse, ThumbnailImage } from "@/types/gallery";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categorySlug = searchParams.get("categorySlug");
    const timestamp = searchParams.get("timestamp");
    const includeAll = searchParams.get("includeAll") === "true";

    if (!categorySlug || !timestamp) {
      return NextResponse.json(
        { error: "categorySlug and timestamp are required" },
        { status: 400 },
      );
    }

    const decodedSlug = decodeURIComponent(categorySlug);

    // Find the image ID by category slug and timestamp
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
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
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
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
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
        title: true,
        description: true,
        category: {
          select: {
            slug: true,
            name: true,
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
              timestamp: formatTimestamp(
                new Date(sortedImages[currentIndex - 1].captureDate),
              ),
            }
          : null,
      next:
        currentIndex < sortedImages.length - 1
          ? {
              categorySlug: sortedImages[currentIndex + 1].category.slug,
              timestamp: formatTimestamp(
                new Date(sortedImages[currentIndex + 1].captureDate),
              ),
            }
          : null,
    };

    const response: PhotoDetailResponse = {
      image,
      adjacentIds,
    };

    // Include all images only on initial load
    if (includeAll) {
      // 각 카테고리별 인덱스 계산 (DESC 순서이므로 최신이 1번)
      const categoryIndexMap = new Map<string, number>();
      const allImages: ThumbnailImage[] = sortedImages.map((img) => {
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
      response.allImages = allImages;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching photo detail:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
