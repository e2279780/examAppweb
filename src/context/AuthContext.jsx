/**
 * AuthContext.jsx
 * 
 * Gestion centralisée de l'authentification Firebase
 * IMPORTANT: Ce fichier n'exporte QUE le composant AuthProvider (pas de hooks)
 * Le hook useAuth est dans src/hooks/useAuth.js pour React Fast Refresh
 * 
 * Ce Context fournit:
 * - currentUser: L'utilisateur actuellement connecté
 * - login, signup, logout: Méthodes d'authentification
 * - loading: État de chargement
 */

import React, { createContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  GithubAuthProvider
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

// Créer le Context
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Providers Firebase (googleProvider est importé depuis firebase.js)
  const githubProvider = new GithubAuthProvider();

  /**
   * LOGIN AVEC GOOGLE
   * Ouvre une popup où l'utilisateur se connecte avec son compte Google
   */
  const loginWithGoogle = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      console.log('✅ Google Sign-In réussi:', result.user.email);
      return result.user;
    } catch (err) {
      const errorMessage = err.code === 'auth/popup-closed-by-user'
        ? 'Popup fermée'
        : 'Erreur Google Sign-In';
      setError(errorMessage);
      console.error('❌ Google Sign-In échoué:', err);
      throw err;
    }
  };

  /**
   * LOGIN AVEC GITHUB
   * Ouvre une popup où l'utilisateur se connecte avec son compte GitHub
   */
  const loginWithGitHub = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, githubProvider);
      console.log('✅ GitHub Sign-In réussi:', result.user.email);
      return result.user;
    } catch (err) {
      const errorMessage = err.code === 'auth/popup-closed-by-user'
        ? 'Popup fermée'
        : 'Erreur GitHub Sign-In';
      setError(errorMessage);
      console.error('❌ GitHub Sign-In échoué:', err);
      throw err;
    }
  };

  /**
   * LOGOUT
   * Déconnecte l'utilisateur actuel
   */
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      console.log('✅ Logout réussi');
    } catch (err) {
      setError('Erreur lors de la déconnexion');
      console.error('❌ Logout échoué:', err);
      throw err;
    }
  };

  /**
   * LISTENER D'AUTHENTIFICATION
   * Écoute les changements d'état d'authentification
   * (utile pour persister la session après un refresh)
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
        console.log('👤 Utilisateur connecté:', user.email);
      } else {
        console.log('👤 Aucun utilisateur connecté');
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    loginWithGoogle,
    loginWithGitHub,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


