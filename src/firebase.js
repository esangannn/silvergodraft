// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCPF-dCWOyFNatEpeGUgl4xwmwDGz4uVU0",
  authDomain: "silvergo-65e78.firebaseapp.com",
  projectId: "silvergo-65e78",
  storageBucket: "silvergo-65e78.firebasestorage.app",
  messagingSenderId: "898765381529",
  appId: "1:898765381529:web:71910b331f87be22733d08",
  measurementId: "G-C1FMYG2CLG"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const db = getFirestore(app);
