# AI Change Audit Report

## Generated On
2026-06-17_19-22-27

## Branch
main

## Baseline Commit
82e8f91

## Task Summary
Phase 2A Activity and Follow-up Management with secure linked-record validation, local follow-up timing, role-scoped activities, dashboard summary, and enhanced deal timeline

## Git Status
```text
 M audits/CHANGE_AUDIT.md
 M css/components.css
 M js/app.js
 M js/auth.js
 M js/components/sidebar.js
 A js/pages/activities.js
 M js/pages/dashboard.js
 M js/pages/deal-detail.js
 M js/router.js
 M js/seed.js
 M js/store.js
```

## Files Changed
```text
M	css/components.css
M	js/app.js
M	js/auth.js
M	js/components/sidebar.js
A	js/pages/activities.js
M	js/pages/dashboard.js
M	js/pages/deal-detail.js
M	js/router.js
M	js/seed.js
M	js/store.js
```

## Change Summary
```text
 css/components.css       |  55 ++++
 js/app.js                |   5 +
 js/auth.js               |   1 +
 js/components/sidebar.js |   1 +
 js/pages/activities.js   | 766 +++++++++++++++++++++++++++++++++++++++++++++++
 js/pages/dashboard.js    |  88 +++++-
 js/pages/deal-detail.js  |  44 ++-
 js/router.js             |   1 +
 js/seed.js               |  25 ++
 js/store.js              |  61 +++-
 10 files changed, 1028 insertions(+), 19 deletions(-)
```

