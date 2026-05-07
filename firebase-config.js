// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, initializeFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";
// import { use } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyDhqDQNw2py0c6-KVKzt2E-cHj2TOCY3hs",
  authDomain: "personal-portfolio-7cadc.firebaseapp.com",
  projectId: "personal-portfolio-7cadc",
  storageBucket: "personal-portfolio-7cadc.firebasestorage.app",
  messagingSenderId: "684119855739",
  appId: "1:684119855739:web:01143f994e954ebe5d08de"
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