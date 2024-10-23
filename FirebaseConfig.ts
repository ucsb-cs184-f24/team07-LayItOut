// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbKWvUMhVr4NANxIhNYSH2-Ajp_eqWm_4",
  authDomain: "va-lio.firebaseapp.com",
  projectId: "va-lio",
  storageBucket: "va-lio.appspot.com",
  messagingSenderId: "222223767427",
  appId: "1:222223767427:web:8f715d29bc22c3d068c8b6"
};

// Initialize Firebase
export const fire_app = initializeApp(firebaseConfig);
export const fire_auth = getAuth(fire_app);