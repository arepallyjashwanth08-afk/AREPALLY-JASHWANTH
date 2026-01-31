import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBUCiAzhEZ1d6BQYMkRBEVWItA7k7jnwrg",
  authDomain: "xttxxt.firebaseapp.com",
  databaseURL: "https://xttxxt-default-rtdb.firebaseio.com",
  projectId: "xttxxt",
  storageBucket: "xttxxt.firebasestorage.app",
  messagingSenderId: "780390611862",
  appId: "1:780390611862:web:fdb34d51fe461044dafbb7",
  measurementId: "G-95R1HRGPK6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);