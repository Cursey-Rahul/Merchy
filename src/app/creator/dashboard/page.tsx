"use client";
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/types';

const CreatorDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    if (status === 'authenticated' && session?.user?.userType !== 'creator') {
      router.push('/');
    }
  }, [status, session, router]);

  const fetchProducts = useCallback(async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://merchy-blond.vercel.app'
      const response = await fetch(`${baseUrl}/api/creator/products`, {
        headers: { 'Authorization': `Bearer ${session?.user?.email}` }
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchProducts();
    }
  }, [session?.user?.email, fetchProducts]);

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
        
        {/* Header Section */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
          <div>
            <h1 className='font-bold text-2xl sm:text-3xl md:text-4xl text-gray-900'>Creator Dashboard</h1>
            <p className='text-gray-600 text-sm sm:text-base mt-1 sm:mt-2'>Manage your products</p>
          </div>
          <div className='flex flex-col sm:flex-row gap-3 w-full sm:w-auto'>
            <button 
              onClick={() => router.push('/creator/setup')}
              className='w-full sm:w-auto bg-orange-500 text-white px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-orange-600 active:bg-orange-700 transition-all duration-300 text-sm sm:text-base shadow-md hover:shadow-lg'
            >
              Edit Profile
            </button>
            <Link 
              href="/creator/add-product" 
              className='w-full sm:w-auto bg-red-500 text-white px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-red-600 active:bg-red-700 transition-all duration-300 text-center text-sm sm:text-base shadow-md hover:shadow-lg'
            >
              + Add Product
            </Link>
          </div>
        </div>

        {/* Products Section */}
        {products.length === 0 ? (
          <div className='bg-white rounded-lg shadow-lg p-8 sm:p-12 text-center'>
            <div className='mb-4 sm:mb-6'>
              <div className='text-4xl sm:text-5xl mb-4'>📦</div>
              <p className='text-xl sm:text-2xl text-gray-900 font-semibold mb-2'>No products yet</p>
              <p className='text-gray-600 text-sm sm:text-base mb-6 sm:mb-8'>Start selling by adding your first product</p>
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
                className='bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group'
              >
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
                <div className='p-4 sm:p-6'>
                  <h3 className='font-bold text-base sm:text-lg text-gray-900 mb-2 line-clamp-1'>{product.title}</h3>
                  <p className='text-gray-600 text-xs sm:text-sm mb-4 line-clamp-2'>{product.description}</p>
                  <div className='flex gap-2'>
                    <Link 
                      href={`/creator/edit-product/${product.id}`}
                      className='flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 active:bg-blue-700 transition-all duration-300 text-center font-semibold text-xs sm:text-sm'
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      className='flex-1 bg-red-500 text-white p-2 rounded hover:bg-red-600 active:bg-red-700 transition-all duration-300 font-semibold text-xs sm:text-sm'
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
  )
}

export default CreatorDashboard