import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDmAJq34k3xeYrA1QguIzWdVWJ4Kdy9stg",
  authDomain: "picsell-ad150.firebaseapp.com",
  projectId: "picsell-ad150",
  storageBucket: "picsell-ad150.firebasestorage.app",
  messagingSenderId: "858561263921",
  appId: "1:858561263921:web:ee8c39223e1f69a9035810",
  measurementId: "G-CN0RTY0EHR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider("apple.com");