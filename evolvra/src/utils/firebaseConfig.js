import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_YOUR_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_YOUR_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_YOUR_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_YOUR_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_YOUR_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_YOUR_APP_ID
};

console.log(firebaseConfig);

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
