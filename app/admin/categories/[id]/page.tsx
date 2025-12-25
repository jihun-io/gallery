import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CategoryEditClient from "./CategoryEditClient";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { images: true },
      },
    },
  });

  if (!category) {
    notFound();
  }

  return <CategoryEditClient category={category} />;
}
