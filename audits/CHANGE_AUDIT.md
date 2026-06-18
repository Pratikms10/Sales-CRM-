# AI Change Audit Report

## Generated On
2026-06-18_12-58-02

## Branch
main

## Baseline Commit
1c79c7f

## Task Summary
Phase 2H MVP documentation closeout with README, phase plan, architecture, role matrix, module index, and MVP acceptance checklist synced to the completed Phase 2G browser-local CRM

## Git Status
```text
 M README.md
 M docs/CRM_ARCHITECTURE.md
 A docs/MODULE_INDEX.md
 A docs/MVP_ACCEPTANCE_CHECKLIST.md
 M docs/PHASE_PLAN.md
 M docs/ROLE_ACCESS_MATRIX.md
```

## Files Changed
```text
M	README.md
M	docs/CRM_ARCHITECTURE.md
A	docs/MODULE_INDEX.md
A	docs/MVP_ACCEPTANCE_CHECKLIST.md
M	docs/PHASE_PLAN.md
M	docs/ROLE_ACCESS_MATRIX.md
```

## Change Summary
```text
 README.md                        | 193 +++++++------------
 docs/CRM_ARCHITECTURE.md         | 401 +++++++++------------------------------
 docs/MODULE_INDEX.md             |  22 +++
 docs/MVP_ACCEPTANCE_CHECKLIST.md |  34 ++++
 docs/PHASE_PLAN.md               | 243 ++++++------------------
 docs/ROLE_ACCESS_MATRIX.md       | 274 ++++++++------------------
 6 files changed, 346 insertions(+), 821 deletions(-)
```

## Full Diff
```diff
diff --git a/README.md b/README.md
index 6b27c1a..3893bd6 100644
--- a/README.md
+++ b/README.md
@@ -1,137 +1,80 @@
 # TechnoEdge CRM
 
-A modern, SOP-driven Sales CRM built with vanilla HTML, CSS, and JavaScript.  
-Designed with the Airbnb-inspired design system. No frameworks. No dependencies.
-
----
-
-## Project Status
-
-| Phase | Description | Status |
-|-------|-------------|--------|
-| Phase 0 | Project Foundation & Documentation | ≡ƒƒó Current |
-| Phase 1 | Core CRM UI & SOP Pipeline | Γ¼£ Planned |
-| Phase 2 | Advanced Features & Polish | Γ¼£ Planned |
-| Phase 3 | AI, RAG, Integrations | Γ¼£ Future |
-
----
-
-## What Is TechnoEdge CRM?
-
-TechnoEdge CRM is a role-based sales management system that enforces a standard operating procedure (SOP) across every deal's lifecycle:
-
-```
-Sales ΓåÆ Requirement ΓåÆ Sourcing ΓåÆ Delivery ΓåÆ Feedback ΓåÆ Invoice/Payment ΓåÆ Renewal
-```
-
-Every deal must progress through these stages in order. The system enforces who can do what based on three roles.
-
----
-
-## Roles
-
-| Role | Access Level |
-|------|-------------|
-| **Manager** | Full access ΓÇö all data, all teams, approvals, overrides, reports |
-| **Team Lead** | Team-level access ΓÇö own team's data, assignment, review, escalation |
-| **Employee** | Personal access ΓÇö assigned work only, no approvals or global visibility |
-
-See [docs/ROLE_ACCESS_MATRIX.md](docs/ROLE_ACCESS_MATRIX.md) for the full permission breakdown.
-
----
-
-## Tech Stack
-
-- **HTML5** ΓÇö Semantic markup, single-page app shell
-- **Vanilla CSS** ΓÇö Design tokens from DESIGN.md as CSS custom properties
-- **Vanilla JavaScript** ΓÇö ES6 modules, hash-based SPA routing
-- **LocalStorage** ΓÇö Browser-local data persistence (Phase 1)
-- **Inter** ΓÇö Google Font (open-source substitute for Airbnb Cereal VF)
-
-No React. No Vue. No Tailwind. No npm. Just clean, standards-based web code.
-
----
+A robust, role-scoped, browser-local Customer Relationship Management (CRM) SPA designed for comprehensive sales pipeline execution, from initial lead sourcing through quotation, project handoff, and billing.
+
+## Current Status
+
+**Status:** Phase 2H Documentation Closeout in Progress
+*The Phase 2 Basic CRM MVP is complete. The application is a fully functional browser-based SPA utilizing LocalStorage.*
+
+### Modules Implemented
+- **Login & Authentication**: Role-scoped (Manager, Team Lead, Employee) demo login.
+- **Dashboard**: High-level metrics, open tasks, recent hygiene alerts.
+- **Pipeline (Kanban)**: Visual kanban-style deal tracking with guarded stage controls.
+- **Leads**: Qualification and conversion tracking.
+- **Contacts**: Global Rolodex for clients and stakeholders.
+- **Deals**: Core opportunity tracking with detailed stage histories.
+- **Activities & Follow-ups**: Next-action assignments with specific deadlines.
+- **Requirements**: Technical and business requirement gathering attached to deals.
+- **Proposals & Quotations**: Financial modeling with manager approval workflows.
+- **Project Handoff**: Delivery scoping and operational handover tracking.
+- **Billing & Renewals**: Invoice tracking, payment status, and renewal reminders.
+- **CRM Hygiene**: Centralized dashboard to detect unassigned, stale, or incomplete records.
+- **Reports**: Manager-only analytical views and forecasting.
+- **Team Management**: User management and record reassignment tools.
+- **Global Search**: Role-scoped, keyboard-navigable cross-entity search (using `/`).
+- **Settings**: JSON/CSV export, data import, demo reset, and user preferences (e.g., Compact Tables).
+- **Responsive Shell**: Dynamic layout supporting laptop, tablet, and mobile devices natively.
+
+### Future Scope (Not Yet Included)
+- **Phase 3:** AI assistant and smart sales intelligence.
+- **Phase 4:** RAG (Retrieval-Augmented Generation) and knowledge base integrations.
+- **Phase 5:** External Integrations (Outlook, Teams, Slack).
+- **Phase 6:** Call recording, transcription, and conversational analysis.
+- **Backend Infrastructure:** A real backend database/API.
+- **Real Authentication:** Secure password management, JWTs, and SSO.
 
 ## Project Structure
 
 ```
