# TechnoEdge CRM — Architecture

## Overview
TechnoEdge CRM is a Vanilla JavaScript Single Page Application (SPA). It runs entirely in the browser and uses `LocalStorage` for all data persistence.

> **Important Limitation:** This is a frontend-only MVP. There is no remote backend database, no real authentication/JWTs, and no live external integrations. If `LocalStorage` is cleared, all CRM data is lost unless explicitly exported.

## Tech Stack
- **HTML5 & CSS3**: Vanilla, leveraging custom CSS variables for tokens (`css/variables.css`). No CSS frameworks (e.g., Tailwind or Bootstrap) are used.
- **JavaScript (ES6 Modules)**: Vanilla JS handles routing, data state, and DOM updates. No JS frameworks (e.g., React or Vue) are used.
- **Data Layer**: Native browser `window.localStorage`.

## Application Layers

### 1. The Store (`js/store.js`)
The central nervous system of the app. It manages synchronous CRUD operations against LocalStorage.
- Reads and writes schema arrays from LocalStorage and returns empty arrays when data is missing.
- Enforces Role-Based Access Control (RBAC) synchronously (e.g., `getDealsForUser(user)` filters the raw deals array based on whether the user is a Manager, Team Lead, or Employee).
- Connects modules via foreign keys (e.g., `dealId`, `assignedTo`, `teamId`).

### 2. Authentication (`js/auth.js`)
A mock authentication layer that controls the current active session.
- Allows demo login by selecting a predefined user profile.
- Restricts unauthenticated users to the `#/login` route.
- Returns the full user object including `role` and `teamId`.

### 3. Routing (`js/router.js` & `js/app.js`)
A lightweight hash-based router (`window.addEventListener('hashchange')`).
- Bootstraps the application shell (Sidebar + Topbar) on first load.
- Injects module-specific HTML into the `<main id="content-area">` container.
- Delegates event binding to specific page modules after DOM injection.

### 4. Components (`js/components/`)
Reusable UI modules that decouple shell behavior from business pages.
- **`sidebar.js`**: Renders dynamic navigation links based on user role.
- **`topbar.js`**: Renders breadcrumbs and the mobile menu toggle.
- **`global-search.js`**: Manages the keyboard-accessible (`/`) cross-module search overlay.
- **`toast.js`**: Non-blocking notification popups for success/error states.

## Data Entities

The local database consists of the following key entities:
- `users`: Core profiles with roles (manager, team_lead, employee).
- `teams`: Logical groupings of users.
- `leads`: Early-stage unqualified opportunities.
- `contacts`: Global stakeholder address book.
- `deals`: Core sales opportunities progressing through pipeline stages.
- `activities`: Timestamped notes, logs, and future-dated follow-ups.
- `requirements`: Technical and business scoping docs attached to deals.
- `proposals`: Financial quotes requiring manager approval.
- `handoffs`: Post-sale delivery instruction sets.
- `billings`: Invoicing, payment collection, and renewal tracking.
- `settings` & `session`: App-wide preferences (like Compact Tables) and active login state.

## Core Workflows & Lifecycles

### The Commercial Lifecycle
Data conceptually flows sequentially, although users can jump between modules:
1. **Lead Generation**: Unqualified prospect (`#/leads`).
2. **Deal Conversion**: Lead is qualified and promoted to a Deal (`#/deals`).
3. **Scoping**: Technical/Business Requirements are attached to the Deal (`#/requirements`).
4. **Quotation**: A Financial Proposal is generated and approved (`#/proposals`).
5. **Closure**: Deal is Won.
6. **Execution**: A Project Handoff is authored for the Delivery team (`#/handoffs`).
7. **Collection**: Invoices are raised and Renewals are tracked (`#/billing`).

### The Activity Timeline
All communication, updates, and future reminders are tracked as Activities (`#/activities`). Follow-ups are tied directly to parent entities (Deals, Leads, etc.) and appear chronologically in their detail views.

### Audit & Export Boundaries
Because data is browser-bound, data backup and portability rely on manual JSON exports.
- **Managers only** can hit the `#/settings` endpoint to dump the entire database to a `.json` file, or generate `.csv` files for legacy systems.
- Complete data imports will immediately overwrite `LocalStorage`.

## Route Map

| Route | Purpose | Access |
|---|---|---|
| `#/login` | Demo role selection | Public |
| `#/dashboard` | KPI overview & Alerts | All Roles |
| `#/pipeline` | Kanban deal progression | All Roles |
| `#/leads` | Lead management | All Roles |
| `#/contacts` | Address book | All Roles |
| `#/deals` | List view of deals | All Roles |
| `#/deals/:id` | Deal detail & Stage execution | All Roles |
| `#/activities` | Action items & Follow-ups | All Roles |
| `#/requirements` | Scoping documents | All Roles |
| `#/proposals` | Financial quotations | All Roles |
| `#/handoffs` | Delivery transitioning | All Roles |
| `#/billing` | Invoices & Renewals | All Roles |
| `#/hygiene` | CRM data quality alerts | All Roles |
| `#/team` | User & reassignment management | Team Lead, Manager |
| `#/reports` | Analytics & forecasting | Manager Only |
| `#/settings` | Preferences & data export | All Roles (Export Manager-only) |
