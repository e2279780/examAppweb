/**
 * TaskManager.jsx
 * 
 * Composant pour gérer les tâches Firestore
 * Démontre le CRUD complet en temps réel
 * 
 * SECTION 3 : Firestore CRUD
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  addTask,
  onTasksChange,
  deleteTask,
  toggleComplete,
} from '../services/firestoreService';
import { useAuth } from '../hooks/useAuth';

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
  color: ${props => props.completed ? '#6b7280' : '#d1d5db'};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  font-size: 1rem;
`;

const TaskActions = styled.div`
  display: flex;
  gap: 0.5rem;

  @media (max-width: 768px) {
    width: 100%;
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

const TaskManager = () => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

    // Créer le listener
    const unsubscribe = onTasksChange(currentUser.uid, (updatedTasks) => {
      setTasks(updatedTasks);
      setLoading(false);
    });

    // Cleanup : arrêter le listener quand le composant se démonte
    return () => {
      console.log('🛑 Arrêt du listener Firestore');
      unsubscribe();
    };
  }, [currentUser?.uid]);

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
                <TaskItem key={task.id}>
                  <TaskContent>
                    {/* UPDATE : Toggle completed */}
                    <Checkbox
                      type="checkbox"
                      checked={task.completed}
                      onChange={() =>
                        handleToggleComplete(task.id, task.completed)
                      }
                    />
                    <TaskTitle completed={task.completed}>
                      {task.title}
                    </TaskTitle>
                  </TaskContent>

                  {/* DELETE : Bouton supprimer */}
                  <TaskActions>
                    <DeleteButton onClick={() => handleDeleteTask(task.id)}>
                      🗑️ Supprimer
                    </DeleteButton>
                  </TaskActions>
                </TaskItem>
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
