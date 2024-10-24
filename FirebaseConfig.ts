import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7lvxcGulphEOzQvOWaf3JCvOE0Sht5WI",
  authDomain: "cs184-hw2-1dfac.firebaseapp.com",
  projectId: "cs184-hw2-1dfac",
  storageBucket: "cs184-hw2-1dfac.appspot.com",
  messagingSenderId: "956273698455",
  appId: "1:956273698455:web:f14278ab43955ff2236bd2",
  measurementId: "G-43VQ7MKGLF"
};

// Initialize Firebase
export const fire_app = initializeApp(firebaseConfig);
export const fire_auth = getAuth(fire_app);