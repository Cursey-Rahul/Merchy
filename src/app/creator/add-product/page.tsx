"use client";
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import Image from 'next/image';

type Option = {
  title: string;
  additionalPrice: number;
};

const AddProductPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [options, setOptions] = useState<Option[]>([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [featured, setFeatured] = useState(false);

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    if (status === 'authenticated' && session?.user?.userType !== 'creator') {
      router.push('/');
    }
  }, [status, session, router]);

  const handleOptionChange = (index: number, field: 'title' | 'additionalPrice', value: string | number) => {
    const newOptions = [...options];
    if (field === 'additionalPrice') {
      newOptions[index][field] = value === '' ? 0 : Number(value);
    } else {
      newOptions[index][field] = value as string;
    }
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { title: '', additionalPrice: 0 }]);
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleImageUpload = async () => {
    if (!image) {
      alert('Please select an image');
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset');
    formData.append('folder', 'creator-products');

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        setImageUrl(data.secure_url);
        alert('Image uploaded successfully!');
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading image');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !price || !description || !imageUrl) {
      alert('Please fill all fields and upload image');
      return;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://merchy-blond.vercel.app'
      const res = await fetch(`${baseUrl}/api/add-product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          price: parseFloat(price),
          description,
          options,
          img: imageUrl,
          featured,
        }),
      });

      const data = await res.json();
      if (data.success || res.ok) {
        alert('Product added successfully!');
        router.push('/creator/dashboard');
      } else {
        alert(data.error || 'Failed to add product');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Error adding product');
    }
  };

  if (status === 'loading') {
    return (
      <div className='min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-8rem)] bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8'>
      <div className='max-w-3xl mx-auto'>
        
        {/* Header */}
        <div className='mb-6 sm:mb-8'>
          <h1 className='font-bold text-2xl sm:text-3xl md:text-4xl text-gray-900 mb-2'>Add New Product</h1>
          <p className='text-gray-600 text-sm sm:text-base'>Fill in the details to add a new product to your store</p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-6 bg-white p-6 sm:p-8 rounded-lg shadow-lg'>
          
          {/* Product Title */}
          <div>
            <label className='block font-semibold text-gray-800 mb-2 text-sm sm:text-base'>Product Title <span className='text-red-500'>*</span></label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter product name"
              className='w-full border-2 border-gray-300 p-2.5 sm:p-3 rounded-lg focus:outline-none focus:border-red-500 transition text-sm sm:text-base'
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className='block font-semibold text-gray-800 mb-2 text-sm sm:text-base'>Price ($) <span className='text-red-500'>*</span></label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              step="0.01"
              min="0"
              className='w-full border-2 border-gray-300 p-2.5 sm:p-3 rounded-lg focus:outline-none focus:border-red-500 transition text-sm sm:text-base'
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className='block font-semibold text-gray-800 mb-2 text-sm sm:text-base'>Description <span className='text-red-500'>*</span></label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              rows={5}
              className='w-full border-2 border-gray-300 p-2.5 sm:p-3 rounded-lg focus:outline-none focus:border-red-500 transition resize-none text-sm sm:text-base'
              required
            />
          </div>

          {/* Featured */}
          <div className='flex items-center gap-3 p-4 bg-red-50 rounded-lg'>
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className='w-5 h-5 cursor-pointer accent-red-500'
            />
            <label htmlFor="featured" className='font-semibold text-gray-800 cursor-pointer text-sm sm:text-base'>
              Mark as Featured Product
            </label>
          </div>

          {/* Product Options */}
          <div className='border-t-2 border-gray-200 pt-6'>
            <h2 className='text-lg sm:text-xl font-bold text-gray-900 mb-4'>Product Options <span className='text-gray-500 font-normal text-sm'>(Optional)</span></h2>
            
            {options.length > 0 && (
              <div className='space-y-3 mb-4'>
                {options.map((option, index) => (
                  <div key={index} className='flex flex-col sm:flex-row gap-2 sm:gap-3 p-4 bg-gray-50 rounded-lg'>
                    <input
                      type="text"
                      value={option.title}
                      onChange={(e) => handleOptionChange(index, 'title', e.target.value)}
                      placeholder="Option Title (e.g., Size, Color)"
                      className='flex-1 border-2 border-gray-300 p-2.5 rounded-lg focus:outline-none focus:border-red-500 transition text-sm sm:text-base'
                    />
                    <input
                      type="number"
                      value={option.additionalPrice === 0 ? '' : option.additionalPrice}
                      onChange={(e) => handleOptionChange(index, 'additionalPrice', e.target.value)}
                      placeholder="Additional Price"
                      step="0.01"
                      min="0"
                      className='w-full sm:w-40 border-2 border-gray-300 p-2.5 rounded-lg focus:outline-none focus:border-red-500 transition text-sm sm:text-base'
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className='bg-red-500 text-white px-4 py-2.5 rounded-lg hover:bg-red-600 active:bg-red-700 transition-all duration-300 font-semibold text-sm'
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <button
              type="button"
              onClick={addOption}
              className='w-full sm:w-auto bg-gray-600 text-white px-6 py-2.5 rounded-lg hover:bg-gray-700 active:bg-gray-800 transition-all duration-300 font-semibold text-sm'
            >
              + Add Option
            </button>
          </div>

          {/* Image Upload */}
          <div className='border-t-2 border-gray-200 pt-6'>
            <h2 className='text-lg sm:text-xl font-bold text-gray-900 mb-4'>Product Image <span className='text-red-500'>*</span></h2>
            
            <div className='flex flex-col sm:flex-row gap-2 mb-4'>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className='flex-1 border-2 border-gray-300 p-2.5 rounded-lg text-sm file:mr-2 file:py-2 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200'
              />
              <button
                type="button"
                onClick={handleImageUpload}
                disabled={!image || loading}
                className='w-full sm:w-auto bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 active:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-sm'
              >
                {loading ? 'Uploading...' : 'Upload'}
              </button>
            </div>

            {imageUrl && (
              <div className='p-4 bg-green-50 border-2 border-green-200 rounded-lg'>
                <p className='text-sm font-semibold text-green-700 mb-4'>✓ Image uploaded successfully</p>
                <div className='flex flex-col sm:flex-row gap-4 items-start'>
                  <div className='relative w-32 h-32 rounded-lg overflow-hidden'>
                    <Image
                      src={imageUrl}
                      fill
                      alt="Product preview"
                      className='object-cover'
                      unoptimized
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl('');
                      setImage(null);
                    }}
                    className='text-red-500 hover:underline font-semibold text-sm sm:text-base'
                  >
                    Change Image
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !imageUrl}
            className='w-full bg-red-500 text-white p-3 sm:p-3.5 rounded-lg font-bold uppercase hover:bg-red-600 active:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm sm:text-base shadow-md hover:shadow-lg'
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddProductPage