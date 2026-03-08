import { NextResponse } from "next/server";
import { prisma } from "@/utils/connect"; 
import { getSession } from "@/lib/auth";

export async function PATCH(req: Request) {
  try {
    const session = await getSession()
    const user = session?.user?.email
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, options } = await req.json();

    if (!productId || !options) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Get product details
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userEmail: user,
        productId: productId,
        options: JSON.stringify(options), // Match options as JSON string
      },
    });

    if (existingItem) {
      if (existingItem.quantity + 1 >= 16) {
        return NextResponse.json({ error: "Maximum quantity reached" }, { status: 400 });
      } else {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + 1,
          },
        });
      }
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          userEmail: user,
          productId: productId,
          options: JSON.stringify(options),
          quantity: 1,
          img: product.img || "",
          price: product.price,
          title: product.title,
        },
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in /api/add-cart:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}