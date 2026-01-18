# Arnaka 🛍️

![Arnaka Banner](https://img.shields.io/badge/Status-In%20Development-blue?style=for-the-badge)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Arnaka** est une plateforme e-commerce moderne et performante, conçue pour évoluer vers une marketplace B2B/B2C complète. Construite avec les dernières technologies du web, elle offre une expérience utilisateur fluide et une interface d'administration puissante.

## ✨ Fonctionnalités Principales

### 🛒 Expérience d'Achat (B2C)
- **Catalogue Avancé** : Recherche, filtres par catégorie, prix, et tri dynamique.
- **Panier Intelligent** : Persistance du panier (Guest vers User), gestion des quantités en temps réel.
- **Checkout Sécurisé** : Intégration complète de **Stripe** pour les paiements.
- **Design Premium** : Interface responsive et élégante utilisant *Tailwind CSS* et *Shadcn/ui*.

### 📦 Dashboard Vendeur (B2B)
- **Gestion des Produits** : CRUD complet (Création, Modification, Suppression) avec validation des données.
- **Tableau de Bord** : Vue d'ensemble des métriques clés (Ventes, Produits actifs).
- **Contrôle d'Accès** : Sécurisation des routes basée sur les rôles (Admin/Seller/Buyer).

### 🛠️ Architecture Technique
- **Authentification** : NextAuth.js (Google OAuth + Credentials).
- **Base de Données** : Prisma ORM avec SQLite (Développement) / PostgreSQL (Production).
- **Validation** : Zod pour une intégrité des données stricte (API & Formulaires).
- **Performance** : Server Actions et Server Components pour une rapidité optimale.

---

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- NPM ou PNPM

### Installation

1.  **Cloner le dépôt**
    ```bash
    git clone https://github.com/Htlog36/Arnaka.git
    cd Arnaka
    ```

2.  **Installer les dépendances**
    ```bash
    npm install
    ```

3.  **Configurer l'environnement**
    Renommez `.env.example` en `.env` (si disponible) ou créez-le :
    ```env
    DATABASE_URL="file:./dev.db"
    NEXTAUTH_SECRET="votre_secret_super_securise"
    NEXTAUTH_URL="http://localhost:3000"
    
    # Stripe (Optionnel pour le dev local sans paiement)
    STRIPE_SECRET_KEY="sk_test_..."
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
    ```

4.  **Initialiser la Base de Données**
    ```bash
    npx prisma db push
    # (Optionnel) Seeder la DB avec des fausses données
    # npx prisma db seed 
    ```

5.  **Lancer le serveur de développement**
    ```bash
    npm run dev
    ```
    Accédez à [http://localhost:3000](http://localhost:3000).

---

## 📂 Structure du Projet

```
src/
├── app/
│   ├── (auth)/         # Routes d'authentification (login, register)
│   ├── (seller)/       # Dashboard Vendeur (Layout protégé)
│   ├── (shop)/         # Boutique publique (Catalogue, Checkout)
│   └── api/            # Routes API (Webhooks, Cart sync)
├── components/         # Composants UI réutilisables (Design System)
├── lib/
│   ├── actions/        # Server Actions (Mutations DB sécurisées)
│   ├── db/             # Configuration Prisma
│   └── validations/    # Schémas Zod
└── types/              # Définitions TypeScript globales
```

## 🗺️ Roadmap

- [x] **Fondations** (Auth, DB, UI Kit)
- [x] **Catalogue & Panier**
- [x] **Paiement Stripe**
- [x] **Dashboard Vendeur (MVP)**
- [ ] **Gestion Multi-vendeurs avancée** (Commissions)
- [ ] **Système d'avis et notations**
- [ ] **Dashboard Admin global**

---

*Développé avec ❤️ par l'équipe Arnaka.*
