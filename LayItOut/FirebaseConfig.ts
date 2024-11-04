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


export const uploadImageToFirebaseViaREST = async (uri:string) => {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    const storageBucket = 'cs184-layitout.appspot.com';
    if (!userId) throw new Error("User is not authenticated");
  
    const apiUrl = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/screenshots%2F${userId}%2F${new Date().toISOString()}.png?uploadType=media`;
  
    const response = await fetch(uri);
    const blob = await response.blob();
  
    try {
      const uploadResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${await FIREBASE_AUTH.currentUser!.getIdToken()}`,
          "Content-Type": "image/png",
        },
        body: blob
      });
  
      const result = await uploadResponse.json();
      if (!uploadResponse.ok) {
        throw new Error(result.error.message || 'Failed to upload');
      }
  
      console.log("Uploaded successfully via REST:", result);
        } catch (error) {
        if (error instanceof Error) {
            console.error("Error uploading via REST API:", error);
            alert("Failed to upload. Error: " + error.message);
        } else {
            console.error("Unknown error uploading:", error);
            alert("Failed to upload. Unknown error occurred.");
        }
    }
  };