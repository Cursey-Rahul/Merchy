import { NextResponse } from "next/server";
import prisma from "@/utils/connect"; 

export async function POST(req: Request) {
  try {
    const { userEmail, productId, title, img, price, quantity, option } = await req.json();

    if (!userEmail || !productId || !title || !img || !price || !quantity) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

      const existingItem = await prisma.cartItem.findFirst({
        where: {
          userEmail,
          productId,
          options: option || '',
        },
      });

      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + quantity,
          },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            userEmail,
            productId,
            options: option || '',
            quantity,
            title,
            price,
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
