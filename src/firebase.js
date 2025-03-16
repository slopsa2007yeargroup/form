// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyB9bt7BuGgsGjTCDul1741ISikWW4eG6yE",
    authDomain: "st-louis-app.firebaseapp.com",
    databaseURL: "https://st-louis-app-default-rtdb.firebaseio.com",
    projectId: "st-louis-app",
    storageBucket: "st-louis-app.firebasestorage.app",
    messagingSenderId: "688310246443",
    appId: "1:688310246443:web:a45feec486130523e29e6e"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;