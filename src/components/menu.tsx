"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import Shopingcart from './Shopingcart'

const toggles = [
    { id: 1, title: "Homepage", url: "/" },
    { id: 2, title: "Menu", url: "/menu" },
    { id: 3, title: "Working Hours", url: "/" },
    { id: 4, title: "Contact", url: "/" },
]
function Menu() {
    const [open, setOpen] = useState(false)
    const user= false
    return (
        <div>
            {!open ? (
                <Image src="/open.png" alt="" width={20} height={20} onClick={() => { setOpen(true) }} />
            ) : (
                <Image src="/close.png" alt="" width={20} height={20} onClick={() => { setOpen(false) }} />
            )}
            {open && (
                <div className='  bg-red-500 text-white uppercase flex justify-center items-center h-[calc(100vh-6rem)] text-2xl gap-8 flex-col absolute left-0 top-24 w-full font-semibold z-10'>

                {toggles.map((toggle) => (
                    <Link key={toggle.id} href={toggle.url} onClick={() => { setOpen(false) }}>{toggle.title} </Link>
                ))}

                {!user? (<Link href='/login' onClick={() => { setOpen(false) }}>Login</Link>):(<Link href='/order' onClick={() => { setOpen(false) }}>Orders</Link>)}
                <Link href="/cart" onClick={() => { setOpen(false) }}> 
                 <Shopingcart/>
                </Link>
              

            </div>
            )}
        </div>
    );
}

export default Menu;
