'use client'

import Login from '@/components/Login'
import { AuthProvider } from '@/context/AuthContext'
import React from 'react'

const page = () => {
  return (
    <AuthProvider>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f9f9f9" }}>
        <div style={{ maxWidth: "400px", width: "100%", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", background: "#fff" }}>
          <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Welcome to Evolvra</h1>
          <Login />
        </div>
      </div>
    </AuthProvider>
  )
}

export default page