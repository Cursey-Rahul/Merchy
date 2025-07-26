import { FoodItemType } from '@/types/types';
import Link from 'next/link'
import React from 'react'
const GETDATA = async()=>{
  const response = await fetch("http://localhost:3000/api/category")
  return response.json();
}


const menuPage = async() => {
  const foodItems: FoodItemType[]= await GETDATA();
    return (
    <div className='my-6 md:my-12 2xl:my-18 p-4 lg:px-15 xl:px-25 flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6  '>
      {foodItems.map((items)=>(
          <Link key={items.id} 
          href={`/menu/${items.slug}`} 
          className='w-full h-1/3 bg-cover p-8 md:h-[49vh] flex md:justify-center xl:justify-start' 
          style={{ backgroundImage: `url(${items.img})` }} >

          <div className={`text-${items.colour} w-1/2 flex flex-col items-center text-center justify-center gap-4` }>
            <h1 className='text-xl font-bold md:text-3xl lg:text-4xl'>{items.title}</h1>
            <p className=''>{items.description}</p>
            <button className='hidden md:block bg-red-500 text-white p-2 rounded-lg uppercase'>explore</button>
          </div>
          </Link>
      )
    
    )
      
    }
    </div>
  )
}

export default menuPage
