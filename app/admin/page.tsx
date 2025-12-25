import { prisma } from '@/lib/prisma';
import { FolderOpen, Image as ImageIcon, Tags, Users } from 'lucide-react';

export default async function AdminDashboard() {
  const [categoriesCount, imagesCount, tagsCount, usersCount] = await Promise.all([
    prisma.category.count(),
    prisma.image.count(),
    prisma.tag.count(),
    prisma.user.count(),
  ]);

  const recentImages = await prisma.image.findMany({
    take: 5,
    orderBy: { uploadedAt: 'desc' },
    include: {
      category: true,
    },
  });

  const stats = [
    {
      name: '카테고리',
      value: categoriesCount,
      icon: FolderOpen,
      color: 'bg-blue-500',
    },
    {
      name: '이미지',
      value: imagesCount,
      icon: ImageIcon,
      color: 'bg-green-500',
    },
    {
      name: '태그',
      value: tagsCount,
      icon: Tags,
      color: 'bg-purple-500',
    },
    {
      name: '사용자',
      value: usersCount,
      icon: Users,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600">갤러리 관리자 패널에 오신 것을 환영합니다</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white rounded-lg shadow p-6 flex items-center"
            >
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">최근 이미지</h2>
        </div>
        <div className="p-6">
          {recentImages.length === 0 ? (
            <p className="text-gray-500 text-center py-8">이미지가 없습니다</p>
          ) : (
            <div className="space-y-4">
              {recentImages.map((image) => (
                <div
                  key={image.id}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg"
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{image.title}</h3>
                    <p className="text-sm text-gray-500">{image.category.name}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(image.uploadedAt).toLocaleDateString('ko-KR')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
