"use client";
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react'
import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  description: string;
  img: string;
  price: number;
}

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

  useEffect(() => {
    if (session?.user?.email) {
      fetchProducts();
    }
  }, [session]);

  const fetchProducts = async () => {
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
  };

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
    return <div className='p-8'>Loading...</div>
  }

  return (
    <div className='min-h-[calc(100vh-6rem)] p-4 md:p-8'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='font-bold text-3xl'>Creator Dashboard</h1>
          <Link href="/creator/add-product" className='bg-red-500 text-white p-3 rounded-lg'>
            + Add Product
          </Link>
        </div>

        {products.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-xl text-gray-500 mb-4'>No products yet</p>
            <Link href="/creator/add-product" className='bg-red-500 text-white px-6 py-2 rounded-lg inline-block'>
              Create Your First Product
            </Link>
          </div>
        ) : (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {products.map((product) => (
              <div key={product.id} className='border border-gray-300 rounded-lg overflow-hidden shadow hover:shadow-lg transition'>
                <div className='relative h-48 bg-gray-200'>
                  <img src={product.img} alt={product.title} className='w-full h-full object-cover' />
                </div>
                <div className='p-4'>
                  <h3 className='font-bold text-lg mb-2'>{product.title}</h3>
                  <p className='text-gray-600 text-sm mb-3 line-clamp-2'>{product.description}</p>
                  <p className='font-bold text-xl text-red-500 mb-4'>${product.price}</p>
                  <div className='flex gap-2'>
                    <Link 
                      href={`/creator/edit-product/${product.id}`}
                      className='flex-1 bg-blue-500 text-white p-2 rounded text-center hover:bg-blue-600'
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      className='flex-1 bg-red-500 text-white p-2 rounded hover:bg-red-600'
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