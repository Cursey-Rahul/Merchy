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
        options,
      },
    });

    console.log("Existing item:", existingItem);
    
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
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in /api/add-cart:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}