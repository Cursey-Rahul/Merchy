
import prisma from '@/utils/connect';
import fs from 'fs';

const seedCategory = async () => {
  const file = fs.readFileSync('data/Category.json', 'utf-8');
  const categorys= JSON.parse(file);

  for (const category of categorys) {
    await prisma.category.create({
      data: category,
    });
  }

  console.log('✅ Category seeded!');
};

seedCategory()
  .catch((err) => {
    console.error(err);
  })
  .finally(() => {
    prisma.$disconnect();
  });
//npx tsx scripts/seedCategory.ts
//npx tsx scripts/seedProducts.ts
