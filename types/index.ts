// EXIF 데이터 타입
export interface ExifData {
  cameraMake?: string | null;
  cameraModel?: string | null;
  iso?: number | null;
  focalLength?: number | null; // 물리적 초점 거리 (mm)
  focalLengthIn35mm?: number | null; // 35mm 환산 초점 거리
  exposureTime?: number | null;
  fNumber?: number | null;
  shutterSpeed?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  dateTaken?: string | Date | null;
  timezone?: string | null; // 시간대 오프셋 (예: "+09:00", "-05:00")
}

// 이미지 메타데이터 타입
export interface ImageMetadata {
  width?: number;
  height?: number;
  format?: string;
  size?: number;
  exif?: ExifData | null;
}

// API 에러 응답 타입
export interface ApiError {
  error: string;
  details?: string;
}

// 폼 에러 타입
export type FormError = string | null;
