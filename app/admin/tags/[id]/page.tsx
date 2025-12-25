import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import TagEditClient from './TagEditClient';

export default async function EditTagPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const tag = await prisma.tag.findUnique({
    where: { id },
    include: {
      _count: {
        select: { images: true },
      },
    },
  });

  if (!tag) {
    notFound();
  }

  return <TagEditClient tag={tag} />;
}
