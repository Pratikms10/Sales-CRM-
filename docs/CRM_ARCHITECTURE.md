# TechnoEdge CRM — System Architecture

> This document describes the technical architecture of TechnoEdge CRM.  
> Last updated: Phase 0 — Foundation Setup.

---

## 1. Overview

TechnoEdge CRM is a **single-page application (SPA)** built with vanilla HTML, CSS, and JavaScript. It runs entirely in the browser with no server-side dependencies in Phase 1.

### Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | None (vanilla JS) | Simplicity, zero dependencies, full control |
| Styling | Vanilla CSS with custom properties | Design tokens from DESIGN.md map directly to CSS vars |
| Routing | Hash-based (`#/page`) | No server config needed, works with file:// protocol |
| Data | LocalStorage | No backend required for Phase 1; data persists per browser |
| Modules | ES6 modules (`import/export`) | Native browser support, no bundler needed |
| Font | Inter (Google Fonts CDN) | Open-source substitute for Airbnb Cereal VF per DESIGN.md |

---

## 2. Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        index.html                           │
│  ┌──────────┐  ┌──────────────────────────────────────────┐ │
│  │          │  │              Topbar                       │ │
│  │          │  │  Breadcrumb │ Search │ User Profile       │ │
│  │ Sidebar  │  ├──────────────────────────────────────────┤ │
│  │          │  │                                          │ │
│  │  Logo    │  │           Content Area                   │ │
│  │  Nav     │  │                                          │ │
│  │  Links   │  │    (Pages rendered here by Router)       │ │
│  │          │  │                                          │ │
│  │  User    │  │    Dashboard │ Pipeline │ Leads          │ │
│  │  Info    │  │    Contacts  │ Deals   │ Team            │ │
│  │          │  │    Reports   │ Settings                  │ │
│  │          │  │                                          │ │
│  └──────────┘  └──────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Layer Diagram

```
┌─────────────────────────────────────┐
│            Pages Layer              │  ← Page modules render into content area
│  dashboard │ pipeline │ leads │ ... │
├─────────────────────────────────────┤
│         Components Layer            │  ← Reusable UI: tables, modals, forms
│  sidebar │ topbar │ table │ modal   │
├─────────────────────────────────────┤
│          Services Layer             │  ← Business logic and data access
│    auth │ store │ router │ utils    │
├─────────────────────────────────────┤
│         Design System (CSS)         │  ← Tokens, base styles, components
│  variables │ base │ layout │ comps  │
├─────────────────────────────────────┤
│        Browser Platform             │  ← LocalStorage, DOM, History API
└─────────────────────────────────────┘
```

---

## 3. SOP Pipeline Architecture

The CRM enforces a **7-stage standard operating procedure** for every deal:

```
┌──────┐   ┌─────────────┐   ┌──────────┐   ┌──────────┐
│Sales │──▶│ Requirement │──▶│ Sourcing │──▶│ Delivery │
└──────┘   └─────────────┘   └──────────┘   └──────────┘
                                                  │
                                                  ▼
           ┌──────────┐   ┌─────────────────┐   ┌──────────┐
           │ Renewal  │◀──│ Invoice/Payment │◀──│ Feedback │
           └──────────┘   └─────────────────┘   └──────────┘
```

### Stage Definitions

| # | Stage | Purpose | Key Activities |
|---|-------|---------|----------------|
| 1 | **Sales** | Lead qualification, initial contact | Cold outreach, qualification calls, lead scoring |
| 2 | **Requirement** | Needs analysis, requirement gathering | Discovery meetings, requirement documents, scope definition |
| 3 | **Sourcing** | Vendor/product sourcing, proposal | Vendor research, pricing, proposal creation |
| 4 | **Delivery** | Order fulfillment, delivery tracking | Order processing, shipment tracking, delivery confirmation |
| 5 | **Feedback** | Customer satisfaction check | Follow-up calls, satisfaction surveys, issue resolution |
| 6 | **Invoice/Payment** | Billing and payment | Invoice generation, payment tracking, overdue follow-ups |
| 7 | **Renewal** | Contract renewal, upsell | Renewal offers, contract extension, upsell opportunities |

### Stage Transition Rules

- **Default flow:** Stages progress sequentially (1 → 2 → 3 → ... → 7)
- **Employee/Team Lead:** Can only move a deal to the **next** stage
- **Manager:** Can **override** and move a deal to **any** stage (skip forward or move back)
- **Stage changes are logged** as activities with timestamp, user, and optional notes
- A deal can be **closed/lost** from any stage (removes from active pipeline)

---

## 4. Data Model

### Entity Relationship

```
┌──────────┐       ┌──────────┐       ┌──────────┐
│   User   │──────▶│   Team   │◀──────│   User   │
│ (Member) │ many  │          │  1    │  (Lead)  │
└──────────┘       └──────────┘       └──────────┘
     │                   │
     │ assignedTo        │ teamId
     ▼                   ▼
┌──────────┐       ┌──────────┐       ┌──────────┐
│   Lead   │──────▶│   Deal   │◀──────│ Contact  │
│          │ 1:1   │          │  1:1  │          │
└──────────┘       └──────────┘       └──────────┘
                        │
                        │ dealId
                        ▼
                   ┌──────────┐
                   │ Activity │
                   │          │
                   └──────────┘
```

### Entities

#### User
```
{
  id:        string     — Unique identifier
  name:      string     — Full name
  email:     string     — Email address
  role:      enum       — "manager" | "team_lead" | "employee"
  teamId:    string     — Reference to Team (null for Manager)
  avatarColor: string   — Color for avatar circle
  isActive:  boolean    — Account status
}
```

