import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@gallery.com' },
    update: {},
    create: {
      email: 'admin@gallery.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log('✅ Created admin user:', { email: admin.email, name: admin.name });

  // Create sample categories
  const category1 = await prisma.category.upsert({
    where: { slug: 'portraits' },
    update: {},
    create: {
      name: 'Portraits',
      slug: 'portraits',
      description: 'Portrait photography collection',
      order: 1,
    },
  });

  const category2 = await prisma.category.upsert({
    where: { slug: 'landscapes' },
    update: {},
    create: {
      name: 'Landscapes',
      slug: 'landscapes',
      description: 'Beautiful landscape photography',
      order: 2,
    },
  });

  console.log('✅ Created categories:', [category1.name, category2.name]);

  // Create sample tags
  const tag1 = await prisma.tag.upsert({
    where: { slug: 'nature' },
    update: {},
    create: { name: 'Nature', slug: 'nature' },
  });

  const tag2 = await prisma.tag.upsert({
    where: { slug: 'urban' },
    update: {},
    create: { name: 'Urban', slug: 'urban' },
  });

  const tag3 = await prisma.tag.upsert({
    where: { slug: 'black-and-white' },
    update: {},
    create: { name: 'Black & White', slug: 'black-and-white' },
  });

  console.log('✅ Created tags:', [tag1.name, tag2.name, tag3.name]);

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
