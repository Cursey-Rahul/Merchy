"use client"
import { Product } from '@/types/types';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useQuantityStore } from '@/app/store/quantityStore';

import { useSession } from 'next-auth/react';


const Price = ( {product}: {product:Product}) => {
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(Number(product.price));
  const [selected, setSelected] = useState(0);
  const quantityStore = useQuantityStore((state) => state.setQuantity);
  const router = useRouter();
  const { data: session } = useSession(); // ✅ use this instead of getSession()

 
  useEffect(() => {
    setTotal(quantity*(product.options? Number(product.options[selected].additionalPrice)+Number(product.price): Number(product.price)));
  
  }, [quantity, selected, product.options, product.price]);
    const handleAddToCart = async () => {
  const selectedOption = product.options?.[selected];
  quantityStore(quantity); // update local Zustand store

  if (!session?.user?.email) {
    console.error("No session email");
    return;
  }

  try {
    const res = await fetch("/api/save-cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userEmail: session.user.email,
        productId: String(product.id),
        title: product.title,
        img: product.img,
        price: product.options
          ? Number(product.price) + Number(product.options[selected].additionalPrice)
          : Number(product.price),
        quantity,
        option: selectedOption?.title ?? undefined,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to save cart");
    }

    const result = await res.json();
    console.log("✅ Cart saved:", result);

    router.push("/cart"); // ✅ redirect only after successful save
  } catch (error) {
    console.error("❌ Error saving cart:", error);
  }
};


  return (
    <div className='flex flex-col items-start w-full justify-start px-4'>
        <h2 className='text-2xl font-semibold'>${total.toFixed(2)}</h2>
        <div>
           {product.options?.map((index,id)=>(
            <button className=' text-xl px-4 py-2 mr-3 mb-3 mt-3 ring-1 ring-red-500 rounded-md' key={index.title} style={{background: selected===id?"rgb(239 68 68)": "white", color: selected===id?"white": "rgb(239 68 68)" }} onClick={()=>setSelected(id)}>{index.title}</button>
        
           )
        )}
        </div>
       <div className='w-full flex flex-row justify-between ring-red-500 ring-1 rounded-lg  items-center '>
       <div className='px-4 w-full font-semibold text-xl flex flex-row justify-between items-center'>
            <span>Quantity</span>
            <div className='flex flex-row justify-between text-center items-center gap-2'>
                <button className='text-2xl text-red-500' onClick={()=>{return quantity>1? setQuantity(quantity-1):setQuantity(1)}}>-</button>
                <span>{quantity}</span>
                <button className='text-2xl text-red-500' onClick={()=>{return quantity<15? setQuantity(quantity+1): setQuantity(15)}}>+</button>
            </div>
        </div>
        <div>
        <button className='bg-red-500  ring-red-500 ring-1 text-white p-2 rounded-lg text-base text-nowrap uppercase' onClick={()=>{
          handleAddToCart();
        }}>add to cart</button>
        
        </div>
       </div>
    </div>
  )
}

export default Price