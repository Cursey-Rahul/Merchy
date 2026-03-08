import { prisma } from '@/utils/connect';
import { NextResponse, NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';

export const GET = async () => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
    return new NextResponse(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ message: "Error fetching orders" }), { status: 500 });
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const session = await getSession()
    
    if (!session?.user?.email) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const body = await req.json()

    const order = await prisma.order.create({
      data: {
        userEmail: session.user.email,
        price: String(body.price),
        products: body.products,
        status: 'pending'
      }
    })

    return new NextResponse(JSON.stringify(order), { status: 201 })
  } catch (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ error: 'Failed to create order' }), { status: 500 })
  }
}