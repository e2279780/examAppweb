# 🚀 Firebase + React + OpenAI – Examen Final

Projet pédagogique complet montrant l'intégration de **Firebase**, **React**, et **OpenAI** avec une approche de **live coding professionnel** pour YouTube.

## 📺 À propos

Cette application est construite pour démontrer, étape par étape, comment :

1. **Authentifier** les utilisateurs avec Google et GitHub/GitLab
2. **Gérer des données** en temps réel avec Firestore
3. **Téléverser des fichiers** avec Firebase Storage
4. **Sécuriser les appels API** avec Cloud Functions
5. **Protéger l'application** avec App Check + reCAPTCHA
6. **Utiliser l'IA** via OpenAI (modèles GPT)
7. **Déployer en production** avec Firebase Hosting

## 🛠️ Stack Technique

- **React 19** – UI réactive
- **Vite 7** – Build tool ultra-rapide
- **Firebase** :
  - Auth (Google, GitHub, GitLab)
  - Firestore (NoSQL DB temps réel)
  - Storage (gestion de fichiers)
  - Cloud Functions (backend sécurisé)
  - App Check + reCAPTCHA (sécurité)
  - Hosting (déploiement)
- **OpenAI API** – Modèles GPT
- **CSS Variables** – Design system moderne

## 📁 Structure du Projet

```
src/
├── components/        # Composants React réutilisables
├── config/           # Configuration Firebase
├── context/          # Context API (Auth state)
├── hooks/            # Custom hooks
├── pages/            # Pages principales
├── services/         # Logique métier (Firestore, Storage, etc.)
├── styles/           # CSS global et design system
├── utils/            # Fonctions utilitaires
├── App.jsx          # Composant racine
├── main.jsx         # Point d'entrée React
└── index.css        # Styles locaux
```

## 🚀 Démarrage Rapide

### 1. Installation

```bash
# Cloner le repo
git clone https://github.com/ton-username/examfinale.git
cd examfinale

# Installer les dépendances
npm install
```

### 2. Configuration Firebase

Créer un fichier `.env.local` et ajouter vos identifiants Firebase :

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID

VITE_RECAPTCHA_KEY=YOUR_RECAPTCHA_KEY
VITE_OPENAI_FUNCTION_URL=YOUR_CLOUD_FUNCTION_URL
```

### 3. Lancer le développement

```bash
npm run dev
```

L'application s'ouvre sur `http://localhost:5173`

### 4. Build & Deploy

```bash
# Build optimisé
npm run build

# Tester la production localement
npm run preview

# Déployer sur Firebase Hosting
firebase deploy --only hosting
```

## 📚 Sections du Projet

| # | Section | Durée | Contenu |
|---|---------|-------|---------|
| 1 | Introduction & Init | 1 min | Présentation + structure |
| 2 | Authentification | 3 min | Google + GitHub/GitLab Auth |
| 3 | Firestore CRUD | 4 min | Create, Read, Update, Delete |
| 4 | Storage Upload | 2 min | Téléversement de fichiers |
| 5 | App Check | 2 min | Sécurité avec reCAPTCHA |
| 6 | OpenAI Integration | 3 min | Appels API sécurisés |
| 7 | Hosting Deploy | 1 min | Production Firebase Hosting |
| 8 | Démo Finale | 2 min | Fonctionnalités complètes |
| 9 | Conclusion | 30 sec | Résumé et call-to-action |

**Total : 18–20 minutes**

## 🔐 Sécurité

⚠️ **Important** :

- ❌ Ne jamais commiter `.env.local`
- ❌ Ne jamais partager les clés privées ou reCAPTCHA
- ✅ Les clés Web Firebase sont publiques (ok de les partager)
- ✅ La clé OpenAI doit TOUJOURS rester côté serveur (Cloud Functions)

## 📖 Documentation

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [OpenAI API](https://platform.openai.com/docs)

## 🎯 Objectifs Pédagogiques

Cette série de tutoriels vise à :

✅ Montrer comment structurer un projet React professionnel  
✅ Démontrer l'intégration Firebase complète  
✅ Expliquer les patterns de sécurité modernes  
✅ Montrer le workflow Git avec des commits réguliers  
✅ Créer du contenu YouTube de qualité pédagogique  

## 📝 Notes

- Chaque section a un commit Git dédié
- Le code est commenté et expliqué en détail
- Pas de dépendances externes inutiles (peu de packages)
- CSS custom avec variables modernes (pas de CSS-in-JS)

## 🤝 Contribution

Ce projet est à but pédagogique. Les améliorations sont bienvenues !

## 📄 Licence

MIT – Libre d'utilisation

---

**Créé avec ❤️ pour la communauté React + Firebase**

---

## SECTION 1 – État Initial ✅

Initialisée et prête pour la SECTION 2 (Authentification).
