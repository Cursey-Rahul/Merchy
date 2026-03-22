import { prisma } from '@/utils/connect';
import { getSession } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export const PATCH = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const session = await getSession();

    if (!session) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { creator: true }
    });

    if (!user || user.userType !== 'creator' || !user.creator) {
      return new NextResponse(JSON.stringify({ error: 'Only creators can edit products' }), { status: 403 });
    }

    const existingProduct = await prisma.product.findUnique({ where: { id: params.id } });

    if (!existingProduct || existingProduct.creatorSlug !== user.creator.slug) {
      return new NextResponse(JSON.stringify({ error: 'Product not found or unauthorized' }), { status: 404 });
    }

    const { title, price, description, options, img, featured } = await req.json();

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: {
        title,
        price: parseFloat(String(price)),
        description,
        options: options || [],
        img,
        featured: featured || false,
      }
    });

    return new NextResponse(JSON.stringify({ success: true, product: updatedProduct }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ error: 'Failed to update product' }), { status: 500 });
  }
}

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const session = await getSession();
    console.log('SESSION:', session);

    if (!session) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { creator: true }
    });
     console.log('USER:', user);

    if (!user || user.userType !== 'creator' || !user.creator) {
      return new NextResponse(JSON.stringify({ error: 'Only creators can delete products' }), { status: 403 });
    }

    const existingProduct = await prisma.product.findUnique({ where: { id: params.id } });
     console.log('PRODUCT:', existingProduct); 
    console.log('CREATOR SLUG MATCH:', existingProduct?.creatorSlug, '===', user?.creator?.slug);
    if (!existingProduct || existingProduct.creatorSlug !== user.creator.slug) {
      return new NextResponse(JSON.stringify({ error: 'Product not found or unauthorized' }), { status: 404 });
    }

    await prisma.product.delete({ where: { id: params.id } });

    return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ error: 'Failed to delete product' }), { status: 500 });
  }
}