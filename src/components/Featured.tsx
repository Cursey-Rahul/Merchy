import { Product } from '@/types/types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const GETDATA=async()=>{
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://merchy-blond.vercel.app'
  const data = await fetch(`${baseUrl}/api/products`)
  return data.json()
}


const Featured = async() => {
  const foodProducts:Product[]=await GETDATA();
  return (
    <div className='w-screen overflow-x-scroll' >
      {/*cards*/}
      <div className="w-max flex">
      {/*single card*/}
      {foodProducts.map((product) => (
        <Link href={`/product/${product.id}`} key={product.id}className='w-screen h-[60vh] flex flex-col items-center justify-around py-4 px-4 text-center hover:bg-fuchsia-50 transition-all duration-300 md:w-[50vw] lg:w-[33vw] lg:h-[90vh] md:h-[75vh]'>
        <div className='relative w-full flex-1 '>  
           {/*image*/}
        <Image src={product.img}alt=''fill className='object-contain hover:scale-105 duration-500 transition-transform'/>
        </div> 
      <div className=' text-red-500 flex flex-1 flex-col gap-4 items-center justify-center'>
        {/*texts*/}
        <h1 className=' font-bold text-2xl uppercase md:text-3xl lg:text-4xl '>{product.title}</h1>
        <p className='px-4'>{product.description}</p>
        <span className=' font-bold text-xl'> ${product.price}</span>
        <button className='bg-red-500 text-white p-2 rounded-lg text-base uppercase'>add to cart</button>
        </div>

      </Link>
      ))}


      </div>
    </div>
  )
}

export default Featured