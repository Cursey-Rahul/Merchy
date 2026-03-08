import { Creator } from '@/types/types';
import Link from 'next/link'
import React from 'react'

export const dynamic = 'force-dynamic';

const GETDATA = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://merchy-blond.vercel.app'
    const response = await fetch(`${baseUrl}/api/creators`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      console.error('API error:', response.status)
      return []
    }
    
    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching creators:', error)
    return []
  }
}

const CreatorsPage = async () => {
  const creators: Creator[] = await GETDATA();
  
  if (!creators || creators.length === 0) {
    return <div className='p-8 text-center min-h-[calc(100vh-6rem)]'>No creators available</div>
  }

  return (
    <div className='my-6 md:my-12 2xl:my-18 p-4 lg:px-15 xl:px-25 flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6'>
      {creators.map((creator) => (
        <Link 
          key={creator.id} 
          href={`/creators/${creator.slug}`} 
          className='w-full bg-cover h-[20vh] sm:h-[49vh] p-8 md:h-[49vh] flex md:justify-center xl:justify-start relative group overflow-hidden rounded-lg' 
          style={{ backgroundImage: `url(${creator.image})` }}
        >
          <div className='absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all'></div>
          <div className='relative z-10 flex flex-col justify-end w-full'>
            <h2 className='text-white font-bold text-2xl md:text-3xl mb-2'>{creator.title}</h2>
            <p className='text-white text-sm line-clamp-2'>{creator.description}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default CreatorsPage