import Image from "next/image";
import Header from "@/components/header.js";
import Footer from "@/components/footer.js";
import PhotosList from "@/components/photos-list";

export default function Home() {
  return (
    <>
      <main>
        <PhotosList />
      </main>
    </>
  );
}
