"use client";

import { ImageWithRelations } from "@/types/gallery";
import ExifDisplay from "./ExifDisplay";
import {
  SkeletonImg,
  SkeletonExifDisplay,
} from "@/app/(gallery)/components/PhotoDetailSkeleton";

interface Props {
  image?: ImageWithRelations | null;
  isDetailPage?: boolean;
}

export default function PhotoDetail({ image, isDetailPage }: Props) {
  return (
    <div className="overflow-y-auto flex flex-col h-full">
      <article className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Image */}
          <section className="space-y-4" aria-label="사진 표시">
            <figure className="relative w-full aspect-4/3 h-[calc(100dvh-112px-64px-6rem)] bg-zinc-900 rounded-lg overflow-hidden">
              {image ? (
                <img
                  src={image.webpImageUrl || image.imageUrl}
                  alt={image.description || image.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <SkeletonImg />
              )}
            </figure>
          </section>

          {/* EXIF Info */}
          <aside
            className={`lg:col-span-1 ${isDetailPage ? "mb-[7rem]" : "mb-0"}`}
            aria-label="사진 정보"
          >
            {image ? <ExifDisplay image={image} /> : <SkeletonExifDisplay />}
          </aside>
        </div>
      </article>
    </div>
  );
}
