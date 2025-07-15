import Image from 'next/image'
import React from 'react'
import Price from '@/components/Price';
import { Product } from '@/types/types';

const GETDATA= async(title: string)=>{
  const response = await fetch(`http://localhost:3000/api/products?title=${title}}`);
  return response.json();
}

const productPage = async({
  params,
}: {
  params: { title: string };
}) => {
  const pizza : Product = await GETDATA(params.title);
  console.log(pizza)
  return (
    <div className='p-4 lg:px-20 xl:px-40 h-screen flex flex-col justify-center items-center md:flex-row '>
      
        <div className='relative w-full md:w-1/2 h-1/2'>
          <Image src={pizza.img} alt=''fill className='object-contain' />
        </div>
        <div className=' text-red-400 w-full md:w-1/2 p-5 flex flex-col justify-center text-center items-center gap-8'>
          <h1 className='font-bold text-3xl'>{pizza.title}</h1>
          <p className=' text-xl'>{pizza.description}</p>
          <Price price={pizza.price} options={pizza.options} />
       </div>

    </div>
  )
}

export default productPage