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

    // Convert options to match storage format - handle both old and new format
    let optionsString = '';
    if (options) {
      if (typeof options === 'string') {
        optionsString = options;
      } else {
        optionsString = JSON.stringify(options);
      }
    }

    console.log('Looking for item with:', { userEmail: user, productId, optionsString });

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userEmail: user,
        productId: productId,
        options: optionsString,
      },
    });

    console.log('Found item:', existingItem);

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
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error in /api/add-cart:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}