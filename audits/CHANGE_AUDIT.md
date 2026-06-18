# AI Change Audit Report

## Generated On
2026-06-18_10-55-56

## Branch
main

## Baseline Commit
33db6db

## Task Summary
Phase 2D Billing, Payment, and Renewal Tracker with role-scoped invoices, payment guardrails, renewal tracking, deal-detail billing creation, and settings export/import support

## Git Status
```text
 M audits/CHANGE_AUDIT.md
 M js/app.js
 M js/auth.js
 M js/components/sidebar.js
 A js/pages/billing.js
 M js/pages/deal-detail.js
 M js/pages/settings.js
 M js/router.js
 M js/seed.js
 M js/store.js
```

## Files Changed
```text
M	js/app.js
M	js/auth.js
M	js/components/sidebar.js
A	js/pages/billing.js
M	js/pages/deal-detail.js
M	js/pages/settings.js
M	js/router.js
M	js/seed.js
M	js/store.js
```

## Change Summary
```text
 js/app.js                |   6 +
 js/auth.js               |   1 +
 js/components/sidebar.js |   1 +
 js/pages/billing.js      | 949 +++++++++++++++++++++++++++++++++++++++++++++++
 js/pages/deal-detail.js  |  59 +++
 js/pages/settings.js     |   8 +-
 js/router.js             |   1 +
 js/seed.js               | 101 +++++
 js/store.js              |  60 ++-
 9 files changed, 1182 insertions(+), 4 deletions(-)
```

