import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBr0Iqan5tWBPAqbV5-42MPlOuj6HvdS8A',
  authDomain: 'cloudcomputing3-19e4b.firebaseapp.com',
  projectId: 'cloudcomputing3-19e4b',
  storageBucket: 'cloudcomputing3-19e4b.firebasestorage.app',
  messagingSenderId: '300530553546',
  appId: '1:300530553546:web:00fbb5c8cf517e43b1da33',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
