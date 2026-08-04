# My Engineering App

### Africa's Leading Engineering & Construction Ecosystem (Nigeria & Emerging Markets)

My Engineering App is a comprehensive, multi-role digital ecosystem designed to unify stakeholders across the African engineering, architectural, construction, and academic sectors. By combining design tools, material procurement, vetted service hirings, and dynamic educational resources, the platform serves as a modern operating system for the Nigerian built environment.

---

## 🛠️ Table of Contents
1. [Platform Architecture & Tech Stack](#1-platform-architecture--tech-stack)
2. [Multi-Role System Design](#2-multi-role-system-design)
3. [Setup & Local Development](#3-setup--local-development)
4. [Supabase Production Migration Protocol](#4-supabase-production-migration-protocol)
5. [Paystack Payment Gateway & Escrow Live Integration](#5-paystack-payment-gateway--escrow-live-integration)
6. [Production Deployment Blueprint (Vercel/Cloud Run)](#6-production-deployment-blueprint-vercelcloud-run)
7. [Super Admin Account Setup & Operations Guide](#7-super-admin-account-setup--operations-guide)
8. [End-to-End Launch & Release Checklist](#8-end-to-end-launch--release-checklist)
9. [Post-Launch Observability, SLA & Health Checks](#9-post-launch-observability-sla--health-checks)

---

## 1. Platform Architecture & Tech Stack

The application utilizes a modular, high-performance **Vite + React 19 + TypeScript** architecture designed for low-latency client experience on both broadband and mobile cellular networks (optimized for Nigerian network realities).

*   **Frontend Framework**: React 19 (functional components, unified hooks, stateful UI buffers).
*   **Build Tool**: Vite 6 (extremely fast builds, optimized bundle splitting).
*   **Styling Engine**: Tailwind CSS v4 (native compilation, fluid responsiveness, responsive grids).
*   **Data Visualization**: Recharts & D3 (high-fidelity platform analytics, settlement charts, and escrow ledgers).
*   **Interactions & Motion**: Motion (declarative animations, slide transitions, micro-interactions).
*   **Mock/Persistence Layer**: A local-storage synchronization interface (`supabase.ts` and `marketplaceDb.ts`) that implements the client signature of the `@supabase/supabase-js` SDK, permitting a self-contained, offline-compatible demo environment prior to production migration.

---

## 2. Multi-Role System Design

At the core of My Engineering App is a unified role-switching architecture. The system supports 11 distinct stakeholders with fully separate workspace layouts, navbars, and transactional modules:

*   **Customer**: House plan browsing, dynamic cost calculations, quote tracking, and escrow payments.
*   **Professional (Engineers, Architects)**: Inbound quote proposals, design requests, and portfolio management.
*   **Student**: Eurocode 2 (EC2) concrete courses, live stream synchronous lectures, vetted mentorship requests, scholarship filings, research paper repositories, and interactive guild forums.
*   **Material Seller**: Storefront custom inventory, order tracking logs, stock alert limits, and settlement records.
*   **Super Administrator**: All-user audit controls, ledger force overrides (release/refund), global safety sandbox toggles, and real-time live network telemetry scrolling.

### Dynamic Role Switcher
For verification, staging, and audit purposes, a floating console is situated at the bottom-right of the viewport (`src/components/RoleSwitcher.tsx`). It triggers a synchronized redirection through the centralized routing pipeline, ensuring immediate workspace mounting without logging out.

---

## 3. Setup & Local Development

### Prerequisites
*   Node.js v18.0.0 or higher
*   npm v9.0.0 or higher

### Steps
1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/your-org/my-engineering-app.git
    cd my-engineering-app
    ```

2.  **Install Base Dependencies**:
    ```bash
    npm install
    ```

3.  **Prepare the Environment File**:
    Duplicate the template and fill in your sandbox credentials:
    ```bash
    cp .env.example .env
    ```

4.  **Execute the Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

5.  **Compile & Verify Production Bundle**:
    Ensure the build compiles cleanly with zero syntax or TypeScript type errors:
    ```bash
    npm run lint
    npm run build
    ```

---

## 4. Supabase Production Migration Protocol

To transition the local storage simulation layer to a live, persistent Supabase database instance, follow this blueprint.

### Step 1: Create Database Tables (Supabase SQL Editor)
Execute these schema definitions inside your Supabase project's SQL editor to match the structures inside `src/lib/supabase.ts` and `src/lib/marketplaceDb.ts`:

```sql
-- Enable UUID Generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USER PROFILES
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone_number TEXT,
  role TEXT NOT NULL CHECK (role IN ('Customer', 'Professional', 'Student', 'Material Seller', 'Manufacturer', 'Equipment Owner', 'Skilled Labour', 'Company', 'Administrator', 'Super Administrator')),
  is_verified BOOLEAN DEFAULT FALSE,
  onboarded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. MATERIAL PRODUCTS
CREATE TABLE public.material_products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT NOT NULL,
  supplier_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  price NUMERIC NOT NULL CHECK (price >= 0),
  unit TEXT NOT NULL,
  min_order INTEGER DEFAULT 1,
  stock_qty INTEGER DEFAULT 0,
  stock_status TEXT DEFAULT 'In Stock',
  rating NUMERIC DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  description TEXT,
  specs JSONB DEFAULT '{}'::jsonb,
  bulk_pricing JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3. ORDERS & ESCROW TRANSACTION LEDGER
CREATE TABLE public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Disputed')),
  escrow_status TEXT DEFAULT 'Held' CHECK (escrow_status IN ('Held', 'Released', 'Refunded', 'Disputed')),
  paystack_reference TEXT UNIQUE,
  delivery_timeline JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

### Step 2: Row Level Security (RLS) Rules
Enable RLS to secure data under Nigerian Data Protection Regulation (NDPR) guidelines:

```sql
-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Select Profile Rule (Publicly viewable or only own profile depending on needs)
CREATE POLICY "Public Profiles Viewable" 
  ON public.profiles FOR SELECT 
  USING (true);

-- Update Profile Rule (Only owner can edit own profile)
CREATE POLICY "Users Can Edit Own Profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Customer Orders View Rule
CREATE POLICY "Customers Can View Own Orders" 
  ON public.orders FOR SELECT 
  USING (auth.uid() = customer_id);
```

### Step 3: Database Optimization (Recommended Indexes)
Apply index optimization to support rapid querying as the marketplace scales:
```sql
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_products_category ON public.material_products(category);
CREATE INDEX idx_orders_customer ON public.orders(customer_id);
CREATE INDEX idx_orders_status ON public.orders(status, escrow_status);
```

---

## 5. Paystack Payment Gateway & Escrow Live Integration

The application utilizes Paystack as its central gateway for processing credit cards, bank transfers, USSD codes, and mobile money in Nigeria.

### Flow Diagram (Escrow Mechanism)
```
[Customer] --(Pays Order)--> [Paystack API Gateway] --(Webhook)--> [Database: Escrow 'Held']
                                                                          |
                                                                  (Shipment & Vetting)
                                                                          |
[Super Admin] --(Verifies Delivery)--> [Paystack Split API] -------> [Material Seller] (98%)
                                        |
                                        +--------------------------> [Platform Wallet] (2% Commission)
```

### 1. Register Live Account
1.  Complete merchant compliance (RC Business Certificate/CAC registration) on the [Paystack Dashboard](https://dashboard.paystack.com).
2.  Switch toggle from **Test Mode** to **Live Mode**.
3.  Retrieve your Live Public Key (`pk_live_...`) and Live Secret Key (`sk_live_...`).

### 2. Configure Webhooks
Webhooks are essential to update order and escrow states asynchronously even if a customer closes their tab during payment.
1.  Navigate to **Paystack Settings** -> **API Keys & Webhooks**.
2.  Set the webhook URL to: `https://api.myengineeringapp.com/api/v1/payments/webhook`.
3.  Store the webhook signing secret in your environment file (`PAYSTACK_WEBHOOK_SECRET`) to authenticate incoming events.

---

## 6. Production Deployment Blueprint (Vercel/Cloud Run)

### Deployment Option A: Vercel (Recommended SPA Frontend Host)
Vercel offers the simplest deployment pipeline for React/Vite SPAs with global edge distribution.

1.  **Vercel Configuration**: Ensure your project contains an appropriate build output configuration.
2.  **Deployment Steps**:
    *   Sign in to [Vercel](https://vercel.com) and link your GitHub repository.
    *   Set the **Framework Preset** to **Vite**.
    *   Verify the Build & Development Settings:
        *   **Build Command**: `npm run build`
        *   **Output Directory**: `dist`
        *   **Install Command**: `npm install`
    *   Configure all client-side environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_PAYSTACK_PUBLIC_KEY`) in Vercel's Environment Variables panel.
    *   Click **Deploy**.

---

## 7. Super Admin Account Setup & Operations Guide

Super Administrators hold global rights to regulate, audit, and force-override transactions across My Engineering App.

### Bootstrapping the First Super Admin
To establish your first Super Admin account on a live Supabase deployment:
1.  Instruct the administrator to sign up through the application's standard registration portal (e.g., `admin@myengineeringapp.com`).
2.  Open your **Supabase Dashboard** -> **SQL Editor**.
3.  Run the following query to elevate the user's role:
    ```sql
    UPDATE public.profiles 
    SET role = 'Super Administrator', is_verified = TRUE 
    WHERE email = 'admin@myengineeringapp.com';
    ```

### Command Deck Audit Manual
Once elevated, logging in reveals the **Super Administrator Command Deck** with the following active runtime capabilities:
*   **Inline Regulatory Vetting**: Locate professional practitioners or material merchants, click the *Unvetted / Vetted* badge to grant or revoke system verification tags instantly.
*   **Account Suspensions**: Disable compromised user access globally by toggling *Active / Suspended* status bars in the Directory.
*   **Escrow Dispute Resolution**: In the event of split-order disputes (e.g., a seller claims shipment but a customer asserts fraud), the Admin can trigger a `Force Refund to Customer` (returning funds via Paystack refund endpoints) or `Force Release to Vendor` (resolving payouts to seller wallets).

---

## 8. End-to-End Launch & Release Checklist

Ensure all items in this checklist are verified and signed off before publishing the live platform:

### ⚖️ Legal & Regulatory Compliance
* [ ] **NDPA Compliance Audit**: Ensure privacy disclosures explicitly notify users that construction profiles and academic transcripts are protected and processed in line with the Nigeria Data Protection Act.
* [ ] **Merchant Agreements**: Review and publish terms for suppliers regarding escrow holding structures and the 2% system commissions.
* [ ] **User Agreements & Terms of Service**: Put clear liability waivers in place regarding structural drawings bought on the platform—mandating final endorsement by an active, registered COREN engineer.

### 🛡️ Cybersecurity & System Hardening
* [ ] **Supabase RLS Audits**: Verify no table has permissive write access to anonymous actors. All read policies must strictly filter personal or private data.
* [ ] **SSL/TLS Hardening**: Confirm that all endpoints (web client, API webhooks) enforce secure HTTPS/WSS protocols.
* [ ] **Sensitive API Key Obfuscation**: Verify that private keys (e.g., `PAYSTACK_SECRET_KEY`, `ANTHROPIC_API_KEY`) do not contain the `VITE_` prefix and are strictly restricted to secure server-side runtimes.

### 📦 Content & Material Vetting
* [ ] **Supplier Verification Check**: Establish manual review steps to vet merchant RC Numbers and standard certifications prior to allowing them live billing profiles.
* [ ] **Academic Syllabus Audit**: Check Eurocode 2 (EC2) concrete course questions and steel detailing Revit slides for academic accuracy.

### ⚡ Performance & Mobile Optimizations
* [ ] **Asset Minification**: Pre-compress SVG icons, illustrations, and blueprints to ensure lightning-fast loads on 3G and 4G networks.
* [ ] **Bundle Analysis**: Verify bundle size is optimized. Run `npm run build` and ensure core vendor chunks remain below 500kb.
* [ ] **Lighthouse Performance Score**: Maintain a mobile performance rating above 85% with optimized layout shifts and minimal blocking threads.

---

## 9. Post-Launch Observability, SLA & Health Checks

Once live, maintain application stability and high operational SLA through the following telemetry modules:

1.  **Error Tracking & Event Logs (Sentry)**:
    Sentry tracks client-side uncaught exceptions and React component crashes. Errors are grouped automatically with stack traces indicating precisely the user's browser details and step-by-step console history.
2.  **Session Diagnostics (LogRocket)**:
    Replays exactly what users see to catch layout regressions or checkout bugs in real-time. Extremely useful to diagnose user errors on Paystack checkout inputs.
3.  **Synthetics & Health Checks**:
    Integrate an external uptime monitor (e.g., BetterUptime, UptimeRobot) pinging the platform status hourly:
    *   **Public Gateway Ping**: `/` (validates CDN caching & DNS routing)
    *   **Telemetry Handshake**: `/api/health` or database auth connectivity.
