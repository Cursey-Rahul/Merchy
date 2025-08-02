import Image from 'next/image'
import React from 'react'
import { Button } from '@/components/ui/button';
import { CartItems } from '@/types/types';

const GETDATA = async()=>{
  const data = await fetch("http://localhost:3000/api/cartitems")
  return data.json();
}
const CartPage = async() => {
  const cartItems: CartItems[] = await GETDATA();

  return (
    <div className='h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] w-full flex flex-col text-red-500 md:flex-row' >
      <div className='h-1/2 md:h-full w-full flex flex-col overflow-y-scroll justify-center'>
        {cartItems.length > 0 ? (     
          cartItems.map((item) => (
            <div key={`${item.id}-${item.option || 'default'}`} {...item}  className='w-full flex flex-row items-center justify-around py-3 border-b-2 border-red-400'>
              <Image src={item.image} alt='' width={100} height={100} />
              <div>
                <h2 className='font-bold text-l uppercase'>{item.name}</h2>
                {item.option && <p className='capitalize'>{item.option}</p>}
              </div>
              <span className='font-semibold'>${(Number(item.price) * item.quantity).toFixed(2)}</span>
              <div className='flex flex-row items-center gap-4 '>
                <Button variant="destructive" className=' text-xl flex items-center justify-center' >-</Button>
                <span className='text-l font-semibold'>{item.quantity}</span>
                <Button variant="destructive" className=' text-xl flex items-center justify-center'>+</Button>
              </div>
            </div>
          ))
        ) : (
          <p className='text-center text-lg font-semibold'>Your cart is empty</p>
        )}
      </div>
      <div className=' h-1/2 md:h-full bg-fuchsia-50 w-full flex flex-col justify-center text-l font-medium md:w-[45%]'>
          <div className='flex flex-row justify-between items-center capitalize px-4 m-2'>
            <p>subtotal items</p>
            <span></span>
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
            <span className='font-extrabold'></span>
          </div>
          <button className='bg-red-500 w-max self-end ring-red-500 ring-1 text-white p-2 rounded-lg text-base text-nowrap uppercase px-14 mx-4' >checkout</button>
      </div>
    </div>
  )
}

export default CartPage