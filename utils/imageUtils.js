export const getSrcSet = (src, sizes) => {
  return sizes.map((size) => `/photos/${src}-${size}.webp ${size}w`).join(", ");
};
