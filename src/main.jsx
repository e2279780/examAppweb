import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import './index.css'
import App from './App.jsx'
import './config/firebase' // Initialiser Firebase au démarrage

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
