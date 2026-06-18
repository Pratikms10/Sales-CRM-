// ============================================================
// TechnoEdge CRM — Project Handoffs & Delivery Tracker
// ============================================================

import { Store } from '../store.js';
import { Auth } from '../auth.js';
import { generateId, formatDate, timeAgo } from '../utils.js';
import { Toast } from '../components/toast.js';

const STATUSES = [
  { key: 'draft', label: 'Draft' },
  { key: 'handed_over', label: 'Handed Over' },
  { key: 'trainer_sourcing', label: 'Trainer Sourcing' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'in_delivery', label: 'In Delivery' },
  { key: 'completed', label: 'Completed' },
  { key: 'blocked', label: 'Blocked' },
  { key: 'cancelled', label: 'Cancelled' }
];

const PRIORITIES = [
  { key: 'low', label: 'Low' },
  { key: 'medium', label: 'Medium' },
  { key: 'high', label: 'High' },
  { key: 'urgent', label: 'Urgent' }
];

const DELIVERY_MODES = [
  { key: 'online', label: 'Online' },
  { key: 'onsite', label: 'Onsite' },
  { key: 'hybrid', label: 'Hybrid' },
  { key: 'not_decided', label: 'Not Decided' }
];

function getStatusRank(status) {
  const ranks = {
    'draft': 0,
    'handed_over': 1,
    'trainer_sourcing': 2,
    'scheduled': 3,
    'in_delivery': 4,
    'completed': 5,
    'blocked': 6,
    'cancelled': 7
  };
  return ranks[status] !== undefined ? ranks[status] : -1;
}

let currentHandoffId = null;

