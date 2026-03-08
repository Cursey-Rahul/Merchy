import { prisma } from '@/utils/connect';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id');
  
  if (!id) {
    return new NextResponse(JSON.stringify({ message: "Product ID is required." }), { 
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
  
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            title: true,
            slug: true,
            image: true
          }
        }
      }
    })
    
    if (!product) {
      return new NextResponse(JSON.stringify({ message: "Product not found" }), { 
        status: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      });
    }
    
    return new NextResponse(JSON.stringify(product), { 
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ message: "Error fetching product" }), { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}