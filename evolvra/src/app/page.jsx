import DarkModeToggle from '@/components/DarkModeToggle'
import GamePage from '@/components/GamePage'
import Navbar from '@/components/Navbar'
import Testing from '@/components/Testing'
import React from 'react'

const page = () => {
  return (
    <div>
      <DarkModeToggle />
      <Navbar />
      <div className='mt-4'>
        
        <GamePage />
      </div>
      {/* <Testing /> */}
    </div>
  )
}

export default page