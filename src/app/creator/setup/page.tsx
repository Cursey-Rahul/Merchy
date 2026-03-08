"use client";
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import Image from 'next/image';

const CreatorSetupPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: session?.user?.name || '',
    description: '',
    image: ''
  });
  const [preview, setPreview] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Convert to base64 for preview and upload
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.image) {
      alert('Please fill all fields including image');
      return;
    }

    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://merchy-blond.vercel.app'
      const response = await fetch(`${baseUrl}/api/creator/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session?.user?.email,
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
        alert(data.error || 'Failed to setup profile');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error setting up profile');
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
            <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center'>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className='hidden'
                id="image-input"
                required
              />
              <label 
                htmlFor="image-input" 
                className='cursor-pointer block'
              >
                <div className='text-gray-600'>
                  {preview ? (
                    <div className='space-y-4'>
                      <div className='relative w-full h-48'>
                        <Image
                          src={preview}
                          alt="Preview"
                          fill
                          className='object-cover rounded'
                        />
                      </div>
                      <p className='text-sm'>Click to change image</p>
                    </div>
                  ) : (
                    <div className='space-y-2'>
                      <p className='text-lg'>📸 Click to upload or drag and drop</p>
                      <p className='text-sm text-gray-500'>PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
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