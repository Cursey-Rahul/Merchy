import { Product } from '@/types/types'
import Image from 'next/image'
import React from 'react'

const GETDATA=async()=>{
  const data= await fetch("http://localhost:3000/api/products")
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
        <div key={product.id} className='w-screen h-[60vh] flex flex-col items-center justify-around py-4 px-4 text-center hover:bg-fuchsia-50 transition-all duration-300 md:w-[50vw] lg:w-[33vw] lg:h-[90vh] md:h-[75vh]'>
        <div className='relative w-full flex-1 '>  
           {/*image*/}
        <Image src={product.img}alt=''fill className='object-contain hover:rotate-[60deg] duration-500 transition-all'/>
        </div> 
      <div className=' text-red-500 flex flex-1 flex-col gap-4 items-center justify-center'>
        {/*texts*/}
        <h1 className=' font-bold text-2xl uppercase md:text-3xl lg:text-4xl '>{product.title}</h1>
        <p className='px-4'>{product.description}</p>
        <span className=' font-bold text-xl'> ${product.price}</span>
        <button className='bg-red-500 text-white p-2 rounded-lg text-base uppercase'>add to cart</button>
        </div>

      </div>
      ))}


      </div>
    </div>
  )
}

export default Featured