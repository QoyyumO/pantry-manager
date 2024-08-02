import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyC0vdZHuy4jVLeYYlAVjAIRa_8Bp8VVG8U",
    authDomain: "aq-pantry-app.firebaseapp.com",
    projectId: "aq-pantry-app",
    storageBucket: "aq-pantry-app.appspot.com",
    messagingSenderId: "1062945058938",
    appId: "1:1062945058938:web:f6da04200b2483aa58cbc3"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);