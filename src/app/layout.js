import "./globals.css";
import { generateMetadata } from "/utils/metadata";
import Header from "@/components/header";
import Footer from "@/components/footer";

export const metaDetail = {
  title: "gallery.jihun.io",
  description: "jihun의 사진 갤러리",
};

export const metadata = generateMetadata(
  metaDetail.title,
  metaDetail.description
);

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body
        className={`antialiased bg-background text-foreground px-12 min-h-[100vh] grid grid-rows-[auto,1fr,auto]`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
