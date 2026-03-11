"use client";
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const ChooseRolePage = () => {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'creator' | 'user' | null>(null);

  useEffect(() => {
    if (!session?.user) {
      router.push('/login');
    }
  }, [session, router]);

  const handleRoleSelect = async () => {
    if (!selectedRole) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/user/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: session?.user?.email,
          userType: selectedRole,
          name: session?.user?.name,
          image: session?.user?.image
        })
      });

      if (res.ok) {
        await update();
        router.push(selectedRole === 'creator' ? '/creator/setup' : '/');
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
    <div className='min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-8rem)] w-full flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100'>
      <div className='w-full max-w-2xl flex flex-col gap-6 sm:gap-8'>
        {/* Header */}
        <div className='text-center space-y-2 sm:space-y-3'>
          <h1 className='font-bold text-2xl sm:text-3xl md:text-4xl text-gray-900 uppercase'>
            Welcome, {session?.user?.name}!
          </h1>
          <p className='text-base sm:text-lg md:text-xl text-gray-700'>
            Are you a Creator or a User?
          </p>
        </div>
        
        {/* Cards Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8'>
          {/* Creator Card */}
          <button
            onClick={() => setSelectedRole('creator')}
            disabled={loading}
            className={`flex flex-col gap-3 sm:gap-4 p-6 sm:p-8 rounded-lg border-2 transition-all duration-300 disabled:opacity-50 ${
              selectedRole === 'creator'
                ? 'border-red-500 bg-red-50 shadow-lg'
                : 'border-red-500 hover:bg-red-50'
            }`}
          >
            <div className='flex items-start justify-between'>
              <h2 className='font-bold text-xl sm:text-2xl text-red-500'>Creator</h2>
              {selectedRole === 'creator' && (
                <span className='bg-red-500 text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-sm font-bold'>
                  ✓
                </span>
              )}
            </div>
            <p className='text-left text-sm sm:text-base text-gray-700'>
              Sell your own products, manage your store, and grow your business
            </p>
            <ul className='text-left text-xs sm:text-sm text-gray-600 space-y-1.5 sm:space-y-2'>
              <li>✓ Add and manage products</li>
              <li>✓ Build your brand</li>
              <li>✓ Track sales</li>
            </ul>
          </button>

          {/* User Card */}
          <button
            onClick={() => setSelectedRole('user')}
            disabled={loading}
            className={`flex flex-col gap-3 sm:gap-4 p-6 sm:p-8 rounded-lg border-2 transition-all duration-300 disabled:opacity-50 ${
              selectedRole === 'user'
                ? 'border-gray-400 bg-gray-50 shadow-lg'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className='flex items-start justify-between'>
              <h2 className='font-bold text-xl sm:text-2xl text-gray-800'>User</h2>
              {selectedRole === 'user' && (
                <span className='bg-gray-700 text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-sm font-bold'>
                  ✓
                </span>
              )}
            </div>
            <p className='text-left text-sm sm:text-base text-gray-700'>
              Browse and purchase products from creators
            </p>
            <ul className='text-left text-xs sm:text-sm text-gray-600 space-y-1.5 sm:space-y-2'>
              <li>✓ Shop products</li>
              <li>✓ Save favorites</li>
              <li>✓ Track orders</li>
            </ul>
          </button>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleRoleSelect}
          disabled={!selectedRole || loading}
          className='w-full bg-red-500 text-white p-3 sm:p-3.5 rounded-lg font-bold uppercase hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm sm:text-base'
        >
          {loading ? 'Setting up...' : 'Confirm'}
        </button>
      </div>
    </div>
  )
}

export default ChooseRolePage