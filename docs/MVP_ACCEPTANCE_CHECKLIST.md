# TechnoEdge CRM — MVP Acceptance Checklist

This checklist provides a framework for manual Quality Assurance (QA) to ensure all Phase 2 MVP requirements are functioning correctly within the browser environment.

## 1. Authentication & Role Scoping
- [ ] **Role Login**: Verify logging in as Manager, Team Lead, and Employee correctly scopes the visible data on the Dashboard.
- [ ] **Navigation Visibility**: Ensure Employees and Team Leads cannot see the `#/reports` link in the sidebar.
- [ ] **Data Boundaries**: Verify Team Leads can only see their team's Deals/Leads, and Employees can only see their specific assignments.

## 2. Core CRM Flows
- [ ] **Lead Conversion**: Create a Lead, fill in required fields, click "Convert to Deal", and ensure the new Deal appears in the Pipeline.
- [ ] **Pipeline Movement**: Use the available stage controls to move a Deal from `Lead/Sourcing` to `Requirement` in the Pipeline Kanban view.
- [ ] **Deal Detail Progression**: Open a Deal, complete all mandatory SOP checklist items, and advance the stage. Ensure stages strictly lock if requirements are missing.

## 3. Module Operations
- [ ] **Activities**: Create a future-dated Follow-up on a Deal. Verify it appears on the Dashboard's open tasks and the Deal's timeline.
- [ ] **Requirements**: Attach a technical Requirement scoping doc to a Deal.
- [ ] **Proposals (Approval)**: Submit a Proposal as an Employee. Switch to a Manager account and Verify the "Approve" and "Reject" actions function correctly.
- [ ] **Project Handoff**: Create a Handoff instruction set from a Won Deal. Verify the delivery target dates save correctly.
- [ ] **Billing & Renewals**: Log a partial payment on a Billing record. Ensure the balance correctly calculates. Log full payment to flip status to Paid.

## 4. CRM Hygiene & Search
- [ ] **Hygiene Dashboard**: View `#/hygiene` as a Manager. Click a "Fix" action to safely route to the offending record.
- [ ] **Global Search**: Press `/` from anywhere. Type a Deal name and verify it appears with the correct entity badge. Test `Arrow` key navigation and `Enter` to route.

## 5. UI & Responsive Shell
- [ ] **Mobile Drawer**: Resize the browser below `744px`. Verify the topbar hamburger menu cleanly opens the sidebar over a dark translucent backdrop.
- [ ] **Compact Tables**: Go to `#/settings`, check "Compact Tables", and verify that all data tables (e.g. `#/deals`) immediately shrink their padding.
- [ ] **Responsive Forms/Modals**: Open a "Create Deal" modal on mobile width to ensure the footer buttons wrap cleanly and the body scrolls internally.

## 6. Settings & Data Management
- [ ] **Export**: As a Manager, click "Export Full JSON". Verify a `.json` file downloads.
- [ ] **Import**: As a Manager, import a valid JSON file. Verify data is successfully hydrated across all modules.
- [ ] **Reset**: As a Manager, click "Reset Demo Data". Verify the system logs you out and seeds the baseline database.