-Sales CRM/
-Γö£ΓöÇΓöÇ index.html              ΓåÆ App shell (Phase 1)
-Γö£ΓöÇΓöÇ DESIGN.md               ΓåÆ Lifetime design system reference
-Γö£ΓöÇΓöÇ README.md               ΓåÆ This file
-Γö£ΓöÇΓöÇ generate-audit.ps1      ΓåÆ Git diff audit script
-Γöé
-Γö£ΓöÇΓöÇ css/                    ΓåÆ Stylesheets (Phase 1)
-Γöé   Γö£ΓöÇΓöÇ variables.css       ΓåÆ Design tokens
-Γöé   Γö£ΓöÇΓöÇ base.css            ΓåÆ Reset, fonts, globals
-Γöé   Γö£ΓöÇΓöÇ layout.css          ΓåÆ Sidebar, topbar, grid
-Γöé   ΓööΓöÇΓöÇ components.css      ΓåÆ Buttons, cards, tables, modals
-Γöé
-Γö£ΓöÇΓöÇ js/                     ΓåÆ Application logic (Phase 1)
-Γöé   Γö£ΓöÇΓöÇ app.js              ΓåÆ Entry point
-Γöé   Γö£ΓöÇΓöÇ router.js           ΓåÆ Hash-based routing
-Γöé   Γö£ΓöÇΓöÇ auth.js             ΓåÆ Login, role checks
-Γöé   Γö£ΓöÇΓöÇ store.js            ΓåÆ LocalStorage data layer
-Γöé   Γö£ΓöÇΓöÇ seed.js             ΓåÆ Demo data
-Γöé   Γö£ΓöÇΓöÇ utils.js            ΓåÆ Helpers
-Γöé   Γö£ΓöÇΓöÇ components/         ΓåÆ Reusable UI components
-Γöé   ΓööΓöÇΓöÇ pages/              ΓåÆ Page modules
-Γöé
-Γö£ΓöÇΓöÇ docs/                   ΓåÆ Project documentation
-Γöé   Γö£ΓöÇΓöÇ CRM_ARCHITECTURE.md ΓåÆ System architecture
-Γöé   Γö£ΓöÇΓöÇ ROLE_ACCESS_MATRIX.md ΓåÆ Permission matrix
-Γöé   ΓööΓöÇΓöÇ PHASE_PLAN.md       ΓåÆ Phased delivery roadmap
-Γöé
-ΓööΓöÇΓöÇ audits/                 ΓåÆ AI change audit reports
-    ΓööΓöÇΓöÇ .gitkeep
+.
+Γö£ΓöÇΓöÇ css/
+Γöé   Γö£ΓöÇΓöÇ base.css           # Resets and typography
+Γöé   Γö£ΓöÇΓöÇ components.css     # Buttons, cards, modals, grids, tables
+Γöé   Γö£ΓöÇΓöÇ layout.css         # Shell, topbar, sidebar, overlay
+Γöé   ΓööΓöÇΓöÇ variables.css      # Design tokens (colors, spacing, fonts)
+Γö£ΓöÇΓöÇ docs/                  # Project documentation (Architecture, Roles, Roadmap)
+Γö£ΓöÇΓöÇ js/
+Γöé   Γö£ΓöÇΓöÇ components/        # Sidebar, topbar, toast, global search
+Γöé   Γö£ΓöÇΓöÇ pages/             # Individual module logic (Leads, Deals, Billing, etc.)
+Γöé   Γö£ΓöÇΓöÇ app.js             # Application bootstrap and routing
+Γöé   Γö£ΓöÇΓöÇ auth.js            # Mock authentication and role management
+Γöé   Γö£ΓöÇΓöÇ router.js          # Hash-based SPA routing
+Γöé   Γö£ΓöÇΓöÇ seed.js            # Initial demo data generation
+Γöé   Γö£ΓöÇΓöÇ store.js           # Central LocalStorage CRUD and permissions wrapper
+Γöé   ΓööΓöÇΓöÇ utils.js           # Formatters, ID generators, helpers
+Γö£ΓöÇΓöÇ index.html             # Single entry point
+ΓööΓöÇΓöÇ README.md              # Project overview
 ```
 
----
-
-## Getting Started
-
-### Prerequisites
-- A modern web browser (Chrome, Firefox, Edge)
-- A local HTTP server (Phase 1 onward)
-- Git for version control
-- PowerShell (for audit script on Windows)
-
-### Development Workflow
-
-**Before making changes:**
-```powershell
-git status
-git add .
-git commit -m "Baseline before changes"
-```
-
-**After making changes:**
-```powershell
-git status
-powershell -ExecutionPolicy Bypass -File .\generate-audit.ps1 -TaskSummary "Description of task" -TestsRun "Tests performed"
-```
-
-**Review, then commit:**
-```powershell
-git diff
-git add .
-git commit -m "Descriptive commit message"
-git push
-```
-
----
-
-## Documentation
+## Architecture
 
-| Document | Purpose |
-|----------|---------|
-| [DESIGN.md](DESIGN.md) | Lifetime design system reference (colors, typography, spacing, components) |
-| [CRM_ARCHITECTURE.md](docs/CRM_ARCHITECTURE.md) | System architecture and data model |
-| [ROLE_ACCESS_MATRIX.md](docs/ROLE_ACCESS_MATRIX.md) | Complete role-based access control matrix |
-| [PHASE_PLAN.md](docs/PHASE_PLAN.md) | Phased delivery roadmap |
+This is a **Vanilla JavaScript Single Page Application (SPA)**.
+- **No external frameworks** (No React, Vue, or Tailwind).
+- **No backend dependencies**; all data persists locally in the user's browser via `LocalStorage`.
+- **Hash-based routing** dynamically maps `#/paths` to JavaScript page renderers.
 
----
+For detailed documentation, review:
+- [CRM Architecture](docs/CRM_ARCHITECTURE.md)
+- [Role Access Matrix](docs/ROLE_ACCESS_MATRIX.md)
+- [Phase Plan](docs/PHASE_PLAN.md)
 
-## License
+## Development Workflow
 
