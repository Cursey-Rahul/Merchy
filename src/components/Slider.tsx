"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
const slides=[
  { id:1,
    title: "always fresh & always crispy & always hot",
    img:"/slide1.png"

  },
  { id:2,
    title: "we deliver your food wherever you are in sahdara",
    img:"/slide2.png"
  },
  { id:3,
    title: "the best food to enjoy your meal",
    img:"/slide3.jpg"
  },
]

const Slider = () => {
  const[index, setIndex]= useState(0);
  useEffect(()=>{
    const interval= setInterval(()=>

      setIndex((prev)=>{ return prev==slides.length-1? 0 : prev+1})
      ,4000
    );
    return ()=>clearInterval(interval)
  },[]);
  return (
    <div className='flex flex-col md:h-[calc(100vh-8rem)] lg:flex-row items-center justify-center h-[calc(100vh-6rem)]'>
      <div className=" px-4 h-1/2 lg:h-full lg:w-1/2 text-red-500 font-bold flex justify-center items-center flex-col gap-8 uppercase ">
        <h1 className=' text-center text-5xl lg:text-6xl xl:text-7xl'>{slides[index].title}</h1>
       <Link href="/menu"> <button className='bg-red-500 text-white px-8 py-4 text-lg uppercase'>order now</button></Link>
      </div>
      <div className='h-1/2 relative w-full lg:h-full lg:w-1/2'>
        <Image src={slides[index].img} alt='' fill className='object-cover'></Image>
      </div>
    </div>
  )
}

export default Slider