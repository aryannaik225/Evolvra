'use client'

import React, { useEffect, useState } from 'react'

const DarkModeToggle = ({ isDarkMode, setIsDarkMode }) => {

  return (
    <button
      onClick={() => setIsDarkMode((prev) => !prev)}
      className='absolute top-12 right-32 p-2 bg-gray-200 dark:bg-[#6A0DAD] rounded-full cursor-pointer hover:scale-105 transform transition-transform'
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