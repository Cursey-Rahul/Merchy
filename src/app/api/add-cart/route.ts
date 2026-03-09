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

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    // Convert options to match storage format
    const optionsString = options ? JSON.stringify(options) : '';

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userEmail: user,
        productId: productId,
        options: optionsString, // Match exactly
      },
    });

    if (existingItem) {
      if (existingItem.quantity + 1 > 15) {
        return NextResponse.json({ error: "Maximum quantity reached" }, { status: 400 });
      }
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + 1,
        },
      });
    } else {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in /api/add-cart:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}