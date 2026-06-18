# AI Change Audit Report

## Generated On
2026-06-18_09-59-31

## Branch
main

## Baseline Commit
f0d4c3f

## Task Summary
Phase 2B Requirements, Proposals, and Quotations with role-scoped requirement capture, proposal line items, approval controls, and deal-detail linkage

## Git Status
```text
 M generate-audit.ps1
 M js/app.js
 M js/auth.js
 M js/components/sidebar.js
 M js/pages/deal-detail.js
 A js/pages/proposals.js
 A js/pages/requirements.js
 M js/pages/settings.js
 M js/router.js
 M js/seed.js
 M js/store.js
```

## Files Changed
```text
M	generate-audit.ps1
M	js/app.js
M	js/auth.js
M	js/components/sidebar.js
M	js/pages/deal-detail.js
A	js/pages/proposals.js
A	js/pages/requirements.js
M	js/pages/settings.js
M	js/router.js
M	js/seed.js
M	js/store.js
```

## Change Summary
```text
 generate-audit.ps1       |  14 +-
 js/app.js                |  10 +
 js/auth.js               |   2 +
 js/components/sidebar.js |   2 +
 js/pages/deal-detail.js  |  40 +++
 js/pages/proposals.js    | 718 +++++++++++++++++++++++++++++++++++++++++++++++
 js/pages/requirements.js | 628 +++++++++++++++++++++++++++++++++++++++++
 js/pages/settings.js     |  17 +-
 js/router.js             |   2 +
 js/seed.js               |  98 +++++++
 js/store.js              | 133 ++++++++-
 11 files changed, 1646 insertions(+), 18 deletions(-)
```

## Full Diff
```diff
diff --git a/generate-audit.ps1 b/generate-audit.ps1
index 02c8faf..a789504 100644
--- a/generate-audit.ps1
+++ b/generate-audit.ps1
@@ -8,14 +8,14 @@ $stamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
 
 New-Item -ItemType Directory -Force audits | Out-Null
 
-git add -N . | Out-Null
+& "C:\Program Files\Git\cmd\git.exe" add -N . | Out-Null
 
-$branch = git branch --show-current
-$commit = git rev-parse --short HEAD
-$status = git status --short
-$changedFiles = git diff --name-status HEAD -- . ":(exclude)audits/CHANGE_AUDIT.md"
-$summary = git diff --stat HEAD -- . ":(exclude)audits/CHANGE_AUDIT.md"
-$diff = git diff --no-ext-diff HEAD -- . ":(exclude)audits/CHANGE_AUDIT.md"
+$branch = & "C:\Program Files\Git\cmd\git.exe" branch --show-current
+$commit = & "C:\Program Files\Git\cmd\git.exe" rev-parse --short HEAD
+$status = & "C:\Program Files\Git\cmd\git.exe" status --short
+$changedFiles = & "C:\Program Files\Git\cmd\git.exe" diff --name-status HEAD -- . ":(exclude)audits/CHANGE_AUDIT.md"
+$summary = & "C:\Program Files\Git\cmd\git.exe" diff --stat HEAD -- . ":(exclude)audits/CHANGE_AUDIT.md"
+$diff = & "C:\Program Files\Git\cmd\git.exe" diff --no-ext-diff HEAD -- . ":(exclude)audits/CHANGE_AUDIT.md"
 
 $report = @(
 "# AI Change Audit Report"
diff --git a/js/app.js b/js/app.js
index bc059ed..31521b9 100644
--- a/js/app.js
+++ b/js/app.js
@@ -20,6 +20,8 @@ import { renderTeam, bindTeamEvents } from './pages/team.js';
 import { renderReports, bindReportsEvents } from './pages/reports.js';
 import { renderSettings, bindSettingsEvents } from './pages/settings.js';
 import { renderActivities, bindActivitiesEvents } from './pages/activities.js';
+import { renderRequirements, bindRequirementsEvents } from './pages/requirements.js';
+import { renderProposals, bindProposalsEvents } from './pages/proposals.js';
 
 // ΓöÇΓöÇ DOM References ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
 
@@ -130,6 +132,12 @@ function renderPage(pageId, params) {
     case 'settings':
       contentEl.innerHTML = renderSettings();
       break;
+    case 'requirements':
+      contentEl.innerHTML = renderRequirements();
+      break;
+    case 'proposals':
+      contentEl.innerHTML = renderProposals();
+      break;
     default:
       contentEl.innerHTML = renderComingSoon(pageId);
   }
@@ -147,6 +155,8 @@ bindTeamEvents();
 bindReportsEvents();
 bindSettingsEvents();
 bindActivitiesEvents();
+bindRequirementsEvents();
+bindProposalsEvents();
 
 // ΓöÇΓöÇ Bootstrap ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
 
diff --git a/js/auth.js b/js/auth.js
index 36795a1..941e7b1 100644
--- a/js/auth.js
+++ b/js/auth.js
@@ -14,6 +14,8 @@ const NAV_ITEMS = [
   { id: 'contacts',  label: 'Contacts',   hash: '#/contacts',  icon: 'contacts',  roles: ['manager', 'team_lead', 'employee'] },
   { id: 'deals',     label: 'Deals',      hash: '#/deals',     icon: 'deals',     roles: ['manager', 'team_lead', 'employee'] },
   { id: 'activities',label: 'Activities', hash: '#/activities',icon: 'activities',roles: ['manager', 'team_lead', 'employee'] },
+  { id: 'requirements',label: 'Requirements', hash: '#/requirements',icon: 'requirements',roles: ['manager', 'team_lead', 'employee'] },
+  { id: 'proposals',   label: 'Proposals',  hash: '#/proposals', icon: 'proposals', roles: ['manager', 'team_lead', 'employee'] },
   { id: 'team',      label: 'Team',       hash: '#/team',      icon: 'team',      roles: ['manager', 'team_lead'] },
   { id: 'reports',   label: 'Reports',    hash: '#/reports',   icon: 'reports',   roles: ['manager'] },
   { id: 'settings',  label: 'Settings',   hash: '#/settings',  icon: 'settings',  roles: ['manager', 'team_lead', 'employee'] }
diff --git a/js/components/sidebar.js b/js/components/sidebar.js
index 9cf86aa..9a0825e 100644
--- a/js/components/sidebar.js
+++ b/js/components/sidebar.js
@@ -14,6 +14,8 @@ const NAV_ICONS = {
   contacts:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
   deals:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>',
   activities:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>',
+  requirements: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
+  proposals: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path><path d="M16 18h.01"></path></svg>',
   team:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
   reports:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
   settings:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>'
diff --git a/js/pages/deal-detail.js b/js/pages/deal-detail.js
index f25928c..8c5503f 100644
--- a/js/pages/deal-detail.js
+++ b/js/pages/deal-detail.js
@@ -110,6 +110,44 @@ export function renderDealDetail(params) {
     `;
   }).join('') || '<div class="activity-feed-empty">No activities recorded.</div>';
 
