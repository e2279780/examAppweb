# 🔧 FIRESTORE MODES : Sécurité vs Démo

## 📋 Problème résolu

Les tâches ne s'affichaient QUE pour le propriétaire, ce qui est **correct pour la sécurité** MAIS pas pratique pour une **démonstration vidéo**.

Solution : Deux modes configurables !

---

## 🎯 Mode 1 : SÉCURISÉ (Production)

**Utilisé en production** pour protéger la confidentialité.

```jsx
<TaskManager showAllTasks={false} />
// ou simplement
<TaskManager />
```

**Comportement :**
- ✅ Chaque utilisateur voit UNIQUEMENT ses tâches
- ✅ Filtre appliqué : `where('userId', '==', currentUser.uid)`
- ✅ Sécurisé : Jean ne voit pas les tâches de Marie
- ✅ Respecte les règles Firestore

**Exemple :**
```
Jean se connecte
→ Voit ses 3 tâches
→ Ne voit pas les 5 tâches de Marie

Marie se connecte
→ Voit ses 5 tâches  
→ Ne voit pas les 3 tâches de Jean
```

---

## 🎬 Mode 2 : DÉMO (Vidéo YouTube)

**Utilisé pour la démonstration vidéo** afin de montrer clairement le temps réel.

```jsx
<TaskManager showAllTasks={true} />
```

**Comportement :**
- 👥 TOUS les utilisateurs voient TOUTES les tâches
- 📡 Pas de filtre userId
- 🎥 Parfait pour montrer plusieurs onglets/utilisateurs
- 🚀 Démontre le temps réel

**Exemple vidéo :**
```
[Onglet 1 - Jean]
Crée "Tâche A"
→ S'affiche immédiatement

[Onglet 2 - Marie]
Voit "Tâche A" apparaître en temps réel ✨
Crée "Tâche B"
→ S'affiche dans les 2 onglets

[Console du navigateur]
🔄 Mise à jour temps réel: 2 tâches
```

---

## 🔧 Implémentation technique

### Service (firestoreService.js)

```javascript
export const onTasksChange = (userId, callback, showAllTasks = false) => {
  const tasksRef = collection(db, 'tasks');
  
  // Si mode démo : PAS de filtre
  // Sinon : filtre par userId
  const q = showAllTasks 
    ? query(tasksRef)
    : query(tasksRef, where('userId', '==', userId));
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const tasks = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(tasks);
  });
  
  return unsubscribe;
};
```

### Composant (TaskManager.jsx)

```javascript
const TaskManager = ({ showAllTasks = false }) => {
  const { currentUser } = useAuth();
  
  useEffect(() => {
    // Passer le flag showAllTasks au service
    const unsubscribe = onTasksChange(
      currentUser.uid, 
      (updatedTasks) => {
        setTasks(updatedTasks);
      },
      showAllTasks  // ← Flag mode démo
    );
    
    return () => unsubscribe();
  }, [currentUser?.uid, showAllTasks]);
  
  // ...
};
```

### Dashboard (production)

```jsx
// Mode SÉCURISÉ (par défaut)
<TaskManager />
// ou
<TaskManager showAllTasks={false} />
```

### Dashboard (démonstration vidéo)

```jsx
// Mode DÉMO
<TaskManager showAllTasks={true} />
```

---

## ⚠️ Règles de sécurité Firestore

**Important:** Les règles de sécurité s'appliquent TOUJOURS, même en mode démo !

```firestore
match /tasks/{taskId} {
  // Seul le propriétaire peut lire/modifier/supprimer
  allow read: if request.auth.uid == resource.data.userId;
  allow update: if request.auth.uid == resource.data.userId;
  allow delete: if request.auth.uid == resource.data.userId;
}
```

**Résultat :**
- ✅ En mode démo : l'UI affiche toutes les tâches
- ✅ Mais Firestore contrôle : seul le propriétaire peut les modifier
- ✅ Si Jean essaie de modifier une tâche de Marie → ERREUR Firestore

---

## 🎥 Démonstration vidéo optimale

### Setup
```
Ouvrir 2 onglets du navigateur
Navigateur 1 : localhost:5174 (Jean connecté)
Navigateur 2 : localhost:5174 (Marie connectée)
```

### Script live coding
```
1. Jean crée "Faire les courses"
   → Apparaît dans les 2 onglets (temps réel) ✨
   
2. Marie crée "Appeler maman"
   → Apparaît dans les 2 onglets ✨
   
3. Jean toggle sa tâche : "Faire les courses" ✓
   → Se marque complétée dans les 2 onglets ✨
   
4. Marie supprime sa tâche
   → Disparaît dans les 2 onglets ✨
   
5. Marie essaie de modifier une tâche de Jean
   → ❌ ERREUR (Firestore bloque) - montre la sécurité
   
6. Rafraîchir la page
   → Toutes les tâches restent (persistance) ✅
```

---

## 📊 Résumé des modes

| Aspect | Mode Sécurisé | Mode Démo |
|--------|---|---|
| `showAllTasks` | `false` (défaut) | `true` |
| Filtre userId | ✅ Oui | ❌ Non |
| Utilisateurs voient | Leurs tâches | TOUTES tâches |
| Cas d'usage | Production | Vidéo YouTube |
| Sécurité Firestore | ✅ S'applique | ✅ S'applique |
| Modification/Delete | Propriétaire seulement | Propriétaire seulement |

---

## 💡 Conseil pour la vidéo

**Pendant la démo :**
1. Mettre `showAllTasks={true}` dans Dashboard
2. Ouvrir 2 onglets
3. Se connecter avec 2 comptes différents
4. Montrer le temps réel en direct
5. À la fin de la vidéo, expliquer le mode sécurisé

**Pour la production finale :**
```jsx
// Retirer le mode démo
<TaskManager showAllTasks={false} />
// ou simplement
<TaskManager />
```

