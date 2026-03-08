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

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userEmail: user,
        productId: productId,
        options: JSON.stringify(options),
      },
    });

    if (existingItem) {
      if (existingItem.quantity <= 1) {
        await prisma.cartItem.delete({
          where: { id: existingItem.id },
        });
      } else {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity - 1,
          },
        });
      }
    } else {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in /api/delete-cart:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}