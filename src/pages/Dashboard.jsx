/**
 * Dashboard.jsx – Page principale après authentification
 * SECTION 3 : Intégration de Firestore CRUD
 */

import React from 'react';
import styled from 'styled-components';
import TaskManager from '../components/TaskManager';

const DashboardContainer = styled.div`
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

const Description = styled.p`
  color: #d1d5db;
  line-height: 1.6;
  margin: 0.5rem 0;
`;

const UserInfo = styled.div`
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid #3b82f6;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  color: #93c5fd;

  strong {
    color: #60a5fa;
  }
`;

const Dashboard = ({ currentUser }) => {
  return (
    <DashboardContainer>
      <Section>
        <Title>🎉 Bienvenue dans ton espace!</Title>
        <Description>
          Tu es maintenant connecté et tu as accès à toutes les fonctionnalités Firestore.
        </Description>
        
        <UserInfo>
          <strong>Utilisateur connecté:</strong> {currentUser?.displayName || currentUser?.email}
        </UserInfo>
      </Section>

      {/* SECTION 3 : FIRESTORE CRUD */}
      <TaskManager />

      <Section>
        <Title>📋 Services activés</Title>
        <Description style={{ marginBottom: '1rem' }}>
          ✅ Firebase Authentication (Google, GitHub, Email/Password)
        </Description>
        <Description style={{ marginBottom: '1rem' }}>
          ✅ <strong>Firestore Database (CRUD en temps réel) - SECTION 3</strong>
        </Description>
        <Description style={{ marginBottom: '1rem' }}>
          ⏳ Firebase Storage (Upload de fichiers)
        </Description>
        <Description style={{ marginBottom: '1rem' }}>
          ⏳ Cloud Functions (appels sécurisés OpenAI)
        </Description>
        <Description>
          ⏳ App Check + reCAPTCHA (sécurité avancée)
        </Description>
      </Section>
    </DashboardContainer>
  );
};

export default Dashboard;