#### Team
```
{
  id:        string     — Unique identifier
  name:      string     — Team name (e.g., "North Sales", "Enterprise Team")
  leadId:    string     — Reference to User (Team Lead)
  memberIds: string[]   — References to Users (Employees)
}
```

#### Lead
```
{
  id:          string   — Unique identifier
  name:        string   — Contact/company name
  company:     string   — Company name
  email:       string   — Email
  phone:       string   — Phone number
  source:      enum     — "website" | "referral" | "cold_call" | "social" | "event" | "other"
  status:      enum     — "new" | "contacted" | "qualified" | "unqualified" | "converted"
  assignedTo:  string   — Reference to User
  createdBy:   string   — Reference to User who created
  createdAt:   string   — ISO timestamp
  updatedAt:   string   — ISO timestamp
  notes:       string   — Free-text notes
}
```

#### Contact
```
{
  id:          string   — Unique identifier
  name:        string   — Full name
  company:     string   — Company name
  email:       string   — Email
  phone:       string   — Phone number
  designation: string   — Job title
  type:        enum     — "client" | "vendor"
  tags:        string[] — Flexible tagging
  createdAt:   string   — ISO timestamp
}
```

#### Deal
```
{
  id:          string   — Unique identifier
  title:       string   — Deal title
  leadId:      string   — Reference to originating Lead
  contactId:   string   — Reference to Contact
  value:       number   — Deal value in base currency
  currency:    string   — Currency code (default: "INR")
  stage:       enum     — "sales" | "requirement" | "sourcing" | "delivery" | "feedback" | "invoice" | "renewal"
  status:      enum     — "active" | "won" | "lost"
  assignedTo:  string   — Reference to User (Employee)
  teamId:      string   — Reference to Team
  priority:    enum     — "low" | "medium" | "high" | "urgent"
  createdAt:   string   — ISO timestamp
  updatedAt:   string   — ISO timestamp
  closedAt:    string   — ISO timestamp (when won/lost)
  notes:       string   — Free-text notes
}
```

#### Activity
```
{
  id:          string   — Unique identifier
  dealId:      string   — Reference to Deal
  type:        enum     — "call" | "email" | "meeting" | "note" | "stage_change" | "assignment"
  content:     string   — Activity description
  fromStage:   string   — Previous stage (for stage_change type)
  toStage:     string   — New stage (for stage_change type)
  createdBy:   string   — Reference to User
  createdAt:   string   — ISO timestamp
}
```

---

## 5. Routing

Hash-based routing with role guards:

| Route | Page | Manager | Team Lead | Employee |
|-------|------|---------|-----------|----------|
| `#/login` | Login | ✅ | ✅ | ✅ |
| `#/dashboard` | Dashboard | ✅ | ✅ | ✅ |
| `#/pipeline` | Pipeline Kanban | ✅ | ✅ | ✅ |
| `#/leads` | Lead List | ✅ | ✅ | ✅ |
| `#/leads/:id` | Lead Detail | ✅ | ✅ | ✅ (own) |
| `#/contacts` | Contact List | ✅ | ✅ | ✅ |
| `#/contacts/:id` | Contact Detail | ✅ | ✅ | ✅ |
| `#/deals` | Deal List | ✅ | ✅ | ✅ |
| `#/deals/:id` | Deal Detail | ✅ | ✅ | ✅ (own) |
| `#/team` | Team Management | ✅ | ✅ (own) | ❌ |
| `#/reports` | Reports | ✅ | ❌ | ❌ |
| `#/settings` | Settings | ✅ | ✅ | ✅ |

---

## 6. State Management

### Data Flow

```
User Action → Page Handler → Store (CRUD) → LocalStorage
                                  ↓
                            Re-render View
```

- **Store** provides role-scoped query methods
- **Pages** subscribe to data changes and re-render
- **No global state object** — each page fetches fresh data from Store on render
- **Optimistic UI** — changes apply immediately, persisted to LocalStorage synchronously

### LocalStorage Keys

| Key | Contents |
|-----|----------|
| `technoedge_users` | User[] |
| `technoedge_teams` | Team[] |
| `technoedge_leads` | Lead[] |
| `technoedge_contacts` | Contact[] |
| `technoedge_deals` | Deal[] |
| `technoedge_activities` | Activity[] |
| `technoedge_session` | Current user session |
| `technoedge_settings` | App preferences |

---

## 7. Security Model (Client-Side)

> **Note:** This is client-side enforcement only. There is no server-side validation in Phase 1. Data is not encrypted at rest.

- **Route guards:** Router checks `auth.canAccess(route)` before rendering
- **Data scoping:** Store queries filter by role before returning results
- **Action guards:** UI disables/hides actions the current role cannot perform
- **Session:** Stored in LocalStorage; cleared on logout

---

## 8. Future Architecture (Phase 3+)

When backend/integrations are added:

```
┌────────────┐     ┌────────────┐     ┌────────────┐
│  Frontend  │────▶│  REST API  │────▶│  Database  │
│  (Current) │     │  (Node.js) │     │ (Postgres) │
└────────────┘     └────────────┘     └────────────┘
                        │
                   ┌────┴────┐
                   │   AI    │
                   │ Service │
                   └─────────┘
```

- LocalStorage → replaced by API calls
- Auth → replaced by JWT/session tokens
- Store → becomes API client layer
- Frontend code remains largely unchanged
