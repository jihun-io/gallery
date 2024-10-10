"use client";
import { getSrcSet } from "../../utils/imageUtils";

const OptimizedImage = ({ source, alt, sizes, style, className }) => {
  return (
    <img
      src={`/photos/originals/${source}`}
      alt={alt}
      className={className}
      style={style}
      srcSet={getSrcSet(source, sizes)}
      loading="lazy"
    />
  );
};

export default OptimizedImage;
