// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from "firebase/storage"; 
import firebase from 'firebase/app';
import 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwVVTvFLz_790IOtK4Y879cbYjGASiBOw",
  authDomain: "cs184-layitout.firebaseapp.com",
  projectId: "cs184-layitout",
  storageBucket: "cs184-layitout.appspot.com",
  messagingSenderId: "1059166967475",
  appId: "1:1059166967475:web:a9db42b712781b09d642c6",
  measurementId: "G-G4NGGZ8S1C"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);


export const uploadImageToFirebase = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const userId = FIREBASE_AUTH.currentUser?.uid; // Use optional chaining to avoid errors if user is not logged in
    if (!userId) {
        throw new Error("User is not authenticated");
    }
    
    const storageRef = ref(FIREBASE_STORAGE, `screenshots/${userId}/${new Date().toISOString()}.png`); // Create a reference to the file

    try {
        const snapshot = await uploadBytes(storageRef, blob); // Use uploadBytes to upload the blob
        console.log('Uploaded a blob or file!', snapshot);
    } catch (error) {
        console.error("Error uploading screenshot:", error);
        throw error; // Throw the error to handle it in the calling function
    }
};
