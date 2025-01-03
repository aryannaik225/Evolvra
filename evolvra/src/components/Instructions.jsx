import React from 'react'
import Psyduck from '@/assets/psyduck.svg'
import Snorlax from '@/assets/snorlax.svg'
import PurplePokeball from '@/assets/purple-pokeball.svg'
import Image from 'next/image'

const Instructions = ({ setLetsPlay }) => {
  return (
    <div className='rounded-xl dark:bg-[#2A1E4F] dark:border-[#6A0DAD] bg-[#8647B3] border-[#2A1E4F] border-4 border-solid mb-9 w-full sm:w-[443px] md:w-[573px]'>
      <div className='p-4 flex flex-col'>
        <div className='flex items-center sm:items-start justify-between'>
          <Image src={PurplePokeball} alt='*' width={26} className='select-none'/>
          <p className='nunito-bold text-xl sm:text-2xl sm:ml-12 ml-4'>How To Play?</p>
          <Image src={Psyduck} alt='*' className='select-none w-[40px] sm:w-[57px]'/>
        </div>

        <div className='mt-4'>
          <p className='nunito-semibold text-base' style={{lineHeight: ''}}>The goal is simple: Find the secret Pokémon!</p>
          <p className='nunito-semibold text-base mt-[7px]'>Start by guessing any Pokémon, and after each guess, you’ll get a ranking based on how similar your Pokémon is to the secret one. The closer the rank, the more similar they are.</p>
          <p className='nunito-semibold text-base mt-[7px]'>Similarity is determined by factors like type, evolution, generation, habitat, shape, and color.</p>  
          <p className='nunito-semibold text-base mt-[7px]'>Keep guessing and narrowing it down until your Pokémon takes the number 1 spot.</p>
          <p className='nunito-semibold text-base mt-[15px]'>Think you’ve got what it takes to uncover the secret Pokémon? Dive in and start guessing!</p>      
        </div>

        <div className='flex items-end justify-between mt-4'>
          <Image src={Snorlax} alt="*" className='w-[57px] sm:w-[97px] select-none'/>
          <button className='mr-4 sm:mr-10 flex justify-center items-center box-shadow gap-3 lg:px-[70px] px-[30px] lg:py-[18px] py-[10px] nunito-bold bg-[#6A0DAD] dark:text-white text-black' onClick={() => setLetsPlay(true)}>
            <p className='text-lg'>Start</p>
            <p className='text-lg'>&gt;</p>
          </button>
          <Image src={PurplePokeball} alt="*" width={26} className='select-none'/>
        </div>

      </div>
    </div>
  )
}

export default Instructions