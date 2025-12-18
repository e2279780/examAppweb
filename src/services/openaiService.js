/**
 * Service OpenAI
 * 
 * Appelle la Cloud Function pour générer des réponses IA
 * La vraie clé OpenAI est protégée dans la Cloud Function
 */

import { getAuth } from 'firebase/auth';
import { app } from '../config/firebase';

const FUNCTION_URL =
  import.meta.env.VITE_OPENAI_FUNCTION_URL ||
  'https://us-central1-examfinale-15d1e.cloudfunctions.net/generateAIResponse';

// Appelle la Cloud Function HTTP (avec CORS)
export const generateAIResponse = async (taskId, taskTitle, taskDescription) => {
  try {
    const auth = getAuth(app);

    if (!auth.currentUser) {
      throw new Error('Utilisateur non authentifié');
    }

    const idToken = await auth.currentUser.getIdToken();

    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        taskId,
        taskTitle,
        taskDescription,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de la génération IA');
    }

    if (!data?.response) {
      throw new Error('Réponse IA vide');
    }

    console.log('✅ Réponse IA reçue:', data.response.substring(0, 50) + '...');
    return data.response;
  } catch (error) {
    console.error('❌ Erreur generateAIResponse:', error);
    throw error;
  }
};

/**
 * EXPLICATION :
 * 
 * 1. On appelle la Cloud Function depuis le frontend
 * 
 * 2. Le token d'authentification Firebase est envoyé dans le header
 *    → La Cloud Function vérifie que l'utilisateur est connecté
 * 
 * 3. La réponse IA revient au frontend
 * 
 * 4. Le frontend affiche la réponse dans la tâche
 * 
 * FLUX :
 * Frontend (Bouton "🤖 IA")
 *    ↓ Envoie taskId, taskTitle, taskDescription + token
 * Cloud Function (generateAIResponse)
 *    ↓ Vérifie l'authentification
 *    ↓ Appelle OpenAI API (clé sécurisée)
 *    ↓ Sauvegarde dans Firestore
 * Frontend
 *    ↓ Reçoit la réponse + affiche
 *    ↓ Update Firestore listener
 * Affichage
 *    ✅ Réponse visible dans la tâche
 */
