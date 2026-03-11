"use client";
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const LoginPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      console.log('Session:', session.user)
      if (!session.user.userType || session.user.userType === 'user') {
        router.push('/choose-role');
      } else {
        router.push('/');
      }
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className='h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    )
  }

  if (status === 'authenticated') {
    return (
      <div className='h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4'></div>
          <p className='text-gray-600'>Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-8rem)] w-full flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100'>
      <div className='w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden'>
        <div className='flex flex-col md:flex-row md:h-full'>
          
          {/* Image Section */}
          <div className='relative h-40 sm:h-48 md:h-auto md:w-2/5 bg-gray-200'>
            <Image 
              src="/loginBg.png" 
              alt="Login Background" 
              fill 
              className='object-cover'
              priority
            />
          </div>

          {/* Form Section */}
          <div className='flex-1 p-6 sm:p-8 md:p-12 flex flex-col gap-6 sm:gap-8 justify-center'>
            <div>
              <h1 className='font-bold text-2xl sm:text-3xl md:text-4xl text-gray-900 uppercase mb-2'>
                Welcome
              </h1>
              <p className='text-gray-600 text-sm sm:text-base'>
                Log into your account or create a new one using social buttons
              </p>
            </div>

            {/* Google Button */}
            <button 
              onClick={() => signIn('google')} 
              className='flex items-center justify-center gap-3 w-full border-2 border-gray-300 p-3 sm:p-4 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all duration-300 font-semibold text-sm sm:text-base'
            >
              <Image 
                src="/google.png" 
                alt="Google" 
                width={24} 
                height={24} 
                className='object-contain'
              />
              <span>Sign in with Google</span>
            </button>

            {/* Facebook Button */}
            <button 
              onClick={() => signIn('facebook')} 
              className='flex items-center justify-center gap-3 w-full border-2 border-gray-300 p-3 sm:p-4 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all duration-300 font-semibold text-sm sm:text-base'
            >
              <Image 
                src="/facebook.png" 
                alt="Facebook" 
                width={24} 
                height={24} 
                className='object-contain'
              />
              <span>Sign in with Facebook</span>
            </button>

            {/* Help Text */}
            <p className='text-sm text-gray-600 text-center'>
              Have a problem? 
              <Link href="/contact" className='text-red-500 font-semibold hover:underline ml-1'>
                Contact us
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage