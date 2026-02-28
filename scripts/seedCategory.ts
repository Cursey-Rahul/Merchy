import prisma from "@/utils/connect";
import fs from "fs";

async function seedCategories() {
  const file = fs.readFileSync("data/Category.json","utf-8");
  const categories = JSON.parse(file);

  await prisma.category.createMany({
    data: categories,
    skipDuplicates: true
  });

  console.log("Categories seeded");
}

seedCategories()
.catch(console.error)
.finally(()=> prisma.$disconnect());
//npx tsx scripts/seedCategory.ts
//npx tsx scripts/seedProducts.ts
