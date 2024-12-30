import DarkModeToggle from '@/components/DarkModeToggle'
import Navbar from '@/components/Navbar'
import Testing from '@/components/Testing'
import React from 'react'

const page = () => {
  return (
    <div>
      <DarkModeToggle />
      <Navbar />
      {/* <Testing /> */}
    </div>
  )
}

export default page