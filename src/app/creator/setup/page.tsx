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
    <div className='min-h-[calc(100vh-6rem)] p-4 md:p-8 flex items-center justify-center'>
      <div className='w-full max-w-2xl'>
        <h1 className='font-bold text-3xl mb-2 text-center'>Setup Your Creator Profile</h1>
        <p className='text-center text-gray-600 mb-8'>Complete your profile to start selling</p>

        <form onSubmit={handleSubmit} className='flex flex-col gap-6 bg-white p-8 rounded-lg shadow'>
          
          {/* Brand Name */}
          <div>
            <label className='block font-bold mb-2'>Brand Name *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Your brand name"
              className='w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-red-500'
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className='block font-bold mb-2'>Brand Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us about your brand..."
              rows={4}
              className='w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-red-500'
              required
            />
          </div>

          {/* Brand Image Upload */}
          <div>
            <label className='block font-bold mb-2'>Brand Image (for menu) *</label>
            <div className='space-y-3'>
              <div className='flex gap-2'>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className='flex-1 border border-gray-300 p-2 rounded'
                  required
                />
                <button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={!file || uploading}
                  className='bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50 font-bold'
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>

              {preview && (
                <div className='space-y-2'>
                  <p className='text-sm text-gray-600'>Preview:</p>
                  <div className='relative w-full h-48'>
                    <Image
                      src={preview}
                      alt="Preview"
                      fill
                      className='object-cover rounded'
                    />
                  </div>
                </div>
              )}

              {formData.image && (
                <div className='bg-green-50 border border-green-200 p-3 rounded'>
                  <p className='text-sm text-green-700'>✓ Image uploaded successfully</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !formData.image}
            className='bg-red-500 text-white p-3 rounded-lg font-bold uppercase hover:bg-red-600 disabled:opacity-50'
          >
            {loading ? 'Setting up...' : 'Complete Setup'}
          </button>

          <p className='text-sm text-gray-600 text-center'>
            You can edit this later from your dashboard
          </p>
        </form>
      </div>
    </div>
  )
}

export default CreatorSetupPage