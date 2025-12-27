import Link from "next/link";
import { Category, Image as PrismaImage } from "@prisma/client";

interface CategoryWithImages extends Category {
  images: PrismaImage[];
  _count: {
    images: number;
  };
}

interface Props {
  categories: CategoryWithImages[];
}

export default function CategoryGrid({ categories }: Props) {
  if (categories.length === 0) {
    return (
      <section
        className="flex items-center justify-center min-h-[50vh]"
        aria-label="빈 카테고리"
      >
        <p className="text-zinc-400 text-lg">No categories yet</p>
      </section>
    );
  }

  return (
    <section
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      aria-label="카테고리 그리드"
    >
      {categories.map((category) => (
        <article key={category.id}>
          <Link
            href={`/categories/${category.slug}`}
            className="group relative aspect-square overflow-hidden rounded-lg bg-zinc-900 cursor-pointer block"
            aria-label={`${category.name} 카테고리 보기`}
          >
            {/* Category title overlay */}
            <header className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
              <h2 className="text-lg font-bold text-white transition-colors">
                {category.name}
              </h2>
              <p className="text-zinc-400 text-xs mt-1">
                {category._count.images}개의 사진
              </p>
            </header>

            {/* 2x2 grid of preview images */}
            <figure className="grid grid-cols-2 grid-rows-2 gap-0.5 h-full">
              {category.images.slice(0, 4).map((image) => (
                <div
                  key={image.id}
                  className="relative bg-zinc-800 overflow-hidden"
                >
                  <img
                    src={image.thumbnailUrl || image.imageUrl}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              ))}

              {/* Show placeholder for missing images */}
              {Array.from({
                length: Math.max(0, 4 - category.images.length),
              }).map((_, idx) => (
                <div
                  key={`placeholder-${idx}`}
                  className="bg-zinc-900/50 flex items-center justify-center"
                ></div>
              ))}
            </figure>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
          </Link>
        </article>
      ))}
    </section>
  );
}
