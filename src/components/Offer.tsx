import Image from 'next/image'
import React from 'react'
import Counter from './counter'

const Offer = () => {
  return (
    <div className='flex flex-col md:flex-row h-screen bg-black md:h-[70vh] md:bg-[url("/offerBg.png")]'>
  <div className="flex flex-1 flex-col gap-8 justify-center items-center text-center px-5">
    <h1 className='text-white font-bold text-4xl uppercase'>Unleash the Eagle</h1>
    <p className='text-white lg:text-xl px-5'>
      Wear your boldness! Our Eagle Logo Cap combines style and attitude for every adventure.
    </p>
    <Counter/>
    <button className='bg-red-500 text-white p-2 rounded-lg text-base uppercase hover:bg-red-600 transition'>
      grab yours now
    </button>
  </div>
  <div className="flex-1 relative w-full md:h-full">
    <Image src='/cap.png' alt='Eagle Logo Cap' fill className='object-contain'/>
  </div>
</div>

  )
}

export default Offer