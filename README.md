# TechnoEdge CRM

A robust, role-scoped, browser-local Customer Relationship Management (CRM) SPA designed for comprehensive sales pipeline execution, from initial lead sourcing through quotation, project handoff, and billing.

## Current Status

**Status:** Phase 2H Documentation Closeout in Progress
*The Phase 2 Basic CRM MVP is complete. The application is a fully functional browser-based SPA utilizing LocalStorage.*

### Modules Implemented
- **Login & Authentication**: Role-scoped (Manager, Team Lead, Employee) demo login.
- **Dashboard**: High-level metrics, open tasks, recent hygiene alerts.
- **Pipeline (Kanban)**: Visual kanban-style deal tracking with guarded stage controls.
- **Leads**: Qualification and conversion tracking.
- **Contacts**: Global Rolodex for clients and stakeholders.
- **Deals**: Core opportunity tracking with detailed stage histories.
- **Activities & Follow-ups**: Next-action assignments with specific deadlines.
- **Requirements**: Technical and business requirement gathering attached to deals.
- **Proposals & Quotations**: Financial modeling with manager approval workflows.
- **Project Handoff**: Delivery scoping and operational handover tracking.
- **Billing & Renewals**: Invoice tracking, payment status, and renewal reminders.
- **CRM Hygiene**: Centralized dashboard to detect unassigned, stale, or incomplete records.
- **Reports**: Manager-only analytical views and forecasting.
- **Team Management**: User management and record reassignment tools.
- **Global Search**: Role-scoped, keyboard-navigable cross-entity search (using `/`).
- **Settings**: JSON/CSV export, data import, demo reset, and user preferences (e.g., Compact Tables).
- **Responsive Shell**: Dynamic layout supporting laptop, tablet, and mobile devices natively.

### Future Scope (Not Yet Included)
- **Phase 3:** AI assistant and smart sales intelligence.
- **Phase 4:** RAG (Retrieval-Augmented Generation) and knowledge base integrations.
- **Phase 5:** External Integrations (Outlook, Teams, Slack).
- **Phase 6:** Call recording, transcription, and conversational analysis.
- **Backend Infrastructure:** A real backend database/API.
- **Real Authentication:** Secure password management, JWTs, and SSO.

## Project Structure

```
.
├── css/
│   ├── base.css           # Resets and typography
│   ├── components.css     # Buttons, cards, modals, grids, tables
│   ├── layout.css         # Shell, topbar, sidebar, overlay
│   └── variables.css      # Design tokens (colors, spacing, fonts)
├── docs/                  # Project documentation (Architecture, Roles, Roadmap)
├── js/
│   ├── components/        # Sidebar, topbar, toast, global search
│   ├── pages/             # Individual module logic (Leads, Deals, Billing, etc.)
│   ├── app.js             # Application bootstrap and routing
│   ├── auth.js            # Mock authentication and role management
│   ├── router.js          # Hash-based SPA routing
│   ├── seed.js            # Initial demo data generation
│   ├── store.js           # Central LocalStorage CRUD and permissions wrapper
│   └── utils.js           # Formatters, ID generators, helpers
├── index.html             # Single entry point
└── README.md              # Project overview
```

## Architecture

This is a **Vanilla JavaScript Single Page Application (SPA)**.
- **No external frameworks** (No React, Vue, or Tailwind).
- **No backend dependencies**; all data persists locally in the user's browser via `LocalStorage`.
- **Hash-based routing** dynamically maps `#/paths` to JavaScript page renderers.

For detailed documentation, review:
- [CRM Architecture](docs/CRM_ARCHITECTURE.md)
- [Role Access Matrix](docs/ROLE_ACCESS_MATRIX.md)
- [Phase Plan](docs/PHASE_PLAN.md)

## Development Workflow

This project was built iteratively using an AI-agent-driven pair programming approach.
1. **Baseline Commit**: Record the starting state.
2. **Antigravity/Codex Execution**: Instruct the agent to build the next module or apply hardening fixes.
3. **Validation**: Run `git diff --check` to ensure code cleanliness.
4. **Audit**: Run `generate-audit.ps1` to log the phase's changes.
5. **Commit**: `git add .`, `git commit -m "..."`, `git push`.
6. **Testing**: Browser preview and manual QA are performed externally by the user.
