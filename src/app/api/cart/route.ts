import prisma from "@/utils/connect";
import { NextResponse } from "next/server";


export const GET = async () => { 
    try{
        const cart = await prisma.cartItem.findMany();
        return new NextResponse(JSON.stringify(cart), {status :200})

    }catch (error){
        console.error(error);
        return new NextResponse(JSON.stringify({ message: "Error fetching cart" }), { status: 500 });
    }
 }
