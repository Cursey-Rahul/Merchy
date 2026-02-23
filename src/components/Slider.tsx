"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
const slides = [
  { 
    id: 1,
    title: "Show your mood with the AngryPrash keychain — perfect for fans who love bold vibes!",
    img: "https://res.cloudinary.com/dq5vadic7/image/upload/v1759509240/prashkey_mq1460.png"
  },
  { 
    id: 2,
    title: "Rock the streets with the BoltCut cap — edgy style for every adventure.",
    img: "https://res.cloudinary.com/dq5vadic7/image/upload/v1759509237/crow_cap_houcbc.png"
  },
  { 
    id: 3,
    title: "Step into the game with the Devil May Cry-themed Bunny Helmet — playful, fierce, and iconic.",
    img: "https://res.cloudinary.com/dq5vadic7/image/upload/v1759509234/bunnyhelmet_obrkcx.png"
  },
  { 
    id: 4,
    title: "Strum in style with the Arashi electric guitar — perfect for fans who want to rock like J-Pop legends.",
    img: "https://res.cloudinary.com/dq5vadic7/image/upload/v1759509231/Gemini_Generated_Image_hhq37jhhq37jhhq3_qchxew.png"
  }
];


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
    <div className='flex flex-col md:h-[calc(100vh-8rem)] lg:flex-row items-center justify-center h-[calc(100vh-6rem)] mb-2 border-b-2 border-red-500 '>
      <div className=" px-4 h-1/2 lg:h-full lg:w-1/2 text-red-500 font-bold flex justify-center items-center flex-col gap-8 uppercase ">
        <h1 className=' text-center text-3xl md:text-5xl lg:text-6xl xl:text-7xl'>{slides[index].title}</h1>
       <Link href="/menu"> <button className='bg-red-500 text-white px-8 py-4 text-lg uppercase'>order now</button></Link>
      </div>
      <div className='h-1/2 relative w-full lg:h-full lg:w-1/2'>
        <Image src={slides[index].img} alt='' fill className='object-cover'></Image>
      </div>
    </div>
  )
}

export default Slider