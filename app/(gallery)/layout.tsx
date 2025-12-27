import type { Metadata, Viewport } from "next";
import GalleryHeader from "./components/GalleryHeader";

export const metadata: Metadata = {
  title: "gallery.jihun.io",
  description: "jihun의 사진 갤러리.",
  icons: {
    icon: "/images/gallery-icon.svg",
  },
  openGraph: {
    title: "gallery.jihun.io",
    description: "jihun의 사진 갤러리.",
    images: [
      {
        url: "https://gallery.jihun.io/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "gallery.jihun.io",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function GalleryLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="dark">
      <div className="bg-black text-white min-h-screen grid grid-rows-[auto_1fr]">
        <GalleryHeader />
        {children}
        {modal}
      </div>
    </div>
  );
}
