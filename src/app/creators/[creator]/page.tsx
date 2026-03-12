import Link from 'next/link'
import React from 'react'
import Image from 'next/image';
import { Product } from '@/types/types'
import { prisma } from '@/utils/connect'
import AddToCartButton from '@/components/AddToCartButton'

export const dynamic = 'force-dynamic';

const GETDATA = async (creator: string): Promise<Product[]> => {
  try {
    const products = await prisma.product.findMany({
      where: { creatorSlug: creator }
    })
    
    // Convert Decimal to string and filter out null images
    return products
      .filter(p => p.img !== null)
      .map(p => ({
        ...p,
        price: p.price.toString(),
        img: p.img as string
      })) as Product[]
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

const CreatorProductsPage = async ({ params }: { params: Promise<{ creator: string }> }) => {
  const { creator } = await params;
  const foodProducts: Product[] = await GETDATA(creator);
  
  if (!foodProducts || foodProducts.length === 0) {
    return (
      <div className='p-8 text-center min-h-[calc(100vh-6rem)]'>
        <h1 className='text-2xl font-bold mb-4'>No products from this creator</h1>
      </div>
    )
  }
  
  return (
    <div className='flex flex-wrap h-full'>
      {foodProducts.map((items) => (
        <div 
          key={items.id} 
          className='h-[60vh] w-full md:w-1/2 lg:w-1/3 p-4 border-b-2 border-r-2 border-red-500 hover:bg-fuchsia-50 transition-all duration-300 flex flex-col'
        >
          <Link href={`/product/${items.id}`} className='flex-1'>
            <div className='relative h-full'>
              <Image 
                className='object-contain p-4 hover:scale-105 duration-500 transition-transform' 
                src={items.img}
                alt={items.title}
                fill
              />
            </div>
          </Link>
          <div className='flex justify-between px-4 items-center text-red-500'>
            <h1 className='text-xl font-bold'>{items.title}</h1>
            <div className='flex justify-end items-center gap-2'>
              <span className='text-xl'>${items.price.toString()}</span>
              <AddToCartButton 
                productId={items.id}
                price={items.price.toString()}
                title={items.title}
                img={items.img}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CreatorProductsPage