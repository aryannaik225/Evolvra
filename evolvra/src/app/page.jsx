'use client'

import DarkModeToggle from '@/components/DarkModeToggle'
import { useEffect, useState } from 'react'
import GamePage from '@/components/GamePage'
import Navbar from '@/components/Navbar'
import Testing from '@/components/Testing'
import React from 'react'

const page = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fetch the theme from localStorage or use media query for initial state
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  // Update the document body class and localStorage when isDarkMode changes
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <div className='bg-cover bg-center'>
      <DarkModeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}/>
      <Navbar />
      <div className='mt-4'>
        
        <GamePage isDarkMode={isDarkMode}/>
      </div>
      {/* <Testing /> */}
    </div>
  )
}

export default page