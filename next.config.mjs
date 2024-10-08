/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: "custom",
    disableStaticImages: true, // 선택적: 정적 이미지 임포트 비활성화
  },
  i18n: {
    locales: ["ko"],
    defaultLocale: "ko",
    localeDetection: false,
  },
};

export default nextConfig;