-Internal project. Not for public distribution.
+This project was built iteratively using an AI-agent-driven pair programming approach.
+1. **Baseline Commit**: Record the starting state.
+2. **Antigravity/Codex Execution**: Instruct the agent to build the next module or apply hardening fixes.
+3. **Validation**: Run `git diff --check` to ensure code cleanliness.
+4. **Audit**: Run `generate-audit.ps1` to log the phase's changes.
+5. **Commit**: `git add .`, `git commit -m "..."`, `git push`.
+6. **Testing**: Browser preview and manual QA are performed externally by the user.
diff --git a/docs/CRM_ARCHITECTURE.md b/docs/CRM_ARCHITECTURE.md
index 5e2b82a..5ba585a 100644
--- a/docs/CRM_ARCHITECTURE.md
+++ b/docs/CRM_ARCHITECTURE.md
@@ -1,307 +1,94 @@
-# TechnoEdge CRM ΓÇö System Architecture
-
-> This document describes the technical architecture of TechnoEdge CRM.  
-> Last updated: Phase 0 ΓÇö Foundation Setup.
-
----
-
-## 1. Overview
-
-TechnoEdge CRM is a **single-page application (SPA)** built with vanilla HTML, CSS, and JavaScript. It runs entirely in the browser with no server-side dependencies in Phase 1.
-
-### Key Architectural Decisions
-
-| Decision | Choice | Rationale |
-|----------|--------|-----------|
-| Framework | None (vanilla JS) | Simplicity, zero dependencies, full control |
-| Styling | Vanilla CSS with custom properties | Design tokens from DESIGN.md map directly to CSS vars |
-| Routing | Hash-based (`#/page`) | No server config needed, works with file:// protocol |
-| Data | LocalStorage | No backend required for Phase 1; data persists per browser |
-| Modules | ES6 modules (`import/export`) | Native browser support, no bundler needed |
-| Font | Inter (Google Fonts CDN) | Open-source substitute for Airbnb Cereal VF per DESIGN.md |
-
----
-
-## 2. Application Architecture
-
-```
-ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ
-Γöé                        index.html                           Γöé
-Γöé  ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ  ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ Γöé
-Γöé  Γöé          Γöé  Γöé              Topbar                       Γöé Γöé
-Γöé  Γöé          Γöé  Γöé  Breadcrumb Γöé Search Γöé User Profile       Γöé Γöé
-Γöé  Γöé Sidebar  Γöé  Γö£ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöñ Γöé
-Γöé  Γöé          Γöé  Γöé                                          Γöé Γöé
-Γöé  Γöé  Logo    Γöé  Γöé           Content Area                   Γöé Γöé
-Γöé  Γöé  Nav     Γöé  Γöé                                          Γöé Γöé
-Γöé  Γöé  Links   Γöé  Γöé    (Pages rendered here by Router)       Γöé Γöé
-Γöé  Γöé          Γöé  Γöé                                          Γöé Γöé
-Γöé  Γöé  User    Γöé  Γöé    Dashboard Γöé Pipeline Γöé Leads          Γöé Γöé
-Γöé  Γöé  Info    Γöé  Γöé    Contacts  Γöé Deals   Γöé Team            Γöé Γöé
-Γöé  Γöé          Γöé  Γöé    Reports   Γöé Settings                  Γöé Γöé
-Γöé  Γöé          Γöé  Γöé                                          Γöé Γöé
-Γöé  ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ  ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ Γöé
-ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ
-```
-
-### Layer Diagram
-
-```
-ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ
-Γöé            Pages Layer              Γöé  ΓåÉ Page modules render into content area
-Γöé  dashboard Γöé pipeline Γöé leads Γöé ... Γöé
-Γö£ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöñ
-Γöé         Components Layer            Γöé  ΓåÉ Reusable UI: tables, modals, forms
-Γöé  sidebar Γöé topbar Γöé table Γöé modal   Γöé
-Γö£ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöñ
-Γöé          Services Layer             Γöé  ΓåÉ Business logic and data access
-Γöé    auth Γöé store Γöé router Γöé utils    Γöé
-Γö£ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöñ
-Γöé         Design System (CSS)         Γöé  ΓåÉ Tokens, base styles, components
-Γöé  variables Γöé base Γöé layout Γöé comps  Γöé
-Γö£ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöñ
-Γöé        Browser Platform             Γöé  ΓåÉ LocalStorage, DOM, History API
-ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ
-```
-
----
-
-## 3. SOP Pipeline Architecture
-
-The CRM enforces a **7-stage standard operating procedure** for every deal:
-
-```
-ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ   ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ   ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ   ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ
-ΓöéSales ΓöéΓöÇΓöÇΓû╢Γöé Requirement ΓöéΓöÇΓöÇΓû╢Γöé Sourcing ΓöéΓöÇΓöÇΓû╢Γöé Delivery Γöé
-ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ   ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ   ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ   ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ
-                                                  Γöé
-                                                  Γû╝
-           ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ   ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ   ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ
-           Γöé Renewal  ΓöéΓùÇΓöÇΓöÇΓöé Invoice/Payment ΓöéΓùÇΓöÇΓöÇΓöé Feedback Γöé
-           ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ   ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ   ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ
-```
-
-### Stage Definitions
-
-| # | Stage | Purpose | Key Activities |
-|---|-------|---------|----------------|
-| 1 | **Sales** | Lead qualification, initial contact | Cold outreach, qualification calls, lead scoring |
-| 2 | **Requirement** | Needs analysis, requirement gathering | Discovery meetings, requirement documents, scope definition |
-| 3 | **Sourcing** | Vendor/product sourcing, proposal | Vendor research, pricing, proposal creation |
-| 4 | **Delivery** | Order fulfillment, delivery tracking | Order processing, shipment tracking, delivery confirmation |
-| 5 | **Feedback** | Customer satisfaction check | Follow-up calls, satisfaction surveys, issue resolution |
-| 6 | **Invoice/Payment** | Billing and payment | Invoice generation, payment tracking, overdue follow-ups |
-| 7 | **Renewal** | Contract renewal, upsell | Renewal offers, contract extension, upsell opportunities |
-
-### Stage Transition Rules
-
-- **Default flow:** Stages progress sequentially (1 ΓåÆ 2 ΓåÆ 3 ΓåÆ ... ΓåÆ 7)
-- **Employee/Team Lead:** Can only move a deal to the **next** stage
-- **Manager:** Can **override** and move a deal to **any** stage (skip forward or move back)
-- **Stage changes are logged** as activities with timestamp, user, and optional notes
-- A deal can be **closed/lost** from any stage (removes from active pipeline)
-
----
-
-## 4. Data Model
-
-### Entity Relationship
-
-```
-ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ       ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ       ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ
-Γöé   User   ΓöéΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓû╢Γöé   Team   ΓöéΓùÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöé   User   Γöé
-Γöé (Member) Γöé many  Γöé          Γöé  1    Γöé  (Lead)  Γöé
-ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ       ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ       ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ
-     Γöé                   Γöé
-     Γöé assignedTo        Γöé teamId
-     Γû╝                   Γû╝
-ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ       ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ       ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ
-Γöé   Lead   ΓöéΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓû╢Γöé   Deal   ΓöéΓùÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöé Contact  Γöé
-Γöé          Γöé 1:1   Γöé          Γöé  1:1  Γöé          Γöé
-ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ       ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ       ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ
-                        Γöé
-                        Γöé dealId
-                        Γû╝
-                   ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ
-                   Γöé Activity Γöé
-                   Γöé          Γöé
-                   ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ
-```
-
-### Entities
-
-#### User
-```
-{
-  id:        string     ΓÇö Unique identifier
-  name:      string     ΓÇö Full name
-  email:     string     ΓÇö Email address
-  role:      enum       ΓÇö "manager" | "team_lead" | "employee"
-  teamId:    string     ΓÇö Reference to Team (null for Manager)
-  avatarColor: string   ΓÇö Color for avatar circle
-  isActive:  boolean    ΓÇö Account status
-}
-```
-
-#### Team
-```
-{
-  id:        string     ΓÇö Unique identifier
-  name:      string     ΓÇö Team name (e.g., "North Sales", "Enterprise Team")
-  leadId:    string     ΓÇö Reference to User (Team Lead)
-  memberIds: string[]   ΓÇö References to Users (Employees)
-}
-```
-
-#### Lead
-```
-{
-  id:          string   ΓÇö Unique identifier
-  name:        string   ΓÇö Contact/company name
-  company:     string   ΓÇö Company name
-  email:       string   ΓÇö Email
-  phone:       string   ΓÇö Phone number
-  source:      enum     ΓÇö "website" | "referral" | "cold_call" | "social" | "event" | "other"
-  status:      enum     ΓÇö "new" | "contacted" | "qualified" | "unqualified" | "converted"
-  assignedTo:  string   ΓÇö Reference to User
-  createdBy:   string   ΓÇö Reference to User who created
-  createdAt:   string   ΓÇö ISO timestamp
-  updatedAt:   string   ΓÇö ISO timestamp
-  notes:       string   ΓÇö Free-text notes
-}
-```
-
-#### Contact
-```
-{
-  id:          string   ΓÇö Unique identifier
-  name:        string   ΓÇö Full name
-  company:     string   ΓÇö Company name
-  email:       string   ΓÇö Email
-  phone:       string   ΓÇö Phone number
-  designation: string   ΓÇö Job title
-  type:        enum     ΓÇö "client" | "vendor"
-  tags:        string[] ΓÇö Flexible tagging
-  createdAt:   string   ΓÇö ISO timestamp
-}
-```
-
-#### Deal
-```
-{
-  id:          string   ΓÇö Unique identifier
-  title:       string   ΓÇö Deal title
-  leadId:      string   ΓÇö Reference to originating Lead
-  contactId:   string   ΓÇö Reference to Contact
-  value:       number   ΓÇö Deal value in base currency
-  currency:    string   ΓÇö Currency code (default: "INR")
-  stage:       enum     ΓÇö "sales" | "requirement" | "sourcing" | "delivery" | "feedback" | "invoice" | "renewal"
-  status:      enum     ΓÇö "active" | "won" | "lost"
-  assignedTo:  string   ΓÇö Reference to User (Employee)
-  teamId:      string   ΓÇö Reference to Team
-  priority:    enum     ΓÇö "low" | "medium" | "high" | "urgent"
-  createdAt:   string   ΓÇö ISO timestamp
-  updatedAt:   string   ΓÇö ISO timestamp
-  closedAt:    string   ΓÇö ISO timestamp (when won/lost)
-  notes:       string   ΓÇö Free-text notes
-}
-```
-
-#### Activity
-```
-{
-  id:          string   ΓÇö Unique identifier
-  dealId:      string   ΓÇö Reference to Deal
-  type:        enum     ΓÇö "call" | "email" | "meeting" | "note" | "stage_change" | "assignment"
-  content:     string   ΓÇö Activity description
-  fromStage:   string   ΓÇö Previous stage (for stage_change type)
-  toStage:     string   ΓÇö New stage (for stage_change type)
-  createdBy:   string   ΓÇö Reference to User
-  createdAt:   string   ΓÇö ISO timestamp
-}
-```
-
----
-
-## 5. Routing
-
-Hash-based routing with role guards:
-
-| Route | Page | Manager | Team Lead | Employee |
-|-------|------|---------|-----------|----------|
-| `#/login` | Login | Γ£à | Γ£à | Γ£à |
-| `#/dashboard` | Dashboard | Γ£à | Γ£à | Γ£à |
-| `#/pipeline` | Pipeline Kanban | Γ£à | Γ£à | Γ£à |
-| `#/leads` | Lead List | Γ£à | Γ£à | Γ£à |
-| `#/leads/:id` | Lead Detail | Γ£à | Γ£à | Γ£à (own) |
-| `#/contacts` | Contact List | Γ£à | Γ£à | Γ£à |
-| `#/contacts/:id` | Contact Detail | Γ£à | Γ£à | Γ£à |
-| `#/deals` | Deal List | Γ£à | Γ£à | Γ£à |
-| `#/deals/:id` | Deal Detail | Γ£à | Γ£à | Γ£à (own) |
-| `#/team` | Team Management | Γ£à | Γ£à (own) | Γ¥î |
-| `#/reports` | Reports | Γ£à | Γ¥î | Γ¥î |
-| `#/settings` | Settings | Γ£à | Γ£à | Γ£à |
-
----
-
-## 6. State Management
-
-### Data Flow
-
-```
-User Action ΓåÆ Page Handler ΓåÆ Store (CRUD) ΓåÆ LocalStorage
-                                  Γåô
-                            Re-render View
-```
-
-- **Store** provides role-scoped query methods
-- **Pages** subscribe to data changes and re-render
-- **No global state object** ΓÇö each page fetches fresh data from Store on render
-- **Optimistic UI** ΓÇö changes apply immediately, persisted to LocalStorage synchronously
-
-### LocalStorage Keys
-
-| Key | Contents |
-|-----|----------|
-| `technoedge_users` | User[] |
-| `technoedge_teams` | Team[] |
-| `technoedge_leads` | Lead[] |
-| `technoedge_contacts` | Contact[] |
-| `technoedge_deals` | Deal[] |
-| `technoedge_activities` | Activity[] |
-| `technoedge_session` | Current user session |
-| `technoedge_settings` | App preferences |
-
----
-
-## 7. Security Model (Client-Side)
-
-> **Note:** This is client-side enforcement only. There is no server-side validation in Phase 1. Data is not encrypted at rest.
-
-- **Route guards:** Router checks `auth.canAccess(route)` before rendering
-- **Data scoping:** Store queries filter by role before returning results
-- **Action guards:** UI disables/hides actions the current role cannot perform
-- **Session:** Stored in LocalStorage; cleared on logout
-
----
-
-## 8. Future Architecture (Phase 3+)
-
-When backend/integrations are added:
-
-```
-ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ     ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ     ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ
-Γöé  Frontend  ΓöéΓöÇΓöÇΓöÇΓöÇΓû╢Γöé  REST API  ΓöéΓöÇΓöÇΓöÇΓöÇΓû╢Γöé  Database  Γöé
-Γöé  (Current) Γöé     Γöé  (Node.js) Γöé     Γöé (Postgres) Γöé
-ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ     ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ     ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ
-                        Γöé
-                   ΓöîΓöÇΓöÇΓöÇΓöÇΓö┤ΓöÇΓöÇΓöÇΓöÇΓöÉ
-                   Γöé   AI    Γöé
-                   Γöé Service Γöé
-                   ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ
-```
-
-- LocalStorage ΓåÆ replaced by API calls
-- Auth ΓåÆ replaced by JWT/session tokens
-- Store ΓåÆ becomes API client layer
-- Frontend code remains largely unchanged
+# TechnoEdge CRM ΓÇö Architecture
+
+## Overview
+TechnoEdge CRM is a Vanilla JavaScript Single Page Application (SPA). It runs entirely in the browser and uses `LocalStorage` for all data persistence.
+
+> **Important Limitation:** This is a frontend-only MVP. There is no remote backend database, no real authentication/JWTs, and no live external integrations. If `LocalStorage` is cleared, all CRM data is lost unless explicitly exported.
+
+## Tech Stack
+- **HTML5 & CSS3**: Vanilla, leveraging custom CSS variables for tokens (`css/variables.css`). No CSS frameworks (e.g., Tailwind or Bootstrap) are used.
+- **JavaScript (ES6 Modules)**: Vanilla JS handles routing, data state, and DOM updates. No JS frameworks (e.g., React or Vue) are used.
+- **Data Layer**: Native browser `window.localStorage`.
+
+## Application Layers
+
+### 1. The Store (`js/store.js`)
+The central nervous system of the app. It manages synchronous CRUD operations against LocalStorage.
+- Reads and writes schema arrays from LocalStorage and returns empty arrays when data is missing.
+- Enforces Role-Based Access Control (RBAC) synchronously (e.g., `getDealsForUser(user)` filters the raw deals array based on whether the user is a Manager, Team Lead, or Employee).
+- Connects modules via foreign keys (e.g., `dealId`, `assignedTo`, `teamId`).
+
+### 2. Authentication (`js/auth.js`)
+A mock authentication layer that controls the current active session.
+- Allows demo login by selecting a predefined user profile.
+- Restricts unauthenticated users to the `#/login` route.
+- Returns the full user object including `role` and `teamId`.
+
+### 3. Routing (`js/router.js` & `js/app.js`)
+A lightweight hash-based router (`window.addEventListener('hashchange')`).
+- Bootstraps the application shell (Sidebar + Topbar) on first load.
+- Injects module-specific HTML into the `<main id="content-area">` container.
+- Delegates event binding to specific page modules after DOM injection.
+
+### 4. Components (`js/components/`)
+Reusable UI modules that decouple shell behavior from business pages.
+- **`sidebar.js`**: Renders dynamic navigation links based on user role.
+- **`topbar.js`**: Renders breadcrumbs and the mobile menu toggle.
+- **`global-search.js`**: Manages the keyboard-accessible (`/`) cross-module search overlay.
+- **`toast.js`**: Non-blocking notification popups for success/error states.
+
+## Data Entities
+
+The local database consists of the following key entities:
+- `users`: Core profiles with roles (manager, team_lead, employee).
+- `teams`: Logical groupings of users.
+- `leads`: Early-stage unqualified opportunities.
+- `contacts`: Global stakeholder address book.
+- `deals`: Core sales opportunities progressing through pipeline stages.
+- `activities`: Timestamped notes, logs, and future-dated follow-ups.
+- `requirements`: Technical and business scoping docs attached to deals.
+- `proposals`: Financial quotes requiring manager approval.
+- `handoffs`: Post-sale delivery instruction sets.
+- `billings`: Invoicing, payment collection, and renewal tracking.
+- `settings` & `session`: App-wide preferences (like Compact Tables) and active login state.
+
+## Core Workflows & Lifecycles
+
+### The Commercial Lifecycle
+Data conceptually flows sequentially, although users can jump between modules:
+1. **Lead Generation**: Unqualified prospect (`#/leads`).
+2. **Deal Conversion**: Lead is qualified and promoted to a Deal (`#/deals`).
+3. **Scoping**: Technical/Business Requirements are attached to the Deal (`#/requirements`).
+4. **Quotation**: A Financial Proposal is generated and approved (`#/proposals`).
+5. **Closure**: Deal is Won.
+6. **Execution**: A Project Handoff is authored for the Delivery team (`#/handoffs`).
+7. **Collection**: Invoices are raised and Renewals are tracked (`#/billing`).
+
+### The Activity Timeline
+All communication, updates, and future reminders are tracked as Activities (`#/activities`). Follow-ups are tied directly to parent entities (Deals, Leads, etc.) and appear chronologically in their detail views.
+
+### Audit & Export Boundaries
+Because data is browser-bound, data backup and portability rely on manual JSON exports.
+- **Managers only** can hit the `#/settings` endpoint to dump the entire database to a `.json` file, or generate `.csv` files for legacy systems.
+- Complete data imports will immediately overwrite `LocalStorage`.
+
+## Route Map
+
+| Route | Purpose | Access |
+|---|---|---|
+| `#/login` | Demo role selection | Public |
+| `#/dashboard` | KPI overview & Alerts | All Roles |
+| `#/pipeline` | Kanban deal progression | All Roles |
+| `#/leads` | Lead management | All Roles |
+| `#/contacts` | Address book | All Roles |
+| `#/deals` | List view of deals | All Roles |
+| `#/deals/:id` | Deal detail & Stage execution | All Roles |
+| `#/activities` | Action items & Follow-ups | All Roles |
+| `#/requirements` | Scoping documents | All Roles |
+| `#/proposals` | Financial quotations | All Roles |
+| `#/handoffs` | Delivery transitioning | All Roles |
+| `#/billing` | Invoices & Renewals | All Roles |
+| `#/hygiene` | CRM data quality alerts | All Roles |
+| `#/team` | User & reassignment management | Team Lead, Manager |
+| `#/reports` | Analytics & forecasting | Manager Only |
+| `#/settings` | Preferences & data export | All Roles (Export Manager-only) |
diff --git a/docs/MODULE_INDEX.md b/docs/MODULE_INDEX.md
new file mode 100644
index 0000000..d648253
--- /dev/null
+++ b/docs/MODULE_INDEX.md
@@ -0,0 +1,22 @@
+# TechnoEdge CRM ΓÇö Module Index
+
+This index provides a technical overview of the primary modules that compose the Phase 2 MVP.
+
+| Module | Purpose | Main UI File | Roles | Primary Data Entity |
+|---|---|---|---|---|
+| **App Shell** | Sidebar, Topbar, Global Search, Layout | `js/app.js` | All | `session`, `users` |
+| **Login** | Role/Demo selection | `js/pages/login.js`, `js/auth.js` | All | `session` |
+| **Dashboard** | High-level KPIs and urgent open task/hygiene alerts | `js/pages/dashboard.js` | All | All (Aggregated) |
+| **Pipeline** | Kanban board for visual Deal progression | `js/pages/pipeline.js` | All | `deals` |
+| **Leads** | Qualification and progression of new prospects | `js/pages/leads.js` | All | `leads` |
+| **Contacts** | Global stakeholder and client address book | `js/pages/contacts.js` | All | `contacts` |
+| **Deals** | List view and detailed stage-execution of opportunities | `js/pages/deals.js`, `js/pages/deal-detail.js` | All | `deals` |
+| **Activities** | Future follow-ups, calls, and historical meeting notes | `js/pages/activities.js` | All | `activities` |
+| **Requirements** | Scoping docs, tech specs, and implementation details | `js/pages/requirements.js` | All | `requirements` |
+| **Proposals** | Financial quotations with manager approval workflows | `js/pages/proposals.js` | All | `proposals` |
+| **Project Handoff** | Post-sale instructions for the delivery team | `js/pages/handoffs.js` | All | `handoffs` |
+| **Billing** | Tracking invoice amounts, payment status, and renewals | `js/pages/billing.js` | All | `billings` |
+| **CRM Hygiene** | Actionable dashboard highlighting stale or incomplete data | `js/pages/hygiene.js` | All | All (Aggregated) |
+| **Team Management**| User list and record reassignment tools | `js/pages/team.js` | Manager, Team Lead | `users`, `teams` |
+| **Reports** | Analytics, pipeline forecasting, and conversion metrics | `js/pages/reports.js` | Manager | All (Aggregated) |
+| **Settings** | JSON/CSV Data export, import, preferences, and reset | `js/pages/settings.js` | All; Manager-only export/import/reset | `settings` |
diff --git a/docs/MVP_ACCEPTANCE_CHECKLIST.md b/docs/MVP_ACCEPTANCE_CHECKLIST.md
new file mode 100644
index 0000000..6bc2847
--- /dev/null
+++ b/docs/MVP_ACCEPTANCE_CHECKLIST.md
@@ -0,0 +1,34 @@
+# TechnoEdge CRM ΓÇö MVP Acceptance Checklist
+
+This checklist provides a framework for manual Quality Assurance (QA) to ensure all Phase 2 MVP requirements are functioning correctly within the browser environment.
+
+## 1. Authentication & Role Scoping
+- [ ] **Role Login**: Verify logging in as Manager, Team Lead, and Employee correctly scopes the visible data on the Dashboard.
+- [ ] **Navigation Visibility**: Ensure Employees and Team Leads cannot see the `#/reports` link in the sidebar.
+- [ ] **Data Boundaries**: Verify Team Leads can only see their team's Deals/Leads, and Employees can only see their specific assignments.
+
+## 2. Core CRM Flows
+- [ ] **Lead Conversion**: Create a Lead, fill in required fields, click "Convert to Deal", and ensure the new Deal appears in the Pipeline.
+- [ ] **Pipeline Movement**: Use the available stage controls to move a Deal from `Lead/Sourcing` to `Requirement` in the Pipeline Kanban view.
+- [ ] **Deal Detail Progression**: Open a Deal, complete all mandatory SOP checklist items, and advance the stage. Ensure stages strictly lock if requirements are missing.
+
+## 3. Module Operations
+- [ ] **Activities**: Create a future-dated Follow-up on a Deal. Verify it appears on the Dashboard's open tasks and the Deal's timeline.
+- [ ] **Requirements**: Attach a technical Requirement scoping doc to a Deal.
+- [ ] **Proposals (Approval)**: Submit a Proposal as an Employee. Switch to a Manager account and Verify the "Approve" and "Reject" actions function correctly.
+- [ ] **Project Handoff**: Create a Handoff instruction set from a Won Deal. Verify the delivery target dates save correctly.
+- [ ] **Billing & Renewals**: Log a partial payment on a Billing record. Ensure the balance correctly calculates. Log full payment to flip status to Paid.
+
+## 4. CRM Hygiene & Search
+- [ ] **Hygiene Dashboard**: View `#/hygiene` as a Manager. Click a "Fix" action to safely route to the offending record.
+- [ ] **Global Search**: Press `/` from anywhere. Type a Deal name and verify it appears with the correct entity badge. Test `Arrow` key navigation and `Enter` to route.
+
+## 5. UI & Responsive Shell
+- [ ] **Mobile Drawer**: Resize the browser below `744px`. Verify the topbar hamburger menu cleanly opens the sidebar over a dark translucent backdrop.
+- [ ] **Compact Tables**: Go to `#/settings`, check "Compact Tables", and verify that all data tables (e.g. `#/deals`) immediately shrink their padding.
+- [ ] **Responsive Forms/Modals**: Open a "Create Deal" modal on mobile width to ensure the footer buttons wrap cleanly and the body scrolls internally.
+
+## 6. Settings & Data Management
+- [ ] **Export**: As a Manager, click "Export Full JSON". Verify a `.json` file downloads.
+- [ ] **Import**: As a Manager, import a valid JSON file. Verify data is successfully hydrated across all modules.
+- [ ] **Reset**: As a Manager, click "Reset Demo Data". Verify the system logs you out and seeds the baseline database.
diff --git a/docs/PHASE_PLAN.md b/docs/PHASE_PLAN.md
index be59d2c..c92b56c 100644
--- a/docs/PHASE_PLAN.md
+++ b/docs/PHASE_PLAN.md
@@ -1,217 +1,80 @@
-# TechnoEdge CRM ΓÇö Phased Delivery Plan
+# TechnoEdge CRM ΓÇö Project Phase Plan
 
