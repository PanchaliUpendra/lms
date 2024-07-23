// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getStorage} from 'firebase/storage';
import {getMessaging , getToken, onMessage} from 'firebase/messaging';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJuzRYn0VK5F7WlwivYK5WqJ8KXOrqxNI",
  authDomain: "lmstesting-5c422.firebaseapp.com",
  projectId: "lmstesting-5c422",
  storageBucket: "lmstesting-5c422.appspot.com",
  messagingSenderId: "123179514488",
  appId: "1:123179514488:web:4b86d1cba90a0438d3cb8d",
  measurementId: "G-JK08WXWL7D"
};

//secondary app
// Create secondary app
const secondaryAppConfig = {
  apiKey: "AIzaSyCJuzRYn0VK5F7WlwivYK5WqJ8KXOrqxNI",
  authDomain: "lmstesting-5c422.firebaseapp.com",
  projectId: "lmstesting-5c422",
  storageBucket: "lmstesting-5c422.appspot.com",
  messagingSenderId: "123179514488",
  appId: "1:123179514488:web:4b86d1cba90a0438d3cb8d",
  measurementId: "G-JK08WXWL7D"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);
export const secondaryapp = initializeApp(secondaryAppConfig,"secondary");
export const secondauth = getAuth(secondaryapp);

export {getToken,onMessage};