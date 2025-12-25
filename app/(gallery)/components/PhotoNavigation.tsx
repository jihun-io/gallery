'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Props {
  prev?: { categorySlug: string; timestamp: string } | null;
  next?: { categorySlug: string; timestamp: string } | null;
}

export default function PhotoNavigation({ prev, next }: Props) {
  const router = useRouter();

  const getPhotoPath = (item: { categorySlug: string; timestamp: string }) => {
    return `/photo/${item.categorySlug}/${item.timestamp}`;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && prev) {
        router.replace(getPhotoPath(prev));
      } else if (e.key === 'ArrowRight' && next) {
        router.replace(getPhotoPath(next));
      } else if (e.key === 'Escape') {
        router.back();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prev, next, router]);

  return (
    <>
      {/* Previous button */}
      {prev && (
        <Link
          href={getPhotoPath(prev)}
          replace
          className="fixed left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-zinc-900/80 hover:bg-zinc-800 text-white rounded-full transition-colors backdrop-blur-sm"
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
      )}

      {/* Next button */}
      {next && (
        <Link
          href={getPhotoPath(next)}
          replace
          className="fixed right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-zinc-900/80 hover:bg-zinc-800 text-white rounded-full transition-colors backdrop-blur-sm"
          aria-label="Next photo"
        >
          <ChevronRight className="w-6 h-6" />
        </Link>
      )}
    </>
  );
}
