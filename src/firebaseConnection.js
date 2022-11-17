import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCNB4e-2LIcjWr_NusJho-PCoNJe7yQ9zQ",
  authDomain: "curso-udemy-f6ed3.firebaseapp.com",
  projectId: "curso-udemy-f6ed3",
  storageBucket: "curso-udemy-f6ed3.appspot.com",
  messagingSenderId: "872804699816",
  appId: "1:872804699816:web:899e110a769420c59abc9d",
  measurementId: "G-SP8YLRPEM2",
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export { db };
