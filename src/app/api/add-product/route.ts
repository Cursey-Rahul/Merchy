import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/utils/connect"; 
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a creator
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { creator: true }
    })

    if (!user || user.userType !== 'creator' || !user.creator) {
      return NextResponse.json({ error: 'Only creators can add products' }, { status: 403 })
    }

    const { title, price, description, options, img, featured } = await req.json();

    if (!title || !price || !description || !img) {
      return NextResponse.json({ error: "Missing data, Please enter them First!" }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        title,
        price: parseFloat(String(price)),
        creatorSlug: user.creator.slug,
        description,
        options: options || [],
        featured: featured || false,
        img,
      }
    });

    console.log("New product created:", newProduct);
    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("❌ Error adding product:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}