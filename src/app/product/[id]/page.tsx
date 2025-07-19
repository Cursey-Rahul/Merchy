import Image from 'next/image'
import React from 'react'
import Price from '@/components/Price';
import { Product } from '@/types/types';

const GETDATA= async(id: string)=>{
  const response = await fetch(`http://localhost:3000/api/products?id=${id}`);
 const data = await response.json();
   return data[0]; 
}

const productPage = async({
  params,
}: {
  params: { id: string };
}) => {
  const item: Product = await GETDATA(params.id);
  return (
    <div className='p-4 lg:px-20 xl:px-40 h-screen flex flex-col justify-center items-center md:flex-row '>
      
        <div className='relative w-full md:w-1/2 h-1/2'>
          <Image src={item.img} alt=''fill className='object-contain' />
        </div>
        <div className=' text-red-400 w-full md:w-1/2 p-5 flex flex-col justify-center text-center items-center gap-8'>
          <h1 className='font-bold text-3xl'>{item.title}</h1>
          <p className=' text-xl'>{item.description}</p>
          <Price price={item.price} options={item.options} />
       </div>

    </div>
  )
}

export default productPage