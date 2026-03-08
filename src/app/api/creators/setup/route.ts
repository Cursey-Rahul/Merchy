import { prisma } from '@/utils/connect'
import { getSession } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (req: NextRequest) => {
  try {
    const session = await getSession()
    
    if (!session?.user?.email) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }), 
        { status: 401 }
      )
    }

    const { title, description, image } = await req.json()

    if (!title || !description || !image) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing required fields' }), 
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { creator: true }
    })

    if (!user?.creator) {
      return new NextResponse(
        JSON.stringify({ error: 'Creator profile not found' }), 
        { status: 404 }
      )
    }

    // Upload image
    let imageUrl = image
    if (image.startsWith('data:')) {
      imageUrl = await uploadToCloudinary(image)
    }

    const updatedCreator = await prisma.creator.update({
      where: { userId: user.id },
      data: {
        title,
        description,
        image: imageUrl
      }
    })

    return new NextResponse(JSON.stringify(updatedCreator), { status: 200 })
  } catch (error) {
    console.error('Setup error:', error)
    return new NextResponse(
      JSON.stringify({ error: String(error) }), 
      { status: 500 }
    )
  }
}

async function uploadToCloudinary(base64: string): Promise<string> {
  try {
    const formData = new FormData()
    formData.append('file', base64)
    formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET!)
    formData.append('folder', 'creator-profiles')

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    )

    const data = await res.json()
    if (data.error) {
      console.error('Cloudinary error:', data.error)
      return base64
    }
    return data.secure_url || base64
  } catch (error) {
    console.error('Upload error:', error)
    return base64
  }
}