-> This document outlines the complete delivery roadmap for TechnoEdge CRM.  
-> Each phase builds on the previous one. Phases 0ΓÇô2 cover the basic CRM. Phase 3+ covers advanced features.
+This document tracks the iterative roadmap and execution history of the TechnoEdge CRM project.
 
----
-
-## Phase Summary
-
-```
-Phase 0 ΓöÇΓöÇΓû╢ Phase 1 ΓöÇΓöÇΓû╢ Phase 2 ΓöÇΓöÇΓû╢ Phase 3+
-Foundation   Core CRM    Polish &    AI, RAG,
-& Docs       & SOP       Advanced    Integrations
-             Pipeline    Features
-```
-
-| Phase | Name | Status | Focus |
-|-------|------|--------|-------|
-| **0** | Foundation & Documentation | ≡ƒƒó Current | Project setup, docs, design system, audit workflow |
-| **1** | Core CRM & SOP Pipeline | Γ¼£ Next | Login, dashboard, pipeline kanban, leads, contacts, deals, RBAC |
-| **2** | Advanced Features & Polish | Γ¼£ Planned | Drag-drop, bulk ops, export, notifications, mobile responsive |
-| **3** | AI & Intelligent Features | Γ¼£ Future | AI assistant, smart suggestions, auto-prioritization |
-| **4** | RAG & Knowledge Base | Γ¼£ Future | Document search, sales playbooks, knowledge retrieval |
-| **5** | Integrations | Γ¼£ Future | Email, calendar, CRM sync, webhooks |
-| **6** | Call Recording & Analysis | Γ¼£ Future | Call recording, transcription, sentiment analysis |
-
----
+## Completed Phases (MVP)
 
