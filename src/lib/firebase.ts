// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDExTGOjsoaEIyo5VJyX6Z-rEvsQHJS6xs",
  authDomain: "collegeapp-d3265.firebaseapp.com",
  projectId: "collegeapp-d3265",
  storageBucket: "collegeapp-d3265.firebasestorage.app",
  messagingSenderId: "22773538861",
  appId: "1:22773538861:web:fd3ce5c2edd07dcb5598a4",
  measurementId: "G-LHX638T50B"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
