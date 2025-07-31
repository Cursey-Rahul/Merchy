import prisma from '@/utils/connect';
import fs from 'fs';

const seedProducts = async () => {
  const file = fs.readFileSync('data/products.json', 'utf-8');
  const products= JSON.parse(file);

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('✅ Products seeded!');
};

seedProducts()
  .catch((err) => {
    console.error(err);
  })
  .finally(() => {
    prisma.$disconnect();
  });