## Full Diff
```diff
diff --git a/css/components.css b/css/components.css
index 0338e6f..f0cc1ee 100644
--- a/css/components.css
+++ b/css/components.css
@@ -1023,3 +1023,58 @@
 .danger-zone {
   border: 1px solid var(--color-error);
 }
+
+/* ΓöÇΓöÇ Activities & Follow-ups ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+.activity-kpi-grid {
+  display: grid;
+  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
+  gap: var(--space-md);
+  margin-bottom: var(--space-lg);
+}
+
+.followup-board {
+  display: grid;
+  grid-template-columns: repeat(3, 1fr);
+  gap: var(--space-md);
+  margin-bottom: var(--space-lg);
+}
+
+.followup-column {
+  background: var(--color-surface);
+  border: 1px solid var(--color-hairline);
+  border-radius: var(--rounded-md);
+  padding: var(--space-md);
+  display: flex;
+  flex-direction: column;
+  gap: var(--space-sm);
+}
+
+.followup-column-header {
+  font-weight: 600;
+  font-size: var(--text-body-sm);
+  margin-bottom: var(--space-xs);
+  display: flex;
+  justify-content: space-between;
+  align-items: center;
+}
+
+.followup-item {
+  background: var(--color-background);
+  border: 1px solid var(--color-hairline-soft);
+  border-radius: var(--rounded-md);
+  padding: var(--space-sm);
+  font-size: var(--text-body-sm);
+  display: flex;
+  flex-direction: column;
+  gap: var(--space-xs);
+}
+
+.followup-item-header {
+  display: flex;
+  justify-content: space-between;
+  align-items: flex-start;
+}
+
+.activity-status-open { color: var(--color-warning); font-weight: 500; }
+.activity-status-completed { color: var(--color-success); font-weight: 500; }
+.activity-status-cancelled { color: var(--color-muted); font-weight: 500; }
diff --git a/js/app.js b/js/app.js
index 45a11b5..bc059ed 100644
--- a/js/app.js
+++ b/js/app.js
@@ -19,6 +19,7 @@ import { renderDeals, bindDealsEvents } from './pages/deals.js';
 import { renderTeam, bindTeamEvents } from './pages/team.js';
 import { renderReports, bindReportsEvents } from './pages/reports.js';
 import { renderSettings, bindSettingsEvents } from './pages/settings.js';
+import { renderActivities, bindActivitiesEvents } from './pages/activities.js';
 
 // ΓöÇΓöÇ DOM References ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
 
@@ -117,6 +118,9 @@ function renderPage(pageId, params) {
     case 'contacts':
       contentEl.innerHTML = renderContacts();
       break;
+    case 'activities':
+      contentEl.innerHTML = renderActivities();
+      break;
     case 'team':
       contentEl.innerHTML = renderTeam();
       break;
@@ -142,6 +146,7 @@ bindDealsEvents();
 bindTeamEvents();
 bindReportsEvents();
 bindSettingsEvents();
+bindActivitiesEvents();
 
 // ΓöÇΓöÇ Bootstrap ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
 
diff --git a/js/auth.js b/js/auth.js
index da17883..36795a1 100644
--- a/js/auth.js
+++ b/js/auth.js
@@ -13,6 +13,7 @@ const NAV_ITEMS = [
   { id: 'leads',     label: 'Leads',      hash: '#/leads',     icon: 'leads',     roles: ['manager', 'team_lead', 'employee'] },
   { id: 'contacts',  label: 'Contacts',   hash: '#/contacts',  icon: 'contacts',  roles: ['manager', 'team_lead', 'employee'] },
   { id: 'deals',     label: 'Deals',      hash: '#/deals',     icon: 'deals',     roles: ['manager', 'team_lead', 'employee'] },
+  { id: 'activities',label: 'Activities', hash: '#/activities',icon: 'activities',roles: ['manager', 'team_lead', 'employee'] },
   { id: 'team',      label: 'Team',       hash: '#/team',      icon: 'team',      roles: ['manager', 'team_lead'] },
   { id: 'reports',   label: 'Reports',    hash: '#/reports',   icon: 'reports',   roles: ['manager'] },
   { id: 'settings',  label: 'Settings',   hash: '#/settings',  icon: 'settings',  roles: ['manager', 'team_lead', 'employee'] }
diff --git a/js/components/sidebar.js b/js/components/sidebar.js
index cb9df9b..9cf86aa 100644
--- a/js/components/sidebar.js
+++ b/js/components/sidebar.js
@@ -13,6 +13,7 @@ const NAV_ICONS = {
   leads:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
   contacts:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
   deals:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>',
+  activities:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>',
   team:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
   reports:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
   settings:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>'
diff --git a/js/pages/activities.js b/js/pages/activities.js
new file mode 100644
index 0000000..e85bb56
--- /dev/null
+++ b/js/pages/activities.js
@@ -0,0 +1,766 @@
+// ============================================================
+// TechnoEdge CRM ΓÇö Activities & Follow-ups Page
+// ============================================================
+
+import { Store } from '../store.js';
+import { Auth } from '../auth.js';
+import { Toast } from '../components/toast.js';
+import { Router } from '../router.js';
+import { generateId, formatDateTime, timeAgo } from '../utils.js';
+
+let filters = {
+  search: '',
+  type: 'all',
+  status: 'all',
+  timing: 'all',
+  owner: 'all'
+};
+
+const ACTIVITY_TYPES = [
+  { key: 'call', label: 'Call' },
+  { key: 'email', label: 'Email' },
+  { key: 'meeting', label: 'Meeting' },
+  { key: 'whatsapp', label: 'WhatsApp' },
+  { key: 'linkedin', label: 'LinkedIn' },
+  { key: 'note', label: 'Note' },
+  { key: 'follow_up', label: 'Follow-up' },
+  { key: 'stage_change', label: 'Stage Change' },
+  { key: 'assignment', label: 'Assignment' }
+];
+
+// ΓöÇΓöÇ Helpers ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+function getStatusLabel(status) {
+  if (status === 'completed') return 'Completed';
+  if (status === 'cancelled') return 'Cancelled';
+  return 'Open';
+}
+
+function getLinkedRecordLabel(act) {
+  if (act.dealId) {
+    const d = Store.getDealById(act.dealId);
+    return d ? `<a href="#/deals/${d.id}" class="btn-link">Deal: ${d.title}</a>` : 'Deal (Deleted)';
+  }
+  if (act.leadId) {
+    const l = Store.getLeadById(act.leadId);
+    return l ? `Lead: ${l.name} (${l.company})` : 'Lead (Deleted)';
+  }
+  if (act.contactId) {
+    const c = Store.getContactById(act.contactId);
+    return c ? `Contact: ${c.name} (${c.company})` : 'Contact (Deleted)';
+  }
+  return 'None';
+}
+
+function getFollowUpTiming(dueAtStr, status) {
+  if (!dueAtStr || status === 'completed' || status === 'cancelled') return null;
+  const due = new Date(dueAtStr);
+  const now = new Date();
+  
+  if (isNaN(due.getTime())) return null;
+
+  if (due.getFullYear() === now.getFullYear() && 
+      due.getMonth() === now.getMonth() && 
+      due.getDate() === now.getDate()) {
+    return 'today';
+  }
+  
+  if (due < now) return 'overdue';
+  return 'upcoming';
+}
+
+function getFilteredData() {
+  const user = Auth.getCurrentUser();
+  if (!user) return [];
+
+  let activities = Store.getActivitiesForUser(user);
+
+  // Apply search
+  if (filters.search) {
+    const term = filters.search.toLowerCase();
+    activities = activities.filter(a => {
+      const u = Store.getUserById(a.assignedTo || a.createdBy);
+      const uName = u ? u.name.toLowerCase() : '';
+      const c = (a.content || '').toLowerCase();
+      let r = '';
+      if (a.dealId) { const d = Store.getDealById(a.dealId); if(d) r = d.title.toLowerCase(); }
+      else if (a.leadId) { const l = Store.getLeadById(a.leadId); if(l) r = l.name.toLowerCase() + ' ' + l.company.toLowerCase(); }
+      else if (a.contactId) { const c = Store.getContactById(a.contactId); if(c) r = c.name.toLowerCase() + ' ' + c.company.toLowerCase(); }
+      
+      return c.includes(term) || uName.includes(term) || r.includes(term);
+    });
+  }
+
+  // Apply type filter
+  if (filters.type !== 'all') {
+    activities = activities.filter(a => a.type === filters.type);
+  }
+
+  // Apply status filter
+  if (filters.status !== 'all') {
+    activities = activities.filter(a => {
+      const s = a.status || 'completed'; // Old items without status act as completed
+      return s === filters.status;
+    });
+  }
+
+  // Apply owner filter
+  if (filters.owner !== 'all') {
+    activities = activities.filter(a => a.assignedTo === filters.owner || a.createdBy === filters.owner);
+  }
+
+  // Apply timing filter
+  if (filters.timing !== 'all') {
+    if (filters.timing === 'follow_ups_only') {
+      activities = activities.filter(a => !!a.dueAt && a.status !== 'completed' && a.status !== 'cancelled');
+    } else {
+      activities = activities.filter(a => getFollowUpTiming(a.dueAt, a.status) === filters.timing);
+    }
+  }
+
+  // Sort by dueAt if present, then createdAt descending
+  return activities.sort((a, b) => {
+    if (a.dueAt && b.dueAt) return new Date(a.dueAt) - new Date(b.dueAt);
+    if (a.dueAt) return -1;
+    if (b.dueAt) return 1;
+    return new Date(b.createdAt) - new Date(a.createdAt);
+  });
+}
+
+// ΓöÇΓöÇ Components ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+function buildKPIs(activities) {
+  const total = activities.length;
+  const followUps = activities.filter(a => !!a.dueAt && a.status !== 'completed' && a.status !== 'cancelled');
+  
+  let overdue = 0;
+  let today = 0;
+  
+  followUps.forEach(f => {
+    const timing = getFollowUpTiming(f.dueAt, f.status);
+    if (timing === 'overdue') overdue++;
+    if (timing === 'today') today++;
+  });
+
+  return `
+    <div class="activity-kpi-grid">
+      <div class="stat-card">
+        <div class="stat-card-content">
+          <div class="stat-card-label">Total Selected</div>
+          <div class="stat-card-value">${total}</div>
+        </div>
+      </div>
+      <div class="stat-card">
+        <div class="stat-card-content">
+          <div class="stat-card-label">Open Follow-ups</div>
+          <div class="stat-card-value">${followUps.length}</div>
+        </div>
+      </div>
+      <div class="stat-card">
+        <div class="stat-card-content">
+          <div class="stat-card-label" style="color: var(--color-warning);">Due Today</div>
+          <div class="stat-card-value">${today}</div>
+        </div>
+      </div>
+      <div class="stat-card">
+        <div class="stat-card-content">
+          <div class="stat-card-label" style="color: var(--color-error);">Overdue</div>
+          <div class="stat-card-value">${overdue}</div>
+        </div>
+      </div>
+    </div>
+  `;
+}
+
+function buildFilters(user) {
+  let ownerOptions = `<option value="all">All Owners</option>`;
+  if (user.role === 'manager') {
+    Store.getUsers().forEach(u => {
+      ownerOptions += `<option value="${u.id}" ${filters.owner === u.id ? 'selected' : ''}>${u.name}</option>`;
+    });
+  } else if (user.role === 'team_lead') {
+    Store.getUsersByTeam(user.teamId).forEach(u => {
+      if (u.id !== user.id) ownerOptions += `<option value="${u.id}" ${filters.owner === u.id ? 'selected' : ''}>${u.name}</option>`;
+    });
+    ownerOptions += `<option value="${user.id}" ${filters.owner === user.id ? 'selected' : ''}>${user.name}</option>`;
+  } else {
+    ownerOptions += `<option value="${user.id}" ${filters.owner === user.id ? 'selected' : ''}>${user.name} (Me)</option>`;
+  }
+
+  const typeOptions = ACTIVITY_TYPES.map(t => 
+    `<option value="${t.key}" ${filters.type === t.key ? 'selected' : ''}>${t.label}</option>`
+  ).join('');
+
+  return `
+    <div class="filter-bar">
+      <div style="flex: 1;">
+        <input type="text" id="act-search" class="login-input" placeholder="Search activities..." value="${filters.search}">
+      </div>
+      <div>
+        <select id="act-type" class="login-input" style="padding-right:32px;">
+          <option value="all">All Types</option>
+          ${typeOptions}
+        </select>
+      </div>
+      <div>
+        <select id="act-status" class="login-input" style="padding-right:32px;">
+          <option value="all">All Statuses</option>
+          <option value="open" ${filters.status === 'open' ? 'selected' : ''}>Open</option>
+          <option value="completed" ${filters.status === 'completed' ? 'selected' : ''}>Completed</option>
+          <option value="cancelled" ${filters.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
+        </select>
+      </div>
+      <div>
+        <select id="act-timing" class="login-input" style="padding-right:32px;">
+          <option value="all">Any Timing</option>
+          <option value="follow_ups_only" ${filters.timing === 'follow_ups_only' ? 'selected' : ''}>All Follow-ups</option>
+          <option value="overdue" ${filters.timing === 'overdue' ? 'selected' : ''}>Overdue</option>
+          <option value="today" ${filters.timing === 'today' ? 'selected' : ''}>Due Today</option>
+          <option value="upcoming" ${filters.timing === 'upcoming' ? 'selected' : ''}>Upcoming</option>
+        </select>
+      </div>
+      <div>
+        <select id="act-owner" class="login-input" style="padding-right:32px;">
+          ${ownerOptions}
+        </select>
+      </div>
+      <button class="btn btn-secondary" id="btn-act-clear">Clear</button>
+    </div>
+  `;
+}
+
+function buildFollowUpCard(f, user) {
+  const typeObj = ACTIVITY_TYPES.find(t => t.key === f.type);
+  const typeLabel = typeObj ? typeObj.label : f.type;
+  const owner = Store.getUserById(f.assignedTo || f.createdBy);
+  const ownerName = owner ? owner.name : 'Unknown';
+  
+  const canEdit = Store.canUserEditActivity(f, user);
+  const completeBtn = canEdit 
+    ? `<button class="btn btn-sm" data-action="complete-act" data-id="${f.id}" style="padding:0.25rem 0.5rem; font-size:0.75rem;">Mark Complete</button>` 
+    : '';
+
+  return `
+    <div class="followup-item">
+      <div class="followup-item-header">
+        <span class="badge badge-neutral">${typeLabel}</span>
+        <span style="font-size:0.75rem; color:var(--color-muted);">${formatDateTime(f.dueAt)}</span>
+      </div>
+      <div style="font-weight:600; margin: 4px 0;">${f.content}</div>
+      <div style="color:var(--color-muted); font-size:0.75rem;">
+        Owner: ${ownerName}<br>
+        Record: ${getLinkedRecordLabel(f)}
+      </div>
+      <div style="margin-top:8px; text-align:right;">
+        ${completeBtn}
+      </div>
+    </div>
+  `;
+}
+
+function buildFollowUpBoard(activities, user) {
+  const followUps = activities.filter(a => !!a.dueAt && a.status !== 'completed' && a.status !== 'cancelled');
+  
+  const overdue = [];
+  const today = [];
+  const upcoming = [];
+
+  followUps.forEach(f => {
+    const timing = getFollowUpTiming(f.dueAt, f.status);
+    if (timing === 'overdue') overdue.push(f);
+    else if (timing === 'today') today.push(f);
+    else upcoming.push(f);
+  });
+
+  return `
+    <div class="followup-board">
+      <div class="followup-column">
+        <div class="followup-column-header">
+          <span style="color: var(--color-error);">Overdue</span>
+          <span class="badge badge-neutral">${overdue.length}</span>
+        </div>
+        ${overdue.map(f => buildFollowUpCard(f, user)).join('') || '<div style="color:var(--color-muted); font-size:0.8rem; text-align:center;">No overdue tasks</div>'}
+      </div>
+      <div class="followup-column">
+        <div class="followup-column-header">
+          <span style="color: var(--color-warning);">Due Today</span>
+          <span class="badge badge-neutral">${today.length}</span>
+        </div>
+        ${today.map(f => buildFollowUpCard(f, user)).join('') || '<div style="color:var(--color-muted); font-size:0.8rem; text-align:center;">No tasks due today</div>'}
+      </div>
+      <div class="followup-column">
+        <div class="followup-column-header">
+          <span style="color: var(--color-primary);">Upcoming</span>
+          <span class="badge badge-neutral">${upcoming.length}</span>
+        </div>
+        ${upcoming.map(f => buildFollowUpCard(f, user)).join('') || '<div style="color:var(--color-muted); font-size:0.8rem; text-align:center;">No upcoming tasks</div>'}
+      </div>
+    </div>
+  `;
+}
+
+function buildActivityTable(activities, user) {
+  const rows = activities.map(a => {
+    const typeObj = ACTIVITY_TYPES.find(t => t.key === a.type);
+    const typeLabel = typeObj ? typeObj.label : a.type;
+    const s = a.status || 'completed';
+    const sClass = `activity-status-${s}`;
+    const owner = Store.getUserById(a.assignedTo || a.createdBy);
+    const ownerName = owner ? owner.name : 'Unknown';
+
+    const canEdit = Store.canUserEditActivity(a, user);
+    const canDelete = user.role === 'manager';
+
+    let actions = '';
+    if (canEdit) {
+      actions += `<button class="btn btn-sm btn-secondary" data-action="edit-act" data-id="${a.id}" style="margin-right:4px;">Edit</button>`;
+      if (s === 'open') {
+        actions += `<button class="btn btn-sm" data-action="complete-act" data-id="${a.id}" style="margin-right:4px;">Complete</button>`;
+      }
+    }
+    if (canDelete) {
+      actions += `<button class="btn btn-sm" style="background:var(--color-error); color:white;" data-action="delete-act" data-id="${a.id}">Delete</button>`;
+    }
+
+    return `
+      <tr>
+        <td>${typeLabel}</td>
+        <td>${getLinkedRecordLabel(a)}</td>
+        <td style="max-width:300px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${a.content}">${a.content}</td>
+        <td>${ownerName}</td>
+        <td class="${sClass}">${getStatusLabel(s)}</td>
+        <td>${a.dueAt ? formatDateTime(a.dueAt) : 'ΓÇö'}</td>
+        <td>${formatDateTime(a.createdAt)}</td>
+        <td style="text-align:right;">${actions}</td>
+      </tr>
+    `;
+  }).join('');
+
+  return `
+    <div class="card" style="overflow-x:auto;">
+      <table class="data-table">
+        <thead>
+          <tr>
+            <th>Type</th>
+            <th>Linked To</th>
+            <th>Content</th>
+            <th>Owner</th>
+            <th>Status</th>
+            <th>Due Date</th>
+            <th>Created</th>
+            <th style="text-align:right;">Actions</th>
+          </tr>
+        </thead>
+        <tbody>
+          ${rows || '<tr><td colspan="8" style="text-align:center;">No activities found</td></tr>'}
+        </tbody>
+      </table>
+    </div>
+  `;
+}
+
+// ΓöÇΓöÇ Modal ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+function renderActivityModal(actId = null, defaults = {}) {
+  const user = Auth.getCurrentUser();
+  if (!user) return;
+
+  let act = {
+    type: defaults.type || 'follow_up',
+    status: defaults.status || 'open',
+    content: defaults.content || '',
+    outcome: defaults.outcome || '',
+    assignedTo: defaults.assignedTo || user.id,
+    dueAt: defaults.dueAt || '',
+    linkedType: defaults.linkedType || 'none',
+    linkedId: defaults.linkedId || ''
+  };
+
+  if (actId) {
+    const existing = Store.getActivityById(actId);
+    if (!existing || !Store.canUserEditActivity(existing, user)) {
+      Toast.error('Error', 'Activity not found or permission denied.');
+      return;
+    }
+    act = { ...existing };
+    if (act.dealId) { act.linkedType = 'deal'; act.linkedId = act.dealId; }
+    else if (act.leadId) { act.linkedType = 'lead'; act.linkedId = act.leadId; }
+    else if (act.contactId) { act.linkedType = 'contact'; act.linkedId = act.contactId; }
+    else { act.linkedType = 'none'; act.linkedId = ''; }
+    
+    if (act.dueAt) act.dueAt = act.dueAt.slice(0, 16); // format for datetime-local
+  }
+
+  // Build Owner Options
+  let ownerOptions = '';
+  if (user.role === 'manager') {
+    ownerOptions = Store.getUsers().map(u => `<option value="${u.id}" ${u.id === act.assignedTo ? 'selected' : ''}>${u.name}</option>`).join('');
+  } else if (user.role === 'team_lead') {
+    const teamUsers = Store.getUsersByTeam(user.teamId).filter(u => u.id !== user.id);
+    teamUsers.push(user);
+    ownerOptions = teamUsers.map(u => `<option value="${u.id}" ${u.id === act.assignedTo ? 'selected' : ''}>${u.name}</option>`).join('');
+  } else {
+    ownerOptions = `<option value="${user.id}" selected>${user.name}</option>`;
+  }
+
+  // Base Modal HTML
+  const modalHtml = `
+    <div class="modal" id="activity-modal">
+      <div class="modal-content" style="max-width: 600px;">
+        <div class="modal-header">
+          <h2 class="modal-title">${actId ? 'Edit Activity' : 'New Activity'}</h2>
+          <button class="modal-close" id="btn-close-modal">&times;</button>
+        </div>
+        <div class="modal-body">
+          <div style="display:flex; gap:1rem; margin-bottom:1rem;">
+            <div style="flex:1;">
+              <label class="login-label">Type</label>
+              <select id="modal-act-type" class="login-input">
+                ${ACTIVITY_TYPES.map(t => `<option value="${t.key}" ${act.type === t.key ? 'selected' : ''}>${t.label}</option>`).join('')}
+              </select>
+            </div>
+            <div style="flex:1;">
+              <label class="login-label">Status</label>
+              <select id="modal-act-status" class="login-input">
+                <option value="open" ${act.status === 'open' ? 'selected' : ''}>Open</option>
+                <option value="completed" ${act.status === 'completed' ? 'selected' : ''}>Completed</option>
+                <option value="cancelled" ${act.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
+              </select>
+            </div>
+          </div>
+
+          <div style="display:flex; gap:1rem; margin-bottom:1rem;">
+            <div style="flex:1;">
+              <label class="login-label">Linked Record Type</label>
+              <select id="modal-linked-type" class="login-input">
+                <option value="none" ${act.linkedType === 'none' ? 'selected' : ''}>None</option>
+                <option value="deal" ${act.linkedType === 'deal' ? 'selected' : ''}>Deal</option>
+                <option value="lead" ${act.linkedType === 'lead' ? 'selected' : ''}>Lead</option>
+                <option value="contact" ${act.linkedType === 'contact' ? 'selected' : ''}>Contact</option>
+              </select>
+            </div>
+            <div style="flex:1;">
+              <label class="login-label">Linked Record</label>
+              <select id="modal-linked-id" class="login-input" ${act.linkedType === 'none' ? 'disabled' : ''}>
+                <!-- Populated dynamically -->
+              </select>
+            </div>
+          </div>
+
+          <div style="display:flex; gap:1rem; margin-bottom:1rem;">
+            <div style="flex:1;">
+              <label class="login-label">Assigned To</label>
+              <select id="modal-assigned-to" class="login-input" ${user.role === 'employee' ? 'disabled' : ''}>
+                ${ownerOptions}
+              </select>
+            </div>
+            <div style="flex:1;">
+              <label class="login-label">Due Date & Time (Optional)</label>
+              <input type="datetime-local" id="modal-due-at" class="login-input" value="${act.dueAt || ''}">
+            </div>
+          </div>
+
+          <div style="margin-bottom:1rem;">
+            <label class="login-label">Content / Description <span style="color:red;">*</span></label>
+            <textarea id="modal-content" class="login-input" style="height: 80px;" required>${act.content}</textarea>
+          </div>
+
+          <div style="margin-bottom:1rem;">
+            <label class="login-label">Outcome (Optional)</label>
+            <input type="text" id="modal-outcome" class="login-input" value="${act.outcome || ''}" placeholder="E.g., Left voicemail, meeting successful">
+          </div>
+        </div>
+        <div class="modal-footer">
+          <button class="btn btn-secondary" id="btn-cancel-modal">Cancel</button>
+          <button class="btn btn-primary" id="btn-save-activity" data-id="${actId || ''}">Save</button>
+        </div>
+      </div>
+    </div>
+  `;
+
+  document.body.insertAdjacentHTML('beforeend', modalHtml);
+  
+  // Populate linked records dropdown initially
+  populateLinkedRecords(act.linkedType, act.linkedId, user);
+
+  // Bind linked type change
+  document.getElementById('modal-linked-type').addEventListener('change', (e) => {
+    populateLinkedRecords(e.target.value, null, user);
+  });
+
+  // Bind close/cancel
+  document.getElementById('btn-close-modal').addEventListener('click', closeActivityModal);
+  document.getElementById('btn-cancel-modal').addEventListener('click', closeActivityModal);
+
+  // Bind save
+  document.getElementById('btn-save-activity').addEventListener('click', () => saveActivity(actId, user));
+}
+
+function populateLinkedRecords(type, selectedId, user) {
+  const select = document.getElementById('modal-linked-id');
+  if (!select) return;
+
+  if (type === 'none') {
+    select.innerHTML = '<option value="">-- None --</option>';
+    select.disabled = true;
+    return;
+  }
+
+  select.disabled = false;
+  let options = [];
+
+  if (type === 'deal') {
+    options = Store.getDealsForUser(user).map(d => `<option value="${d.id}" ${d.id === selectedId ? 'selected' : ''}>${d.title}</option>`);
+  } else if (type === 'lead') {
+    options = Store.getLeadsForUser(user).map(l => `<option value="${l.id}" ${l.id === selectedId ? 'selected' : ''}>${l.name} (${l.company})</option>`);
+  } else if (type === 'contact') {
+    options = Store.getContacts().map(c => `<option value="${c.id}" ${c.id === selectedId ? 'selected' : ''}>${c.name} (${c.company})</option>`);
+  }
+
+  select.innerHTML = options.length ? options.join('') : '<option value="">-- No records available --</option>';
+}
+
+function closeActivityModal() {
+  const modal = document.getElementById('activity-modal');
+  if (modal) modal.remove();
+}
+
+function saveActivity(actId, user) {
+  const type = document.getElementById('modal-act-type').value;
+  const status = document.getElementById('modal-act-status').value;
+  const linkedType = document.getElementById('modal-linked-type').value;
+  const linkedId = document.getElementById('modal-linked-id').value;
+  let assignedTo = document.getElementById('modal-assigned-to').value;
+  const dueAt = document.getElementById('modal-due-at').value;
+  const content = document.getElementById('modal-content').value.trim();
+  const outcome = document.getElementById('modal-outcome').value.trim();
+
+  if (!content) {
+    Toast.error('Validation Error', 'Content is required.');
+    return;
+  }
+
+  if (!ACTIVITY_TYPES.some(t => t.key === type)) return Toast.error('Validation Error', 'Invalid activity type.');
+  if (!['open', 'completed', 'cancelled'].includes(status)) return Toast.error('Validation Error', 'Invalid status.');
+  if (!['none', 'deal', 'lead', 'contact'].includes(linkedType)) return Toast.error('Validation Error', 'Invalid linked type.');
+
+  if (linkedType !== 'none' && !linkedId) {
+    return Toast.error('Validation Error', 'Please select a valid linked record or set type to None.');
+  }
+
+  let dealTeamId = null;
+
+  if (linkedType === 'deal') {
+    const deal = Store.getDealById(linkedId);
+    if (!deal) return Toast.error('Validation Error', 'Selected Deal does not exist.');
+    if (!Auth.canViewRecord(deal)) return Toast.error('Validation Error', 'Permission denied for this Deal.');
+    dealTeamId = deal.teamId;
+  } else if (linkedType === 'lead') {
+    const lead = Store.getLeadById(linkedId);
+    if (!lead) return Toast.error('Validation Error', 'Selected Lead does not exist.');
+    if (!Auth.canViewRecord(lead)) return Toast.error('Validation Error', 'Permission denied for this Lead.');
+    const assignee = Store.getUserById(lead.assignedTo);
+    if (assignee) dealTeamId = assignee.teamId;
+  } else if (linkedType === 'contact') {
+    const contact = Store.getContactById(linkedId);
+    if (!contact) return Toast.error('Validation Error', 'Selected Contact does not exist.');
+  }
+
+  // Security guard for assignment
+  if (user.role === 'employee') {
+    assignedTo = user.id;
+  } else if (user.role === 'team_lead') {
+    const target = Store.getUserById(assignedTo);
+    if (!target || (target.teamId !== user.teamId && target.id !== user.id)) {
+      return Toast.error('Validation Error', 'Cannot assign outside your team.');
+    }
+  }
+
+  const assignedUser = Store.getUserById(assignedTo);
+  if (!assignedUser) {
+    return Toast.error('Validation Error', 'Assigned user does not exist.');
+  }
+
+  let finalTeamId = null;
+  if (assignedUser.teamId) {
+    finalTeamId = assignedUser.teamId;
+  } else if (dealTeamId) {
+    finalTeamId = dealTeamId;
+  } else {
+    finalTeamId = user.teamId || null;
+  }
+
+  let normalizedDueAt = null;
+  if (dueAt) {
+    const d = new Date(dueAt);
+    if (isNaN(d.getTime())) {
+      return Toast.error('Validation Error', 'Invalid Due Date.');
+    }
+    normalizedDueAt = d.toISOString();
+  }
+
+  const payload = {
+    type,
+    status,
+    content,
+    outcome,
+    assignedTo,
+    teamId: finalTeamId,
+    dealId: linkedType === 'deal' ? linkedId : null,
+    leadId: linkedType === 'lead' ? linkedId : null,
+    contactId: linkedType === 'contact' ? linkedId : null,
+    dueAt: normalizedDueAt,
+    updatedAt: new Date().toISOString()
+  };
+
+  if (actId) {
+    const existing = Store.getActivityById(actId);
+    if (!existing || !Store.canUserEditActivity(existing, user)) {
+      Toast.error('Error', 'Permission denied.');
+      return;
+    }
+    
+    if (status === 'completed' && existing.status !== 'completed') {
+      payload.completedAt = new Date().toISOString();
+    } else if (status !== 'completed') {
+      payload.completedAt = null;
+    }
+    
+    Store.updateActivity(actId, payload);
+    Toast.success('Saved', 'Activity updated successfully.');
+  } else {
+    payload.id = 'act_' + Date.now().toString(36);
+    payload.createdBy = user.id;
+    payload.createdAt = new Date().toISOString();
+    if (status === 'completed') payload.completedAt = payload.createdAt;
+    
+    Store.createActivity(payload);
+    Toast.success('Created', 'Activity logged successfully.');
+  }
+
+  closeActivityModal();
+  reRender();
+}
+
+// ΓöÇΓöÇ Main Page Render ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+export function renderActivities() {
+  const user = Auth.getCurrentUser();
+  if (!user) return '';
+
+  const activities = getFilteredData();
+
+  return `
+    <div class="content-inner">
+      <div class="page-header">
+        <div>
+          <h1 class="page-header-title">Activities & Follow-ups</h1>
+          <p class="page-header-subtitle">Track calls, emails, meetings, notes, outreach, and follow-ups.</p>
+        </div>
+        <button class="btn btn-primary" id="btn-new-activity">New Activity</button>
+      </div>
+
+      ${buildKPIs(activities)}
+      ${buildFilters(user)}
+
+      <div class="dashboard-section">
+        <h4 class="dashboard-section-title">Follow-up Focus</h4>
+        ${buildFollowUpBoard(activities, user)}
+      </div>
+
+      <div class="dashboard-section">
+        <h4 class="dashboard-section-title">Activity Log</h4>
+        ${buildActivityTable(activities, user)}
+      </div>
+    </div>
+  `;
+}
+
+function reRender() {
+  const contentEl = document.getElementById('content-area');
+  if (contentEl) {
+    contentEl.innerHTML = renderActivities();
+  }
+}
+
+// ΓöÇΓöÇ Events ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+export function bindActivitiesEvents() {
+  const content = document.getElementById('content-area');
+  if (!content) return;
+
+  content.addEventListener('click', (e) => {
+    // New Activity
+    if (e.target.id === 'btn-new-activity') {
+      renderActivityModal();
+      return;
+    }
+
+    // Clear filters
+    if (e.target.id === 'btn-act-clear') {
+      filters = { search: '', type: 'all', status: 'all', timing: 'all', owner: 'all' };
+      reRender();
+      return;
+    }
+
+    const action = e.target.dataset.action;
+    const actId = e.target.dataset.id;
+    const user = Auth.getCurrentUser();
+
+    if (action === 'edit-act') {
+      renderActivityModal(actId);
+    } else if (action === 'complete-act') {
+      if (!user) return Toast.error('Error', 'Not logged in.');
+      const act = Store.getActivityById(actId);
+      if (!act) return Toast.error('Error', 'Activity not found.');
+      if (!Store.canUserEditActivity(act, user)) return Toast.error('Error', 'Permission denied.');
+
+      Store.updateActivity(actId, { 
+        status: 'completed', 
+        completedAt: new Date().toISOString(),
+        updatedAt: new Date().toISOString()
+      });
+      Toast.success('Completed', 'Activity marked as complete.');
+      reRender();
+    } else if (action === 'delete-act') {
+      if (!user) return Toast.error('Error', 'Not logged in.');
+      if (user.role !== 'manager') {
+        Toast.error('Denied', 'Only managers can delete activities.');
+        return;
+      }
+      const act = Store.getActivityById(actId);
+      if (!act) return Toast.error('Error', 'Activity not found.');
+      
+      if (confirm('Are you sure you want to delete this activity?')) {
+        const success = Store.deleteActivity(actId);
+        if (success) {
+          Toast.success('Deleted', 'Activity removed.');
+        } else {
+          Toast.error('Error', 'Failed to delete activity.');
+        }
+        reRender();
+      }
+    }
+  });
+
+  content.addEventListener('change', (e) => {
+    if (['act-search', 'act-type', 'act-status', 'act-timing', 'act-owner'].includes(e.target.id)) {
+      filters.search = document.getElementById('act-search').value;
+      filters.type = document.getElementById('act-type').value;
+      filters.status = document.getElementById('act-status').value;
+      filters.timing = document.getElementById('act-timing').value;
+      filters.owner = document.getElementById('act-owner').value;
+      reRender();
+    }
+  });
+
+  content.addEventListener('keyup', (e) => {
+    if (e.target.id === 'act-search') {
+      filters.search = e.target.value;
+      reRender();
+    }
+  });
+}
+
+// Export modal for external use (e.g. from deal-detail)
+export { renderActivityModal };
diff --git a/js/pages/dashboard.js b/js/pages/dashboard.js
index f70f796..b510783 100644
--- a/js/pages/dashboard.js
+++ b/js/pages/dashboard.js
@@ -58,6 +58,28 @@ export function renderDashboard() {
   // Activity feed
   const activityFeed = buildActivityFeed(activities);
 
+  const followUps = Store.getFollowUpsForUser(user);
+  let overdue = 0; let today = 0; let upcoming = 0;
+  const now = new Date();
+
+  followUps.forEach(f => {
+    const due = new Date(f.dueAt);
+    if (isNaN(due.getTime())) return;
+
+    if (due.getFullYear() === now.getFullYear() &&
+        due.getMonth() === now.getMonth() &&
+        due.getDate() === now.getDate()) {
+      today++;
+    } else if (due < now) {
+      overdue++;
+    } else {
+      upcoming++;
+    }
+  });
+
+  const sortedFollowUps = followUps.sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt)).slice(0, 5);
+  const followUpsWidget = buildFollowUpsWidget(sortedFollowUps, overdue, today, upcoming);
+
   return `
     <div class="content-inner">
       <div class="dashboard-greeting">
@@ -70,11 +92,21 @@ export function renderDashboard() {
 
       ${statCards}
 
-      <div class="dashboard-section">
-        <div class="dashboard-section-header">
-          <h4 class="dashboard-section-title">Pipeline Overview</h4>
+      <div style="display:flex; gap:1.5rem; flex-wrap:wrap; margin-bottom:1.5rem;">
+        <div class="dashboard-section" style="flex:1; min-width:300px; margin-bottom:0;">
+          <div class="dashboard-section-header">
+            <h4 class="dashboard-section-title">Follow-ups</h4>
+            <a href="#/activities" class="btn-link" style="font-size:0.85rem;">View All</a>
+          </div>
+          ${followUpsWidget}
+        </div>
+
+        <div class="dashboard-section" style="flex:2; min-width:400px; margin-bottom:0;">
+          <div class="dashboard-section-header">
+            <h4 class="dashboard-section-title">Pipeline Overview</h4>
+          </div>
+          ${pipelineMini}
         </div>
-        ${pipelineMini}
       </div>
 
       <div class="dashboard-section">
@@ -162,6 +194,54 @@ function buildPipelineMini(activeDeals) {
   `;
 }
 
+// ΓöÇΓöÇ Follow-ups Widget ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+function buildFollowUpsWidget(followUps, overdue, today, upcoming) {
+  const summaryHtml = `
+    <div style="display:flex; justify-content:space-between; margin-bottom:1rem; font-size:0.85rem; font-weight:600; text-align:center;">
+      <div style="flex:1;">
+        <div style="color:var(--color-error); font-size:1.2rem;">${overdue}</div>
+        <div style="color:var(--color-muted); font-size:0.75rem;">Overdue</div>
+      </div>
+      <div style="flex:1;">
+        <div style="color:var(--color-warning); font-size:1.2rem;">${today}</div>
+        <div style="color:var(--color-muted); font-size:0.75rem;">Today</div>
+      </div>
+      <div style="flex:1;">
+        <div style="color:var(--color-primary); font-size:1.2rem;">${upcoming}</div>
+        <div style="color:var(--color-muted); font-size:0.75rem;">Upcoming</div>
+      </div>
+    </div>
+  `;
+
+  if (followUps.length === 0) {
+    return summaryHtml + `<div style="text-align:center; color:var(--color-muted); font-size:0.85rem; padding:1rem 0;">No open follow-ups.</div>`;
+  }
+
+  const itemsHtml = followUps.map(f => {
+    const owner = Store.getUserById(f.assignedTo || f.createdBy);
+    const ownerName = owner ? owner.name : 'Unknown';
+    let recordLabel = 'No Link';
+    if (f.dealId) { const d = Store.getDealById(f.dealId); if (d) recordLabel = d.title; }
+    else if (f.leadId) { const l = Store.getLeadById(f.leadId); if (l) recordLabel = l.name; }
+    else if (f.contactId) { const c = Store.getContactById(f.contactId); if (c) recordLabel = c.name; }
+
+    return `
+      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-hairline-soft); padding:0.5rem 0;">
+        <div style="max-width:200px;">
+          <div style="font-weight:600; font-size:0.85rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${f.content}">${f.content}</div>
+          <div style="font-size:0.75rem; color:var(--color-muted);">${recordLabel} ΓÇó ${ownerName}</div>
+        </div>
+        <div style="font-size:0.75rem; text-align:right;">
+          <div style="font-weight:600;">${new Date(f.dueAt).toLocaleDateString()}</div>
+        </div>
+      </div>
+    `;
+  }).join('');
+
+  return summaryHtml + itemsHtml;
+}
+
 // ΓöÇΓöÇ Activity Feed ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
 
 function buildActivityFeed(activities) {
diff --git a/js/pages/deal-detail.js b/js/pages/deal-detail.js
index 06dbf08..f25928c 100644
--- a/js/pages/deal-detail.js
+++ b/js/pages/deal-detail.js
@@ -8,6 +8,7 @@ import { Auth } from '../auth.js';
 import { SOP_STAGES, formatCurrency, timeAgo, formatDateTime } from '../utils.js';
 import { Router } from '../router.js';
 import { Toast } from '../components/toast.js';
+import { renderActivityModal } from './activities.js';
 
 export function renderDealDetail(params) {
   const user = Auth.getCurrentUser();
@@ -30,13 +31,13 @@ export function renderDealDetail(params) {
   }
 
   const currentStageIndex = SOP_STAGES.findIndex(s => s.key === deal.stage);
-  
+
   // Build SOP Progress Bar
   const sopProgressHtml = SOP_STAGES.map((stage, index) => {
     let stateClass = '';
     if (index < currentStageIndex) stateClass = 'is-completed';
     else if (index === currentStageIndex) stateClass = 'is-current';
-    
+
     return `
       <div class="sop-step ${stateClass}">
         <div class="sop-step-dot"></div>
@@ -48,7 +49,7 @@ export function renderDealDetail(params) {
   // Action Controls
   let actionHtml = '';
   const canMoveForward = currentStageIndex < SOP_STAGES.length - 1 && (user.role === 'manager' || Auth.canEditRecord(deal));
-  
+
   if (user.role === 'manager') {
     const CHEVRON_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>';
     const options = SOP_STAGES.map(s => `<option value="${s.key}" ${s.key === deal.stage ? 'selected' : ''}>${s.label}</option>`).join('');
@@ -74,17 +75,34 @@ export function renderDealDetail(params) {
     `;
   }
 
-  // Activities
   const activities = Store.getActivitiesForDeal(deal.id);
+  const ACTIVITY_ICONS = { call: '≡ƒô₧', email: 'Γ£ë∩╕Å', meeting: '≡ƒñ¥', whatsapp: '≡ƒÆ¼', linkedin: '≡ƒöù', note: '≡ƒô¥', follow_up: 'ΓÅ░', stage_change: '≡ƒöä', assignment: '≡ƒæñ' };
+
   const activitiesHtml = activities.map(act => {
     const creator = Store.getUserById(act.createdBy);
+    const rawType = act.type || 'note';
+    const icon = ACTIVITY_ICONS[rawType] || '≡ƒôî';
+    const typeLabel = rawType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
+
+    let extraHtml = '';
+    if (act.status && act.status !== 'completed' && act.status !== 'cancelled') {
+      extraHtml += `<span class="badge badge-warning" style="margin-right:4px;">Open</span>`;
+    }
+    if (act.dueAt) {
+      extraHtml += `<span style="font-size:0.75rem; color:var(--color-muted); margin-right:4px;">Due: ${new Date(act.dueAt).toLocaleDateString()}</span>`;
+    }
+    if (act.outcome) {
+      extraHtml += `<div style="margin-top:4px; font-size:0.8rem; font-style:italic;">Outcome: ${act.outcome}</div>`;
+    }
+
     return `
       <div class="activity-feed-item">
         <span class="activity-feed-dot"></span>
         <div class="activity-feed-content">
           <div class="activity-feed-text">
-            <strong>${creator ? creator.name : 'Unknown'}</strong><br>
-            <span style="color: var(--color-muted);">${act.content}</span>
+            <strong>${creator ? creator.name : 'Unknown'}</strong> <span style="color:var(--color-muted); font-size:0.85rem;">logged ${typeLabel}</span><br>
+            <span style="color: var(--color-ink);">${icon} ${act.content}</span>
+            ${extraHtml}
           </div>
           <div class="activity-feed-time">${formatDateTime(act.createdAt)} (${timeAgo(act.createdAt)})</div>
         </div>
@@ -111,7 +129,10 @@ export function renderDealDetail(params) {
       </div>
 
       <div class="dashboard-section">
-        <h4 class="dashboard-section-title">Activity History</h4>
+        <div class="dashboard-section-header" style="justify-content:space-between; align-items:center;">
+          <h4 class="dashboard-section-title" style="margin:0;">Activity History</h4>
+          <button class="btn btn-secondary btn-sm" id="btn-deal-log-activity" data-deal-id="${deal.id}">Log Activity</button>
+        </div>
         <div class="activity-feed">
           <div class="activity-feed-list">
             ${activitiesHtml}
@@ -133,7 +154,7 @@ export function bindDealDetailEvents() {
       const nextStage = e.target.dataset.nextStage;
       executeStageChange(dealId, nextStage);
     }
-    
+
     // Override Stage button (Manager)
     if (e.target.id === 'btn-override-stage') {
       const dealId = e.target.dataset.dealId;
@@ -146,6 +167,11 @@ export function bindDealDetailEvents() {
         }
       }
     }
+
+    // Log Activity button
+    if (e.target.id === 'btn-deal-log-activity') {
+      renderActivityModal(null, { linkedType: 'deal', linkedId: e.target.dataset.dealId });
+    }
   });
 }
 
@@ -197,7 +223,7 @@ function executeStageChange(dealId, toStage, isOverride = false) {
   });
 
   Toast.success('Stage Updated', `Deal is now in ${SOP_STAGES[toIndex].label}`);
-  
+
   // Re-render
   const contentEl = document.getElementById('content-area');
   if (contentEl) {
diff --git a/js/router.js b/js/router.js
index 4bd880e..bb3955e 100644
--- a/js/router.js
+++ b/js/router.js
@@ -14,6 +14,7 @@ const ROUTES = {
   'leads':     { pageId: 'leads',     title: 'Leads' },
   'contacts':  { pageId: 'contacts',  title: 'Contacts' },
   'deals':     { pageId: 'deals',     title: 'Deals' },
+  'activities':{ pageId: 'activities',title: 'Activities' },
   'team':      { pageId: 'team',      title: 'Team' },
   'reports':   { pageId: 'reports',   title: 'Reports' },
   'settings':  { pageId: 'settings',  title: 'Settings' }
diff --git a/js/seed.js b/js/seed.js
index f63bb39..2b97097 100644
--- a/js/seed.js
+++ b/js/seed.js
@@ -349,6 +349,31 @@ export function seedData() {
       content: 'Deal moved from Sales to Requirement',
       fromStage: 'sales', toStage: 'requirement',
       createdBy: 'usr_emp_02', createdAt: daysAgo(5)
+    },
+    // Follow-ups
+    {
+      id: generateId(), dealId: 'deal_01', type: 'follow_up',
+      content: 'Follow up with Rajesh on vendor shortlisting decision.',
+      status: 'open', dueAt: daysAgo(1), // Overdue
+      assignedTo: 'usr_emp_01', createdBy: 'usr_emp_01', createdAt: daysAgo(2)
+    },
+    {
+      id: generateId(), dealId: 'deal_03', type: 'call',
+      content: 'Call TCS to confirm server provisioning details.',
+      status: 'open', dueAt: new Date().toISOString(), // Due Today
+      assignedTo: 'usr_emp_03', createdBy: 'usr_emp_03', createdAt: daysAgo(1)
+    },
+    {
+      id: generateId(), leadId: leads[3].id, type: 'email',
+      content: 'Send product demo link to Divya.',
+      status: 'open', dueAt: new Date(Date.now() + 86400000 * 2).toISOString(), // Upcoming (in 2 days)
+      assignedTo: 'usr_emp_02', createdBy: 'usr_emp_02', createdAt: daysAgo(1)
+    },
+    {
+      id: generateId(), contactId: contacts[1].id, type: 'meeting',
+      content: 'On-site sync with Meera regarding proposal revisions.',
+      status: 'completed', dueAt: daysAgo(3), completedAt: daysAgo(2), outcome: 'Proposal approved with minor tweaks.',
+      assignedTo: 'usr_emp_04', createdBy: 'usr_emp_04', createdAt: daysAgo(4)
     }
   ];
 
diff --git a/js/store.js b/js/store.js
index 3fd15ef..1b6321f 100644
--- a/js/store.js
+++ b/js/store.js
@@ -138,6 +138,8 @@ export const Store = {
   getActivities()        { return getAll(KEYS.activities); },
   getActivityById(id)    { return getById(KEYS.activities, id); },
   createActivity(a)      { return create(KEYS.activities, a); },
+  updateActivity(id, a)  { return update(KEYS.activities, id, a); },
+  deleteActivity(id)     { return remove(KEYS.activities, id); },
 
   getActivitiesForDeal(dealId) {
     return getAll(KEYS.activities)
@@ -145,15 +147,62 @@ export const Store = {
       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
   },
 
-  getRecentActivities(user, limit = 10) {
-    let activities = getAll(KEYS.activities);
+  getActivitiesForUser(user) {
+    if (!user) return [];
+    const activities = getAll(KEYS.activities);
+    if (user.role === 'manager') return activities;
+
+    const deals = Store.getDealsForUser(user);
+    const dealIds = new Set(deals.map(d => d.id));
+    const leads = Store.getLeadsForUser(user);
+    const leadIds = new Set(leads.map(l => l.id));
 
-    if (user.role !== 'manager') {
-      const deals = Store.getDealsForUser(user);
-      const dealIds = new Set(deals.map(d => d.id));
-      activities = activities.filter(a => dealIds.has(a.dealId));
+    if (user.role === 'team_lead') {
+      const teamUserIds = new Set(Store.getUsersByTeam(user.teamId).map(u => u.id));
+      teamUserIds.add(user.id);
+
+      return activities.filter(a => {
+        if (a.teamId === user.teamId) return true;
+        if (teamUserIds.has(a.assignedTo) || teamUserIds.has(a.createdBy)) return true;
+        if (a.dealId && dealIds.has(a.dealId)) return true;
+        if (a.leadId && leadIds.has(a.leadId)) return true;
+        return false;
+      });
     }
 
+    // Employee
+    return activities.filter(a => {
+      if (a.assignedTo === user.id || a.createdBy === user.id) return true;
+      if (a.dealId && dealIds.has(a.dealId)) return true;
+      if (a.leadId && leadIds.has(a.leadId)) return true;
+      return false;
+    });
+  },
+
+  getFollowUpsForUser(user) {
+    if (!user) return [];
+    return Store.getActivitiesForUser(user)
+      .filter(a => a.dueAt && a.status !== 'completed' && a.status !== 'cancelled');
+  },
+
+  canUserViewActivity(activity, user) {
+    if (!activity || !user) return false;
+    if (user.role === 'manager') return true;
+    const activities = Store.getActivitiesForUser(user);
+    return activities.some(a => a.id === activity.id);
+  },
+
+  canUserEditActivity(activity, user) {
+    if (!activity || !user) return false;
+    if (user.role === 'manager') return true;
+    if (user.role === 'team_lead') {
+      return Store.canUserViewActivity(activity, user);
+    }
+    return activity.assignedTo === user.id || activity.createdBy === user.id;
+  },
+
+  getRecentActivities(user, limit = 10) {
+    const activities = Store.getActivitiesForUser(user);
     return activities
       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
       .slice(0, limit);
```

## Tests Run
```text
Browser preview performed externally: Manager, Team Lead, and Employee activity visibility/actions checked; follow-up filters and dashboard summary checked
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
