import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import Link from 'next/link';
import { Image as ImageIcon, Plus } from 'lucide-react';
import ImageFilters from './ImageFilters';

export default async function ImagesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; tag?: string }>;
}) {
  const params = await searchParams;
  const { search, category, tag } = params;

  // Build where clause for filtering
  const where: Prisma.ImageWhereInput = {};

  // Text search (title or description)
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Category filter
  if (category) {
    where.categoryId = category;
  }

  // Tag filter
  if (tag) {
    where.tags = {
      some: {
        tagId: tag,
      },
    };
  }

  // Fetch filtered images
  const images = await prisma.image.findMany({
    where,
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: { uploadedAt: 'desc' },
    take: 100,
  });

  // Fetch categories and tags for filters
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({
      orderBy: { order: 'asc' },
    }),
    prisma.tag.findMany({
      orderBy: { name: 'asc' },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">이미지</h1>
          <p className="text-gray-600">
            {images.length}개의 이미지
          </p>
        </div>
        <Link
          href="/admin/images/upload"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          이미지 업로드
        </Link>
      </div>

      <ImageFilters
        categories={categories}
        tags={tags}
        currentSearch={search}
        currentCategory={category}
        currentTag={tag}
      />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {images.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>이미지가 없습니다</p>
            <Link
              href="/admin/images/upload"
              className="text-blue-600 hover:text-blue-700 mt-2 inline-block"
            >
              첫 번째 이미지 업로드하기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
            {images.map((image) => (
              <Link
                key={image.id}
                href={`/admin/images/${image.id}`}
                className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
              >
                {image.thumbnailUrl || image.imageUrl ? (
                  <img
                    src={image.thumbnailUrl || image.imageUrl}
                    alt={image.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <p className="text-white text-sm font-medium truncate">{image.title}</p>
                  <p className="text-white/80 text-xs">{image.category.name}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
