# 📤 SECTION 4 – FIREBASE STORAGE : UPLOAD

## 🎯 Objectif
Implémenter l'**upload de fichiers** (images et PDFs) avec **Firebase Storage** et lier les URLs dans Firestore.

---

## 🗂️ Architecture

```
Flux utilisateur → FileUpload.jsx → storageService.js → Firebase Storage
                                                              ↓
                                                          URL du fichier
                                                              ↓
                                                    TaskManager → updateTask()
                                                              ↓
                                                           Firestore
                                                            (sauvegarde URL)
```

---

## 📁 Fichiers créés

### 1. **Service Storage** (`src/services/storageService.js`)

```javascript
// Principales fonctions :

uploadFile(file, userId, onProgress)
  ├─ Vérifie le type (JPG, PNG, WebP, PDF)
  ├─ Vérifie la taille (max 5MB)
  ├─ Upload avec progression
  └─ Retourne l'URL de téléchargement

deleteFile(fileUrl)
  └─ Supprime le fichier de Storage

getFileDownloadUrl(storagePath)
  └─ Récupère l'URL de téléchargement
```

### 2. **Composant FileUpload** (`src/components/FileUpload.jsx`)

Features :
- ✅ Click pour sélectionner un fichier
- ✅ Drag & drop support
- ✅ Preview pour les images
- ✅ Barre de progression
- ✅ Gestion d'erreurs
- ✅ Callback on upload success

### 3. **Intégration TaskManager**

Chaque tâche a maintenant :
- 🖼️ Bouton "Ajouter image"
- 🖼️ Affichage de l'image
- 🖼️ Possibilité de changer l'image

---

## 🔥 Concepts expliqués

### 1. **Structure Firebase Storage**

```
Storage
├── users/
│   ├── uid1/
│   │   └── files/
│   │       ├── 1702900000_photo.jpg
│   │       └── 1702900100_document.pdf
│   │
│   └── uid2/
│       └── files/
│           └── 1702900200_image.png
```

**Format du chemin** :
```
users/{userId}/files/{timestamp}_{filename}
```

**Avantages** :
- ✅ Organisé par utilisateur
- ✅ Noms uniques (timestamp)
- ✅ Sécurisé (séparation par utilisateur)

### 2. **Upload avec progression**

```javascript
uploadBytesResumable(fileRef, file)
  .on('state_changed', 
    (snapshot) => {
      // Progression: 0-100%
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    },
    (error) => {
      // Erreur
    },
    () => {
      // Succès - récupérer l'URL
      const url = getDownloadURL(fileRef);
    }
  )
```

**Résultat** : Barre de progression en temps réel !

### 3. **URL de téléchargement**

Après upload, Firebase retourne une URL :
```
https://storage.googleapis.com/bucket/...
```

Cette URL :
- ✅ Reste valide indéfiniment
- ✅ Peut être publique (pas besoin de token)
- ✅ Est stockée dans Firestore

---

## 🛡️ Sécurité

### Règles Firebase Storage

À ajouter dans **Firebase Console** → **Storage** → **Règles** :

```firestore
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Dossier users
    match /users/{userId}/{allPaths=**} {
      // Seul l'utilisateur peut lire ses fichiers
      allow read: if request.auth.uid == userId;
      
      // Seul l'utilisateur peut uploader ses fichiers
      allow write: if request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*|application/pdf');
      
      // Seul l'utilisateur peut supprimer ses fichiers
      allow delete: if request.auth.uid == userId;
    }
  }
}
```

**Résultat** :
- ✅ Jean ne peut accéder qu'à ses fichiers
- ✅ Max 5MB par fichier
- ✅ Seulement images et PDFs
- ✅ Seul l'authentifié peut uploader

---

## 🎯 Flux complet

### 1. **Utilisateur clique "Ajouter image"**

```jsx
<Button onClick={() => setShowUpload(true)}>
  📷 Ajouter image
</Button>
```

### 2. **FileUpload s'affiche**

```jsx
<FileUpload 
  userId={currentUser.uid}
  onUploadSuccess={handleUploadSuccess}
/>
```

