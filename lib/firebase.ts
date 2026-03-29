import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-okaY6D-AWMZBciLMb-Ag49Fj9YZXJdc",
  authDomain: "haveri-a78e3.firebaseapp.com",
  projectId: "haveri-a78e3",
  storageBucket: "haveri-a78e3.firebasestorage.app",
  messagingSenderId: "21871648793",
  appId: "1:21871648793:web:cb21c1af59b65ac1e94a88"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);