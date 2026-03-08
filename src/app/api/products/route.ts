import { prisma } from '@/utils/connect';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)
  const creator = searchParams.get('creator')
  
  try {
    const products = await prisma.product.findMany({
      where: {
        ...(creator ? { creatorSlug: creator } : { featured: true })
      },
      include: {
        creator: {
          select: {
            title: true,
            slug: true
          }
        }
      }
    })
    return new NextResponse(JSON.stringify(products), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ message: "Error fetching products" }), { status: 500 });
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const session = await getSession()
    
    if (!session) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    // Check if user is a creator
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { creator: true }
    })

    if (!user || user.userType !== 'creator' || !user.creator) {
      return new NextResponse(JSON.stringify({ error: 'Only creators can add products' }), { status: 403 })
    }

    const body = await req.json()

    // Create product with creator's slug
    const product = await prisma.product.create({
      data: {
        ...body,
        creatorSlug: user.creator.slug
      }
    })

    return new NextResponse(JSON.stringify(product), { status: 201 })
  } catch (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ error: 'Failed to create product' }), { status: 500 })
  }
}