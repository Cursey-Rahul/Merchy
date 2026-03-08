import { prisma } from '@/utils/connect';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const creators = await prisma.creator.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        image: true
      }
    });
    return new NextResponse(JSON.stringify(creators), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ message: "Error fetching creators" }), { status: 500 });
  }
}