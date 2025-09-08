// auth.js - Crear este archivo en la raíz junto a firebase.js
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import app from './firebase';
import { useState, useEffect } from 'react';

export const auth = getAuth(app);

// Función para login
export const loginAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Error en login:', error);
    return { success: false, error: error.message };
  }
};

// Función para logout
export const logoutAdmin = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error en logout:', error);
    return { success: false, error: error.message };
  }
};

// Función para crear admin (solo usarás una vez)
export const createAdmin = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Error creando admin:', error);
    return { success: false, error: error.message };
  }
};

// Hook para escuchar cambios de autenticación
export const useAuthState = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};

// Función para verificar si el usuario es admin
export const isAdminUser = (user) => {
  // Lista de emails que pueden ser admin
  const adminEmails = [
    'admin@laflecha.com',
    'chatlaflecha@gmail.com'
  ];
  
  return user && adminEmails.includes(user.email);
};