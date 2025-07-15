"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
type Props = {
    price: number;
    options?:{ title: string, additionalPrice: number }[];
};
const Price = ({price,options}: Props) => {
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(price);
  const [selected, setSelected] = useState(0);
  useEffect(() => {
    setTotal(quantity*(options? options[selected].additionalPrice+price: price))
  
  }, [quantity, selected, price, options]);
  
  return (
    <div className='flex flex-col items-start w-full justify-start px-4'>
        <h2 className='text-2xl font-semibold'>${total}</h2>
        <div>
           {options?.map((index,id)=>(
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
        <Link href="/cart">
        <button className='bg-red-500  ring-red-500 ring-1 text-white p-2 rounded-lg text-base text-nowrap uppercase'>add to cart</button>
        </Link>
        </div>
       </div>
    </div>
  )
}

export default Price