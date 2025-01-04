'use client'

import React from 'react'
import Unown from '@/assets/unown.svg'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };

  return (
    <div className='w-full h-20 mt-8 flex gap-5'>
      <div className='ml-12 lg:ml-32 flex items-center gap-2'>
        <a href='/' className='flex items-center justify-center w-20 h-20 rounded-2xl bg-[#6A0DAD] dark:bg-[#300350] border-solid border-[#300350] dark:border-[#6A0DAD] border-2'>
          <Image src={Unown} alt='Unown' width={66} height={66} className='select-none'/>
        </a>
        <a href='/'>
          <p className='poppins-bold text-xl md:text-3xl'><span className='text-4xl md:text-5xl'>E</span>volvra</p>
        </a>
      </div>
      <button onClick={handleLogout} className='bg-red-400 p-2 rounded-lg'>
        Logout
      </button>
    </div>
  )
}

export default Navbar