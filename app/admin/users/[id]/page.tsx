import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import UserEditClient from './UserEditClient';

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  // Only ADMIN can access
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin');
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    notFound();
  }

  const currentUserId = session.user.id;

  return <UserEditClient user={user} currentUserId={currentUserId} />;
}
