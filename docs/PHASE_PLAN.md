# TechnoEdge CRM — Phased Delivery Plan

> This document outlines the complete delivery roadmap for TechnoEdge CRM.  
> Each phase builds on the previous one. Phases 0–2 cover the basic CRM. Phase 3+ covers advanced features.

---

## Phase Summary

```
Phase 0 ──▶ Phase 1 ──▶ Phase 2 ──▶ Phase 3+
Foundation   Core CRM    Polish &    AI, RAG,
& Docs       & SOP       Advanced    Integrations
             Pipeline    Features
```

| Phase | Name | Status | Focus |
|-------|------|--------|-------|
| **0** | Foundation & Documentation | 🟢 Current | Project setup, docs, design system, audit workflow |
| **1** | Core CRM & SOP Pipeline | ⬜ Next | Login, dashboard, pipeline kanban, leads, contacts, deals, RBAC |
| **2** | Advanced Features & Polish | ⬜ Planned | Drag-drop, bulk ops, export, notifications, mobile responsive |
| **3** | AI & Intelligent Features | ⬜ Future | AI assistant, smart suggestions, auto-prioritization |
| **4** | RAG & Knowledge Base | ⬜ Future | Document search, sales playbooks, knowledge retrieval |
| **5** | Integrations | ⬜ Future | Email, calendar, CRM sync, webhooks |
| **6** | Call Recording & Analysis | ⬜ Future | Call recording, transcription, sentiment analysis |

---

## Phase 0 — Foundation & Documentation

**Goal:** Establish project structure, design system reference, documentation, and development workflow.

### Deliverables

- [x] `README.md` — Project overview, structure, getting started
- [x] `DESIGN.md` — Lifetime design system reference (Airbnb-inspired)
- [x] `docs/CRM_ARCHITECTURE.md` — System architecture, data model, routing
- [x] `docs/ROLE_ACCESS_MATRIX.md` — Complete RBAC permission matrix
- [x] `docs/PHASE_PLAN.md` — This roadmap document
- [x] `audits/` folder — Directory for AI change audit reports
- [x] `generate-audit.ps1` — PowerShell audit script using Git diff

### Not Included
- No UI code
- No JavaScript logic
- No CSS files
- No `index.html`

---

## Phase 1 — Core CRM & SOP Pipeline

**Goal:** Build the complete, functional CRM with all core features, SOP pipeline, and role-based access control.

### Deliverables

#### Design System (CSS)
- [ ] `css/variables.css` — All DESIGN.md tokens as CSS custom properties
- [ ] `css/base.css` — Reset, Inter font loading, global styles
- [ ] `css/layout.css` — Sidebar, topbar, content area layout
- [ ] `css/components.css` — All reusable component styles

#### Core JavaScript
- [ ] `js/app.js` — Application entry point and bootstrap
- [ ] `js/router.js` — Hash-based SPA routing with role guards
- [ ] `js/auth.js` — Login/logout, role permission checks
- [ ] `js/store.js` — LocalStorage data layer with CRUD operations
- [ ] `js/seed.js` — Demo data seeder (7 users, leads, deals, contacts)
- [ ] `js/utils.js` — Formatters, date helpers, ID generators

#### Reusable Components
- [ ] `js/components/sidebar.js` — Navigation sidebar with role-based menu
- [ ] `js/components/topbar.js` — Top bar with breadcrumbs, search, user profile
- [ ] `js/components/modal.js` — Modal dialog system
- [ ] `js/components/table.js` — Data table with sort, filter, pagination
- [ ] `js/components/toast.js` — Toast notification system
- [ ] `js/components/forms.js` — Form builder with validation

#### Pages
- [ ] `js/pages/login.js` — User picker login (no passwords)
- [ ] `js/pages/dashboard.js` — Role-aware dashboard with stats and activity feed
- [ ] `js/pages/pipeline.js` — SOP kanban board (7 columns)
- [ ] `js/pages/leads.js` — Lead management with table view
- [ ] `js/pages/contacts.js` — Contact directory
- [ ] `js/pages/deals.js` — Deal list and management
- [ ] `js/pages/deal-detail.js` — Single deal with SOP stage progress
- [ ] `js/pages/team.js` — Team management (Manager/TL only)
- [ ] `js/pages/reports.js` — Reports and analytics (Manager only)
- [ ] `js/pages/settings.js` — App settings and data management

#### Entry Point
- [ ] `index.html` — HTML5 SPA shell

---

## Phase 2 — Advanced Features & Polish

**Goal:** Enhance the core CRM with advanced UI features, mobile responsiveness, and data management.

### Planned Features

