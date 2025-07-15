import Link from 'next/link'
import React from 'react'

const footer = () => {
  return (
    <div className='flex h-12 md:h-20 lg:px-20 justify-between items-center text-center md:px-14 px-4 text-red-500 border-t-2 border-red-500 '>

      <div className=' sm:text-sm md:text-lg uppercase font-semibold'>
        <Link href='/'>
        ultimate chinese food
        </Link>
      </div>
      <div className='text-sm uppercase'>
        <span >© all rights reserved</span>
      </div>
    </div>
  )
}

export default footer