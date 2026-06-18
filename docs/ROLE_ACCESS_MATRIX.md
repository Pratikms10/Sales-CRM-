# TechnoEdge CRM — Role Access Matrix

TechnoEdge CRM enforces strict Role-Based Access Control (RBAC) across all modules to ensure data privacy and operational integrity.

## Core Principles
1. **Manager**: Full global visibility. Can view, edit, reassign, approve, and delete (in specific settings contexts) any record across the entire organization.
2. **Team Lead**: Departmental visibility. Can view and edit records assigned to themselves, records assigned to their team members, or records specifically linked to their team's pipeline.
3. **Employee**: Isolated visibility. Can only view and edit records assigned explicitly to them, created by them, or linked to deals they own.
4. **No Deletion**: Employees and Team Leads generally cannot delete records, only mark them as cancelled/lost. Managers hold override and destructive powers.
5. **Contacts Exception**: The Contacts module acts as a global Rolodex. All users can view all Contacts to prevent data duplication.

---

## Access by Module

### 1. Dashboard (`#/dashboard`)
- **Manager**: Sees aggregate KPIs and Hygiene alerts across the entire organization.
- **Team Lead**: Sees KPIs and alerts restricted to their Team's data.
- **Employee**: Sees KPIs and alerts restricted to their personal assignments.

### 2. Pipeline (`#/pipeline`) & Deals (`#/deals`)
- **Manager**: View/Edit all Deals. Can override locked stages.
- **Team Lead**: View/Edit Deals assigned to their team members, or Deals explicitly marked with their `teamId`.
- **Employee**: View/Edit Deals explicitly assigned to them.
- *Note: Only Managers and Team Leads can reassign a Deal's ownership.*

### 3. Leads (`#/leads`)
- **Manager**: View/Edit all Leads.
- **Team Lead**: View/Edit Leads assigned to their team, plus Unassigned Leads to claim them.
- **Employee**: View/Edit Leads assigned to them, or created/owned through allowed flow.

### 4. Contacts (`#/contacts`)
- **All Roles**: View all Contacts globally. Edit access is generally open to allow collaborative updating of client details.

### 5. Activities & Follow-ups (`#/activities`)
- **Manager**: View/Edit all Activities.
- **Team Lead**: View/Edit Activities assigned to their team, or tied to Deals/Leads their team owns.
- **Employee**: View/Edit Activities explicitly assigned to them, created by them, or tied to records they own.

### 6. Requirements (`#/requirements`)
- **Manager**: View/Edit all Requirements.
- **Team Lead**: View/Edit Requirements assigned to their team, or tied to Deals their team owns.
- **Employee**: View/Edit Requirements assigned to them, or tied to Deals they own.

### 7. Proposals & Quotations (`#/proposals`)
- **Manager**: View/Edit all Proposals. **Exclusive power to Approve/Reject** proposals that are pending review.
- **Team Lead**: View/Edit Proposals tied to their team. Cannot approve their own proposals.
- **Employee**: View/Edit Proposals they created or tied to Deals they own. Cannot approve.

### 8. Project Handoff (`#/handoffs`)
- **Manager**: View/Edit all Handoffs.
- **Team Lead**: View/Edit Handoffs tied to their team's Deals, or Requirements their team evaluated.
- **Employee**: View/Edit Handoffs tied to their Deals.

### 9. Billing & Renewals (`#/billing`)
- **Manager**: View/Edit all Billings. Can confirm payment-status overrides when financial values do not automatically match the selected status.
- **Team Lead**: View/Edit Billings tied to their team's Deals.
- **Employee**: View/Edit Billings tied to Deals they own.

### 10. CRM Hygiene (`#/hygiene`)
- **Manager**: View all data quality issues globally. Can use 1-click reassignment.
- **Team Lead**: View data issues strictly within their team's records.
- **Employee**: View data issues on their personal records to resolve them.

### 11. Reports (`#/reports`)
- **Manager**: Full access to all forecast, conversion, and activity analytics.
- **Team Lead**: No Access (Module hidden).
- **Employee**: No Access (Module hidden).

### 12. Team Management (`#/team`)
- **Manager**: View all Users/Teams. Can reassign any record across the company.
- **Team Lead**: View their own team members. Can reassign records between their own team members.
- **Employee**: No Access (Module hidden).

### 13. Global Search (Topbar)
- **All Roles**: Search results strictly respect the Read permissions outlined above. (e.g., An Employee searching for a Deal will only see results for Deals they own).

### 14. Settings (`#/settings`)
- **All Roles**: Can view session details and update local preferences (e.g., Compact Tables).
- **Manager Only**: Can trigger JSON/CSV Data Exports, JSON Data Imports, and perform destructive "Reset Demo Data" actions.
