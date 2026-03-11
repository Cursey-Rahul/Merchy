"use client";
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { Creator, Product } from '@/types/types';

const CreatorDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCreatorData = useCallback(async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://merchy-blond.vercel.app'
      
      // Fetch creator profile
      const creatorRes = await fetch(`${baseUrl}/api/creator/profile?email=${session?.user?.email}`);
      if (creatorRes.ok) {
        const creatorData = await creatorRes.json();
        setCreator(creatorData);

        // Fetch products
        const productsRes = await fetch(`${baseUrl}/api/creator/products?slug=${creatorData.slug}`);
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(productsData);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    if (status === 'authenticated' && session?.user?.userType !== 'creator') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchCreatorData();
    }
  }, [session?.user?.email, fetchCreatorData]);

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://merchy-blond.vercel.app'
      const response = await fetch(`${baseUrl}/api/products/${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className='min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-8rem)] bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8'>
      <div className='max-w-7xl mx-auto'>

        {/* Profile Header Card */}
        {creator && (
          <div className='bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6 sm:mb-8'>
            <div className='flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start'>
              {/* Profile Image */}
              <div className='relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden border-4 border-red-500 shadow-md'>
                <Image
                  src={creator.image || 'https://via.placeholder.com/150'}
                  alt={creator.title}
                  fill
                  className='object-cover'
                  unoptimized
                />
              </div>

              {/* Profile Info */}
              <div className='flex-1 w-full text-center sm:text-left'>
                <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2'>
                  {creator.title}
                </h1>
                <p className='text-red-500 font-semibold text-sm sm:text-base mb-3 sm:mb-4'>
                  @{creator.slug}
                </p>
                <p className='text-gray-700 text-sm sm:text-base mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3'>
                  {creator.description}
                </p>
                
                {/* Stats */}
                <div className='flex flex-wrap gap-4 sm:gap-6 mb-4 sm:mb-6 justify-center sm:justify-start'>
                  <div>
                    <p className='text-2xl sm:text-3xl font-bold text-red-500'>{products.length}</p>
                    <p className='text-xs sm:text-sm text-gray-600'>Products</p>
                  </div>
                  <div className='h-12 w-px bg-gray-300'></div>
                  <div>
                    <p className='text-2xl sm:text-3xl font-bold text-gray-900'>5.0</p>
                    <p className='text-xs sm:text-sm text-gray-600'>Rating</p>
                  </div>
                </div>

                {/* Edit Profile Button */}
                <button 
                  onClick={() => router.push('/creator/setup')}
                  className='w-full sm:w-auto bg-red-500 text-white px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-red-600 active:bg-red-700 transition-all duration-300 text-sm sm:text-base'
                >
                  Edit Profile Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Section */}
        <div>
          {/* Header with Add Button */}
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8'>
            <div>
              <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900'>
                Your Products
              </h2>
              <p className='text-gray-600 text-sm sm:text-base mt-1 sm:mt-2'>
                Manage and showcase your items
              </p>
            </div>
            <Link 
              href="/creator/add-product" 
              className='w-full sm:w-auto bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 active:bg-red-700 transition-all duration-300 text-center text-sm sm:text-base shadow-md hover:shadow-lg'
            >
              + Add Product
            </Link>
          </div>

          {/* Products Grid or Empty State */}
          {products.length === 0 ? (
            <div className='bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center'>
              <div className='mb-4 sm:mb-6'>
                <div className='text-4xl sm:text-5xl mb-4'>📦</div>
                <p className='text-xl sm:text-2xl text-gray-900 font-semibold mb-2'>No products yet</p>
                <p className='text-gray-600 text-sm sm:text-base mb-6 sm:mb-8'>
                  Start selling by adding your first product
                </p>
              </div>
              <Link 
                href="/creator/add-product" 
                className='inline-block bg-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-600 active:bg-red-700 transition-all duration-300 text-sm sm:text-base'
              >
                Create Your First Product
              </Link>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className='bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group'
                >
                  {/* Product Image */}
                  <div className='relative h-40 sm:h-48 bg-gray-200 overflow-hidden'>
                    <Image 
                      src={product.img} 
                      alt={product.title}
                      fill
                      className='object-cover group-hover:scale-105 transition-transform duration-300'
                      unoptimized
                    />
                    <div className='absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold'>
                      ${product.price}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className='p-4 sm:p-6'>
                    <h3 className='font-bold text-base sm:text-lg text-gray-900 mb-2 line-clamp-1'>
                      {product.title}
                    </h3>
                    <p className='text-gray-600 text-xs sm:text-sm mb-4 line-clamp-2'>
                      {product.description}
                    </p>

                    {/* Action Buttons */}
                    <div className='flex gap-2 sm:gap-3'>
                      <Link 
                        href={`/creator/edit-product/${product.id}`}
                        className='flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-all duration-300 text-center font-semibold text-xs sm:text-sm'
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className='flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 active:bg-red-700 transition-all duration-300 font-semibold text-xs sm:text-sm'
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreatorDashboard