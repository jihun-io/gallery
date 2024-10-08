"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="py-9">
      <Link href="/">
        <h1>
          <img
            src="/images/logo-txt.svg"
            alt="gallery.jihun.io"
            width={257}
            height={52}
          />
        </h1>
      </Link>
    </header>
  );
}
