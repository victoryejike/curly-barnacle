// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXhz9n1bwKrhWwXXED2570SyUrIJoT6lI",
  authDomain: "bukkahut-80159.firebaseapp.com",
  projectId: "bukkahut-80159",
  storageBucket: "bukkahut-80159.appspot.com",
  messagingSenderId: "381102566327",
  appId: "1:381102566327:web:5f9131990428befa76d632",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();

export default app;
