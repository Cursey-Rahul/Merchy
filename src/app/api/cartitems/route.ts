import { getSession } from '@/lib/auth';
import { prisma } from '@/utils/connect';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const session = await getSession()
    const user = session?.user?.email
    
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const items = await prisma.cartItem.findMany({
      where: {
        userEmail: user
      },
      include: {
        product: {
          select: {
            title: true,
            creatorSlug: true
          }
        }
      }
    })
    return new NextResponse(JSON.stringify(items), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ message: "Error fetching cart items" }), { status: 500 });
  }
}