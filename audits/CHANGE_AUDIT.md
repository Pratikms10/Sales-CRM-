# AI Change Audit Report

## Generated On
2026-06-17_16-14-18

## Branch
main

## Baseline Commit
13bfc1a

## Task Summary
Phase 1C Leads page with role-scoped visibility, guarded lead forms, filters, and conversion foundation

## Git Status
```text
 M audits/CHANGE_AUDIT.md
 M css/components.css
 M js/app.js
 A js/pages/leads.js
```

## Files Changed
```text
M	css/components.css
M	js/app.js
A	js/pages/leads.js
```

## Change Summary
```text
 css/components.css |  79 +++++++++
 js/app.js          |   4 +
 js/pages/leads.js  | 489 +++++++++++++++++++++++++++++++++++++++++++++++++++++
 3 files changed, 572 insertions(+)
```

## Full Diff
```diff
diff --git a/css/components.css b/css/components.css
index e980079..f35ea6d 100644
--- a/css/components.css
+++ b/css/components.css
@@ -833,3 +833,82 @@
   align-items: center;
 }
 
+/* -- Data Tables ------------------------------------------- */
+.data-table {
+  width: 100%;
+  border-collapse: collapse;
+  text-align: left;
+}
+
+.data-table th {
+  padding: var(--space-sm) var(--space-md);
+  font: var(--text-caption-sm);
+  color: var(--color-muted);
+  border-bottom: 1px solid var(--color-hairline-soft);
+  background: var(--color-surface-strong);
+}
+
+.data-table td {
+  padding: var(--space-md);
+  font: var(--text-body-sm);
+  color: var(--color-ink);
+  border-bottom: 1px solid var(--color-hairline-soft);
+  vertical-align: middle;
+}
+
+.data-table tbody tr {
+  transition: background var(--transition-fast);
+}
+
+.data-table tbody tr:hover {
+  background: var(--color-surface-soft);
+}
+
+.table-actions {
+  display: flex;
+  gap: var(--space-xs);
+  justify-content: flex-end;
+}
+
+/* -- Modals ------------------------------------------------ */
+.modal-overlay {
+  position: fixed;
+  top: 0;
+  left: 0;
+  right: 0;
+  bottom: 0;
+  background: rgba(0,0,0,0.4);
+  z-index: 1000;
+  backdrop-filter: blur(2px);
+}
+
+.modal {
+  position: fixed;
+  top: 50%;
+  left: 50%;
+  transform: translate(-50%, -50%);
+  background: var(--color-canvas);
+  border-radius: var(--rounded-md);
+  box-shadow: var(--shadow-dropdown);
+  z-index: 1001;
+  width: 90%;
+  max-width: 600px;
+  max-height: 90vh;
+  overflow-y: auto;
+}
+
+.modal-header {
+  padding: var(--space-md) var(--space-lg);
+  border-bottom: 1px solid var(--color-hairline-soft);
+  display: flex;
+  justify-content: space-between;
+  align-items: center;
+}
+
+.text-link {
+  color: var(--color-primary);
+  text-decoration: none;
+}
+.text-link:hover {
+  text-decoration: underline;
+}
diff --git a/js/app.js b/js/app.js
index 0ca826b..d6b3c58 100644
--- a/js/app.js
+++ b/js/app.js
@@ -13,6 +13,7 @@ import { renderLoginPage, bindLoginEvents } from './pages/login.js';
 import { renderDashboard } from './pages/dashboard.js';
 import { renderPipeline, bindPipelineEvents } from './pages/pipeline.js';
 import { renderDealDetail, bindDealDetailEvents } from './pages/deal-detail.js';
+import { renderLeads, bindLeadsEvents } from './pages/leads.js';
 
 // ΓöÇΓöÇ DOM References ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
 
@@ -106,6 +107,8 @@ function renderPage(pageId, params) {
       }
       break;
     case 'leads':
+      contentEl.innerHTML = renderLeads();
+      break;
     case 'contacts':
     case 'team':
     case 'reports':
@@ -122,6 +125,7 @@ function renderPage(pageId, params) {
 // Since we completely replace innerHTML, we can bind on the document or contentEl.
 bindPipelineEvents();
 bindDealDetailEvents();
+bindLeadsEvents();
 
 // ΓöÇΓöÇ Bootstrap ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
 
diff --git a/js/pages/leads.js b/js/pages/leads.js
new file mode 100644
index 0000000..3f84e48
--- /dev/null
+++ b/js/pages/leads.js
@@ -0,0 +1,489 @@
+// ============================================================
+// TechnoEdge CRM ΓÇö Leads Page
+// Lead list with role-scoped access and CRUD operations
+// ============================================================
+
+import { Store } from '../store.js';
+import { Auth } from '../auth.js';
+import { formatDate, generateId, capitalize, getInitials } from '../utils.js';
+import { Router } from '../router.js';
+import { Toast } from '../components/toast.js';
+
+let currentFilters = {
+  search: '',
+  status: '',
+  source: ''
+};
+
+export function renderLeads() {
+  const user = Auth.getCurrentUser();
+  if (!user) return '';
+
+  const allLeads = Store.getLeadsForUser(user);
+  
+  // Apply filters
+  const filteredLeads = allLeads.filter(lead => {
+    if (currentFilters.status && lead.status !== currentFilters.status) return false;
+    if (currentFilters.source && lead.source !== currentFilters.source) return false;
+    
+    if (currentFilters.search) {
+      const q = currentFilters.search.toLowerCase();
+      const matchName = lead.name.toLowerCase().includes(q);
+      const matchCompany = lead.company.toLowerCase().includes(q);
+      const matchEmail = (lead.email || '').toLowerCase().includes(q);
+      if (!matchName && !matchCompany && !matchEmail) return false;
+    }
+    return true;
+  });
+
+  // Sort by newest
+  filteredLeads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
+
+  const rowsHtml = filteredLeads.map(lead => buildLeadRow(lead, user)).join('');
+  const emptyHtml = filteredLeads.length === 0 ? `<tr><td colspan="8" class="text-center" style="padding: 2rem;">No leads found.</td></tr>` : '';
+
+  return `
+    <div class="content-inner">
+      <div class="page-header">
+        <div>
+          <h1 class="page-header-title">Leads</h1>
+          <p class="page-header-subtitle">Manage potential deals and prospects.</p>
+        </div>
+        <button class="btn btn-primary" id="btn-new-lead">New Lead</button>
+      </div>
+
+      <div class="card" style="margin-bottom: var(--space-lg)">
+        <div class="filter-bar" style="display: flex; gap: 1rem; padding: 1rem; border-bottom: 1px solid var(--color-border);">
+          <input type="text" class="login-input" id="filter-search" placeholder="Search name, company, email..." style="max-width: 300px;" value="${currentFilters.search}">
+          <select class="login-input" id="filter-status" style="max-width: 200px;">
+            <option value="">All Statuses</option>
+            <option value="new" ${currentFilters.status === 'new' ? 'selected' : ''}>New</option>
+            <option value="contacted" ${currentFilters.status === 'contacted' ? 'selected' : ''}>Contacted</option>
+            <option value="qualified" ${currentFilters.status === 'qualified' ? 'selected' : ''}>Qualified</option>
+            <option value="unqualified" ${currentFilters.status === 'unqualified' ? 'selected' : ''}>Unqualified</option>
+            <option value="converted" ${currentFilters.status === 'converted' ? 'selected' : ''}>Converted</option>
+          </select>
+          <select class="login-input" id="filter-source" style="max-width: 200px;">
+            <option value="">All Sources</option>
+            <option value="website" ${currentFilters.source === 'website' ? 'selected' : ''}>Website</option>
+            <option value="referral" ${currentFilters.source === 'referral' ? 'selected' : ''}>Referral</option>
+            <option value="cold_call" ${currentFilters.source === 'cold_call' ? 'selected' : ''}>Cold Call</option>
+            <option value="event" ${currentFilters.source === 'event' ? 'selected' : ''}>Event</option>
+            <option value="social" ${currentFilters.source === 'social' ? 'selected' : ''}>Social</option>
+          </select>
+          <button class="btn btn-secondary" id="btn-clear-filters">Clear</button>
+        </div>
+
+        <div style="overflow-x: auto;">
+          <table class="data-table">
+            <thead>
+              <tr>
+                <th>Name</th>
+                <th>Company</th>
+                <th>Contact</th>
+                <th>Source</th>
+                <th>Status</th>
+                <th>Assigned To</th>
+                <th>Created</th>
+                <th style="text-align: right;">Actions</th>
+              </tr>
+            </thead>
+            <tbody>
+              ${rowsHtml}
+              ${emptyHtml}
+            </tbody>
+          </table>
+        </div>
+      </div>
+    </div>
+    
+    <!-- Modals -->
+    <div id="modal-overlay" class="modal-overlay" style="display: none;"></div>
+    <div id="lead-modal" class="modal" style="display: none;">
+      <!-- Content populated dynamically -->
+    </div>
+  `;
+}
+
+function buildLeadRow(lead, user) {
+  const assignee = lead.assignedTo ? Store.getUserById(lead.assignedTo) : null;
+  const canEdit = user.role === 'manager' || Auth.canEditRecord(lead);
+  const canDelete = user.role === 'manager';
+  const canConvert = lead.status !== 'converted' && (user.role === 'manager' || user.role === 'team_lead');
+
+  let actionsHtml = `<div class="table-actions">`;
+  
+  if (canEdit) {
+    actionsHtml += `<button class="btn btn-sm btn-secondary btn-edit-lead" data-id="${lead.id}">Edit</button>`;
+  }
+  
+  if (canConvert) {
+    actionsHtml += `<button class="btn btn-sm btn-primary btn-convert-lead" data-id="${lead.id}">Convert</button>`;
+  } else if (lead.status !== 'converted' && user.role === 'employee') {
+    // Employee placeholder for convert
+    actionsHtml += `<button class="btn btn-sm btn-secondary" disabled title="Only Managers or Team Leads can convert">Convert</button>`;
+  }
+
+  if (canDelete) {
+    actionsHtml += `<button class="btn btn-sm btn-danger btn-delete-lead" data-id="${lead.id}">Delete</button>`;
+  }
+  
+  actionsHtml += `</div>`;
+
+  return `
+    <tr>
+      <td style="font-weight: 500;">${lead.name}</td>
+      <td>${lead.company}</td>
+      <td>
+        <div style="font-size: 0.85rem;">
+          <a href="mailto:${lead.email}" class="text-link">${lead.email}</a><br>
+          <span style="color: var(--color-muted)">${lead.phone}</span>
+        </div>
+      </td>
+      <td>${capitalize(lead.source)}</td>
+      <td><span class="badge badge-neutral">${capitalize(lead.status)}</span></td>
+      <td>
+        ${assignee ? `
+          <div style="display: flex; align-items: center; gap: 0.5rem;">
+            <div class="avatar avatar-sm" style="background: ${assignee.avatarColor}">${getInitials(assignee.name)}</div>
+            <span style="font-size: 0.85rem;">${assignee.name}</span>
+          </div>
+        ` : '<span style="color: var(--color-muted)">Unassigned</span>'}
+      </td>
+      <td style="font-size: 0.85rem; color: var(--color-muted);">
+        ${formatDate(lead.createdAt)}
+      </td>
+      <td style="text-align: right;">
+        ${actionsHtml}
+      </td>
+    </tr>
+  `;
+}
+
+export function bindLeadsEvents() {
+  const content = document.getElementById('content-area');
+  if (!content) return;
+
+  // Filters
+  content.addEventListener('input', (e) => {
+    if (e.target.id === 'filter-search') {
+      currentFilters.search = e.target.value;
+      reRenderLeadsOnly();
+    }
+  });
+
+  content.addEventListener('change', (e) => {
+    if (e.target.id === 'filter-status') {
+      currentFilters.status = e.target.value;
+      reRenderLeadsOnly();
+    }
+    if (e.target.id === 'filter-source') {
+      currentFilters.source = e.target.value;
+      reRenderLeadsOnly();
+    }
+  });
+
+  content.addEventListener('click', (e) => {
+    // Clear Filters
+    if (e.target.id === 'btn-clear-filters') {
+      currentFilters = { search: '', status: '', source: '' };
+      reRenderLeadsFull();
+      return;
+    }
+
+    // New Lead
+    if (e.target.id === 'btn-new-lead') {
+      openLeadModal();
+      return;
+    }
+
+    // Edit Lead
+    const editBtn = e.target.closest('.btn-edit-lead');
+    if (editBtn) {
+      openLeadModal(editBtn.dataset.id);
+      return;
+    }
+
+    // Delete Lead
+    const deleteBtn = e.target.closest('.btn-delete-lead');
+    if (deleteBtn) {
+      if (confirm('Are you sure you want to delete this lead?')) {
+        const user = Auth.getCurrentUser();
+        if (!user || user.role !== 'manager') {
+          Toast.error('Permission Denied', 'Only managers can delete leads.');
+          return;
+        }
+        const id = deleteBtn.dataset.id;
+        Store.deleteLead(id);
+        Toast.success('Deleted', 'Lead has been removed.');
+        reRenderLeadsFull();
+      }
+      return;
+    }
+
+    // Convert Lead
+    const convertBtn = e.target.closest('.btn-convert-lead');
+    if (convertBtn) {
+      if (confirm('Convert this lead to a Deal?')) {
+        handleConvertLead(convertBtn.dataset.id);
+      }
+      return;
+    }
+    
+    // Modal actions
+    if (e.target.id === 'modal-overlay' || e.target.closest('.btn-close-modal')) {
+      closeModal();
+      return;
+    }
+
+    if (e.target.id === 'btn-save-lead') {
+      saveLead();
+      return;
+    }
+  });
+}
+
+function reRenderLeadsOnly() {
+  // Re-render without losing focus if possible, but simplest is full replacement
+  // We'll debounce full render for input
+  clearTimeout(window.filterDebounce);
+  window.filterDebounce = setTimeout(() => {
+    reRenderLeadsFull();
+  }, 300);
+}
+
+function reRenderLeadsFull() {
+  const contentEl = document.getElementById('content-area');
+  if (contentEl) {
+    contentEl.innerHTML = renderLeads();
+  }
+}
+
+function getAssignableUsers() {
+  const currentUser = Auth.getCurrentUser();
+  if (currentUser.role === 'manager') {
+    return Store.getUsers();
+  } else if (currentUser.role === 'team_lead') {
+    const users = Store.getUsersByTeam(currentUser.teamId);
+    if (!users.find(u => u.id === currentUser.id)) users.push(currentUser);
+    return users;
+  } else {
+    return [currentUser];
+  }
+}
+
+function openLeadModal(leadId = null) {
+  const modal = document.getElementById('lead-modal');
+  const overlay = document.getElementById('modal-overlay');
+  const user = Auth.getCurrentUser();
+  
+  let lead = { name: '', company: '', email: '', phone: '', source: 'website', status: 'new', assignedTo: user.role === 'employee' ? user.id : '' };
+  
+  if (leadId) {
+    lead = Store.getLeadById(leadId);
+    if (!lead || !Auth.canEditRecord(lead)) {
+      Toast.error('Error', 'Cannot edit this lead.');
+      return;
+    }
+  }
+
+  const isEdit = !!leadId;
+  const title = isEdit ? 'Edit Lead' : 'New Lead';
+  const assignableUsers = getAssignableUsers();
+  
+  const userOptions = assignableUsers.map(u => 
+    `<option value="${u.id}" ${lead.assignedTo === u.id ? 'selected' : ''}>${u.name}</option>`
+  ).join('');
+
+  modal.innerHTML = `
+    <div class="modal-header">
+      <h3 style="margin:0">${title}</h3>
+      <button class="btn btn-sm btn-close-modal" style="background:none; border:none; font-size:1.5rem; cursor:pointer;">&times;</button>
+    </div>
+    <div class="modal-body" style="padding: 1.5rem;">
+      <input type="hidden" id="form-lead-id" value="${leadId || ''}">
+      
+      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
+        <div>
+          <label style="display:block; margin-bottom:0.5rem; font-weight:500;">Name *</label>
+          <input type="text" id="form-lead-name" class="login-input" value="${lead.name}" required>
+        </div>
+        <div>
+          <label style="display:block; margin-bottom:0.5rem; font-weight:500;">Company *</label>
+          <input type="text" id="form-lead-company" class="login-input" value="${lead.company}" required>
+        </div>
+      </div>
+
+      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
+        <div>
+          <label style="display:block; margin-bottom:0.5rem; font-weight:500;">Email</label>
+          <input type="email" id="form-lead-email" class="login-input" value="${lead.email}">
+        </div>
+        <div>
+          <label style="display:block; margin-bottom:0.5rem; font-weight:500;">Phone</label>
+          <input type="text" id="form-lead-phone" class="login-input" value="${lead.phone}">
+        </div>
+      </div>
+
+      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
+        <div>
+          <label style="display:block; margin-bottom:0.5rem; font-weight:500;">Source</label>
+          <select id="form-lead-source" class="login-input">
+            <option value="website" ${lead.source === 'website' ? 'selected' : ''}>Website</option>
+            <option value="referral" ${lead.source === 'referral' ? 'selected' : ''}>Referral</option>
+            <option value="cold_call" ${lead.source === 'cold_call' ? 'selected' : ''}>Cold Call</option>
+            <option value="event" ${lead.source === 'event' ? 'selected' : ''}>Event</option>
+            <option value="social" ${lead.source === 'social' ? 'selected' : ''}>Social</option>
+          </select>
+        </div>
+        <div>
+          <label style="display:block; margin-bottom:0.5rem; font-weight:500;">Status</label>
+          <select id="form-lead-status" class="login-input" ${lead.status === 'converted' ? 'disabled' : ''}>
+            <option value="new" ${lead.status === 'new' ? 'selected' : ''}>New</option>
+            <option value="contacted" ${lead.status === 'contacted' ? 'selected' : ''}>Contacted</option>
+            <option value="qualified" ${lead.status === 'qualified' ? 'selected' : ''}>Qualified</option>
+            <option value="unqualified" ${lead.status === 'unqualified' ? 'selected' : ''}>Unqualified</option>
+            <option value="converted" ${lead.status === 'converted' ? 'selected' : ''}>Converted</option>
+          </select>
+        </div>
+        <div>
+          <label style="display:block; margin-bottom:0.5rem; font-weight:500;">Assigned To</label>
+          <select id="form-lead-assigned" class="login-input">
+            ${user.role !== 'employee' ? '<option value="">Unassigned</option>' : ''}
+            ${userOptions}
+          </select>
+        </div>
+      </div>
+      
+      <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
+        <button class="btn btn-secondary btn-close-modal">Cancel</button>
+        <button class="btn btn-primary" id="btn-save-lead">Save Lead</button>
+      </div>
+    </div>
+  `;
+
+  overlay.style.display = 'block';
+  modal.style.display = 'block';
+}
+
+function closeModal() {
+  document.getElementById('modal-overlay').style.display = 'none';
+  document.getElementById('lead-modal').style.display = 'none';
+}
+
+function saveLead() {
+  const user = Auth.getCurrentUser();
+  if (!user) return;
+
+  const id = document.getElementById('form-lead-id').value;
+  const name = document.getElementById('form-lead-name').value.trim();
+  const company = document.getElementById('form-lead-company').value.trim();
+  
+  if (!name || !company) {
+    Toast.error('Validation Error', 'Name and Company are required.');
+    return;
+  }
+
+  let assignedTo = document.getElementById('form-lead-assigned').value || null;
+
+  // Enforce assignment rules
+  if (user.role === 'employee') {
+    assignedTo = user.id; // Employees can only assign to themselves
+  } else if (user.role === 'team_lead' && assignedTo && assignedTo !== user.id) {
+    const isTeamMember = Store.getUsersByTeam(user.teamId).some(u => u.id === assignedTo);
+    if (!isTeamMember) {
+      Toast.error('Permission Denied', 'Team Leads can only assign to their own team members or leave unassigned.');
+      return;
+    }
+  }
+
+  // Validate edit permissions
+  if (id) {
+    const existingLead = Store.getLeadById(id);
+    if (!existingLead || !Auth.canEditRecord(existingLead)) {
+      Toast.error('Permission Denied', 'You do not have permission to edit this lead.');
+      return;
+    }
+  }
+
+  const leadData = {
+    name,
+    company,
+    email: document.getElementById('form-lead-email').value.trim(),
+    phone: document.getElementById('form-lead-phone').value.trim(),
+    source: document.getElementById('form-lead-source').value,
+    status: document.getElementById('form-lead-status') ? document.getElementById('form-lead-status').value : 'converted',
+    assignedTo: assignedTo
+  };
+
+  if (id) {
+    Store.updateLead(id, leadData);
+    Toast.success('Success', 'Lead updated.');
+  } else {
+    leadData.id = generateId();
+    leadData.createdBy = Auth.getCurrentUser().id;
+    leadData.createdAt = new Date().toISOString();
+    leadData.updatedAt = leadData.createdAt;
+    Store.createLead(leadData);
+    Toast.success('Success', 'Lead created.');
+  }
+
+  closeModal();
+  reRenderLeadsFull();
+}
+
+function handleConvertLead(leadId) {
+  const lead = Store.getLeadById(leadId);
+  const user = Auth.getCurrentUser();
+  if (!lead || !user) return;
+
+  if (lead.status === 'converted') {
+    Toast.error('Already Converted', 'This lead has already been converted.');
+    return;
+  }
+
+  if (user.role === 'employee') {
+    Toast.error('Permission Denied', 'Employees cannot convert leads.');
+    return;
+  }
+
+  if (user.role !== 'manager' && !Auth.canEditRecord(lead)) {
+    Toast.error('Permission Denied', 'You do not have permission to convert this lead.');
+    return;
+  }
+
+  // Determine teamId for the new deal
+  let targetTeamId = null;
+  if (lead.assignedTo) {
+    const assignee = Store.getUserById(lead.assignedTo);
+    if (assignee && assignee.teamId) {
+      targetTeamId = assignee.teamId;
+    }
+  }
+  if (!targetTeamId && user.role === 'team_lead') {
+    targetTeamId = user.teamId;
+  }
+
+  // Create minimal deal
+  const deal = {
+    id: 'deal_' + generateId(),
+    title: `${lead.company} Deal`,
+    leadId: lead.id,
+    contactId: null, // Full contact creation is out of scope for Phase 1C
+    value: 0,
+    currency: 'INR',
+    stage: 'sales',
+    status: 'active',
+    assignedTo: lead.assignedTo,
+    teamId: targetTeamId,
+    priority: 'medium',
+    createdAt: new Date().toISOString(),
+    updatedAt: new Date().toISOString()
+  };
+
+  Store.createDeal(deal);
+  Store.updateLead(lead.id, { status: 'converted' });
+  
+  Toast.success('Lead Converted', 'A new deal has been created in the pipeline.');
+  reRenderLeadsFull();
+}
```

## Tests Run
```text
Browser preview performed externally: Manager, Team Lead, and Employee leads visibility/actions checked
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
