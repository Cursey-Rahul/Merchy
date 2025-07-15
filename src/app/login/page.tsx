import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const loginPage = () => {
  return (
    <div className='h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] w-full flex items-center justify-center'>
      <div className='w-full h-full flex flex-col p-6 shadow-2xl shadow-slate-500 text-lg md:flex-row md:h-[85%] lg:h-[75%] lg:w-[85%] 2xl:w-[50%] '>
         <div className=' relative h-1/2 w-full md:h-full md:w-[40%]'>
          <Image src="/loginBg.png" alt="" fill className='object-cover'/>
         </div>
         <div className='p-12 flex flex-col gap-8 '>
          <h1 className='font-bold text-2xl uppercase'>welcome</h1>
          <p>log into your account or create a new one using social buttons</p>
          <button className='flex items-center ring-1 ring-gray-200 p-4'>
            <Image src="/google.png" alt="" width={25} height={25} className='object-contain mx-4' />
            <span>Sign in with Google</span>
            </button>
            <button className='flex items-center ring-1 ring-gray-200 p-4'>
            <Image src="/facebook.png" alt="" width={25} height={25} className='object-contain mx-4' />
            <span>Sign in with Facebook</span>
            </button>
            <span> Have a problem? <Link href="/contact" className='underline'>Contact us</Link></span>
         </div>
      </div>

    </div>
  )
}

export default loginPage