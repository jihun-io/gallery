export function generateMetadata(title, description) {
  const getMetadataBase = () => {
    if (process.env.CF_PAGES) {
      // Cloudflare Pages 환경
      if (process.env.CF_PAGES_BRANCH === "main") {
        // 프로덕션 배포
        return `https://gallery.jihun.io`;
      } else {
        // 프리뷰 배포
        return `${process.env.CF_PAGES_URL}`;
      }
    }
    // 로컬 개발 환경
    return `http://localhost:${process.env.PORT || 3000}`;
  };

  const metadataBase = getMetadataBase();
  return {
    metadataBase: new URL(metadataBase),
    title,
    description,
    url: "https://gallery.jihun.io",
    icons: {
      icon: [
        { url: "/metadata/favicon.ico" },
        {
          url: "/metadata/favicon-16x16.png",
          sizes: "16x16",
          type: "image/png",
        },
        {
          url: "/metadata/favicon-32x32.png",
          sizes: "32x32",
          type: "image/png",
        },
        {
          url: "/metadata/favicon-96x96.png",
          sizes: "96x96",
          type: "image/png",
        },
      ],
      apple: [
        {
          url: "/metadata/apple-icon-57x57.png",
          sizes: "57x57",
          type: "image/png",
        },
        {
          url: "/metadata/apple-icon-60x60.png",
          sizes: "60x60",
          type: "image/png",
        },
        {
          url: "/metadata/apple-icon-72x72.png",
          sizes: "72x72",
          type: "image/png",
        },
        {
          url: "/metadata/apple-icon-76x76.png",
          sizes: "76x76",
          type: "image/png",
        },
        {
          url: "/metadata/apple-icon-114x114.png",
          sizes: "114x114",
          type: "image/png",
        },
        {
          url: "/metadata/apple-icon-120x120.png",
          sizes: "120x120",
          type: "image/png",
        },
        {
          url: "/metadata/apple-icon-144x144.png",
          sizes: "144x144",
          type: "image/png",
        },
        {
          url: "/metadata/apple-icon-152x152.png",
          sizes: "152x152",
          type: "image/png",
        },
        {
          url: "/metadata/apple-icon-180x180.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
      other: [
        {
          rel: "icon",
          url: "/metadata/android-icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
      ],
    },
  };
}
