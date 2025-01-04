'use client'

import { useEffect, useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/utils/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isClient, setIsClient] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() =>{
    if (isClient && user) {
      router.push("/");
    }
  }, [user, isClient, router]);
 
  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEmailSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error.message);
    }
  };

  if(!isClient) {
    return null;
  }

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
  );
};

export default Login;
