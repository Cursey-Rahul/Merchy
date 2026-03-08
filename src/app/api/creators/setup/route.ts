import { prisma } from '@/utils/connect'
import { getSession } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (req: NextRequest) => {
  try {
    const session = await getSession()
    console.log('Session in setup:', session?.user?.email)
    
    if (!session?.user?.email) {
      console.log('No session found')
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized - No session' }), 
        { status: 401 }
      )
    }

    const body = await req.json()
    console.log('Body received:', { title: body.title, description: body.description, imageSize: body.image?.length })
    
    const { title, description, image } = body

    if (!title || !description || !image) {
      console.log('Missing fields:', { title: !!title, description: !!description, image: !!image })
      return new NextResponse(
        JSON.stringify({ error: 'Missing required fields' }), 
        { status: 400 }
      )
    }

    console.log('Finding user with email:', session.user.email)
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { creator: true }
    })

    console.log('User:', user?.email, 'Creator:', user?.creator?.id)

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: 'User not found' }), 
        { status: 404 }
      )
    }

    if (!user.creator) {
      return new NextResponse(
        JSON.stringify({ error: 'Creator profile not found - User must select creator role first' }), 
        { status: 404 }
      )
    }

    console.log('Updating creator with id:', user.creator.id)

    const updatedCreator = await prisma.creator.update({
      where: { id: user.creator.id },
      data: {
        title,
        description,
        image
      }
    })

    console.log('Creator updated successfully:', updatedCreator.id)

    return new NextResponse(JSON.stringify(updatedCreator), { status: 200 })
  } catch (error) {
    console.error('Setup error:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to setup profile',
        details: errorMessage
      }), 
      { status: 500 }
    )
  }
}