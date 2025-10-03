"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const page = () => {
    const router = useRouter();
    useEffect(()=>{
        localStorage.removeItem('AuthData');
        router.push('/');
    },[])
  return (
    <div className='flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-black via-black to-amber-500'>
      <h1 className='text-white font-bold text-4xl'>Logging Out....</h1>
    </div>
  )
}

export default page
