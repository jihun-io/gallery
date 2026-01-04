import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { deleteFromR2 } from '@/lib/r2';
import { formatTimestamp } from '@/lib/gallery-utils';
import { ImageMetadata } from '@/types';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const image = await prisma.image.findUnique({
      where: { id },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    return NextResponse.json(image);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await params;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { tagIds, ...data } = body;

    // Extract captureDate from metadata if metadata was updated
    if (data.metadata && !data.captureDate) {
      const metadata = data.metadata as ImageMetadata;
      if (metadata.exif?.dateTaken) {
        data.captureDate = new Date(metadata.exif.dateTaken as string);
      }
    }

    // Delete existing tags
    await prisma.imageTag.deleteMany({
      where: { imageId: id },
    });

    const image = await prisma.image.update({
      where: { id },
      data: {
        ...data,
        tags: tagIds
          ? {
              create: tagIds.map((tagId: string) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // 메인 페이지와 카테고리 페이지 즉시 재생성
    revalidatePath('/');
    revalidatePath('/categories');
    revalidatePath(`/categories/${image.category.slug}`);

    // 상세 페이지도 재생성
    const timestamp = formatTimestamp(new Date(image.captureDate));
    revalidatePath(`/photo/${image.category.slug}/${timestamp}`);

    return NextResponse.json(image);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update image' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await params;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const image = await prisma.image.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Delete from R2 if configured
    if (process.env.R2_BUCKET_NAME) {
      try {
        const imageKey = image.imageUrl.split('/').pop();
        if (imageKey) {
          await deleteFromR2(`images/${imageKey}`);
        }
        if (image.thumbnailUrl) {
          const thumbnailKey = image.thumbnailUrl.split('/').pop();
          if (thumbnailKey) {
            await deleteFromR2(`thumbnails/${thumbnailKey}`);
          }
        }
      } catch (error) {
        console.error('Failed to delete from R2:', error);
      }
    }

    await prisma.image.delete({
      where: { id },
    });

    // 메인 페이지와 카테고리 페이지 즉시 재생성
    revalidatePath('/');
    revalidatePath('/categories');
    revalidatePath(`/categories/${image.category.slug}`);

    // 상세 페이지도 재생성
    const timestamp = formatTimestamp(new Date(image.captureDate));
    revalidatePath(`/photo/${image.category.slug}/${timestamp}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
