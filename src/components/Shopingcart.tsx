"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { CartItem } from '@/types/types'

const ShoppingCart = () => {
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCartCount();
  }, []);

  const fetchCartCount = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://merchy-blond.vercel.app'
      const response = await fetch(`${baseUrl}/api/cartitems`);
      
      if (response.ok) {
        const items: CartItem[] = await response.json();
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalQuantity);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link href='/cart' className='flex items-center gap-4 md:gap-2'>
      <div className='flex relative w-8 h-8 md:w-6 md:h-6'>
        <Image src='/cart.png' fill alt='Shopping Cart' />
      </div>
      <span>Cart ({loading ? '...' : cartCount})</span>
    </Link>
  )
}

export default ShoppingCart