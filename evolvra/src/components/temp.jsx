import React from 'react'

const temp = () => {
  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleEmailLogin}>Login</button>
      <button onClick={handleEmailSignup}>Sign Up</button>
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  )
}

export default temp