## Full Diff
```diff
diff --git a/js/app.js b/js/app.js
index 80c1727..e634561 100644
--- a/js/app.js
+++ b/js/app.js
@@ -23,6 +23,7 @@ import { renderActivities, bindActivitiesEvents } from './pages/activities.js';
 import { renderRequirements, bindRequirementsEvents } from './pages/requirements.js';
 import { renderProposals, bindProposalsEvents } from './pages/proposals.js';
 import { renderHandoffs, bindHandoffsEvents, initHandoffsPage } from './pages/handoffs.js';
+import { renderBilling, bindBillingEvents, initBillingPage } from './pages/billing.js';
 
 // ΓöÇΓöÇ DOM References ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
 
@@ -143,6 +144,10 @@ function renderPage(pageId, params) {
       contentEl.innerHTML = renderHandoffs();
       initHandoffsPage();
       break;
+    case 'billing':
+      contentEl.innerHTML = renderBilling();
+      initBillingPage();
+      break;
     default:
       contentEl.innerHTML = renderComingSoon(pageId);
   }
@@ -163,6 +168,7 @@ bindActivitiesEvents();
 bindRequirementsEvents();
 bindProposalsEvents();
 bindHandoffsEvents();
+bindBillingEvents();
 
 // ΓöÇΓöÇ Bootstrap ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
 
diff --git a/js/auth.js b/js/auth.js
index b2a2475..dba8941 100644
--- a/js/auth.js
+++ b/js/auth.js
@@ -17,6 +17,7 @@ const NAV_ITEMS = [
   { id: 'requirements',label: 'Requirements', hash: '#/requirements',icon: 'requirements',roles: ['manager', 'team_lead', 'employee'] },
   { id: 'proposals',   label: 'Proposals',  hash: '#/proposals', icon: 'proposals', roles: ['manager', 'team_lead', 'employee'] },
   { id: 'handoffs',    label: 'Project Handoff',hash: '#/handoffs',  icon: 'handoffs',  roles: ['manager', 'team_lead', 'employee'] },
+  { id: 'billing',     label: 'Billing & Renewals',hash: '#/billing',icon: 'billing',   roles: ['manager', 'team_lead', 'employee'] },
   { id: 'team',      label: 'Team',       hash: '#/team',      icon: 'team',      roles: ['manager', 'team_lead'] },
   { id: 'reports',   label: 'Reports',    hash: '#/reports',   icon: 'reports',   roles: ['manager'] },
   { id: 'settings',  label: 'Settings',   hash: '#/settings',  icon: 'settings',  roles: ['manager', 'team_lead', 'employee'] }
diff --git a/js/components/sidebar.js b/js/components/sidebar.js
index be95498..207e4ea 100644
--- a/js/components/sidebar.js
+++ b/js/components/sidebar.js
@@ -17,6 +17,7 @@ const NAV_ICONS = {
   requirements: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
   proposals: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path><path d="M16 18h.01"></path></svg>',
   handoffs:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>',
+  billing:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>',
   team:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
   reports:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
   settings:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>'
diff --git a/js/pages/billing.js b/js/pages/billing.js
new file mode 100644
index 0000000..b0006b0
--- /dev/null
+++ b/js/pages/billing.js
@@ -0,0 +1,949 @@
+// ============================================================
+// TechnoEdge CRM ΓÇö Invoice, Payment & Renewal Tracker
+// ============================================================
+
+import { Store } from '../store.js';
+import { Auth } from '../auth.js';
+import { generateId, formatDate, formatCurrency } from '../utils.js';
+import { Toast } from '../components/toast.js';
+
+const PAYMENT_STATUSES = [
+  { key: 'draft', label: 'Draft' },
+  { key: 'invoiced', label: 'Invoiced' },
+  { key: 'partially_paid', label: 'Partially Paid' },
+  { key: 'paid', label: 'Paid' },
+  { key: 'overdue', label: 'Overdue' },
+  { key: 'cancelled', label: 'Cancelled' }
+];
+
+const PAYMENT_MODES = [
+  { key: 'not_recorded', label: 'Not Recorded' },
+  { key: 'bank_transfer', label: 'Bank Transfer' },
+  { key: 'upi', label: 'UPI' },
+  { key: 'cheque', label: 'Cheque' },
+  { key: 'cash', label: 'Cash' },
+  { key: 'card', label: 'Card' }
+];
+
+const RENEWAL_STATUSES = [
+  { key: 'none', label: 'None' },
+  { key: 'renewal_due', label: 'Renewal Due' },
+  { key: 'renewal_contacted', label: 'Renewal Contacted' },
+  { key: 'renewal_interested', label: 'Renewal Interested' },
+  { key: 'renewed', label: 'Renewed' },
+  { key: 'not_renewing', label: 'Not Renewing' }
+];
+
+let currentBillingId = null;
+
+export function renderBilling() {
+  const user = Auth.getCurrentUser();
+  if (!user) return '';
+
+  const billings = Store.getBillingsForUser(user);
+
+  const total = billings.length;
+  const outstanding = billings.reduce((sum, b) => sum + (Number(b.balanceDue) || 0), 0);
+  const revenue = billings.reduce((sum, b) => sum + (Number(b.amountPaid) || 0), 0);
+  const overdueCount = billings.filter(b => b.paymentStatus === 'overdue').length;
+  const renewalDueCount = billings.filter(b => b.renewalStatus === 'renewal_due').length;
+
+  return `
+    <div class="content-inner">
+      <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
+        <div>
+          <h1 class="page-header-title">Billing & Renewals</h1>
+          <div class="page-header-subtitle">Track invoices, payments, and upcoming renewals</div>
+        </div>
+        <button class="btn btn-primary" id="btn-new-billing">
+          <span class="icon">Γ₧ò</span> New Record
+        </button>
+      </div>
+
+      <div class="dashboard-grid" style="grid-template-columns: repeat(5, 1fr); margin-bottom: 2rem;">
+        <div class="stat-card">
+          <div class="stat-card-label">Total Records</div>
+          <div class="stat-card-value">${total}</div>
+        </div>
+        <div class="stat-card">
+          <div class="stat-card-label">Outstanding</div>
+          <div class="stat-card-value" style="color:var(--color-error);">${formatCurrency(outstanding, 'INR')}</div>
+        </div>
+        <div class="stat-card">
+          <div class="stat-card-label">Paid Revenue</div>
+          <div class="stat-card-value" style="color:var(--color-success);">${formatCurrency(revenue, 'INR')}</div>
+        </div>
+        <div class="stat-card">
+          <div class="stat-card-label">Overdue</div>
+          <div class="stat-card-value" style="color:var(--color-error);">${overdueCount}</div>
+        </div>
+        <div class="stat-card">
+          <div class="stat-card-label">Renewal Due</div>
+          <div class="stat-card-value" style="color:var(--color-primary);">${renewalDueCount}</div>
+        </div>
+      </div>
+
+      <div class="filters-bar" style="display:flex; gap:1rem; margin-bottom:1rem; flex-wrap:wrap; background:var(--color-surface-card); padding:1rem; border-radius:8px; border:1px solid var(--color-hairline-soft);">
+        <input type="text" class="login-input" id="billing-filter-search" placeholder="Search invoice or company..." style="flex:1; min-width:200px;">
+        <select class="login-input" id="billing-filter-status" style="width:160px;">
+          <option value="all">All Statuses</option>
+          ${PAYMENT_STATUSES.map(s => `<option value="${s.key}">${s.label}</option>`).join('')}
+        </select>
+        <select class="login-input" id="billing-filter-renewal" style="width:160px;">
+          <option value="all">All Renewals</option>
+          ${RENEWAL_STATUSES.map(s => `<option value="${s.key}">${s.label}</option>`).join('')}
+        </select>
+        <select class="login-input" id="billing-filter-owner" style="width:160px;">
+        </select>
+      </div>
+
+      <div class="table-container" style="background:var(--color-surface-card); border-radius:8px; border:1px solid var(--color-hairline-soft); overflow-x:auto;">
+        <table class="data-table" style="width:100%; text-align:left; border-collapse:collapse;">
+          <thead>
+            <tr style="border-bottom:1px solid var(--color-hairline-soft);">
+              <th style="padding:1rem;">Invoice / Company</th>
+              <th style="padding:1rem;">Linked Record</th>
+              <th style="padding:1rem;">Timeline</th>
+              <th style="padding:1rem;">Status</th>
+              <th style="padding:1rem;">Financials</th>
+              <th style="padding:1rem;">Renewal</th>
+              <th style="padding:1rem;">Assigned To</th>
+              <th style="padding:1rem; text-align:right;">Actions</th>
+            </tr>
+          </thead>
+          <tbody id="billings-tbody">
+            <!-- Rendered via loadTable() -->
+          </tbody>
+        </table>
+      </div>
+    </div>
+
+    <!-- Billing Modal -->
+    <div id="billing-modal" class="modal-overlay" style="display:none;">
+      <div class="modal" style="max-width:850px; width:90%;">
+        <div class="modal-header">
+          <h2 id="modal-billing-heading">Create Billing Record</h2>
+          <button class="modal-close" id="btn-close-billing-modal">&times;</button>
+        </div>
+        <div class="modal-body" style="max-height:70vh; overflow-y:auto;">
+
+          <div style="margin-bottom:1.5rem; padding:1rem; background:var(--color-surface-soft); border-radius:8px; border:1px solid var(--color-hairline-soft);">
+            <h4 style="margin:0 0 1rem 0;">Link Record</h4>
+            <div class="form-grid" style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:1rem;">
+              <div class="form-group">
+                <label>Deal (Closed Won)</label>
+                <select class="login-input" id="modal-billing-deal">
+                  <option value="">-- Select Deal --</option>
+                </select>
+              </div>
+              <div class="form-group">
+                <label>Proposal (Accepted)</label>
+                <select class="login-input" id="modal-billing-proposal">
+                  <option value="">-- Select Proposal --</option>
+                </select>
+              </div>
+              <div class="form-group">
+                <label>Project Handoff (Active)</label>
+                <select class="login-input" id="modal-billing-handoff">
+                  <option value="">-- Select Handoff --</option>
+                </select>
+              </div>
+            </div>
+            <div style="display:flex; justify-content:flex-end; margin-top:0.5rem;">
+              <button class="btn btn-sm btn-secondary" id="btn-autofill-billing">Auto-Fill from Selection</button>
+            </div>
+          </div>
+
+          <div class="form-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
+            <div class="form-group" style="grid-column: 1 / -1;">
+              <label>Record Title *</label>
+              <input type="text" class="login-input" id="modal-billing-title" placeholder="e.g. AWS Training Phase 1 Invoice">
+            </div>
+
+            <div class="form-group">
+              <label>Company Name *</label>
+              <input type="text" class="login-input" id="modal-billing-company">
+            </div>
+            <div class="form-group">
+              <label>Client Contact</label>
+              <select class="login-input" id="modal-billing-contact">
+                <option value="">-- Select Contact --</option>
+              </select>
+            </div>
+
+            <div class="form-group">
+              <label>Invoice Number</label>
+              <input type="text" class="login-input" id="modal-billing-invoice-number">
+            </div>
+            <div class="form-group">
+              <label>Currency</label>
+              <select class="login-input" id="modal-billing-currency">
+                <option value="INR">INR (Γé╣)</option>
+                <option value="USD">USD ($)</option>
+                <option value="EUR">EUR (Γé¼)</option>
+                <option value="GBP">GBP (┬ú)</option>
+              </select>
+            </div>
+
+            <div class="form-group">
+              <label>Invoice Date</label>
+              <input type="date" class="login-input" id="modal-billing-invoice-date">
+            </div>
+            <div class="form-group">
+              <label>Due Date</label>
+              <input type="date" class="login-input" id="modal-billing-due-date">
+            </div>
+
+            <!-- Financials Section -->
+            <div style="grid-column: 1 / -1; margin-top: 1rem;">
+              <h4 style="margin:0 0 1rem 0; border-bottom:1px solid var(--color-hairline-soft); padding-bottom:0.5rem;">Financials</h4>
+            </div>
+
+            <div class="form-group">
+              <label>Subtotal *</label>
+              <input type="number" step="0.01" class="login-input" id="modal-billing-subtotal" value="0">
+            </div>
+            <div class="form-group">
+              <label>Discount Total</label>
+              <input type="number" step="0.01" class="login-input" id="modal-billing-discount" value="0">
+            </div>
+            <div class="form-group">
+              <label>Tax Total</label>
+              <input type="number" step="0.01" class="login-input" id="modal-billing-tax" value="0">
+            </div>
+            <div class="form-group">
+              <label>Grand Total *</label>
+              <input type="number" step="0.01" class="login-input" id="modal-billing-grand-total" value="0">
+            </div>
+
+            <!-- Payments Section -->
+            <div style="grid-column: 1 / -1; margin-top: 1rem;">
+              <h4 style="margin:0 0 1rem 0; border-bottom:1px solid var(--color-hairline-soft); padding-bottom:0.5rem;">Payment Tracking</h4>
+            </div>
+
+            <div class="form-group">
+              <label>Amount Paid</label>
+              <input type="number" step="0.01" class="login-input" id="modal-billing-amount-paid" value="0">
+            </div>
+            <div class="form-group">
+              <label>Payment Mode</label>
+              <select class="login-input" id="modal-billing-payment-mode">
+                ${PAYMENT_MODES.map(m => `<option value="${m.key}">${m.label}</option>`).join('')}
+              </select>
+            </div>
+            <div class="form-group">
+              <label>Payment Status *</label>
+              <select class="login-input" id="modal-billing-payment-status">
+                ${PAYMENT_STATUSES.map(s => `<option value="${s.key}">${s.label}</option>`).join('')}
+              </select>
+            </div>
+            <div class="form-group">
+              <label>Calculated Balance Due</label>
+              <input type="number" class="login-input" id="modal-billing-balance-due" disabled>
+            </div>
+
+            <!-- Renewals Section -->
+            <div style="grid-column: 1 / -1; margin-top: 1rem;">
+              <h4 style="margin:0 0 1rem 0; border-bottom:1px solid var(--color-hairline-soft); padding-bottom:0.5rem;">Renewal Tracking</h4>
+            </div>
+
+            <div class="form-group">
+              <label>Renewal Status</label>
+              <select class="login-input" id="modal-billing-renewal-status">
+                ${RENEWAL_STATUSES.map(s => `<option value="${s.key}">${s.label}</option>`).join('')}
+              </select>
+            </div>
+            <div class="form-group">
+              <label>Renewal Date</label>
+              <input type="date" class="login-input" id="modal-billing-renewal-date">
+            </div>
+            <div class="form-group">
+              <label>Expected Renewal Value</label>
+              <input type="number" step="0.01" class="login-input" id="modal-billing-renewal-value">
+            </div>
+
+            <div class="form-group" style="grid-column: 1 / -1; margin-top: 1rem;">
+              <label>Assigned To *</label>
+              <select class="login-input" id="modal-billing-assigned"></select>
+            </div>
+
+            <div class="form-group" style="grid-column: 1 / -1;">
+              <label>Internal Notes</label>
+              <textarea class="login-input" id="modal-billing-notes" rows="2" placeholder="Private team notes..."></textarea>
+            </div>
+
+          </div>
+        </div>
+        <div class="modal-footer">
+          <button class="btn btn-secondary" id="btn-cancel-billing">Cancel</button>
+          <button class="btn btn-primary" id="btn-save-billing">Save Record</button>
+        </div>
+      </div>
+    </div>
+  `;
+}
+
+function loadTable() {
+  const tbody = document.getElementById('billings-tbody');
+  const searchInput = document.getElementById('billing-filter-search');
+  const statusFilter = document.getElementById('billing-filter-status');
+  const renewalFilter = document.getElementById('billing-filter-renewal');
+  const ownerFilter = document.getElementById('billing-filter-owner');
+
+  if (!tbody || !searchInput || !statusFilter || !renewalFilter || !ownerFilter) return;
+
+  const user = Auth.getCurrentUser();
+  if (!user) return;
+
+  if (ownerFilter.options.length === 0) {
+    let ownerOptions = '<option value="all">All Owners</option>';
+    if (user.role === 'employee') {
+      ownerOptions += `<option value="${user.id}">${user.name} (You)</option>`;
+    } else if (user.role === 'team_lead') {
+      const teamUsers = Store.getUsersByTeam(user.teamId);
+      teamUsers.push(user);
+      const uniqueUsers = Array.from(new Map(teamUsers.map(u => [u.id, u])).values());
+      ownerOptions += uniqueUsers.map(u => `<option value="${u.id}">${u.name}</option>`).join('');
+    } else {
+      const allUsers = Store.getUsers().filter(u => u.isActive);
+      ownerOptions += allUsers.map(u => `<option value="${u.id}">${u.name}</option>`).join('');
+    }
+    ownerFilter.innerHTML = ownerOptions;
+  }
+
+  const billings = Store.getBillingsForUser(user);
+  const search = searchInput.value.toLowerCase();
+  const statusVal = statusFilter.value;
+  const renewalVal = renewalFilter.value;
+  const ownerVal = ownerFilter.value;
+
+  const filtered = billings.filter(b => {
+    const matchSearch = String(b.title || '').toLowerCase().includes(search) ||
+                        String(b.companyName || '').toLowerCase().includes(search) ||
+                        String(b.invoiceNumber || '').toLowerCase().includes(search);
+    const matchStatus = statusVal === 'all' || b.paymentStatus === statusVal;
+    const matchRenewal = renewalVal === 'all' || b.renewalStatus === renewalVal;
+    const matchOwner = ownerVal === 'all' || b.assignedTo === ownerVal;
+    return matchSearch && matchStatus && matchRenewal && matchOwner;
+  });
+
+  if (filtered.length === 0) {
+    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:2rem; color:var(--color-muted);">No billing records found.</td></tr>';
+    return;
+  }
+
+  tbody.innerHTML = filtered.map(b => {
+    const deal = b.dealId ? Store.getDealById(b.dealId) : null;
+    const prop = b.proposalId ? Store.getProposalById(b.proposalId) : null;
+    const handoff = b.handoffId ? Store.getHandoffById(b.handoffId) : null;
+    const owner = Store.getUserById(b.assignedTo);
+
+    const pLabel = PAYMENT_STATUSES.find(s => s.key === b.paymentStatus)?.label || b.paymentStatus;
+    const rLabel = RENEWAL_STATUSES.find(s => s.key === b.renewalStatus)?.label || b.renewalStatus;
+
+    let statusBadgeClass = 'badge-neutral';
+    if (b.paymentStatus === 'paid') statusBadgeClass = 'badge-success';
+    else if (b.paymentStatus === 'overdue' || b.paymentStatus === 'cancelled') statusBadgeClass = 'badge-error';
+    else if (b.paymentStatus === 'partially_paid') statusBadgeClass = 'badge-primary';
+
+    const actions = [];
+    if (Store.canUserEditBilling(b, user)) {
+      actions.push(`<button class="btn btn-sm btn-secondary edit-billing" data-id="${b.id}">Edit</button>`);
+    }
+    if (user.role === 'manager') {
+      actions.push(`<button class="btn btn-sm btn-secondary delete-billing" style="color:var(--color-error); border-color:var(--color-error);" data-id="${b.id}">Delete</button>`);
+    }
+
+    return `
+      <tr style="border-bottom:1px solid var(--color-hairline-soft);">
+        <td style="padding:1rem;">
+          <div style="font-weight:600;">${b.title}</div>
+          <div style="font-size:0.8rem; color:var(--color-muted);">${b.companyName}</div>
+          ${b.invoiceNumber ? `<div style="font-size:0.8rem;">Inv: ${b.invoiceNumber}</div>` : ''}
+        </td>
+        <td style="padding:1rem;">
+          ${deal ? `<div style="font-size:0.85rem;">Deal: <a href="#/deals/${deal.id}">${deal.title}</a></div>` : ''}
+          ${prop ? `<div style="font-size:0.8rem; color:var(--color-muted);">Prop: ${prop.title}</div>` : ''}
+          ${handoff ? `<div style="font-size:0.8rem; color:var(--color-muted);">Handoff: ${handoff.title}</div>` : ''}
+        </td>
+        <td style="padding:1rem; font-size:0.85rem; color:var(--color-muted);">
+          <div>Inv: ${b.invoiceDate ? formatDate(b.invoiceDate) : '-'}</div>
+          <div>Due: ${b.dueDate ? formatDate(b.dueDate) : '-'}</div>
+        </td>
+        <td style="padding:1rem;">
+          <span class="badge ${statusBadgeClass}">${pLabel}</span>
+        </td>
+        <td style="padding:1rem; font-size:0.85rem;">
+          <div>Total: ${formatCurrency(b.grandTotal, b.currency)}</div>
+          <div style="color:var(--color-success);">Paid: ${formatCurrency(b.amountPaid, b.currency)}</div>
+          <div style="color:var(--color-error);">Due: ${formatCurrency(b.balanceDue, b.currency)}</div>
+        </td>
+        <td style="padding:1rem; font-size:0.85rem;">
+          <div><span class="badge badge-neutral">${rLabel}</span></div>
+          ${b.renewalDate ? `<div style="color:var(--color-muted); margin-top:4px;">Date: ${formatDate(b.renewalDate)}</div>` : ''}
+        </td>
+        <td style="padding:1rem;">${owner ? owner.name : 'Unassigned'}</td>
+        <td style="padding:1rem; text-align:right;">
+          <div style="display:flex; gap:0.5rem; justify-content:flex-end;">
+            ${actions.join('')}
+          </div>
+        </td>
+      </tr>
+    `;
+  }).join('');
+}
+
+function updateBalanceUI() {
+  const grandTotal = Number(document.getElementById('modal-billing-grand-total').value) || 0;
+  const amountPaid = Number(document.getElementById('modal-billing-amount-paid').value) || 0;
+  const balanceInput = document.getElementById('modal-billing-balance-due');
+  balanceInput.value = Math.max(0, grandTotal - amountPaid).toFixed(2);
+}
+
+function openModal(id = null, defaultData = null) {
+  const modal = document.getElementById('billing-modal');
+  if (!modal) return;
+  const user = Auth.getCurrentUser();
+  if (!user) return;
+  currentBillingId = id;
+
+  document.getElementById('modal-billing-heading').innerText = id ? 'Edit Billing Record' : 'Create Billing Record';
+
+  const deals = Store.getDealsForUser(user).filter(d => d.status === 'closed_won');
+  const props = Store.getProposalsForUser(user).filter(p => p.status === 'accepted');
+  const handoffs = Store.getHandoffsForUser(user).filter(h => h.deliveryStatus === 'handed_over' || h.deliveryStatus === 'in_delivery' || h.deliveryStatus === 'completed');
+  const contacts = Store.getContacts();
+
+  document.getElementById('modal-billing-deal').innerHTML = '<option value="">-- Select Deal --</option>' + deals.map(d => `<option value="${d.id}">${d.title}</option>`).join('');
+  document.getElementById('modal-billing-proposal').innerHTML = '<option value="">-- Select Proposal --</option>' + props.map(p => `<option value="${p.id}">${p.title}</option>`).join('');
+  document.getElementById('modal-billing-handoff').innerHTML = '<option value="">-- Select Handoff --</option>' + handoffs.map(h => `<option value="${h.id}">${h.title}</option>`).join('');
+  document.getElementById('modal-billing-contact').innerHTML = '<option value="">-- Select Contact --</option>' + contacts.map(c => `<option value="${c.id}">${c.name} (${c.company})</option>`).join('');
+
+  const assignedSelect = document.getElementById('modal-billing-assigned');
+  if (user.role === 'employee') {
+    assignedSelect.innerHTML = `<option value="${user.id}">${user.name} (You)</option>`;
+    assignedSelect.disabled = true;
+  } else if (user.role === 'team_lead') {
+    const teamUsers = Store.getUsersByTeam(user.teamId);
+    teamUsers.push(user);
+    const uniqueUsers = Array.from(new Map(teamUsers.map(u => [u.id, u])).values());
+    assignedSelect.innerHTML = uniqueUsers.map(u => `<option value="${u.id}">${u.name}</option>`).join('');
+    assignedSelect.disabled = false;
+  } else {
+    const allUsers = Store.getUsers().filter(u => u.isActive);
+    assignedSelect.innerHTML = allUsers.map(u => `<option value="${u.id}">${u.name} (${Store.getTeamById(u.teamId)?.name || 'No Team'})</option>`).join('');
+    assignedSelect.disabled = false;
+  }
+
+  if (id) {
+    const b = Store.getBillingById(id);
+    if (!b || !Store.canUserEditBilling(b, user)) {
+      Toast.error('Error', 'Cannot edit this billing record.');
+      return;
+    }
+    document.getElementById('modal-billing-title').value = b.title || '';
+    document.getElementById('modal-billing-deal').value = b.dealId || '';
+    document.getElementById('modal-billing-proposal').value = b.proposalId || '';
+    document.getElementById('modal-billing-handoff').value = b.handoffId || '';
+    document.getElementById('modal-billing-company').value = b.companyName || '';
+    document.getElementById('modal-billing-contact').value = b.clientContactId || '';
+    document.getElementById('modal-billing-invoice-number').value = b.invoiceNumber || '';
+    document.getElementById('modal-billing-currency').value = b.currency || 'INR';
+    document.getElementById('modal-billing-invoice-date').value = b.invoiceDate ? b.invoiceDate.split('T')[0] : '';
+    document.getElementById('modal-billing-due-date').value = b.dueDate ? b.dueDate.split('T')[0] : '';
+    document.getElementById('modal-billing-subtotal').value = b.subtotal || 0;
+    document.getElementById('modal-billing-discount').value = b.discountTotal || 0;
+    document.getElementById('modal-billing-tax').value = b.taxTotal || 0;
+    document.getElementById('modal-billing-grand-total').value = b.grandTotal || 0;
+    document.getElementById('modal-billing-amount-paid').value = b.amountPaid || 0;
+    document.getElementById('modal-billing-payment-mode').value = b.paymentMode || 'not_recorded';
+    document.getElementById('modal-billing-payment-status').value = b.paymentStatus || 'draft';
+    document.getElementById('modal-billing-renewal-status').value = b.renewalStatus || 'none';
+    document.getElementById('modal-billing-renewal-date').value = b.renewalDate ? b.renewalDate.split('T')[0] : '';
+    document.getElementById('modal-billing-renewal-value').value = b.renewalValue || '';
+    document.getElementById('modal-billing-assigned').value = b.assignedTo || user.id;
+    document.getElementById('modal-billing-notes').value = b.notes || '';
+
+    updateBalanceUI();
+  } else {
+    document.getElementById('modal-billing-title').value = '';
+    document.getElementById('modal-billing-deal').value = defaultData?.dealId || '';
+    document.getElementById('modal-billing-proposal').value = defaultData?.proposalId || '';
+    document.getElementById('modal-billing-handoff').value = defaultData?.handoffId || '';
+    document.getElementById('modal-billing-company').value = defaultData?.companyName || '';
+    document.getElementById('modal-billing-contact').value = defaultData?.contactId || '';
+    document.getElementById('modal-billing-invoice-number').value = '';
+    document.getElementById('modal-billing-currency').value = 'INR';
+    document.getElementById('modal-billing-invoice-date').value = '';
+    document.getElementById('modal-billing-due-date').value = '';
+    document.getElementById('modal-billing-subtotal').value = 0;
+    document.getElementById('modal-billing-discount').value = 0;
+    document.getElementById('modal-billing-tax').value = 0;
+    document.getElementById('modal-billing-grand-total').value = 0;
+    document.getElementById('modal-billing-amount-paid').value = 0;
+    document.getElementById('modal-billing-payment-mode').value = 'not_recorded';
+    document.getElementById('modal-billing-payment-status').value = 'draft';
+    document.getElementById('modal-billing-renewal-status').value = 'none';
+    document.getElementById('modal-billing-renewal-date').value = '';
+    document.getElementById('modal-billing-renewal-value').value = '';
+    document.getElementById('modal-billing-assigned').value = user.id;
+    document.getElementById('modal-billing-notes').value = '';
+
+    updateBalanceUI();
+
+    if (defaultData?.dealId || defaultData?.proposalId || defaultData?.handoffId) {
+       document.getElementById('btn-autofill-billing').click();
+    }
+  }
+
+  modal.style.display = 'flex';
+}
+
+function closeModal() {
+  const modal = document.getElementById('billing-modal');
+  if (modal) modal.style.display = 'none';
+  currentBillingId = null;
+}
+
+function handleSaveBilling() {
+  const user = Auth.getCurrentUser();
+  if (!user) return;
+
+  const title = document.getElementById('modal-billing-title').value.trim();
+  const companyName = document.getElementById('modal-billing-company').value.trim();
+  const invoiceNumber = document.getElementById('modal-billing-invoice-number').value.trim();
+  const currency = document.getElementById('modal-billing-currency').value;
+  let paymentStatus = document.getElementById('modal-billing-payment-status').value;
+  const paymentMode = document.getElementById('modal-billing-payment-mode').value;
+  const renewalStatus = document.getElementById('modal-billing-renewal-status').value;
+
+  if (!title || !companyName) {
+    return Toast.error('Validation Error', 'Title and Company Name are required.');
+  }
+
+  if (!PAYMENT_STATUSES.some(s => s.key === paymentStatus)) return Toast.error('Error', 'Invalid payment status.');
+  if (!PAYMENT_MODES.some(m => m.key === paymentMode)) return Toast.error('Error', 'Invalid payment mode.');
+  if (!RENEWAL_STATUSES.some(s => s.key === renewalStatus)) return Toast.error('Error', 'Invalid renewal status.');
+
+  let dealId = document.getElementById('modal-billing-deal').value || null;
+  let proposalId = document.getElementById('modal-billing-proposal').value || null;
+  const handoffId = document.getElementById('modal-billing-handoff').value || null;
+  const contactId = document.getElementById('modal-billing-contact').value || null;
+
+  if (contactId && !Store.getContactById(contactId)) {
+    return Toast.error('Validation Error', 'Selected contact does not exist.');
+  }
+
+  let dealTeamId = null;
+  let requirementTeamId = null;
+  let handoffTeamId = null;
+
+  // Cascade relations securely
+  if (handoffId) {
+    const h = Store.getHandoffById(handoffId);
+    if (!h) return Toast.error('Error', 'Linked Handoff does not exist.');
+    if (!Store.canUserViewHandoff(h, user)) return Toast.error('Error', 'Permission denied for linked Handoff.');
+    if (h.deliveryStatus === 'cancelled' || h.deliveryStatus === 'blocked') {
+      if (user.role !== 'manager') return Toast.error('Error', 'Cannot create billing from blocked/cancelled handoff.');
+      if (!confirm('Handoff is blocked/cancelled. Create draft billing anyway?')) return;
+      paymentStatus = 'draft';
+    }
+    if (!dealId && h.dealId) dealId = h.dealId;
+    if (!proposalId && h.proposalId) proposalId = h.proposalId;
+    handoffTeamId = h.teamId;
+  }
+
+  if (proposalId) {
+    const p = Store.getProposalById(proposalId);
+    if (!p) return Toast.error('Error', 'Linked Proposal does not exist.');
+    if (!Store.canUserViewProposal(p, user)) return Toast.error('Error', 'Permission denied for linked Proposal.');
+    if (p.status !== 'accepted') {
+       if (user.role !== 'manager') return Toast.error('Error', 'Proposal must be Accepted to create billing.');
+       if (!confirm('Proposal is not accepted. Create draft billing anyway?')) return;
+       paymentStatus = 'draft';
+    }
+    if (!dealId && p.dealId) dealId = p.dealId;
+    if (p.requirementId) {
+      const r = Store.getRequirementById(p.requirementId);
+      if (!r) return Toast.error('Error', 'Underlying Requirement does not exist.');
+      if (!Store.canUserViewRequirement(r, user)) return Toast.error('Error', 'Permission denied for underlying Requirement.');
+      requirementTeamId = r.teamId;
+    }
+  }
+
+  if (dealId) {
+    const d = Store.getDealById(dealId);
+    if (!d) return Toast.error('Error', 'Linked Deal does not exist.');
+    if (!Auth.canViewRecord(d)) return Toast.error('Error', 'Permission denied for linked Deal.');
+    if (d.status !== 'closed_won') {
+       if (user.role !== 'manager') return Toast.error('Error', 'Deal must be Closed Won to create billing.');
+       if (!confirm('Deal is not closed won. Create draft billing anyway?')) return;
+       paymentStatus = 'draft';
+    }
+    dealTeamId = d.teamId;
+  }
+
+  // Duplicate Check
+  if (!currentBillingId) {
+    const allBillings = Store.getBillings();
+    const dup = allBillings.find(b =>
+      (handoffId && b.handoffId === handoffId) ||
+      (proposalId && b.proposalId === proposalId) ||
+      (dealId && b.dealId === dealId)
+    );
+    if (dup) {
+      if (user.role !== 'manager') return Toast.error('Duplicate Error', 'An active billing record already exists for this pipeline link.');
+      if (!confirm('A billing record exists for this pipeline link. Create duplicate?')) return;
+    }
+  }
+
+  let assignedTo = document.getElementById('modal-billing-assigned').value;
+  if (user.role === 'employee') {
+    assignedTo = user.id;
+  } else if (user.role === 'team_lead') {
+    const target = Store.getUserById(assignedTo);
+    if (!target || (target.teamId !== user.teamId && target.id !== user.id)) {
+      return Toast.error('Error', 'Cannot assign outside your team.');
+    }
+  }
+
+  const assignedUser = Store.getUserById(assignedTo);
+  if (!assignedUser) return Toast.error('Error', 'Assigned user does not exist.');
+
+  // Derive Team ID
+  let finalTeamId = assignedUser.teamId || null;
+  if (!finalTeamId && handoffTeamId) finalTeamId = handoffTeamId;
+  if (!finalTeamId && dealTeamId) finalTeamId = dealTeamId;
+  if (!finalTeamId && requirementTeamId) finalTeamId = requirementTeamId;
+  if (!finalTeamId) finalTeamId = user.teamId || null;
+
+  // Number parses
+  const subtotalRaw = document.getElementById('modal-billing-subtotal').value;
+  const discountTotalRaw = document.getElementById('modal-billing-discount').value;
+  const taxTotalRaw = document.getElementById('modal-billing-tax').value;
+  const grandTotalRaw = document.getElementById('modal-billing-grand-total').value;
+  const amountPaidRaw = document.getElementById('modal-billing-amount-paid').value;
+
+  const subtotal = Number(subtotalRaw);
+  const discountTotal = Number(discountTotalRaw);
+  const taxTotal = Number(taxTotalRaw);
+  const grandTotal = Number(grandTotalRaw);
+  const amountPaid = Number(amountPaidRaw);
+
+  if (isNaN(subtotal) || subtotal < 0) return Toast.error('Validation Error', 'Invalid subtotal.');
+  if (isNaN(discountTotal) || discountTotal < 0) return Toast.error('Validation Error', 'Invalid discount total.');
+  if (isNaN(taxTotal) || taxTotal < 0) return Toast.error('Validation Error', 'Invalid tax total.');
+  if (isNaN(grandTotal) || grandTotal < 0) return Toast.error('Validation Error', 'Invalid grand total.');
+  if (isNaN(amountPaid) || amountPaid < 0) return Toast.error('Validation Error', 'Invalid amount paid.');
+
+  if (amountPaid > grandTotal) {
+     if (user.role !== 'manager') return Toast.error('Error', 'Amount paid cannot exceed grand total.');
+     if (!confirm('Amount paid exceeds grand total. Proceed?')) return;
+  }
+
+  // Strictly calculate balance
+  const balanceDue = Math.max(0, grandTotal - amountPaid);
+
+  // Date parses
+  const invDateRaw = document.getElementById('modal-billing-invoice-date').value;
+  const dueDateRaw = document.getElementById('modal-billing-due-date').value;
+  const renDateRaw = document.getElementById('modal-billing-renewal-date').value;
+  let invoiceDate = null, dueDate = null, renewalDate = null;
+
+  if (invDateRaw) {
+    const d = new Date(invDateRaw);
+    if (isNaN(d.getTime())) return Toast.error('Validation Error', 'Invalid invoice date.');
+    invoiceDate = d.toISOString();
+  }
+  if (dueDateRaw) {
+    const d = new Date(dueDateRaw);
+    if (isNaN(d.getTime())) return Toast.error('Validation Error', 'Invalid due date.');
+    dueDate = d.toISOString();
+  }
+  if (renDateRaw) {
+    const d = new Date(renDateRaw);
+    if (isNaN(d.getTime())) return Toast.error('Validation Error', 'Invalid renewal date.');
+    renewalDate = d.toISOString();
+  }
+
+  const renewalValueRaw = document.getElementById('modal-billing-renewal-value').value;
+  let renewalValue = null;
+  if (renewalValueRaw) {
+    renewalValue = Number(renewalValueRaw);
+    if (isNaN(renewalValue) || renewalValue < 0) return Toast.error('Validation Error', 'Invalid renewal value.');
+  }
+
+  // Old Record Check
+  const oldRecord = currentBillingId ? Store.getBillingById(currentBillingId) : null;
+  if (currentBillingId) {
+    if (!oldRecord) return Toast.error('Error', 'Billing record not found.');
+    if (!Store.canUserEditBilling(oldRecord, user)) return Toast.error('Error', 'Cannot edit this billing record.');
+  }
+
+  // Payment Status Auto-Calculations
+  if (amountPaid <= 0 && (paymentStatus === 'paid' || paymentStatus === 'partially_paid')) {
+    return Toast.error('Validation Error', 'Cannot mark paid or partially paid when amount paid is zero.');
+  }
+
+  if (amountPaid >= grandTotal && grandTotal > 0 && paymentStatus !== 'paid') {
+    if (user.role === 'manager') {
+      if (!confirm('Amount covers total. Leave status as ' + paymentStatus + '?')) return;
+    } else {
+      paymentStatus = 'paid';
+    }
+  } else if (amountPaid > 0 && amountPaid < grandTotal && paymentStatus !== 'partially_paid') {
+    if (user.role === 'manager') {
+      if (!confirm('Amount is partial. Leave status as ' + paymentStatus + '?')) return;
+    } else {
+      paymentStatus = 'partially_paid';
+    }
+  }
+
+  if (dueDate && balanceDue > 0 && !['overdue', 'draft', 'cancelled'].includes(paymentStatus)) {
+    const now = new Date();
+    now.setHours(0,0,0,0);
+    const dueObj = new Date(dueDate);
+    if (dueObj < now) {
+      if (user.role === 'manager') {
+        if (!confirm('Invoice is overdue. Leave status as ' + paymentStatus + '?')) return;
+      } else {
+        paymentStatus = 'overdue';
+      }
+    }
+  }
+
+  let paidAt = oldRecord ? oldRecord.paidAt : null;
+  if (paymentStatus === 'paid' && (!oldRecord || oldRecord.paymentStatus !== 'paid')) {
+    paidAt = new Date().toISOString();
+  } else if (paymentStatus !== 'paid') {
+    paidAt = null; // Reset if unmarked
+  }
+
+  let cancelledAt = oldRecord ? oldRecord.cancelledAt : null;
+  if (paymentStatus === 'cancelled' && (!oldRecord || oldRecord.paymentStatus !== 'cancelled')) {
+    cancelledAt = new Date().toISOString();
+  } else if (paymentStatus !== 'cancelled') {
+    cancelledAt = null; // Reset if unmarked
+  }
+
+  const payload = {
+    title,
+    dealId,
+    proposalId,
+    handoffId,
+    companyName,
+    clientContactId: contactId,
+    invoiceNumber,
+    invoiceDate,
+    dueDate,
+    currency,
+    subtotal,
+    taxTotal,
+    discountTotal,
+    grandTotal,
+    amountPaid,
+    balanceDue,
+    paymentStatus,
+    paymentMode,
+    renewalStatus,
+    renewalDate,
+    renewalValue,
+    assignedTo,
+    teamId: finalTeamId,
+    notes: document.getElementById('modal-billing-notes').value.trim(),
+    paidAt,
+    cancelledAt
+  };
+
+  let saved;
+  if (currentBillingId) {
+    saved = Store.updateBilling(currentBillingId, payload);
+    if (!saved) return Toast.error('Error', 'Failed to update billing.');
+    Toast.success('Updated', 'Billing record updated successfully.');
+
+    // Log updates
+    if (oldRecord.paymentStatus !== saved.paymentStatus) {
+      Store.createActivity({
+         id: generateId(),
+         title: `Invoice marked as ${saved.paymentStatus.replace('_', ' ')}`,
+         type: 'stage_change',
+         dealId: saved.dealId || null,
+         assignedTo: user.id,
+         teamId: user.teamId,
+         createdBy: user.id,
+         createdAt: new Date().toISOString()
+      });
+    }
+    if (oldRecord.renewalStatus !== saved.renewalStatus) {
+      Store.createActivity({
+         id: generateId(),
+         title: `Renewal status changed to ${saved.renewalStatus.replace('_', ' ')}`,
+         type: 'note',
+         dealId: saved.dealId || null,
+         assignedTo: user.id,
+         teamId: user.teamId,
+         createdBy: user.id,
+         createdAt: new Date().toISOString()
+      });
+    }
+    if (oldRecord.assignedTo !== saved.assignedTo) {
+      Store.createActivity({
+         id: generateId(),
+         title: `Billing reassigned to ${assignedUser.name}`,
+         type: 'note',
+         dealId: saved.dealId || null,
+         assignedTo: user.id,
+         teamId: user.teamId,
+         createdBy: user.id,
+         createdAt: new Date().toISOString()
+      });
+    }
+  } else {
+    payload.id = generateId();
+    payload.createdBy = user.id;
+    payload.createdAt = new Date().toISOString();
+    payload.updatedAt = payload.createdAt;
+
+    saved = Store.createBilling(payload);
+    if (!saved) return Toast.error('Error', 'Failed to create billing.');
+    Toast.success('Created', 'Billing record created successfully.');
+
+    Store.createActivity({
+       id: generateId(),
+       title: `Billing Record Created`,
+       type: 'stage_change',
+       notes: `Invoice tracked for ${saved.companyName}`,
+       dealId: saved.dealId || null,
+       assignedTo: user.id,
+       teamId: user.teamId,
+       createdBy: user.id,
+       createdAt: new Date().toISOString()
+    });
+  }
+
+  closeModal();
+  import('../router.js').then(m => m.Router.handleRoute());
+}
+
+let eventsBound = false;
+
+export function bindBillingEvents() {
+  if (eventsBound) return;
+  eventsBound = true;
+
+  const content = document.getElementById('content-area');
+  if (!content) return;
+
+  content.addEventListener('click', e => {
+    if (e.target.closest('#btn-new-billing')) openModal();
+    if (e.target.closest('#btn-close-billing-modal') || e.target.closest('#btn-cancel-billing')) closeModal();
+    if (e.target.closest('#btn-save-billing')) handleSaveBilling();
+
+    const editBtn = e.target.closest('.edit-billing');
+    if (editBtn) openModal(editBtn.getAttribute('data-id'));
+
+    const deleteBtn = e.target.closest('.delete-billing');
+    if (deleteBtn) {
+      const user = Auth.getCurrentUser();
+      if (user?.role !== 'manager') {
+        Toast.error('Access Denied', 'Only managers can delete billing records.');
+        return;
+      }
+      const id = deleteBtn.getAttribute('data-id');
+      const b = Store.getBillingById(id);
+      if (!b) return Toast.error('Error', 'Billing record not found.');
+
+      if (confirm('Are you sure you want to delete this billing record?')) {
+        if (Store.deleteBilling(id)) {
+          Toast.success('Deleted', 'Billing record deleted.');
+          import('../router.js').then(m => m.Router.handleRoute());
+        } else {
+          Toast.error('Error', 'Failed to delete record.');
+        }
+      }
+    }
+
+    if (e.target.id === 'btn-autofill-billing') {
+      const dealId = document.getElementById('modal-billing-deal').value;
+      const propId = document.getElementById('modal-billing-proposal').value;
+      const handoffId = document.getElementById('modal-billing-handoff').value;
+
+      let sourceContactId = null;
+      let sourceCompany = '';
+      let sourceSubtotal = 0;
+      let sourceDiscount = 0;
+      let sourceTax = 0;
+      let sourceGrand = 0;
+
+      // priority order: Proposal -> Handoff -> Deal
+      if (propId) {
+        const p = Store.getProposalById(propId);
+        if (p) {
+          sourceSubtotal = p.subtotal;
+          sourceDiscount = p.discountTotal;
+          sourceTax = p.taxTotal;
+          sourceGrand = p.grandTotal;
+          if (p.dealId && !dealId) document.getElementById('modal-billing-deal').value = p.dealId;
+        }
+      }
+
+      if (handoffId) {
+        const h = Store.getHandoffById(handoffId);
+        if (h) {
+          if (h.clientContactId) sourceContactId = h.clientContactId;
+          if (h.companyName) sourceCompany = h.companyName;
+          if (h.dealId && !dealId) document.getElementById('modal-billing-deal').value = h.dealId;
+          if (h.proposalId && !propId) document.getElementById('modal-billing-proposal').value = h.proposalId;
+        }
+      }
+
+      // Read current dealId again in case it was cascaded
+      const activeDealId = document.getElementById('modal-billing-deal').value;
+      if (activeDealId) {
+        const d = Store.getDealById(activeDealId);
+        if (d) {
+          if (!sourceContactId && d.contactId) sourceContactId = d.contactId;
+          if (!sourceCompany && d.leadId) {
+            const l = Store.getLeadById(d.leadId);
+            if (l) sourceCompany = l.company;
+          }
+          if (sourceGrand === 0 && !propId) {
+             sourceGrand = d.value;
+             sourceSubtotal = d.value;
+          }
+        }
+      }
+
+      if (sourceCompany) document.getElementById('modal-billing-company').value = sourceCompany;
+      if (sourceContactId) document.getElementById('modal-billing-contact').value = sourceContactId;
+
+      document.getElementById('modal-billing-subtotal').value = sourceSubtotal || 0;
+      document.getElementById('modal-billing-discount').value = sourceDiscount || 0;
+      document.getElementById('modal-billing-tax').value = sourceTax || 0;
+      document.getElementById('modal-billing-grand-total').value = sourceGrand || 0;
+
+      updateBalanceUI();
+      Toast.success('Auto-Filled', 'Data populated from selected links.');
+    }
+  });
+
+  content.addEventListener('input', e => {
+    if (e.target.id === 'billing-filter-search') loadTable();
+    if (['modal-billing-grand-total', 'modal-billing-amount-paid'].includes(e.target.id)) {
+      updateBalanceUI();
+    }
+  });
+
+  content.addEventListener('change', e => {
+    if (['billing-filter-status', 'billing-filter-renewal', 'billing-filter-owner'].includes(e.target.id)) loadTable();
+  });
+}
+
+export function initBillingPage() {
+  loadTable();
+  const pendingDealId = sessionStorage.getItem('pendingBillingDealId');
+  if (pendingDealId) {
+    sessionStorage.removeItem('pendingBillingDealId');
+    openModal(null, { dealId: pendingDealId });
+  }
+}
diff --git a/js/pages/deal-detail.js b/js/pages/deal-detail.js
index 98292e1..6a428f5 100644
--- a/js/pages/deal-detail.js
+++ b/js/pages/deal-detail.js
@@ -149,6 +149,56 @@ export function renderDealDetail(params) {
     </div>
   `;
 
