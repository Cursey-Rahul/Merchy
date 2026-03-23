import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  try {
    const { base64Image, mimeType, creatorName } = await req.json();

    if (!base64Image || !creatorName) {
      return new NextResponse(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const prompt = `Transform this photo into a professional creator profile banner image with these EXACT specifications:

1. PERSON: Convert the person to black and white only (no color on the person at all), keep their face structure, features and likeness exactly the same. Add a bold bright yellow outline/cutout effect around the entire person silhouette.

2. NAME TEXT: On the LEFT side of the image, add the name "${creatorName}" in large bold graffiti/street art style lettering. The letters should have a yellow to red/orange gradient (yellow at top, red at bottom). Add a thick black outline around each letter. Add yellow paint splatter dots around the text. Add a bold red brush stroke underline beneath the name.

3. BACKGROUND: Grey concrete/wall texture background for the entire image.

4. LAYOUT: Landscape/widescreen ratio (16:9). Person on the RIGHT side taking up about half the image. Name text on the LEFT side taking up about half the image.

5. STYLE: Urban street art / YouTube creator aesthetic. High contrast. Bold and energetic.

Keep the person's face completely recognizable and identical to the original photo.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: mimeType || 'image/jpeg',
                    data: base64Image,
                  }
                },
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            responseModalities: ['IMAGE', 'TEXT'],
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini error:', data);
      return new NextResponse(JSON.stringify({ error: data.error?.message || 'Gemini failed' }), { status: 500 });
    }

    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p: { inlineData?: { mimeType: string; data: string } }) => p.inlineData);

    if (!imagePart?.inlineData?.data) {
      return new NextResponse(JSON.stringify({ error: 'No image returned from Gemini' }), { status: 500 });
    }

    return new NextResponse(JSON.stringify({
      base64: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType || 'image/png'
    }), { status: 200 });

  } catch (error) {
    console.error('Generate image error:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};