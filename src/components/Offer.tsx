import Image from 'next/image'
import React from 'react'
import Counter from './counter'

const Offer = () => {
  return (
    <div className='flex flex-col md:flex-row h-screen bg-black md:h-[70vh] md:bg-[url("/offerBg.png")]'>
      <div className="flex flex-1 flex-col gap-8 justify-center items-center text-center px-5">
        <h1 className='text-white font-bold text-4xl uppercase '>delicous italian and chinese food </h1>
        <p className='text-white lg:text-xl px-5'>A classic cheese pizza with mozzarella cheese, tomato sauce, and a crispy crust</p>
        <Counter/>
        <button className='bg-red-500 text-white p-2 rounded-lg text-base uppercase'>order now</button>
      </div>
      <div className="flex-1 relative w-full md:h-full">
        <Image src='/offerProduct.png' alt='' fill className='object-contain'/>

      </div>
    </div>
  )
}

export default Offer