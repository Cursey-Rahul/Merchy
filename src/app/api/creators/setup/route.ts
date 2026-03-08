import { prisma } from '@/utils/connect'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (req: NextRequest) => {
  try {
    const { email, title, description, image } = await req.json()

    if (!email || !title || !description || !image) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing required fields' }), 
        { status: 400 }
      )
    }

    // Upload image to Cloudinary (or your storage service)
    // For now, we'll use the base64 directly or upload to Cloudinary
    const imageUrl = await uploadImage(image)

    // Update creator profile
    const user = await prisma.user.findUnique({
      where: { email },
      include: { creator: true }
    })

    if (!user?.creator) {
      return new NextResponse(
        JSON.stringify({ error: 'Creator profile not found' }), 
        { status: 404 }
      )
    }

    const updatedCreator = await prisma.creator.update({
      where: { slug: user.creator.slug },
      data: {
        title,
        description,
        image: imageUrl
      }
    })

    return new NextResponse(JSON.stringify(updatedCreator), { status: 200 })
  } catch (error) {
    console.error(error)
    return new NextResponse(
      JSON.stringify({ error: 'Failed to setup creator profile' }), 
      { status: 500 }
    )
  }
}

// Upload image to Cloudinary
async function uploadImage(base64Image: string): Promise<string> {
  try {
    const formData = new FormData()
    formData.append('file', base64Image)
    formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET!)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    )

    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error('Image upload error:', error)
    // Return base64 if upload fails
    return base64Image
  }
}