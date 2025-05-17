# TheEnd.page

Une plateforme pour créer des pages d'adieu personnalisées, marquant la fin d'un job, d'un projet, d'une relation, d'un serveur Discord, etc.

## Fonctionnalités

- **Personnalisation avec différents tons** : dramatique, ironique, classe, cringe, touchant, etc.
- **Support multi-médias** : ajoutez des images, GIFs, vidéos YouTube, musiques
- **Prévisualisation en temps réel** : voyez votre création avant de la publier
- **Partage facile** : génération d'un lien unique pour chaque page
- **Contrôle de la visibilité** : choisissez entre public ou privé
- **Gestion de vos pages** : tableau de bord pour gérer toutes vos créations

## Captures d'écran

- Page d'accueil : présentation du concept
- Éditeur : création de pages personnalisées
- Exemple de page d'adieu : différents styles
- Dashboard : gestion des pages créées

## Installation et configuration

### Prérequis

- Node.js 18.0.0 ou supérieur
- npm ou yarn
- Un projet Firebase (pour l'authentification et la base de données)

### Installation

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/votre-pseudo/theend-page.git
   cd theend-page
   ```

2. Installez les dépendances :
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Configurez Firebase :
   - Créez un projet sur [Firebase Console](https://console.firebase.google.com/)
   - Activez l'authentification par email/mot de passe
   - Créez une base de données Firestore
   - Activez Firebase Storage
   - Copiez votre configuration Firebase et créez un fichier `.env.local` basé sur `.env.example`

4. Lancez l'application en mode développement :
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur

## Structure du projet

```
theend-page/
├── src/
│   ├── app/                  # Pages de l'application (routing Next.js)
│   ├── components/           # Composants réutilisables
│   │   ├── display/          # Composants d'affichage
│   │   ├── editor/           # Composants d'édition
│   │   ├── layout/           # Composants de mise en page
│   │   └── ui/               # Composants UI réutilisables
│   ├── constants/            # Constantes de l'application
│   ├── context/              # Contextes React
│   ├── lib/                  # Bibliothèques et configurations
│   ├── services/             # Services d'accès aux données
│   └── types/                # Définitions des types TypeScript
├── public/                   # Ressources statiques
└── ...
```

## Déploiement

L'application est configurée pour être déployée sur Vercel ou Netlify.

### Déploiement sur Vercel

1. Créez un compte sur [Vercel](https://vercel.com) si vous n'en avez pas déjà un
2. Connectez votre dépôt GitHub à Vercel
3. Importez le projet
4. Définissez les variables d'environnement (identiques à celles de votre fichier `.env.local`)
5. Déployez

### Déploiement sur Netlify

1. Créez un compte sur [Netlify](https://netlify.com) si vous n'en avez pas déjà un
2. Connectez votre dépôt GitHub à Netlify
3. Importez le projet
4. Définissez les variables d'environnement
5. Déployez

## Technologie utilisée

- **Frontend** : React, Next.js, Tailwind CSS
- **Backend** : Firebase (Authentification, Firestore, Storage)
- **Hébergement** : Vercel/Netlify

## Contribuer

Les contributions sont les bienvenues! N'hésitez pas à ouvrir une issue ou une pull request.

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
