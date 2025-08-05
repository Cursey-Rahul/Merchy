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
      fixQuantity(quantity-1); // Update the quantity in Zustand store
  try {

    const res = await fetch("/api/delete-cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: String(item.productId),
        options: item.options || undefined,
      }),
      
    });
     router.refresh();

    if (!res.ok) {
      throw new Error("Failed to save cart");
    }
    const result = await res.json();
    console.log("✅ Cart updated:", result);
  } catch (error) {
    console.error("❌ Error updating cart:", error);
  }
  }


  const increaseItems = async()=>{
     fixQuantity(quantity+1);

  try {
    const res = await fetch("/api/add-cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: String(item.productId),
        options: item.options || undefined,
      }),
      
    });
     router.refresh();

    if (!res.ok) {
      throw new Error("Failed to save cart");
    }
    const result = await res.json();
    console.log("✅ Cart updated:", result);
  } catch (error) {
    console.error("❌ Error updating cart:", error);
  }
  }
  return (
    <div className='flex items-center justify-between gap-2'>
        <Button variant="destructive" className=' text-xl flex items-center justify-center' onClick={()=>{
            decreaseItems();
        }}>-</Button>
                <span className='text-l font-semibold'>{item.quantity}</span>
                <Button variant="destructive" className=' text-xl flex items-center justify-center' onClick={increaseItems}>+</Button>
    </div>
  )
}

export default CartProductChangeButton