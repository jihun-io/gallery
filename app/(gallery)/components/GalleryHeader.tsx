import Link from "next/link";
import { Grid, FolderOpen } from "lucide-react";

export default function GalleryHeader() {
  return (
    <header className="sticky top-0 z-50 bg-zinc-900 border-b border-zinc-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-xl text-white flex items-center gap-4">
            <img src="/images/gallery-icon.svg" className="w-12 h-12" alt="" />
            <span>
              gallery.<span className="font-bold">jihun.io</span>
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              aria-label="All Photos"
            >
              <Grid className="w-5 h-5" />
              <span className="sr-only">All Photos</span>
            </Link>
            <Link
              href="/categories"
              className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              aria-label="Categories"
            >
              <FolderOpen className="w-5 h-5" />
              <span className="sr-only">Categories</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
