"use client";

import { ImageWithRelations, AdjacentImages } from "@/types/gallery";
import ExifDisplay from "./ExifDisplay";
import PhotoNavigation from "./PhotoNavigation";
import ThumbnailStrip from "./ThumbnailStrip";

interface ThumbnailImage {
  id: string;
  categorySlug: string;
  timestamp: string;
  thumbnailUrl: string | null;
  imageUrl: string;
}

interface Props {
  image: ImageWithRelations;
  adjacentIds: AdjacentImages;
  allImages: ThumbnailImage[];
}

export default function PhotoDetail({
  image,
  adjacentIds,
  allImages,
}: Props) {
  return (
    <main className="h-full grid grid-rows-[1fr_auto]">
      {/* Main content area */}
      <div className="overflow-y-auto flex flex-col">
        {/* Navigation chevrons */}
        <PhotoNavigation
          prev={adjacentIds.prev}
          next={adjacentIds.next}
        />

        <article className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-8">
            {/* Image */}
            <section className="space-y-4" aria-label="사진 표시">
              <figure className="relative w-full aspect-[4/3] h-[calc(100vh-300px)] bg-zinc-900 rounded-lg overflow-hidden">
                <img
                  src={image.imageUrl}
                  alt={image.description || image.title}
                  className="w-full h-full object-contain"
                />
              </figure>
            </section>

            {/* EXIF Info */}
            <aside className="lg:col-span-1" aria-label="사진 정보">
              <ExifDisplay image={image} />
            </aside>
          </div>
        </article>
      </div>

      {/* Thumbnail strip at bottom */}
      <nav aria-label="사진 탐색" className="max-w-full overflow-hidden">
        <ThumbnailStrip
          images={allImages}
          currentId={image.id}
        />
      </nav>
    </main>
  );
}
