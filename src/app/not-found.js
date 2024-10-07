import Link from "next/link";
import { generateMetadata } from "/utils/metadata";

const title = "404 Not Found";
const description = "요청하신 페이지를 찾을 수 없습니다.";

export const metadata = generateMetadata(title, description);

export default function NotFound() {
  return (
    <main className="w-full h-fit flex flex-col justify-center items-center gap-2 px-6 md:px-8 lg:px-10 xl:px-12">
      <h2 className="text-lg font-bold">404 - 페이지를 찾을 수 없습니다</h2>
      <p>요청하신 페이지를 찾을 수 없습니다.</p>
      <Link href="/">홈으로 돌아가기</Link>
    </main>
  );
}
