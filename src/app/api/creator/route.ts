import { prisma } from '@/utils/connect'
import { NextResponse } from 'next/server'

export const GET = async () => {
  try {
    console.log('Fetching creators...')
    
    const creators = await prisma.creator.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        image: true,
        userId: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    console.log('Found creators:', creators.length, creators)
    
    return new NextResponse(JSON.stringify(creators), { status: 200 })
  } catch (error) {
    console.error('Error fetching creators:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch creators', details: String(error) }), 
      { status: 500 }
    )
  }
}