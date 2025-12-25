import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100).regex(/^[a-z0-9가-힣-]+$/),
  description: z.string().optional(),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  order: z.number().int().min(0).default(0),
});

export const imageSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional().or(z.literal('')),
  imageUrl: z.string().url('Invalid image URL'),
  thumbnailUrl: z.string().url().optional().or(z.literal('')).nullable(),
  categoryId: z.string().min(1, 'Category is required'),
  metadata: z.any().optional(),
  captureDate: z.coerce.date().optional(),
});

export const tagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  slug: z.string().min(1, 'Slug is required').max(50).regex(/^[a-z0-9가-힣-]+$/),
});

export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required').max(100),
  role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']).default('EDITOR'),
});
