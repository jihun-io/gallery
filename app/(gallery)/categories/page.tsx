import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import CategoryGrid from "../components/CategoryGrid";

// ISR: 10분마다 자동 재생성
export const revalidate = 600;

const getCategories = unstable_cache(
  async () => {
    return await prisma.category.findMany({
      include: {
        images: {
          take: 4,
          orderBy: { uploadedAt: "desc" },
        },
        _count: {
          select: { images: true },
        },
      },
      orderBy: { order: "desc" },
    });
  },
  ["categories"],
  { revalidate: 600, tags: ["categories"] }
);

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">카테고리</h1>
      <CategoryGrid categories={categories} />
    </main>
  );
}
