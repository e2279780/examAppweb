/**
 * storageService.js
 * 
 * Service Firebase Storage
 * Gère l'upload, le téléchargement et la suppression de fichiers
 * 
 * SECTION 4 : Firebase Storage
 */

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from '../config/firebase';

/**
 * ============================
 * UPLOAD - Uploader un fichier
 * ============================
 * 
 * @param {File} file - Le fichier à uploader
 * @param {string} userId - L'ID de l'utilisateur
 * @param {function} onProgress - Callback pour la progression (0-100)
 * @returns {Promise<string>} - L'URL du fichier uploadé
 */
export const uploadFile = async (file, userId, onProgress = null) => {
  try {
    console.log('📤 Début d\'upload:', file.name);
    
    // Vérifier que c'est bien un fichier image/PDF
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Type de fichier non autorisé. Utilisez JPG, PNG, WebP ou PDF.');
    }
    
    // Vérifier la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('Le fichier dépasse 5MB');
    }
    
    // Créer un chemin unique pour le fichier
    // Format: users/{userId}/files/{timestamp}_{filename}
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name}`;
    const storagePath = `users/${userId}/files/${filename}`;
    
    // Créer une référence au fichier
    const fileRef = ref(storage, storagePath);
    
    // Créer la tâche d'upload avec progression
    const uploadTask = uploadBytesResumable(fileRef, file);
    
    // Listener sur la progression
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        // Progress callback
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`⏳ Progression: ${progress.toFixed(1)}%`);
          
          if (onProgress) {
            onProgress(progress);
          }
        },
        // Error callback
        (error) => {
          console.error('❌ Erreur upload:', error);
          reject(error);
        },
        // Success callback
        async () => {
          // Récupérer l'URL de téléchargement
          const downloadURL = await getDownloadURL(fileRef);
          console.log('✅ Upload réussi! URL:', downloadURL);
          resolve(downloadURL);
        }
      );
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'upload:', error);
    throw error;
  }
};

/**
 * ============================
 * DELETE - Supprimer un fichier
 * ============================
 * 
 * @param {string} fileUrl - L'URL du fichier à supprimer
 */
export const deleteFile = async (fileUrl) => {
  try {
    if (!fileUrl) {
      console.log('⚠️ Aucune URL fournie pour la suppression');
      return;
    }
    
    console.log('🗑️ Suppression du fichier');
    
    // Extraire le chemin de l'URL
    // Format URL: https://storage.googleapis.com/.../users%2F{userId}%2Ffiles%2F...
    const decodedUrl = decodeURIComponent(fileUrl);
    
    // Chercher le chemin après le dernier '/'
    const pathMatch = decodedUrl.match(/\/files\/.+/);
    if (!pathMatch) {
      throw new Error('Impossible d\'extraire le chemin du fichier');
    }
    
    // Reconstruire le chemin complet
    const fullPath = decodedUrl
      .split('/o/')[1]
      .split('?')[0];
    
    const fileRef = ref(storage, fullPath);
    await deleteObject(fileRef);
    
    console.log('✅ Fichier supprimé');
    
  } catch (error) {
    // Certaines erreurs ne sont pas bloquantes (fichier déjà supprimé, etc.)
    console.warn('⚠️ Avertissement lors de la suppression:', error.message);
  }
};

/**
 * ============================
 * GET DOWNLOAD URL
 * ============================
 * Obtenir l'URL de téléchargement d'un fichier
 * 
 * @param {string} storagePath - Le chemin du fichier dans Storage
 * @returns {Promise<string>} - L'URL de téléchargement
 */
export const getFileDownloadUrl = async (storagePath) => {
  try {
    const fileRef = ref(storage, storagePath);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'URL:', error);
    throw error;
  }
};
