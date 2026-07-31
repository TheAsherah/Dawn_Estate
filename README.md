# 🏛️ DAWN ESTATE - Luxury Real Estate Platform

Une plateforme immobilière haut de gamme, multilingue (EN/FR/AR) avec backend complet.

## ✨ Fonctionnalités

### Frontend
- 🌍 **Multilingue** : Anglais, Français, Arabe (avec support RTL)
- 🎨 **Design Premium** : Interface luxueuse inspirée de sites haut de gamme
- 📱 **Responsive** : Optimisé pour tous les appareils
- ⚡ **Animations fluides** : Motion/Framer Motion pour des transitions élégantes

### Pages
- 🏠 **Accueil** : Hero section, biens récents, avantages
- 🏘️ **Biens** : Liste avec filtres avancés (catégorie, prix, ville, piscine, etc.)
- 📄 **Détail bien** : Galerie photos, vidéos, caractéristiques, contact WhatsApp
- ➕ **Déposer annonce** : Formulaire avec upload images/vidéos
- 🆘 **Aide/Estimation** : Demande d'estimation de bien
- 📞 **Contact** : Informations de contact
- 🔐 **Authentification** : Login/Register avec JWT
- 👨‍💼 **Dashboard Admin** : Gestion complète

### Authentification & Rôles
- **Utilisateur** : Peut déposer des annonces (en attente de validation)
- **Admin** : Accès total
  - Gestion des utilisateurs
  - Validation/rejet des annonces
  - Gestion des demandes d'estimation
  - Statistiques du site

### Backend (Express + Prisma + MySQL)
- 🔒 **Authentification JWT** sécurisée
- 💾 **Base de données MySQL**
- 📁 **Stockage local** pour images et vidéos
- 🔄 **API REST complète**

## 🚀 Démarrage Rapide

### Compte Admin par Défaut

Un compte administrateur est créé automatiquement au premier lancement :

```
Email: admin@dawnestate.com
Password: Admin@2024!
```

**⚠️ Important** : Changez ce mot de passe après la première connexion !

### Utilisation

1. **Créer un compte utilisateur** ou connectez-vous avec le compte admin
2. **Parcourir les biens** sur la page Propriétés
3. **Déposer une annonce** (utilisateur connecté)
4. **Validation admin** : Les annonces doivent être approuvées par un admin
5. **Demande d'estimation** : Accessible sans connexion

## 📋 Workflow des Annonces

1. **Utilisateur** dépose une annonce → Statut : "En attente"
2. **Admin** examine l'annonce dans le dashboard
3. **Admin** approuve ou rejette
4. **Annonce approuvée** → Visible publiquement
5. **Annonce rejetée** → Non visible

## 🌐 Support Multilingue

### Changer de langue
- Cliquez sur le sélecteur de langue dans la navbar
- Choisissez : EN | FR | AR
- La langue est sauvegardée localement

### Support RTL (Arabe)
- Direction automatique droite-à-gauche
- Interface adaptée pour l'arabe

## 🎨 Design

- **Couleurs** : Blanc, beige, noir, doré (amber)
- **Police titres** : Playfair Display (serif élégant)
- **Police texte** : Inter (sans-serif moderne)
- **Style** : Minimal, luxueux, professionnel

## 🔧 Catégories de Biens

- 🏰 **Villa**
- 🏡 **Maison**
- 🏢 **Appartement**
- 🏠 **Studio**
- 🌳 **Terrain**

## 📱 Contact WhatsApp

Chaque bien dispose d'un bouton WhatsApp avec message pré-rempli dans la langue sélectionnée.

## 🛡️ Sécurité

- Authentification JWT
- Validation côté serveur
- Upload sécurisé de fichiers
- Protection des routes admin

## 🔐 Google OAuth

### Google Cloud
1. Créer un projet Google Cloud.
2. Activer Google Identity Services et Google Calendar API.
3. Configurer l’écran de consentement OAuth:
   - Authorized JavaScript origins: `http://localhost:3000`, `https://yourdomain.com`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`, `https://yourdomain.com/api/auth/callback/google`

### Variables d’environnement
```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

### Notes de sécurité
- Forcer HTTPS en production.
- Conserver NEXTAUTH_SECRET dans un gestionnaire de secrets et le faire tourner régulièrement.

## 📊 Dashboard Admin

### Statistiques
- Total utilisateurs
- Total biens
- Biens en attente
- Biens approuvés
- Demandes d'estimation

### Actions Admin
- Approuver/Rejeter les annonces
- Supprimer des biens
- Gérer les rôles utilisateurs
- Consulter les demandes d'estimation

## 🎯 Technologies Utilisées

- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Motion (Framer Motion)
- **UI Components**: Radix UI
- **Backend**: Express + Prisma + MySQL
- **Auth**: JWT
- **Icons**: Lucide React + React Icons

## 📝 Notes Importantes

- Les emails ne sont pas envoyés (serveur email non configuré)
- Les comptes sont automatiquement confirmés
- Ceci est une application de démonstration
- Pour la production, ajoutez un serveur email et sécurisez davantage

## 🧬 Prisma & Migration

1. Définir DATABASE_URL dans .env
2. Générer le client Prisma: npm run prisma:generate
3. Appliquer le schéma MySQL existant via vos scripts SQL

## 🎭 Crédits

Plateforme créée pour DAWN ESTATE - L'immobilier de luxe à son meilleur.

---

© 2024 Dawn Estate. Tous droits réservés.
