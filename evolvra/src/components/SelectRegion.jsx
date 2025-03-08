import React from 'react'
import Psyduck from '@/assets/psyduck.svg'
import PurplePokeball from '@/assets/purple-pokeball.svg'
import Snorlax from '@/assets/snorlax.svg'
import Image from 'next/image'

const SelectRegion = ({ setLetsPlay, setSelectRegion, setSelectedRegion }) => {

  const handleClick = (region) => {
    setSelectedRegion(region)
    setSelectRegion(false)
    setLetsPlay(true)
  }

  return (
    <div className='rounded-xl dark:bg-[#2A1E4F] dark:border-[#6A0DAD] bg-[#8647B3] border-[#2A1E4F] border-4 border-solid mb-9 w-full sm:w-[443px] md:w-[573px]'>
      <div className='p-4 flex flex-col'>
        <div className='flex items-center sm:items-start justify-between'>
          <Image src={PurplePokeball} alt='*' width={26} draggable='false' className='select-none'/>
          <p className='nunito-bold text-xl sm:text-2xl sm:ml-12 ml-4'>Select a Region</p>
          <Image src={Psyduck} alt='*' draggable='false' className='select-none w-[40px] sm:w-[57px]'/>
        </div>

        <div className='mt-4 flex flex-col gap-5 items-center'> 
          <button className='flex justify-between items-center w-44 h-11 nuninto-semibold text-base kanto-bg dark:text-white text-black rounded-lg px-2 hover:scale-110 transition-all duration-300 ease-out' onClick={() => handleClick('Kanto')}></button>

          <button className='flex justify-between items-center w-44 h-11 nuninto-semibold text-base johto-bg dark:text-white text-black rounded-lg px-2 hover:scale-110 transition-all duration-300 ease-out' onClick={() => handleClick('Johto')}></button>

          <button className='flex justify-between items-center w-44 h-11 nuninto-semibold text-base hoenn-bg dark:text-white text-black rounded-lg px-2 hover:scale-110 transition-all duration-300 ease-out' onClick={() => handleClick('Hoenn')}></button>

          <button className='flex justify-between items-center w-44 h-11 nuninto-semibold text-base sinnoh-bg dark:text-white text-black rounded-lg px-2 hover:scale-110 transition-all duration-300 ease-out' onClick={() => handleClick('Sinnoh')}></button>

          <button className='flex justify-between items-center w-44 h-11 nuninto-semibold text-base unova-bg dark:text-white text-black rounded-lg px-2 hover:scale-110 transition-all duration-300 ease-out' onClick={() => handleClick('Unova')}></button>
        </div>

        <div className='flex items-end justify-between mt-4'>
          <Image src={Snorlax} alt="*" draggable='false' className='w-[57px] sm:w-[97px] select-none'/>
          
          <Image src={PurplePokeball} alt="*" width={26} draggable='false' className='select-none'/>
        </div>
      </div>
    </div>
  )
}

export default SelectRegion