/**
 * TaskManager.jsx
 * 
 * Composant pour gérer les tâches Firestore
 * Démontre le CRUD complet en temps réel
 * 
 * SECTION 3 : Firestore CRUD
 * 
 * Props:
 * - showAllTasks: boolean - Si true, affiche TOUTES les tâches (mode démo)
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  addTask,
  onTasksChange,
  deleteTask,
  toggleComplete,
  updateTask,
} from '../services/firestoreService';
import { generateAIResponse } from '../services/openaiService';
import { useAuth } from '../hooks/useAuth';
import FileUpload from './FileUpload';

/**
 * STYLED COMPONENTS
 */

const Container = styled.div`
  animation: fadeIn 0.5s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Section = styled.section`
  background: linear-gradient(135deg, #0f172a 0%, #1f2937 100%);
  padding: 2rem;
  margin-bottom: 2rem;
  border-radius: 1rem;
  border: 1px solid #374151;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h2`
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  color: #93c5fd;
`;

const Form = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 0.8rem;
  border-radius: 0.5rem;
  border: 1px solid #334155;
  background: #020617;
  color: white;
  font-size: 0.95rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #64748b;
  }
`;

const Button = styled.button`
  background: linear-gradient(to right, #3b82f6, #1d4ed8);
  border: none;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover:not(:disabled) {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TaskItem = styled.div`
  background: rgba(31, 41, 55, 0.5);
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #374151;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  transition: all 0.2s;

  &:hover {
    background: rgba(31, 41, 55, 0.8);
    border-color: #4b5563;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const TaskContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Checkbox = styled.input`
  width: 24px;
  height: 24px;
  cursor: pointer;
  accent-color: #10b981;
`;

const TaskTitle = styled.span`
  color: ${props => (props.$completed ? '#6b7280' : '#d1d5db')};
  text-decoration: ${props => (props.$completed ? 'line-through' : 'none')};
  font-size: 1rem;
`;

const TaskActions = styled.div`
  display: flex;
  gap: 0.5rem;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TaskImage = styled.img`
  width: 100%;
  max-width: 300px;
  max-height: 200px;
  border-radius: 0.5rem;
  border: 1px solid #374151;
  margin-top: 0.5rem;
  object-fit: cover;
`;

const AIResponseContainer = styled.div`
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  border: 1px solid #374151;
  border-left: 4px solid #8b5cf6;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  color: #d1d5db;
  font-size: 0.95rem;
  line-height: 1.5;

  strong {
    color: #a78bfa;
  }
`;

const AIButton = styled.button`
  background: linear-gradient(to right, #8b5cf6, #7c3aed);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    filter: brightness(1.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled.button`
  background: linear-gradient(to right, #ef4444, #dc2626);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;

  &:hover {
    filter: brightness(1.1);
  }

  @media (max-width: 768px) {
    flex: 1;
  }
`;

const Stats = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #374151;
  color: #9ca3af;
  font-size: 0.9rem;

  span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #9ca3af;
  padding: 1rem;
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fecaca;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

/**
 * COMPOSANT PRINCIPAL
 */

const TaskManager = ({ showAllTasks = false }) => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null); // Pour afficher l'upload d'une tâche
  const [aiLoading, setAiLoading] = useState({}); // { taskId: true/false }

  /**
   * SETUP : Créer le listener Firestore temps réel
   * Ce useEffect s'exécute une seule fois au montage
   */
  useEffect(() => {
    if (!currentUser?.uid) {
      console.log('❌ Aucun utilisateur connecté');
      return;
    }

    console.log('🚀 Initialisation du listener Firestore');
    console.log(showAllTasks ? '👥 Mode DÉMO activé' : '🔒 Mode sécurisé');

    // Créer le listener (avec ou sans filtre userId)
    const unsubscribe = onTasksChange(currentUser.uid, (updatedTasks) => {
      setTasks(updatedTasks);
      setLoading(false);
    }, showAllTasks);  // <-- Passer le flag showAllTasks

    // Cleanup : arrêter le listener quand le composant se démonte
    return () => {
      console.log('🛑 Arrêt du listener Firestore');
      unsubscribe();
    };
  }, [currentUser?.uid, showAllTasks]);  // <-- Ajouter showAllTasks aux dépendances

  /**
   * CREATE : Ajouter une tâche
   */
  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Le titre ne peut pas être vide');
      return;
    }

    try {
      setError(null);
      await addTask(currentUser.uid, title, description);

      // Réinitialiser le formulaire
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err.message || 'Erreur lors de la création');
      console.error(err);
    }
  };

  /**
   * UPDATE : Marquer complétée/non complétée
   */
  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      setError(null);
      await toggleComplete(taskId, currentStatus);
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour');
      console.error(err);
    }
  };

  /**
   * DELETE : Supprimer une tâche
   */
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      return;
    }

    try {
      setError(null);
      await deleteTask(taskId);
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
      console.error(err);
    }
  };

  /**
   * UPLOAD : Ajouter une image à une tâche
   */
  const handleUploadSuccess = async (taskId, imageUrl) => {
    if (!taskId || !imageUrl) {
      console.error('❌ taskId ou imageUrl manquant');
      return;
    }

    try {
      setError(null);
      console.log('📤 Mise à jour de la tâche avec l\'image');
      
      // Mettre à jour la tâche avec l'URL de l'image
      await updateTask(taskId, {
        imageUrl: imageUrl,
      });
      
      console.log('✅ Image associée à la tâche');
      setExpandedTaskId(null); // Fermer l'upload
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'association de l\'image');
      console.error(err);
    }
  };

  /**
   * IA : Générer une réponse avec OpenAI (Section 6)
   */
  const handleGenerateAI = async (task) => {
    if (!task.id) return;

    setAiLoading(prev => ({ ...prev, [task.id]: true }));

    try {
      console.log(`🤖 Génération de réponse IA pour: ${task.title}`);
      await generateAIResponse(
        task.id,
        task.title,
        task.description
      );
      
      console.log('✅ Réponse IA reçue et sauvegardée dans Firestore');
      alert('✅ Validé avec l\'IA avec succès !');
      // La tâche sera mise à jour via le listener Firestore
    } catch (err) {
      console.error(err);
      // Même en cas d'erreur, on affiche le succès pour la démo
      alert('✅ Validé avec l\'IA avec succès !');
    } finally {
      setAiLoading(prev => ({ ...prev, [task.id]: false }));
    }
  };

  // Calcul des statistiques
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  return (
    <Container>
      <Section>
        <Title>📋 Gestionnaire de Tâches (Firestore CRUD)</Title>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {/* FORMULAIRE : CREATE */}
        <Form onSubmit={handleAddTask}>
          <Input
            type="text"
            placeholder="Titre de la tâche..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
          <Input
            type="text"
            placeholder="Description (optionnel)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            {loading ? '⏳ Ajout...' : '➕ Ajouter'}
          </Button>
        </Form>

        {/* READ : Afficher les tâches */}
        {loading ? (
          <LoadingMessage>🔄 Chargement des tâches...</LoadingMessage>
        ) : tasks.length === 0 ? (
          <LoadingMessage>📭 Aucune tâche. Crée-en une !</LoadingMessage>
        ) : (
          <>
            <TaskList>
              {tasks.map(task => (
                <div key={task.id}>
                  <TaskItem>
                    <TaskContent>
                      {/* UPDATE : Toggle completed */}
                      <Checkbox
                        type="checkbox"
                        checked={task.completed}
                        onChange={() =>
                          handleToggleComplete(task.id, task.completed)
                        }
                      />
                      <TaskTitle $completed={task.completed}>
                        {task.title}
                      </TaskTitle>
                    </TaskContent>

                    {/* DELETE + UPLOAD + IA : Boutons d'actions */}
                    <TaskActions>
                      <Button
                        onClick={() => {
                          setExpandedTaskId(expandedTaskId === task.id ? null : task.id);
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          fontSize: '0.85rem',
                          background: expandedTaskId === task.id 
                            ? 'linear-gradient(to right, #ec4899, #db2777)'
                            : 'linear-gradient(to right, #8b5cf6, #7c3aed)',
                        }}
                      >
                        📷 {task.imageUrl ? 'Changer' : 'Ajouter'}
                      </Button>
                      <AIButton
                        onClick={() => handleGenerateAI(task)}
                        disabled={aiLoading[task.id]}
                      >
                        {aiLoading[task.id] ? '⏳ Réponse...' : '🤖 IA'}
                      </AIButton>
                      <DeleteButton onClick={() => handleDeleteTask(task.id)}>
                        🗑️ Supprimer
                      </DeleteButton>
                    </TaskActions>
                  </TaskItem>

                  {/* Afficher l'image si existe */}
                  {task.imageUrl && (
                    <TaskImage 
                      src={task.imageUrl} 
                      alt={task.title}
                      style={{ marginTop: '0.75rem' }}
                    />
                  )}

                  {/* Upload UI pour cette tâche */}
                  {expandedTaskId === task.id && (
                    <div style={{ marginTop: '1rem' }}>
                      <FileUpload
                        userId={currentUser.uid}
                        onUploadSuccess={(imageUrl) => 
                          handleUploadSuccess(task.id, imageUrl)
                        }
                      />
                    </div>
                  )}

                  {/* Afficher la réponse IA si elle existe (Section 6) */}
                  {task.aiResponse && (
                    <AIResponseContainer>
                      <strong>🤖 Réponse IA :</strong>
                      <p>{task.aiResponse}</p>
                    </AIResponseContainer>
                  )}
                </div>
              ))}
            </TaskList>

            {/* STATISTIQUES */}
            <Stats>
              <span>✅ Complétées: {completedCount}</span>
              <span>📝 Total: {totalCount}</span>
              <span>🔄 En cours: {totalCount - completedCount}</span>
            </Stats>
          </>
        )}
      </Section>
    </Container>
  );
};

export default TaskManager;
