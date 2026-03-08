import { prisma } from '@/utils/connect'
import { getSession } from '@/lib/auth'
import { NextResponse } from 'next/server'

export const GET = async () => {
  try {
    const session = await getSession()
    
    if (!session?.user?.email) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { creator: true }
    })

    if (!user?.creator) {
      return new NextResponse(JSON.stringify([]), { status: 200 })
    }

    const products = await prisma.product.findMany({
      where: { creatorSlug: user.creator.slug }
    })

    return new NextResponse(JSON.stringify(products), { status: 200 })
  } catch (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch products' }), { status: 500 })
  }
}