+  const reqs = Store.getRequirementsForUser(user).filter(r => r.dealId === deal.id);
+  const props = Store.getProposalsForUser(user).filter(p => p.dealId === deal.id);
+
+  let reqHtml = reqs.length === 0 ? '<div style="color:var(--color-muted); font-size:0.85rem; margin-bottom:1rem;">No linked requirements.</div>' :
+    reqs.map(r => `
+      <div style="border:1px solid var(--color-hairline-soft); border-radius:4px; padding:8px; margin-bottom:8px; background:var(--color-surface-card);">
+        <div style="font-weight:600; font-size:0.9rem;">${r.title}</div>
+        <div style="font-size:0.8rem; color:var(--color-muted);">Type: ${r.requirementType} | Status: ${r.status}</div>
+      </div>
+    `).join('');
+
+  let propHtml = props.length === 0 ? '<div style="color:var(--color-muted); font-size:0.85rem; margin-bottom:1rem;">No linked proposals.</div>' :
+    props.map(p => `
+      <div style="border:1px solid var(--color-hairline-soft); border-radius:4px; padding:8px; margin-bottom:8px; background:var(--color-surface-card);">
+        <div style="font-weight:600; font-size:0.9rem;">${p.title} <span class="badge badge-neutral" style="font-size:0.7rem;">v${p.version || '1.0'}</span></div>
+        <div style="font-size:0.8rem; color:var(--color-muted);">Status: ${p.status} | Total: ${formatCurrency(p.grandTotal || 0)}</div>
+      </div>
+    `).join('');
+
+  const reqPropSection = `
+    <div class="dashboard-section" style="display:flex; gap:1rem; flex-wrap:wrap;">
+      <div style="flex:1; min-width:300px;">
+        <div class="dashboard-section-header" style="justify-content:space-between; align-items:center;">
+          <h4 class="dashboard-section-title" style="margin:0;">Requirements</h4>
+          <a href="#/requirements" class="btn btn-sm btn-secondary">View All</a>
+        </div>
+        <div>${reqHtml}</div>
+      </div>
+      <div style="flex:1; min-width:300px;">
+        <div class="dashboard-section-header" style="justify-content:space-between; align-items:center;">
+          <h4 class="dashboard-section-title" style="margin:0;">Proposals</h4>
+          <a href="#/proposals" class="btn btn-sm btn-secondary">View All</a>
+        </div>
+        <div>${propHtml}</div>
+      </div>
+    </div>
+  `;
+
   return `
     <div class="content-inner">
       <div class="deal-detail-header">
@@ -128,6 +166,8 @@ export function renderDealDetail(params) {
         </div>
       </div>
 
+      ${reqPropSection}
+
       <div class="dashboard-section">
         <div class="dashboard-section-header" style="justify-content:space-between; align-items:center;">
           <h4 class="dashboard-section-title" style="margin:0;">Activity History</h4>
diff --git a/js/pages/proposals.js b/js/pages/proposals.js
new file mode 100644
index 0000000..46d2713
--- /dev/null
+++ b/js/pages/proposals.js
@@ -0,0 +1,718 @@
+// ============================================================
+// TechnoEdge CRM ΓÇö Proposals Page
+// ============================================================
+
+import { Store } from '../store.js';
+import { Auth } from '../auth.js';
+import { Toast } from '../components/toast.js';
+import { formatCurrency, formatDateTime } from '../utils.js';
+
+let filters = {
+  search: '',
+  status: 'all',
+  approval: 'all',
+  owner: 'all'
+};
+
+const STATUSES = [
+  { key: 'draft', label: 'Draft' },
+  { key: 'sent', label: 'Sent' },
+  { key: 'accepted', label: 'Accepted' },
+  { key: 'rejected', label: 'Rejected' },
+  { key: 'revised', label: 'Revised' }
+];
+
+const APPROVALS = [
+  { key: 'not_required', label: 'Not Required' },
+  { key: 'pending', label: 'Pending' },
+  { key: 'approved', label: 'Approved' },
+  { key: 'rejected', label: 'Rejected' }
+];
+
+let currentLineItems = [];
+
+// ΓöÇΓöÇ Helpers ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+function getFilteredData() {
+  const user = Auth.getCurrentUser();
+  if (!user) return [];
+
+  let props = Store.getProposalsForUser(user);
+
+  if (filters.search) {
+    const term = filters.search.toLowerCase();
+    props = props.filter(p => {
+      const t = (p.title || '').toLowerCase();
+      const u = Store.getUserById(p.assignedTo || p.createdBy);
+      const uName = u ? u.name.toLowerCase() : '';
+      let l = '';
+      if (p.dealId) { const d = Store.getDealById(p.dealId); if (d) l = d.title.toLowerCase(); }
+      if (p.requirementId) { const r = Store.getRequirementById(p.requirementId); if (r) l += ' ' + r.title.toLowerCase(); }
+      return t.includes(term) || uName.includes(term) || l.includes(term);
+    });
+  }
+
+  if (filters.status !== 'all') props = props.filter(p => p.status === filters.status);
+  if (filters.approval !== 'all') props = props.filter(p => p.approvalStatus === filters.approval);
+  if (filters.owner !== 'all') props = props.filter(p => p.assignedTo === filters.owner);
+
+  return props.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
+}
+
+function getLabel(key, array) {
+  const obj = array.find(o => o.key === key);
+  return obj ? obj.label : key;
+}
+
+function getLinkedLabel(p) {
+  if (p.requirementId) {
+    const r = Store.getRequirementById(p.requirementId);
+    return r ? `Req: ${r.title}` : 'Req (Deleted)';
+  }
+  if (p.dealId) {
+    const d = Store.getDealById(p.dealId);
+    return d ? `<a href="#/deals/${d.id}" class="btn-link">Deal: ${d.title}</a>` : 'Deal (Deleted)';
+  }
+  return 'ΓÇö';
+}
+
+function calculateTotals(items) {
+  let sub = 0, disc = 0, tax = 0;
+  items.forEach(it => {
+    const qty = parseFloat(it.quantity) || 0;
+    const up = parseFloat(it.unitPrice) || 0;
+    const dp = parseFloat(it.discountPercent) || 0;
+    const tp = parseFloat(it.taxPercent) || 0;
+    
+    const rowSub = qty * up;
+    const rowDisc = rowSub * (dp / 100);
+    const rowAfterDisc = rowSub - rowDisc;
+    const rowTax = rowAfterDisc * (tp / 100);
+    
+    sub += rowSub;
+    disc += rowDisc;
+    tax += rowTax;
+  });
+  return { subtotal: sub, discountTotal: disc, taxTotal: tax, grandTotal: sub - disc + tax };
+}
+
+// ΓöÇΓöÇ Components ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+function buildKPIs(props) {
+  const total = props.length;
+  const sent = props.filter(p => p.status === 'sent').length;
+  const pending = props.filter(p => p.approvalStatus === 'pending').length;
+  const acceptedValue = props.filter(p => p.status === 'accepted').reduce((sum, p) => sum + (p.grandTotal || 0), 0);
+
+  return `
+    <div class="activity-kpi-grid">
+      <div class="stat-card">
+        <div class="stat-card-content">
+          <div class="stat-card-label">Total Proposals</div>
+          <div class="stat-card-value">${total}</div>
+        </div>
+      </div>
+      <div class="stat-card">
+        <div class="stat-card-content">
+          <div class="stat-card-label" style="color: var(--color-primary);">Sent</div>
+          <div class="stat-card-value">${sent}</div>
+        </div>
+      </div>
+      <div class="stat-card">
+        <div class="stat-card-content">
+          <div class="stat-card-label" style="color: var(--color-warning);">Pending Approval</div>
+          <div class="stat-card-value">${pending}</div>
+        </div>
+      </div>
+      <div class="stat-card">
+        <div class="stat-card-content">
+          <div class="stat-card-label" style="color: var(--color-success);">Accepted Value</div>
+          <div class="stat-card-value">${formatCurrency(acceptedValue)}</div>
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
+  return `
+    <div class="filter-bar">
+      <div style="flex: 1;">
+        <input type="text" id="prop-search" class="login-input" placeholder="Search proposals..." value="${filters.search}">
+      </div>
+      <div>
+        <select id="prop-status" class="login-input" style="padding-right:32px;">
+          <option value="all">All Statuses</option>
+          ${STATUSES.map(s => `<option value="${s.key}" ${filters.status === s.key ? 'selected' : ''}>${s.label}</option>`).join('')}
+        </select>
+      </div>
+      <div>
+        <select id="prop-approval" class="login-input" style="padding-right:32px;">
+          <option value="all">Any Approval</option>
+          ${APPROVALS.map(a => `<option value="${a.key}" ${filters.approval === a.key ? 'selected' : ''}>${a.label}</option>`).join('')}
+        </select>
+      </div>
+      <div>
+        <select id="prop-owner" class="login-input" style="padding-right:32px;">
+          ${ownerOptions}
+        </select>
+      </div>
+      <button class="btn btn-secondary" id="btn-prop-clear">Clear</button>
+    </div>
+  `;
+}
+
+function buildTable(props, user) {
+  const rows = props.map(p => {
+    const owner = Store.getUserById(p.assignedTo || p.createdBy);
+    const ownerName = owner ? owner.name : 'Unknown';
+
+    const canEdit = Store.canUserEditProposal(p, user);
+    const canDelete = user.role === 'manager';
+
+    let actions = '';
+    if (canEdit) actions += `<button class="btn btn-sm btn-secondary" data-action="edit-prop" data-id="${p.id}" style="margin-right:4px;">Edit</button>`;
+    if (canDelete) actions += `<button class="btn btn-sm" style="background:var(--color-error); color:white;" data-action="delete-prop" data-id="${p.id}">Delete</button>`;
+
+    let approvalBadge = 'badge-neutral';
+    if (p.approvalStatus === 'pending') approvalBadge = 'badge-warning';
+    else if (p.approvalStatus === 'approved') approvalBadge = 'badge-success';
+    else if (p.approvalStatus === 'rejected') approvalBadge = 'badge-error';
+
+    return `
+      <tr>
+        <td style="font-weight:600;">${p.title}</td>
+        <td>${getLinkedLabel(p)}</td>
+        <td>v${p.version || '1.0'}</td>
+        <td style="font-weight:bold;">${formatCurrency(p.grandTotal || 0)}</td>
+        <td><span class="badge badge-neutral">${getLabel(p.status, STATUSES)}</span></td>
+        <td><span class="badge ${approvalBadge}">${getLabel(p.approvalStatus, APPROVALS)}</span></td>
+        <td>${ownerName}</td>
+        <td>${p.validUntil ? new Date(p.validUntil).toLocaleDateString() : 'ΓÇö'}</td>
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
+            <th>Proposal</th>
+            <th>Linked To</th>
+            <th>Version</th>
+            <th>Amount</th>
+            <th>Status</th>
+            <th>Approval</th>
+            <th>Owner</th>
+            <th>Valid Until</th>
+            <th style="text-align:right;">Actions</th>
+          </tr>
+        </thead>
+        <tbody>
+          ${rows || '<tr><td colspan="9" style="text-align:center;">No proposals found</td></tr>'}
+        </tbody>
+      </table>
+    </div>
+  `;
+}
+
+// ΓöÇΓöÇ Modal ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+function renderLineItems() {
+  const tbody = document.getElementById('line-items-body');
+  if (!tbody) return;
+
+  tbody.innerHTML = currentLineItems.map((it, i) => `
+    <tr>
+      <td><input type="text" class="login-input li-desc" data-idx="${i}" value="${it.description}" placeholder="Item description"></td>
+      <td style="width:80px;"><input type="number" class="login-input li-qty" data-idx="${i}" value="${it.quantity}" min="1"></td>
+      <td style="width:120px;"><input type="number" class="login-input li-price" data-idx="${i}" value="${it.unitPrice}" min="0" step="0.01"></td>
+      <td style="width:90px;"><input type="number" class="login-input li-disc" data-idx="${i}" value="${it.discountPercent}" min="0" max="100"></td>
+      <td style="width:90px;"><input type="number" class="login-input li-tax" data-idx="${i}" value="${it.taxPercent}" min="0" max="100"></td>
+      <td style="width:40px; text-align:right;"><button class="btn btn-sm btn-remove-li" data-idx="${i}" style="color:var(--color-error); padding:4px;">&times;</button></td>
+    </tr>
+  `).join('');
+
+  updateTotalsDisplay();
+}
+
+function updateTotalsDisplay() {
+  const totals = calculateTotals(currentLineItems);
+  const elSub = document.getElementById('modal-prop-subtotal');
+  const elDisc = document.getElementById('modal-prop-discount');
+  const elTax = document.getElementById('modal-prop-tax');
+  const elGrand = document.getElementById('modal-prop-grand');
+  
+  if (elSub) elSub.textContent = formatCurrency(totals.subtotal);
+  if (elDisc) elDisc.textContent = '-' + formatCurrency(totals.discountTotal);
+  if (elTax) elTax.textContent = '+' + formatCurrency(totals.taxTotal);
+  if (elGrand) elGrand.textContent = formatCurrency(totals.grandTotal);
+}
+
+export function renderProposalModal(propId = null, defaults = {}) {
+  const user = Auth.getCurrentUser();
+  if (!user) return;
+
+  let defaultValid = new Date();
+  defaultValid.setDate(defaultValid.getDate() + 30);
+  const dValidStr = defaultValid.toISOString().split('T')[0];
+
+  let p = {
+    title: defaults.title || '',
+    requirementId: defaults.requirementId || '',
+    dealId: defaults.dealId || '',
+    contactId: defaults.contactId || '',
+    version: defaults.version || '1.0',
+    status: defaults.status || 'draft',
+    approvalStatus: defaults.approvalStatus || 'not_required',
+    validUntil: defaults.validUntil || dValidStr,
+    notes: defaults.notes || '',
+    assignedTo: defaults.assignedTo || user.id,
+    lineItems: defaults.lineItems || []
+  };
+
+  if (propId) {
+    const existing = Store.getProposalById(propId);
+    if (!existing || !Store.canUserEditProposal(existing, user)) {
+      return Toast.error('Error', 'Permission denied or not found.');
+    }
+    p = { ...p, ...existing };
+  }
+
+  currentLineItems = JSON.parse(JSON.stringify(p.lineItems));
+  if (currentLineItems.length === 0) {
+    currentLineItems.push({ id: 'li_' + Date.now(), description: '', quantity: 1, unitPrice: 0, discountPercent: 0, taxPercent: 0 });
+  }
+
+  let ownerOptions = '';
+  if (user.role === 'manager') {
+    ownerOptions = Store.getUsers().map(u => `<option value="${u.id}" ${u.id === p.assignedTo ? 'selected' : ''}>${u.name}</option>`).join('');
+  } else if (user.role === 'team_lead') {
+    const teamUsers = Store.getUsersByTeam(user.teamId).filter(u => u.id !== user.id);
+    teamUsers.push(user);
+    ownerOptions = teamUsers.map(u => `<option value="${u.id}" ${u.id === p.assignedTo ? 'selected' : ''}>${u.name}</option>`).join('');
+  } else {
+    ownerOptions = `<option value="${user.id}" selected>${user.name}</option>`;
+  }
+
+  const isManager = user.role === 'manager';
+
+  const modalHtml = `
+    <div class="modal" id="prop-modal">
+      <div class="modal-content" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
+        <div class="modal-header">
+          <h2 class="modal-title">${propId ? 'Edit Proposal' : 'New Proposal'}</h2>
+          <button class="modal-close" id="btn-close-prop-modal">&times;</button>
+        </div>
+        <div class="modal-body">
+          
+          <div style="display:flex; gap:1rem; margin-bottom:1rem;">
+            <div style="flex:2;">
+              <label class="login-label">Proposal Title <span style="color:red;">*</span></label>
+              <input type="text" id="modal-prop-title" class="login-input" value="${p.title}">
+            </div>
+            <div style="flex:1;">
+              <label class="login-label">Version</label>
+              <input type="text" id="modal-prop-version" class="login-input" value="${p.version}">
+            </div>
+          </div>
+
+          <div style="display:flex; gap:1rem; margin-bottom:1rem;">
+            <div style="flex:1;">
+              <label class="login-label">Requirement (Optional)</label>
+              <select id="modal-prop-req" class="login-input">
+                <option value="">-- None --</option>
+                ${Store.getRequirementsForUser(user).map(r => `<option value="${r.id}" ${r.id === p.requirementId ? 'selected' : ''}>${r.title}</option>`).join('')}
+              </select>
+            </div>
+            <div style="flex:1;">
+              <label class="login-label">Deal (Optional)</label>
+              <select id="modal-prop-deal" class="login-input">
+                <option value="">-- None --</option>
+                ${Store.getDealsForUser(user).map(d => `<option value="${d.id}" ${d.id === p.dealId ? 'selected' : ''}>${d.title}</option>`).join('')}
+              </select>
+            </div>
+            <div style="flex:1;">
+              <label class="login-label">Contact (Optional)</label>
+              <select id="modal-prop-contact" class="login-input">
+                <option value="">-- None --</option>
+                ${Store.getContacts().map(c => `<option value="${c.id}" ${c.id === p.contactId ? 'selected' : ''}>${c.name} (${c.company})</option>`).join('')}
+              </select>
+            </div>
+          </div>
+
+          <div style="display:flex; gap:1rem; margin-bottom:1rem;">
+            <div style="flex:1;">
+              <label class="login-label">Status</label>
+              <select id="modal-prop-status" class="login-input">
+                ${STATUSES.map(s => `<option value="${s.key}" ${p.status === s.key ? 'selected' : ''}>${s.label}</option>`).join('')}
+              </select>
+            </div>
+            <div style="flex:1;">
+              <label class="login-label">Approval Status</label>
+              <select id="modal-prop-approval" class="login-input" ${!isManager ? 'disabled' : ''}>
+                ${APPROVALS.map(a => `<option value="${a.key}" ${p.approvalStatus === a.key ? 'selected' : ''}>${a.label}</option>`).join('')}
+              </select>
+              ${!isManager ? `<div style="font-size:0.75rem; color:var(--color-muted);">Only managers can approve/reject.</div>` : ''}
+            </div>
+            <div style="flex:1;">
+              <label class="login-label">Valid Until</label>
+              <input type="date" id="modal-prop-valid" class="login-input" value="${p.validUntil ? p.validUntil.split('T')[0] : ''}">
+            </div>
+            <div style="flex:1;">
+              <label class="login-label">Assigned To</label>
+              <select id="modal-prop-owner" class="login-input" ${user.role === 'employee' ? 'disabled' : ''}>
+                ${ownerOptions}
+              </select>
+            </div>
+          </div>
+
+          <div style="margin-bottom:1rem; padding-top:1rem; border-top:1px solid var(--color-hairline-soft);">
+            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
+              <h3 style="font-size:1rem; margin:0;">Line Items</h3>
+              <button class="btn btn-sm btn-secondary" id="btn-add-li">Add Item</button>
+            </div>
+            <table class="data-table" style="margin-bottom:0;">
+              <thead>
+                <tr>
+                  <th>Description</th>
+                  <th>Qty</th>
+                  <th>Price</th>
+                  <th>Disc %</th>
+                  <th>Tax %</th>
+                  <th></th>
+                </tr>
+              </thead>
+              <tbody id="line-items-body">
+              </tbody>
+            </table>
+          </div>
+
+          <div class="totals-panel" style="background:var(--color-surface-soft); padding:1rem; border-radius:4px; margin-bottom:1rem; text-align:right; border:1px solid var(--color-hairline-soft);">
+            <div style="display:flex; justify-content:flex-end; gap:2rem;">
+              <div>Subtotal: <strong id="modal-prop-subtotal">$0.00</strong></div>
+              <div style="color:var(--color-error);">Discount: <strong id="modal-prop-discount">-$0.00</strong></div>
+              <div style="color:var(--color-muted);">Tax: <strong id="modal-prop-tax">+$0.00</strong></div>
+              <div style="font-size:1.1rem;">Grand Total: <strong id="modal-prop-grand" style="color:var(--color-primary);">$0.00</strong></div>
+            </div>
+          </div>
+
+          <div style="margin-bottom:1rem;">
+            <label class="login-label">Notes / Terms</label>
+            <textarea id="modal-prop-notes" class="login-input" style="height:60px;">${p.notes}</textarea>
+          </div>
+
+        </div>
+        <div class="modal-footer">
+          <button class="btn btn-secondary" id="btn-cancel-prop-modal">Cancel</button>
+          <button class="btn btn-primary" id="btn-save-prop" data-id="${propId || ''}">Save Proposal</button>
+        </div>
+      </div>
+    </div>
+  `;
+
+  document.body.insertAdjacentHTML('beforeend', modalHtml);
+
+  renderLineItems();
+
+  const m = document.getElementById('prop-modal');
+  
+  m.addEventListener('input', e => {
+    if (e.target.classList.contains('li-desc') || e.target.classList.contains('li-qty') || 
+        e.target.classList.contains('li-price') || e.target.classList.contains('li-disc') || 
+        e.target.classList.contains('li-tax')) {
+      const idx = e.target.dataset.idx;
+      if (idx !== undefined) {
+        if (e.target.classList.contains('li-desc')) currentLineItems[idx].description = e.target.value;
+        if (e.target.classList.contains('li-qty')) currentLineItems[idx].quantity = parseFloat(e.target.value) || 0;
+        if (e.target.classList.contains('li-price')) currentLineItems[idx].unitPrice = parseFloat(e.target.value) || 0;
+        if (e.target.classList.contains('li-disc')) currentLineItems[idx].discountPercent = parseFloat(e.target.value) || 0;
+        if (e.target.classList.contains('li-tax')) currentLineItems[idx].taxPercent = parseFloat(e.target.value) || 0;
+        updateTotalsDisplay();
+      }
+    }
+  });
+
+  document.getElementById('btn-add-li').addEventListener('click', () => {
+    currentLineItems.push({ id: 'li_' + Date.now(), description: '', quantity: 1, unitPrice: 0, discountPercent: 0, taxPercent: 0 });
+    renderLineItems();
+  });
+
+  m.addEventListener('click', e => {
+    if (e.target.classList.contains('btn-remove-li')) {
+      const idx = e.target.dataset.idx;
+      if (idx !== undefined) {
+        currentLineItems.splice(idx, 1);
+        renderLineItems();
+      }
+    }
+  });
+
+  const closeFn = () => { if (m) m.remove(); };
+  document.getElementById('btn-close-prop-modal').addEventListener('click', closeFn);
+  document.getElementById('btn-cancel-prop-modal').addEventListener('click', closeFn);
+
+  document.getElementById('btn-save-prop').addEventListener('click', () => {
+    const title = document.getElementById('modal-prop-title').value.trim();
+    if (!title) return Toast.error('Validation Error', 'Title is required.');
+
+    if (currentLineItems.length === 0) return Toast.error('Validation Error', 'At least one line item is required.');
+
+    // Validate each line item field strictly
+    for (let i = 0; i < currentLineItems.length; i++) {
+      const it = currentLineItems[i];
+      if (!it.description || !it.description.trim()) {
+        return Toast.error('Validation Error', `Line item ${i + 1}: description is required.`);
+      }
+      const qty = parseFloat(it.quantity);
+      if (isNaN(qty) || qty <= 0) {
+        return Toast.error('Validation Error', `Line item ${i + 1}: quantity must be > 0.`);
+      }
+      const up = parseFloat(it.unitPrice);
+      if (isNaN(up) || up < 0) {
+        return Toast.error('Validation Error', `Line item ${i + 1}: unit price must be >= 0.`);
+      }
+      const dp = parseFloat(it.discountPercent);
+      if (isNaN(dp) || dp < 0 || dp > 100) {
+        return Toast.error('Validation Error', `Line item ${i + 1}: discount must be 0-100%.`);
+      }
+      const tp = parseFloat(it.taxPercent);
+      if (isNaN(tp) || tp < 0 || tp > 100) {
+        return Toast.error('Validation Error', `Line item ${i + 1}: tax must be 0-100%.`);
+      }
+    }
+
+    // Recalculate totals from line items ΓÇö never trust DOM display
+    const totals = calculateTotals(currentLineItems);
+
+    // Assignment validation
+    let assignedTo = document.getElementById('modal-prop-owner').value;
+    if (user.role === 'employee') {
+      assignedTo = user.id;
+    } else if (user.role === 'team_lead') {
+      const target = Store.getUserById(assignedTo);
+      if (!target || (target.teamId !== user.teamId && target.id !== user.id)) {
+        return Toast.error('Error', 'Cannot assign outside your team.');
+      }
+    }
+
+    const assignedUser = Store.getUserById(assignedTo);
+    if (!assignedUser) return Toast.error('Validation Error', 'Assigned user does not exist.');
+
+    let finalTeamId = assignedUser.teamId || user.teamId || null;
+
+    // Validate linked records
+    let reqId = document.getElementById('modal-prop-req').value || null;
+    let dealId = document.getElementById('modal-prop-deal').value || null;
+    const contactId = document.getElementById('modal-prop-contact').value || null;
+    let linkedTeamId = null;
+
+    if (reqId) {
+      const r = Store.getRequirementById(reqId);
+      if (!r) return Toast.error('Error', 'Linked Requirement does not exist.');
+      if (!Store.canUserViewRequirement(r, user)) return Toast.error('Error', 'Permission denied for linked Requirement.');
+      if (r.dealId) dealId = r.dealId; // cascade deal link
+      if (r.teamId) linkedTeamId = r.teamId;
+    }
+
+    if (dealId) {
+      const d = Store.getDealById(dealId);
+      if (!d) return Toast.error('Error', 'Linked Deal does not exist.');
+      if (!Auth.canViewRecord(d)) return Toast.error('Error', 'Permission denied for linked Deal.');
+      linkedTeamId = d.teamId;
+    }
+
+    // teamId derivation: assigned user -> linked deal/requirement -> current user
+    if (!finalTeamId && linkedTeamId) finalTeamId = linkedTeamId;
+    if (!finalTeamId) finalTeamId = user.teamId || null;
+
+    if (contactId) {
+      const c = Store.getContactById(contactId);
+      if (!c) return Toast.error('Error', 'Linked Contact does not exist.');
+    }
+
+    let status = document.getElementById('modal-prop-status').value;
+    if (!STATUSES.some(s => s.key === status)) return Toast.error('Validation Error', 'Invalid status.');
+
+    // Approval logic ΓÇö enforced before Store write
+    let needsApproval = currentLineItems.some(it => (parseFloat(it.discountPercent) || 0) > 10);
+
+    let approvalStatus;
+    if (isManager) {
+      approvalStatus = document.getElementById('modal-prop-approval').value;
+      if (!APPROVALS.some(a => a.key === approvalStatus)) {
+        return Toast.error('Validation Error', 'Invalid approval status.');
+      }
+    } else {
+      // Non-manager: cannot set approved/rejected ever
+      if (needsApproval) {
+        approvalStatus = 'pending';
+      } else {
+        approvalStatus = 'not_required';
+      }
+    }
+
+    // Guard: cannot accept a proposal unless approval is cleared
+    if (status === 'accepted' && approvalStatus !== 'approved' && approvalStatus !== 'not_required') {
+      return Toast.error('Validation Error', 'Cannot accept a proposal that is pending approval.');
+    }
+
+    const validUntilRaw = document.getElementById('modal-prop-valid').value;
+    let normalizedValid = null;
+    if (validUntilRaw) {
+      const d = new Date(validUntilRaw);
+      if (isNaN(d.getTime())) {
+        return Toast.error('Validation Error', 'Invalid Valid Until date.');
+      }
+      normalizedValid = d.toISOString();
+    }
+
+    const payload = {
+      title,
+      requirementId: reqId,
+      dealId,
+      contactId,
+      version: document.getElementById('modal-prop-version').value.trim(),
+      status,
+      approvalStatus,
+      validUntil: normalizedValid,
+      notes: document.getElementById('modal-prop-notes').value.trim(),
+      assignedTo,
+      teamId: finalTeamId,
+      lineItems: currentLineItems,
+      subtotal: totals.subtotal,
+      discountTotal: totals.discountTotal,
+      taxTotal: totals.taxTotal,
+      grandTotal: totals.grandTotal,
+      updatedAt: new Date().toISOString()
+    };
+
+    if (propId) {
+      const ex = Store.getProposalById(propId);
+      if (!ex || !Store.canUserEditProposal(ex, user)) return Toast.error('Error', 'Permission denied.');
+
+      if (status === 'accepted' && ex.status !== 'accepted') payload.acceptedAt = new Date().toISOString();
+      if (status === 'rejected' && ex.status !== 'rejected') payload.rejectedAt = new Date().toISOString();
+      if (status === 'sent' && ex.status !== 'sent') payload.sentAt = new Date().toISOString();
+
+      Store.updateProposal(propId, payload);
+      Toast.success('Saved', 'Proposal updated.');
+    } else {
+      payload.id = 'prop_' + Date.now().toString(36);
+      payload.createdBy = user.id;
+      payload.createdAt = new Date().toISOString();
+
+      if (status === 'accepted') payload.acceptedAt = new Date().toISOString();
+      if (status === 'rejected') payload.rejectedAt = new Date().toISOString();
+      if (status === 'sent') payload.sentAt = new Date().toISOString();
+
+      Store.createProposal(payload);
+      Toast.success('Created', 'Proposal added.');
+    }
+
+    if (needsApproval && approvalStatus === 'pending') {
+      Toast.warning('Approval Required', 'Discount exceeds 10%. Proposal is pending approval.');
+    }
+
+    closeFn();
+    reRender();
+  });
+}
+
+// ΓöÇΓöÇ Main Render ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+export function renderProposals() {
+  const user = Auth.getCurrentUser();
+  if (!user) return '';
+
+  const props = getFilteredData();
+
+  return `
+    <div class="content-inner">
+      <div class="page-header">
+        <div>
+          <h1 class="page-header-title">Proposals & Quotations</h1>
+          <p class="page-header-subtitle">Manage commercial offers, line items, and approvals.</p>
+        </div>
+        <button class="btn btn-primary" id="btn-new-prop">New Proposal</button>
+      </div>
+
+      ${buildKPIs(props)}
+      ${buildFilters(user)}
+      ${buildTable(props, user)}
+    </div>
+  `;
+}
+
+function reRender() {
+  const contentEl = document.getElementById('content-area');
+  if (contentEl) contentEl.innerHTML = renderProposals();
+}
+
+export function bindProposalsEvents() {
+  const content = document.getElementById('content-area');
+  if (!content) return;
+
+  content.addEventListener('click', e => {
+    if (e.target.id === 'btn-new-prop') {
+      renderProposalModal();
+      return;
+    }
+    if (e.target.id === 'btn-prop-clear') {
+      filters = { search: '', status: 'all', approval: 'all', owner: 'all' };
+      reRender();
+      return;
+    }
+
+    const action = e.target.dataset.action;
+    const propId = e.target.dataset.id;
+    const user = Auth.getCurrentUser();
+
+    if (action === 'edit-prop') {
+      renderProposalModal(propId);
+    } else if (action === 'delete-prop') {
+      if (!user || user.role !== 'manager') return Toast.error('Denied', 'Only managers can delete proposals.');
+      const p = Store.getProposalById(propId);
+      if (!p) return Toast.error('Error', 'Not found.');
+      if (confirm('Delete this proposal?')) {
+        const success = Store.deleteProposal(propId);
+        if (success !== false) {
+          Toast.success('Deleted', 'Proposal removed.');
+        } else Toast.error('Error', 'Failed to delete.');
+        reRender();
+      }
+    }
+  });
+
+  content.addEventListener('change', e => {
+    if (['prop-status', 'prop-approval', 'prop-owner'].includes(e.target.id)) {
+      filters.status = document.getElementById('prop-status').value;
+      filters.approval = document.getElementById('prop-approval').value;
+      filters.owner = document.getElementById('prop-owner').value;
+      reRender();
+    }
+  });
+
+  content.addEventListener('keyup', e => {
+    if (e.target.id === 'prop-search') {
+      filters.search = e.target.value;
+      reRender();
+    }
+  });
+}
diff --git a/js/pages/requirements.js b/js/pages/requirements.js
new file mode 100644
index 0000000..d0c3713
--- /dev/null
+++ b/js/pages/requirements.js
@@ -0,0 +1,628 @@
+// ============================================================
+// TechnoEdge CRM ΓÇö Requirements Page
+// ============================================================
+
+import { Store } from '../store.js';
+import { Auth } from '../auth.js';
+import { Toast } from '../components/toast.js';
+import { formatDateTime } from '../utils.js';
+
+let filters = {
+  search: '',
+  type: 'all',
+  status: 'all',
+  priority: 'all',
+  owner: 'all'
+};
+
+const REQ_TYPES = [
+  { key: 'training', label: 'Training' },
+  { key: 'elearning', label: 'eLearning' },
+  { key: 'hiring', label: 'Hiring' },
+  { key: 'consulting', label: 'Consulting' },
+  { key: 'other', label: 'Other' }
+];
+
+const REQ_STATUSES = [
+  { key: 'draft', label: 'Draft' },
+  { key: 'captured', label: 'Captured' },
+  { key: 'validated', label: 'Validated' },
+  { key: 'proposal_ready', label: 'Proposal Ready' },
+  { key: 'closed', label: 'Closed' }
+];
+
+const PRIORITIES = [
+  { key: 'low', label: 'Low' },
+  { key: 'medium', label: 'Medium' },
+  { key: 'high', label: 'High' },
+  { key: 'urgent', label: 'Urgent' }
+];
+
+// ΓöÇΓöÇ Helpers ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+function getFilteredData() {
+  const user = Auth.getCurrentUser();
+  if (!user) return [];
+
+  let reqs = Store.getRequirementsForUser(user);
+
+  // Search
+  if (filters.search) {
+    const term = filters.search.toLowerCase();
+    reqs = reqs.filter(r => {
+      const u = Store.getUserById(r.assignedTo || r.createdBy);
+      const uName = u ? u.name.toLowerCase() : '';
+      const t = (r.title || '').toLowerCase();
+      const c = (r.companyName || '').toLowerCase();
+      let l = '';
+      if (r.dealId) { const d = Store.getDealById(r.dealId); if (d) l = d.title.toLowerCase(); }
+      else if (r.leadId) { const ld = Store.getLeadById(r.leadId); if (ld) l = ld.name.toLowerCase() + ' ' + ld.company.toLowerCase(); }
+      return t.includes(term) || c.includes(term) || uName.includes(term) || l.includes(term);
+    });
+  }
+
+  if (filters.type !== 'all') reqs = reqs.filter(r => r.requirementType === filters.type);
+  if (filters.status !== 'all') reqs = reqs.filter(r => r.status === filters.status);
+  if (filters.priority !== 'all') reqs = reqs.filter(r => r.priority === filters.priority);
+  if (filters.owner !== 'all') reqs = reqs.filter(r => r.assignedTo === filters.owner);
+
+  return reqs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
+}
+
+function getLinkedRecordLabel(r) {
+  if (r.dealId) {
+    const d = Store.getDealById(r.dealId);
+    return d ? `<a href="#/deals/${d.id}" class="btn-link">Deal: ${d.title}</a>` : 'Deal (Deleted)';
+  }
+  if (r.leadId) {
+    const ld = Store.getLeadById(r.leadId);
+    return ld ? `Lead: ${ld.name}` : 'Lead (Deleted)';
+  }
+  return 'ΓÇö';
+}
+
+function getLabel(key, array) {
+  const obj = array.find(o => o.key === key);
+  return obj ? obj.label : key;
+}
+
+// ΓöÇΓöÇ Components ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+function buildKPIs(reqs) {
+  const total = reqs.length;
+  const captured = reqs.filter(r => r.status === 'captured').length;
+  const proposalReady = reqs.filter(r => r.status === 'proposal_ready').length;
+  const urgent = reqs.filter(r => r.priority === 'urgent').length;
+
+  return `
+    <div class="activity-kpi-grid">
+      <div class="stat-card">
+        <div class="stat-card-content">
+          <div class="stat-card-label">Total Requirements</div>
+          <div class="stat-card-value">${total}</div>
+        </div>
+      </div>
+      <div class="stat-card">
+        <div class="stat-card-content">
+          <div class="stat-card-label" style="color: var(--color-primary);">Captured</div>
+          <div class="stat-card-value">${captured}</div>
+        </div>
+      </div>
+      <div class="stat-card">
+        <div class="stat-card-content">
+          <div class="stat-card-label" style="color: var(--color-success);">Proposal Ready</div>
+          <div class="stat-card-value">${proposalReady}</div>
+        </div>
+      </div>
+      <div class="stat-card">
+        <div class="stat-card-content">
+          <div class="stat-card-label" style="color: var(--color-error);">Urgent</div>
+          <div class="stat-card-value">${urgent}</div>
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
+  const typeOpts = REQ_TYPES.map(t => `<option value="${t.key}" ${filters.type === t.key ? 'selected' : ''}>${t.label}</option>`).join('');
+  const statusOpts = REQ_STATUSES.map(s => `<option value="${s.key}" ${filters.status === s.key ? 'selected' : ''}>${s.label}</option>`).join('');
+  const priorityOpts = PRIORITIES.map(p => `<option value="${p.key}" ${filters.priority === p.key ? 'selected' : ''}>${p.label}</option>`).join('');
+
+  return `
+    <div class="filter-bar">
+      <div style="flex: 1;">
+        <input type="text" id="req-search" class="login-input" placeholder="Search requirements..." value="${filters.search}">
+      </div>
+      <div>
+        <select id="req-type" class="login-input" style="padding-right:32px;">
+          <option value="all">All Types</option>
+          ${typeOpts}
+        </select>
+      </div>
+      <div>
+        <select id="req-status" class="login-input" style="padding-right:32px;">
+          <option value="all">All Statuses</option>
+          ${statusOpts}
+        </select>
+      </div>
+      <div>
+        <select id="req-priority" class="login-input" style="padding-right:32px;">
+          <option value="all">Any Priority</option>
+          ${priorityOpts}
+        </select>
+      </div>
+      <div>
+        <select id="req-owner" class="login-input" style="padding-right:32px;">
+          ${ownerOptions}
+        </select>
+      </div>
+      <button class="btn btn-secondary" id="btn-req-clear">Clear</button>
+    </div>
+  `;
+}
+
+function buildTable(reqs, user) {
+  const rows = reqs.map(r => {
+    const owner = Store.getUserById(r.assignedTo || r.createdBy);
+    const ownerName = owner ? owner.name : 'Unknown';
+
+    const canEdit = Store.canUserEditRequirement(r, user);
+    const canDelete = user.role === 'manager';
+
+    let actions = '';
+    if (canEdit) actions += `<button class="btn btn-sm btn-secondary" data-action="edit-req" data-id="${r.id}" style="margin-right:4px;">Edit</button>`;
+    if (canDelete) actions += `<button class="btn btn-sm" style="background:var(--color-error); color:white;" data-action="delete-req" data-id="${r.id}">Delete</button>`;
+
+    return `
+      <tr>
+        <td style="font-weight:600;">${r.title}</td>
+        <td>${r.companyName || 'ΓÇö'}</td>
+        <td>${getLinkedRecordLabel(r)}</td>
+        <td>${getLabel(r.requirementType, REQ_TYPES)}</td>
+        <td><span class="badge badge-neutral">${getLabel(r.status, REQ_STATUSES)}</span></td>
+        <td><span class="badge ${r.priority === 'urgent' ? 'badge-error' : 'badge-neutral'}">${getLabel(r.priority, PRIORITIES)}</span></td>
+        <td>${ownerName}</td>
+        <td>${formatDateTime(r.updatedAt)}</td>
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
+            <th>Requirement</th>
+            <th>Company</th>
+            <th>Linked To</th>
+            <th>Type</th>
+            <th>Status</th>
+            <th>Priority</th>
+            <th>Owner</th>
+            <th>Updated</th>
+            <th style="text-align:right;">Actions</th>
+          </tr>
+        </thead>
+        <tbody>
+          ${rows || '<tr><td colspan="9" style="text-align:center;">No requirements found</td></tr>'}
+        </tbody>
+      </table>
+    </div>
+  `;
+}
+
+// ΓöÇΓöÇ Modal ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+export function renderRequirementModal(reqId = null, defaults = {}) {
+  const user = Auth.getCurrentUser();
+  if (!user) return;
+
+  let r = {
+    title: defaults.title || '',
+    dealId: defaults.dealId || '',
+    leadId: defaults.leadId || '',
+    contactId: defaults.contactId || '',
+    companyName: defaults.companyName || '',
+    requirementType: defaults.requirementType || 'training',
+    productInterest: defaults.productInterest || '',
+    audienceSize: defaults.audienceSize || '',
+    deliveryMode: defaults.deliveryMode || 'not_decided',
+    timeline: defaults.timeline || '',
+    budgetRange: defaults.budgetRange || '',
+    decisionMaker: defaults.decisionMaker || '',
+    summary: defaults.summary || '',
+    painPoints: defaults.painPoints || '',
+    successCriteria: defaults.successCriteria || '',
+    status: defaults.status || 'draft',
+    priority: defaults.priority || 'medium',
+    assignedTo: defaults.assignedTo || user.id,
+    linkedType: 'none'
+  };
+
+  if (reqId) {
+    const existing = Store.getRequirementById(reqId);
+    if (!existing || !Store.canUserEditRequirement(existing, user)) {
+      return Toast.error('Error', 'Permission denied or not found.');
+    }
+    r = { ...r, ...existing };
+    if (r.dealId) r.linkedType = 'deal';
+    else if (r.leadId) r.linkedType = 'lead';
+    else r.linkedType = 'none';
+  } else {
+    if (r.dealId) r.linkedType = 'deal';
+    else if (r.leadId) r.linkedType = 'lead';
+  }
+
+  let ownerOptions = '';
+  if (user.role === 'manager') {
+    ownerOptions = Store.getUsers().map(u => `<option value="${u.id}" ${u.id === r.assignedTo ? 'selected' : ''}>${u.name}</option>`).join('');
+  } else if (user.role === 'team_lead') {
+    const teamUsers = Store.getUsersByTeam(user.teamId).filter(u => u.id !== user.id);
+    teamUsers.push(user);
+    ownerOptions = teamUsers.map(u => `<option value="${u.id}" ${u.id === r.assignedTo ? 'selected' : ''}>${u.name}</option>`).join('');
+  } else {
+    ownerOptions = `<option value="${user.id}" selected>${user.name}</option>`;
+  }
+
+  const modalHtml = `
+    <div class="modal" id="req-modal">
+      <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
+        <div class="modal-header">
+          <h2 class="modal-title">${reqId ? 'Edit Requirement' : 'New Requirement'}</h2>
+          <button class="modal-close" id="btn-close-req-modal">&times;</button>
+        </div>
+        <div class="modal-body">
+          
+          <div style="display:flex; gap:1rem; margin-bottom:1rem;">
+            <div style="flex:2;">
+              <label class="login-label">Title <span style="color:red;">*</span></label>
+              <input type="text" id="modal-req-title" class="login-input" value="${r.title}">
+            </div>
+            <div style="flex:1;">
+              <label class="login-label">Status</label>
+              <select id="modal-req-status" class="login-input">
+                ${REQ_STATUSES.map(s => `<option value="${s.key}" ${r.status === s.key ? 'selected' : ''}>${s.label}</option>`).join('')}
+              </select>
+            </div>
+          </div>
+
+          <div style="display:flex; gap:1rem; margin-bottom:1rem;">
+            <div style="flex:1;">
+              <label class="login-label">Linked Record Type</label>
+              <select id="modal-req-linked-type" class="login-input">
+                <option value="none" ${r.linkedType === 'none' ? 'selected' : ''}>None</option>
+                <option value="deal" ${r.linkedType === 'deal' ? 'selected' : ''}>Deal</option>
+                <option value="lead" ${r.linkedType === 'lead' ? 'selected' : ''}>Lead</option>
+              </select>
+            </div>
+            <div style="flex:1;">
+              <label class="login-label">Linked Record</label>
+              <select id="modal-req-linked-id" class="login-input" ${r.linkedType === 'none' ? 'disabled' : ''}></select>
+            </div>
+            <div style="flex:1;">
+              <label class="login-label">Contact (Optional)</label>
+              <select id="modal-req-contact-id" class="login-input">
+                <option value="">-- None --</option>
+                ${Store.getContacts().map(c => `<option value="${c.id}" ${r.contactId === c.id ? 'selected' : ''}>${c.name} (${c.company})</option>`).join('')}
+              </select>
+            </div>
+          </div>
+
+          <div style="display:flex; gap:1rem; margin-bottom:1rem;">
+            <div style="flex:1;">
+              <label class="login-label">Company Name</label>
+              <input type="text" id="modal-req-company" class="login-input" value="${r.companyName}">
+            </div>
+            <div style="flex:1;">
+              <label class="login-label">Requirement Type <span style="color:red;">*</span></label>
+              <select id="modal-req-type" class="login-input">
+                ${REQ_TYPES.map(t => `<option value="${t.key}" ${r.requirementType === t.key ? 'selected' : ''}>${t.label}</option>`).join('')}
+              </select>
+            </div>
+            <div style="flex:1;">
+              <label class="login-label">Priority</label>
+              <select id="modal-req-priority" class="login-input">
+                ${PRIORITIES.map(p => `<option value="${p.key}" ${r.priority === p.key ? 'selected' : ''}>${p.label}</option>`).join('')}
+              </select>
+            </div>
+          </div>
+
+          <div style="display:flex; gap:1rem; margin-bottom:1rem;">
+            <div style="flex:1;">
+              <label class="login-label">Product Interest</label>
+              <input type="text" id="modal-req-product" class="login-input" value="${r.productInterest}">
+            </div>
+            <div style="flex:1;">
+              <label class="login-label">Audience Size</label>
+              <input type="text" id="modal-req-audience" class="login-input" value="${r.audienceSize}">
+            </div>
+            <div style="flex:1;">
+              <label class="login-label">Delivery Mode</label>
+              <select id="modal-req-delivery" class="login-input">
+                <option value="not_decided" ${r.deliveryMode === 'not_decided' ? 'selected' : ''}>Not Decided</option>
+                <option value="online" ${r.deliveryMode === 'online' ? 'selected' : ''}>Online</option>
+                <option value="onsite" ${r.deliveryMode === 'onsite' ? 'selected' : ''}>Onsite</option>
+                <option value="hybrid" ${r.deliveryMode === 'hybrid' ? 'selected' : ''}>Hybrid</option>
+              </select>
+            </div>
+          </div>
+
+          <div style="display:flex; gap:1rem; margin-bottom:1rem;">
+            <div style="flex:1;">
+              <label class="login-label">Timeline</label>
+              <input type="text" id="modal-req-timeline" class="login-input" value="${r.timeline}" placeholder="e.g. Q3 2026">
+            </div>
+            <div style="flex:1;">
+              <label class="login-label">Budget Range</label>
+              <input type="text" id="modal-req-budget" class="login-input" value="${r.budgetRange}" placeholder="e.g. $10k - $20k">
+            </div>
+            <div style="flex:1;">
+              <label class="login-label">Decision Maker</label>
+              <input type="text" id="modal-req-decision" class="login-input" value="${r.decisionMaker}">
+            </div>
+          </div>
+
+          <div style="margin-bottom:1rem;">
+            <label class="login-label">Summary <span style="color:red;">*</span></label>
+            <textarea id="modal-req-summary" class="login-input" style="height:60px;" required>${r.summary}</textarea>
+          </div>
+          <div style="display:flex; gap:1rem; margin-bottom:1rem;">
+            <div style="flex:1;">
+              <label class="login-label">Pain Points</label>
+              <textarea id="modal-req-pain" class="login-input" style="height:60px;">${r.painPoints}</textarea>
+            </div>
+            <div style="flex:1;">
+              <label class="login-label">Success Criteria</label>
+              <textarea id="modal-req-success" class="login-input" style="height:60px;">${r.successCriteria}</textarea>
+            </div>
+          </div>
+
+          <div style="margin-bottom:1rem;">
+            <label class="login-label">Assigned To</label>
+            <select id="modal-req-owner" class="login-input" ${user.role === 'employee' ? 'disabled' : ''}>
+              ${ownerOptions}
+            </select>
+          </div>
+
+        </div>
+        <div class="modal-footer">
+          <button class="btn btn-secondary" id="btn-cancel-req-modal">Cancel</button>
+          <button class="btn btn-primary" id="btn-save-req" data-id="${reqId || ''}">Save</button>
+        </div>
+      </div>
+    </div>
+  `;
+
+  document.body.insertAdjacentHTML('beforeend', modalHtml);
+
+  const populateLinked = (type, selId) => {
+    const sel = document.getElementById('modal-req-linked-id');
+    if (!sel) return;
+    if (type === 'none') {
+      sel.innerHTML = '<option value="">-- None --</option>';
+      sel.disabled = true;
+      return;
+    }
+    sel.disabled = false;
+    let options = [];
+    if (type === 'deal') {
+      options = Store.getDealsForUser(user).map(d => `<option value="${d.id}" ${d.id === selId ? 'selected' : ''}>${d.title}</option>`);
+    } else if (type === 'lead') {
+      options = Store.getLeadsForUser(user).map(l => `<option value="${l.id}" ${l.id === selId ? 'selected' : ''}>${l.name} (${l.company})</option>`);
+    }
+    sel.innerHTML = options.length ? options.join('') : '<option value="">-- No records --</option>';
+  };
+
+  const initialLinkedId = r.linkedType === 'deal' ? r.dealId : (r.linkedType === 'lead' ? r.leadId : null);
+  populateLinked(r.linkedType, initialLinkedId);
+
+  document.getElementById('modal-req-linked-type').addEventListener('change', e => {
+    populateLinked(e.target.value, null);
+  });
+
+  const closeFn = () => { const m = document.getElementById('req-modal'); if (m) m.remove(); };
+  document.getElementById('btn-close-req-modal').addEventListener('click', closeFn);
+  document.getElementById('btn-cancel-req-modal').addEventListener('click', closeFn);
+
+  document.getElementById('btn-save-req').addEventListener('click', () => {
+    const title = document.getElementById('modal-req-title').value.trim();
+    const type = document.getElementById('modal-req-type').value;
+    const summary = document.getElementById('modal-req-summary').value.trim();
+    if (!title || !type || !summary) return Toast.error('Validation Error', 'Title, Type, and Summary are required.');
+
+    // Validate enums
+    if (!REQ_TYPES.some(t => t.key === type)) return Toast.error('Validation Error', 'Invalid requirement type.');
+    const statusVal = document.getElementById('modal-req-status').value;
+    if (!REQ_STATUSES.some(s => s.key === statusVal)) return Toast.error('Validation Error', 'Invalid status.');
+    const priorityVal = document.getElementById('modal-req-priority').value;
+    if (!PRIORITIES.some(p => p.key === priorityVal)) return Toast.error('Validation Error', 'Invalid priority.');
+
+    const linkedType = document.getElementById('modal-req-linked-type').value;
+    if (!['none', 'deal', 'lead'].includes(linkedType)) return Toast.error('Validation Error', 'Invalid linked type.');
+    const linkedId = document.getElementById('modal-req-linked-id').value;
+    if (linkedType !== 'none' && !linkedId) return Toast.error('Validation Error', 'Valid linked record is required.');
+
+    let dealTeamId = null;
+
+    // Validate linked records internally
+    if (linkedType === 'deal') {
+      const d = Store.getDealById(linkedId);
+      if (!d) return Toast.error('Error', 'Linked Deal does not exist.');
+      if (!Auth.canViewRecord(d)) return Toast.error('Error', 'Permission denied for linked Deal.');
+      dealTeamId = d.teamId;
+    } else if (linkedType === 'lead') {
+      const ld = Store.getLeadById(linkedId);
+      if (!ld) return Toast.error('Error', 'Linked Lead does not exist.');
+      if (!Auth.canViewRecord(ld)) return Toast.error('Error', 'Permission denied for linked Lead.');
+      const assignee = Store.getUserById(ld.assignedTo);
+      if (assignee) dealTeamId = assignee.teamId;
+    }
+
+    const contactId = document.getElementById('modal-req-contact-id').value || null;
+    if (contactId) {
+      const c = Store.getContactById(contactId);
+      if (!c) return Toast.error('Error', 'Linked Contact does not exist.');
+    }
+
+    // Assignment validation
+    let assignedTo = document.getElementById('modal-req-owner').value;
+    if (user.role === 'employee') {
+      assignedTo = user.id;
+    } else if (user.role === 'team_lead') {
+      const target = Store.getUserById(assignedTo);
+      if (!target || (target.teamId !== user.teamId && target.id !== user.id)) {
+        return Toast.error('Error', 'Cannot assign outside your team.');
+      }
+    }
+
+    const assignedUser = Store.getUserById(assignedTo);
+    if (!assignedUser) return Toast.error('Validation Error', 'Assigned user does not exist.');
+
+    // Derive teamId
+    let finalTeamId = assignedUser.teamId || null;
+    if (!finalTeamId && dealTeamId) finalTeamId = dealTeamId;
+    if (!finalTeamId) finalTeamId = user.teamId || null;
+
+    const deliveryMode = document.getElementById('modal-req-delivery').value;
+    if (!['not_decided', 'online', 'onsite', 'hybrid'].includes(deliveryMode)) {
+      return Toast.error('Validation Error', 'Invalid delivery mode.');
+    }
+
+    const payload = {
+      title,
+      requirementType: type,
+      status: statusVal,
+      priority: priorityVal,
+      dealId: linkedType === 'deal' ? linkedId : null,
+      leadId: linkedType === 'lead' ? linkedId : null,
+      contactId,
+      companyName: document.getElementById('modal-req-company').value.trim(),
+      productInterest: document.getElementById('modal-req-product').value.trim(),
+      audienceSize: document.getElementById('modal-req-audience').value.trim(),
+      deliveryMode,
+      timeline: document.getElementById('modal-req-timeline').value.trim(),
+      budgetRange: document.getElementById('modal-req-budget').value.trim(),
+      decisionMaker: document.getElementById('modal-req-decision').value.trim(),
+      summary,
+      painPoints: document.getElementById('modal-req-pain').value.trim(),
+      successCriteria: document.getElementById('modal-req-success').value.trim(),
+      assignedTo,
+      teamId: finalTeamId,
+      updatedAt: new Date().toISOString()
+    };
+
+    if (reqId) {
+      const ex = Store.getRequirementById(reqId);
+      if (!ex || !Store.canUserEditRequirement(ex, user)) return Toast.error('Error', 'Permission denied.');
+      Store.updateRequirement(reqId, payload);
+      Toast.success('Saved', 'Requirement updated.');
+    } else {
+      payload.id = 'req_' + Date.now().toString(36);
+      payload.createdBy = user.id;
+      payload.createdAt = new Date().toISOString();
+      Store.createRequirement(payload);
+      Toast.success('Created', 'Requirement added.');
+    }
+    closeFn();
+    reRender();
+  });
+}
+
+// ΓöÇΓöÇ Main Render ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+export function renderRequirements() {
+  const user = Auth.getCurrentUser();
+  if (!user) return '';
+
+  const reqs = getFilteredData();
+
+  return `
+    <div class="content-inner">
+      <div class="page-header">
+        <div>
+          <h1 class="page-header-title">Requirements</h1>
+          <p class="page-header-subtitle">Capture and validate detailed client requirements.</p>
+        </div>
+        <button class="btn btn-primary" id="btn-new-req">New Requirement</button>
+      </div>
+
+      ${buildKPIs(reqs)}
+      ${buildFilters(user)}
+      ${buildTable(reqs, user)}
+    </div>
+  `;
+}
+
+function reRender() {
+  const contentEl = document.getElementById('content-area');
+  if (contentEl) contentEl.innerHTML = renderRequirements();
+}
+
+export function bindRequirementsEvents() {
+  const content = document.getElementById('content-area');
+  if (!content) return;
+
+  content.addEventListener('click', e => {
+    if (e.target.id === 'btn-new-req') {
+      renderRequirementModal();
+      return;
+    }
+    if (e.target.id === 'btn-req-clear') {
+      filters = { search: '', type: 'all', status: 'all', priority: 'all', owner: 'all' };
+      reRender();
+      return;
+    }
+
+    const action = e.target.dataset.action;
+    const reqId = e.target.dataset.id;
+    const user = Auth.getCurrentUser();
+
+    if (action === 'edit-req') {
+      renderRequirementModal(reqId);
+    } else if (action === 'delete-req') {
+      if (!user || user.role !== 'manager') return Toast.error('Denied', 'Only managers can delete requirements.');
+      const r = Store.getRequirementById(reqId);
+      if (!r) return Toast.error('Error', 'Not found.');
+      if (confirm('Delete this requirement?')) {
+        const success = Store.deleteRequirement(reqId);
+        if (success !== false) {
+          Toast.success('Deleted', 'Requirement removed.');
+        } else Toast.error('Error', 'Failed to delete.');
+        reRender();
+      }
+    }
+  });
+
+  content.addEventListener('change', e => {
+    if (['req-type', 'req-status', 'req-priority', 'req-owner'].includes(e.target.id)) {
+      filters.type = document.getElementById('req-type').value;
+      filters.status = document.getElementById('req-status').value;
+      filters.priority = document.getElementById('req-priority').value;
+      filters.owner = document.getElementById('req-owner').value;
+      reRender();
+    }
+  });
+
+  content.addEventListener('keyup', e => {
+    if (e.target.id === 'req-search') {
+      filters.search = e.target.value;
+      reRender();
+    }
+  });
+}
diff --git a/js/pages/settings.js b/js/pages/settings.js
index b30425d..52da186 100644
--- a/js/pages/settings.js
+++ b/js/pages/settings.js
@@ -19,7 +19,9 @@ function getDataSummary() {
     leads: Store.getLeads().length,
     contacts: Store.getContacts().length,
     deals: Store.getDeals().length,
-    activities: Store.getActivities().length
+    activities: Store.getActivities().length,
+    requirements: Store.getRequirements().length,
+    proposals: Store.getProposals().length
   };
 }
 
@@ -108,7 +110,9 @@ function buildDataSummaryCard(user) {
     { label: 'Leads', count: summary.leads, color: 'var(--color-stage-sourcing)' },
     { label: 'Contacts', count: summary.contacts, color: 'var(--color-stage-delivery)' },
     { label: 'Deals', count: summary.deals, color: 'var(--color-stage-feedback)' },
-    { label: 'Activities', count: summary.activities, color: 'var(--color-stage-invoice)' }
+    { label: 'Activities', count: summary.activities, color: 'var(--color-stage-invoice)' },
+    { label: 'Requirements', count: summary.requirements, color: 'var(--color-primary)' },
+    { label: 'Proposals', count: summary.proposals, color: 'var(--color-success)' }
   ];
 
   const itemsHtml = items.map(i => `
