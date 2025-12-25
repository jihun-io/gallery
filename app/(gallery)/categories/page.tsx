import { prisma } from "@/lib/prisma";
import CategoryGrid from "../components/CategoryGrid";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      images: {
        take: 4,
        orderBy: { uploadedAt: "desc" },
      },
    },
    orderBy: { order: "asc" },
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">카테고리</h1>
      <CategoryGrid categories={categories.reverse()} />
    </main>
  );
}
