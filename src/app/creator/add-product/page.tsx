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
      newOptions[index][field] = Number(value);
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
    return <div className='p-8'>Loading...</div>
  }

  return (
    <div className='min-h-[calc(100vh-6rem)] p-4 md:p-8'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='font-bold text-3xl mb-8'>Add New Product</h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-6 bg-white p-8 rounded-lg shadow'>
          
          {/* Product Title */}
          <div>
            <label className='block font-bold mb-2'>Product Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter product name"
              className='w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-red-500'
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className='block font-bold mb-2'>Price ($) *</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              step="0.01"
              min="0"
              className='w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-red-500'
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className='block font-bold mb-2'>Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              rows={5}
              className='w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-red-500'
              required
            />
          </div>

          {/* Featured */}
          <div className='flex items-center gap-2'>
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className='w-5 h-5'
            />
            <label htmlFor="featured" className='font-bold'>Featured Product</label>
          </div>

          {/* Product Options */}
          <div className='border-t pt-6'>
            <h2 className='text-lg font-semibold mb-4'>Product Options (Optional)</h2>
            {options.map((option, index) => (
              <div key={index} className='flex items-center gap-2 mb-3'>
                <input
                  type="text"
                  value={option.title}
                  onChange={(e) => handleOptionChange(index, 'title', e.target.value)}
                  placeholder="Option Title (e.g., Size, Color)"
                  className='flex-1 border border-gray-300 p-2 rounded'
                />
                <input
                  type="number"
                  value={option.additionalPrice}
                  onChange={(e) => handleOptionChange(index, 'additionalPrice', e.target.value)}
                  placeholder="Additional Price"
                  step="0.01"
                  className='w-32 border border-gray-300 p-2 rounded'
                />
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className='bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600'
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
            >
              + Add Option
            </button>
          </div>

          {/* Image Upload */}
          <div className='border-t pt-6'>
            <label className='block font-bold mb-2'>Product Image *</label>
            <div className='flex gap-2 mb-4'>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className='flex-1 border border-gray-300 p-2 rounded'
              />
              <button
                type="button"
                onClick={handleImageUpload}
                disabled={!image || loading}
                className='bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50'
              >
                {loading ? 'Uploading...' : 'Upload'}
              </button>
            </div>

            {imageUrl && (
              <div className='flex gap-4 items-start'>
                <div>
                  <p className='text-sm text-gray-600 mb-2'>Image Preview:</p>
                  <Image
                    src={imageUrl}
                    width={200}
                    height={200}
                    alt="Product preview"
                    className='w-40 h-40 object-cover rounded'
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl('');
                    setImage(null);
                  }}
                  className='text-red-500 hover:underline mt-2'
                >
                  Change Image
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !imageUrl}
            className='bg-red-500 text-white p-3 rounded-lg font-bold uppercase hover:bg-red-600 disabled:opacity-50'
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddProductPage