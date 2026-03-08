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