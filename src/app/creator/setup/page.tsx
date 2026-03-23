"use client";
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { useState, useRef } from 'react'
import Image from 'next/image';

const CreatorSetupPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: session?.user?.name || '',
    description: '',
    image: ''
  });
  const [preview, setPreview] = useState('');
  const [aiPreview, setAiPreview] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [useAiImage, setUseAiImage] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAiPreview('');
      setUseAiImage(false);
      setFormData(prev => ({ ...prev, image: '' }));
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const uploadToCloudinary = async (fileOrBlob: File | Blob, filename = 'image.png'): Promise<string> => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', fileOrBlob, filename);
    formDataUpload.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset');
    formDataUpload.append('folder', 'creator-profiles');

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formDataUpload }
    );
    const data = await res.json();
    if (!data.secure_url) throw new Error('Cloudinary upload failed');
    return data.secure_url;
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      // Add cache buster to help with CORS
      img.src = src + (src.includes('?') ? '&' : '?') + 't=' + Date.now();
    });
  };

  const drawSplatters = (ctx: CanvasRenderingContext2D, cx: number, cy: number, color: string, count: number, spread: number) => {
    ctx.fillStyle = color;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * spread + 15;
      const sx = cx + Math.cos(angle) * dist;
      const sy = cy + Math.sin(angle) * dist;
      const radius = Math.random() * 7 + 2;
      ctx.beginPath();
      ctx.arc(sx, sy, radius, 0, Math.PI * 2);
      ctx.fill();
      if (Math.random() > 0.5) {
        ctx.fillRect(sx - radius / 3, sy, radius / 1.5, Math.random() * 25 + 8);
      }
    }
  };

  const handleGenerateAI = async () => {
    if (!file) { alert('Please select an image first'); return; }
    if (!formData.title) { alert('Please enter your brand name first — it will appear in the image'); return; }

    setGenerating(true);
    setGenerationStep('Uploading your photo...');

    try {
      // Step 1: Upload original to Cloudinary
      const originalUrl = await uploadToCloudinary(file, file.name);

      // Step 2: Get bg-removed URL
      setGenerationStep('Removing background...');
      const res = await fetch('/api/generate-profile-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cloudinaryUrl: originalUrl, creatorName: formData.title })
      });
      const { bgRemovedUrl } = await res.json();

      // Step 3: Wait for Cloudinary to process bg removal
      setGenerationStep('Processing...');
      await new Promise(r => setTimeout(r, 4000));

      // Step 4: Load font
      setGenerationStep('Compositing image...');
      try {
        const font = new FontFace('Bangers', 'url(https://fonts.gstatic.com/s/bangers/v24/FeVQS0BTqb0h60ACL5la2bxii28wYQ.woff2)');
        await font.load();
        document.fonts.add(font);
      } catch {
        console.warn('Font load failed, using fallback');
      }

      // Step 5: Load person image (try bg removed, fallback to original)
      let personImg: HTMLImageElement;
      try {
        personImg = await loadImage(bgRemovedUrl);
      } catch {
        console.warn('BG removal failed, using original');
        personImg = await loadImage(originalUrl);
      }

      // Step 6: Composite on canvas
      const canvas = canvasRef.current!;
      const W = 1280;
      const H = 720;
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d')!;

      // --- Grey concrete background ---
      ctx.fillStyle = '#707070';
      ctx.fillRect(0, 0, W, H);

      // Noise texture
      for (let i = 0; i < 10000; i++) {
        const tx = Math.random() * W;
        const ty = Math.random() * H;
        const b = Math.random() * 50 - 25;
        const shade = Math.max(0, Math.min(255, 112 + b));
        ctx.fillStyle = `rgba(${shade},${shade},${shade},0.25)`;
        ctx.fillRect(tx, ty, Math.random() * 4 + 1, Math.random() * 4 + 1);
      }

      // Wall lines
      ctx.strokeStyle = 'rgba(0,0,0,0.06)';
      ctx.lineWidth = 1;
      for (let i = 0; i < H; i += 45) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke();
      }

      // --- Person on right (B&W + yellow outline) ---
      const personAreaX = W * 0.46;
      const personAreaW = W * 0.54;
      const aspectRatio = personImg.naturalHeight / personImg.naturalWidth;
      const personH = Math.min(H * 1.05, personAreaW * aspectRatio);
      const personY = H - personH;

      // Draw to temp canvas for B&W
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = personAreaW;
      tempCanvas.height = personH;
      const tempCtx = tempCanvas.getContext('2d')!;
      tempCtx.drawImage(personImg, 0, 0, personAreaW, personH);

      // B&W conversion with contrast boost
      const imageData = tempCtx.getImageData(0, 0, personAreaW, personH);
      const pixels = imageData.data;
      for (let i = 0; i < pixels.length; i += 4) {
        const gray = pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114;
        const contrast = Math.min(255, Math.max(0, (gray - 128) * 1.4 + 128));
        pixels[i] = contrast;
        pixels[i + 1] = contrast;
        pixels[i + 2] = contrast;
      }
      tempCtx.putImageData(imageData, 0, 0);

      // Yellow outline (draw yellow silhouette offset in all directions)
      const outlineOffsets = [
        [-10, -10], [0, -10], [10, -10],
        [-10, 0], [10, 0],
        [-10, 10], [0, 10], [10, 10],
        [-14, 0], [14, 0], [0, -14], [0, 14],
      ];

      for (const [ox, oy] of outlineOffsets) {
        const outCanvas = document.createElement('canvas');
        outCanvas.width = personAreaW;
        outCanvas.height = personH;
        const outCtx = outCanvas.getContext('2d')!;
        outCtx.drawImage(tempCanvas, 0, 0);
        outCtx.globalCompositeOperation = 'source-in';
        outCtx.fillStyle = '#FFD700';
        outCtx.fillRect(0, 0, personAreaW, personH);
        ctx.drawImage(outCanvas, personAreaX + ox, personY + oy);
      }

      // Draw B&W person
      ctx.drawImage(tempCanvas, personAreaX, personY);

      // --- Name text on left ---
      const nameAreaW = W * 0.46;
      const name = formData.title.toUpperCase();
      const fontSize = Math.min(170, Math.max(60, nameAreaW / (name.length * 0.55)));
      const nameX = nameAreaW / 2;
      const nameY = H * 0.44;

      ctx.font = `900 ${fontSize}px 'Bangers', Impact, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const textW = ctx.measureText(name).width;

      // Splatters behind text
      drawSplatters(ctx, nameX, nameY, '#FFD700', 25, Math.max(textW, 200) * 0.6);

      // Black outline
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = fontSize * 0.16;
      ctx.lineJoin = 'round';
      ctx.strokeText(name, nameX, nameY);

      // Gradient fill
      const grad = ctx.createLinearGradient(nameX, nameY - fontSize / 2, nameX, nameY + fontSize / 2);
      grad.addColorStop(0, '#FFE000');
      grad.addColorStop(0.45, '#FF8C00');
      grad.addColorStop(1, '#CC0000');
      ctx.fillStyle = grad;
      ctx.fillText(name, nameX, nameY);

      // Red brush underline
      const underY = nameY + fontSize * 0.62;
      ctx.save();
      ctx.strokeStyle = '#CC0000';
      ctx.lineWidth = fontSize * 0.1;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(nameX - textW / 2 - 10, underY);
      ctx.bezierCurveTo(
        nameX - textW * 0.1, underY + 10,
        nameX + textW * 0.2, underY - 6,
        nameX + textW / 2 + 10, underY + 4
      );
      ctx.stroke();
      ctx.restore();

      // Convert to blob URL for preview
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setAiPreview(url);
          setUseAiImage(true);
        }
      }, 'image/png');

      setGenerationStep('');
    } catch (error) {
      console.error('Generation error:', error);
      alert('Error generating image. Please try again.');
      setGenerationStep('');
    } finally {
      setGenerating(false);
    }
  };

  const handleUploadFinal = async () => {
    setUploading(true);
    try {
      let cloudinaryUrl = '';

      if (useAiImage && aiPreview) {
        const res = await fetch(aiPreview);
        const blob = await res.blob();
        cloudinaryUrl = await uploadToCloudinary(blob, 'styled-profile.png');
      } else if (file) {
        cloudinaryUrl = await uploadToCloudinary(file, file.name);
      }

      setFormData(prev => ({ ...prev, image: cloudinaryUrl }));
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.image) {
      alert('Please fill all fields and upload image');
      return;
    }

    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://merchy-blond.vercel.app';
      const response = await fetch(`${baseUrl}/api/creator/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          image: formData.image
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Creator profile setup complete!');
        router.push('/creator/dashboard');
      } else {
        alert(`Error: ${data.error || 'Failed to setup profile'}${data.details ? ' - ' + data.details : ''}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Error setting up profile: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-8rem)] bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 flex items-center justify-center'>
      <div className='w-full max-w-2xl'>

        {/* Hidden canvas */}
        <canvas ref={canvasRef} className='hidden' />

        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='font-bold text-2xl sm:text-3xl md:text-4xl mb-2 text-gray-900'>Setup Your Creator Profile</h1>
          <p className='text-sm sm:text-base text-gray-600'>Complete your profile to start selling</p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-6 bg-white p-6 sm:p-8 rounded-lg shadow-lg'>

          {/* Brand Name */}
          <div>
            <label className='block font-semibold text-gray-800 mb-2 text-sm sm:text-base'>
              Brand Name <span className='text-red-500'>*</span>
              <span className='text-gray-400 font-normal text-xs ml-2'>(appears in your profile image)</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Your brand name"
              className='w-full border-2 border-gray-300 p-2.5 sm:p-3 rounded-lg focus:outline-none focus:border-red-500 transition text-sm sm:text-base'
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className='block font-semibold text-gray-800 mb-2 text-sm sm:text-base'>
              Brand Description <span className='text-red-500'>*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us about your brand..."
              rows={4}
              className='w-full border-2 border-gray-300 p-2.5 sm:p-3 rounded-lg focus:outline-none focus:border-red-500 transition text-sm sm:text-base resize-none'
              required
            />
          </div>

          {/* Brand Image */}
          <div>
            <label className='block font-semibold text-gray-800 mb-2 text-sm sm:text-base'>
              Brand Image <span className='text-red-500'>*</span>
            </label>
            <div className='space-y-3'>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className='w-full border-2 border-gray-300 p-2.5 rounded-lg text-sm sm:text-base file:mr-2 file:py-2 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200'
              />

              {/* Original preview */}
              {preview && !aiPreview && (
                <div className='space-y-2'>
                  <p className='text-xs text-gray-500 font-semibold'>Your photo:</p>
                  <div className='relative w-full h-40 sm:h-48'>
                    <Image src={preview} alt="Preview" fill className='object-cover rounded-lg' />
                  </div>
                </div>
              )}

              {/* Warning if no title */}
              {file && !formData.title && (
                <p className='text-xs text-orange-500 font-semibold'>⚠ Enter your brand name above first</p>
              )}

              {/* Generate button */}
              {file && !formData.image && (
                <button
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={generating || !formData.title}
                  className='w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 active:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-sm sm:text-base flex items-center justify-center gap-2'
                >
                  {generating ? (
                    <>
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                      {generationStep || 'Generating...'}
                    </>
                  ) : (
                    '✨ Generate Styled Profile Image'
                  )}
                </button>
              )}

              {/* AI preview */}
              {aiPreview && (
                <div className='space-y-3'>
                  <p className='text-xs text-gray-500 font-semibold'>✨ Generated result:</p>
                  <div className='relative w-full rounded-lg overflow-hidden border-2 border-purple-200' style={{ aspectRatio: '16/9' }}>
                    <Image src={aiPreview} alt="Generated" fill className='object-cover' unoptimized />
                  </div>
                  <div className='flex gap-2'>
                    <button
                      type="button"
                      onClick={handleGenerateAI}
                      disabled={generating}
                      className='flex-1 bg-purple-100 text-purple-700 px-4 py-2.5 rounded-lg hover:bg-purple-200 disabled:opacity-50 transition font-semibold text-sm'
                    >
                      {generating ? 'Regenerating...' : '🔄 Regenerate'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAiPreview(''); setUseAiImage(false); }}
                      className='flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition font-semibold text-sm'
                    >
                      ✕ Use Original
                    </button>
                  </div>
                </div>
              )}

              {/* Upload button */}
              {(preview || aiPreview) && !formData.image && (
                <button
                  type="button"
                  onClick={handleUploadFinal}
                  disabled={uploading}
                  className='w-full bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold text-sm sm:text-base'
                >
                  {uploading ? 'Uploading...' : useAiImage ? '⬆ Upload Generated Image' : '⬆ Upload Original Photo'}
                </button>
              )}

              {/* Success */}
              {formData.image && (
                <div className='bg-green-50 border-2 border-green-200 p-3 rounded-lg flex items-center justify-between'>
                  <p className='text-xs text-green-700 font-semibold'>✓ Image uploaded successfully</p>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                    className='text-red-500 hover:underline text-xs font-semibold'
                  >
                    Change
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !formData.image}
            className='bg-red-500 text-white p-3 sm:p-3.5 rounded-lg font-bold uppercase hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base'
          >
            {loading ? 'Setting up...' : 'Complete Setup'}
          </button>

          <p className='text-xs text-gray-600 text-center'>You can edit this later from your dashboard</p>
        </form>
      </div>
    </div>
  );
};

export default CreatorSetupPage;