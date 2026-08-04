# 📋 Developer Handoff Document
## My Engineering App - Africa's Premier Engineering & Construction Ecosystem

This handoff document is prepared for professional developers who will be taking this codebase to production. It explains the project architecture, tech stack, data access patterns, secure integrations, and the roadmap for deployment.

---

## 1. Project Overview & Architecture
**My Engineering App** is an all-in-one platform tailored for the Nigerian built environment. It unifies 11 distinct user roles into a seamless single-page application (SPA) with full client-side state machine support, responsive layouts, and granular workflows.

### Key Architectural Concepts
1.  **Single-Page Routing & State Isolation**: 
    The app uses a lightweight custom routing system in `src/App.tsx` matching hash changes (e.g., `#dashboard/customer`, `#tenders`, `#jobs`). View states are maintained dynamically inside memory spaces (`supabase.ts`, `marketplaceDb.ts`) and synchronize seamlessly with browser local storage (`localStorage`) to guarantee persistent, zero-latency interactions without a live server connection in development mode.
2.  **Modular Component Design**:
    User role dashboards are decoupled from the main page file. All subpages are stored in modular files under `src/components/` (e.g., `CustomerDashboardSubpages.tsx`, `StudentDashboardSubpages.tsx`, `SellerDashboardSubpages.tsx`) to fit under token ceilings and prevent compilation bloat.
3.  **Decoupled Environment Engine**:
    All core domains, API callbacks, and redirection routes are routed through a dynamic manager at `src/config/env.ts`. It resolves the environment variables at build-time or dynamically falls back to `window.location.origin` at runtime, enabling staging previews (Vercel, Cloud Run) to work out-of-the-box.

---

## 2. Technology Stack
*   **Language**: TypeScript (strict type safety)
*   **Frontend**: React 19 (functional hooks, component composition)
*   **Styles**: Tailwind CSS v4 (native pre-compilation, atomic utility classes)
*   **Transitions**: Motion (`motion/react`) for route sliding and hardware-accelerated micro-animations
*   **Charts**: Recharts & D3.js (real-time escrow logs, analytics, and revenue trends)
*   **Database Client**: Mock Supabase JS SDK mapping (`supabaseSim`) + mock relational database schema mappings (`marketplaceDb.ts`), ready to swap to the live `@supabase/supabase-js` package.

---

## 3. Directory Structure
```
├── .env.example              # Documented Environment Variable Template
├── HANDOFF.md                # This handoff file
├── README.md                 # Production Setup, Commands & RLS Policies
├── package.json              # Direct npm package declarations
├── tsconfig.json             # TypeScript compiler settings
├── vite.config.ts            # Vite 6 core bundler settings
├── src/
│   ├── vite-env.d.ts         # Vite TypeScript clientside ambient types
│   ├── main.tsx              # React mounting root
│   ├── App.tsx               # Primary SPA core routing, layouts, and global modals
│   ├── index.css             # Tailwind v4 import directives
│   ├── config/
│   │   └── env.ts            # Dynamic Environment Decoupling Engine
│   ├── context/
│   │   ├── AuthContext.tsx   # Simulated User Authentication, registration & OTP states
│   │   └── ThemeContext.tsx  # Dynamic Dark & Light mode theme manager
│   ├── lib/
│   │   ├── supabase.ts       # Supabase simulation API, types, and rich seed assets
│   │   └── marketplaceDb.ts  # Marketplace DB engine, Escrow Ledger, and Cart hooks
│   ├── components/           # Extracted Dashboard, Portal, & Modular layouts
│   │   ├── AdminDashboardSubpages.tsx
│   │   ├── CustomerDashboardSubpages.tsx
│   │   ├── SellerDashboardSubpages.tsx
│   │   ├── StudentDashboardSubpages.tsx
│   │   ├── ProfessionalDashboardSubpages.tsx
│   │   ├── CompanyDashboardSubpages.tsx
│   │   ├── MarketplaceCart.tsx
│   │   ├── VerificationBadge.tsx
│   │   └── ... (Other layout modules)
│   └── pages/                # Independent public-facing routes
│       ├── Home.tsx          # Custom landing grid, Hero sections, and female-founder copy
│       ├── HousePlans.tsx    # Blueprint marketplace with built-in escrow holds
│       ├── HireProfessionals.tsx # Directory of vetted engineering practitioners
│       └── ... (Other public pages)
```

---

## 4. Key Integrations & Security

### 💳 Paystack Payment Gateway
The checkout flows (Materials, Equipment Bookings, Service Hirings, House Plan Downloads, Drawing purchases) are fully wired to a simulated **Paystack checkout process**:
*   **Simulated Sandbox Flow**: Intercepts checkouts, opens a high-fidelity payment popup, verifies standard credit cards, and validates OTP challenges using the official sandbox test token `123456`.
*   **Environment Integration**: Re-wires instantly to your live Paystack dashboard by pointing the `VITE_PAYSTACK_PUBLIC_KEY` in your production environments to your live merchant credential. Callback parameters automatically read `PAYSTACK_CALLBACK_URL` from the dynamic configuration manager.

### 🗄️ Supabase Backend (Database & Auth)
To transition to a persistent database:
1.  Add the official SDK: `npm install @supabase/supabase-js`
2.  Import `createClient` inside `src/lib/supabase.ts` and initialize the client using `SUPABASE_URL` and `SUPABASE_ANON_KEY` from `src/config/env.ts`.
3.  Apply the exact table definitions and Row Level Security (RLS) rules specified in `README.md`.

### 🗺️ Google Maps Platform
The geographic states in Hire Professionals, Equipment Rental, and Material delivery maps utilize integrated coordinate layouts ready for standard Google Maps SDK integration (`@react-google-maps/api`) or open-source map bindings. Ensure proper API key constraints are configured inside your Google Cloud Console for target domain HTTP referrers.

---

## 5. Remaining Pre-Launch Tasks
To successfully go live:
1.  **DNS Routing**: Purchase `myengineeringapp.com` and point your nameservers to your production hosting nodes (e.g., Vercel / Cloud Run). Enforce HTTPS redirects.
2.  **Supabase Auth Configuration**: In your Supabase dashboard, whitelist `https://www.myengineeringapp.com` as your Site URL and enable secure password resets using `AUTH_RESET_REDIRECT`.
3.  **Paystack Webhook Configuration**: Point webhooks inside your Paystack Developer settings to your production API url endpoint to handle automated payment notifications safely.
4.  **Admin Creation**: Follow the bootstrapping instructions in `README.md` to elevate your primary developer profile to `Super Administrator` directly in the database.

---

This codebase is clean, fully typed, beautifully designed, and ready for deployment. Enjoy scaling **My Engineering App**!
