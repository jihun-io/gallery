import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { uploadToR2 } from '@/lib/r2';
import sharp from 'sharp';
import { randomUUID } from 'crypto';
import exifr from 'exifr';
import type { ExifData, ImageMetadata } from '@/types';

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if R2 is configured
  if (!process.env.R2_BUCKET_NAME || !process.env.R2_PUBLIC_URL) {
    return NextResponse.json(
      { error: 'R2 storage is not configured' },
      { status: 503 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${randomUUID()}.${fileExtension}`;

    // Extract EXIF data before processing
    let rawExifData: Record<string, unknown> | null = null;
    try {
      rawExifData = await exifr.parse(buffer, {
        tiff: true,
        exif: true,
        gps: true,
        iptc: false,
        icc: false,
        translateKeys: true,
        translateValues: true,
        reviveValues: true,
        sanitize: true,
        mergeOutput: true,
      });

      console.log('EXIF Data extracted:', rawExifData);
    } catch (err) {
      console.error('Error parsing EXIF:', err instanceof Error ? err.message : 'Unknown error');
    }

    // Process image and remove EXIF data
    const processedBuffer = await sharp(buffer)
      .rotate() // Auto-rotate based on EXIF orientation
      .toBuffer(); // Sharp strips metadata by default

    // Upload processed image (without EXIF)
    const imageUrl = await uploadToR2(processedBuffer, `images/${fileName}`, file.type);

    // Generate and upload thumbnail (also without EXIF)
    const thumbnailBuffer = await sharp(processedBuffer)
      .resize(400, 400, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();

    const thumbnailUrl = await uploadToR2(
      thumbnailBuffer,
      `thumbnails/${fileName}`,
      'image/jpeg'
    );

    // Get image dimensions
    const sharpMetadata = await sharp(processedBuffer).metadata();

    // Extract relevant EXIF fields
    const exifInfo: ExifData | null = rawExifData ? {
      cameraMake: (rawExifData.Make || rawExifData.make) as string | undefined || null,
      cameraModel: (rawExifData.Model || rawExifData.model) as string | undefined || null,
      iso: (rawExifData.ISO || rawExifData.ISOSpeedRatings || rawExifData.PhotographicSensitivity) as number | undefined || null,
      focalLength: (rawExifData.FocalLength || rawExifData.focalLength) as number | undefined || null,
      focalLengthIn35mm: (rawExifData.FocalLengthIn35mmFilm || rawExifData.FocalLengthIn35mmFormat) as number | undefined || null,
      exposureTime: (rawExifData.ExposureTime || rawExifData.exposureTime) as number | undefined || null,
      fNumber: (rawExifData.FNumber || rawExifData.fNumber || rawExifData.ApertureValue) as number | undefined || null,
      shutterSpeed: (rawExifData.ShutterSpeedValue || rawExifData.ExposureTime || rawExifData.exposureTime) as number | undefined || null,
      latitude: (rawExifData.latitude || rawExifData.GPSLatitude) as number | undefined || null,
      longitude: (rawExifData.longitude || rawExifData.GPSLongitude) as number | undefined || null,
      dateTaken: (rawExifData.DateTimeOriginal || rawExifData.CreateDate || rawExifData.DateTime) as string | undefined || null,
    } : null;

    console.log('Processed EXIF Info:', exifInfo);

    const metadata: ImageMetadata = {
      width: sharpMetadata.width,
      height: sharpMetadata.height,
      format: sharpMetadata.format,
      size: processedBuffer.length,
      exif: exifInfo,
    };

    return NextResponse.json({
      imageUrl,
      thumbnailUrl,
      metadata,
    });
  } catch (error) {
    console.error('Upload error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
