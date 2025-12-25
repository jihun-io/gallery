import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Tags as TagsIcon, Plus } from 'lucide-react';

export default async function TagsPage() {
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: { images: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">태그</h1>
          <p className="text-gray-600">이미지 태그를 관리하세요</p>
        </div>
        <Link
          href="/admin/tags/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          새 태그
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {tags.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            <TagsIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>태그가 없습니다</p>
            <Link
              href="/admin/tags/new"
              className="text-blue-600 hover:text-blue-700 mt-2 inline-block"
            >
              첫 번째 태그 만들기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{tag.name}</h3>
                  <p className="text-sm text-gray-500">{tag._count.images}개</p>
                </div>
                <Link
                  href={`/admin/tags/${tag.id}`}
                  className="text-blue-600 hover:text-blue-900 text-sm"
                >
                  수정
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
