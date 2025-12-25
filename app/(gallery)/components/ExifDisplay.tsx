"use client";

import { ImageWithRelations } from "@/types/gallery";
import { getCaptureDate, formatShutterSpeed } from "@/lib/gallery-utils";
import { ImageMetadata } from "@/types";
import { MapPin, Camera, Tag } from "lucide-react";
import AppleMap from "./AppleMap";

interface Props {
  image: ImageWithRelations;
}

export default function ExifDisplay({ image }: Props) {
  const metadata = image.metadata as ImageMetadata | null;
  const exif = metadata?.exif;
  const captureDate = getCaptureDate(image);

  return (
    <article className="bg-zinc-900 rounded-lg p-6 space-y-4">
      {/* Category */}
      <section
        className="flex justify-between border-b border-zinc-700 pb-3"
        aria-label="카테고리 정보"
      >
        <span className="text-zinc-400">카테고리</span>
        <span className="text-white font-medium">{image.category.name}</span>
      </section>

      {/* Capture Date */}
      <section
        className="flex justify-between border-b border-zinc-700 pb-3"
        aria-label="촬영 정보"
      >
        <span className="text-zinc-400">촬영 일자</span>
        <span className="text-white">
          {captureDate.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          })}
        </span>
      </section>

      {/* Camera Info */}
      {exif && (exif.cameraMake || exif.cameraModel) && (
        <section className="border-zinc-700" aria-label="카메라 정보">
          <div className="flex items-center gap-2 mb-3">
            <Camera className="w-4 h-4 text-zinc-400" />
            <span className="text-zinc-300 font-medium">카메라</span>
          </div>

          {(exif.cameraMake || exif.cameraModel) && (
            <div className="flex py-2">
              <span className="text-white">
                {[exif.cameraMake, exif.cameraModel].filter(Boolean).join(" ")}
              </span>
            </div>
          )}

          {/* Settings Grid */}
          {(exif.iso ||
            exif.fNumber ||
            exif.shutterSpeed ||
            exif.focalLength ||
            exif.focalLengthIn35mm) && (
            <div className="grid grid-cols-2 gap-3 mt-3">
              {exif.iso && (
                <div className="flex flex-col">
                  <span className="text-zinc-400 text-sm">ISO</span>
                  <span className="text-white font-medium">{exif.iso}</span>
                </div>
              )}
              {exif.fNumber && (
                <div className="flex flex-col">
                  <span className="text-zinc-400 text-sm">조리개</span>
                  <span className="text-white font-medium">
                    f/{exif.fNumber}
                  </span>
                </div>
              )}
              {exif.exposureTime && (
                <div className="flex flex-col">
                  <span className="text-zinc-400 text-sm">노출 시간</span>
                  <span className="text-white font-medium">
                    {formatShutterSpeed(exif.exposureTime)}
                  </span>
                </div>
              )}
              {(exif.focalLengthIn35mm || exif.focalLength) && (
                <div className="flex flex-col">
                  <span className="text-zinc-400 text-sm">초점 거리</span>
                  <span className="text-white font-medium">
                    {exif.focalLengthIn35mm
                      ? `${exif.focalLengthIn35mm}mm`
                      : `${exif.focalLength}mm`}
                  </span>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* GPS */}
      {exif?.latitude && exif?.longitude && (
        <section
          className="pt-3 border-t border-zinc-700"
          aria-label="위치 정보"
        >
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-zinc-400" />
            <span className="text-zinc-300 font-medium">위치</span>
          </div>
          <AppleMap latitude={exif.latitude} longitude={exif.longitude} />
        </section>
      )}

      {/* Tags */}
      {image.tags && image.tags.length > 0 && (
        <section
          className="pt-3 border-t border-zinc-700"
          aria-label="태그 정보"
        >
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-zinc-400" />
            <span className="text-zinc-300 font-medium">태그</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {image.tags.map(({ tag }) => (
              <span
                key={tag.id}
                className="px-3 py-1 bg-zinc-800 text-zinc-300 text-sm rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
