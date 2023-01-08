import React from 'react'
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  };


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp() // only initialise if not exists
export const auth = getAuth(app);
export default app;
