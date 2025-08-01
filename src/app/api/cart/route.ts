import { getSession } from "@/lib/auth";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";
const GETDATA= async(id: string)=>{
  const response = await fetch(`http://localhost:3000/api/singleproduct?id=${id}`);
 const data = await response.json();
   return data;
}

export const GET = async () => { 
    const session = await getSession();
    const user = session?.user?.email;
    try{
        const cart = await prisma.cartItem.findMany(
            { 
                where: { userEmail: user! },
            }
        );
       const enrichedCart = await Promise.all(
      cart.map(async (item) => {
        const product = await GETDATA(item.id);
        return {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: item.quantity,
          option: item.options,
        };
      })
    );

        return new NextResponse(JSON.stringify(enrichedCart), {status :200})

    }catch (error){
        console.error(error);
        return new NextResponse(JSON.stringify({ message: "Error fetching cart" }), { status: 500 });
    }
 }
