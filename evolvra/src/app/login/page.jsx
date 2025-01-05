'use client'

import Login from '@/components/Login'
import { AuthProvider } from '@/context/AuthContext'
import React from 'react'

const page = () => {
  return (
    <AuthProvider>
      <Login />
    </AuthProvider>
  )
}

export default page