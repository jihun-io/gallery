import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ImageDetailClient from './ImageDetailClient';
import type { ImageMetadata } from '@/types';

export default async function ImageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [image, categories, tags] = await Promise.all([
    prisma.image.findUnique({
      where: { id },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    }),
    prisma.category.findMany({
      orderBy: { order: 'asc' },
    }),
    prisma.tag.findMany({
      orderBy: { name: 'asc' },
    }),
  ]);

  if (!image) {
    notFound();
  }

  return (
    <ImageDetailClient
      image={{
        ...image,
        metadata: image.metadata as ImageMetadata | null,
      }}
      categories={categories}
      tags={tags}
    />
  );
}
