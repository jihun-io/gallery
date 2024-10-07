"use client";

import React from "react";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export default function PhotosArticle({
  index,
  fileName,
  title,
  dateTimeObj,
  make,
  model,
  iso,
  focalLength,
  evFloat,
  fNumberFloat,
  exposureTime,
  width,
  height,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [imgHeight, setImgHeight] = useState(0);
  const [descHeight, setDescHeight] = useState(0);
  const [vh, setVh] = useState(0);

  const updateSizes = useCallback(() => {
    const descElement = document.querySelector("div.desc");
    if (descElement) {
      setDescHeight(descElement.scrollHeight);
    }
    setVh(window.innerHeight);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      updateSizes();
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen, updateSizes]);

  useEffect(() => {
    const article = document.querySelector(`article#photo${index}`);
    const handleClick = () => {
      setIsOpen(true);
    };

    article.addEventListener("click", handleClick);

    const handleResize = () => {
      updateSizes();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      article.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
    };
  }, [index, updateSizes]);

  useEffect(() => {
    if (vh && descHeight) {
      setImgHeight(vh - descHeight - 16);
    }
  }, [vh, descHeight]);

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <article id={`photo${index}`} className="cursor-pointer">
        <div
          style={{ aspectRatio: `4/3` }}
          className="w-full bg-black flex justify-center items-center mb-2"
        >
          <div
            style={{
              aspectRatio: `${width}/${height}`,
            }}
            className="relative h-full"
          >
            <Image
              src={`/photos/${fileName}`}
              alt={title}
              fill={true}
              sizes="(max-width: 768px) 60vw,
               (max-width: 1024px) 80vw"
              loading="lazy"
              style={{ aspectRatio: `${width}/${height}` }}
              className="object-contain"
            />
          </div>
        </div>
        <h2 className="text-lg font-black">{title}</h2>
        <time className="text-sm text-shark-300">
          {" "}
          {new Date(dateTimeObj).toLocaleString()}
        </time>
      </article>
      {isOpen && (
        <div className="z-20 fixed w-dvw h-vh inset-0 backdrop-brightness-[.5] backdrop-blur-[4px] gap-y-4 flex flex-col">
          <div className=" w-full h-full bg-black flex justify-center items-center">
            <div
              style={{
                maxHeight: `${imgHeight}px`,
                aspectRatio: `${width}/${height}`,
              }}
              className={`relative w-full ${
                width - height < 0 && "h-full max-w-min"
              }`}
            >
              <Image
                src={`/photos/${fileName}`}
                alt={title}
                fill={true}
                quality={100}
                loading="lazy"
                style={{ aspectRatio: `${width}/${height}` }}
                className="object-contain z-50"
              />
            </div>
          </div>
          <div className="desc flex flex-col gap-y-1 p-8 pt-0 basis-auto">
            <h3 className="text-lg font-black">{title}</h3>
            <time className="text-sm text-shark-300">
              {" "}
              {new Date(dateTimeObj).toLocaleString()}
            </time>
            <p className="text-sm">
              {make} {model}
            </p>
            <p className="text-sm">
              ISO {iso}, {focalLength}mm, {evFloat.toFixed(1)} ev, f/
              {fNumberFloat}, {exposureTime}s
            </p>
            <button
              className="flex ml-auto mr-0 mt-4 px-9 py-2 bg-black border-2 border-white rounded-sm"
              onClick={closeModal}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
