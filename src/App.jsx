/**
 * Application Principale
 * 
 * Composant racine qui orchestrera tous les services Firebase et l'authentification
 * (Pour la SECTION 1, c'est juste un placeholder que nous remplirons progressivement)
 */

import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 Firebase + React + OpenAI</h1>
        <p>Examen final – Live coding professionnel</p>
      </header>

      <main className="app-main">
        <section className="section-intro">
          <h2>Bienvenue!</h2>
          <p>
            Cette application démontre l'intégration complète de :
          </p>
          <ul>
            <li>✅ Firebase Authentication (Google, GitHub)</li>
            <li>✅ Firestore Database (CRUD dynamique)</li>
            <li>✅ Firebase Storage (Upload de fichiers)</li>
            <li>✅ Cloud Functions (appels sécurisés OpenAI)</li>
            <li>✅ App Check + reCAPTCHA (sécurité)</li>
            <li>✅ Firebase Hosting (production)</li>
          </ul>
          <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
            Les sections se déploieront progressivement pendant cette démonstration.
          </p>
        </section>
      </main>

      <footer className="app-footer">
        <p>© 2025 – Formateur React + Firebase | Live Coding YouTube</p>
      </footer>
    </div>
  )
}

export default App

