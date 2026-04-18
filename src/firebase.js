import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';

// TODO: Replace with your actual Firebase config from the console
// 1. Go to Firebase Console -> Project Settings -> General
// 2. Scroll down to "Your apps" -> "Web app" and copy the config object below
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGSrkLi2s6PqGZLcxe4VKIpIaklu75g5I",
  authDomain: "guardian-sport-ai.firebaseapp.com",
  projectId: "guardian-sport-ai",
  storageBucket: "guardian-sport-ai.firebasestorage.app",
  messagingSenderId: "139185876860",
  appId: "1:139185876860:web:7a75a1a0a45ee165cb7ef9",
  measurementId: "G-N16DCCW4GQ"
};

let app, db, storage, auth, analytics, functions;

try {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  db = getFirestore(app);
  storage = getStorage(app);
  auth = getAuth(app);
  functions = getFunctions(app, 'us-east1');
  console.log("Firebase initialized successfully!");
} catch (error) {
  console.error("Firebase initialization failed. Please check your config in src/firebase.js:", error);
}

export { app, db, storage, auth, analytics, functions };
