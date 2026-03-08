import { NextResponse } from "next/server";
import { prisma } from "@/utils/connect";
import { getSession } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await getSession()
    const user = session?.user?.email
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, title, img, price, quantity, options } = await req.json();

    if (!productId || !title || !img || !price || quantity === undefined) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    if (quantity < 1 || quantity > 15) {
      return NextResponse.json({ error: "Invalid quantity (1-15)" }, { status: 400 });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userEmail: user,
        productId,
        options: options ? JSON.stringify(options) : '',
      },
    });

    if (existingItem) {
      // If item exists, just replace the quantity (don't add)
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: quantity, // SET to new quantity, don't add
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          userEmail: user,
          productId,
          options: options ? JSON.stringify(options) : '',
          quantity,
          title,
          price: new Prisma.Decimal(price),
          img,
        },
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in /api/save-cart:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}