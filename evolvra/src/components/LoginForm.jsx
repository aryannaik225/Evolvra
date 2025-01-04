import React, { useState } from "react";
import { signInWithGoogle, signUpWithEmail, signInWithEmail } from "@/utils/firebaseConfig";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleEmailLogin = async () => {
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
        alert("Sign-up successful!");
      } else {
        await signInWithEmail(email, password);
        alert("Login successful!");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      alert("Google Login Successful!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>{isSignUp ? "Sign Up" : "Log In"}</h2>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleEmailLogin}>{isSignUp ? "Sign Up" : "Log In"}</button>
      <button onClick={handleGoogleLogin}>Sign In with Google</button>
      <p onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
      </p>
    </div>
  );
};

export default LoginForm;
