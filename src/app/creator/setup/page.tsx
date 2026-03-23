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
  const [formData, setFormData] = useState({
    title: session?.user?.name || '',
    description: '',
    image: ''
  });
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleImageUpload = async () => {
    if (!file) {
      alert('Please select an image');
      return;
    }

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset');
      formDataUpload.append('folder', 'creator-profiles');

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formDataUpload,
        }
      );

      const data = await res.json();
      
      if (data.secure_url) {
        setFormData({ ...formData, image: data.secure_url });
        alert('Image uploaded successfully!');
      } else {
        alert('Failed to upload image');
      }
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
      console.log('Setup response:', data, 'Status:', response.status)

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
            <label className='block font-semibold text-gray-800 mb-2 text-sm sm:text-base'>Brand Name <span className='text-red-500'>*</span></label>
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
            <label className='block font-semibold text-gray-800 mb-2 text-sm sm:text-base'>Brand Description <span className='text-red-500'>*</span></label>
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
            <label className='block font-semibold text-gray-800 mb-2 text-sm sm:text-base'>Brand Image (for menu) <span className='text-red-500'>*</span></label>
            <div className='space-y-3'>
              {/* File Input and Upload Button */}
              <div className='flex flex-col sm:flex-row gap-2'>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className='flex-1 border-2 border-gray-300 p-2.5 rounded-lg text-sm sm:text-base file:mr-2 file:py-2 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200'
                  required
                />
                <button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={!file || uploading}
                  className='bg-green-600 text-white px-4 sm:px-6 py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm sm:text-base transition whitespace-nowrap'
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>

              {/* Preview */}
              {preview && (
                <div className='space-y-2'>
                  <p className='text-xs sm:text-sm text-gray-600 font-semibold'>Preview:</p>
                  <div className='relative w-full h-40 sm:h-48 md:h-56'>
                    <Image
                      src={preview}
                      alt="Preview"
                      fill
                      className='object-cover rounded-lg'
                    />
                  </div>
                </div>
              )}

              {/* Success Message */}
              {formData.image && (
                <div className='bg-green-50 border-2 border-green-200 p-3 sm:p-4 rounded-lg'>
                  <p className='text-xs sm:text-sm text-green-700 font-semibold'>✓ Image uploaded successfully</p>
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

          {/* Footer Text */}
          <p className='text-xs sm:text-sm text-gray-600 text-center'>
            You can edit this later from your dashboard
          </p>
        </form>
      </div>
    </div>
  )
}

export default CreatorSetupPage