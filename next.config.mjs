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
};

export default nextConfig;
