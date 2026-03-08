"use client"
import React from 'react'
import { Button } from './ui/button';
import { CartItem } from '@/types/types';
import { useRouter } from 'next/navigation';
import { useQuantityStore } from '@/app/store/quantityStore';

const CartProductChangeButton = ({item, quantity}: {item:CartItem; quantity:number}) => {
  const router = useRouter();
  const fixQuantity = useQuantityStore((state) => state.fixQuantity);
  
  const decreaseItems = async()=>{
    const previousQuantity = quantity;
    fixQuantity(quantity - 1);
    
    try {
      const res = await fetch("/api/delete-cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: String(item.productId),
          options: item.options ? JSON.parse(item.options) : undefined,
        }),
      });

      if (!res.ok) {
        fixQuantity(previousQuantity); // Revert on error
        throw new Error("Failed to delete from cart");
      }
      
      router.refresh();
      console.log("✅ Item removed from cart");
    } catch (error) {
      console.error("❌ Error updating cart:", error);
    }
  }

  const increaseItems = async()=>{
    const previousQuantity = quantity;
    fixQuantity(quantity + 1);
    
    try {
      const res = await fetch("/api/add-cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: String(item.productId),
          options: item.options ? JSON.parse(item.options) : undefined,
        }),
      });

      if (!res.ok) {
        fixQuantity(previousQuantity); // Revert on error
        throw new Error("Failed to add to cart");
      }
      
      router.refresh();
      console.log("✅ Item added to cart");
    } catch (error) {
      console.error("❌ Error updating cart:", error);
    }
  }

  return (
    <div className='flex items-center justify-between gap-2'>
      <Button variant="destructive" className='text-xl flex items-center justify-center' onClick={decreaseItems}>
        -
      </Button>
      <span className='text-l font-semibold'>{item.quantity}</span>
      <Button variant="destructive" className='text-xl flex items-center justify-center' onClick={increaseItems}>
        +
      </Button>
    </div>
  )
}

export default CartProductChangeButton