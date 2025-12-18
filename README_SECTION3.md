# 📋 SECTION 3 – FIRESTORE CRUD

## 🎯 Objectif
Implémenter une application complète de gestion de tâches avec **Firestore** en temps réel.

## 🗂️ Structure du code

### Services
- **`src/services/firestoreService.js`** – Logique CRUD centralisée
  - `addTask()` – CREATE
  - `getTasks()` – READ (une seule fois)
  - `onTasksChange()` – READ temps réel (listener)
  - `updateTask()` – UPDATE
  - `deleteTask()` – DELETE
  - `toggleComplete()` – Helper pour marquer complétée

### Composants
- **`src/components/TaskManager.jsx`** – UI complète avec formulaire et liste
  - Formulaire pour créer des tâches
  - Liste en temps réel
  - Checkbox pour marquer complétée
  - Bouton supprimer
  - Statistiques (complétées/total)

### Dashboard
- **`src/pages/Dashboard.jsx`** – Page principale intégrant TaskManager

---

## 🔥 Concepts Firestore expliqués

### 1. **Collections et Documents**
```
Firestore
├── tasks (collection)
│   ├── task_id_1 (document)
│   │   ├── userId: "uid123"
│   │   ├── title: "Faire xyz"
│   │   ├── completed: false
│   │   └── createdAt: timestamp
│   └── task_id_2 (document)
│       └── ...
```

### 2. **Types de lectures**

#### a) **Lecture unique (getTasks)**
```javascript
const tasks = await getDocs(q);
// ✅ Récupère les données UNE FOIS
// ✅ Plus léger (une seule requête)
// ❌ Pas de mise à jour auto si quelqu'un change les données
```

#### b) **Listener temps réel (onTasksChange)**
```javascript
const unsubscribe = onSnapshot(q, (snapshot) => {
  // Appelé automatiquement à chaque changement
});
// ✅ Mises à jour en temps réel
// ✅ Collaboratif (plusieurs utilisateurs)
// ❌ Coûte plus cher en requêtes
```

### 3. **Requêtes filtrées**
```javascript
const q = query(tasksRef, where('userId', '==', userId));
// ✅ Récupère UNIQUEMENT les tâches de l'utilisateur
// ✅ Sécurisant (pas d'accès aux données d'autres)
```

### 4. **Timestamp serveur**
```javascript
createdAt: serverTimestamp()
// ✅ Utilise l'horloge serveur (fiable)
// ✅ Évite les décalages horaires clients
// ✅ Plus sûr que new Date()
```

---

## 🔐 Règles de sécurité

**À copier dans Firebase Console** (Firestore → Règles) :

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    match /tasks/{taskId} {
      // Seul le propriétaire peut lire/modifier/supprimer
      allow read, update, delete: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
  }
}
```

**Résultat :**
- ✅ Jean ne voit QUE ses tâches
- ✅ Marie ne voit QUE ses tâches
- ❌ Personne d'autre ne peut accéder
- ❌ Les utilisateurs non authentifiés ne peuvent rien faire

---

## 🚀 Utilisation du composant

### Intégration dans Dashboard
```jsx
import TaskManager from '../components/TaskManager';

function Dashboard({ currentUser }) {
  return (
    <div>
      <TaskManager />
    </div>
  );
}
```

### Flux utilisateur
1. Utilisateur se connecte
2. `useAuth()` retourne `currentUser`
3. `TaskManager` crée un listener Firestore pour ses tâches
4. À chaque changement dans Firestore → la liste se met à jour
5. Utilisateur ajoute/modifie/supprime une tâche
6. Firestore met à jour
7. Le listener est notifié
8. La UI se remet à jour

---

## ⚡ Performance & Coûts

### Lectures Firestore
- Chaque `getDocs()` = 1 lecture
- Chaque `onSnapshot()` = 1 lecture + 1 par changement
- **Tarification** : 50k lectures/jour gratuit, puis 6$ pour 1M lectures

### Optimisations appliquées
- ✅ Filtre par `userId` (indexé)
- ✅ Listener temps réel (pas de polling)
- ✅ Pas de requête sur TOUS les utilisateurs

---

## 🎨 UI Moderne

- ✅ Styled-components (CSS-in-JS)
- ✅ Design sombre (dark mode)
- ✅ Responsive (mobile/desktop)
- ✅ Animations fluides
- ✅ Loading states
- ✅ Error handling

---

## 📝 Résumé CRUD

| Opération | Fonction | Ligne Code |
|-----------|----------|-----------|
| **C**reate | `addTask()` | Formulaire → `addDoc()` |
| **R**ead | `onTasksChange()` | Listener Firestore |
| **U**pdate | `updateTask()` | Checkbox → `updateDoc()` |
| **D**elete | `deleteTask()` | Bouton → `deleteDoc()` |

---

## ✅ À faire manuellement dans Firebase Console

1. Aller sur https://console.firebase.google.com
2. Sélectionner ton projet
3. Aller à "Firestore Database" → "Créer une base"
4. Choisir le mode "Production" (règles de sécurité requises)
5. Copier les règles du fichier `FIRESTORE_SECURITY_RULES.txt`
6. Publier les règles

---

## 🎯 Résultat attendu

Après cette section, tu as :
- ✅ CRUD complet en temps réel
- ✅ Sécurité par utilisateur
- ✅ UI moderne et réactive
- ✅ Scalable (peut gérer des millions de tâches)
- ✅ Prêt pour la Section 4 (Storage)

