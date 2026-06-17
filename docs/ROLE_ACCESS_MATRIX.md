# TechnoEdge CRM — Role-Based Access Control Matrix

> This document defines the complete permission model for TechnoEdge CRM.  
> Only three roles exist: **Manager**, **Team Lead**, **Employee**.

---

## 1. Role Definitions

### Manager
The **Manager** has **full organizational access**. They can see all data across all teams, approve or reject deal stage transitions, override pipeline stages, view reports, and manage all users and teams.

- **Scope:** Entire organization
- **Key powers:** Approvals, overrides, reports, user management

### Team Lead
The **Team Lead** has **team-level access**. They can see their own team's data plus unassigned items. They can assign work to their team members, review their team's progress, and escalate issues to the Manager.

- **Scope:** Own team + unassigned
- **Key powers:** Assignment, review, escalation

### Employee
The **Employee** has **personal-level access**. They can only see and work on items assigned to them. They cannot approve, assign to others, or view organizational reports.

- **Scope:** Personally assigned items only
- **Key powers:** Execute assigned work, log activities, request approvals

---

## 2. Feature Access Matrix

### Navigation & Pages

| Page | Manager | Team Lead | Employee |
|------|:-------:|:---------:|:--------:|
| Dashboard | ✅ Full org | ✅ Team scope | ✅ Personal scope |
| Pipeline (Kanban) | ✅ All deals | ✅ Team deals | ✅ Own deals |
| Leads | ✅ All | ✅ Team + unassigned | ✅ Own assigned |
| Contacts | ✅ All | ✅ All | ✅ All |
| Deals | ✅ All | ✅ Team deals | ✅ Own deals |
| Team Management | ✅ All teams | ✅ Own team | ❌ Hidden |
| Reports & Analytics | ✅ Full reports | ❌ Hidden | ❌ Hidden |
| Settings | ✅ Full | ✅ Limited | ✅ Limited |

---

### Lead Operations

| Action | Manager | Team Lead | Employee |
|--------|:-------:|:---------:|:--------:|
| View all leads | ✅ | ❌ Team only | ❌ Own only |
| View team leads | ✅ | ✅ | ❌ |
| View own assigned leads | ✅ | ✅ | ✅ |
| Create new lead | ✅ | ✅ | ✅ |
| Edit any lead | ✅ | ❌ Team only | ❌ Own only |
| Delete lead | ✅ | ❌ | ❌ |
| Assign lead to anyone | ✅ | ❌ | ❌ |
| Assign lead to team member | ✅ | ✅ | ❌ |
| Reassign lead | ✅ | ✅ (within team) | ❌ |
| Convert lead to deal | ✅ | ✅ | ⚠️ Request only |
| Change lead status | ✅ | ✅ | ✅ (own leads) |
| Bulk assign leads | ✅ | ✅ (own team) | ❌ |

---

### Deal Operations

| Action | Manager | Team Lead | Employee |
|--------|:-------:|:---------:|:--------:|
| View all deals | ✅ | ❌ Team only | ❌ Own only |
| View team deals | ✅ | ✅ | ❌ |
| View own assigned deals | ✅ | ✅ | ✅ |
| Create new deal | ✅ | ✅ | ✅ |
| Edit deal details | ✅ | ✅ (team deals) | ✅ (own deals) |
| Delete deal | ✅ | ❌ | ❌ |
| Move deal to next stage | ✅ | ✅ | ✅ (own deals) |
| Move deal to any stage (override) | ✅ | ❌ | ❌ |
| Move deal backward | ✅ | ❌ | ❌ |
| Close deal (won) | ✅ | ✅ | ⚠️ Request only |
| Close deal (lost) | ✅ | ✅ | ✅ (own deals) |
| Assign deal to anyone | ✅ | ❌ | ❌ |
| Assign deal to team member | ✅ | ✅ | ❌ |
| Set deal priority | ✅ | ✅ | ❌ |

---

### Deal Pipeline (SOP Stages)

| Stage Action | Manager | Team Lead | Employee |
|-------------|:-------:|:---------:|:--------:|
| Sales → Requirement | ✅ | ✅ | ✅ |
| Requirement → Sourcing | ✅ | ✅ | ✅ |
| Sourcing → Delivery | ✅ | ✅ | ✅ |
| Delivery → Feedback | ✅ | ✅ | ✅ |
| Feedback → Invoice/Payment | ✅ | ✅ | ✅ |
| Invoice/Payment → Renewal | ✅ | ✅ | ✅ |
| Skip stages (jump forward) | ✅ | ❌ | ❌ |
| Revert stages (move back) | ✅ | ❌ | ❌ |
| Override stage to any | ✅ | ❌ | ❌ |

