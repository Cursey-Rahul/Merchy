
import Image from 'next/image'
import React from 'react'

const cartPage = () => {
  return (
    <div className='h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] w-full flex flex-col text-red-500 md:flex-row' >
      <div className='h-1/2 md:h-full w-full flex flex-col overflow-y-scroll justify-center'>
      <div className='w-full flex flex-row items-center justify-around py-3 border-b-2 border-red-400'>
        <Image src="/temperory/p1.png" alt='' width={100} height={100}  />
        <div>
          <h2 className='font-bold text-l uppercase'>mozirela pizza</h2>
          <p className=' capitalize'>large</p>
        </div>
        <span className='font-semibold'>$23</span>
        <span>X</span>
      </div>
      <div className='w-full flex flex-row items-center justify-around py-3 border-b-2 border-red-400'>
        <Image src="/temperory/p1.png" alt='' width={100} height={100}  />
        <div>
          <h2 className='font-bold text-l uppercase'>mozirela pizza</h2>
          <p className=' capitalize'>large</p>
        </div>
        <span className='font-semibold'>$23</span>
        <span>X</span>
      </div>
      <div className='w-full flex flex-row items-center justify-around py-3 border-b-2 border-red-400'>
        <Image src="/temperory/p1.png" alt='' width={100} height={100}  />
        <div>
          <h2 className='font-bold text-l uppercase'>mozirela pizza</h2>
          <p className=' capitalize'>large</p>
        </div>
        <span className='font-semibold'>$23</span>
        <span>X</span>
      </div> 
      </div>
      <div className=' h-1/2 md:h-full bg-fuchsia-50 w-full flex flex-col justify-center text-l font-medium md:w-[45%]'>
          <div className='flex flex-row justify-between items-center capitalize px-4 m-2'>
            <p>subtotal(3 items)</p>
            <span>$69</span>
          </div>
          <div className='flex flex-row justify-between items-center capitalize px-4 m-2'>
            <p>service cost</p>
            <span>$0.00</span>
          </div>
          <div className='flex flex-row justify-between items-center capitalize px-4 m-2 mb-6'>
            <p>delivery cost</p>
            <span className='text-green-500'>Free!</span>
          </div>
          <hr/>
          <div className='flex flex-row justify-between items-center capitalize px-4 my-6'>
            <p className='uppercase'>total(inc.gst)</p>
            <span className='font-extrabold'>$100</span>
          </div>
          <button className='bg-red-500 w-max self-end ring-red-500 ring-1 text-white p-2 rounded-lg text-base text-nowrap uppercase px-14 mx-4' >checkout</button>
      </div>
    </div>
  )
}

export default cartPage