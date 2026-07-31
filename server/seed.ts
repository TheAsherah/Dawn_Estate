import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from './db.js';

const categories = ['villa', 'house', 'apartment', 'studio', 'land', 'daily-renting'] as const;
const transactionTypes = ['sale', 'rent'] as const;

const propertySeeds = [
  {
    title: 'Luxury Villa in Anfa',
    description: 'A contemporary villa with panoramic sea views and a private garden.',
    price: 8500000,
    city: 'Marrakech',
    address: 'Boulevard d\'Anfa',
    category: 'villa',
    prestation: 'sale',
    surface: 650,
    bedrooms: 6,
    bathrooms: 5,
    pool: true,
    images: [
      'https://images.unsplash.com/photo-1622015663381-d2e05ae91b72?q=80&w=1600',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1600'
    ]
  },
  {
    title: 'Modern Apartment in Gueliz',
    description: 'Bright contemporary apartment with premium finishes and easy access to the city center.',
    price: 120000,
    city: 'Marrakech',
    address: 'Rue de la Liberté, Gueliz',
    category: 'apartment',
    prestation: 'rent',
    surface: 120,
    bedrooms: 2,
    bathrooms: 2,
    pool: false,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1600',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1600'
    ]
  },
  {
    title: 'Daily Rental Loft in Medina',
    description: 'A stylish loft ideal for short stays in the heart of the Medina.',
    price: 1800,
    city: 'Marrakech',
    address: 'Rue de la Kasbah',
    category: 'daily-renting',
    prestation: 'rent',
    surface: 90,
    bedrooms: 2,
    bathrooms: 2,
    pool: false,
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1600',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600'
    ]
  }
] as const;

async function main() {
  await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' }
  });
  await prisma.role.upsert({
    where: { name: 'agent' },
    update: {},
    create: { name: 'agent' }
  });
  await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: { name: 'user' }
  });
  await prisma.role.upsert({
    where: { name: 'client' },
    update: {},
    create: { name: 'client' }
  });

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category },
      update: {},
      create: { name: category }
    });
  }

  for (const type of transactionTypes) {
    await prisma.transactionType.upsert({
      where: { name: type },
      update: {},
      create: { name: type }
    });
  }

  const adminRole = await prisma.role.findUnique({ where: { name: 'admin' } });
  const agentRole = await prisma.role.findUnique({ where: { name: 'agent' } });
  const userRole = await prisma.role.findUnique({ where: { name: 'user' } });

  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();

  const demoUsers = [
    {
      email: 'admin@dawnestate.com',
      password: 'Admin@2024!',
      firstName: 'Dawn',
      lastName: 'Admin',
      roleId: adminRole?.id ?? 1
    },
    {
      email: 'agent@dawnestate.com',
      password: 'Agent@2024!',
      firstName: 'Mina',
      lastName: 'Bennani',
      roleId: agentRole?.id ?? 2
    },
    {
      email: 'user@dawnestate.com',
      password: 'User@2024!',
      firstName: 'Sofia',
      lastName: 'El Idrissi',
      roleId: userRole?.id ?? 3
    }
  ] as const;

  for (const demoUser of demoUsers) {
    await prisma.user.upsert({
      where: { email: demoUser.email },
      update: {
        passwordHash: await bcrypt.hash(demoUser.password, 10),
        firstName: demoUser.firstName,
        lastName: demoUser.lastName,
        roleId: demoUser.roleId
      },
      create: {
        email: demoUser.email,
        passwordHash: await bcrypt.hash(demoUser.password, 10),
        firstName: demoUser.firstName,
        lastName: demoUser.lastName,
        roleId: demoUser.roleId
      }
    });
  }

  for (const seed of propertySeeds) {
    const existing = await prisma.property.findFirst({
      where: { title: seed.title },
      select: { id: true }
    });

    if (existing) {
      continue;
    }

    const categoryRecord = await prisma.category.findUnique({ where: { name: seed.category } });
    const transactionRecord = await prisma.transactionType.findUnique({ where: { name: seed.prestation } });

    const property = await prisma.property.create({
      data: {
        title: seed.title,
        description: seed.description,
        price: new Prisma.Decimal(seed.price),
        status: 'approved',
        categoryId: categoryRecord?.id ?? null,
        transactionTypeId: transactionRecord?.id ?? null,
        address: seed.address,
        city: seed.city,
        specificAttributes: JSON.stringify({
          surface: seed.surface,
          bedrooms: seed.bedrooms,
          bathrooms: seed.bathrooms,
          pool: seed.pool
        })
      }
    });

    await prisma.propertyImage.createMany({
      data: seed.images.map((imageUrl, index) => ({
        propertyId: property.id,
        imageUrl,
        isMain: index === 0
      }))
    });
  }

  console.log('Demo users and properties seeded successfully');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
