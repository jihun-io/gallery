export const getSrcSet = (filename, sizes) => {
  if (!filename) {
    console.warn(`Image not found: ${filename}`);
    return "";
  }

  const baseFilename = filename.split(".").slice(0, -1).join("."); // 확장자 제거

  return sizes
    .map((size) => `/photos/${baseFilename}-${size}.webp ${size}w`)
    .join(", ");
};
