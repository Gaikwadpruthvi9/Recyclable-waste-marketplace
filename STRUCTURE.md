# Scrapify Project Structure

## 📁 Root Directory
```
waste-trading-platform/
│
├── 📂 client/                    # Frontend (Next.js)
│   ├── 📂 src/
│   │   ├── 📂 app/              # Next.js pages
│   │   │   ├── 📂 dashboard/
│   │   │   ├── 📂 listings/
│   │   │   ├── 📂 services/
│   │   │   ├── 📂 login/
│   │   │   ├── 📂 signup/
│   │   │   ├── 📂 profile/
│   │   │   ├── 📂 settings/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── globals.css
│   │   │
│   │   ├── 📂 components/
│   │   │   ├── 📂 auth/
│   │   │   ├── 📂 layout/
│   │   │   ├── 📂 listings/
│   │   │   ├── 📂 map/
│   │   │   ├── 📂 market/
│   │   │   ├── 📂 services/
│   │   │   └── 📂 forms/
│   │   │
│   │   ├── 📂 hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useListings.ts
│   │   │
│   │   └── 📂 lib/
│   │       ├── 📂 i18n/
│   │       ├── 📂 services/
│   │       ├── 📂 types/
│   │       ├── auth.ts
│   │       ├── market-data.ts
│   │       ├── services-data.ts
│   │       ├── services-types.ts
│   │       ├── storage.ts
│   │       └── types.ts
│   │
│   ├── 📂 public/
│   │   └── 📂 images/
│   │       ├── hero-background.png
│   │       ├── scrapify-logo.png
│   │       └── scrapify-icon.png
│   │
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 📄 next.config.js
│   ├── 📄 tailwind.config.js
│   └── 📄 postcss.config.js
│
├── 📂 server/                    # Backend (Express.js)
│   ├── 📂 src/
│   │   ├── 📂 controllers/
│   │   │   └── listingsController.ts
│   │   │
│   │   ├── 📂 routes/
│   │   │   └── listings.routes.ts
│   │   │
│   │   ├── 📂 services/         # Business logic (to be added)
│   │   ├── 📂 models/           # Data models (to be added)
│   │   ├── 📂 middleware/       # Auth, validation, etc.
│   │   ├── 📂 utils/            # Helper functions
│   │   │
│   │   └── 📄 index.ts          # Server entry point
│   │
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   └── 📄 .env.example
│
├── 📂 shared/                    # Shared Code
│   ├── 📂 types/
│   │   ├── index.ts             # Main types
│   │   └── services.ts          # Service types
│   │
│   ├── 📂 constants/            # Shared constants
│   ├── 📄 package.json
│   └── 📄 tsconfig.json
│
├── 📄 package.json              # Root monorepo config
├── 📄 README.md                 # Documentation
├── 📄 .gitignore
└── 📄 QUICKSTART.md

```

## 📊 Statistics

- **Total Workspaces:** 3 (client, server, shared)
- **Frontend Files:** 51 source files
- **Backend Files:** 3 starter files
- **Shared Types:** 2 files
- **Configuration Files:** 8

## 🎯 Key Directories

### Client (Frontend)
- **app/** - Next.js pages and routes
- **components/** - Reusable React components
- **hooks/** - Custom React hooks
- **lib/** - Utilities, types, and helpers

### Server (Backend)
- **controllers/** - Request handlers
- **routes/** - API endpoint definitions
- **services/** - Business logic layer
- **models/** - Data models

### Shared
- **types/** - TypeScript interfaces
- **constants/** - Shared enums and constants

## 🚀 Quick Commands

```bash
# Install all dependencies
npm run install:all

# Run both client and server
npm run dev

# Run individually
npm run dev:client    # http://localhost:3000
npm run dev:server    # http://localhost:5000
```
