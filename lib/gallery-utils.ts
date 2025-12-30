import { ImageWithRelations } from "@/types/gallery";
import { ImageMetadata } from "@/types";

type ImageWithCaptureDate = { captureDate: Date | string };

export function getCaptureDate(image: ImageWithCaptureDate): Date {
  return new Date(image.captureDate);
}

/**
 * 시간대 오프셋 문자열을 분 단위로 파싱
 * @param offset - 시간대 오프셋 (예: "+09:00", "-05:00")
 * @returns 분 단위 오프셋
 */
export function parseTimezoneOffset(offset: string): number {
  const match = offset.match(/^([+-])(\d{2}):(\d{2})$/);
  if (!match) return 0;

  const sign = match[1] === "+" ? 1 : -1;
  const hours = parseInt(match[2], 10);
  const minutes = parseInt(match[3], 10);

  return sign * (hours * 60 + minutes);
}

/**
 * UTC 시간을 시간대 오프셋을 적용하여 현지 시간으로 변환
 * @param utcDate - UTC Date 객체
 * @param timezoneOffset - 시간대 오프셋 (예: "+09:00")
 * @returns 현지 시간 Date 객체
 */
export function getLocalTime(
  utcDate: Date,
  timezoneOffset?: string | null,
): Date {
  if (!timezoneOffset) return utcDate;

  const offsetMinutes = parseTimezoneOffset(timezoneOffset);
  const localTime = new Date(utcDate.getTime() + offsetMinutes * 60 * 1000);

  return localTime;
}

/**
 * 이미지의 촬영 현지 시간을 가져옴
 * @param image - 이미지 객체 (captureDate와 metadata 포함)
 * @returns 현지 시간 Date 객체
 */
export function getLocalCaptureTime(
  image: ImageWithCaptureDate & { metadata?: unknown },
): Date {
  const utcDate = getCaptureDate(image);
  const metadata = image.metadata as ImageMetadata | null;
  const timezone = metadata?.exif?.timezone;

  return getLocalTime(utcDate, timezone);
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
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

export function getPhotoPath(image: ImageWithRelations): string {
  const captureDate = getCaptureDate(image);
  const timestamp = formatTimestamp(captureDate);
  return `/photo/${image.category.slug}/${timestamp}`;
}

export type { ImageWithCaptureDate };
