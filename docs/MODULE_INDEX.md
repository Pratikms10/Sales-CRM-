# TechnoEdge CRM — Module Index

This index provides a technical overview of the primary modules that compose the Phase 2 MVP.

| Module | Purpose | Main UI File | Roles | Primary Data Entity |
|---|---|---|---|---|
| **App Shell** | Sidebar, Topbar, Global Search, Layout | `js/app.js` | All | `session`, `users` |
| **Login** | Role/Demo selection | `js/pages/login.js`, `js/auth.js` | All | `session` |
| **Dashboard** | High-level KPIs and urgent open task/hygiene alerts | `js/pages/dashboard.js` | All | All (Aggregated) |
| **Pipeline** | Kanban board for visual Deal progression | `js/pages/pipeline.js` | All | `deals` |
| **Leads** | Qualification and progression of new prospects | `js/pages/leads.js` | All | `leads` |
| **Contacts** | Global stakeholder and client address book | `js/pages/contacts.js` | All | `contacts` |
| **Deals** | List view and detailed stage-execution of opportunities | `js/pages/deals.js`, `js/pages/deal-detail.js` | All | `deals` |
| **Activities** | Future follow-ups, calls, and historical meeting notes | `js/pages/activities.js` | All | `activities` |
| **Requirements** | Scoping docs, tech specs, and implementation details | `js/pages/requirements.js` | All | `requirements` |
| **Proposals** | Financial quotations with manager approval workflows | `js/pages/proposals.js` | All | `proposals` |
| **Project Handoff** | Post-sale instructions for the delivery team | `js/pages/handoffs.js` | All | `handoffs` |
| **Billing** | Tracking invoice amounts, payment status, and renewals | `js/pages/billing.js` | All | `billings` |
| **CRM Hygiene** | Actionable dashboard highlighting stale or incomplete data | `js/pages/hygiene.js` | All | All (Aggregated) |
| **Team Management**| User list and record reassignment tools | `js/pages/team.js` | Manager, Team Lead | `users`, `teams` |
| **Reports** | Analytics, pipeline forecasting, and conversion metrics | `js/pages/reports.js` | Manager | All (Aggregated) |
| **Settings** | JSON/CSV Data export, import, preferences, and reset | `js/pages/settings.js` | All; Manager-only export/import/reset | `settings` |
