import ThumbnailStrip from "./ThumbnailStrip";
import { ThumbnailImage } from "@/types/gallery";

interface Props {
  allImages?: ThumbnailImage[] | null;
  currentId?: string | null;
}

export default function PhotoDetailSkeleton({ allImages, currentId }: Props) {
  return (
    <main className="h-full grid grid-rows-[1fr_auto]">
      {/* Main content area */}
      <div className="overflow-y-auto flex flex-col">
        <article className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-8">
            {/* Image skeleton - matching PhotoDetail */}
            <section className="space-y-4" aria-label="사진 로드 중...">
              <figure className="relative w-full aspect-4/3 h-[calc(100vh-112px-64px-6rem)] bg-zinc-900 rounded-lg overflow-hidden">
                <div className="w-full h-full bg-zinc-800 animate-pulse flex items-center justify-center">
                  <div className="text-zinc-600">
                    <svg
                      className="w-16 h-16 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                </div>
              </figure>
            </section>

            {/* EXIF Info skeleton - matching ExifDisplay */}
            <aside className="lg:col-span-1" aria-label="사진 정보 로드 중...">
              <article className="bg-zinc-900 rounded-lg p-6 space-y-4">
                {/* Category section */}
                <section className="flex justify-between border-b border-zinc-700 pb-3 gap-x-8">
                  <div className="h-5 bg-zinc-800 rounded animate-pulse w-20" />
                  <div className="h-5 bg-zinc-800 rounded animate-pulse w-32" />
                </section>

                {/* Capture date section */}
                <section className="flex justify-between border-b border-zinc-700 pb-3 gap-x-8">
                  <div className="h-5 bg-zinc-800 rounded animate-pulse w-20" />
                  <div className="h-5 bg-zinc-800 rounded animate-pulse w-48" />
                </section>

                {/* Camera section */}
                <section className="border-zinc-700">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-4 h-4 bg-zinc-800 rounded animate-pulse" />
                    <div className="h-5 bg-zinc-800 rounded animate-pulse w-16" />
                  </div>
                  <div className="h-5 bg-zinc-800 rounded animate-pulse w-48 mb-3" />

                  {/* Settings grid */}
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex flex-col">
                        <div className="h-4 bg-zinc-800 rounded animate-pulse w-16 mb-1" />
                        <div className="h-5 bg-zinc-800 rounded animate-pulse w-20" />
                      </div>
                    ))}
                  </div>
                </section>
              </article>
            </aside>
          </div>
        </article>
      </div>

      {/* Thumbnail strip - use real component if available to preserve scroll position */}
      {allImages && currentId ? (
        <ThumbnailStrip images={allImages} currentId={currentId} />
      ) : (
        <nav
          aria-label="사진 탐색 로드 중..."
          className="bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-800"
        >
          <div className="overflow-x-auto">
            <div className="flex gap-2 p-4 min-w-max">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="shrink-0 w-20 h-20 bg-zinc-800 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </nav>
      )}
    </main>
  );
}
