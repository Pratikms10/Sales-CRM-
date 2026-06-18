// ============================================================
// TechnoEdge CRM — Requirements Page
// ============================================================

import { Store } from '../store.js';
import { Auth } from '../auth.js';
import { Toast } from '../components/toast.js';
import { formatDateTime } from '../utils.js';

let filters = {
  search: '',
  type: 'all',
  status: 'all',
  priority: 'all',
  owner: 'all'
};

const REQ_TYPES = [
  { key: 'training', label: 'Training' },
  { key: 'elearning', label: 'eLearning' },
  { key: 'hiring', label: 'Hiring' },
  { key: 'consulting', label: 'Consulting' },
  { key: 'other', label: 'Other' }
];

const REQ_STATUSES = [
  { key: 'draft', label: 'Draft' },
  { key: 'captured', label: 'Captured' },
  { key: 'validated', label: 'Validated' },
  { key: 'proposal_ready', label: 'Proposal Ready' },
  { key: 'closed', label: 'Closed' }
];

const PRIORITIES = [
  { key: 'low', label: 'Low' },
  { key: 'medium', label: 'Medium' },
  { key: 'high', label: 'High' },
  { key: 'urgent', label: 'Urgent' }
];

// ── Helpers ───────────────────────────────────────────────────

function getFilteredData() {
  const user = Auth.getCurrentUser();
  if (!user) return [];

  let reqs = Store.getRequirementsForUser(user);

  // Search
  if (filters.search) {
    const term = filters.search.toLowerCase();
    reqs = reqs.filter(r => {
      const u = Store.getUserById(r.assignedTo || r.createdBy);
      const uName = u ? u.name.toLowerCase() : '';
      const t = (r.title || '').toLowerCase();
      const c = (r.companyName || '').toLowerCase();
      let l = '';
      if (r.dealId) { const d = Store.getDealById(r.dealId); if (d) l = d.title.toLowerCase(); }
      else if (r.leadId) { const ld = Store.getLeadById(r.leadId); if (ld) l = ld.name.toLowerCase() + ' ' + ld.company.toLowerCase(); }
      return t.includes(term) || c.includes(term) || uName.includes(term) || l.includes(term);
    });
  }

  if (filters.type !== 'all') reqs = reqs.filter(r => r.requirementType === filters.type);
  if (filters.status !== 'all') reqs = reqs.filter(r => r.status === filters.status);
  if (filters.priority !== 'all') reqs = reqs.filter(r => r.priority === filters.priority);
  if (filters.owner !== 'all') reqs = reqs.filter(r => r.assignedTo === filters.owner);

  return reqs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

function getLinkedRecordLabel(r) {
  if (r.dealId) {
    const d = Store.getDealById(r.dealId);
    return d ? `<a href="#/deals/${d.id}" class="btn-link">Deal: ${d.title}</a>` : 'Deal (Deleted)';
  }
  if (r.leadId) {
    const ld = Store.getLeadById(r.leadId);
    return ld ? `Lead: ${ld.name}` : 'Lead (Deleted)';
  }
  return '—';
}

function getLabel(key, array) {
  const obj = array.find(o => o.key === key);
  return obj ? obj.label : key;
}

// ── Components ────────────────────────────────────────────────

function buildKPIs(reqs) {
  const total = reqs.length;
  const captured = reqs.filter(r => r.status === 'captured').length;
  const proposalReady = reqs.filter(r => r.status === 'proposal_ready').length;
  const urgent = reqs.filter(r => r.priority === 'urgent').length;

  return `
    <div class="activity-kpi-grid">
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-card-label">Total Requirements</div>
          <div class="stat-card-value">${total}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-card-label" style="color: var(--color-primary);">Captured</div>
          <div class="stat-card-value">${captured}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-card-label" style="color: var(--color-success);">Proposal Ready</div>
          <div class="stat-card-value">${proposalReady}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-card-label" style="color: var(--color-error);">Urgent</div>
          <div class="stat-card-value">${urgent}</div>
        </div>
      </div>
    </div>
  `;
}

function buildFilters(user) {
  let ownerOptions = `<option value="all">All Owners</option>`;
  if (user.role === 'manager') {
    Store.getUsers().forEach(u => {
      ownerOptions += `<option value="${u.id}" ${filters.owner === u.id ? 'selected' : ''}>${u.name}</option>`;
    });
  } else if (user.role === 'team_lead') {
    Store.getUsersByTeam(user.teamId).forEach(u => {
      if (u.id !== user.id) ownerOptions += `<option value="${u.id}" ${filters.owner === u.id ? 'selected' : ''}>${u.name}</option>`;
    });
    ownerOptions += `<option value="${user.id}" ${filters.owner === user.id ? 'selected' : ''}>${user.name}</option>`;
  } else {
    ownerOptions += `<option value="${user.id}" ${filters.owner === user.id ? 'selected' : ''}>${user.name} (Me)</option>`;
  }

  const typeOpts = REQ_TYPES.map(t => `<option value="${t.key}" ${filters.type === t.key ? 'selected' : ''}>${t.label}</option>`).join('');
  const statusOpts = REQ_STATUSES.map(s => `<option value="${s.key}" ${filters.status === s.key ? 'selected' : ''}>${s.label}</option>`).join('');
  const priorityOpts = PRIORITIES.map(p => `<option value="${p.key}" ${filters.priority === p.key ? 'selected' : ''}>${p.label}</option>`).join('');

  return `
    <div class="filter-bar">
      <div style="flex: 1;">
        <input type="text" id="req-search" class="login-input" placeholder="Search requirements..." value="${filters.search}">
      </div>
      <div>
        <select id="req-type" class="login-input" style="padding-right:32px;">
          <option value="all">All Types</option>
          ${typeOpts}
        </select>
      </div>
      <div>
        <select id="req-status" class="login-input" style="padding-right:32px;">
          <option value="all">All Statuses</option>
          ${statusOpts}
        </select>
      </div>
      <div>
        <select id="req-priority" class="login-input" style="padding-right:32px;">
          <option value="all">Any Priority</option>
          ${priorityOpts}
        </select>
      </div>
      <div>
        <select id="req-owner" class="login-input" style="padding-right:32px;">
          ${ownerOptions}
        </select>
      </div>
      <button class="btn btn-secondary" id="btn-req-clear">Clear</button>
    </div>
  `;
}

function buildTable(reqs, user) {
  const rows = reqs.map(r => {
    const owner = Store.getUserById(r.assignedTo || r.createdBy);
    const ownerName = owner ? owner.name : 'Unknown';

    const canEdit = Store.canUserEditRequirement(r, user);
    const canDelete = user.role === 'manager';

    let actions = '';
    if (canEdit) actions += `<button class="btn btn-sm btn-secondary" data-action="edit-req" data-id="${r.id}" style="margin-right:4px;">Edit</button>`;
    if (canDelete) actions += `<button class="btn btn-sm" style="background:var(--color-error); color:white;" data-action="delete-req" data-id="${r.id}">Delete</button>`;

    return `
      <tr>
        <td style="font-weight:600;">${r.title}</td>
        <td>${r.companyName || '—'}</td>
        <td>${getLinkedRecordLabel(r)}</td>
        <td>${getLabel(r.requirementType, REQ_TYPES)}</td>
        <td><span class="badge badge-neutral">${getLabel(r.status, REQ_STATUSES)}</span></td>
        <td><span class="badge ${r.priority === 'urgent' ? 'badge-error' : 'badge-neutral'}">${getLabel(r.priority, PRIORITIES)}</span></td>
        <td>${ownerName}</td>
        <td>${formatDateTime(r.updatedAt)}</td>
        <td style="text-align:right;">${actions}</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="card" style="overflow-x:auto;">
      <table class="data-table">
        <thead>
          <tr>
            <th>Requirement</th>
            <th>Company</th>
            <th>Linked To</th>
            <th>Type</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Owner</th>
            <th>Updated</th>
            <th style="text-align:right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${rows || '<tr><td colspan="9" style="text-align:center;">No requirements found</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
}

// ── Modal ─────────────────────────────────────────────────────

export function renderRequirementModal(reqId = null, defaults = {}) {
  const user = Auth.getCurrentUser();
  if (!user) return;

  let r = {
    title: defaults.title || '',
    dealId: defaults.dealId || '',
    leadId: defaults.leadId || '',
    contactId: defaults.contactId || '',
    companyName: defaults.companyName || '',
    requirementType: defaults.requirementType || 'training',
    productInterest: defaults.productInterest || '',
    audienceSize: defaults.audienceSize || '',
    deliveryMode: defaults.deliveryMode || 'not_decided',
    timeline: defaults.timeline || '',
    budgetRange: defaults.budgetRange || '',
    decisionMaker: defaults.decisionMaker || '',
    summary: defaults.summary || '',
    painPoints: defaults.painPoints || '',
    successCriteria: defaults.successCriteria || '',
    status: defaults.status || 'draft',
    priority: defaults.priority || 'medium',
    assignedTo: defaults.assignedTo || user.id,
    linkedType: 'none'
  };

  if (reqId) {
    const existing = Store.getRequirementById(reqId);
    if (!existing || !Store.canUserEditRequirement(existing, user)) {
      return Toast.error('Error', 'Permission denied or not found.');
    }
    r = { ...r, ...existing };
    if (r.dealId) r.linkedType = 'deal';
    else if (r.leadId) r.linkedType = 'lead';
    else r.linkedType = 'none';
  } else {
    if (r.dealId) r.linkedType = 'deal';
    else if (r.leadId) r.linkedType = 'lead';
  }

  let ownerOptions = '';
  if (user.role === 'manager') {
    ownerOptions = Store.getUsers().map(u => `<option value="${u.id}" ${u.id === r.assignedTo ? 'selected' : ''}>${u.name}</option>`).join('');
  } else if (user.role === 'team_lead') {
    const teamUsers = Store.getUsersByTeam(user.teamId).filter(u => u.id !== user.id);
    teamUsers.push(user);
    ownerOptions = teamUsers.map(u => `<option value="${u.id}" ${u.id === r.assignedTo ? 'selected' : ''}>${u.name}</option>`).join('');
  } else {
    ownerOptions = `<option value="${user.id}" selected>${user.name}</option>`;
  }

  const modalHtml = `
    <div class="modal" id="req-modal">
      <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
        <div class="modal-header">
          <h2 class="modal-title">${reqId ? 'Edit Requirement' : 'New Requirement'}</h2>
          <button class="modal-close" id="btn-close-req-modal">&times;</button>
        </div>
        <div class="modal-body">
          
          <div style="display:flex; gap:1rem; margin-bottom:1rem;">
            <div style="flex:2;">
              <label class="login-label">Title <span style="color:red;">*</span></label>
              <input type="text" id="modal-req-title" class="login-input" value="${r.title}">
            </div>
            <div style="flex:1;">
              <label class="login-label">Status</label>
              <select id="modal-req-status" class="login-input">
                ${REQ_STATUSES.map(s => `<option value="${s.key}" ${r.status === s.key ? 'selected' : ''}>${s.label}</option>`).join('')}
              </select>
            </div>
          </div>

          <div style="display:flex; gap:1rem; margin-bottom:1rem;">
            <div style="flex:1;">
              <label class="login-label">Linked Record Type</label>
              <select id="modal-req-linked-type" class="login-input">
                <option value="none" ${r.linkedType === 'none' ? 'selected' : ''}>None</option>
                <option value="deal" ${r.linkedType === 'deal' ? 'selected' : ''}>Deal</option>
                <option value="lead" ${r.linkedType === 'lead' ? 'selected' : ''}>Lead</option>
              </select>
            </div>
            <div style="flex:1;">
              <label class="login-label">Linked Record</label>
              <select id="modal-req-linked-id" class="login-input" ${r.linkedType === 'none' ? 'disabled' : ''}></select>
            </div>
            <div style="flex:1;">
              <label class="login-label">Contact (Optional)</label>
              <select id="modal-req-contact-id" class="login-input">
                <option value="">-- None --</option>
                ${Store.getContacts().map(c => `<option value="${c.id}" ${r.contactId === c.id ? 'selected' : ''}>${c.name} (${c.company})</option>`).join('')}
              </select>
            </div>
          </div>

          <div style="display:flex; gap:1rem; margin-bottom:1rem;">
            <div style="flex:1;">
              <label class="login-label">Company Name</label>
              <input type="text" id="modal-req-company" class="login-input" value="${r.companyName}">
            </div>
            <div style="flex:1;">
              <label class="login-label">Requirement Type <span style="color:red;">*</span></label>
              <select id="modal-req-type" class="login-input">
                ${REQ_TYPES.map(t => `<option value="${t.key}" ${r.requirementType === t.key ? 'selected' : ''}>${t.label}</option>`).join('')}
              </select>
            </div>
            <div style="flex:1;">
              <label class="login-label">Priority</label>
              <select id="modal-req-priority" class="login-input">
                ${PRIORITIES.map(p => `<option value="${p.key}" ${r.priority === p.key ? 'selected' : ''}>${p.label}</option>`).join('')}
              </select>
            </div>
          </div>

          <div style="display:flex; gap:1rem; margin-bottom:1rem;">
            <div style="flex:1;">
              <label class="login-label">Product Interest</label>
              <input type="text" id="modal-req-product" class="login-input" value="${r.productInterest}">
            </div>
            <div style="flex:1;">
              <label class="login-label">Audience Size</label>
              <input type="text" id="modal-req-audience" class="login-input" value="${r.audienceSize}">
            </div>
            <div style="flex:1;">
              <label class="login-label">Delivery Mode</label>
              <select id="modal-req-delivery" class="login-input">
                <option value="not_decided" ${r.deliveryMode === 'not_decided' ? 'selected' : ''}>Not Decided</option>
                <option value="online" ${r.deliveryMode === 'online' ? 'selected' : ''}>Online</option>
                <option value="onsite" ${r.deliveryMode === 'onsite' ? 'selected' : ''}>Onsite</option>
                <option value="hybrid" ${r.deliveryMode === 'hybrid' ? 'selected' : ''}>Hybrid</option>
              </select>
            </div>
          </div>

          <div style="display:flex; gap:1rem; margin-bottom:1rem;">
            <div style="flex:1;">
              <label class="login-label">Timeline</label>
              <input type="text" id="modal-req-timeline" class="login-input" value="${r.timeline}" placeholder="e.g. Q3 2026">
            </div>
            <div style="flex:1;">
              <label class="login-label">Budget Range</label>
              <input type="text" id="modal-req-budget" class="login-input" value="${r.budgetRange}" placeholder="e.g. $10k - $20k">
            </div>
            <div style="flex:1;">
              <label class="login-label">Decision Maker</label>
              <input type="text" id="modal-req-decision" class="login-input" value="${r.decisionMaker}">
            </div>
          </div>

          <div style="margin-bottom:1rem;">
            <label class="login-label">Summary <span style="color:red;">*</span></label>
            <textarea id="modal-req-summary" class="login-input" style="height:60px;" required>${r.summary}</textarea>
          </div>
          <div style="display:flex; gap:1rem; margin-bottom:1rem;">
            <div style="flex:1;">
              <label class="login-label">Pain Points</label>
              <textarea id="modal-req-pain" class="login-input" style="height:60px;">${r.painPoints}</textarea>
            </div>
            <div style="flex:1;">
              <label class="login-label">Success Criteria</label>
              <textarea id="modal-req-success" class="login-input" style="height:60px;">${r.successCriteria}</textarea>
            </div>
          </div>

          <div style="margin-bottom:1rem;">
            <label class="login-label">Assigned To</label>
            <select id="modal-req-owner" class="login-input" ${user.role === 'employee' ? 'disabled' : ''}>
              ${ownerOptions}
            </select>
          </div>

        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="btn-cancel-req-modal">Cancel</button>
          <button class="btn btn-primary" id="btn-save-req" data-id="${reqId || ''}">Save</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const populateLinked = (type, selId) => {
    const sel = document.getElementById('modal-req-linked-id');
    if (!sel) return;
    if (type === 'none') {
      sel.innerHTML = '<option value="">-- None --</option>';
      sel.disabled = true;
      return;
    }
    sel.disabled = false;
    let options = [];
    if (type === 'deal') {
      options = Store.getDealsForUser(user).map(d => `<option value="${d.id}" ${d.id === selId ? 'selected' : ''}>${d.title}</option>`);
    } else if (type === 'lead') {
      options = Store.getLeadsForUser(user).map(l => `<option value="${l.id}" ${l.id === selId ? 'selected' : ''}>${l.name} (${l.company})</option>`);
    }
    sel.innerHTML = options.length ? options.join('') : '<option value="">-- No records --</option>';
  };

  const initialLinkedId = r.linkedType === 'deal' ? r.dealId : (r.linkedType === 'lead' ? r.leadId : null);
  populateLinked(r.linkedType, initialLinkedId);

  document.getElementById('modal-req-linked-type').addEventListener('change', e => {
    populateLinked(e.target.value, null);
  });

  const closeFn = () => { const m = document.getElementById('req-modal'); if (m) m.remove(); };
  document.getElementById('btn-close-req-modal').addEventListener('click', closeFn);
  document.getElementById('btn-cancel-req-modal').addEventListener('click', closeFn);

  document.getElementById('btn-save-req').addEventListener('click', () => {
    const title = document.getElementById('modal-req-title').value.trim();
    const type = document.getElementById('modal-req-type').value;
    const summary = document.getElementById('modal-req-summary').value.trim();
    if (!title || !type || !summary) return Toast.error('Validation Error', 'Title, Type, and Summary are required.');

    // Validate enums
    if (!REQ_TYPES.some(t => t.key === type)) return Toast.error('Validation Error', 'Invalid requirement type.');
    const statusVal = document.getElementById('modal-req-status').value;
    if (!REQ_STATUSES.some(s => s.key === statusVal)) return Toast.error('Validation Error', 'Invalid status.');
    const priorityVal = document.getElementById('modal-req-priority').value;
    if (!PRIORITIES.some(p => p.key === priorityVal)) return Toast.error('Validation Error', 'Invalid priority.');

    const linkedType = document.getElementById('modal-req-linked-type').value;
    if (!['none', 'deal', 'lead'].includes(linkedType)) return Toast.error('Validation Error', 'Invalid linked type.');
    const linkedId = document.getElementById('modal-req-linked-id').value;
    if (linkedType !== 'none' && !linkedId) return Toast.error('Validation Error', 'Valid linked record is required.');

    let dealTeamId = null;

    // Validate linked records internally
    if (linkedType === 'deal') {
      const d = Store.getDealById(linkedId);
      if (!d) return Toast.error('Error', 'Linked Deal does not exist.');
      if (!Auth.canViewRecord(d)) return Toast.error('Error', 'Permission denied for linked Deal.');
      dealTeamId = d.teamId;
    } else if (linkedType === 'lead') {
      const ld = Store.getLeadById(linkedId);
      if (!ld) return Toast.error('Error', 'Linked Lead does not exist.');
      if (!Auth.canViewRecord(ld)) return Toast.error('Error', 'Permission denied for linked Lead.');
      const assignee = Store.getUserById(ld.assignedTo);
      if (assignee) dealTeamId = assignee.teamId;
    }

    const contactId = document.getElementById('modal-req-contact-id').value || null;
    if (contactId) {
      const c = Store.getContactById(contactId);
      if (!c) return Toast.error('Error', 'Linked Contact does not exist.');
    }

    // Assignment validation
    let assignedTo = document.getElementById('modal-req-owner').value;
    if (user.role === 'employee') {
      assignedTo = user.id;
    } else if (user.role === 'team_lead') {
      const target = Store.getUserById(assignedTo);
      if (!target || (target.teamId !== user.teamId && target.id !== user.id)) {
        return Toast.error('Error', 'Cannot assign outside your team.');
      }
    }

    const assignedUser = Store.getUserById(assignedTo);
    if (!assignedUser) return Toast.error('Validation Error', 'Assigned user does not exist.');

    // Derive teamId
    let finalTeamId = assignedUser.teamId || null;
    if (!finalTeamId && dealTeamId) finalTeamId = dealTeamId;
    if (!finalTeamId) finalTeamId = user.teamId || null;

    const deliveryMode = document.getElementById('modal-req-delivery').value;
    if (!['not_decided', 'online', 'onsite', 'hybrid'].includes(deliveryMode)) {
      return Toast.error('Validation Error', 'Invalid delivery mode.');
    }

    const payload = {
      title,
      requirementType: type,
      status: statusVal,
      priority: priorityVal,
      dealId: linkedType === 'deal' ? linkedId : null,
      leadId: linkedType === 'lead' ? linkedId : null,
      contactId,
      companyName: document.getElementById('modal-req-company').value.trim(),
      productInterest: document.getElementById('modal-req-product').value.trim(),
      audienceSize: document.getElementById('modal-req-audience').value.trim(),
      deliveryMode,
      timeline: document.getElementById('modal-req-timeline').value.trim(),
      budgetRange: document.getElementById('modal-req-budget').value.trim(),
      decisionMaker: document.getElementById('modal-req-decision').value.trim(),
      summary,
      painPoints: document.getElementById('modal-req-pain').value.trim(),
      successCriteria: document.getElementById('modal-req-success').value.trim(),
      assignedTo,
      teamId: finalTeamId,
      updatedAt: new Date().toISOString()
    };

    if (reqId) {
      const ex = Store.getRequirementById(reqId);
      if (!ex || !Store.canUserEditRequirement(ex, user)) return Toast.error('Error', 'Permission denied.');
      Store.updateRequirement(reqId, payload);
      Toast.success('Saved', 'Requirement updated.');
    } else {
      payload.id = 'req_' + Date.now().toString(36);
      payload.createdBy = user.id;
      payload.createdAt = new Date().toISOString();
      Store.createRequirement(payload);
      Toast.success('Created', 'Requirement added.');
    }
    closeFn();
    reRender();
  });
}

// ── Main Render ───────────────────────────────────────────────

export function renderRequirements() {
  const user = Auth.getCurrentUser();
  if (!user) return '';

  const reqs = getFilteredData();

  return `
    <div class="content-inner">
      <div class="page-header">
        <div>
          <h1 class="page-header-title">Requirements</h1>
          <p class="page-header-subtitle">Capture and validate detailed client requirements.</p>
        </div>
        <button class="btn btn-primary" id="btn-new-req">New Requirement</button>
      </div>

      ${buildKPIs(reqs)}
      ${buildFilters(user)}
      ${buildTable(reqs, user)}
    </div>
  `;
}

function reRender() {
  const contentEl = document.getElementById('content-area');
  if (contentEl) contentEl.innerHTML = renderRequirements();
}

export function bindRequirementsEvents() {
  const content = document.getElementById('content-area');
  if (!content) return;

  content.addEventListener('click', e => {
    if (e.target.id === 'btn-new-req') {
      renderRequirementModal();
      return;
    }
    if (e.target.id === 'btn-req-clear') {
      filters = { search: '', type: 'all', status: 'all', priority: 'all', owner: 'all' };
      reRender();
      return;
    }

    const action = e.target.dataset.action;
    const reqId = e.target.dataset.id;
    const user = Auth.getCurrentUser();

    if (action === 'edit-req') {
      renderRequirementModal(reqId);
    } else if (action === 'delete-req') {
      if (!user || user.role !== 'manager') return Toast.error('Denied', 'Only managers can delete requirements.');
      const r = Store.getRequirementById(reqId);
      if (!r) return Toast.error('Error', 'Not found.');
      if (confirm('Delete this requirement?')) {
        const success = Store.deleteRequirement(reqId);
        if (success !== false) {
          Toast.success('Deleted', 'Requirement removed.');
        } else Toast.error('Error', 'Failed to delete.');
        reRender();
      }
    }
  });

  content.addEventListener('change', e => {
    if (['req-type', 'req-status', 'req-priority', 'req-owner'].includes(e.target.id)) {
      filters.type = document.getElementById('req-type').value;
      filters.status = document.getElementById('req-status').value;
      filters.priority = document.getElementById('req-priority').value;
      filters.owner = document.getElementById('req-owner').value;
      reRender();
    }
  });

  content.addEventListener('keyup', e => {
    if (e.target.id === 'req-search') {
      filters.search = e.target.value;
      reRender();
    }
  });
}