@@ -125,7 +129,7 @@ function buildDataSummaryCard(user) {
         <p style="margin:0.25rem 0 0; font-size:0.85rem; color:var(--color-muted);">${label}</p>
       </div>
       <div style="padding:1.5rem;">
-        <div style="display:grid; grid-template-columns:repeat(6, 1fr); gap:1rem;">
+        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:1rem;">
           ${itemsHtml}
         </div>
       </div>
@@ -384,12 +388,19 @@ function handleImportJson() {
 
     // Validate structure
     const requiredKeys = ['users', 'teams', 'leads', 'contacts', 'deals', 'activities'];
+    const optionalArrayKeys = ['requirements', 'proposals'];
     for (const key of requiredKeys) {
       if (!Array.isArray(payload[key])) {
         Toast.error('Invalid Structure', `Missing or invalid "${key}" array in import file.`);
         return;
       }
     }
+    for (const key of optionalArrayKeys) {
+      if (payload[key] !== undefined && !Array.isArray(payload[key])) {
+        Toast.error('Invalid Structure', `"${key}" must be an array if present.`);
+        return;
+      }
+    }
 
     if (!confirm('This will replace ALL existing CRM data with the imported data. Continue?')) {
       return;
diff --git a/js/router.js b/js/router.js
index bb3955e..b8daed5 100644
--- a/js/router.js
+++ b/js/router.js
@@ -15,6 +15,8 @@ const ROUTES = {
   'contacts':  { pageId: 'contacts',  title: 'Contacts' },
   'deals':     { pageId: 'deals',     title: 'Deals' },
   'activities':{ pageId: 'activities',title: 'Activities' },
+  'requirements':{ pageId: 'requirements',title: 'Requirements' },
+  'proposals': { pageId: 'proposals', title: 'Proposals' },
   'team':      { pageId: 'team',      title: 'Team' },
   'reports':   { pageId: 'reports',   title: 'Reports' },
   'settings':  { pageId: 'settings',  title: 'Settings' }
diff --git a/js/seed.js b/js/seed.js
index 2b97097..e978d8c 100644
--- a/js/seed.js
+++ b/js/seed.js
@@ -377,6 +377,102 @@ export function seedData() {
     }
   ];
 
+  const requirements = [
+    {
+      id: generateId(),
+      title: 'Cloud Architecture Training',
+      dealId: 'deal_01',
+      companyName: 'Infosys',
+      requirementType: 'training',
+      status: 'proposal_ready',
+      priority: 'high',
+      summary: 'Need comprehensive AWS architecture training for 50 senior developers.',
+      assignedTo: 'usr_emp_01',
+      teamId: 'team_01',
+      createdBy: 'usr_emp_01',
+      createdAt: daysAgo(10),
+      updatedAt: daysAgo(8)
+    },
+    {
+      id: generateId(),
+      title: 'eLearning Module for Onboarding',
+      dealId: 'deal_02',
+      companyName: 'TCS',
+      requirementType: 'elearning',
+      status: 'captured',
+      priority: 'medium',
+      summary: 'Develop custom SCORM compliant modules for new joiner onboarding.',
+      assignedTo: 'usr_emp_02',
+      teamId: 'team_01',
+      createdBy: 'usr_emp_02',
+      createdAt: daysAgo(5),
+      updatedAt: daysAgo(4)
+    },
+    {
+      id: generateId(),
+      title: 'IT Recruitment Drive',
+      leadId: leads[2].id,
+      companyName: leads[2].company,
+      requirementType: 'hiring',
+      status: 'draft',
+      priority: 'urgent',
+      summary: 'Immediate requirement for 10 full-stack engineers.',
+      assignedTo: 'usr_emp_03',
+      teamId: 'team_02',
+      createdBy: 'usr_emp_03',
+      createdAt: daysAgo(2),
+      updatedAt: daysAgo(1)
+    }
+  ];
+
+  const proposals = [
+    {
+      id: generateId(),
+      title: 'Infosys AWS Training Proposal',
+      requirementId: requirements[0].id,
+      dealId: 'deal_01',
+      version: '1.0',
+      status: 'sent',
+      approvalStatus: 'approved',
+      validUntil: new Date(Date.now() + 86400000 * 15).toISOString(),
+      assignedTo: 'usr_emp_01',
+      teamId: 'team_01',
+      createdBy: 'usr_emp_01',
+      createdAt: daysAgo(8),
+      updatedAt: daysAgo(8),
+      lineItems: [
+        { id: generateId(), description: 'AWS Architect Training (5 days)', quantity: 1, unitPrice: 15000, discountPercent: 5, taxPercent: 18 },
+        { id: generateId(), description: 'Certification Vouchers', quantity: 50, unitPrice: 200, discountPercent: 0, taxPercent: 18 }
+      ],
+      subtotal: 25000,
+      discountTotal: 750,
+      taxTotal: 4365,
+      grandTotal: 28615
+    },
+    {
+      id: generateId(),
+      title: 'TCS Custom eLearning',
+      requirementId: requirements[1].id,
+      dealId: 'deal_02',
+      version: '1.0',
+      status: 'draft',
+      approvalStatus: 'pending',
+      validUntil: new Date(Date.now() + 86400000 * 30).toISOString(),
+      assignedTo: 'usr_emp_02',
+      teamId: 'team_01',
+      createdBy: 'usr_emp_02',
+      createdAt: daysAgo(4),
+      updatedAt: daysAgo(4),
+      lineItems: [
+        { id: generateId(), description: 'SCORM Module Development', quantity: 3, unitPrice: 5000, discountPercent: 15, taxPercent: 18 }
+      ],
+      subtotal: 15000,
+      discountTotal: 2250,
+      taxTotal: 2295,
+      grandTotal: 15045
+    }
+  ];
+
   // ΓöÇΓöÇ Persist ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
   users.forEach(u      => Store.createUser(u));
   teams.forEach(t      => Store.createTeam(t));
@@ -384,6 +480,8 @@ export function seedData() {
   contacts.forEach(c   => Store.createContact(c));
   deals.forEach(d      => Store.createDeal(d));
   activities.forEach(a => Store.createActivity(a));
+  requirements.forEach(r => Store.createRequirement(r));
+  proposals.forEach(p => Store.createProposal(p));
 
   Store.markSeeded();
   console.log('TechnoEdge CRM: Demo data seeded successfully.');
diff --git a/js/store.js b/js/store.js
index 1b6321f..cd939fb 100644
--- a/js/store.js
+++ b/js/store.js
@@ -12,6 +12,8 @@ const KEYS = {
   contacts:   STORAGE_PREFIX + 'contacts',
   deals:      STORAGE_PREFIX + 'deals',
   activities: STORAGE_PREFIX + 'activities',
+  requirements: STORAGE_PREFIX + 'requirements',
+  proposals:  STORAGE_PREFIX + 'proposals',
   session:    STORAGE_PREFIX + 'session',
   settings:   STORAGE_PREFIX + 'settings',
   seeded:     STORAGE_PREFIX + 'seeded'
@@ -253,6 +255,117 @@ export const Store = {
     }
   },
 
+  // ΓöÇΓöÇ Requirements ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+  getRequirements() { return getAll(KEYS.requirements); },
+  getRequirementById(id) { return getById(KEYS.requirements, id); },
+  createRequirement(req) { return create(KEYS.requirements, req); },
+  updateRequirement(id, updates) { return update(KEYS.requirements, id, updates); },
+  deleteRequirement(id) { return remove(KEYS.requirements, id); },
+
+  getRequirementsForUser(user) {
+    if (!user) return [];
+    const reqs = Store.getRequirements();
+    if (user.role === 'manager') return reqs;
+
+    const deals = Store.getDealsForUser(user);
+    const dealIds = new Set(deals.map(d => d.id));
+    const leads = Store.getLeadsForUser(user);
+    const leadIds = new Set(leads.map(l => l.id));
+
+    if (user.role === 'team_lead') {
+      const teamUserIds = new Set(Store.getUsersByTeam(user.teamId).map(u => u.id));
+      teamUserIds.add(user.id);
+
+      return reqs.filter(r => {
+        if (r.teamId === user.teamId) return true;
+        if (teamUserIds.has(r.assignedTo) || teamUserIds.has(r.createdBy)) return true;
+        if (r.dealId && dealIds.has(r.dealId)) return true;
+        if (r.leadId && leadIds.has(r.leadId)) return true;
+        return false;
+      });
+    }
+
+    // Employee
+    return reqs.filter(r => {
+      if (r.assignedTo === user.id || r.createdBy === user.id) return true;
+      if (r.dealId && dealIds.has(r.dealId)) return true;
+      if (r.leadId && leadIds.has(r.leadId)) return true;
+      return false;
+    });
+  },
+
+  canUserViewRequirement(req, user) {
+    if (!req || !user) return false;
+    if (user.role === 'manager') return true;
+    const reqs = Store.getRequirementsForUser(user);
+    return reqs.some(r => r.id === req.id);
+  },
+
+  canUserEditRequirement(req, user) {
+    if (!req || !user) return false;
+    if (user.role === 'manager') return true;
+    if (user.role === 'team_lead') {
+      return Store.canUserViewRequirement(req, user);
+    }
+    return req.assignedTo === user.id || req.createdBy === user.id;
+  },
+
+  // ΓöÇΓöÇ Proposals ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+  getProposals() { return getAll(KEYS.proposals); },
+  getProposalById(id) { return getById(KEYS.proposals, id); },
+  createProposal(prop) { return create(KEYS.proposals, prop); },
+  updateProposal(id, updates) { return update(KEYS.proposals, id, updates); },
+  deleteProposal(id) { return remove(KEYS.proposals, id); },
+
+  getProposalsForUser(user) {
+    if (!user) return [];
+    const props = Store.getProposals();
+    if (user.role === 'manager') return props;
+
+    const deals = Store.getDealsForUser(user);
+    const dealIds = new Set(deals.map(d => d.id));
+
+    const visibleReqs = Store.getRequirementsForUser(user);
+    const visibleReqIds = new Set(visibleReqs.map(r => r.id));
+
+    if (user.role === 'team_lead') {
+      const teamUserIds = new Set(Store.getUsersByTeam(user.teamId).map(u => u.id));
+      teamUserIds.add(user.id);
+
+      return props.filter(p => {
+        if (p.teamId === user.teamId) return true;
+        if (teamUserIds.has(p.assignedTo) || teamUserIds.has(p.createdBy)) return true;
+        if (p.dealId && dealIds.has(p.dealId)) return true;
+        if (p.requirementId && visibleReqIds.has(p.requirementId)) return true;
+        return false;
+      });
+    }
+
+    // Employee
+    return props.filter(p => {
+      if (p.assignedTo === user.id || p.createdBy === user.id) return true;
+      if (p.dealId && dealIds.has(p.dealId)) return true;
+      if (p.requirementId && visibleReqIds.has(p.requirementId)) return true;
+      return false;
+    });
+  },
+
+  canUserViewProposal(prop, user) {
+    if (!prop || !user) return false;
+    if (user.role === 'manager') return true;
+    const props = Store.getProposalsForUser(user);
+    return props.some(p => p.id === prop.id);
+  },
+
+  canUserEditProposal(prop, user) {
+    if (!prop || !user) return false;
+    if (user.role === 'manager') return true;
+    if (user.role === 'team_lead') {
+      return Store.canUserViewProposal(prop, user);
+    }
+    return prop.assignedTo === user.id || prop.createdBy === user.id;
+  },
+
   // ΓöÇΓöÇ Export / Import ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
   exportData() {
     return {
@@ -262,6 +375,8 @@ export const Store = {
       contacts: getAll(KEYS.contacts),
       deals: getAll(KEYS.deals),
       activities: getAll(KEYS.activities),
+      requirements: getAll(KEYS.requirements),
+      proposals: getAll(KEYS.proposals),
       settings: Store.getSettings(),
       exportedAt: new Date().toISOString()
     };
@@ -269,15 +384,17 @@ export const Store = {
 
   importData(payload) {
     // Pre-serialize all datasets before touching localStorage
-    const dataKeys = [KEYS.users, KEYS.teams, KEYS.leads, KEYS.contacts, KEYS.deals, KEYS.activities, KEYS.settings];
+    const dataKeys = [KEYS.users, KEYS.teams, KEYS.leads, KEYS.contacts, KEYS.deals, KEYS.activities, KEYS.requirements, KEYS.proposals, KEYS.settings];
     const newValues = {
-      [KEYS.users]:      JSON.stringify(payload.users || []),
-      [KEYS.teams]:      JSON.stringify(payload.teams || []),
-      [KEYS.leads]:      JSON.stringify(payload.leads || []),
-      [KEYS.contacts]:   JSON.stringify(payload.contacts || []),
-      [KEYS.deals]:      JSON.stringify(payload.deals || []),
-      [KEYS.activities]: JSON.stringify(payload.activities || []),
-      [KEYS.settings]:   JSON.stringify(payload.settings || {})
+      [KEYS.users]:        JSON.stringify(payload.users || []),
+      [KEYS.teams]:        JSON.stringify(payload.teams || []),
+      [KEYS.leads]:        JSON.stringify(payload.leads || []),
+      [KEYS.contacts]:     JSON.stringify(payload.contacts || []),
+      [KEYS.deals]:        JSON.stringify(payload.deals || []),
+      [KEYS.activities]:   JSON.stringify(payload.activities || []),
+      [KEYS.requirements]: JSON.stringify(payload.requirements || []),
+      [KEYS.proposals]:    JSON.stringify(payload.proposals || []),
+      [KEYS.settings]:     JSON.stringify(payload.settings || {})
     };
 
     // Back up existing values
```

## Tests Run
```text
Browser preview performed externally: Manager, Team Lead, and Employee requirement/proposal visibility and actions checked; proposal totals and approval rules checked
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
