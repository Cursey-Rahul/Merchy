import { prisma } from '@/utils/connect'
import { NextResponse } from 'next/server'

export const GET = async () => {
  try {
    const creators = await prisma.creator.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        image: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return new NextResponse(JSON.stringify(creators), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error:', error)
    return new NextResponse(
      JSON.stringify({ error: String(error) }), 
      { status: 500 }
    )
  }
}