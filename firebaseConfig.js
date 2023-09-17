// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD13MefMOwYjv9zqExTlVpFIOlJjtpbdB4",
  authDomain: "vandymarketplace.firebaseapp.com",
  projectId: "vandymarketplace",
  storageBucket: "vandymarketplace.appspot.com",
  messagingSenderId: "577110193408",
  appId: "1:577110193408:web:a225c32885e1f1aecf6fe5",
  measurementId: "G-Q5GP9N0EJT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);


export { db, storage};