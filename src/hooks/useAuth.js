/**
 * useAuth Hook
 * 
 * Hook personnalisé pour accéder au contexte d'authentification
 * Séparé du provider pour respecter React Fast Refresh
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
}
