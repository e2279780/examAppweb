/**
 * Application Principale - SECTION 2 : Authentification
 * 
 * Gestion du routage :
 * - Si non authentifié → Affiche Login
 * - Si authentifié → Affiche Dashboard
 */

import './App.css'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import Login from './components/Login'
import Dashboard from './pages/Dashboard'

/**
 * AppContent
 * Composant principal qui utilise useAuth pour le routage
 */
function AppContent() {
  const { currentUser, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>🔄 Chargement...</p>
      </div>
    );
  }

  // Non authentifié → Affiche Login
  if (!currentUser) {
    return <Login />;
  }

  // Authentifié → Affiche Dashboard
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🚀 Firebase + React + OpenAI</h1>
          <p>Examen final – Live coding professionnel</p>
        </div>
        <div className="header-user">
          <span>👤 {currentUser.displayName || currentUser.email}</span>
          <button className="logout-btn" onClick={logout}>
            Déconnexion
          </button>
        </div>
      </header>

      <main className="app-main">
        <Dashboard currentUser={currentUser} />
      </main>

      <footer className="app-footer">
        <p>© 2025 – Formateur React + Firebase | Live Coding YouTube</p>
      </footer>
    </div>
  );
}

/**
 * App Component
 * Enveloppe AppContent avec AuthProvider
 */
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

