import photoNames from "../public/photoName.json";

export const getSrcSet = (imageName) => {
  const imageData = photoNames.find((photo) => photo.filename === imageName);

  if (!imageData) {
    console.warn(`Image not found: ${imageName}`);
    return "";
  }

  const { filename, sizes } = imageData;
  const baseFilename = filename.split(".").slice(0, -1).join("."); // 확장자 제거

  return sizes
    .map((size) => `/photos/${baseFilename}-${size}.webp ${size}w`)
    .join(", ");
};

export const getImageSrc = (imageName, fallbackSize = 1024) => {
  const imageData = photoNames.find((photo) => photo.filename === imageName);

  if (!imageData) {
    console.warn(`Image not found: ${imageName}`);
    return "";
  }

  const { filename, sizes } = imageData;
  const baseFilename = filename.split(".").slice(0, -1).join("."); // 확장자 제거

  // fallbackSize에 가장 가까운 크기 선택
  const nearestSize = sizes.reduce((prev, curr) =>
    Math.abs(curr - fallbackSize) < Math.abs(prev - fallbackSize) ? curr : prev
  );

  return `/photos/${baseFilename}-${nearestSize}.webp`;
};
