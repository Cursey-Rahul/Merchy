"use client";
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const CreatorSetupPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: session?.user?.name || '',
    description: '',
    image: session?.user?.image || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Update creator profile
    router.push('/creator/dashboard');
  };

  return (
    <div className='h-[calc(100vh-6rem)] flex items-center justify-center p-4'>
      <form onSubmit={handleSubmit} className='w-full max-w-md flex flex-col gap-4'>
        <h1 className='font-bold text-3xl'>Setup Your Creator Profile</h1>
        
        <input
          type="text"
          placeholder="Brand Name"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className='border border-gray-300 p-2 rounded'
        />
        
        <textarea
          placeholder="Brand Description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className='border border-gray-300 p-2 rounded'
        />
        
        <button type="submit" className='bg-red-500 text-white p-2 rounded'>
          Continue to Dashboard
        </button>
      </form>
    </div>
  )
}

export default CreatorSetupPage