-## Phase 0 ΓÇö Foundation & Documentation
+**Phase 0: Foundation Docs**
+- Created core requirements, architecture guidelines, and design token documentation.
 
-**Goal:** Establish project structure, design system reference, documentation, and development workflow.
+**Phase 1A: App Foundation and Role-Access Shell**
+- Built Vanilla JS SPA routing, LocalStorage `Store`, mock authentication, and base shell UI (Sidebar, Topbar).
 
-### Deliverables
+**Phase 1B: SOP Pipeline and Deal Detail Stage Controls**
+- Implemented Kanban pipeline and rigid, step-by-step deal progression workflows.
 
-- [x] `README.md` ΓÇö Project overview, structure, getting started
-- [x] `DESIGN.md` ΓÇö Lifetime design system reference (Airbnb-inspired)
-- [x] `docs/CRM_ARCHITECTURE.md` ΓÇö System architecture, data model, routing
-- [x] `docs/ROLE_ACCESS_MATRIX.md` ΓÇö Complete RBAC permission matrix
-- [x] `docs/PHASE_PLAN.md` ΓÇö This roadmap document
-- [x] `audits/` folder ΓÇö Directory for AI change audit reports
-- [x] `generate-audit.ps1` ΓÇö PowerShell audit script using Git diff
+**Phase 1C: Leads Page and Guarded Lead Actions**
+- Built Lead tracking, qualification tools, and Deal conversion mechanics.
 
-### Not Included
-- No UI code
-- No JavaScript logic
-- No CSS files
-- No `index.html`
+**Phase 1D: Contacts Page**
+- Built globally accessible address book for client stakeholders.
 
