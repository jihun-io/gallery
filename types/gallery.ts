import { Image, Category, Tag } from '@prisma/client';

export type ImageWithRelations = Image & {
  category: Category;
  tags: Array<{ tag: Tag }>;
};

export interface AdjacentImages {
  prev: { categorySlug: string; timestamp: string } | null;
  next: { categorySlug: string; timestamp: string } | null;
}

export interface PhotoGridProps {
  images: ImageWithRelations[];
  showCategory?: boolean;
}

export interface PhotoDetailProps {
  image: ImageWithRelations;
  adjacentIds: AdjacentImages;
  allImages: Array<{ id: string; categorySlug: string; timestamp: string; thumbnailUrl: string | null; imageUrl: string }>;
}
