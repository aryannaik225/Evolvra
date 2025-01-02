'use client'

import React, { useEffect, useState } from 'react'

const DarkModeToggle = ({ isDarkMode, setIsDarkMode }) => {

  return (
    <button
      onClick={() => setIsDarkMode((prev) => !prev)}
      className='absolute lg:top-12 lg:right-32 top-12 right-4 p-2 bg-gray-200 dark:bg-[#6A0DAD] rounded-full cursor-pointer hover:scale-105 transform transition-transform'
    >
      {isDarkMode ? (
        <span className='text-yellow-500'>🌙</span>
      ) : (
        <span className='text-yellow-700'>☀️</span>
      )}
    </button>
  )
}

export default DarkModeToggle