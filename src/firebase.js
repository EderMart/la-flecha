// firebase.js - Crea este archivo en la raíz de tu proyecto (mismo nivel que App.js)
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Tu configuración de Firebase (la obtienes de Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyBCooiHy_4g2whwkDyCw3x5N2rlFOxg5WA",
  authDomain: "la-flecha-joyeria.firebaseapp.com",
  projectId: "la-flecha-joyeria",
  storageBucket: "la-flecha-joyeria.firebasestorage.app",
  messagingSenderId: "895966765753",
  appId: "1:895966765753:web:8433beb5ccbd6b3b9af168",
  measurementId: "G-GY1XD2PESR"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);

export default app;