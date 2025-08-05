import { NextResponse } from "next/server";
import prisma from "@/utils/connect"; 

export async function POST (req: Request) {
  try {
    const { title, price, catSlug, description, options ,img, featured} = await req.json();

    if (!title || !price || !catSlug || !description || !img ) {
      return NextResponse.json({ error: "Missing data, Please enter them First!" }, { status: 400 });
    }

      const NewItem = await prisma.product.create({
        data:{
            title,
            price: parseFloat(price),
            catSlug,
            description,
            options: options || [],
            featured: featured,
            img,
        }
      }
      );
      console.log("Existing item:", NewItem);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error adding product:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
