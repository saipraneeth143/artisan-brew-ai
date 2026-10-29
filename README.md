# Artisan Brew AI — Production-Grade AI-Powered Cafe & Roastery Platform

**Artisan Brew AI** is a full-stack, AI-integrated artisanal coffee roastery and French bakery platform. It combines specialty beverage & pastry curation with real-time **Groq AI (`groq-sdk`)** flavor pairing, smart dietary/allergen auditing, live order fulfillment tracking, and a role-protected staff administration portal backed by **Supabase PostgreSQL** with Row Level Security (RLS).

---

## Architecture & Tech Stack

- **Frontend (`/frontend`)**: React 18, Vite, Tailwind CSS, Lucide React Icons, React Router v6, Zustand + Context State Management, Axios.
- **Backend (`/backend`)**: Node.js (v20+ ES Modules), Express.js, Helmet, CORS, `express-rate-limit`, Zod Schema Validation.
- **AI Engine**: Official **Groq SDK (`groq-sdk`)** running `llama-3.3-70b-versatile` with strict JSON-mode (`response_format: { type: 'json_object' }`) and deterministic barista fallback.
- **Database & Auth (`/database`)**: Supabase PostgreSQL, Supabase Auth (`@supabase/supabase-js`), strict Row Level Security (RLS), plus an automatic seeded local fallback store so the application runs immediately even before SQL migrations are executed.

---

## Directory Structure

```text
cafe/
├── database/
│   ├── schema.sql                # Production PostgreSQL tables, enums, indexes & triggers
│   ├── rls.sql                   # Row Level Security (RLS) policies & is_admin() helper
│   └── seed.sql                  # 17 Artisanal Menu Items across all 5 categories
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── supabase.js       # Supabase client + seeded fallback datastore
│   │   ├── controllers/
│   │   │   ├── aiController.js   # /api/ai/recommend & /api/ai/analyze-cart
│   │   │   ├── menuController.js # /api/menu CRUD & filtering
│   │   │   └── orderController.js# /api/orders creation, history & admin status pipeline
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js # JWT verification & ADMIN role guard
│   │   │   └── rateLimiter.js    # 100 req/15m general & 10 req/1m AI rate limiters
│   │   ├── routes/
│   │   │   ├── aiRoutes.js
│   │   │   ├── menuRoutes.js
│   │   │   └── orderRoutes.js
│   │   ├── services/
│   │   │   ├── groqService.js    # Groq SDK integration (Master Barista Antoine)
│   │   │   └── geminiService.js  # Re-exports groqService for compatibility
│   │   ├── validators/
│   │   │   └── schemas.js        # Zod validation schemas
│   │   └── index.js              # Express entrypoint
│   ├── .env
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, HeroSection, MenuCategoryFilter, DietaryFilterBar,
│   │   │                         # MenuItemCard, AIBaristaModal, CartDrawer, AIDietaryAudit,
│   │   │                         # OrderTrackerCard, AdminOrderQueue, AdminMenuManager
│   │   ├── context/              # AuthContext.jsx & CartContext.jsx (Zustand)
│   │   ├── pages/                # HomePage, MenuPage, AIBaristaPage, CartPage,
│   │   │                         # OrdersPage, LoginPage, AdminPage
│   │   ├── services/             # api.js & supabaseClient.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── .env.example
│   ├── index.html
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## Quick Start Guide

### 1. Database Setup (Supabase SQL Editor)
Open your Supabase project SQL Editor and execute the scripts in `/database` in order:
1. `database/schema.sql`
2. `database/rls.sql`
3. `database/seed.sql`

*(Note: The backend also includes a pre-seeded fallback store in `backend/src/config/supabase.js` so the app works out-of-the-box before or during Supabase setup.)*

### 2. Configure Backend Environment (`backend/.env`)
Add your Groq API key to `backend/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

SUPABASE_URL=https://afnwqusrkmyfvxmmykbm.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-key

GROQ_API_KEY=gsk_your_actual_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

### 3. Install & Start Backend
```bash
cd backend
npm install
npm run dev
```

### 4. Install & Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

