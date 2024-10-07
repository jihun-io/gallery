import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="py-9">
      <Link href="/">
        <h1>
          <Image
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