export function renderHandoffs() {
  const user = Auth.getCurrentUser();
  if (!user) return '';

  const handoffs = Store.getHandoffsForUser(user);

  const total = handoffs.length;
  const active = handoffs.filter(h => ['handed_over', 'trainer_sourcing', 'scheduled', 'in_delivery'].includes(h.deliveryStatus)).length;
  const completed = handoffs.filter(h => h.deliveryStatus === 'completed').length;
  const blocked = handoffs.filter(h => h.deliveryStatus === 'blocked').length;

  return `
    <div class="content-inner">
      <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
        <div>
          <h1 class="page-header-title">Project Handoffs</h1>
          <div class="page-header-subtitle">Manage delivery and project execution</div>
        </div>
        <button class="btn btn-primary" id="btn-new-handoff">
          <span class="icon">➕</span> New Handoff
        </button>
      </div>

      <div class="dashboard-grid" style="grid-template-columns: repeat(4, 1fr); margin-bottom: 2rem;">
        <div class="stat-card">
          <div class="stat-card-label">Total Handoffs</div>
          <div class="stat-card-value">${total}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">Active Delivery</div>
          <div class="stat-card-value" style="color:var(--color-primary);">${active}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">Completed</div>
          <div class="stat-card-value" style="color:var(--color-success);">${completed}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">Blocked</div>
          <div class="stat-card-value" style="color:var(--color-error);">${blocked}</div>
        </div>
      </div>

      <div class="filters-bar" style="display:flex; gap:1rem; margin-bottom:1rem; flex-wrap:wrap; background:var(--color-surface-card); padding:1rem; border-radius:8px; border:1px solid var(--color-hairline-soft);">
        <input type="text" class="login-input" id="handoff-filter-search" placeholder="Search projects..." style="flex:1; min-width:200px;">
        <select class="login-input" id="handoff-filter-status" style="width:160px;">
          <option value="all">All Statuses</option>
          ${STATUSES.map(s => `<option value="${s.key}">${s.label}</option>`).join('')}
        </select>
        <select class="login-input" id="handoff-filter-priority" style="width:160px;">
          <option value="all">All Priorities</option>
          ${PRIORITIES.map(p => `<option value="${p.key}">${p.label}</option>`).join('')}
        </select>
      </div>

      <div class="table-container" style="background:var(--color-surface-card); border-radius:8px; border:1px solid var(--color-hairline-soft); overflow-x:auto;">
        <table class="data-table" style="width:100%; text-align:left; border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:1px solid var(--color-hairline-soft);">
              <th style="padding:1rem;">Project / Company</th>
              <th style="padding:1rem;">Deal / Proposal</th>
              <th style="padding:1rem;">Status</th>
              <th style="padding:1rem;">Priority</th>
              <th style="padding:1rem;">Assigned To</th>
              <th style="padding:1rem;">Timeline</th>
              <th style="padding:1rem; text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody id="handoffs-tbody">
            <!-- Rendered via loadTable() -->
          </tbody>
        </table>
      </div>
    </div>

    <!-- Handoff Modal -->
    <div id="handoff-modal" class="modal-overlay" style="display:none;">
      <div class="modal" style="max-width:800px; width:90%;">
        <div class="modal-header">
          <h2 id="modal-handoff-heading">Create Project Handoff</h2>
          <button class="modal-close" id="btn-close-handoff-modal">&times;</button>
        </div>
        <div class="modal-body" style="max-height:70vh; overflow-y:auto;">
          <div class="form-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">

            <div class="form-group" style="grid-column: 1 / -1;">
              <label>Project Title *</label>
              <input type="text" class="login-input" id="modal-handoff-title" placeholder="e.g. Acme CRM Implementation">
            </div>

            <div class="form-group">
              <label>Linked Deal</label>
              <select class="login-input" id="modal-handoff-deal">
                <option value="">-- Select Deal --</option>
              </select>
            </div>
            <div class="form-group">
              <label>Linked Proposal</label>
              <select class="login-input" id="modal-handoff-proposal">
                <option value="">-- Select Proposal --</option>
              </select>
            </div>

            <div class="form-group">
              <label>Company Name *</label>
              <input type="text" class="login-input" id="modal-handoff-company">
            </div>
            <div class="form-group">
              <label>Client Contact</label>
              <select class="login-input" id="modal-handoff-contact">
                <option value="">-- Select Contact --</option>
              </select>
            </div>

            <div class="form-group" style="grid-column: 1 / -1;">
              <label>Project Brief *</label>
              <textarea class="login-input" id="modal-handoff-brief" rows="3" placeholder="Summary of delivery scope..."></textarea>
            </div>

            <div class="form-group">
              <label>Training Requirement</label>
              <input type="text" class="login-input" id="modal-handoff-training" placeholder="e.g. AWS Certification">
            </div>
            <div class="form-group">
              <label>Trainer Need</label>
              <input type="text" class="login-input" id="modal-handoff-trainer" placeholder="e.g. 1 Lead Trainer">
            </div>

            <div class="form-group">
              <label>Delivery Mode *</label>
              <select class="login-input" id="modal-handoff-mode">
                ${DELIVERY_MODES.map(m => `<option value="${m.key}">${m.label}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>Priority *</label>
              <select class="login-input" id="modal-handoff-priority">
                ${PRIORITIES.map(p => `<option value="${p.key}">${p.label}</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label>Expected Start Date</label>
              <input type="date" class="login-input" id="modal-handoff-start">
            </div>
            <div class="form-group">
              <label>Expected End Date</label>
              <input type="date" class="login-input" id="modal-handoff-end">
            </div>

            <div class="form-group">
              <label>Delivery Status *</label>
              <select class="login-input" id="modal-handoff-status">
                ${STATUSES.map(s => `<option value="${s.key}">${s.label}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>Assigned To *</label>
              <select class="login-input" id="modal-handoff-assigned"></select>
            </div>

            <div class="form-group" style="grid-column: 1 / -1;">
              <label>Blocker Reason (If Blocked)</label>
              <input type="text" class="login-input" id="modal-handoff-blocker" placeholder="Why is this blocked?">
            </div>

            <div class="form-group" style="grid-column: 1 / -1;">
              <label>Internal Notes</label>
              <textarea class="login-input" id="modal-handoff-notes" rows="2" placeholder="Private team notes..."></textarea>
            </div>

          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="btn-cancel-handoff">Cancel</button>
          <button class="btn btn-primary" id="btn-save-handoff">Save Handoff</button>
        </div>
      </div>
    </div>
  `;
}

function loadTable() {
  const tbody = document.getElementById('handoffs-tbody');
  const searchInput = document.getElementById('handoff-filter-search');
  const statusFilter = document.getElementById('handoff-filter-status');
  const priorityFilter = document.getElementById('handoff-filter-priority');

  if (!tbody || !searchInput || !statusFilter || !priorityFilter) return;

  const user = Auth.getCurrentUser();
  if (!user) return;

  const handoffs = Store.getHandoffsForUser(user);
  const search = searchInput.value.toLowerCase();
  const statusVal = statusFilter.value;
  const priorityVal = priorityFilter.value;

  const filtered = handoffs.filter(h => {
    const matchSearch = String(h.title || '').toLowerCase().includes(search) || String(h.companyName || '').toLowerCase().includes(search);
    const matchStatus = statusVal === 'all' || h.deliveryStatus === statusVal;
    const matchPriority = priorityVal === 'all' || h.priority === priorityVal;
    return matchSearch && matchStatus && matchPriority;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--color-muted);">No handoffs found.</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(h => {
    const deal = h.dealId ? Store.getDealById(h.dealId) : null;
    const prop = h.proposalId ? Store.getProposalById(h.proposalId) : null;
    const owner = Store.getUserById(h.assignedTo);
    const sLabel = STATUSES.find(s => s.key === h.deliveryStatus)?.label || h.deliveryStatus;
    const pLabel = PRIORITIES.find(p => p.key === h.priority)?.label || h.priority;

    const actions = [];
    if (Store.canUserEditHandoff(h, user)) {
      actions.push(`<button class="btn btn-sm btn-secondary edit-handoff" data-id="${h.id}">Edit</button>`);
    }
    if (user.role === 'manager') {
      actions.push(`<button class="btn btn-sm btn-secondary delete-handoff" style="color:var(--color-error); border-color:var(--color-error);" data-id="${h.id}">Delete</button>`);
    }

    return `
      <tr style="border-bottom:1px solid var(--color-hairline-soft);">
        <td style="padding:1rem;">
          <div style="font-weight:600;">${h.title}</div>
          <div style="font-size:0.8rem; color:var(--color-muted);">${h.companyName}</div>
        </td>
        <td style="padding:1rem;">
          ${deal ? `<div style="font-size:0.85rem;"><a href="#/deals/${deal.id}">${deal.title}</a></div>` : ''}
          ${prop ? `<div style="font-size:0.8rem; color:var(--color-muted);">Prop: ${prop.title}</div>` : ''}
        </td>
        <td style="padding:1rem;">
          <span class="badge ${h.deliveryStatus === 'blocked' ? 'badge-error' : h.deliveryStatus === 'completed' ? 'badge-success' : 'badge-neutral'}">${sLabel}</span>
        </td>
        <td style="padding:1rem;">${pLabel}</td>
        <td style="padding:1rem;">${owner ? owner.name : 'Unassigned'}</td>
        <td style="padding:1rem; font-size:0.85rem; color:var(--color-muted);">
          <div>${h.expectedStartDate ? formatDate(h.expectedStartDate) : 'TBD'} &rarr;</div>
          <div>${h.expectedEndDate ? formatDate(h.expectedEndDate) : 'TBD'}</div>
        </td>
        <td style="padding:1rem; text-align:right;">
          <div style="display:flex; gap:0.5rem; justify-content:flex-end;">
            ${actions.join('')}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function openModal(id = null, defaultData = null) {
  const modal = document.getElementById('handoff-modal');
  if (!modal) return;
  const user = Auth.getCurrentUser();
  if (!user) return;
  currentHandoffId = id;

  document.getElementById('modal-handoff-heading').innerText = id ? 'Edit Project Handoff' : 'Create Project Handoff';

  const deals = Store.getDealsForUser(user);
  const props = Store.getProposalsForUser(user);
  const contacts = Store.getContacts();

  document.getElementById('modal-handoff-deal').innerHTML = '<option value="">-- Select Deal --</option>' + deals.map(d => `<option value="${d.id}">${d.title}</option>`).join('');
  document.getElementById('modal-handoff-proposal').innerHTML = '<option value="">-- Select Proposal --</option>' + props.map(p => `<option value="${p.id}">${p.title}</option>`).join('');
  document.getElementById('modal-handoff-contact').innerHTML = '<option value="">-- Select Contact --</option>' + contacts.map(c => `<option value="${c.id}">${c.name} (${c.company})</option>`).join('');

  const assignedSelect = document.getElementById('modal-handoff-assigned');
  if (user.role === 'employee') {
    assignedSelect.innerHTML = `<option value="${user.id}">${user.name} (You)</option>`;
    assignedSelect.disabled = true;
  } else if (user.role === 'team_lead') {
    const teamUsers = Store.getUsersByTeam(user.teamId);
    teamUsers.push(user);
    const uniqueUsers = Array.from(new Map(teamUsers.map(u => [u.id, u])).values());
    assignedSelect.innerHTML = uniqueUsers.map(u => `<option value="${u.id}">${u.name}</option>`).join('');
    assignedSelect.disabled = false;
  } else {
    const allUsers = Store.getUsers().filter(u => u.isActive);
    assignedSelect.innerHTML = allUsers.map(u => `<option value="${u.id}">${u.name} (${Store.getTeamById(u.teamId)?.name || 'No Team'})</option>`).join('');
    assignedSelect.disabled = false;
  }

  const dealSelect = document.getElementById('modal-handoff-deal');
  const propSelect = document.getElementById('modal-handoff-proposal');
  const companyInput = document.getElementById('modal-handoff-company');

  if (id) {
    const h = Store.getHandoffById(id);
    if (!h || !Store.canUserEditHandoff(h, user)) {
      Toast.error('Error', 'Cannot edit this handoff.');
      return;
    }
    document.getElementById('modal-handoff-title').value = h.title || '';
    document.getElementById('modal-handoff-deal').value = h.dealId || '';
    document.getElementById('modal-handoff-proposal').value = h.proposalId || '';
    document.getElementById('modal-handoff-company').value = h.companyName || '';
    document.getElementById('modal-handoff-contact').value = h.clientContactId || '';
    document.getElementById('modal-handoff-brief').value = h.projectBrief || '';
    document.getElementById('modal-handoff-training').value = h.trainingRequirement || '';
    document.getElementById('modal-handoff-trainer').value = h.trainerNeed || '';
    document.getElementById('modal-handoff-mode').value = h.deliveryMode || 'not_decided';
    document.getElementById('modal-handoff-priority').value = h.priority || 'medium';
    document.getElementById('modal-handoff-start').value = h.expectedStartDate ? h.expectedStartDate.split('T')[0] : '';
    document.getElementById('modal-handoff-end').value = h.expectedEndDate ? h.expectedEndDate.split('T')[0] : '';
    document.getElementById('modal-handoff-status').value = h.deliveryStatus || 'draft';

    if (user.role !== 'manager') {
      const sSelect = document.getElementById('modal-handoff-status');
      Array.from(sSelect.options).forEach(opt => {
        const nRank = getStatusRank(opt.value);
        const oRank = getStatusRank(h.deliveryStatus);

        let allowed = false;
        if (opt.value === h.deliveryStatus) allowed = true;
        else if (opt.value === 'blocked') allowed = true;
        else if (h.deliveryStatus === 'blocked' && nRank >= 0 && nRank <= 5) allowed = true; // allow unblocking to any happy path
        else if (nRank === oRank + 1) allowed = true; // sequential forward

        opt.disabled = !allowed;
      });
    }

    assignedSelect.value = h.assignedTo || user.id;
    document.getElementById('modal-handoff-blocker').value = h.blockerReason || '';
    document.getElementById('modal-handoff-notes').value = h.internalNotes || '';
  } else {
    document.getElementById('modal-handoff-title').value = '';
    document.getElementById('modal-handoff-deal').value = defaultData?.dealId || '';
    document.getElementById('modal-handoff-proposal').value = defaultData?.proposalId || '';
    document.getElementById('modal-handoff-company').value = defaultData?.companyName || '';
    document.getElementById('modal-handoff-contact').value = defaultData?.contactId || '';
    document.getElementById('modal-handoff-brief').value = '';
    document.getElementById('modal-handoff-training').value = '';
    document.getElementById('modal-handoff-trainer').value = '';
    document.getElementById('modal-handoff-mode').value = 'not_decided';
    document.getElementById('modal-handoff-priority').value = 'medium';
    document.getElementById('modal-handoff-start').value = '';
    document.getElementById('modal-handoff-end').value = '';

    const sSelect = document.getElementById('modal-handoff-status');
    Array.from(sSelect.options).forEach(opt => opt.disabled = false);
    sSelect.value = 'draft';

    assignedSelect.value = user.id;
    document.getElementById('modal-handoff-blocker').value = '';
    document.getElementById('modal-handoff-notes').value = '';

    if (defaultData?.dealId) {
      const d = Store.getDealById(defaultData.dealId);
      if (d) {
        const lead = d.leadId ? Store.getLeadById(d.leadId) : null;
        if (lead && !defaultData.companyName) document.getElementById('modal-handoff-company').value = lead.company;
        if (d.contactId) document.getElementById('modal-handoff-contact').value = d.contactId;
      }
    }
  }

  modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('handoff-modal');
  if (modal) modal.style.display = 'none';
  currentHandoffId = null;
}

function handleSaveHandoff() {
  const user = Auth.getCurrentUser();
  if (!user) return;

  const title = document.getElementById('modal-handoff-title').value.trim();
  const companyName = document.getElementById('modal-handoff-company').value.trim();
  const projectBrief = document.getElementById('modal-handoff-brief').value.trim();
  let deliveryMode = document.getElementById('modal-handoff-mode').value;
  let deliveryStatus = document.getElementById('modal-handoff-status').value;
  let priority = document.getElementById('modal-handoff-priority').value;

  if (!title || !companyName || !projectBrief) {
    return Toast.error('Validation Error', 'Title, Company Name, and Project Brief are required.');
  }

  if (!STATUSES.some(s => s.key === deliveryStatus)) return Toast.error('Validation Error', 'Invalid status.');
  if (!PRIORITIES.some(p => p.key === priority)) return Toast.error('Validation Error', 'Invalid priority.');
  if (!DELIVERY_MODES.some(m => m.key === deliveryMode)) return Toast.error('Validation Error', 'Invalid delivery mode.');

  let dealId = document.getElementById('modal-handoff-deal').value || null;
  const proposalId = document.getElementById('modal-handoff-proposal').value || null;
  const contactId = document.getElementById('modal-handoff-contact').value || null;

  if (proposalId && !dealId) {
    const p = Store.getProposalById(proposalId);
    if (p && p.dealId) dealId = p.dealId;
  }

  if (contactId && !Store.getContactById(contactId)) {
    return Toast.error('Validation Error', 'Selected client contact does not exist.');
  }

  let dealTeamId = null;
  let requirementId = null;
  let requirementTeamId = null;

  if (dealId) {
    const d = Store.getDealById(dealId);
    if (!d) return Toast.error('Error', 'Linked Deal does not exist.');
    if (!Auth.canViewRecord(d)) return Toast.error('Error', 'Permission denied for linked Deal.');
    if (d.status !== 'closed_won') {
      if (user.role !== 'manager') {
        return Toast.error('Error', 'Deal must be Closed Won to create a handoff.');
      } else {
        if (!confirm('Warning: Linked Deal is not Closed Won. Create draft handoff anyway?')) return;
        deliveryStatus = 'draft';
      }
    }
    dealTeamId = d.teamId;
  }

  if (proposalId) {
    const p = Store.getProposalById(proposalId);
    if (!p) return Toast.error('Error', 'Linked Proposal does not exist.');
    if (!Store.canUserViewProposal(p, user)) return Toast.error('Error', 'Permission denied for linked Proposal.');
    if (p.status !== 'accepted') {
      if (user.role !== 'manager') {
        return Toast.error('Error', 'Proposal must be Accepted to create a handoff.');
      } else {
        if (!confirm('Warning: Linked Proposal is not Accepted. Create draft handoff anyway?')) return;
        deliveryStatus = 'draft';
      }
    }
    if (p.requirementId) {
      const r = Store.getRequirementById(p.requirementId);
      if (!r || !Store.canUserViewRequirement(r, user)) return Toast.error('Error', 'Permission denied for underlying Requirement.');
      requirementId = p.requirementId;
      requirementTeamId = r.teamId;
    }
  }

  // Duplicate Check
  if (!currentHandoffId) {
    const allHandoffs = Store.getHandoffs();
    const dup = allHandoffs.find(h => (dealId && h.dealId === dealId) || (proposalId && h.proposalId === proposalId));
    if (dup) {
      if (user.role !== 'manager') {
        return Toast.error('Duplicate Error', 'A handoff already exists for this deal or proposal.');
      } else {
        if (!confirm('A handoff already exists for this deal/proposal. Create duplicate?')) return;
      }
    }
  }

  let assignedTo = document.getElementById('modal-handoff-assigned').value;
  if (user.role === 'employee') {
    assignedTo = user.id;
  } else if (user.role === 'team_lead') {
    const target = Store.getUserById(assignedTo);
    if (!target || (target.teamId !== user.teamId && target.id !== user.id)) {
      return Toast.error('Error', 'Cannot assign outside your team.');
    }
  }

  const assignedUser = Store.getUserById(assignedTo);
  if (!assignedUser) return Toast.error('Error', 'Assigned user does not exist.');

  let finalTeamId = assignedUser.teamId || null;
  if (!finalTeamId && dealTeamId) finalTeamId = dealTeamId;
  if (!finalTeamId && requirementTeamId) finalTeamId = requirementTeamId;
  if (!finalTeamId) finalTeamId = user.teamId || null;

  const startRaw = document.getElementById('modal-handoff-start').value;
  const endRaw = document.getElementById('modal-handoff-end').value;

  let startIso = null;
  let endIso = null;
  if (startRaw) {
    const d = new Date(startRaw);
    if (isNaN(d.getTime())) return Toast.error('Error', 'Invalid start date.');
    startIso = d.toISOString();
  }
  if (endRaw) {
    const d = new Date(endRaw);
    if (isNaN(d.getTime())) return Toast.error('Error', 'Invalid end date.');
    endIso = d.toISOString();
  }

  const oldRecord = currentHandoffId ? Store.getHandoffById(currentHandoffId) : null;

  if (currentHandoffId && !oldRecord) {
     return Toast.error('Error', 'Handoff not found.');
  }

  if (oldRecord) {
     if (!Store.canUserEditHandoff(oldRecord, user)) {
       return Toast.error('Error', 'Cannot edit this handoff.');
     }
     if (user.role !== 'manager') {
       const nRank = getStatusRank(deliveryStatus);
       const oRank = getStatusRank(oldRecord.deliveryStatus);

       let allowed = false;
       if (deliveryStatus === oldRecord.deliveryStatus) allowed = true;
       else if (deliveryStatus === 'blocked') allowed = true;
       else if (oldRecord.deliveryStatus === 'blocked' && nRank >= 0 && nRank <= 5) allowed = true;
       else if (nRank === oRank + 1) allowed = true;

       if (!allowed) {
         return Toast.error('Error', 'Invalid status transition.');
       }
     }
  }

  const payload = {
    title,
    dealId,
    proposalId,
    requirementId,
    companyName,
    clientContactId: contactId,
    projectBrief,
    trainingRequirement: document.getElementById('modal-handoff-training').value.trim(),
    trainerNeed: document.getElementById('modal-handoff-trainer').value.trim(),
    deliveryMode,
    priority,
    expectedStartDate: startIso,
    expectedEndDate: endIso,
    deliveryStatus,
    assignedTo,
    teamId: finalTeamId,
    blockerReason: document.getElementById('modal-handoff-blocker').value.trim(),
    internalNotes: document.getElementById('modal-handoff-notes').value.trim(),
  };

  let saved;
  if (currentHandoffId) {
    saved = Store.updateHandoff(currentHandoffId, payload);
    if (!saved) return Toast.error('Error', 'Failed to update handoff.');
    Toast.success('Updated', 'Handoff updated successfully.');

    if (oldRecord.deliveryStatus !== saved.deliveryStatus) {
       Store.createActivity({
          id: generateId(),
          title: `Handoff Status: ${saved.deliveryStatus}`,
          type: 'stage_change',
          dealId: saved.dealId || null,
          assignedTo: user.id,
          teamId: user.teamId,
          createdBy: user.id,
          createdAt: new Date().toISOString()
       });
    }
    if (oldRecord.assignedTo !== saved.assignedTo) {
       Store.createActivity({
          id: generateId(),
          title: `Handoff reassigned to ${assignedUser.name}`,
          type: 'note',
          dealId: saved.dealId || null,
          assignedTo: user.id,
          teamId: user.teamId,
          createdBy: user.id,
          createdAt: new Date().toISOString()
       });
    }
  } else {
    payload.id = generateId();
    payload.createdBy = user.id;
    payload.createdAt = new Date().toISOString();
    payload.updatedAt = payload.createdAt;
    saved = Store.createHandoff(payload);
    if (!saved) return Toast.error('Error', 'Failed to create handoff.');
    Toast.success('Created', 'Project handoff created successfully.');

    Store.createActivity({
       id: generateId(),
       title: `Project Handoff Created`,
       type: 'stage_change',
       dealId: saved.dealId || null,
       notes: `Handoff: ${saved.title}`,
       assignedTo: user.id,
       teamId: user.teamId,
       createdBy: user.id,
       createdAt: new Date().toISOString()
    });
  }

  closeModal();
  import('../router.js').then(m => m.Router.handleRoute());
}

let eventsBound = false;

export function bindHandoffsEvents() {
  if (eventsBound) return;
  eventsBound = true;

  const content = document.getElementById('content-area');
  if (!content) return;

  // Delegate all clicks
  content.addEventListener('click', e => {
    if (e.target.closest('#btn-new-handoff')) {
      openModal();
    }
    if (e.target.closest('#btn-close-handoff-modal') || e.target.closest('#btn-cancel-handoff')) {
      closeModal();
    }
    if (e.target.closest('#btn-save-handoff')) {
      handleSaveHandoff();
    }
    const editBtn = e.target.closest('.edit-handoff');
    if (editBtn) {
      openModal(editBtn.getAttribute('data-id'));
    }
    const deleteBtn = e.target.closest('.delete-handoff');
    if (deleteBtn) {
      const user = Auth.getCurrentUser();
      if (user?.role !== 'manager') {
        Toast.error('Access Denied', 'Only managers can delete handoffs.');
        return;
      }
      const id = deleteBtn.getAttribute('data-id');
      const h = Store.getHandoffById(id);
      if (!h) return Toast.error('Error', 'Handoff not found.');

      if (confirm('Are you sure you want to delete this handoff?')) {
        if (Store.deleteHandoff(id)) {
          Toast.success('Deleted', 'Handoff deleted.');
          import('../router.js').then(m => m.Router.handleRoute());
        } else {
          Toast.error('Error', 'Failed to delete handoff.');
        }
      }
    }
  });

  // Delegate input/change for filters and autofills
  content.addEventListener('input', e => {
    if (e.target.id === 'handoff-filter-search') {
      loadTable();
    }
  });

  content.addEventListener('change', e => {
    if (e.target.id === 'handoff-filter-status' || e.target.id === 'handoff-filter-priority') {
      loadTable();
    }

    if (e.target.id === 'modal-handoff-deal') {
      const dealSelect = e.target;
      const companyInput = document.getElementById('modal-handoff-company');
      const d = Store.getDealById(dealSelect.value);
      if (d) {
        const lead = d.leadId ? Store.getLeadById(d.leadId) : null;
        if (lead && !companyInput.value) companyInput.value = lead.company;
        if (d.contactId) document.getElementById('modal-handoff-contact').value = d.contactId;
      }
    }

    if (e.target.id === 'modal-handoff-proposal') {
      const propSelect = e.target;
      const dealSelect = document.getElementById('modal-handoff-deal');
      const p = Store.getProposalById(propSelect.value);
      if (p && p.dealId && !dealSelect.value) {
        dealSelect.value = p.dealId;
        // manually dispatch change event to trigger deal auto-fill
        dealSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  });
}

// Hook called by router or app.js after render, if needed to load data initially
// For now we can just execute logic when we want to check for pending creations
export function initHandoffsPage() {
  loadTable();
  const pendingDealId = sessionStorage.getItem('pendingHandoffDealId');
  if (pendingDealId) {
    sessionStorage.removeItem('pendingHandoffDealId');
    const d = Store.getDealById(pendingDealId);
    let defaultData = { dealId: pendingDealId };
    if (d) {
       defaultData.companyName = Store.getLeadById(d.leadId)?.company || '';
       defaultData.contactId = d.contactId || '';
       const props = Store.getProposals().filter(p => p.dealId === d.id && p.status === 'accepted');
       if (props.length > 0) defaultData.proposalId = props[0].id;
    }
    openModal(null, defaultData);
  }
}
