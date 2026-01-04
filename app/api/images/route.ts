import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { imageSchema } from '@/lib/validations';
import { formatTimestamp } from '@/lib/gallery-utils';
import { ImageMetadata } from '@/types';
import { z } from 'zod';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const categoryId = searchParams.get('categoryId');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;

  try {
    const where = categoryId ? { categoryId } : {};

    const [images, total] = await Promise.all([
      prisma.image.findMany({
        where,
        include: {
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { uploadedAt: 'desc' },
      }),
      prisma.image.count({ where }),
    ]);

    return NextResponse.json({
      images,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { tagIds, ...data } = body;
    const validatedData = imageSchema.parse(data);

    // Extract captureDate from metadata if not provided
    let captureDate = validatedData.captureDate;
    if (!captureDate && validatedData.metadata) {
      const metadata = validatedData.metadata as ImageMetadata;
      if (metadata.exif?.dateTaken) {
        captureDate = new Date(metadata.exif.dateTaken as string);
      }
    }

    const image = await prisma.image.create({
      data: {
        ...validatedData,
        captureDate: captureDate || new Date(),
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

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create image' },
      { status: 500 }
    );
  }
}
