"use client";

import { useEffect, useLayoutEffect, useRef, memo } from "react";
import Link from "next/link";

interface ThumbnailImage {
  id: string;
  categorySlug: string;
  timestamp: string;
  thumbnailUrl: string | null;
  imageUrl: string;
}

interface Props {
  images: ThumbnailImage[];
  currentId: string;
}

// 스크롤 위치 캐시 - 컴포넌트가 리마운트되어도 유지
let cachedScrollLeft = 0;

function ThumbnailStrip({
  images,
  currentId,
}: Props) {
  const currentRef = useRef<HTMLAnchorElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isRestoringScrollRef = useRef(false);

  const getPhotoPath = (img: ThumbnailImage) => {
    return `/photo/${img.categorySlug}/${img.timestamp}`;
  };

  // 스크롤 위치 복원 (컴포넌트 마운트 시) - useLayoutEffect로 동기 실행
  useLayoutEffect(() => {
    if (containerRef.current && cachedScrollLeft > 0) {
      isRestoringScrollRef.current = true;
      containerRef.current.scrollLeft = cachedScrollLeft;
      // 복원 완료 후 플래그 해제
      requestAnimationFrame(() => {
        isRestoringScrollRef.current = false;
      });
    }
  }, []);

  // 스크롤 위치 저장 (스크롤 이벤트 발생 시)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // 스크롤 복원 중이 아닐 때만 저장
      if (!isRestoringScrollRef.current) {
        cachedScrollLeft = container.scrollLeft;
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // currentId 변경 시 항상 선택된 사진을 가운데로 스크롤
  useEffect(() => {
    if (currentRef.current) {
      currentRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentId]);

  return (
    <div className="bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-800">
      <div
        ref={containerRef}
        className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <div className="flex gap-2 p-4 min-w-max">
          {images.map((img) => (
            <Link
              key={img.id}
              href={getPhotoPath(img)}
              replace
              ref={img.id === currentId ? currentRef : null}
              className={`relative flex-shrink-0 w-20 h-20 rounded overflow-hidden transition-all ${
                img.id === currentId
                  ? "ring-2 ring-blue-500 scale-110"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img.thumbnailUrl || img.imageUrl}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(ThumbnailStrip);
