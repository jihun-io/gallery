"use client";

import { ImageWithRelations } from "@/types/gallery";
import ExifDisplay from "./ExifDisplay";

interface Props {
  image?: ImageWithRelations | null;
}

export default function PhotoDetail({ image }: Props) {
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
              )}
            </figure>
          </section>

          {/* EXIF Info */}
          <aside className="lg:col-span-1" aria-label="사진 정보">
            {image ? (
              <ExifDisplay image={image} />
            ) : (
              <article className="bg-zinc-900 rounded-lg p-6 space-y-4">
                <section className="flex justify-between border-b border-zinc-700 pb-3 gap-x-8">
                  <div className="h-5 bg-zinc-800 rounded animate-pulse w-20" />
                  <div className="h-5 bg-zinc-800 rounded animate-pulse w-32" />
                </section>
                <section className="flex justify-between border-b border-zinc-700 pb-3 gap-x-8">
                  <div className="h-5 bg-zinc-800 rounded animate-pulse w-20" />
                  <div className="h-5 bg-zinc-800 rounded animate-pulse w-48" />
                </section>
                <section className="border-zinc-700">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-4 h-4 bg-zinc-800 rounded animate-pulse" />
                    <div className="h-5 bg-zinc-800 rounded animate-pulse w-16" />
                  </div>
                  <div className="h-5 bg-zinc-800 rounded animate-pulse w-48 mb-3" />
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
            )}
          </aside>
        </div>
      </article>
    </div>
  );
}
