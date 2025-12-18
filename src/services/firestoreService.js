/**
 * firestoreService.js
 * 
 * Service Firestore CRUD
 * Centralise toute la logique de communication avec Firestore
 * 
 * SECTION 3 : Firestore Database
 */

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * ========================
 * CREATE - Ajouter une tâche
 * ========================
 */
export const addTask = async (userId, title, description = '') => {
  try {
    console.log('📝 Création de tâche:', { userId, title });
    
    const tasksRef = collection(db, 'tasks');
    
    const docRef = await addDoc(tasksRef, {
      userId,                    // L'ID de l'utilisateur propriétaire
      title,                     // Titre de la tâche
      description,               // Description (optionnel)
      completed: false,          // État initial : non complétée
      createdAt: serverTimestamp(), // Timestamp serveur (plus fiable)
      updatedAt: serverTimestamp(),
    });
    
    console.log('✅ Tâche créée avec ID:', docRef.id);
    return docRef.id;
    
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error);
    throw error;
  }
};

/**
 * ============================
 * READ - Récupérer les tâches
 * (une seule fois)
 * ============================
 */
export const getTasks = async (userId) => {
  try {
    console.log('📖 Récupération des tâches pour:', userId);
    
    // Créer une requête filtrée par userId
    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef, where('userId', '==', userId));
    
    // Récupérer TOUS les documents
    const querySnapshot = await getDocs(q);
    
    // Transformer les documents en tableau
    const tasks = querySnapshot.docs.map(doc => ({
      id: doc.id,                    // ID du document
      ...doc.data()                  // Tous les champs du document
    }));
    
    console.log('✅ Tâches récupérées:', tasks.length);
    return tasks;
    
  } catch (error) {
    console.error('❌ Erreur lors de la lecture:', error);
    throw error;
  }
};

/**
 * ======================================
 * READ REALTIME - Tâches en temps réel
 * (listener qui met à jour automatiquement)
 * ======================================
 */
export const onTasksChange = (userId, callback) => {
  try {
    console.log('🔔 Création d\'un listener temps réel pour:', userId);
    
    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef, where('userId', '==', userId));
    
    // onSnapshot = listener permanent
    // À chaque changement, la callback est appelée
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('🔄 Mise à jour temps réel:', tasks.length, 'tâches');
      callback(tasks);
    });
    
    // Retourner la fonction pour arrêter le listener si nécessaire
    return unsubscribe;
    
  } catch (error) {
    console.error('❌ Erreur lors de la création du listener:', error);
    throw error;
  }
};

/**
 * ========================
 * UPDATE - Modifier une tâche
 * ========================
 */
export const updateTask = async (taskId, updates) => {
  try {
    console.log('✏️ Mise à jour de la tâche:', taskId);
    
    const taskRef = doc(db, 'tasks', taskId);
    
    // Ajouter toujours updatedAt
    const dataToUpdate = {
      ...updates,
      updatedAt: serverTimestamp(),
    };
    
    await updateDoc(taskRef, dataToUpdate);
    
    console.log('✅ Tâche mise à jour');
    
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
    throw error;
  }
};

/**
 * ============================
 * DELETE - Supprimer une tâche
 * ============================
 */
export const deleteTask = async (taskId) => {
  try {
    console.log('🗑️ Suppression de la tâche:', taskId);
    
    const taskRef = doc(db, 'tasks', taskId);
    await deleteDoc(taskRef);
    
    console.log('✅ Tâche supprimée');
    
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    throw error;
  }
};

/**
 * ============================
 * TOGGLECOMPLETE - Marquer complétée
 * ============================
 */
export const toggleComplete = async (taskId, currentStatus) => {
  try {
    await updateTask(taskId, {
      completed: !currentStatus,
    });
  } catch (error) {
    console.error('❌ Erreur lors du toggle:', error);
    throw error;
  }
};
