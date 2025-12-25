"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

export default function PhotoModal({ children }: Props) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent background scroll on both html and body
    const html = document.documentElement;
    const body = document.body;

    const originalHtmlOverflow = html.style.overflow;
    const originalBodyOverflow = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.back();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      html.style.overflow = originalHtmlOverflow;
      body.style.overflow = originalBodyOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [router]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      router.back();
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      {/* Close button */}
      <button
        onClick={() => router.back()}
        className="fixed top-2 right-2 -translate-x-1/2 translate-y-1/2 z-50 p-4 bg-zinc-900/80 hover:bg-zinc-800 text-white rounded-full transition-colors backdrop-blur-sm"
        aria-label="닫기"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Modal content */}
      <div className="relative h-full">{children}</div>
    </div>
  );
}
