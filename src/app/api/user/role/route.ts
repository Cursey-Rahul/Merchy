import { prisma } from '@/utils/connect'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (req: NextRequest) => {
  try {
    const { email, userType, name, image } = await req.json()

    // Update user type
    const user = await prisma.user.update({
      where: { email },
      data: { userType }
    })

    // If creator, create creator profile
    if (userType === 'creator') {
      const slug = name?.toLowerCase().replace(/\s+/g, '-') || email.split('@')[0]
      
      await prisma.creator.create({
        data: {
          userId: user.id,
          slug,
          title: name || '',
          description: '',
          image: image || ''
        }
      })
    }

    return new NextResponse(JSON.stringify({ success: true }), { status: 200 })
  } catch (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ error: 'Failed to set role' }), { status: 500 })
  }
}