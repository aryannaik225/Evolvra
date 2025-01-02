import React from 'react'
import Psyduck from '@/assets/psyduck.svg'
import Snorlax from '@/assets/snorlax.svg'
import PurplePokeball from '@/assets/purple-pokeball.svg'
import Image from 'next/image'

const Instructions = () => {
  return (
    <div className='rounded-xl bg-[#2A1E4F] border-[#6A0DAD] border-4 border-solid mb-9'>
      <div className='p-4 w-[539px] flex flex-col'>
        <div className='flex items-start justify-between'>
          <Image src={PurplePokeball} alt='*' width={26} className='select-none'/>
          <p className='nunito-bold text-2xl text-[#F1F1F1]'>How To Play?</p>
          <Image src={Psyduck} alt='*' width={57} className='select-none'/>
        </div>

        <div>
          <p className='nunito-semibold text-base' style={{lineHeight: ''}}>The goal is simple: find the secret Pokémon!</p>
          <p className='nunito-semibold text-base mt-[7px]'>Start by guessing any Pokémon, and after each guess, you’ll get a ranking based on how similar your Pokémon is to the secret one. The closer the rank, the more similar they are.</p>
          <p className='nunito-semibold text-base mt-[7px]'>Similarity is determined by factors like type, evolution, generation, habitat, shape, and color.</p>  
          <p className='nunito-semibold text-base mt-[7px]'>Keep guessing and narrowing it down until your Pokémon takes the number 1 spot.</p>
          <p className='nunito-semibold text-base mt-[15px]'>Think you’ve got what it takes to uncover the secret Pokémon? Dive in and start guessing!</p>      
        </div>

        <div className='flex items-end justify-between mt-4'>
          <Image src={Snorlax} alt="*" width={97} className='select-none'/>
          <Image src={PurplePokeball} alt="*" width={26} className='select-none'/>
        </div>

      </div>
    </div>
  )
}

export default Instructions