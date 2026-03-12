"use client"
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useCartCount } from '@/hooks/useCartCount'

const Shoppingcart = () => {
  const { cartCount, loading, refetch } = useCartCount();

  return (
    <Link href='/cart' className='flex items-center gap-4 md:gap-2' onClick={refetch}>
      <div className='flex relative w-8 h-8 md:w-6 md:h-6'>
        <Image src='/cart.png' fill alt='Shopping Cart' />
      </div>
      <span>Cart ({loading ? '...' : cartCount})</span>
    </Link>
  )
}

export default Shoppingcart