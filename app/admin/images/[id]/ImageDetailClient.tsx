'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Save, ArrowLeft, Loader2, Camera, MapPin } from 'lucide-react';
import { getErrorMessage } from '@/lib/utils';
import type { ImageMetadata } from '@/types';

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface ImageData {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  thumbnailUrl: string | null;
  categoryId: string;
  uploadedAt: Date;
  metadata: ImageMetadata | null;
  category: Category;
  tags: Array<{
    tag: Tag;
  }>;
}

interface Props {
  image: ImageData;
  categories: Category[];
  tags: Tag[];
}

export default function ImageDetailClient({ image, categories, tags }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: image.title,
    description: image.description || '',
    categoryId: image.categoryId,
    tagIds: image.tags.map((t) => t.tag.id),
  });

  const handleTagToggle = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/images/${image.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('이미지 업데이트 실패');
      }

      router.refresh();
      alert('변경 사항이 저장되었습니다.');
    } catch (error) {
      setError(getErrorMessage(error) || '업데이트 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말로 이 이미지를 삭제하시겠습니까?')) {
      return;
    }

    setDeleting(true);

    try {
      const res = await fetch(`/api/images/${image.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('이미지 삭제 실패');
      }

      router.push('/admin/images');
      router.refresh();
    } catch (error) {
      setError(getErrorMessage(error) || '삭제 실패');
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">이미지 수정</h1>
            <p className="text-gray-600">
              {new Date(image.uploadedAt).toLocaleDateString('ko-KR')}에 업로드 됨
            </p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          {deleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
          삭제
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Preview */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">이미지</h2>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
              <img
                src={image.imageUrl}
                alt={image.title}
                loading="lazy"
                className="w-full h-full object-contain"
              />
            </div>
            {image.metadata && (
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
                {image.metadata.size && (
                  <div>
                    <span className="font-medium">크기:</span>{' '}
                    {Math.round(image.metadata.size / 1024)} KB
                  </div>
                )}
                {image.metadata.format && (
                  <div>
                    <span className="font-medium">포맷:</span>{' '}
                    {image.metadata.format.toUpperCase()}
                  </div>
                )}
                {image.metadata.width && image.metadata.height && (
                  <div>
                    <span className="font-medium">해상도:</span>{' '}
                    {image.metadata.width} × {image.metadata.height}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* EXIF Information */}
          {image.metadata?.exif && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <Camera className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold">촬영 정보</h2>
              </div>
              <div className="space-y-3 text-sm">
                {image.metadata.exif.cameraMake && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">카메라 제조사</span>
                    <span className="font-medium text-gray-900">
                      {image.metadata.exif.cameraMake}
                    </span>
                  </div>
                )}
                {image.metadata.exif.cameraModel && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">카메라 모델</span>
                    <span className="font-medium text-gray-900">
                      {image.metadata.exif.cameraModel}
                    </span>
                  </div>
                )}
                {image.metadata.exif.iso && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">ISO</span>
                    <span className="font-medium text-gray-900">
                      {image.metadata.exif.iso}
                    </span>
                  </div>
                )}
                {(image.metadata.exif.focalLengthIn35mm || image.metadata.exif.focalLength) && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">초점거리</span>
                    <span className="font-medium text-gray-900">
                      {image.metadata.exif.focalLengthIn35mm
                        ? `${image.metadata.exif.focalLengthIn35mm}mm`
                        : `${image.metadata.exif.focalLength}mm`}
                    </span>
                  </div>
                )}
                {image.metadata.exif.fNumber && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">조리개</span>
                    <span className="font-medium text-gray-900">
                      f/{image.metadata.exif.fNumber}
                    </span>
                  </div>
                )}
                {image.metadata.exif.shutterSpeed && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">셔터 스피드</span>
                    <span className="font-medium text-gray-900">
                      {image.metadata.exif.shutterSpeed < 1
                        ? `1/${Math.round(1 / image.metadata.exif.shutterSpeed)}s`
                        : `${image.metadata.exif.shutterSpeed}s`}
                    </span>
                  </div>
                )}
                {image.metadata.exif.exposureTime && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">노출 시간</span>
                    <span className="font-medium text-gray-900">
                      {image.metadata.exif.exposureTime < 1
                        ? `1/${Math.round(1 / image.metadata.exif.exposureTime)}s`
                        : `${image.metadata.exif.exposureTime}s`}
                    </span>
                  </div>
                )}
                {image.metadata.exif.dateTaken && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">촬영 날짜</span>
                    <span className="font-medium text-gray-900">
                      {new Date(image.metadata.exif.dateTaken).toLocaleString('ko-KR')}
                    </span>
                  </div>
                )}
                {(image.metadata.exif.latitude && image.metadata.exif.longitude) && (
                  <div className="pt-2 border-t-2 border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-600 font-medium">위치 정보</span>
                    </div>
                    <div className="space-y-1 ml-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">위도</span>
                        <span className="font-medium text-gray-900">
                          {image.metadata.exif.latitude.toFixed(6)}°
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">경도</span>
                        <span className="font-medium text-gray-900">
                          {image.metadata.exif.longitude.toFixed(6)}°
                        </span>
                      </div>
                      <a
                        href={`https://www.google.com/maps?q=${image.metadata.exif.latitude},${image.metadata.exif.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm mt-1"
                      >
                        Google Maps에서 보기 →
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-lg font-semibold">상세 정보</h2>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리 *
            </label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              태그
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleTagToggle(tag.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    formData.tagIds.includes(tag.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                저장 중...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                변경 사항 저장
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
