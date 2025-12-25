import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { FolderOpen, Plus } from 'lucide-react';

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { images: true },
      },
    },
    orderBy: { order: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">카테고리</h1>
          <p className="text-gray-600">갤러리 카테고리 관리</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          새 카테고리
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이름
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                슬러그
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이미지 수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                순서
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>카테고리가 없습니다</p>
                  <Link
                    href="/admin/categories/new"
                    className="text-blue-600 hover:text-blue-700 mt-2 inline-block"
                  >
                    첫 번째 카테고리 만들기
                  </Link>
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    {category.description && (
                      <div className="text-sm text-gray-500">{category.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{category.slug}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {category._count.images}개
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{category.order}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <Link
                      href={`/admin/categories/${category.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      수정
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