### 3. **Utilisateur sélectionne/drague un fichier**

```javascript
handleFileSelect(file)
  ├─ Vérifie type ✓
  ├─ Vérifie taille ✓
  ├─ Crée preview (images)
  └─ Affiche le fichier
```

### 4. **Clique "Upload" 🚀**

```javascript
uploadFile(file, userId, onProgress)
  ├─ Envoie vers Storage
  ├─ Affiche progression (0-100%)
  └─ Retourne l'URL
```

### 5. **Callback onUploadSuccess**

```javascript
handleUploadSuccess(imageUrl)
  └─ updateTask(taskId, { imageUrl })
      └─ Firestore sauvegarde l'URL
```

### 6. **L'image s'affiche dans la tâche**

```jsx
{task.imageUrl && (
  <TaskImage src={task.imageUrl} alt={task.title} />
)}
```

---

## 📊 Données dans Firestore

Avant :
```json
{
  "userId": "uid1",
  "title": "Faire course",
  "completed": false,
  "createdAt": 2025-12-17
}
```

Après upload :
```json
{
  "userId": "uid1",
  "title": "Faire course",
  "imageUrl": "https://storage.googleapis.com/.../photo.jpg",
  "completed": false,
  "createdAt": 2025-12-17
}
```

---

## 🎨 UI Features

### FileUpload

- ✅ **Click zone** : Cliquer pour sélectionner
- ✅ **Drag & Drop** : Glisser/déposer fichier
- ✅ **Preview** : Voir l'image avant upload
- ✅ **Progress Bar** : Progression 0-100%
- ✅ **Error Handling** : Erreurs claires
- ✅ **Success Message** : Confirmation upload

### TaskManager

- ✅ **Bouton Upload** : Par tâche
- ✅ **Affichage image** : Sous la tâche
- ✅ **Responsive** : Mobile-friendly

---

## 📝 Validation

### Types autorisés
- ✅ `image/jpeg` (JPG)
- ✅ `image/png` (PNG)
- ✅ `image/webp` (WebP)
- ✅ `application/pdf` (PDF)
- ❌ Autres : rejetés

### Taille max
- ✅ 5MB = limite acceptable
- ❌ > 5MB : erreur

---

## 🚀 Performance

### Coûts Firebase Storage

**Tarification** :
- 5GB / mois gratuit
- Upload : $0.023 / GB
- Téléchargement : $0.023 / GB
- Opérations : gratuit

**Exemple** :
- 100 images de 2MB = 200MB
- Coût upload : ~$0.005
- Coût total : gratuit (< 5GB)

---

## ⚠️ À faire manuellement

1. Aller sur https://console.firebase.google.com
2. Sélectionner le projet
3. Aller à **Storage**
4. Créer un bucket (si pas déjà fait)
5. Aller à **Règles**
6. Copier les règles du fichier `FIRESTORE_SECURITY_RULES.txt` (adapté pour Storage)

---

## 🎬 Démonstration vidéo

```
1. Utilisateur créé une tâche
   → "Faire les courses"

2. Clique "📷 Ajouter image"
   → FileUpload apparaît

3. Glisse/dépose une image
   → Preview s'affiche

4. Clique "🚀 Upload"
   → Barre de progression: 0% → 100%

5. Upload réussi ✅
   → URL sauvegardée dans Firestore
   → Image s'affiche sous la tâche

6. Rafraîchit la page
   → L'image reste visible ✅ (persistée)
```

---

## ✅ Résumé Section 4

| Aspect | Détails |
|--------|---------|
| **Upload** | ✅ Progress bar en temps réel |
| **Preview** | ✅ Avant upload (images) |
| **Drag & Drop** | ✅ Glisser/déposer fichier |
| **Storage Path** | ✅ `users/{userId}/files/{...}` |
| **Firestore Link** | ✅ URL stockée dans `imageUrl` |
| **Sécurité** | ✅ Règles de sécurité |
| **Affichage** | ✅ Image sous la tâche |
| **Taille Max** | ✅ 5MB |
| **Types** | ✅ JPG, PNG, WebP, PDF |

