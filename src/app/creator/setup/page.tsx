"use client";
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
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
  const [aiPreview, setAiPreview] = useState(''); // AI generated image preview (base64)
  const [file, setFile] = useState<File | null>(null);
  const [useAiImage, setUseAiImage] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAiPreview(''); // reset AI preview when new file selected
      setUseAiImage(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Remove the data:image/...;base64, prefix
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

 const handleGenerateAI = async () => {
    if (!file) {
      alert('Please select an image first');
      return;
    }

    const creatorName = formData.title || session?.user?.name || 'CREATOR';
    setGenerating(true);

    try {
      const base64Image = await fileToBase64(file);
      const mimeType = file.type || 'image/jpeg';

      // call your own API route instead of Gemini directly
      const res = await fetch('/api/generate-profile-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Image, mimeType, creatorName })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`Error: ${data.error || 'Failed to generate image'}`);
        return;
      }

      setAiPreview(`data:${data.mimeType};base64,${data.base64}`);
      setUseAiImage(true);

    } catch (error) {
      console.error('AI generation error:', error);
      alert('Error generating AI image. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  // Upload base64 image to Cloudinary
  const uploadBase64ToCloudinary = async (base64DataUrl: string): Promise<string> => {
    const formDataUpload = new FormData();
    
    // Convert base64 to blob
    const res = await fetch(base64DataUrl);
    const blob = await res.blob();
    
    formDataUpload.append('file', blob, 'ai-profile.png');
    formDataUpload.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset');
    formDataUpload.append('folder', 'creator-profiles');

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formDataUpload }
    );

    const uploadData = await uploadRes.json();
    if (!uploadData.secure_url) throw new Error('Cloudinary upload failed');
    return uploadData.secure_url;
  };

  const handleImageUpload = async () => {
    if (!file && !aiPreview) {
      alert('Please select an image');
      return;
    }

    setUploading(true);
    try {
      let cloudinaryUrl = '';

      if (useAiImage && aiPreview) {
        // Upload AI generated image
        cloudinaryUrl = await uploadBase64ToCloudinary(aiPreview);
      } else if (file) {
        // Upload original image
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        formDataUpload.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset');
        formDataUpload.append('folder', 'creator-profiles');

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: 'POST', body: formDataUpload }
        );
        const data = await res.json();
        if (!data.secure_url) throw new Error('Upload failed');
        cloudinaryUrl = data.secure_url;
      }

      setFormData({ ...formData, image: cloudinaryUrl });
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
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://merchy-blond.vercel.app'
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
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='font-bold text-2xl sm:text-3xl md:text-4xl mb-2 text-gray-900'>Setup Your Creator Profile</h1>
          <p className='text-sm sm:text-base text-gray-600'>Complete your profile to start selling</p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className='flex flex-col gap-6 bg-white p-6 sm:p-8 rounded-lg shadow-lg'>

          {/* Brand Name */}
          <div>
            <label className='block font-semibold text-gray-800 mb-2 text-sm sm:text-base'>
              Brand Name <span className='text-red-500'>*</span>
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

          {/* Brand Image Upload */}
          <div>
            <label className='block font-semibold text-gray-800 mb-2 text-sm sm:text-base'>
              Brand Image <span className='text-red-500'>*</span>
            </label>
            <div className='space-y-3'>

              {/* File Input */}
              <div className='flex flex-col sm:flex-row gap-2'>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className='flex-1 border-2 border-gray-300 p-2.5 rounded-lg text-sm sm:text-base file:mr-2 file:py-2 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200'
                />
              </div>

              {/* Original Preview */}
              {preview && !aiPreview && (
                <div className='space-y-2'>
                  <p className='text-xs sm:text-sm text-gray-600 font-semibold'>Your photo:</p>
                  <div className='relative w-full h-40 sm:h-48'>
                    <Image src={preview} alt="Preview" fill className='object-cover rounded-lg' />
                  </div>
                </div>
              )}

              {/* AI Generate Button */}
              {file && !formData.image && (
                <button
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={generating}
                  className='w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 active:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-sm sm:text-base flex items-center justify-center gap-2'
                >
                  {generating ? (
                    <>
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                      Generating AI Image... (this may take 30s)
                    </>
                  ) : (
                    '✨ Generate AI Profile Image'
                  )}
                </button>
              )}

              {/* AI Generated Preview */}
              {aiPreview && (
                <div className='space-y-3'>
                  <p className='text-xs sm:text-sm text-gray-600 font-semibold'>✨ AI Generated Result:</p>
                  <div className='relative w-full rounded-lg overflow-hidden' style={{ aspectRatio: '16/9' }}>
                    <Image src={aiPreview} alt="AI Generated" fill className='object-cover' />
                  </div>
                  <div className='flex gap-2'>
                    <button
                      type="button"
                      onClick={handleGenerateAI}
                      disabled={generating}
                      className='flex-1 bg-purple-100 text-purple-700 px-4 py-2.5 rounded-lg hover:bg-purple-200 disabled:opacity-50 transition-all duration-300 font-semibold text-sm'
                    >
                      {generating ? 'Regenerating...' : '🔄 Regenerate'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAiPreview(''); setUseAiImage(false); }}
                      className='flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-all duration-300 font-semibold text-sm'
                    >
                      ✕ Use Original Instead
                    </button>
                  </div>
                </div>
              )}

              {/* Upload Button — shows after AI preview or if no AI */}
              {(preview || aiPreview) && !formData.image && (
                <button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={uploading}
                  className='w-full bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 active:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-sm sm:text-base'
                >
                  {uploading ? 'Uploading...' : useAiImage ? '⬆ Upload AI Image' : '⬆ Upload Original Image'}
                </button>
              )}

              {/* Success Message */}
              {formData.image && (
                <div className='bg-green-50 border-2 border-green-200 p-3 sm:p-4 rounded-lg flex items-center justify-between'>
                  <p className='text-xs sm:text-sm text-green-700 font-semibold'>✓ Image uploaded successfully</p>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: '' })}
                    className='text-red-500 hover:underline text-xs font-semibold'
                  >
                    Change
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !formData.image}
            className='bg-red-500 text-white p-3 sm:p-3.5 rounded-lg font-bold uppercase hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base'
          >
            {loading ? 'Setting up...' : 'Complete Setup'}
          </button>

          <p className='text-xs sm:text-sm text-gray-600 text-center'>
            You can edit this later from your dashboard
          </p>
        </form>
      </div>
    </div>
  )
}

export default CreatorSetupPage