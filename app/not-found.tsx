import GalleryHeader from "@/app/(gallery)/components/GalleryHeader";

export default function NotFound() {
  return (
    <div className="dark">
      <div className="bg-black text-white min-h-screen grid grid-rows-[auto_1fr]">
        <GalleryHeader />
        <main className="container mx-auto px-4 py-16 flex flex-col items-center justify-center gap-4">
          <h2 className="text-white">요청하신 페이지를 찾을 수 없습니다.</h2>
        </main>
      </div>
    </div>
  );
}
