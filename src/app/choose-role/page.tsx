"use client";
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const ChooseRolePage = () => {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session?.user) {
      router.push('/login');
    }
  }, [session, router]);

  const handleRoleSelect = async (role: 'creator' | 'user') => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: session?.user?.email,
          userType: role,
          name: session?.user?.name,
          image: session?.user?.image
        })
      });

      if (res.ok) {
        // Update the session to reflect the new role
        await update();
        
        // Navigate to appropriate page
        router.push(role === 'creator' ? '/creator/setup' : '/');
      } else {
        console.error('Failed to set role');
      }
    } catch (error) {
      console.error('Error setting role:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] w-full flex items-center justify-center p-4'>
      <div className='w-full max-w-2xl flex flex-col gap-8'>
        <h1 className='font-bold text-4xl text-center uppercase'>Welcome, {session?.user?.name}!</h1>
        <p className='text-center text-xl'>Are you a Creator or a User?</p>
        
        <div className='grid md:grid-cols-2 gap-8'>
          {/* Creator Card */}
          <button
            onClick={() => handleRoleSelect('creator')}
            disabled={loading}
            className='flex flex-col gap-4 p-8 border-2 border-red-500 rounded-lg hover:bg-red-50 transition-all duration-300 disabled:opacity-50'
          >
            <h2 className='font-bold text-2xl text-red-500'>Creator</h2>
            <p className='text-left'>
              Sell your own products, manage your store, and grow your business
            </p>
            <ul className='text-left text-sm space-y-2'>
              <li>✓ Add and manage products</li>
              <li>✓ Build your brand</li>
              <li>✓ Track sales</li>
            </ul>
            {loading && <span>Setting up...</span>}
          </button>

          {/* User Card */}
          <button
            onClick={() => handleRoleSelect('user')}
            disabled={loading}
            className='flex flex-col gap-4 p-8 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 disabled:opacity-50'
          >
            <h2 className='font-bold text-2xl'>User</h2>
            <p className='text-left'>
              Browse and purchase products from creators
            </p>
            <ul className='text-left text-sm space-y-2'>
              <li>✓ Shop products</li>
              <li>✓ Save favorites</li>
              <li>✓ Track orders</li>
            </ul>
            {loading && <span>Setting up...</span>}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChooseRolePage