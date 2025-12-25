import Image from "next/image";
import Link from "next/link";
import { ImageWithRelations } from "@/types/gallery";
import { getPhotoPath } from "@/lib/gallery-utils";

interface Props {
  image: ImageWithRelations;
  showCategory?: boolean;
}

export default function PhotoCard({ image, showCategory = false }: Props) {
  return (
    <Link
      href={getPhotoPath(image)}
      scroll={false}
      className="group relative aspect-square overflow-hidden rounded-lg bg-zinc-900 block"
      aria-label={`사진 보기: ${image.title}`}
    >
      <figure className="relative w-full h-full">
        <Image
          src={image.thumbnailUrl || image.imageUrl}
          alt={image.description || image.title}
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Hover overlay */}
        <figcaption className="absolute inset-0 bg-black/0 transition-colors duration-200">
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
            {showCategory && (
              <p className="text-zinc-300 text-xs mt-1">
                {image.category.name}
              </p>
            )}
          </div>
        </figcaption>
      </figure>
    </Link>
  );
}
