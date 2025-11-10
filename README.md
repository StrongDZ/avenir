# Avenir Web MVP

Unified platform for Cocoon, Lá Spa, Phê La, and Snap Food. Users receive rule-based recommendations, add to cart, simulate checkout, and earn/redeem centralized rewards.

## Stack

-   Frontend: React (Vite + TypeScript + TailwindCSS)
-   Backend: Node.js + Express (TypeScript)
-   Database: PostgreSQL (local)

## Structure

```
frontend/           # Vite React app
backend/            # Express API + PostgreSQL
data/               # Product dataset JSON
```

## Setup

1. Prerequisites: Node 18+, PostgreSQL 14+
2. Env:

```bash
cp env.example .env
```

3. Install deps:

```bash
cd backend && npm install
cd ../frontend && npm install
```

4. Seed DB and reset demo:

```bash
cd backend
npm run db:seed
npm run demo:reset
```

5. Run dev:

```bash
# Backend (http://localhost:4000)
PORT=4000 npm run dev
# Frontend (http://localhost:5173)
cd ../frontend && npm run dev
```

## API

-   GET `/products`
-   POST `/recommendations`
-   GET `/cart?userId=...`
-   POST `/cart/add`
-   POST `/cart/remove`
-   POST `/checkout`
-   GET `/rewards?userId=...`

## Recommendation Logic

Rule-based on product `attributes`:

-   Oily skin → Cocoon toner
-   Stress → Lá Spa massage
-   Low energy → Phê La coffee
    Cross-brand bundles suggested for complements.

## Rewards

-   Earn: 1 point per 10,000 VND (configurable via `REDEEM_RATE_VND_PER_POINT`)
-   Redeem: 1 point = 10,000 VND (configurable)
-   Ledger stored in `reward_transactions`

## Demo Mode

```bash
cd backend && npm run demo:reset
```

Resets demo user cart, orders, and rewards.

## Data

`data/products.json` includes 4 brands with sample products.
