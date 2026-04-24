// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyADN0SsPlC-N5yxw9mvPpaLCsDChIF00zM",
    authDomain: "compile-draft-d5934.firebaseapp.com",
    projectId: "compile-draft-d5934",
    storageBucket: "compile-draft-d5934.firebasestorage.app",
    messagingSenderId: "509604059922",
    appId: "1:509604059922:web:dbefcd25c80a2a774731cb",
    measurementId: "G-CTWF3TQLY7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);