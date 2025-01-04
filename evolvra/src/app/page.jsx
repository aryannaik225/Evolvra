'use client'

import DarkModeToggle from '@/components/DarkModeToggle'
import { useEffect, useState } from 'react'
import GamePage from '@/components/GamePage'
import Navbar from '@/components/Navbar'
import React from 'react'
import { AuthProvider } from '@/context/AuthContext'

const page = () => {

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

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
    <AuthProvider>
      <div className='bg-cover bg-center'>
        <DarkModeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <Navbar />
        <div className='mt-4'>
          <GamePage isDarkMode={isDarkMode} />
        </div>
      </div>
    </AuthProvider>
  )
}

export default page