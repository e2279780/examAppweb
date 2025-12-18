/**
 * Configuration Firebase
 * 
 * Ce fichier initialise Firebase et exporte les services nécessaires :
 * - Auth (Authentification Google/GitHub)
 * - Firestore (Base de données)
 * - Storage (Téléversement de fichiers)
 * - App Check (Sécurité)
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// ⚠️ IMPORTANT : Remplacer avec vos vraies valeurs Firebase
// Récupérer les valeurs depuis https://console.firebase.google.com
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'YOUR_AUTH_DOMAIN',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'YOUR_STORAGE_BUCKET',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_MESSAGING_SENDER_ID',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'YOUR_APP_ID',
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
export { app };

// Initialiser les services Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Google Auth Provider (pour Sign-In avec Google)
export const googleProvider = new GoogleAuthProvider();

// Note: reCAPTCHA v2 Checkbox est utilisé directement via le widget HTML
// App Check Firebase ne supporte que reCAPTCHA v3
// Pour v2, on utilise le widget standard Google reCAPTCHA
// Le token v2 est géré côté Login.jsx avec les callbacks globaux

export default app;