----
-
-## Phase 1 ΓÇö Core CRM & SOP Pipeline
-
-**Goal:** Build the complete, functional CRM with all core features, SOP pipeline, and role-based access control.
-
-### Deliverables
-
-#### Design System (CSS)
-- [ ] `css/variables.css` ΓÇö All DESIGN.md tokens as CSS custom properties
-- [ ] `css/base.css` ΓÇö Reset, Inter font loading, global styles
-- [ ] `css/layout.css` ΓÇö Sidebar, topbar, content area layout
-- [ ] `css/components.css` ΓÇö All reusable component styles
-
-#### Core JavaScript
-- [ ] `js/app.js` ΓÇö Application entry point and bootstrap
-- [ ] `js/router.js` ΓÇö Hash-based SPA routing with role guards
-- [ ] `js/auth.js` ΓÇö Login/logout, role permission checks
-- [ ] `js/store.js` ΓÇö LocalStorage data layer with CRUD operations
-- [ ] `js/seed.js` ΓÇö Demo data seeder (7 users, leads, deals, contacts)
-- [ ] `js/utils.js` ΓÇö Formatters, date helpers, ID generators
-
-#### Reusable Components
-- [ ] `js/components/sidebar.js` ΓÇö Navigation sidebar with role-based menu
-- [ ] `js/components/topbar.js` ΓÇö Top bar with breadcrumbs, search, user profile
-- [ ] `js/components/modal.js` ΓÇö Modal dialog system
-- [ ] `js/components/table.js` ΓÇö Data table with sort, filter, pagination
-- [ ] `js/components/toast.js` ΓÇö Toast notification system
-- [ ] `js/components/forms.js` ΓÇö Form builder with validation
-
-#### Pages
-- [ ] `js/pages/login.js` ΓÇö User picker login (no passwords)
-- [ ] `js/pages/dashboard.js` ΓÇö Role-aware dashboard with stats and activity feed
-- [ ] `js/pages/pipeline.js` ΓÇö SOP kanban board (7 columns)
-- [ ] `js/pages/leads.js` ΓÇö Lead management with table view
-- [ ] `js/pages/contacts.js` ΓÇö Contact directory
-- [ ] `js/pages/deals.js` ΓÇö Deal list and management
-- [ ] `js/pages/deal-detail.js` ΓÇö Single deal with SOP stage progress
-- [ ] `js/pages/team.js` ΓÇö Team management (Manager/TL only)
-- [ ] `js/pages/reports.js` ΓÇö Reports and analytics (Manager only)
-- [ ] `js/pages/settings.js` ΓÇö App settings and data management
-
-#### Entry Point
-- [ ] `index.html` ΓÇö HTML5 SPA shell
+**Phase 1E: Deals List and Guarded Deal Actions**
+- Added list-view management for Deals with role-scoped editing.
 
----
+**Phase 1F: Team Management and Reassignment**
+- Created Team Lead/Manager tools for handling employee assignment and record transfers.
 
-## Phase 2 ΓÇö Advanced Features & Polish
+**Phase 1G: Reports Analytics and Forecast Dashboard**
+- Added Manager-only analytical views for pipeline forecasting and conversion rates.
 
-**Goal:** Enhance the core CRM with advanced UI features, mobile responsiveness, and data management.
+**Phase 1H: Settings and Data Management**
+- Implemented global JSON/CSV exports, data importing, and demo data reset functionality.
 
-### Planned Features
+**Phase 2A: Activities and Follow-up Management**
+- Added timeline events, deadlines, and cross-module follow-up tracking.
 
-- [ ] **Drag-and-drop pipeline** ΓÇö Drag deal cards between kanban columns
-- [ ] **Bulk operations** ΓÇö Multi-select leads/deals for bulk assign, delete, stage change
-- [ ] **Data export** ΓÇö Export leads, deals, contacts as CSV/JSON
-- [ ] **Data import** ΓÇö Import leads from CSV
-- [ ] **Advanced filters** ΓÇö Multi-criteria filtering with saved filter presets
-- [ ] **Notification center** ΓÇö In-app notifications for assignments, stage changes, mentions
-- [ ] **Mobile responsive** ΓÇö Full responsive layout per DESIGN.md breakpoints
-- [ ] **Sidebar collapse** ΓÇö Collapsible sidebar with icon-only mode
-- [ ] **Keyboard shortcuts** ΓÇö Common actions via keyboard (N for new, E for edit, etc.)
-- [ ] **Print-friendly views** ΓÇö Printable deal summaries and reports
-- [ ] **Dark mode** ΓÇö Optional dark color scheme
-- [ ] **Activity charts** ΓÇö Visual charts for activity trends (CSS-only)
-- [ ] **Deal timeline** ΓÇö Visual timeline view of deal progression through SOP stages
+**Phase 2B: Requirements, Proposals, Quotations**
+- Built technical scoping and financial proposal generation with Manager approval gates.
 
----
+**Phase 2C: Project Handoff and Delivery Tracker**
+- Created the post-sale operational handoff module to transition Deals to Delivery.
 
-## Phase 3 ΓÇö AI & Intelligent Features
+**Phase 2D: Billing, Payment, Renewal Tracker**
+- Implemented commercial closure tracking, including invoice status, overdue alerts, and future renewals.
 
-> ΓÜá∩╕Å **Not in basic CRM scope.** This phase will be planned separately.
+**Phase 2E: CRM Hygiene and Data Quality Dashboard**
+- Added an actionable dashboard highlighting stale, unassigned, and missing-data records.
 
-**Goal:** Add AI-powered features to enhance sales productivity.
+**Phase 2F: Global Search and Navigation Polish**
+- Implemented keyboard-navigable (`/`), role-scoped global search across all entities.
 
-### Planned Features
+**Phase 2G: Responsive Polish and Shell Usability**
+- Optimized layouts for laptop, tablet, and mobile breakpoints. Added Compact Tables preference and mobile drawer.
 
-- [ ] **AI Sales Assistant** ΓÇö Conversational AI for sales guidance
-- [ ] **Smart Lead Scoring** ΓÇö AI-powered lead prioritization
-- [ ] **Deal Risk Prediction** ΓÇö Predict deal outcomes based on pipeline behavior
-- [ ] **Auto-Suggestions** ΓÇö Suggest next actions based on deal stage and history
-- [ ] **Email Drafting** ΓÇö AI-generated email templates for each SOP stage
-- [ ] **Meeting Summary** ΓÇö Auto-generate meeting notes from descriptions
-
-### Technical Requirements
-- LLM integration (API-based)
-- Prompt engineering for sales context
-- Async processing for AI responses
+**Phase 2H: Documentation Closeout (Current)**
+- Synchronized architecture, role matrix, and readme documentation to accurately reflect the final Phase 2 MVP.
 
 ---
 
-## Phase 4 ΓÇö RAG & Knowledge Base
-
-> ΓÜá∩╕Å **Not in basic CRM scope.** This phase will be planned separately.
-
-**Goal:** Build a retrieval-augmented generation (RAG) system for sales knowledge.
-
-### Planned Features
+## Future Scope (Not in MVP)
 
-- [ ] **Document Upload** ΓÇö Upload sales playbooks, product docs, case studies
-- [ ] **Semantic Search** ΓÇö Natural language search across all documents
-- [ ] **Context-Aware Answers** ΓÇö AI answers grounded in company documents
-- [ ] **Sales Playbook Suggestions** ΓÇö Auto-suggest relevant playbook sections based on deal stage
-- [ ] **Competitive Intelligence** ΓÇö Searchable competitive analysis database
-
-### Technical Requirements
-- Vector database (e.g., ChromaDB, Pinecone)
-- Document parsing (PDF, DOCX, TXT)
-- Embedding model integration
-- Chunking and indexing pipeline
-
----
+The following features represent the roadmap beyond the core browser-local MVP. **They are not currently built.**
 
-## Phase 5 ΓÇö Integrations
+**Phase 3: AI Assistant and Smart Sales Intelligence**
+- Conversational querying of CRM data.
+- Automated email drafting and response generation.
+- Predictive deal scoring.
 
-> ΓÜá∩╕Å **Not in basic CRM scope.** This phase will be planned separately.
-
-**Goal:** Connect TechnoEdge CRM with external tools and services.
-
-### Planned Integrations
-
-- [ ] **Email Integration** ΓÇö Gmail/Outlook sync for activity logging
-- [ ] **Calendar Integration** ΓÇö Google Calendar/Outlook for meeting scheduling
-- [ ] **Communication** ΓÇö WhatsApp Business API, Slack notifications
-- [ ] **Accounting** ΓÇö Tally/QuickBooks for invoice sync
-- [ ] **CRM Sync** ΓÇö Import/export with Salesforce, HubSpot
-- [ ] **Webhooks** ΓÇö Outbound webhooks for custom automation
-- [ ] **REST API** ΓÇö Public API for third-party integrations
-
-### Technical Requirements
-- Node.js/Express backend (replaces LocalStorage)
-- OAuth2 for third-party auth
-- Webhook queue system
-- API rate limiting
-
----
-
-## Phase 6 ΓÇö Call Recording & Analysis
-
-> ΓÜá∩╕Å **Not in basic CRM scope.** This phase will be planned separately.
-
-**Goal:** Record, transcribe, and analyze sales calls within the CRM.
-
-### Planned Features
-
-- [ ] **Call Recording** ΓÇö Browser-based call recording (WebRTC)
-- [ ] **Transcription** ΓÇö Speech-to-text transcription of recorded calls
-- [ ] **Sentiment Analysis** ΓÇö AI analysis of call tone and customer sentiment
-- [ ] **Key Moment Detection** ΓÇö Auto-highlight objections, commitments, action items
-- [ ] **Call Library** ΓÇö Searchable library of all recorded calls linked to deals
-- [ ] **Coaching Insights** ΓÇö AI-powered coaching suggestions for sales reps
-
-### Technical Requirements
-- WebRTC media capture
-- Speech-to-text API (Whisper, Google Speech)
-- Audio storage (cloud-based)
-- Real-time streaming for live analysis
-
----
+**Phase 4: RAG and Knowledge Base**
+- Centralized knowledge base.
+- Retrieval-Augmented Generation for instant SOP and technical answers.
 
