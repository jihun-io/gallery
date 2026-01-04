import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { sortByCapture } from "@/lib/gallery-utils";
import PhotoGrid from "../../components/PhotoGrid";

// ISR: 10분마다 자동 재생성
export const revalidate = 600;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const category = await prisma.category.findUnique({
    where: { slug: decodedSlug },
    include: {
      images: {
        include: {
          category: true,
          tags: { include: { tag: true } },
        },
      },
    },
  });

  if (!category) {
    notFound();
  }

  const sortedImages = sortByCapture(category.images);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
      </div>
      <PhotoGrid images={sortedImages} showCategory={false} />
    </main>
  );
}
