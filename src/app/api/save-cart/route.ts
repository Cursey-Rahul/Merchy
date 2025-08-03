import { NextResponse } from "next/server";
import prisma from "@/utils/connect"; 
import { CartItems } from "@/types/types";

export async function POST(req: Request) {
  try {
    const { userEmail, cart } = await req.json();

    if (!userEmail || !cart) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const upsertOps = cart.map(async (item: CartItems) => {
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          userEmail,
          productId: item.id,
          options: item.option || '',
        },
      });

      if (existingItem) {
        return prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + item.quantity,
          },
        });
      } else {
        return prisma.cartItem.create({
          data: {
            userEmail,
            productId: item.id,
            options: item.option || '',
            quantity: item.quantity,
            title: item.name,
            price: item.price,
            img: item.image,
          },
        });
      }
    });

    await Promise.all(upsertOps);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in /api/save-cart:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
