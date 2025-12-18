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
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

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

// Initialiser les services Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Google Auth Provider (pour Sign-In avec Google)
export const googleProvider = new GoogleAuthProvider();

// Initialiser App Check avec reCAPTCHA v3 (Section 5)
// Pour l'instant, on le met en commentaire jusqu'à la SECTION 5
// export const appCheck = initializeAppCheck(app, {
//   provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_KEY),
// });

export default app;