-## Development Rules (All Phases)
+**Phase 5: Integrations**
+- Microsoft Outlook / Exchange sync.
+- Microsoft Teams / Slack webhooks.
+- Migration from LocalStorage to a live backend database/API.
 
-1. **Follow DESIGN.md** ΓÇö All UI must adhere to the lifetime design system reference
-2. **Three roles only** ΓÇö Manager, Team Lead, Employee (no additional roles)
-3. **SOP enforcement** ΓÇö Every deal follows Sales ΓåÆ Requirement ΓåÆ Sourcing ΓåÆ Delivery ΓåÆ Feedback ΓåÆ Invoice/Payment ΓåÆ Renewal
-4. **No auto-commits** ΓÇö All changes reviewed via audit report before committing
-5. **Audit trail** ΓÇö Run `generate-audit.ps1` after every coding session
-6. **Incremental delivery** ΓÇö Each phase is independently functional
-7. **No scope creep** ΓÇö Features belong to the phase they're listed in
+**Phase 6: Call Recording, Transcription, Analysis**
+- Native VoIP or external dialer integration.
+- Automated call transcriptions and sentiment analysis.
diff --git a/docs/ROLE_ACCESS_MATRIX.md b/docs/ROLE_ACCESS_MATRIX.md
index cf46444..8c89dcc 100644
--- a/docs/ROLE_ACCESS_MATRIX.md
+++ b/docs/ROLE_ACCESS_MATRIX.md
@@ -1,204 +1,80 @@
-# TechnoEdge CRM ΓÇö Role-Based Access Control Matrix
+# TechnoEdge CRM ΓÇö Role Access Matrix
 
-> This document defines the complete permission model for TechnoEdge CRM.  
-> Only three roles exist: **Manager**, **Team Lead**, **Employee**.
+TechnoEdge CRM enforces strict Role-Based Access Control (RBAC) across all modules to ensure data privacy and operational integrity.
 
