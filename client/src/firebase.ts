// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-e0662.firebaseapp.com",
  projectId: "mern-blog-e0662",
  storageBucket: "mern-blog-e0662.appspot.com",
  messagingSenderId: "870168885191",
  appId: "1:870168885191:web:e97f4edf96ecdb772fcbe2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
