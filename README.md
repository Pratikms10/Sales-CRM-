# TechnoEdge CRM

A modern, SOP-driven Sales CRM built with vanilla HTML, CSS, and JavaScript.  
Designed with the Airbnb-inspired design system. No frameworks. No dependencies.

---

## Project Status

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 0 | Project Foundation & Documentation | 🟢 Current |
| Phase 1 | Core CRM UI & SOP Pipeline | ⬜ Planned |
| Phase 2 | Advanced Features & Polish | ⬜ Planned |
| Phase 3 | AI, RAG, Integrations | ⬜ Future |

---

## What Is TechnoEdge CRM?

TechnoEdge CRM is a role-based sales management system that enforces a standard operating procedure (SOP) across every deal's lifecycle:

```
Sales → Requirement → Sourcing → Delivery → Feedback → Invoice/Payment → Renewal
```

Every deal must progress through these stages in order. The system enforces who can do what based on three roles.

---

## Roles

| Role | Access Level |
|------|-------------|
| **Manager** | Full access — all data, all teams, approvals, overrides, reports |
| **Team Lead** | Team-level access — own team's data, assignment, review, escalation |
| **Employee** | Personal access — assigned work only, no approvals or global visibility |

See [docs/ROLE_ACCESS_MATRIX.md](docs/ROLE_ACCESS_MATRIX.md) for the full permission breakdown.

---

## Tech Stack

- **HTML5** — Semantic markup, single-page app shell
- **Vanilla CSS** — Design tokens from DESIGN.md as CSS custom properties
- **Vanilla JavaScript** — ES6 modules, hash-based SPA routing
- **LocalStorage** — Browser-local data persistence (Phase 1)
- **Inter** — Google Font (open-source substitute for Airbnb Cereal VF)

No React. No Vue. No Tailwind. No npm. Just clean, standards-based web code.

---

## Project Structure

```
Sales CRM/
├── index.html              → App shell (Phase 1)
├── DESIGN.md               → Lifetime design system reference
├── README.md               → This file
├── generate-audit.ps1      → Git diff audit script
│
├── css/                    → Stylesheets (Phase 1)
│   ├── variables.css       → Design tokens
│   ├── base.css            → Reset, fonts, globals
│   ├── layout.css          → Sidebar, topbar, grid
│   └── components.css      → Buttons, cards, tables, modals
│
├── js/                     → Application logic (Phase 1)
│   ├── app.js              → Entry point
│   ├── router.js           → Hash-based routing
│   ├── auth.js             → Login, role checks
│   ├── store.js            → LocalStorage data layer
│   ├── seed.js             → Demo data
│   ├── utils.js            → Helpers
│   ├── components/         → Reusable UI components
│   └── pages/              → Page modules
│
├── docs/                   → Project documentation
│   ├── CRM_ARCHITECTURE.md → System architecture
│   ├── ROLE_ACCESS_MATRIX.md → Permission matrix
│   └── PHASE_PLAN.md       → Phased delivery roadmap
│
└── audits/                 → AI change audit reports
    └── .gitkeep
```

---

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge)
- A local HTTP server (Phase 1 onward)
- Git for version control
- PowerShell (for audit script on Windows)

### Development Workflow

**Before making changes:**
```powershell
git status
git add .
git commit -m "Baseline before changes"
```

**After making changes:**
```powershell
git status
powershell -ExecutionPolicy Bypass -File .\generate-audit.ps1 -TaskSummary "Description of task" -TestsRun "Tests performed"
```

**Review, then commit:**
```powershell
git diff
git add .
git commit -m "Descriptive commit message"
git push
```

---

## Documentation

| Document | Purpose |
|----------|---------|
| [DESIGN.md](DESIGN.md) | Lifetime design system reference (colors, typography, spacing, components) |
| [CRM_ARCHITECTURE.md](docs/CRM_ARCHITECTURE.md) | System architecture and data model |
| [ROLE_ACCESS_MATRIX.md](docs/ROLE_ACCESS_MATRIX.md) | Complete role-based access control matrix |
| [PHASE_PLAN.md](docs/PHASE_PLAN.md) | Phased delivery roadmap |

---

## License

Internal project. Not for public distribution.
