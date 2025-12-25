import { ImageWithRelations } from "@/types/gallery";
import { Image } from "@prisma/client";

type ImageWithCaptureDate = { captureDate: Date | string };

export function getCaptureDate(image: ImageWithCaptureDate): Date {
  return new Date(image.captureDate);
}

export function sortByCapture<T extends ImageWithCaptureDate>(
  images: T[],
): T[] {
  return [...images].sort((a, b) => {
    const dateA = getCaptureDate(a).getTime();
    const dateB = getCaptureDate(b).getTime();
    return dateB - dateA; // Descending (newest first)
  });
}

export function formatShutterSpeed(speed: number): string {
  return speed < 1 ? `1/${Math.round(1 / speed)}s` : `${speed}s`;
}

export function formatTimestamp(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

export function getPhotoPath(image: ImageWithRelations): string {
  const captureDate = getCaptureDate(image);
  const timestamp = formatTimestamp(captureDate);
  return `/photo/${image.category.slug}/${timestamp}`;
}

export type { ImageWithCaptureDate };
