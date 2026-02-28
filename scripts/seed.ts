import prisma from "@/utils/connect"
import fs from "fs"

async function main(){

  const categories = JSON.parse(
    fs.readFileSync("data/Category.json","utf-8")
  )

  const products = JSON.parse(
    fs.readFileSync("data/products.json","utf-8")
  )

  await prisma.category.createMany({
    data: categories,
    skipDuplicates:true
  })

  const existing = await prisma.category.findMany({
    select:{ slug:true }
  })

  const validSlugs = existing.map(c=>c.slug)

  const filteredProducts = products.filter(
    p => validSlugs.includes(p.catSlug)
  )

  await prisma.product.createMany({
    data: filteredProducts,
    skipDuplicates:true
  })

  console.log("Database seeded")
}

main()
.catch(console.error)
.finally(()=> prisma.$disconnect())