- [ ] **Drag-and-drop pipeline** — Drag deal cards between kanban columns
- [ ] **Bulk operations** — Multi-select leads/deals for bulk assign, delete, stage change
- [ ] **Data export** — Export leads, deals, contacts as CSV/JSON
- [ ] **Data import** — Import leads from CSV
- [ ] **Advanced filters** — Multi-criteria filtering with saved filter presets
- [ ] **Notification center** — In-app notifications for assignments, stage changes, mentions
- [ ] **Mobile responsive** — Full responsive layout per DESIGN.md breakpoints
- [ ] **Sidebar collapse** — Collapsible sidebar with icon-only mode
- [ ] **Keyboard shortcuts** — Common actions via keyboard (N for new, E for edit, etc.)
- [ ] **Print-friendly views** — Printable deal summaries and reports
- [ ] **Dark mode** — Optional dark color scheme
- [ ] **Activity charts** — Visual charts for activity trends (CSS-only)
- [ ] **Deal timeline** — Visual timeline view of deal progression through SOP stages

---

## Phase 3 — AI & Intelligent Features

> ⚠️ **Not in basic CRM scope.** This phase will be planned separately.

**Goal:** Add AI-powered features to enhance sales productivity.

### Planned Features

- [ ] **AI Sales Assistant** — Conversational AI for sales guidance
- [ ] **Smart Lead Scoring** — AI-powered lead prioritization
- [ ] **Deal Risk Prediction** — Predict deal outcomes based on pipeline behavior
- [ ] **Auto-Suggestions** — Suggest next actions based on deal stage and history
- [ ] **Email Drafting** — AI-generated email templates for each SOP stage
- [ ] **Meeting Summary** — Auto-generate meeting notes from descriptions

### Technical Requirements
- LLM integration (API-based)
- Prompt engineering for sales context
- Async processing for AI responses

---

## Phase 4 — RAG & Knowledge Base

> ⚠️ **Not in basic CRM scope.** This phase will be planned separately.

**Goal:** Build a retrieval-augmented generation (RAG) system for sales knowledge.

### Planned Features

- [ ] **Document Upload** — Upload sales playbooks, product docs, case studies
- [ ] **Semantic Search** — Natural language search across all documents
- [ ] **Context-Aware Answers** — AI answers grounded in company documents
- [ ] **Sales Playbook Suggestions** — Auto-suggest relevant playbook sections based on deal stage
- [ ] **Competitive Intelligence** — Searchable competitive analysis database

### Technical Requirements
- Vector database (e.g., ChromaDB, Pinecone)
- Document parsing (PDF, DOCX, TXT)
- Embedding model integration
- Chunking and indexing pipeline

---

## Phase 5 — Integrations

> ⚠️ **Not in basic CRM scope.** This phase will be planned separately.

**Goal:** Connect TechnoEdge CRM with external tools and services.

### Planned Integrations

- [ ] **Email Integration** — Gmail/Outlook sync for activity logging
- [ ] **Calendar Integration** — Google Calendar/Outlook for meeting scheduling
- [ ] **Communication** — WhatsApp Business API, Slack notifications
- [ ] **Accounting** — Tally/QuickBooks for invoice sync
- [ ] **CRM Sync** — Import/export with Salesforce, HubSpot
- [ ] **Webhooks** — Outbound webhooks for custom automation
- [ ] **REST API** — Public API for third-party integrations

### Technical Requirements
- Node.js/Express backend (replaces LocalStorage)
- OAuth2 for third-party auth
- Webhook queue system
- API rate limiting

---

## Phase 6 — Call Recording & Analysis

> ⚠️ **Not in basic CRM scope.** This phase will be planned separately.

**Goal:** Record, transcribe, and analyze sales calls within the CRM.

### Planned Features

- [ ] **Call Recording** — Browser-based call recording (WebRTC)
- [ ] **Transcription** — Speech-to-text transcription of recorded calls
- [ ] **Sentiment Analysis** — AI analysis of call tone and customer sentiment
- [ ] **Key Moment Detection** — Auto-highlight objections, commitments, action items
- [ ] **Call Library** — Searchable library of all recorded calls linked to deals
- [ ] **Coaching Insights** — AI-powered coaching suggestions for sales reps

### Technical Requirements
- WebRTC media capture
- Speech-to-text API (Whisper, Google Speech)
- Audio storage (cloud-based)
- Real-time streaming for live analysis

---

## Development Rules (All Phases)

1. **Follow DESIGN.md** — All UI must adhere to the lifetime design system reference
2. **Three roles only** — Manager, Team Lead, Employee (no additional roles)
3. **SOP enforcement** — Every deal follows Sales → Requirement → Sourcing → Delivery → Feedback → Invoice/Payment → Renewal
4. **No auto-commits** — All changes reviewed via audit report before committing
5. **Audit trail** — Run `generate-audit.ps1` after every coding session
6. **Incremental delivery** — Each phase is independently functional
7. **No scope creep** — Features belong to the phase they're listed in
