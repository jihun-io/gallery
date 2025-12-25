"use client";

import { useEffect, useRef } from "react";
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

export default function ThumbnailStrip({
  images,
  currentId,
}: Props) {
  const currentRef = useRef<HTMLAnchorElement>(null);

  const getPhotoPath = (img: ThumbnailImage) => {
    return `/photo/${img.categorySlug}/${img.timestamp}`;
  };

  useEffect(() => {
    if (currentRef.current) {
      currentRef.current.scrollIntoView({
        behavior: "instant",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentId]);

  return (
    <div className="bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-800">
      <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
