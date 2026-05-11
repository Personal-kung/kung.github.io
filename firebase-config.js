import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, initializeFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

// Read from the globally loaded config.js
const firebaseConfig = {
  apiKey: window.FIREBASE_CONFIG.apiKey,
  authDomain: window.FIREBASE_CONFIG.authDomain,
  projectId: window.FIREBASE_CONFIG.projectId,
  storageBucket: window.FIREBASE_CONFIG.storageBucket,
  messagingSenderId: window.FIREBASE_CONFIG.messagingSenderId,
  appId: window.FIREBASE_CONFIG.appId,
  measurementId: window.FIREBASE_CONFIG.measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// THIS IS THE CRITICAL PART FOR <60s LOADS
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false
});

export const storage = getStorage(app);