----
-
-## 1. Role Definitions
-
-### Manager
-The **Manager** has **full organizational access**. They can see all data across all teams, approve or reject deal stage transitions, override pipeline stages, view reports, and manage all users and teams.
-
-- **Scope:** Entire organization
-- **Key powers:** Approvals, overrides, reports, user management
-
-### Team Lead
-The **Team Lead** has **team-level access**. They can see their own team's data plus unassigned items. They can assign work to their team members, review their team's progress, and escalate issues to the Manager.
-
-- **Scope:** Own team + unassigned
-- **Key powers:** Assignment, review, escalation
-
-### Employee
-The **Employee** has **personal-level access**. They can only see and work on items assigned to them. They cannot approve, assign to others, or view organizational reports.
-
-- **Scope:** Personally assigned items only
-- **Key powers:** Execute assigned work, log activities, request approvals
-
----
-
-## 2. Feature Access Matrix
-
-### Navigation & Pages
-
-| Page | Manager | Team Lead | Employee |
-|------|:-------:|:---------:|:--------:|
-| Dashboard | Γ£à Full org | Γ£à Team scope | Γ£à Personal scope |
-| Pipeline (Kanban) | Γ£à All deals | Γ£à Team deals | Γ£à Own deals |
-| Leads | Γ£à All | Γ£à Team + unassigned | Γ£à Own assigned |
-| Contacts | Γ£à All | Γ£à All | Γ£à All |
-| Deals | Γ£à All | Γ£à Team deals | Γ£à Own deals |
-| Team Management | Γ£à All teams | Γ£à Own team | Γ¥î Hidden |
-| Reports & Analytics | Γ£à Full reports | Γ¥î Hidden | Γ¥î Hidden |
-| Settings | Γ£à Full | Γ£à Limited | Γ£à Limited |
-
----
-
-### Lead Operations
-
-| Action | Manager | Team Lead | Employee |
-|--------|:-------:|:---------:|:--------:|
-| View all leads | Γ£à | Γ¥î Team only | Γ¥î Own only |
-| View team leads | Γ£à | Γ£à | Γ¥î |
-| View own assigned leads | Γ£à | Γ£à | Γ£à |
-| Create new lead | Γ£à | Γ£à | Γ£à |
-| Edit any lead | Γ£à | Γ¥î Team only | Γ¥î Own only |
-| Delete lead | Γ£à | Γ¥î | Γ¥î |
-| Assign lead to anyone | Γ£à | Γ¥î | Γ¥î |
-| Assign lead to team member | Γ£à | Γ£à | Γ¥î |
-| Reassign lead | Γ£à | Γ£à (within team) | Γ¥î |
-| Convert lead to deal | Γ£à | Γ£à | ΓÜá∩╕Å Request only |
-| Change lead status | Γ£à | Γ£à | Γ£à (own leads) |
-| Bulk assign leads | Γ£à | Γ£à (own team) | Γ¥î |
-
----
-
-### Deal Operations
-
-| Action | Manager | Team Lead | Employee |
-|--------|:-------:|:---------:|:--------:|
-| View all deals | Γ£à | Γ¥î Team only | Γ¥î Own only |
-| View team deals | Γ£à | Γ£à | Γ¥î |
-| View own assigned deals | Γ£à | Γ£à | Γ£à |
-| Create new deal | Γ£à | Γ£à | Γ£à |
-| Edit deal details | Γ£à | Γ£à (team deals) | Γ£à (own deals) |
-| Delete deal | Γ£à | Γ¥î | Γ¥î |
-| Move deal to next stage | Γ£à | Γ£à | Γ£à (own deals) |
-| Move deal to any stage (override) | Γ£à | Γ¥î | Γ¥î |
-| Move deal backward | Γ£à | Γ¥î | Γ¥î |
-| Close deal (won) | Γ£à | Γ£à | ΓÜá∩╕Å Request only |
-| Close deal (lost) | Γ£à | Γ£à | Γ£à (own deals) |
-| Assign deal to anyone | Γ£à | Γ¥î | Γ¥î |
-| Assign deal to team member | Γ£à | Γ£à | Γ¥î |
-| Set deal priority | Γ£à | Γ£à | Γ¥î |
-
----
-
-### Deal Pipeline (SOP Stages)
-
-| Stage Action | Manager | Team Lead | Employee |
-|-------------|:-------:|:---------:|:--------:|
-| Sales ΓåÆ Requirement | Γ£à | Γ£à | Γ£à |
-| Requirement ΓåÆ Sourcing | Γ£à | Γ£à | Γ£à |
-| Sourcing ΓåÆ Delivery | Γ£à | Γ£à | Γ£à |
-| Delivery ΓåÆ Feedback | Γ£à | Γ£à | Γ£à |
-| Feedback ΓåÆ Invoice/Payment | Γ£à | Γ£à | Γ£à |
-| Invoice/Payment ΓåÆ Renewal | Γ£à | Γ£à | Γ£à |
-| Skip stages (jump forward) | Γ£à | Γ¥î | Γ¥î |
-| Revert stages (move back) | Γ£à | Γ¥î | Γ¥î |
-| Override stage to any | Γ£à | Γ¥î | Γ¥î |
-
-> **Rule:** Employees and Team Leads can only advance deals **one stage at a time** in the forward direction. Only Managers can skip or revert stages.
-
----
-
-### Contact Operations
-
-| Action | Manager | Team Lead | Employee |
-|--------|:-------:|:---------:|:--------:|
-| View all contacts | Γ£à | Γ£à | Γ£à |
-| Create contact | Γ£à | Γ£à | Γ£à |
-| Edit contact | Γ£à | Γ£à | Γ£à |
-| Delete contact | Γ£à | Γ¥î | Γ¥î |
-
-> **Note:** Contacts are shared globally ΓÇö all roles can view all contacts. This supports cross-team collaboration.
-
----
-
-### Activity Logging
-
-| Action | Manager | Team Lead | Employee |
-|--------|:-------:|:---------:|:--------:|
-| Log call | Γ£à | Γ£à | Γ£à (own deals) |
-| Log email | Γ£à | Γ£à | Γ£à (own deals) |
-| Log meeting | Γ£à | Γ£à | Γ£à (own deals) |
-| Add note | Γ£à | Γ£à | Γ£à (own deals) |
-| View all activities | Γ£à | Γ£à (team) | Γ£à (own) |
-| Delete activity | Γ£à | Γ¥î | Γ¥î |
-
----
-
-### Team Management
-
-| Action | Manager | Team Lead | Employee |
-|--------|:-------:|:---------:|:--------:|
-| View all teams | Γ£à | Γ¥î | Γ¥î |
-| View own team | Γ£à | Γ£à | Γ¥î |
-| View team member stats | Γ£à | Γ£à (own team) | Γ¥î |
-| Reassign within team | Γ£à | Γ£à | Γ¥î |
-| Reassign across teams | Γ£à | Γ¥î | Γ¥î |
-
----
-
-### Reports & Analytics
-
-| Report | Manager | Team Lead | Employee |
-|--------|:-------:|:---------:|:--------:|
-| Pipeline summary (all) | Γ£à | Γ¥î | Γ¥î |
-| Conversion funnel | Γ£à | Γ¥î | Γ¥î |
-| Team performance comparison | Γ£à | Γ¥î | Γ¥î |
-| Employee leaderboard | Γ£à | Γ¥î | Γ¥î |
-| Stage duration analysis | Γ£à | Γ¥î | Γ¥î |
-| Revenue reports | Γ£à | Γ¥î | Γ¥î |
-
----
-
-## 3. Data Visibility Scoping
-
-### How data is filtered by role
-
-```
-Manager sees:     ALL records in the system
-Team Lead sees:   Records WHERE teamId = myTeamId OR assignedTo IS NULL
-Employee sees:    Records WHERE assignedTo = myUserId
-```
-
-### Dashboard Metrics Scoping
-
-| Metric | Manager | Team Lead | Employee |
-|--------|---------|-----------|----------|
-| Total Revenue | All deals | Team deals | Own deals |
-| Active Deals | All | Team | Own |
-| Conversion Rate | Org-wide | Team | Personal |
-| Pipeline Value | All stages | Team stages | Own stages |
-| Recent Activity | All | Team | Own |
-
----
-
-## 4. UI Enforcement Rules
-
-1. **Hidden elements:** If a role cannot access a feature, the navigation link and UI element are **hidden** (not just disabled).
-2. **Disabled elements:** If a role can see but not act on something (e.g., Employee sees deal priority but can't change it), the control is **visible but disabled** with a tooltip explaining why.
-3. **Filtered data:** Tables and lists are **pre-filtered** by role scope ΓÇö an Employee never sees data from other teams, even in search results.
-4. **Action buttons:** Create/Edit/Delete/Assign buttons only render if the role has permission.
-5. **Stage controls:** The pipeline kanban only allows valid stage transitions per the role's permission level.
+## Core Principles
+1. **Manager**: Full global visibility. Can view, edit, reassign, approve, and delete (in specific settings contexts) any record across the entire organization.
+2. **Team Lead**: Departmental visibility. Can view and edit records assigned to themselves, records assigned to their team members, or records specifically linked to their team's pipeline.
+3. **Employee**: Isolated visibility. Can only view and edit records assigned explicitly to them, created by them, or linked to deals they own.
+4. **No Deletion**: Employees and Team Leads generally cannot delete records, only mark them as cancelled/lost. Managers hold override and destructive powers.
+5. **Contacts Exception**: The Contacts module acts as a global Rolodex. All users can view all Contacts to prevent data duplication.
 
 ---
 
-## 5. Permission Check Functions
-
-The application will implement these core permission checks:
-
-```
-canViewPage(page, role)           ΓåÆ Is this page visible to this role?
-canViewRecord(record, user)       ΓåÆ Can this user see this record?
-canEditRecord(record, user)       ΓåÆ Can this user edit this record?
-canDeleteRecord(record, user)     ΓåÆ Can this user delete this record?
-canAssign(user)                   ΓåÆ Can this user assign work?
-canAssignTo(targetUser, user)     ΓåÆ Can this user assign to that target?
-canMoveStage(deal, toStage, user) ΓåÆ Can this user move this deal to that stage?
-canOverrideStage(user)            ΓåÆ Can this user jump/revert stages?
-canApprove(user)                  ΓåÆ Can this user approve actions?
-canViewReports(user)              ΓåÆ Can this user access reports?
-canManageTeam(teamId, user)       ΓåÆ Can this user manage this team?
-```
+## Access by Module
+
+### 1. Dashboard (`#/dashboard`)
+- **Manager**: Sees aggregate KPIs and Hygiene alerts across the entire organization.
+- **Team Lead**: Sees KPIs and alerts restricted to their Team's data.
+- **Employee**: Sees KPIs and alerts restricted to their personal assignments.
+
+### 2. Pipeline (`#/pipeline`) & Deals (`#/deals`)
+- **Manager**: View/Edit all Deals. Can override locked stages.
+- **Team Lead**: View/Edit Deals assigned to their team members, or Deals explicitly marked with their `teamId`.
+- **Employee**: View/Edit Deals explicitly assigned to them.
+- *Note: Only Managers and Team Leads can reassign a Deal's ownership.*
+
+### 3. Leads (`#/leads`)
+- **Manager**: View/Edit all Leads.
+- **Team Lead**: View/Edit Leads assigned to their team, plus Unassigned Leads to claim them.
+- **Employee**: View/Edit Leads assigned to them, or created/owned through allowed flow.
+
+### 4. Contacts (`#/contacts`)
+- **All Roles**: View all Contacts globally. Edit access is generally open to allow collaborative updating of client details.
+
+### 5. Activities & Follow-ups (`#/activities`)
+- **Manager**: View/Edit all Activities.
+- **Team Lead**: View/Edit Activities assigned to their team, or tied to Deals/Leads their team owns.
+- **Employee**: View/Edit Activities explicitly assigned to them, created by them, or tied to records they own.
+
+### 6. Requirements (`#/requirements`)
+- **Manager**: View/Edit all Requirements.
+- **Team Lead**: View/Edit Requirements assigned to their team, or tied to Deals their team owns.
+- **Employee**: View/Edit Requirements assigned to them, or tied to Deals they own.
+
+### 7. Proposals & Quotations (`#/proposals`)
+- **Manager**: View/Edit all Proposals. **Exclusive power to Approve/Reject** proposals that are pending review.
+- **Team Lead**: View/Edit Proposals tied to their team. Cannot approve their own proposals.
+- **Employee**: View/Edit Proposals they created or tied to Deals they own. Cannot approve.
+
+### 8. Project Handoff (`#/handoffs`)
+- **Manager**: View/Edit all Handoffs.
+- **Team Lead**: View/Edit Handoffs tied to their team's Deals, or Requirements their team evaluated.
+- **Employee**: View/Edit Handoffs tied to their Deals.
+
+### 9. Billing & Renewals (`#/billing`)
+- **Manager**: View/Edit all Billings. Can confirm payment-status overrides when financial values do not automatically match the selected status.
+- **Team Lead**: View/Edit Billings tied to their team's Deals.
+- **Employee**: View/Edit Billings tied to Deals they own.
+
+### 10. CRM Hygiene (`#/hygiene`)
+- **Manager**: View all data quality issues globally. Can use 1-click reassignment.
+- **Team Lead**: View data issues strictly within their team's records.
+- **Employee**: View data issues on their personal records to resolve them.
+
+### 11. Reports (`#/reports`)
+- **Manager**: Full access to all forecast, conversion, and activity analytics.
+- **Team Lead**: No Access (Module hidden).
+- **Employee**: No Access (Module hidden).
+
+### 12. Team Management (`#/team`)
+- **Manager**: View all Users/Teams. Can reassign any record across the company.
+- **Team Lead**: View their own team members. Can reassign records between their own team members.
+- **Employee**: No Access (Module hidden).
+
+### 13. Global Search (Topbar)
+- **All Roles**: Search results strictly respect the Read permissions outlined above. (e.g., An Employee searching for a Deal will only see results for Deals they own).
+
+### 14. Settings (`#/settings`)
+- **All Roles**: Can view session details and update local preferences (e.g., Compact Tables).
+- **Manager Only**: Can trigger JSON/CSV Data Exports, JSON Data Imports, and perform destructive "Reset Demo Data" actions.
```

## Tests Run
```text
Documentation/source review performed: git diff --check clean; reviewed docs for stale phase language, unbuilt AI/RAG/integration claims, role access accuracy, module file paths, and LocalStorage MVP limitations
```

## Risks / Pending Checks
- Review whether all changed files match the requested task.
- Confirm role access rules are not broken.
- Confirm AI/RAG/integrations/call recording were not added in this phase.

## Rollback Command
```bash
git restore --staged .
git restore .
git clean -fd
```
