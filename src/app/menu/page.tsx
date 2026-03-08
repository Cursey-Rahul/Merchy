import { Creator } from '@/types/types';
import Link from 'next/link'
import React from 'react'

export const dynamic = 'force-dynamic';

const GETDATA = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://merchy-blond.vercel.app'
  const response = await fetch(`${baseUrl}/api/creators`)
  return response.json();
}

const MenuPage = async () => {
  const creators: Creator[] = await GETDATA();
  
  if (!creators || creators.length === 0) {
    return <div className='p-8 text-center'>No creators available</div>
  }

  return (
    <div className='my-6 md:my-12 2xl:my-18 p-4 lg:px-15 xl:px-25 flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6'>
      {creators.map((creator) => (
        <Link 
          key={creator.id} 
          href={`/menu/${creator.slug}`} 
          className='w-full bg-cover h-[20vh] sm:h-[49vh] p-8 md:h-[49vh] flex md:justify-center xl:justify-start' 
          style={{ backgroundImage: `url(${creator.image})` }}
        >
        
          {/* <div className='w-1/2 flex flex-col items-center text-center justify-center gap-4'>
            <h1 className='text-xl font-bold md:text-3xl lg:text-4xl text-white'>{creator.title}</h1>
            <p className='text-white'>{creator.description}</p>
            <button className='hidden md:block bg-red-500 text-white p-2 rounded-lg uppercase'>explore</button>
          </div> */}
        </Link>
      ))}
    </div>
  )
}

export default MenuPage