// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "quick-bite-690c6.firebaseapp.com",
  projectId: "quick-bite-690c6",
  storageBucket: "quick-bite-690c6.firebasestorage.app",
  messagingSenderId: "834833188889",
  appId: "1:834833188889:web:ae00c78faaff51942b0288"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth=getAuth(app);
export {app,auth}