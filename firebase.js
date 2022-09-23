// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApTrNQk4Ly0BfDqqo8amOpEPwXcWP0wyI",
  authDomain: "doggogram-da5b4.firebaseapp.com",
  projectId: "doggogram-da5b4",
  storageBucket: "doggogram-da5b4.appspot.com",
  messagingSenderId: "205424830838",
  appId: "1:205424830838:web:b70769744ea1afac7db257"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export { app, db, storage };
