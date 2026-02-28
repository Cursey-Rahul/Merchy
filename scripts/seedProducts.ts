import prisma from "@/utils/connect";
import fs from "fs";

async function seedProducts() {
  const file = fs.readFileSync("data/products.json","utf-8");
  const products = JSON.parse(file);

  await prisma.product.createMany({
    data: products,
    skipDuplicates: true
  });

  console.log("Products seeded");
}

seedProducts()
.catch(console.error)
.finally(()=> prisma.$disconnect());
