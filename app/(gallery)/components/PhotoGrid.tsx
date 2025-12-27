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

  // 각 카테고리별 총 사진 개수 계산
  const categoryCountMap = new Map<string, number>();
  images.forEach((image) => {
    const categoryId = image.category.id;
    categoryCountMap.set(categoryId, (categoryCountMap.get(categoryId) || 0) + 1);
  });

  // 각 카테고리별 현재 인덱스 추적
  const categoryIndexMap = new Map<string, number>();

  return (
    <section
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      aria-label="사진 갤러리 그리드"
    >
      {images.map((image) => {
        const categoryId = image.category.id;
        const currentIndex = categoryIndexMap.get(categoryId) || 0;
        categoryIndexMap.set(categoryId, currentIndex + 1);

        // 역순 인덱스 계산: 총 개수 - 현재 인덱스
        const totalCount = categoryCountMap.get(categoryId) || 0;
        const reverseIndex = totalCount - currentIndex - 1;

        return (
          <PhotoCard
            key={image.id}
            image={image}
            showCategory={showCategory}
            index={reverseIndex}
          />
        );
      })}
    </section>
  );
}
