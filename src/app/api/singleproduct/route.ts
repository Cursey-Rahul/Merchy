import { prisma } from '@/utils/connect';
import { NextRequest, NextResponse } from 'next/server';


export const GET = async (req:NextRequest) => {
     const {searchParams}= new URL (req.url)
    const id = searchParams.get('id');
    
    if (!id) {
        return new NextResponse(JSON.stringify({ message: "Product ID is required." }), { status: 400 });
    }
    try {
       const product = await prisma.product.findUnique({
            where: {
              id,
            }
            })
        return new NextResponse(JSON.stringify(product),{status: 200});
        
    } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ message: "Error fetching categories" }), { status: 500 });

        
    }
}