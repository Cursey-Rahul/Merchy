import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Shopingcart = () => {
  return (
   
    <Link href='/cart' className='flex items-center gap-4 md:gap-2'>
         <div className='flex relative w-8 h-8 md:w-6 md:h-6'>
        <Image src='/cart.png' fill alt=''/>
        </div>
        <span>Cart (3)</span>
    </Link>
  )
}

export default Shopingcart