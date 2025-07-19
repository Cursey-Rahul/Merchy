import { prisma } from '@/utils/connect';
import {NextResponse } from 'next/server';

export const GET = async () => {
    try {
        const products= await prisma.product.findMany();
        return new NextResponse(JSON.stringify(products),{status: 200});
        
    } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ message: "Error fetching categories" }), { status: 500 });

        
    }
}