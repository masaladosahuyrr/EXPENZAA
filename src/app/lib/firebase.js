
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyA2zwpKUafT5n4dZMynSnDRAWwHyyN4LHs",
  authDomain: "expenzaa-auth.firebaseapp.com",

  projectId: "expenzaa-auth",

  storageBucket: "expenzaa-auth.firebasestorage.app",

  messagingSenderId: "755930042762",
  appId: "1:755930042762:web:486257a83ea2489c993873",
  measurementId: "G-HNZ40NNCTH"
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
