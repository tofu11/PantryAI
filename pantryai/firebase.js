// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB2CDxOsZ08VhpqIxNf2kqc9aYKXoQOScs",
  authDomain: "pantryai-25b48.firebaseapp.com",
  projectId: "pantryai-25b48",
  storageBucket: "pantryai-25b48.appspot.com",
  messagingSenderId: "455183805735",
  appId: "1:455183805735:web:7c3cc90cbe443033790d02",
  measurementId: "G-JEJTVF3ZSN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export {firestore}