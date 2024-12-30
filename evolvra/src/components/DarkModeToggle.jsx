'use client'

import React, { useEffect, useState } from 'react'

const DarkModeToggle = () => {

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect( ()=> {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.body.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

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