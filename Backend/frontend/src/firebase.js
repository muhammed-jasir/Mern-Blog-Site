// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-site-f736b.firebaseapp.com",
  projectId: "mern-blog-site-f736b",
  storageBucket: "mern-blog-site-f736b.appspot.com",
  messagingSenderId: "719046652272",
  appId: "1:719046652272:web:5176fafda0838897af9fb5",
  measurementId: "G-KK30BWS604"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);