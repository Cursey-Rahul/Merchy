"use client";
import Image from 'next/image'
import Menu from './menu'
import Link from 'next/link'
import Shopingcart from './Shopingcart'


import { signOut, useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
const Header = () => {
  const { data: session} = useSession();
 
  return (
 
    <div className='h-12  bg-white text-red-500 flex justify-between px-4 items-center border-b-2 border-b-red-500 md:h-20 lg:px-14 '>
      <div className='hidden md:flex items-center gap-5 lg:gap-6 text-l uppercase flex-1 lg:text-xl '>
        <Link href='/' className=' hover:underline hover:font-semibold'>Homepage</Link>
        <Link href='/menu' className=' hover:underline hover:font-semibold'>Creators</Link>
        <Link href='/contact' className=' hover:underline hover:font-semibold'>contact</Link>
      </div>



      <div className='text-xl uppercase md:font-bold font-semibold flex-1 md:text-center lg:text-2xl'>
        <Link href='/'>
       MERCHY
        </Link>
      </div>



      <div className='hidden md:flex items-center gap-6 text-l uppercase flex-1 justify-end lg:text-xl'>
        <div className=' md:absolute top-4 right-4 xl:static flex items-center gap-2 bg-orange-300 rounded-md px-1 '>
          <Image src='/phone.png' alt='' width={20} height={20} />  
          <span>981896391</span>
        </div>
        {!session?.user ?(<div><Link href='/login' className=' hover:underline hover:font-semibold'>Login</Link></div>) : (<div className='flex items-center gap-8'>  <Shopingcart/> <DropdownMenu>
  <DropdownMenuTrigger> <Avatar>
         <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
           </Avatar> </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem><Link href='/orders' className=' hover:underline hover:font-semibold'>My Orders</Link></DropdownMenuItem>
    
    <DropdownMenuItem><Link href='/admin' className=' hover:underline hover:font-semibold'>Admin Page</Link></DropdownMenuItem>
    <DropdownMenuItem><Button variant="destructive" onClick={() => signOut()}>Log Out</Button></DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
        </div>)}
      </div>
     
      <div className='md:hidden '>
        <Menu/>
      </div>
    </div>
  )
}

export default Header