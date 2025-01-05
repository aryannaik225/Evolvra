'use client'

import { useEffect, useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail, fetchSignInMethodsForEmail, GoogleAuthProvider } from "firebase/auth";
import { auth, googleProvider } from "@/utils/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { doc, setDoc, getDoc, getFirestore } from "firebase/firestore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [signup, setSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
  const [emailErrorValue, setEmailErrorValue] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordErrorValue, setpasswordErrorValue] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [rePasswordErrorValue, setRePasswordErrorValue] = useState(false);
  const [rePasswordError, setRePasswordError] = useState('');
  const [loginError, setLoginError] = useState('');

  const getErrorMessage = (error) => {
    const errorCode = error.code;
    switch (errorCode) {
      case 'auth/user-cancelled':
        return 'You cancelled the login process. Please try again.';
      case 'auth/invalid-credential':
        return 'Invalid credentials provided. Please check your email and password.';
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please use a different email or log in.';
      case 'auth/user-not-found':
        return 'No account found with this email. Please sign up first.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  const db = getFirestore();

  const saveUserToDatabase = async (uid, email) => {
    try {
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        await setDoc(userRef, { email }, { merge: true });
        console.log("User updated successfully!");
      } else {
        await setDoc(userRef, { email });
        console.log("User saved successfully!");
      }
    } catch (error) {
      console.error("Error saving/updating user to database:", error);
    }
  };

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && user) {
      router.push("/");
    }
  }, [user, isClient, router]);

  const handleEmailLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      saveUserToDatabase(user.uid, user.email);
      setLoginError("");
    } catch (error) {
      console.log(error.message);
      const errorMessage = getErrorMessage(error);
      setLoginError(errorMessage);
    }
  };

  const handleEmailLoginError = () => {
    if (!email || !password) {
      if(!email) {
        setEmailErrorValue(true);
        setEmailError("Email is required")
      } else {
        setEmailErrorValue(false);
      }
      if(!password) {
        setpasswordErrorValue(true);
        setPasswordError("Password is required")
      } else {
        setpasswordErrorValue(false);
      }
      return
    } else {
      setEmailErrorValue(false);
      setpasswordErrorValue(false);
    }
    handleEmailLogin();
  }

  const handleEmailSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      saveUserToDatabase(user.uid, user.email);
      setLoginError("");
    } catch (error) {
      console.log(error.message);
      const errorMessage = getErrorMessage(error);
      setLoginError(errorMessage);
    }
  };

  const handlePasswordLogic = () => {
    if (!email || !password || !rePassword) {
      if(!email) {
        setEmailErrorValue(true);
        setEmailError("Email is required")
      } else {
        setEmailErrorValue(false);
      }
      if(!password) {
        setpasswordErrorValue(true);
        setPasswordError("Password is required")
      } else {
        setpasswordErrorValue(false);
      }
      if(!rePassword) {
        setRePasswordErrorValue(true);
        setRePasswordError("Re-enter password is required")
      } else {
        setRePasswordErrorValue(false);
      }
      return
    } else {
      setEmailErrorValue(false);
      setpasswordErrorValue(false);
      setRePasswordErrorValue(false);
    }

    if (password !== rePassword) {
      setRePasswordErrorValue(true);
      setRePasswordError("Password does not match")
      return;
    } else {
      setRePasswordErrorValue(false);
    }
    handleEmailSignup();
  }

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      saveUserToDatabase(user.uid, user.email);
      setLoginError("");
    } catch (error) {
      console.log(error.message);
      const errorMessage = getErrorMessage(error);
      setLoginError(errorMessage);
    }
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setEmailErrorValue(true);
      setEmailError("Email is required for password reset")
      return
    }
    try {

    const methods = await fetchSignInMethodsForEmail(auth, email);
    if (methods.length === 0) {
      setEmailErrorValue(true);
      setEmailError("No account found with this email.");
      return;
    }

      await sendPasswordResetEmail(auth, email)
      setForgotPassword(false);
      setForgotPasswordSent(true);
      setLoginError("")
    } catch (error) {
      console.log(error.message);
      const errorMessage = getErrorMessage(error);
      setLoginError(errorMessage);
    }
  }

  const toggleForgotPassword = () => {
    setForgotPassword((prev) => !prev);
    setEmailErrorValue(false);
    setEmailError("");
    setRePasswordErrorValue(false);
    setRePasswordError("");
    setpasswordErrorValue(false);
    setPasswordError("");
    setSignup(false);
  }

  if (!isClient) {
    return null;
  }

  return (
    <div>
      <video id='myVideo' autoPlay loop muted className="-z-10 fixed top-0 left-0 w-screen h-auto">
        <source src="/mudkip-rainy-day-pond-pokemon-moewalls.mp4" type="video/mp4" />
      </video>

      <div className="flex items-center justify-center w-screen h-screen">
        <div className="flex flex-col items-center w-[397px] h-[421px] glass">
          <div className="w-full flex justify-center items-center mt-5 bg-[#00000070]">
            <p className="text-xs text-red-600 nunito-medium">{loginError}</p>
          </div>
          <p className="text-white nunito-bold text-3xl mt-5">{forgotPassword ? 'Enter Email' : signup ? 'Welcome!' : 'Welcome Back!'}</p>
          <div className={` w-auto h-auto flex flex-col items-center ${signup ? 'mt-7 gap-5' : 'mt-14 gap-7'}`}>
            <div className="flex items-center w-[281px] h-[43px] bg-[#00000050] rounded-3xl border-2 border-white relative">
              <input type="email" id="floating_outlined1" onChange={(e) => setEmail(e.target.value)} className="z-20 block ml-5 pb-2.5 pt-2 w-full text-sm bg-transparent rounded-lg border-1 border-gray-300 appearance-none text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
              <label htmlFor="floating_outlined1" className="absolute text-sm ml-3 text-gray-500 duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-[#000000] px-2 peer-focus:px-2 peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Email Id</label>
              <div className={`cursor-default z-30 group absolute right-5 bg-red-400 rounded-full w-4 h-4 ${emailErrorValue ? 'flex' : 'hidden'} justify-center items-center`}>
                <p className="text-red-50">!</p>
                <div className="hidden group-hover:block absolute bottom-full right-0 mb-2 w-32 p-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg">
                  {emailError}
                </div>
              </div>
            </div>

            <div className={`${forgotPassword ? 'hidden' : 'flex'} items-center w-[281px] h-[43px] bg-[#00000050] rounded-3xl border-2 border-white relative`}>
              <input type={showPassword ? 'text' : 'password'} id="floating_outlined2" onChange={(e) => setPassword(e.target.value)} className="z-20 block ml-5 pb-2.5 pt-2 w-full text-sm bg-transparent rounded-lg border-1 border-gray-300 appearance-none text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
              <label htmlFor="floating_outlined2" className="absolute text-sm ml-3 text-gray-500 duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-black px-2 peer-focus:px-2
            peer-focus:text-white peer-placeholder-shown:scale-100 peer-focus:bg-black peer-placeholder-shown:bg-transparent   peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Password</label>
              <div className={`cursor-default z-30 group absolute right-5 bg-red-400 rounded-full w-4 h-4 ${passwordErrorValue ? 'flex' : 'hidden'} justify-center items-center`}>
                <p className="text-red-50">!</p>
                <div className="hidden group-hover:block absolute bottom-full right-0 mb-2 w-32 p-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg">
                  {passwordError}
                </div>
              </div>
            </div>

            <div className={`items-center w-[281px] h-[43px] bg-[#00000050] rounded-3xl border-2 border-white relative ${forgotPassword ? 'hidden' : signup ? 'flex' : 'hidden'}`}>
              <input type={showPassword ? 'text' : 'password'} value={rePassword} onChange={(e) => setRePassword(e.target.value)} id="floating_outlined3" className="z-20 block ml-5 pb-2.5 pt-2 w-full text-sm bg-transparent rounded-lg border-1 border-gray-300 appearance-none text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
              <label htmlFor="floating_outlined3" className="absolute text-sm ml-3 text-gray-500 duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-black px-2 peer-focus:px-2 peer-focus:text-white peer-placeholder-shown:scale-100 peer-focus:bg-black peer-placeholder-shown:bg-transparent   peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Re-enter Password</label>
              <div className={`cursor-default z-30 group absolute right-5 bg-red-400 rounded-full w-4 h-4 ${rePasswordErrorValue ? "flex" : 'hidden'} justify-center items-center`}>
                <p className="text-red-50">!</p>
                <div className="hidden group-hover:block absolute bottom-full right-0 mb-2 w-32 p-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg">
                  {rePasswordError}
                </div>
              </div>
            </div>

          </div>
          <div className={`${forgotPassword ? 'hidden' : 'flex'} justify-center w-full mt-3`}>
            <div className="w-[281px] flex justify-between items-center">
              <div className="flex items-center">
                <input type="checkbox" id="password_show" checked={showPassword} onChange={togglePassword} className="ml-2 w-4 h-4 text-green-600 bg-white-100 border-gray-300 rounded-lg ring-offset-gray-800 "/>
                <label htmlFor="password_show" className="ms-2 text-xs nunito-regular text-white">Show Password</label>
              </div>
              <div>
                <button className={`text-xs nunito-regular text-white mr-2 ${signup ? 'hidden' : 'block'}`} onClick={toggleForgotPassword}>Forgot Password?</button>
              </div>
            </div>
          </div>

          <div className="mt-3 flex w-[281px] justify-between items-center">
            <button onClick={signup ? handlePasswordLogic : handleEmailLoginError} className={`bg-white hover:bg-gray-200 py-2 ${signup ? "px-9" : "px-12"} transition-all duration-200 border-2 border-white text-black nunito-semibold text-sm rounded-full ${forgotPassword ? 'hidden' : 'flex'}`}>{signup ? 'Register' : 'Login'}</button>
            <button onClick={handleGoogleLogin} className={`bg-[#00000050] hover:bg-gray-500 transition-all duration-200 py-2 px-8 text-white nunito-regular border-2 border-white text-sm rounded-full ${forgotPassword ? 'hidden' : 'flex'} justify-center items-center gap-2`}>
              <img src="/google-icon.svg" alt="google icon" className="w-4 h-4 select-none" />
              <p>Google</p>
            </button>
            <button className={`${forgotPassword ? 'block' : 'hidden'} bg-white hover:bg-gray-200 py-2 w-full transition-all duration-200 border-2 border-white text-black nunito-semibold text-sm rounded-full`} onClick={handleForgotPassword}>Send Email</button>
          </div>

          <div className={`mt-4 ${forgotPassword ? 'hidden' : ''}`}>
            <p className="text-white nunito-regular text-sm">{signup ? 'Already have an account?' : "Don't have an account?"} <span onClick={() => setSignup((prev) => !prev)} className="text-blue-500 cursor-pointer">{signup ? 'Log In' : 'Sign Up'}</span></p>
          </div>

          <div className={`mt-4 ${forgotPassword ? '' : 'hidden'}`}>
            <p className="text-white nunito-regular text-sm">Remember your password? <span onClick={toggleForgotPassword} className="text-blue-500 cursor-pointer">Log In</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
