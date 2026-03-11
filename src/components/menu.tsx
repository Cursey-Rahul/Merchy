"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import Shopingcart from './Shopingcart'
import { useSession, signOut } from 'next-auth/react'

const toggles = [
    { id: 1, title: "Homepage", url: "/" },
    { id: 2, title: "Menu", url: "/menu" },
    { id: 3, title: "Contact", url: "/contact" },
]

function Menu() {
    const [open, setOpen] = useState(false)
    const { data: session } = useSession();

    return (
        <div>
            {!open ? (
                <Image src="/open.png" alt="" width={20} height={20} onClick={() => { setOpen(true) }} />
            ) : (
                <Image src="/close.png" alt="" width={20} height={20} onClick={() => { setOpen(false) }} />
            )}
            {open && (
                <div className='bg-red-500 text-white uppercase flex justify-center items-center h-[calc(100vh-6rem)] text-2xl gap-8 flex-col absolute left-0 top-24 w-full font-semibold z-10'>

                    {toggles.map((toggle) => (
                        <Link key={toggle.id} href={toggle.url} onClick={() => { setOpen(false) }}>
                            {toggle.title}
                        </Link>
                    ))}

                    {!session?.user ? (
                        <Link href='/login' onClick={() => { setOpen(false) }}>Login</Link>
                    ) : (
                        <>
                            <div className='flex flex-col gap-6 items-center'>
                               
                                {/* Orders Link */}
                                <Link href='/orders' onClick={() => { setOpen(false) }} className='hover:underline'>
                                    My Orders
                                </Link>

                                {/* Admin Page */}
                                {session?.user?.isAdmin && (
                                    <Link href='/admin' onClick={() => { setOpen(false) }} className='hover:underline'>
                                        Admin Page
                                    </Link>
                                )}

                                {/* Creator Dashboard */}
                                {session?.user?.userType === 'creator' && (
                                    <Link href='/creator/dashboard' onClick={() => { setOpen(false) }} className='hover:underline'>
                                        Dashboard
                                    </Link>
                                )}

                                {/* Become Creator */}
                                {session?.user?.userType === 'user' && (
                                    <Link href='/choose-role' onClick={() => { setOpen(false) }} className='hover:underline'>
                                        Become Creator
                                    </Link>
                                )}

                                {/* Logout */}
                                <button 
  onClick={() => {
    signOut();
    setOpen(false);
  }}
  className='bg-white text-red-500 px-6 py-2 rounded-lg font-semibold hover:bg-red-50 active:bg-red-100 transition-all duration-300'
>
  Log Out
</button>
                               
                            </div>
                        </>
                    )}

                    <div onClick={() => { setOpen(false) }}> 
                        <Shopingcart />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Menu;