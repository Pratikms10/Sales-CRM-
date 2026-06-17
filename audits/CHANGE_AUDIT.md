# AI Change Audit Report

## Generated On
2026-06-17_17-23-17

## Branch
main

## Baseline Commit
de0186e

## Task Summary
Phase 1E Deals list page with role-scoped visibility, filters, guarded deal forms, valid stage guards, and detail navigation

## Git Status
```text
 M js/app.js
 A js/pages/deals.js
```

## Files Changed
```text
M	js/app.js
A	js/pages/deals.js
```

## Change Summary
```text
 js/app.js         |   4 +-
 js/pages/deals.js | 580 ++++++++++++++++++++++++++++++++++++++++++++++++++++++
 2 files changed, 583 insertions(+), 1 deletion(-)
```

## Full Diff
```diff
diff --git a/js/app.js b/js/app.js
index 76d1667..68ab4a2 100644
--- a/js/app.js
+++ b/js/app.js
@@ -15,6 +15,7 @@ import { renderPipeline, bindPipelineEvents } from './pages/pipeline.js';
 import { renderDealDetail, bindDealDetailEvents } from './pages/deal-detail.js';
 import { renderLeads, bindLeadsEvents } from './pages/leads.js';
 import { renderContacts, bindContactsEvents } from './pages/contacts.js';
+import { renderDeals, bindDealsEvents } from './pages/deals.js';
 
 // ΓöÇΓöÇ DOM References ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
 
@@ -104,7 +105,7 @@ function renderPage(pageId, params) {
       if (params && params.id) {
         contentEl.innerHTML = renderDealDetail(params);
       } else {
-        contentEl.innerHTML = renderComingSoon(pageId);
+        contentEl.innerHTML = renderDeals();
       }
       break;
     case 'leads':
@@ -130,6 +131,7 @@ bindPipelineEvents();
 bindDealDetailEvents();
 bindLeadsEvents();
 bindContactsEvents();
+bindDealsEvents();
 
 // ΓöÇΓöÇ Bootstrap ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
 
diff --git a/js/pages/deals.js b/js/pages/deals.js
new file mode 100644
index 0000000..0b20bbf
--- /dev/null
+++ b/js/pages/deals.js
@@ -0,0 +1,580 @@
+// ============================================================
+// TechnoEdge CRM ΓÇö Deals List Page
+// Role-scoped deals list, filtering, and CRUD operations
+// ============================================================
+
+import { Store } from '../store.js';
+import { Auth } from '../auth.js';
+import { formatDate, generateId, capitalize, getInitials, formatCurrency, SOP_STAGES } from '../utils.js';
+import { Router } from '../router.js';
+import { Toast } from '../components/toast.js';
+
+let currentFilters = {
+  search: '',
+  stage: '',
+  status: '',
+  priority: ''
+};
+
+export function renderDeals() {
+  const user = Auth.getCurrentUser();
+  if (!user) return '';
+
+  const allDeals = Store.getDealsForUser(user);
+  
+  // Apply filters
+  const filteredDeals = allDeals.filter(deal => {
+    if (currentFilters.stage && deal.stage !== currentFilters.stage) return false;
+    if (currentFilters.status && deal.status !== currentFilters.status) return false;
+    if (currentFilters.priority && deal.priority !== currentFilters.priority) return false;
+    
+    if (currentFilters.search) {
+      const q = currentFilters.search.toLowerCase();
+      const matchTitle = deal.title.toLowerCase().includes(q);
+      
+      let matchContact = false;
+      let matchCompany = false;
+      
+      if (deal.leadId) {
+        const lead = Store.getLeadById(deal.leadId);
+        if (lead) {
+          if (lead.name.toLowerCase().includes(q)) matchContact = true;
+          if (lead.company.toLowerCase().includes(q)) matchCompany = true;
+        }
+      } else if (deal.contactId) {
+        const contact = Store.getContactById(deal.contactId);
+        if (contact) {
+          if (contact.name.toLowerCase().includes(q)) matchContact = true;
+          if (contact.company.toLowerCase().includes(q)) matchCompany = true;
+        }
+      }
+
+      if (!matchTitle && !matchContact && !matchCompany) return false;
+    }
+    return true;
+  });
+
+  // Sort by updatedAt descending
+  filteredDeals.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
+
+  const rowsHtml = filteredDeals.map(deal => buildDealRow(deal, user)).join('');
+  const emptyHtml = filteredDeals.length === 0 ? `<tr><td colspan="9" class="text-center" style="padding: 2rem;">No deals found.</td></tr>` : '';
+
+  return `
+    <div class="content-inner">
+      <div class="page-header">
+        <div>
+          <h1 class="page-header-title">Deals</h1>
+          <p class="page-header-subtitle">Manage your sales pipeline and track opportunities.</p>
+        </div>
+        <button class="btn btn-primary" id="btn-new-deal">New Deal</button>
+      </div>
+
+      <div class="card" style="margin-bottom: var(--space-lg)">
+        <div class="filter-bar" style="display: flex; gap: 1rem; padding: 1rem; border-bottom: 1px solid var(--color-border); flex-wrap: wrap;">
+          <input type="text" class="login-input" id="filter-search-deal" placeholder="Search title, contact, company..." style="max-width: 250px;" value="${currentFilters.search}">
+          
+          <select class="login-input" id="filter-stage-deal" style="max-width: 150px;">
+            <option value="">All Stages</option>
+            ${SOP_STAGES.map(s => `<option value="${s.key}" ${currentFilters.stage === s.key ? 'selected' : ''}>${s.label}</option>`).join('')}
+          </select>
+          
+          <select class="login-input" id="filter-status-deal" style="max-width: 150px;">
+            <option value="">All Statuses</option>
+            <option value="active" ${currentFilters.status === 'active' ? 'selected' : ''}>Active</option>
+            <option value="won" ${currentFilters.status === 'won' ? 'selected' : ''}>Won</option>
+            <option value="lost" ${currentFilters.status === 'lost' ? 'selected' : ''}>Lost</option>
+          </select>
+          
+          <select class="login-input" id="filter-priority-deal" style="max-width: 150px;">
+            <option value="">All Priorities</option>
+            <option value="low" ${currentFilters.priority === 'low' ? 'selected' : ''}>Low</option>
+            <option value="medium" ${currentFilters.priority === 'medium' ? 'selected' : ''}>Medium</option>
+            <option value="high" ${currentFilters.priority === 'high' ? 'selected' : ''}>High</option>
+            <option value="urgent" ${currentFilters.priority === 'urgent' ? 'selected' : ''}>Urgent</option>
+          </select>
+          
+          <button class="btn btn-secondary" id="btn-clear-deal-filters">Clear</button>
+        </div>
+
+        <div style="overflow-x: auto;">
+          <table class="data-table">
+            <thead>
+              <tr>
+                <th>Deal Name</th>
+                <th>Client/Company</th>
+                <th>Value</th>
+                <th>Stage</th>
+                <th>Status</th>
+                <th>Priority</th>
+                <th>Owner & Team</th>
+                <th>Updated</th>
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
+    <div id="modal-overlay-deal" class="modal-overlay" style="display: none;"></div>
+    <div id="deal-modal" class="modal" style="display: none;">
+      <!-- Content populated dynamically -->
+    </div>
+  `;
+}
+
+function buildDealRow(deal, user) {
+  const assignee = deal.assignedTo ? Store.getUserById(deal.assignedTo) : null;
+  const team = deal.teamId ? Store.getTeamById(deal.teamId) : null;
+  const canEdit = user.role === 'manager' || Auth.canEditRecord(deal);
+  const canDelete = user.role === 'manager';
+
+  // Resolve Linked Entity
+  let clientName = 'ΓÇö';
+  let companyName = 'ΓÇö';
+  if (deal.leadId) {
+    const lead = Store.getLeadById(deal.leadId);
+    if (lead) {
+      clientName = lead.name;
+      companyName = lead.company;
+    }
+  } else if (deal.contactId) {
+    const contact = Store.getContactById(deal.contactId);
+    if (contact) {
+      clientName = contact.name;
+      companyName = contact.company;
+    }
+  }
+
+  const stageObj = SOP_STAGES.find(s => s.key === deal.stage);
+  const stageLabel = stageObj ? stageObj.label : capitalize(deal.stage);
+  
+  let statusBadgeClass = 'badge-neutral';
+  if (deal.status === 'won') statusBadgeClass = 'badge-success';
+  if (deal.status === 'lost') statusBadgeClass = 'badge-error';
+  if (deal.status === 'active') statusBadgeClass = 'badge-primary';
+
+  let priorityBadgeClass = 'badge-neutral';
+  if (deal.priority === 'urgent') priorityBadgeClass = 'badge-error';
+  if (deal.priority === 'high') priorityBadgeClass = 'badge-warning';
+
+  let actionsHtml = `<div class="table-actions">`;
+  
+  actionsHtml += `<a href="#/deals/${deal.id}" class="btn btn-sm btn-secondary">View</a>`;
+  
+  if (canEdit) {
+    actionsHtml += `<button class="btn btn-sm btn-secondary btn-edit-deal" data-id="${deal.id}">Edit</button>`;
+  }
+
+  if (canDelete) {
+    actionsHtml += `<button class="btn btn-sm btn-danger btn-delete-deal" data-id="${deal.id}">Delete</button>`;
+  }
+  
+  actionsHtml += `</div>`;
+
+  return `
+    <tr>
+      <td style="font-weight: 500;">
+        <a href="#/deals/${deal.id}" class="text-link">${deal.title}</a>
+      </td>
+      <td>
+        <div style="font-size: 0.85rem;">
+          <span style="color: var(--color-ink); font-weight: 500;">${companyName}</span><br>
+          <span style="color: var(--color-muted)">${clientName}</span>
+        </div>
+      </td>
+      <td style="font-weight: 600;">${formatCurrency(deal.value, deal.currency)}</td>
+      <td><span class="stage-badge stage-badge-${deal.stage}">${stageLabel}</span></td>
+      <td><span class="badge ${statusBadgeClass}">${capitalize(deal.status)}</span></td>
+      <td><span class="badge ${priorityBadgeClass}">${capitalize(deal.priority)}</span></td>
+      <td>
+        <div style="font-size: 0.85rem;">
+          ${assignee ? assignee.name : '<span style="color: var(--color-muted)">Unassigned</span>'}<br>
+          <span style="color: var(--color-muted); font-size: 0.75rem;">${team ? team.name : ''}</span>
+        </div>
+      </td>
+      <td style="font-size: 0.85rem; color: var(--color-muted);">
+        ${formatDate(deal.updatedAt)}
+      </td>
+      <td style="text-align: right;">
+        ${actionsHtml}
+      </td>
+    </tr>
+  `;
+}
+
+export function bindDealsEvents() {
+  const content = document.getElementById('content-area');
+  if (!content) return;
+
+  // Filters
+  content.addEventListener('input', (e) => {
+    if (e.target.id === 'filter-search-deal') {
+      currentFilters.search = e.target.value;
+      reRenderDealsOnly();
+    }
+  });
+
+  content.addEventListener('change', (e) => {
+    if (e.target.id === 'filter-stage-deal') {
+      currentFilters.stage = e.target.value;
+      reRenderDealsOnly();
+    }
+    if (e.target.id === 'filter-status-deal') {
+      currentFilters.status = e.target.value;
+      reRenderDealsOnly();
+    }
+    if (e.target.id === 'filter-priority-deal') {
+      currentFilters.priority = e.target.value;
+      reRenderDealsOnly();
+    }
+  });
+
+  content.addEventListener('click', (e) => {
+    // Clear Filters
+    if (e.target.id === 'btn-clear-deal-filters') {
+      currentFilters = { search: '', stage: '', status: '', priority: '' };
+      reRenderDealsFull();
+      return;
+    }
+
+    // New Deal
+    if (e.target.id === 'btn-new-deal') {
+      openDealModal();
+      return;
+    }
+
+    // Edit Deal
+    const editBtn = e.target.closest('.btn-edit-deal');
+    if (editBtn) {
+      openDealModal(editBtn.dataset.id);
+      return;
+    }
+
+    // Delete Deal
+    const deleteBtn = e.target.closest('.btn-delete-deal');
+    if (deleteBtn) {
+      if (confirm('Are you sure you want to delete this deal?')) {
+        const user = Auth.getCurrentUser();
+        if (!user || user.role !== 'manager') {
+          Toast.error('Permission Denied', 'Only managers can delete deals.');
+          return;
+        }
+        
+        const id = deleteBtn.dataset.id;
+        Store.deleteDeal(id);
+        Toast.success('Deleted', 'Deal has been removed.');
+        reRenderDealsFull();
+      }
+      return;
+    }
+    
+    // Modal actions
+    if (e.target.id === 'modal-overlay-deal' || e.target.closest('.btn-close-deal-modal')) {
+      closeDealModal();
+      return;
+    }
+
+    if (e.target.id === 'btn-save-deal') {
+      saveDeal();
+      return;
+    }
+  });
+}
+
+function reRenderDealsOnly() {
+  clearTimeout(window.dealFilterDebounce);
+  window.dealFilterDebounce = setTimeout(() => {
+    reRenderDealsFull();
+  }, 300);
+}
+
+function reRenderDealsFull() {
+  const contentEl = document.getElementById('content-area');
+  if (contentEl) {
+    contentEl.innerHTML = renderDeals();
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
+function openDealModal(dealId = null) {
+  const modal = document.getElementById('deal-modal');
+  const overlay = document.getElementById('modal-overlay-deal');
+  const user = Auth.getCurrentUser();
+  
+  let deal = { 
+    title: '', value: '', currency: 'INR', stage: 'sales', status: 'active', priority: 'medium', 
+    assignedTo: user.role === 'employee' ? user.id : '', leadId: '', contactId: '', notes: ''
+  };
+  
+  if (dealId) {
+    deal = Store.getDealById(dealId);
+    if (!deal || !Auth.canEditRecord(deal)) {
+      Toast.error('Error', 'Cannot edit this deal.');
+      return;
+    }
+  }
+
+  const isEdit = !!dealId;
+  const title = isEdit ? 'Edit Deal' : 'New Deal';
+  
+  const assignableUsers = getAssignableUsers();
+  const userOptions = assignableUsers.map(u => 
+    `<option value="${u.id}" ${deal.assignedTo === u.id ? 'selected' : ''}>${u.name}</option>`
+  ).join('');
+
+  // Contacts and Leads for linking
+  // In a real app, these would be searchable dropdowns. For now, simple selects.
+  const allLeads = Store.getLeadsForUser(user);
+  const leadOptions = allLeads.map(l => `<option value="${l.id}" ${deal.leadId === l.id ? 'selected' : ''}>${l.company} (${l.name})</option>`).join('');
+  
+  const allContacts = Store.getContacts();
+  const contactOptions = allContacts.map(c => `<option value="${c.id}" ${deal.contactId === c.id ? 'selected' : ''}>${c.company} (${c.name})</option>`).join('');
+
+  // Stage Options
+  const stageOptions = SOP_STAGES.map(s => `<option value="${s.key}" ${deal.stage === s.key ? 'selected' : ''}>${s.label}</option>`).join('');
+
+  modal.innerHTML = `
+    <div class="modal-header">
+      <h3 style="margin:0">${title}</h3>
+      <button class="btn btn-sm btn-close-deal-modal" style="background:none; border:none; font-size:1.5rem; cursor:pointer;">&times;</button>
+    </div>
+    <div class="modal-body" style="padding: 1.5rem;">
+      <input type="hidden" id="form-deal-id" value="${dealId || ''}">
+      <input type="hidden" id="form-deal-original-stage" value="${deal.stage}">
+      <input type="hidden" id="form-deal-original-status" value="${deal.status}">
+      
+      <div style="margin-bottom: 1rem;">
+        <label style="display:block; margin-bottom:0.5rem; font-weight:500;">Deal Title *</label>
+        <input type="text" id="form-deal-title" class="login-input" value="${deal.title}" required>
+      </div>
+
+      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
+        <div>
+          <label style="display:block; margin-bottom:0.5rem; font-weight:500;">Link Lead</label>
+          <select id="form-deal-lead" class="login-input">
+            <option value="">None</option>
+            ${leadOptions}
+          </select>
+        </div>
+        <div>
+          <label style="display:block; margin-bottom:0.5rem; font-weight:500;">Link Contact</label>
+          <select id="form-deal-contact" class="login-input">
+            <option value="">None</option>
+            ${contactOptions}
+          </select>
+        </div>
+      </div>
+
+      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
+        <div>
+          <label style="display:block; margin-bottom:0.5rem; font-weight:500;">Value (INR) *</label>
+          <input type="number" id="form-deal-value" class="login-input" value="${deal.value}" required min="0">
+        </div>
+        <div>
+          <label style="display:block; margin-bottom:0.5rem; font-weight:500;">Priority</label>
+          <select id="form-deal-priority" class="login-input">
+            <option value="low" ${deal.priority === 'low' ? 'selected' : ''}>Low</option>
+            <option value="medium" ${deal.priority === 'medium' ? 'selected' : ''}>Medium</option>
+            <option value="high" ${deal.priority === 'high' ? 'selected' : ''}>High</option>
+            <option value="urgent" ${deal.priority === 'urgent' ? 'selected' : ''}>Urgent</option>
+          </select>
+        </div>
+      </div>
+
+      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
+        <div>
+          <label style="display:block; margin-bottom:0.5rem; font-weight:500;">Stage</label>
+          <select id="form-deal-stage" class="login-input">
+            ${stageOptions}
+          </select>
+        </div>
+        <div>
+          <label style="display:block; margin-bottom:0.5rem; font-weight:500;">Status</label>
+          <select id="form-deal-status" class="login-input">
+            <option value="active" ${deal.status === 'active' ? 'selected' : ''}>Active</option>
+            <option value="won" ${deal.status === 'won' ? 'selected' : ''}>Won</option>
+            <option value="lost" ${deal.status === 'lost' ? 'selected' : ''}>Lost</option>
+          </select>
+        </div>
+        <div>
+          <label style="display:block; margin-bottom:0.5rem; font-weight:500;">Assigned To</label>
+          <select id="form-deal-assigned" class="login-input">
+            ${user.role !== 'employee' ? '<option value="">Unassigned</option>' : ''}
+            ${userOptions}
+          </select>
+        </div>
+      </div>
+
+      <div style="margin-bottom: 1.5rem;">
+        <label style="display:block; margin-bottom:0.5rem; font-weight:500;">Notes</label>
+        <textarea id="form-deal-notes" class="login-input" style="height: 80px;">${deal.notes || ''}</textarea>
+      </div>
+      
+      <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
+        <button class="btn btn-secondary btn-close-deal-modal">Cancel</button>
+        <button class="btn btn-primary" id="btn-save-deal">Save Deal</button>
+      </div>
+    </div>
+  `;
+
+  overlay.style.display = 'block';
+  modal.style.display = 'block';
+}
+
+function closeDealModal() {
+  document.getElementById('modal-overlay-deal').style.display = 'none';
+  document.getElementById('deal-modal').style.display = 'none';
+}
+
+function saveDeal() {
+  const user = Auth.getCurrentUser();
+  if (!user) return;
+
+  const id = document.getElementById('form-deal-id').value;
+  const title = document.getElementById('form-deal-title').value.trim();
+  const value = parseInt(document.getElementById('form-deal-value').value, 10);
+  
+  if (!title) {
+    Toast.error('Validation Error', 'Deal Title is required.');
+    return;
+  }
+
+  if (isNaN(value)) {
+    Toast.error('Validation Error', 'Deal Value must be a number.');
+    return;
+  }
+
+  let assignedTo = document.getElementById('form-deal-assigned').value || null;
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
+  // Determine Target Team ID
+  let targetTeamId = null;
+  if (assignedTo) {
+    const assignee = Store.getUserById(assignedTo);
+    if (assignee && assignee.teamId) targetTeamId = assignee.teamId;
+  }
+  if (!targetTeamId && user.role === 'team_lead') {
+    targetTeamId = user.teamId;
+  }
+
+  // Validate edit permissions and stage movement rules
+  const targetStage = document.getElementById('form-deal-stage').value;
+  const targetStageObj = SOP_STAGES.find(s => s.key === targetStage);
+  if (!targetStageObj) {
+    Toast.error('Invalid Stage', 'The selected stage is not a valid SOP stage.');
+    return;
+  }
+
+  let originalStage = document.getElementById('form-deal-original-stage').value || 'sales';
+  
+  if (id) {
+    const existingDeal = Store.getDealById(id);
+    if (!existingDeal || !Auth.canEditRecord(existingDeal)) {
+      Toast.error('Permission Denied', 'You do not have permission to edit this deal.');
+      return;
+    }
+    originalStage = existingDeal.stage;
+  }
+
+  let originalStageObj = null;
+  if (targetStage !== originalStage) {
+    originalStageObj = SOP_STAGES.find(s => s.key === originalStage);
+    if (id && !originalStageObj) {
+      Toast.error('Invalid Current Stage', 'The deal is currently in an invalid stage.');
+      return;
+    }
+  }
+
+  if (user.role !== 'manager' && targetStage !== originalStage) {
+    const fromIndex = originalStageObj ? SOP_STAGES.indexOf(originalStageObj) : SOP_STAGES.findIndex(s => s.key === originalStage);
+    const toIndex = SOP_STAGES.indexOf(targetStageObj);
+    
+    if (toIndex !== fromIndex && toIndex !== fromIndex + 1) {
+      Toast.error('Invalid Stage Move', 'You can only move a deal exactly one stage forward.');
+      return;
+    }
+  }
+
+  const status = document.getElementById('form-deal-status').value;
+  const originalStatus = document.getElementById('form-deal-original-status').value || 'active';
+  
+  let closedAt = null;
+  if (id) {
+    const existingDeal = Store.getDealById(id);
+    closedAt = existingDeal.closedAt;
+  }
+
+  if (status !== 'active' && !closedAt) {
+    closedAt = new Date().toISOString();
+  } else if (status === 'active') {
+    closedAt = null;
+  }
+
+  const dealData = {
+    title,
+    value,
+    currency: 'INR',
+    stage: targetStage,
+    status,
+    priority: document.getElementById('form-deal-priority').value,
+    assignedTo: assignedTo,
+    teamId: targetTeamId,
+    leadId: document.getElementById('form-deal-lead').value || null,
+    contactId: document.getElementById('form-deal-contact').value || null,
+    notes: document.getElementById('form-deal-notes').value.trim(),
+    closedAt
+  };
+
+  if (id) {
+    Store.updateDeal(id, dealData);
+    Toast.success('Success', 'Deal updated.');
+
+    if (targetStage !== originalStage) {
+       Store.createActivity({
+          id: generateId(), dealId: id, type: 'stage_change',
+          content: `Deal moved from ${originalStageObj.label} to ${targetStageObj.label}`,
+          fromStage: originalStage, toStage: targetStage,
+          createdBy: user.id, createdAt: new Date().toISOString()
+       });
+    }
+
+  } else {
+    dealData.id = 'deal_' + generateId();
+    dealData.createdAt = new Date().toISOString();
+    dealData.updatedAt = dealData.createdAt;
+    Store.createDeal(dealData);
+    Toast.success('Success', 'Deal created.');
+  }
+
+  closeDealModal();
+  reRenderDealsFull();
+}
```

## Tests Run
```text
Browser preview performed externally: Manager, Team Lead, and Employee deals visibility/actions checked
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
