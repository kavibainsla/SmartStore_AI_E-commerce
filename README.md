# SmartStore AI

A production-style, full-stack AI-powered e-commerce admin dashboard. Manage products, view analytics, generate AI marketing content, and get business insights — all in a modern SaaS-style interface.

![SmartStore AI](https://img.shields.io/badge/React-Vite-61DAFB?style=flat&logo=react)
![Node.js](https://img.shields.io/badge/Node-Express-339933?style=flat&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat&logo=mongodb)
![OpenAI](https://img.shields.io/badge/OpenAI-Integrated-412991?style=flat)

## Features

- **Authentication** — JWT signup/login, protected routes, bcrypt password hashing
- **Product Management** — Full CRUD, search, filter, pagination, sorting
- **AI Content Generation** — Descriptions, SEO tags, captions, ad copy, social promos
- **Analytics Dashboard** — Revenue, sales charts (Line, Bar, Doughnut), top products
- **AI Sales Insights** — Business recommendations powered by OpenAI
- **Inventory Alerts** — Low stock detection and dashboard warnings
- **Modern UI** — Dark/light mode, responsive sidebar, glassmorphism cards, toasts

## Tech Stack

| Layer    | Technologies |
|----------|-------------|
| Frontend | React (Vite), Tailwind CSS, React Router, Axios, Chart.js, React Icons |
| Backend  | Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, OpenAI API |
| Security | Helmet, CORS, Rate limiting, Input validation |

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for the complete file listing.

## Quick Start (Root)

```bash
npm run install:all
cd backend && cp .env.example .env && npm run seed
# Terminal 1
npm run dev:backend
# Terminal 2
npm run dev:frontend
```

## Project Structure

```
smartstore-ai/
├── backend/
│   └── src/
│       ├── config/       # DB & env config
│       ├── controllers/  # Route handlers
│       ├── middleware/   # Auth, errors, validation
│       ├── models/       # User, Product, Analytics
│       ├── routes/       # API routes
│       ├── services/     # OpenAI & analytics services
│       ├── utils/        # Helpers
│       └── scripts/      # Seed data
├── frontend/
│   └── src/
│       ├── components/   # Reusable UI
│       ├── pages/        # Route pages
│       ├── layouts/      # Auth & dashboard layouts
│       ├── routes/       # Router config
│       ├── services/     # API clients
│       ├── context/      # Auth, theme, toast
│       ├── charts/       # Chart.js components
│       └── hooks/        # Custom hooks
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- OpenAI API key (optional — demo/mock mode works without it)

## Installation

### 1. Clone and install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Environment variables

**Backend** (`backend/.env`):

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/smartstore_ai
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
OPENAI_API_KEY=sk-your-openai-api-key-here
CLIENT_URL=http://localhost:5173
LOW_STOCK_THRESHOLD=10
```

**Frontend** (`frontend/.env`):

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed sample data

```bash
cd backend
npm run seed
```

Creates demo user: **admin@smartstore.ai** / **admin123** with 8 sample products.

### 4. Start the application

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List (search, filter, paginate) |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/dashboard` | Dashboard stats |
| GET | `/api/analytics/top-products` | Top sellers |
| GET | `/api/analytics/export` | Export JSON |
| POST | `/api/analytics/snapshot` | Save analytics snapshot |
| GET | `/api/analytics/history` | Analytics history |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/generate-description` | AI product description |
| POST | `/api/ai/generate-tags` | SEO tags |
| POST | `/api/ai/generate-caption` | Marketing caption |
| POST | `/api/ai/generate-ad-copy` | Short ad copy |
| POST | `/api/ai/generate-social` | Social promo text |
| POST | `/api/ai/sales-insights` | Business insights |

## Pages

| Route | Page |
|-------|------|
| `/login` | Login |
| `/signup` | Signup |
| `/dashboard` | Main dashboard |
| `/products` | Product management |
| `/analytics` | Sales analytics |
| `/ai-insights` | AI business insights |
| `/settings` | User settings |

## AI Integration (Gemini + OpenAI)

**Recommended: Google Gemini** (free tier available)

1. Get API key: https://aistudio.google.com/apikey  
2. Add to `backend/.env`:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.0-flash
```

**Or use OpenAI:**

```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-key
```

**Auto mode** (`AI_PROVIDER=auto`): tries Gemini first, then OpenAI, then demo mock data.

### New: Generate All Product Info

In Products → Add/Edit, click **Generate All Info** to get:
- Description, SEO tags, captions, ad copy, social promo
- SEO title, meta description, key features
- Target audience, pricing strategy, competitor tips, promotion ideas

### API

| Endpoint | Description |
|----------|-------------|
| `GET /api/ai/status` | Which AI provider is active |
| `POST /api/ai/generate-full-info` | Complete product intelligence (JSON) |

Without any API key, the app runs in **demo mode** with sample AI text.

## License

MIT
