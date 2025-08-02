import { getSession } from '@/lib/auth';
import { prisma } from '@/utils/connect';
import { NextResponse } from 'next/server';


export const GET = async () => {
    const session = await getSession()
    const user = session?.user?.email
    try {
       const items = await prisma.cartItem.findMany({
            where: {
                userEmail : user!
            }
            })
        return new NextResponse(JSON.stringify(items),{status: 200});
        
    } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ message: "Error fetching categories" }), { status: 500 });
    }
}