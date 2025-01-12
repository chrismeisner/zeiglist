// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID, // Optional, add this if required
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let analytics;

// Initialize Analytics only if it’s available (to avoid crashes)
try {
  analytics = getAnalytics(app);
  console.log("[Firebase] Analytics initialized successfully.");
} catch (err) {
  console.warn("[Firebase] Analytics could not be initialized:", err.message);
}

console.log("[Firebase] Firebase initialized successfully with environment variables!");

// Export Firebase instances
export { app, auth, analytics };
