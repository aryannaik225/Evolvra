import React from 'react'
import Unown from '@/assets/unown.svg'
import Image from 'next/image'

const Navbar = () => {

  return (
    <div className='w-full h-20 mt-8'>
      <div className='ml-32 flex items-center gap-1'>
        <div className='flex items-center justify-center w-20 h-20 rounded-2xl bg-[#6A0DAD] dark:bg-[#300350] border-solid border-[#300350] dark:border-[#6A0DAD] border-2'>
          <Image src={Unown} alt='Unown' width={66} height={66} />
        </div>
        <div className=''>
          <p className='poppins-bold text-3xl '><span className='text-5xl'>E</span>volvra</p>
        </div>
      </div>
    </div>
  )
}

export default Navbar