import React from "react";
import Image from "next/image";
import fs from "fs/promises";
import path from "path";

import PhotosArticle from "./photos-article";

function formatDate(dateTimeStr) {
  // YYYY:MM:DD HH:MM:SS 형식을 Date 객체로 변환 (KST 기준)
  const [datePart, timePart] = dateTimeStr.split(" ");
  const [year, month, day] = datePart.split(":");
  const [hour, minute, second] = timePart.split(":");

  // KST로 Date 객체 생성 (UTC+9)
  const date = new Date(
    Date.UTC(year, month - 1, day, hour - 9, minute, second)
  );

  return date;
}

export async function PhotosList() {
  let photos = [];
  try {
    const filePath = path.join(process.cwd(), "public", "exif-data.json");
    const jsonData = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(jsonData);

    // dateTime을 기준으로 내림차순 정렬
    const sortedData = data
      .map((photo) => ({
        ...photo,
        dateTimeObj: formatDate(photo.dateTime),
      }))
      .sort((a, b) => b.dateTimeObj - a.dateTimeObj);

    photos = sortedData.map((photo) => ({
      ...photo,
      dateTimeObj: photo.dateTimeObj.toISOString(), // ISO 문자열로 변환
      fNumberFloat: parseFloat(photo.fNumber.replace("f/", "")).toFixed(1), // "f/" 제거
      evFloat: parseFloat(photo.ev), // 문자열을 숫자로 변환
    }));
  } catch (error) {
    console.error("Error reading exif-data.json:", error);
    return [];
  }

  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <h2 className="sr-only">사진 목록</h2>
        {photos.map((photo, index) => (
          <PhotosArticle
            key={index}
            index={index}
            fileName={photo.fileName}
            src={photo.src}
            title={photo.title}
            sizes={photo.sizes}
            dateTimeObj={photo.dateTimeObj}
            make={photo.make}
            model={photo.model}
            iso={photo.iso}
            focalLength={photo.focalLength}
            evFloat={photo.evFloat}
            fNumberFloat={photo.fNumberFloat}
            exposureTime={photo.exposureTime}
            width={photo.width}
            height={photo.height}
          />
        ))}
      </section>
    </>
  );
}

export default PhotosList;
