import { ImageWithRelations } from '@/types/gallery';
import PhotoCard from './PhotoCard';

interface Props {
  images: ImageWithRelations[];
  showCategory?: boolean;
}

export default function PhotoGrid({ images, showCategory = false }: Props) {
  if (images.length === 0) {
    return (
      <section className="flex items-center justify-center min-h-[50vh]" aria-label="빈 갤러리">
        <p className="text-zinc-400 text-lg">No photos yet</p>
      </section>
    );
  }

  return (
    <section
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      aria-label="사진 갤러리 그리드"
    >
      {images.map((image) => (
        <PhotoCard
          key={image.id}
          image={image}
          showCategory={showCategory}
        />
      ))}
    </section>
  );
}
