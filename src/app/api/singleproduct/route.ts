import { prisma } from '@/utils/connect';
import { NextRequest, NextResponse } from 'next/server';


export const GET = async (req:NextRequest) => {
     const {searchParams}= new URL (req.url)
    const products = searchParams.get('title')
    try {
       const product = await prisma.product.findMany({
            where: {
              ...(products? {title:products}:{}) }
            })
        return new NextResponse(JSON.stringify(product),{status: 200});
        
    } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ message: "Error fetching categories" }), { status: 500 });

        
    }
}