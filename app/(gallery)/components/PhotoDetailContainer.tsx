"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ImageWithRelations, AdjacentImages } from "@/types/gallery";
import PhotoDetail from "./PhotoDetail";
import PhotoDetailSkeleton from "./PhotoDetailSkeleton";
import ThumbnailStrip from "./ThumbnailStrip";

interface ThumbnailImage {
  id: string;
  categorySlug: string;
  timestamp: string;
  thumbnailUrl: string | null;
  imageUrl: string;
}

interface PhotoData {
  image: ImageWithRelations;
  adjacentIds: AdjacentImages;
  allImages?: ThumbnailImage[];
}

// 모듈 레벨 캐시 - 컴포넌트가 리마운트되어도 유지됨
let cachedAllImages: ThumbnailImage[] | null = null;
let cachedCurrentId: string = "";

export default function PhotoDetailContainer() {
  const params = useParams();
  const categorySlug = params.categorySlug as string;
  const timestamp = params.timestamp as string;

  const [photoData, setPhotoData] = useState<PhotoData | null>(null);
  // 초기값을 캐시된 값으로 설정
  const [allImages, setAllImages] = useState<ThumbnailImage[] | null>(cachedAllImages);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotoData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Include all images only on initial load (when allImages is null)
        const includeAll = allImages === null;
        const url = `/api/photos/detail?categorySlug=${encodeURIComponent(
          categorySlug
        )}&timestamp=${encodeURIComponent(timestamp)}&includeAll=${includeAll}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch photo data");
        }

        const data: PhotoData = await response.json();

        // Save allImages on first load and cache it
        if (data.allImages) {
          cachedAllImages = data.allImages;
          setAllImages(data.allImages);
        }

        setPhotoData(data);

        // 성공적으로 로드되면 currentId 캐시 업데이트
        if (data.image?.id) {
          cachedCurrentId = data.image.id;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotoData();
  }, [categorySlug, timestamp]); // Refetch when URL params change

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl font-semibold">오류가 발생했습니다</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  // 첫 로딩 (allImages가 아직 없음) - 전체 스켈레톤 표시
  if (!allImages) {
    return <PhotoDetailSkeleton />;
  }

  // allImages가 있으면 항상 레이아웃 유지 (썸네일 스트립은 항상 렌더링)
  // currentId는 캐시된 값을 유지하여 로딩 중 스크롤 위치 보존
  const currentId = photoData?.image?.id || cachedCurrentId;

  return (
    <main className="h-full grid grid-rows-[1fr_auto]">
      {/* PhotoDetail - 이미지와 EXIF 정보 */}
      <PhotoDetail
        image={photoData?.image || null}
        adjacentIds={photoData?.adjacentIds || null}
        isLoading={isLoading}
      />

      {/* ThumbnailStrip - 항상 렌더링되어 스크롤 위치 유지 */}
      <nav aria-label="사진 탐색" className="max-w-full overflow-hidden">
        <ThumbnailStrip images={allImages} currentId={currentId} />
      </nav>
    </main>
  );
}
