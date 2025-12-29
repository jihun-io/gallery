import { Image, Category, Tag } from "@prisma/client";

export type ImageWithRelations = Image & {
  category: Category;
  tags: Array<{ tag: Tag }>;
};

export interface AdjacentImages {
  prev: { categorySlug: string; timestamp: string } | null;
  next: { categorySlug: string; timestamp: string } | null;
}

export interface ThumbnailImage {
  id: string;
  categorySlug: string;
  timestamp: string;
  thumbnailUrl: string | null;
  imageUrl: string;
  webpThumbnailUrl?: string | null;
  webpImageUrl?: string | null;
  category: {
    name: string;
  };
  index: number;
  description: string | null;
  title: string;
}

export interface PhotoDetailResponse {
  image: ImageWithRelations;
  adjacentIds: AdjacentImages;
  allImages?: ThumbnailImage[];
}

export interface PhotoGridProps {
  images: ImageWithRelations[];
  showCategory?: boolean;
}

export interface PhotoDetailProps {
  image: ImageWithRelations;
  adjacentIds: AdjacentImages;
  allImages: Array<{
    id: string;
    categorySlug: string;
    timestamp: string;
    thumbnailUrl: string | null;
    imageUrl: string;
    webpThumbnailUrl?: string | null;
    webpImageUrl?: string | null;
  }>;
}
