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
    <div className='w-[87%] h-20 mt-8 flex gap-5 justify-between items-center'>
      <div className='ml-5 sm:ml-12 lg:ml-32 flex items-center'>
        <a href='/' className='flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl bg-[#6A0DAD] dark:bg-[#300350] transform transition-all duration-200 border-solid border-[#300350] dark:border-[#6A0DAD] border-2'>
          <Image src={Unown} alt='Unown' className='select-none md:w-[66px] md:h-[66px] w-[53px] h-[53px]'/>
        </a>
        <a href='/'>
          <p className='poppins-bold text-xl md:text-3xl transform transition-all duration-200'><span className='text-4xl md:text-5xl'>E</span>volvra</p>
        </a>
      </div>
      <button onClick={handleLogout} className='mr-4 sm:mr-2 md:mr-0 xl:mr-2 text-xs sm:text-sm md:text-base justify-center items-center flex px-4 py-2 rounded-[4px] bg-[#6A0DAD] dark:bg-[#2A1E4F] border-[#2A1E4F] dark:border-[#6A0DAD] border-solid border-2 cursor-pointer nunito-semibold hover:scale-95 transform transition-all duration-200'>
        Logout
      </button>
    </div>
  )
}

export default Navbar