> **Rule:** Employees and Team Leads can only advance deals **one stage at a time** in the forward direction. Only Managers can skip or revert stages.

---

### Contact Operations

| Action | Manager | Team Lead | Employee |
|--------|:-------:|:---------:|:--------:|
| View all contacts | ✅ | ✅ | ✅ |
| Create contact | ✅ | ✅ | ✅ |
| Edit contact | ✅ | ✅ | ✅ |
| Delete contact | ✅ | ❌ | ❌ |

> **Note:** Contacts are shared globally — all roles can view all contacts. This supports cross-team collaboration.

---

### Activity Logging

| Action | Manager | Team Lead | Employee |
|--------|:-------:|:---------:|:--------:|
| Log call | ✅ | ✅ | ✅ (own deals) |
| Log email | ✅ | ✅ | ✅ (own deals) |
| Log meeting | ✅ | ✅ | ✅ (own deals) |
| Add note | ✅ | ✅ | ✅ (own deals) |
| View all activities | ✅ | ✅ (team) | ✅ (own) |
| Delete activity | ✅ | ❌ | ❌ |

---

### Team Management

| Action | Manager | Team Lead | Employee |
|--------|:-------:|:---------:|:--------:|
| View all teams | ✅ | ❌ | ❌ |
| View own team | ✅ | ✅ | ❌ |
| View team member stats | ✅ | ✅ (own team) | ❌ |
| Reassign within team | ✅ | ✅ | ❌ |
| Reassign across teams | ✅ | ❌ | ❌ |

---

### Reports & Analytics

| Report | Manager | Team Lead | Employee |
|--------|:-------:|:---------:|:--------:|
| Pipeline summary (all) | ✅ | ❌ | ❌ |
| Conversion funnel | ✅ | ❌ | ❌ |
| Team performance comparison | ✅ | ❌ | ❌ |
| Employee leaderboard | ✅ | ❌ | ❌ |
| Stage duration analysis | ✅ | ❌ | ❌ |
| Revenue reports | ✅ | ❌ | ❌ |

---

## 3. Data Visibility Scoping

### How data is filtered by role

```
Manager sees:     ALL records in the system
Team Lead sees:   Records WHERE teamId = myTeamId OR assignedTo IS NULL
Employee sees:    Records WHERE assignedTo = myUserId
```

### Dashboard Metrics Scoping

| Metric | Manager | Team Lead | Employee |
|--------|---------|-----------|----------|
| Total Revenue | All deals | Team deals | Own deals |
| Active Deals | All | Team | Own |
| Conversion Rate | Org-wide | Team | Personal |
| Pipeline Value | All stages | Team stages | Own stages |
| Recent Activity | All | Team | Own |

---

## 4. UI Enforcement Rules

1. **Hidden elements:** If a role cannot access a feature, the navigation link and UI element are **hidden** (not just disabled).
2. **Disabled elements:** If a role can see but not act on something (e.g., Employee sees deal priority but can't change it), the control is **visible but disabled** with a tooltip explaining why.
3. **Filtered data:** Tables and lists are **pre-filtered** by role scope — an Employee never sees data from other teams, even in search results.
4. **Action buttons:** Create/Edit/Delete/Assign buttons only render if the role has permission.
5. **Stage controls:** The pipeline kanban only allows valid stage transitions per the role's permission level.

---

## 5. Permission Check Functions

The application will implement these core permission checks:

```
canViewPage(page, role)           → Is this page visible to this role?
canViewRecord(record, user)       → Can this user see this record?
canEditRecord(record, user)       → Can this user edit this record?
canDeleteRecord(record, user)     → Can this user delete this record?
canAssign(user)                   → Can this user assign work?
canAssignTo(targetUser, user)     → Can this user assign to that target?
canMoveStage(deal, toStage, user) → Can this user move this deal to that stage?
canOverrideStage(user)            → Can this user jump/revert stages?
canApprove(user)                  → Can this user approve actions?
canViewReports(user)              → Can this user access reports?
canManageTeam(teamId, user)       → Can this user manage this team?
```
