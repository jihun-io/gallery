/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jihun.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
  i18n: {
    locales: ["ko"],
    defaultLocale: "ko",
    localeDetection: false,
  },
};

export default nextConfig;
