import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-07j-_A3AfvSxreksrCzNeMW7VppXg9A",
  authDomain: "invata-flex.firebaseapp.com",
  projectId: "invata-flex",
  storageBucket: "invata-flex.appspot.com",
  messagingSenderId: "580579209259",
  appId: "1:580579209259:web:e08f024375b21c1de2fa6e",
  measurementId: "G-7D65ZWWTQ8",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
