import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Force account selection on every sign-in attempt
provider.setCustomParameters({
  prompt: 'select_account'
});

export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider)
    .then(async (result) => {
      const user = result.user;
      if (user.email.endsWith("@ucsb.edu")) {
        console.log("Sign-in successful", result);

        // Store user data in Firestore
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          picUrl: user.photoURL,
          // Add other user data as needed
        }, { merge: true });

        return result;
      } else {
        await signOut(auth);
        throw new Error("Only UCSB students are accepted");
      }
    })
    .catch((error) => {
      console.error("Error during sign-in:", error);
      throw error;
    });
};

export const signOutUser = () => {
  return signOut(auth)
    .then(() => {
      console.log("Sign-out successful");
    })
    .catch((error) => {
      console.error("Error during sign-out:", error);
      throw error;
    });
};

// Export db, auth, and provider for use in other parts of the application
export { db, auth, provider };