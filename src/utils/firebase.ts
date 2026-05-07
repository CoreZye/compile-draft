import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyADN0SsPlC-N5yxw9mvPpaLCsDChIF00zM",
    authDomain: "compile-draft-d5934.firebaseapp.com",
    projectId: "compile-draft-d5934",
    storageBucket: "compile-draft-d5934.firebasestorage.app",
    messagingSenderId: "509604059922",
    appId: "1:509604059922:web:dbefcd25c80a2a774731cb",
    measurementId: "G-CTWF3TQLY7"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

export const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
    })
});