+  // Fetch Billings for this deal
+  const billings = Store.getBillings().filter(b => b.dealId === deal.id && Store.canUserViewBilling(b, user));
+  let billingHtml = '';
+
+  if (billings.length > 0) {
+    const b = billings[0];
+    const pLabel = b.paymentStatus.replace('_', ' ');
+    const rLabel = b.renewalStatus.replace('_', ' ');
+    let statusClass = 'badge-neutral';
+    if (b.paymentStatus === 'paid') statusClass = 'badge-success';
+    else if (b.paymentStatus === 'overdue' || b.paymentStatus === 'cancelled') statusClass = 'badge-error';
+    else if (b.paymentStatus === 'partially_paid') statusClass = 'badge-primary';
+
+    billingHtml = `
+      <div style="border:1px solid var(--color-hairline-soft); border-radius:4px; padding:12px; background:var(--color-surface-card);">
+        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
+          <div style="font-weight:600; font-size:1rem;">${b.title}</div>
+          <span class="badge ${statusClass}">${pLabel}</span>
+        </div>
+        <div style="font-size:0.85rem; color:var(--color-muted); margin-bottom:8px;">
+          Grand Total: ${formatCurrency(b.grandTotal, b.currency)} | Paid: <span style="color:var(--color-success);">${formatCurrency(b.amountPaid, b.currency)}</span> | Due: <span style="color:var(--color-error);">${formatCurrency(b.balanceDue, b.currency)}</span>
+        </div>
+        <div style="font-size:0.85rem; color:var(--color-muted); margin-bottom:12px;">
+          Renewal Status: ${rLabel}
+        </div>
+        <a href="#/billing" class="btn btn-sm btn-secondary">Go to Billing</a>
+      </div>
+    `;
+  } else if (deal.status === 'closed_won') {
+    billingHtml = `
+      <div style="border:1px dashed var(--color-hairline-soft); border-radius:4px; padding:1rem; text-align:center; background:var(--color-surface-soft);">
+        <div style="margin-bottom:0.5rem; color:var(--color-muted);">No billing record created yet.</div>
+        <button class="btn btn-sm btn-primary" data-action="create-billing-from-deal" data-deal-id="${deal.id}">Create Billing</button>
+      </div>
+    `;
+  } else {
+    billingHtml = `
+      <div style="border:1px dashed var(--color-hairline-soft); border-radius:4px; padding:1rem; text-align:center; background:var(--color-surface-soft); color:var(--color-muted); font-size:0.85rem;">
+        Deal must be Closed Won to create a billing record.
+      </div>
+    `;
+  }
+
+  const billingSection = `
+    <div class="dashboard-section" style="margin-top:1.5rem;">
+      <h4 class="dashboard-section-title">Billing & Renewals</h4>
+      ${billingHtml}
+    </div>
+  `;
+
   let handoffHtml = '';
   if (handoffs.length > 0) {
     const h = handoffs[0];
@@ -210,6 +260,7 @@ export function renderDealDetail(params) {
 
       ${reqPropSection}
       ${handoffSection}
+      ${billingSection}
 
       <div class="dashboard-section">
         <div class="dashboard-section-header" style="justify-content:space-between; align-items:center;">
@@ -246,6 +297,14 @@ export function bindDealDetailEvents() {
       import('../router.js').then(m => m.Router.navigate('#/handoffs'));
     }
 
+    // Create Billing button
+    const billingBtn = e.target.closest('[data-action="create-billing-from-deal"]');
+    if (billingBtn) {
+      const dealId = billingBtn.getAttribute('data-deal-id');
+      sessionStorage.setItem('pendingBillingDealId', dealId);
+      import('../router.js').then(m => m.Router.navigate('#/billing'));
+    }
+
     // Override Stage button (Manager)
     if (e.target.id === 'btn-override-stage') {
       const dealId = e.target.dataset.dealId;
diff --git a/js/pages/settings.js b/js/pages/settings.js
index 7e924ba..3cf6986 100644
--- a/js/pages/settings.js
+++ b/js/pages/settings.js
@@ -22,7 +22,8 @@ function getDataSummary() {
     activities: Store.getActivities().length,
     requirements: Store.getRequirements().length,
     proposals: Store.getProposals().length,
-    handoffs: Store.getHandoffs().length
+    handoffs: Store.getHandoffs().length,
+    billings: Store.getBillings().length
   };
 }
 
@@ -114,7 +115,8 @@ function buildDataSummaryCard(user) {
     { label: 'Activities', count: summary.activities, color: 'var(--color-stage-invoice)' },
     { label: 'Requirements', count: summary.requirements, color: 'var(--color-primary)' },
     { label: 'Proposals', count: summary.proposals, color: 'var(--color-success)' },
-    { label: 'Project Handoffs', count: summary.handoffs, color: 'var(--color-stage-invoice)' }
+    { label: 'Project Handoffs', count: summary.handoffs, color: 'var(--color-stage-invoice)' },
+    { label: 'Billing & Renewals', count: summary.billings, color: 'var(--color-stage-sales)' }
   ];
 
   const itemsHtml = items.map(i => `
@@ -390,7 +392,7 @@ function handleImportJson() {
 
     // Validate structure
     const requiredKeys = ['users', 'teams', 'leads', 'contacts', 'deals', 'activities'];
-    const optionalArrayKeys = ['requirements', 'proposals', 'handoffs'];
+    const optionalArrayKeys = ['requirements', 'proposals', 'handoffs', 'billings'];
     for (const key of requiredKeys) {
       if (!Array.isArray(payload[key])) {
         Toast.error('Invalid Structure', `Missing or invalid "${key}" array in import file.`);
diff --git a/js/router.js b/js/router.js
index 15a7a06..df7ebd5 100644
--- a/js/router.js
+++ b/js/router.js
@@ -18,6 +18,7 @@ const ROUTES = {
   'requirements':{ pageId: 'requirements',title: 'Requirements' },
   'proposals': { pageId: 'proposals', title: 'Proposals' },
   'handoffs':  { pageId: 'handoffs',  title: 'Handoffs' },
+  'billing':   { pageId: 'billing',   title: 'Billing' },
   'team':      { pageId: 'team',      title: 'Team' },
   'reports':   { pageId: 'reports',   title: 'Reports' },
   'settings':  { pageId: 'settings',  title: 'Settings' }
diff --git a/js/seed.js b/js/seed.js
index 5928583..ad26d13 100644
--- a/js/seed.js
+++ b/js/seed.js
@@ -549,6 +549,106 @@ export function seedData() {
     }
   ];
 
+  // ΓöÇΓöÇ Billings ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+  const billings = [
+    {
+      id: generateId(),
+      title: 'Invoice for AWS Training',
+      dealId: 'deal_01',
+      proposalId: proposals[0].id,
+      handoffId: handoffs[0].id,
+      companyName: 'Infosys',
+      clientContactId: contacts[0].id,
+      invoiceNumber: 'INV-2026-001',
+      invoiceDate: daysAgo(5),
+      dueDate: daysAgo(2),
+      currency: 'INR',
+      subtotal: 25000,
+      taxTotal: 4365,
+      discountTotal: 750,
+      grandTotal: 28615,
+      amountPaid: 28615,
+      balanceDue: 0,
+      paymentStatus: 'paid',
+      paymentMode: 'bank_transfer',
+      renewalStatus: 'none',
+      renewalDate: null,
+      renewalValue: null,
+      assignedTo: 'usr_emp_01',
+      teamId: 'team_01',
+      createdBy: 'usr_emp_01',
+      createdAt: daysAgo(5),
+      updatedAt: daysAgo(1),
+      paidAt: daysAgo(1),
+      cancelledAt: null,
+      notes: 'Payment received successfully via bank transfer.'
+    },
+    {
+      id: generateId(),
+      title: 'Wipro Analytics Setup - Milestone 1',
+      dealId: 'deal_03',
+      proposalId: null,
+      handoffId: handoffs[1].id,
+      companyName: 'Wipro',
+      clientContactId: contacts[2].id,
+      invoiceNumber: 'INV-2026-002',
+      invoiceDate: daysAgo(10),
+      dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
+      currency: 'INR',
+      subtotal: 150000,
+      taxTotal: 27000,
+      discountTotal: 0,
+      grandTotal: 177000,
+      amountPaid: 50000,
+      balanceDue: 127000,
+      paymentStatus: 'partially_paid',
+      paymentMode: 'upi',
+      renewalStatus: 'none',
+      renewalDate: null,
+      renewalValue: null,
+      assignedTo: 'usr_emp_03',
+      teamId: 'team_02',
+      createdBy: 'usr_emp_03',
+      createdAt: daysAgo(10),
+      updatedAt: daysAgo(2),
+      paidAt: null,
+      cancelledAt: null,
+      notes: 'Advance payment received.'
+    },
+    {
+      id: generateId(),
+      title: 'Freshworks SaaS Annual License',
+      dealId: 'deal_05',
+      proposalId: null,
+      handoffId: handoffs[2].id,
+      companyName: 'Freshworks',
+      clientContactId: contacts[5].id,
+      invoiceNumber: 'INV-2025-099',
+      invoiceDate: daysAgo(380),
+      dueDate: daysAgo(350),
+      currency: 'USD',
+      subtotal: 5000,
+      taxTotal: 0,
+      discountTotal: 0,
+      grandTotal: 5000,
+      amountPaid: 0,
+      balanceDue: 5000,
+      paymentStatus: 'overdue',
+      paymentMode: 'not_recorded',
+      renewalStatus: 'renewal_due',
+      renewalDate: new Date(Date.now() + 86400000 * 15).toISOString(),
+      renewalValue: 5500,
+      assignedTo: 'usr_emp_03',
+      teamId: 'team_02',
+      createdBy: 'usr_emp_03',
+      createdAt: daysAgo(380),
+      updatedAt: daysAgo(1),
+      paidAt: null,
+      cancelledAt: null,
+      notes: 'Invoice overdue and renewal is approaching.'
+    }
+  ];
+
   // ΓöÇΓöÇ Persist ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
   users.forEach(u      => Store.createUser(u));
   teams.forEach(t      => Store.createTeam(t));
@@ -559,6 +659,7 @@ export function seedData() {
   requirements.forEach(r => Store.createRequirement(r));
   proposals.forEach(p => Store.createProposal(p));
   handoffs.forEach(h => Store.createHandoff(h));
+  billings.forEach(b => Store.createBilling(b));
 
   Store.markSeeded();
   console.log('TechnoEdge CRM: Demo data seeded successfully.');
diff --git a/js/store.js b/js/store.js
index f37844a..ac5e1ba 100644
--- a/js/store.js
+++ b/js/store.js
@@ -15,6 +15,7 @@ const KEYS = {
   requirements: STORAGE_PREFIX + 'requirements',
   proposals:  STORAGE_PREFIX + 'proposals',
   handoffs:   STORAGE_PREFIX + 'handoffs',
+  billings:   STORAGE_PREFIX + 'billings',
   session:    STORAGE_PREFIX + 'session',
   settings:   STORAGE_PREFIX + 'settings',
   seeded:     STORAGE_PREFIX + 'seeded'
@@ -409,6 +410,61 @@ export const Store = {
     return handoff.assignedTo === user.id || handoff.createdBy === user.id;
   },
 
+  // ΓöÇΓöÇ Billings ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+  getBillings() { return getAll(KEYS.billings); },
+  getBillingById(id) { return getById(KEYS.billings, id); },
+  createBilling(payload) { return create(KEYS.billings, payload); },
+  updateBilling(id, updates) { return update(KEYS.billings, id, updates); },
+  deleteBilling(id) { return remove(KEYS.billings, id); },
+
+  getBillingsForUser(user) {
+    if (!user) return [];
+    const billings = Store.getBillings();
+    if (user.role === 'manager') return billings;
+
+    const handoffIds = new Set(Store.getHandoffsForUser(user).map(h => h.id));
+    const dealIds = new Set(Store.getDealsForUser(user).map(d => d.id));
+    const proposalIds = new Set(Store.getProposalsForUser(user).map(p => p.id));
+
+    if (user.role === 'team_lead') {
+      const teamUserIds = new Set(Store.getUsersByTeam(user.teamId).map(u => u.id));
+      teamUserIds.add(user.id);
+      return billings.filter(b => {
+        if (b.teamId === user.teamId) return true;
+        if (teamUserIds.has(b.assignedTo) || teamUserIds.has(b.createdBy)) return true;
+        if (b.handoffId && handoffIds.has(b.handoffId)) return true;
+        if (b.dealId && dealIds.has(b.dealId)) return true;
+        if (b.proposalId && proposalIds.has(b.proposalId)) return true;
+        return false;
+      });
+    }
+
+    // Employee
+    return billings.filter(b => {
+      if (b.assignedTo === user.id || b.createdBy === user.id) return true;
+      if (b.handoffId && handoffIds.has(b.handoffId)) return true;
+      if (b.dealId && dealIds.has(b.dealId)) return true;
+      if (b.proposalId && proposalIds.has(b.proposalId)) return true;
+      return false;
+    });
+  },
+
+  canUserViewBilling(billing, user) {
+    if (!billing || !user) return false;
+    if (user.role === 'manager') return true;
+    const billings = Store.getBillingsForUser(user);
+    return billings.some(b => b.id === billing.id);
+  },
+
+  canUserEditBilling(billing, user) {
+    if (!billing || !user) return false;
+    if (user.role === 'manager') return true;
+    if (user.role === 'team_lead') {
+      return Store.canUserViewBilling(billing, user);
+    }
+    return billing.assignedTo === user.id || billing.createdBy === user.id;
+  },
+
 
   // ΓöÇΓöÇ Export / Import ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
   exportData() {
@@ -422,6 +478,7 @@ export const Store = {
       requirements: getAll(KEYS.requirements),
       proposals: getAll(KEYS.proposals),
       handoffs: getAll(KEYS.handoffs),
+      billings: getAll(KEYS.billings),
       settings: Store.getSettings(),
       exportedAt: new Date().toISOString()
     };
@@ -429,7 +486,7 @@ export const Store = {
 
   importData(payload) {
     // Pre-serialize all datasets before touching localStorage
-    const dataKeys = [KEYS.users, KEYS.teams, KEYS.leads, KEYS.contacts, KEYS.deals, KEYS.activities, KEYS.requirements, KEYS.proposals, KEYS.handoffs, KEYS.settings];
+    const dataKeys = [KEYS.users, KEYS.teams, KEYS.leads, KEYS.contacts, KEYS.deals, KEYS.activities, KEYS.requirements, KEYS.proposals, KEYS.handoffs, KEYS.billings, KEYS.settings];
     const newValues = {
       [KEYS.users]:        JSON.stringify(payload.users || []),
       [KEYS.teams]:        JSON.stringify(payload.teams || []),
@@ -440,6 +497,7 @@ export const Store = {
       [KEYS.requirements]: JSON.stringify(payload.requirements || []),
       [KEYS.proposals]:    JSON.stringify(payload.proposals || []),
       [KEYS.handoffs]:     JSON.stringify(payload.handoffs || []),
+      [KEYS.billings]:     JSON.stringify(payload.billings || []),
       [KEYS.settings]:     JSON.stringify(payload.settings || {})
     };
 
```

## Tests Run
```text
Browser preview performed externally: Manager, Team Lead, and Employee billing visibility/actions checked; billing creation from deal/proposal/handoff checked; payment status, duplicate, and overdue guardrails checked
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
