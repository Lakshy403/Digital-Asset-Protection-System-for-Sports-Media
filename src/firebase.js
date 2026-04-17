import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// TODO: Replace with your actual Firebase config from the console
// 1. Go to Firebase Console -> Project Settings -> General
// 2. Scroll down to "Your apps" -> "Web app" and copy the config object below
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAgjr6vWZJgVSzy6pTEAjC8iaHKIFaFo1c",
  authDomain: "guardian-sport-ai-6237d.firebaseapp.com",
  projectId: "guardian-sport-ai-6237d",
  storageBucket: "guardian-sport-ai-6237d.firebasestorage.app",
  messagingSenderId: "422799738723",
  appId: "1:422799738723:web:c582e303c7b18d34e5b556",
  measurementId: "G-6R4V4G4VMM"
};

let app, db, storage, auth, analytics;

try {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  db = getFirestore(app);
  storage = getStorage(app);
  auth = getAuth(app);
  console.log("Firebase initialized successfully!");
} catch (error) {
  console.error("Firebase initialization failed. Please check your config in src/firebase.js:", error);
}

export { app, db, storage, auth, analytics };
