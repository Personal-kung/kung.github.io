// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, initializeFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";
// import { use } from "react";

// This helper checks if we are running on Vercel/Vite or locally via Live Server
const getEnv = (key) => {
    // If Vite/Vercel is present, use import.meta.env
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        return import.meta.env[key];
    }
    // If running locally via Live Server, we use a global config object (see step 2)
    return window.FIREBASE_CONFIG ? window.FIREBASE_CONFIG[key] : "";
};

const firebaseConfig = {
  apiKey: getEnv("Firebase_API_Key"),
  authDomain: getEnv("authDomain"),
  projectId: getEnv("projectId"),
  storageBucket: getEnv("storageBucket"),
  messagingSenderId: getEnv("messagingSenderId"),
  appId: getEnv("appId")
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// THIS IS THE CRITICAL PART FOR <60s LOADS
export const db = initializeFirestore(app, {
  // 1. Forces standard HTTP traffic (bypasses the 404 stream errors)
  experimentalForceLongPolling: true, 
  // 2. Disables the modern stream bridge that is currently being blocked
  useFetchStreams: false 
});
export const storage = getStorage(app);