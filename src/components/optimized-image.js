"use client";

import Image from "next/image";
import { getSrcSet } from "../../utils/imageUtils";

const imageLoader = ({ fileName, width }) => {
  return `/photos/${fileName}-${width}.webp`;
};

const OptimizedImage = ({ source, fileName, alt, sizes, style, className }) => {
  const imageSizes = [320, 640, 1024, 1920];

  const srcSet = getSrcSet(fileName, imageSizes);
  return (
    <img
      src={`/photos/originals/${source}`}
      alt={alt}
      sizes={sizes}
      className={className}
      style={style}
      srcSet={srcSet}
      loading="lazy"
    />
  );
};

export default OptimizedImage;
