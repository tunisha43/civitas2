# My Engineering App: Platform Architecture & Multi-Role Documentation

Welcome to the comprehensive technical and architectural blueprint of **My Engineering App (Africa's Leading Engineering & Construction Ecosystem)**. This document acts as the definitive record of the entire application architecture, role specifications, key subsystems, state persistence mechanisms, and the milestone unblocking implementations.

---

## 1. Platform Overview
**My Engineering App** is an immersive, multi-role digital ecosystem connecting all major stakeholders in the African construction and engineering sectors. The platform serves as a unified hub bridging professional engineers, prospective property developers, material merchants, academic researchers, students, and regulatory administrators.

The application is structured as a full-featured, highly responsive React + TypeScript Single Page Application (SPA) compiled via Vite, using Tailwind CSS for robust, high-performance, and beautifully scaled modern layouts.

---

## 2. Multi-Role Matrix & Workspace Handlers
The platform supports dynamic, hot-swappable role context rendering. The application detects and switches visual panels, sidebar items, and layout metrics based on the current active role.

### The Dynamic Role Switcher
*   **Location**: Float controller at the bottom-right viewport (`src/components/RoleSwitcher.tsx`).
*   **Behavior**: Overrides the logged-in user profile's default role state. Allows developers, auditors, and clients to cycle through all 11 platform personas.
*   **Path Synchronization Engine**: Integrated via an active React `useEffect` inside `src/App.tsx` to synchronize any role switch seamlessly with the internal pathing router (`ROLE_DASHBOARD_PATHS`), instantly mounting the correct dashboard framework.

| Role Profile | Key Sub-Modules & Workspace Subpages |
| :--- | :--- |
| **Customer** | House Plans, Project Cost Calculator, Dream Home Planner, Quote Requests, Purchased Drawings, Hire Professionals, Settings |
| **Professional** | Quotes & Proposals, Drawing Requests, Client Requests, Portfolio Onboarding, Settings |
| **Student** | My Courses, Mentorship Support, Scholarships Hub, Research & Thesis Hub, Design Competitions, Career Center (Internship Board), Guild Forum |
| **Material Seller** | My Products, Escrow Orders, Stock Levels Inventory, Customer Database, Paystack Settlement Reports, Settings |
| **Super Administrator** | All Users Directory, Escrow Ledger, Platform GMV Analytics, Sandbox Permission Gates, Live Telemetry Audit Logs |

---

## 3. Subsystem Implementation Details

### A. Student Academy Portal (`src/components/StudentDashboardSubpages.tsx`)
A dedicated academic hub tailored for engineering, architecture, and quantity surveying undergraduates:
*   **My Courses**: Interactive curriculum modules. Includes:
    *   *Reinforced Concrete Design (Eurocode 2)*: Accompanied by a live streaming simulator and an interactive lecture quiz validating durable nominal concrete cover calculations. Correct answers unlock an instant `+10%` syllabus completion bonus.
    *   *Structural Steel Detailing (Revit)* and *Quantity Surveying & BEM (CESMM4 Standards)*.
*   **Mentorship Support**: Database of verified senior engineers with active mentorship slots. Includes a formal career proposal modal to solicit mentoring.
*   **Scholarships Hub**: Contains active academic opportunities (e.g., *Julius Berger Excellence Grant 2026*, *Chevron STEM Fund*). Includes an interactive statement-of-purpose application filing form.
*   **Research & Thesis Hub**: Enables undergraduates to upload PDF thesis documents or DWG blueprints under CC-BY license, tracking aggregate download metrics.
*   **Design Competitions**: Displays ecosystem design contests (e.g., *Lagos Smart City Sustainable Housing Challenge*) with live team count increment parameters.
*   **Career Center**: Real-time structural engineering internship board supporting direct-profile profile applications.
*   **Student Guild Forum**: A fully interactive discussion board:
    *   Supports opening new technical thread queries.
    *   Features real-time thread upvotes.
    *   **Interactive Thread Comments**: Clicking a thread expands a nested discussion board displaying historical comment nodes from multiple role actors, with form action handlers to publish instant replies as a student.

---

### B. Supplies Merchant Console (`src/components/SellerDashboardSubpages.tsx`)
A commercial dashboard managing construction material pipelines with secure transaction mechanics:
*   **My Products**: Live inventory of materials (e.g., Dangote Cement, Sharp River Sand, Rebar). Features an interactive modal to *Publish New Listings* or *Configure/Recalibrate Specifications* (price, categories, unit metrics, description notes).
*   **Escrow Orders**: Tracks client aggregate orders. Implements a multi-state order cycle allowing merchants to transition states from *Pending Shipment* to *Shipped* with automatic Paystack Escrow hold alerts.
*   **Inventory Tracker**: Monitors stock units with customizable threshold warnings. Includes quick-restock triggers (e.g., `+50 bags` or `+1 unit`) to synchronize inventory counts instantly.
*   **Customer Directory**: Aggregates client account metrics, tracing gross customer revenue contribution.
*   **Payouts & Reports**: Fully transparent logs showcasing Gross Settlements, Paystack transaction gateway fees, and Net Transferred Balances directly to merchant bank structures.

---

### C. Super Administrator Command Deck (`src/components/AdminDashboardSubpages.tsx`)
The central administrative runtime engine:
*   **All Users Directory**: Interactive user registry featuring live account searching by keyword. Admin-only actions allow real-time inline status toggling (*Suspend* / *Reinstate*) and regulatory credential vetting (*✓ Vetted*).
*   **Escrow Ledger Core**: Fully audited sandbox ledger managing active held payments. Admins can trigger force-release overrides (*Force Release to Vendor*) or reverse funds (*Force Refund to Customer*).
*   **Platform GMV Analytics**: High-fidelity charts displaying platform Gross Merchandise Value (GMV), system commissions (2% rules), and active host ingress container parameters (Port 3000 mapping).
*   **Role Management (Sandbox Gates)**: Active permission toggles allowing administrative auditors to disable/enable core capabilities (e.g., raw DDL overrides, Escrow releases) globally in the sandbox.
*   **Live Audit Logs**: Implements a simulated real-time telemetry scroll. Features terminal styling, pause/resume streaming, and memory clearing, emitting structured audit rows representing system health, DB latencies, and security handshakes.

---

## 4. Key Improvements & Bug Resolutions

### 1. Milestone Block Bypass
*   **Symptom**: Selecting advanced dashboard views for Students, Sellers, or Super Admins rendered an "Upcoming Milestone Blocked" placeholder.
*   **Resolution**: Cleanly integrated the new subpage components in the central router inside `src/pages/Dashboard.tsx`. Unlocked full dynamic routing mapping for all active tabs, allowing absolute interactive operations across all student, seller, and administrator workspace subpages.

### 2. Multi-Role Route Synchronization
*   **Symptom**: Switching roles via the floating controller updated visual parameters but occasionally left the pathing or tab state decoupled from the target role's available navbar navigation.
*   **Resolution**: Implemented a state synchronizer inside `src/App.tsx`. The moment a role switch is requested, the application evaluates the current path, matches it against `ROLE_DASHBOARD_PATHS`, and performs an instant redirection, aligning both UI context and navigational arrays flawlessly.

### 3. Student Forum Interactive Comments
*   **Symptom**: Students were previously limited to viewing pre-populated forum questions with static upvotes.
*   **Resolution**: Engineered a nested thread comment architecture. Clicking any guild thread reveals historical replies, complete with dynamic forms for submitting comments under the Student persona, immediately recalculating reply tallies on the main board.

---

## 5. Directory Layout & Key Modules
The workspace features a clean, highly modular React architecture complying with strict TypeScript type-safety:

*   `/src/App.tsx`: Central framework routing, state synchronization, and auth state integration.
*   `/src/pages/Dashboard.tsx`: Unified dashboard shell, rendering sidebar nav panels depending on `activeRole`, managing dynamic widgets, and displaying subpage panels.
*   `/src/components/StudentDashboardSubpages.tsx`: Academic workflow module, quizzes, mentoring proposals, scholarship petitions, and thread comment forms.
*   `/src/components/SellerDashboardSubpages.tsx`: Material listings, dynamic modal forms, inventory adjusters, order dispatch handlers, and payment settlements.
*   `/src/components/AdminDashboardSubpages.tsx`: Directory controls, user status toggles, escrow overrides, analytics cards, role permission checkboxes, and live telemetry log logs.
*   `/src/components/RoleSwitcher.tsx`: Float overlay component giving developers and testers seamless control to swap operational roles.
*   `/src/config/env.ts`: Centralized environment manager decoupling code from static domain constraints.

---

## 6. Production Custom Domain Setup & Transition Manual

To ensure the platform is robust, production-ready, and fully configured to support a future custom domain (`www.myengineeringapp.com`) without requiring subsequent code rewrites, the application employs a **Dynamic URL Resolution Engine** (`src/config/env.ts`). 

### Dynamic Domain Decoupling Blueprint
Rather than hardcoding domain namespaces, the core subsystems (Authentication, Paystack payment callbacks, and secure transactional redirects) retrieve endpoints dynamically using:
1.  **VITE_APP_URL Environment Option**: Explicitly mapped in `.env`.
2.  **Active Browser Context (`window.location.origin`)**: Automated fallback if the environment variable is blank. This enables instant out-of-the-box support for temporary container URLs, Cloud Run previews, and Vercel staging slots, switching cleanly to the live custom domain once configured.

### Dynamic Verification & Redirect Vectors
*   **Email Activation Redirect**: Uses `AUTH_EMAIL_REDIRECT` (mapped dynamically to `{VITE_APP_URL}/#login`) passed into Supabase authentication payload parameters.
*   **Password Reset Dispatcher**: Uses `AUTH_RESET_REDIRECT` (mapped dynamically to `{VITE_APP_URL}/#reset-password`) which includes simulated link previews on the recovery dashboard.
*   **Paystack Gateway Callback**: Resolves dynamically to `PAYSTACK_CALLBACK_URL` (mapped to `{VITE_APP_URL}/#dashboard/customer/payments`) which is safely transmitted to payment webhooks.

---

## 7. Custom Domain Post-Purchase Deployment Checklist

Follow this checklist once the `www.myengineeringapp.com` domain is purchased to transition from the staging environment cleanly:

### 1. DNS Mapping & Infrastructure Binding
* [ ] **CNAME Configurations**: Map `www.myengineeringapp.com` to your frontend hosting provider (Vercel, Netlify, or Cloud Run ingress mapper).
* [ ] **A Record Mapping**: Map the root domain `myengineeringapp.com` to the static hosting IP and configure a secure HTTPS automatic `301` redirect to the `www` subdomain.
* [ ] **SSL/TLS Certificate Generation**: Enable automatic Let's Encrypt certificates or upload custom certificates to enforce HTTPS-only connections.

### 2. Environment Variable Recalibration
Update the environment variables on your production deployment hosting dashboard (e.g., Cloud Run environment variables or Vercel settings panel):
* [ ] **VITE_APP_URL**: Set to `https://www.myengineeringapp.com`.
* [ ] **VITE_API_URL**: Set to `https://www.myengineeringapp.com/api`.
* [ ] **VITE_PAYSTACK_CALLBACK_URL**: Set to `https://www.myengineeringapp.com/#dashboard/customer/payments`.
* [ ] **VITE_SUPABASE_URL**: Set to your live production Supabase instance endpoint.

### 3. Third-Party Gateway Updates
Log in to your service provider command portals to authorize the new custom domain:
* [ ] **Paystack Settings Panel**:
  * Navigate to *Settings -> API Keys & Webhooks*.
  * Update the Webhook URL to: `https://www.myengineeringapp.com/api/v1/payments/webhook`.
  * Ensure the Live Public and Secret Keys are synchronized with your production container environment.
* [ ] **Supabase Authentication Settings**:
  * Navigate to *Authentication -> URL Configuration*.
  * Update the **Site URL** to: `https://www.myengineeringapp.com`.
  * Update **Redirect URLs** to allow:
    * `https://www.myengineeringapp.com/#login`
    * `https://www.myengineeringapp.com/#reset-password`
* [ ] **OAuth Authentication Providers (Google, etc.)**:
  * Update authorized redirect URIs and authorized origins in the Google Cloud Console or Supabase dashboard to allow traffic from `https://www.myengineeringapp.com`.
