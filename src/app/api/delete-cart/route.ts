import { NextResponse } from "next/server";
import prisma from "@/utils/connect"; 
import { getSession } from "@/lib/auth";

export async function PATCH (req: Request) {
      const session = await getSession()
      const user = session?.user?.email
  try {
    const { productId, options } = await req.json();

    if (!user || !productId  || !options) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

      const existingItem = await prisma.cartItem.findFirst({
        where: {
          userEmail: user!,
          productId: productId,
          options,
        },
      });
      console.log("Existing item:", existingItem);
      if (existingItem) { 
        if (existingItem.quantity - 1 == 0) {
          await prisma.cartItem.delete({
            where: { id: existingItem.id },
          });}else{
            await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity - 1,
          },
        });
          }
        
      } 
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in /api/save-cart:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
