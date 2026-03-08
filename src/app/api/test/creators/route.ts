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
      }
    })
    
    return new NextResponse(JSON.stringify({
      count: creators.length,
      creators: creators
    }), { status: 200 })
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: String(error) }), 
      { status: 500 }
    )
  }
}
