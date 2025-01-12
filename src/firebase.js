// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEzvhAT7ooe7yL3HIGfBuddccOQAXscdE",
  authDomain: "zeiglist.firebaseapp.com",
  projectId: "zeiglist",
  storageBucket: "zeiglist.appspot.com",
  messagingSenderId: "455814575902",
  appId: "1:455814575902:web:9139157d30c1dccc9a7b0f",
  measurementId: "G-Z36FDQGHZJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Ensure the Auth instance is initialized

console.log("[Firebase] Firebase initialized successfully with hardcoded values!");

export { app, auth };
