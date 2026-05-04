# ETG — Gestion des Membres

## Setup rapide

### 1. Installer les dépendances
```bash
npm install
```

### 2. Logo
Placer le fichier `logo.png` (logo ETG bleu) dans le dossier `public/`.

### 3. Variables d'environnement
Le fichier `.env.local` est déjà configuré avec les clés Firebase du projet `etgapp`.

### 4. Firebase — Activer Authentication
Dans la console Firebase (etgapp) :
- **Authentication** → Activer la méthode **Email/Password**
- Créer un compte admin : Authentication → Users → Add user

### 5. Firebase — Règles Firestore
Dans Firestore Database → Rules :
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /members/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 6. Lancer en développement
```bash
npm run dev
```
Ouvrir http://localhost:3000 → redirige vers `/login`

### 7. Déployer sur Vercel
```bash
npx vercel
```
Ajouter les variables d'env dans le dashboard Vercel.

## Structure du projet
```
app/
  page.tsx              → redirect /dashboard
  login/page.tsx        → page de connexion
  dashboard/
    layout.tsx          → layout protégé (AuthGuard + Sidebar)
    page.tsx            → liste membres + stats

components/
  members/
    MemberForm.tsx      → formulaire ajout/modification (RHF + Zod)
    MemberDialog.tsx    → modal natif HTML <dialog>
    MembersTable.tsx    → tableau + recherche + pagination
  layout/
    Sidebar.tsx         → navigation latérale
    Header.tsx          → en-tête avec user
    AuthGuard.tsx       → protection de route côté client
  ui/
    Button.tsx
    Input.tsx
    Select.tsx

lib/
  firebase/
    config.ts           → initialisation Firebase
    members.ts          → CRUD Firestore
    firebaseAuth.ts     → signIn / signOut
  validations/member.ts → schéma Zod
  utils.ts              → cn()

hooks/
  useMembers.ts         → state + CRUD membres
  useAuth.ts            → état d'authentification

types/member.ts         → interfaces TypeScript
```

## Modèle de données Firestore (collection `members`)
```json
{
  "nom": "KABILA",
  "postNom": "MULAMBA",
  "prenom": "Joseph",
  "genre": "Homme",
  "situationMatrimoniale": "Marié(e)",
  "telephone": "+243 81 000 0000",
  "avenue": "Avenue de la Paix",
  "quartier": "Quartier Résidentiel",
  "commune": "Gombe",
  "commentaire": "Diacre",
  "createdAt": "<Firestore Timestamp>",
  "updatedAt": "<Firestore Timestamp>"
}
```
