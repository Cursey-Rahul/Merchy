import Link from 'next/link'
import React from 'react'
import Image from 'next/image';
import { Product } from '@/types/types'

export const dynamic = 'force-dynamic';

const GETDATA = async (creator: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://merchy-blond.vercel.app'
  const response = await fetch(`${baseUrl}/api/products?creator=${creator}`);
  return response.json();
}

const CreatorPage = async ({
  params,
}: {
  params: Promise<{ creator: string }>;
}) => {
  const { creator } = await params;
  const foodProducts: Product[] = await GETDATA(creator);
  
  if (!foodProducts || foodProducts.length === 0) {
    return <div className='p-8 text-center'>No products from this creator</div>
  }
  
  return (
    <div className='flex flex-wrap h-full'>
      {foodProducts.map((items) => (
        <Link 
          href={`/product/${items.id}`} 
          key={items.id} 
          className='h-[60vh] w-full md:w-1/2 lg:w-1/3 p-4 border-b-2 border-r-2 border-red-500 hover:bg-fuchsia-50 transition-all duration-300'
        >
          <div className='relative h-[85%]'>
            <Image 
              className='object-contain p-4 hover:scale-105 duration-500 transition-transform' 
              src={items.img}
              alt={items.title}
              fill
            />
          </div>
          <div className='flex justify-between px-4 items-center text-red-500'>
            <h1 className='text-xl font-bold'>{items.title}</h1>
            <div className='flex justify-end items-center gap-2'>
              <span className='text-xl'>${items.price}</span>
              <button className='bg-red-500 text-white p-2 rounded-lg text-base uppercase hover:bg-red-600'>
                add to cart
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default CreatorPage