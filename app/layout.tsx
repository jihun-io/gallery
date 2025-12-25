import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

const pretendard = localFont({
  src: "../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "gallery.jihun.io",
  description: "jihun의 사진 갤러리.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} overflow-x-hidden overflow-y-scroll break-keep`}
    >
      <body>{children}</body>
    </html>
  );
}
