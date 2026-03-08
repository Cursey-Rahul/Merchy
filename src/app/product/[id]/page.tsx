
import Image from 'next/image'
import React from 'react'
import Price from '@/components/Price';
import { Product } from '@/types/types';

export const dynamic = 'force-dynamic';

const GETDATA = async (id: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL 
  try {
    const response = await fetch(`${baseUrl}/api/singleproduct?id=${id}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error('API error:', response.status)
      return null
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

const productPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const item: Product | null = await GETDATA(id);
  
  if (!item) {
    return (
      <div className='p-4 lg:px-20 xl:px-40 h-screen flex flex-col justify-center items-center'>
        <h1 className='text-2xl font-bold'>Product not found</h1>
      </div>
    )
  }
  
  if (!item) {
    return (
      <div className='p-4 lg:px-20 xl:px-40 h-screen flex flex-col justify-center items-center'>
        <h1 className='text-2xl font-bold'>Product not found</h1>
      </div>
    )
  }
  
  return (
    <div className='p-4 lg:px-20 xl:px-40 h-screen flex flex-col justify-center items-center md:flex-row '>
      <div className='relative w-full md:w-1/2 h-1/2'>
        <Image 
          src={item.img}
          alt={item.title}
          fill 
          className='object-contain' 
        />
      </div>
      <div className=' text-red-400 w-full md:w-1/2 p-5 flex flex-col justify-center text-center items-center gap-8'>
        <h1 className='font-bold text-3xl'>{item.title}</h1>
        <p className=' text-xl'>{item.description}</p>
        <Price product={item} />
      </div>
    </div>
  )
}

export default productPage