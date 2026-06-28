# Gëstoo

Application de gestion de boutique pour les commerçants sénégalais.

## Fonctionnalités

- Tableau de bord avec chiffre d'affaires du jour
- Gestion du stock avec alertes de rupture
- Enregistrement des ventes (payé / crédit)
- Suivi des clients et des dettes
- Historique des remboursements
- Rapports jour / semaine / mois

## Stack technique

- **Frontend** : React + TypeScript + Vite
- **Backend** : FastAPI (Python)
- **Base de données** : SQLite
- **Auth** : JWT

## Lancer le projet

### Backend
cd backend
pip install -r requirements.txt
cd app
uvicorn main:app --reload

### Frontend
cd frontend
npm install
npm run dev