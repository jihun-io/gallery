"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Filter } from "lucide-react";
import { useState, useTransition } from "react";

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface Props {
  categories: Category[];
  tags: Tag[];
  currentSearch?: string;
  currentCategory?: string;
  currentTag?: string;
}

export default function ImageFilters({
  categories,
  tags,
  currentSearch = "",
  currentCategory = "",
  currentTag = "",
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchInput, setSearchInput] = useState(currentSearch);

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update or remove parameters
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Navigate with new params
    startTransition(() => {
      router.push(
        `/admin/images${params.toString() ? `?${params.toString()}` : ""}`,
      );
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput });
  };

  const handleCategoryChange = (categoryId: string) => {
    updateFilters({ category: categoryId });
  };

  const handleTagChange = (tagId: string) => {
    updateFilters({ tag: tagId });
  };

  const clearFilters = () => {
    setSearchInput("");
    startTransition(() => {
      router.push("/admin/images");
    });
  };

  const hasActiveFilters = currentSearch || currentCategory || currentTag;

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-gray-400" />
        <h2 className="text-lg font-semibold text-gray-900">검색 및 필터</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="ml-auto text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            전체 해제
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            검색
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="제목 또는 설명으로 검색..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            카테고리
          </label>
          <select
            value={currentCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isPending}
          >
            <option value="">전체 카테고리</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tag Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            태그
          </label>
          <select
            value={currentTag}
            onChange={(e) => handleTagChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isPending}
          >
            <option value="">전체 태그</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {currentSearch && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              검색: {currentSearch}
              <button
                onClick={() => {
                  setSearchInput("");
                  updateFilters({ search: "" });
                }}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {currentCategory && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              카테고리: {categories.find((c) => c.id === currentCategory)?.name}
              <button
                onClick={() => updateFilters({ category: "" })}
                className="hover:bg-green-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {currentTag && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              태그: {tags.find((t) => t.id === currentTag)?.name}
              <button
                onClick={() => updateFilters({ tag: "" })}
                className="hover:bg-purple-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {isPending && (
        <div className="text-sm text-gray-500 italic">로드 중...</div>
      )}
    </div>
  );
}
