import { NextRequest, NextResponse } from 'next/server';
 
export const POST = async (req: NextRequest) => {
  try {
    const { cloudinaryUrl, creatorName } = await req.json();
 
    if (!cloudinaryUrl || !creatorName) {
      return new NextResponse(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }
 
    // Apply Cloudinary background removal transformation
    // Replace /upload/ with /upload/e_background_removal/ in the URL
    const bgRemovedUrl = cloudinaryUrl.replace('/upload/', '/upload/e_background_removal/');
 
    return new NextResponse(JSON.stringify({
      bgRemovedUrl,
    }), { status: 200 });
 
  } catch (error) {
    console.error('Generate profile image error:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};
 