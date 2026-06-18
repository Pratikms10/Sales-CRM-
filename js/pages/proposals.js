// ============================================================
// TechnoEdge CRM — Proposals Page
// ============================================================

import { Store } from '../store.js';
import { Auth } from '../auth.js';
import { Toast } from '../components/toast.js';
import { formatCurrency, formatDateTime } from '../utils.js';

let filters = {
  search: '',
  status: 'all',
  approval: 'all',
  owner: 'all'
};

const STATUSES = [
  { key: 'draft', label: 'Draft' },
  { key: 'sent', label: 'Sent' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'revised', label: 'Revised' }
];

const APPROVALS = [
  { key: 'not_required', label: 'Not Required' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' }
];

let currentLineItems = [];

// ── Helpers ───────────────────────────────────────────────────

function getFilteredData() {
  const user = Auth.getCurrentUser();
  if (!user) return [];

  let props = Store.getProposalsForUser(user);

  if (filters.search) {
    const term = filters.search.toLowerCase();
    props = props.filter(p => {
      const t = (p.title || '').toLowerCase();
      const u = Store.getUserById(p.assignedTo || p.createdBy);
      const uName = u ? u.name.toLowerCase() : '';
      let l = '';
      if (p.dealId) { const d = Store.getDealById(p.dealId); if (d) l = d.title.toLowerCase(); }
      if (p.requirementId) { const r = Store.getRequirementById(p.requirementId); if (r) l += ' ' + r.title.toLowerCase(); }
      return t.includes(term) || uName.includes(term) || l.includes(term);
    });
  }

  if (filters.status !== 'all') props = props.filter(p => p.status === filters.status);
  if (filters.approval !== 'all') props = props.filter(p => p.approvalStatus === filters.approval);
  if (filters.owner !== 'all') props = props.filter(p => p.assignedTo === filters.owner);

  return props.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

function getLabel(key, array) {
  const obj = array.find(o => o.key === key);
  return obj ? obj.label : key;
}

function getLinkedLabel(p) {
  if (p.requirementId) {
    const r = Store.getRequirementById(p.requirementId);
    return r ? `Req: ${r.title}` : 'Req (Deleted)';
  }
  if (p.dealId) {
    const d = Store.getDealById(p.dealId);
    return d ? `<a href="#/deals/${d.id}" class="btn-link">Deal: ${d.title}</a>` : 'Deal (Deleted)';
  }
  return '—';
}

function calculateTotals(items) {
  let sub = 0, disc = 0, tax = 0;
  items.forEach(it => {
    const qty = parseFloat(it.quantity) || 0;
    const up = parseFloat(it.unitPrice) || 0;
    const dp = parseFloat(it.discountPercent) || 0;
    const tp = parseFloat(it.taxPercent) || 0;
    
    const rowSub = qty * up;
    const rowDisc = rowSub * (dp / 100);
    const rowAfterDisc = rowSub - rowDisc;
    const rowTax = rowAfterDisc * (tp / 100);
    
    sub += rowSub;
    disc += rowDisc;
    tax += rowTax;
  });
  return { subtotal: sub, discountTotal: disc, taxTotal: tax, grandTotal: sub - disc + tax };
}

// ── Components ────────────────────────────────────────────────

function buildKPIs(props) {
  const total = props.length;
  const sent = props.filter(p => p.status === 'sent').length;
  const pending = props.filter(p => p.approvalStatus === 'pending').length;
  const acceptedValue = props.filter(p => p.status === 'accepted').reduce((sum, p) => sum + (p.grandTotal || 0), 0);

  return `
    <div class="activity-kpi-grid">
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-card-label">Total Proposals</div>
          <div class="stat-card-value">${total}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-card-label" style="color: var(--color-primary);">Sent</div>
          <div class="stat-card-value">${sent}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-card-label" style="color: var(--color-warning);">Pending Approval</div>
          <div class="stat-card-value">${pending}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-card-label" style="color: var(--color-success);">Accepted Value</div>
          <div class="stat-card-value">${formatCurrency(acceptedValue)}</div>
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

  return `
    <div class="filter-bar">
      <div style="flex: 1;">
        <input type="text" id="prop-search" class="login-input" placeholder="Search proposals..." value="${filters.search}">
      </div>
      <div>
        <select id="prop-status" class="login-input" style="padding-right:32px;">
          <option value="all">All Statuses</option>
          ${STATUSES.map(s => `<option value="${s.key}" ${filters.status === s.key ? 'selected' : ''}>${s.label}</option>`).join('')}
        </select>
      </div>
      <div>
        <select id="prop-approval" class="login-input" style="padding-right:32px;">
          <option value="all">Any Approval</option>
          ${APPROVALS.map(a => `<option value="${a.key}" ${filters.approval === a.key ? 'selected' : ''}>${a.label}</option>`).join('')}
        </select>
      </div>
      <div>
        <select id="prop-owner" class="login-input" style="padding-right:32px;">
          ${ownerOptions}
        </select>
      </div>
      <button class="btn btn-secondary" id="btn-prop-clear">Clear</button>
    </div>
  `;
}

function buildTable(props, user) {
  const rows = props.map(p => {
    const owner = Store.getUserById(p.assignedTo || p.createdBy);
    const ownerName = owner ? owner.name : 'Unknown';

    const canEdit = Store.canUserEditProposal(p, user);
    const canDelete = user.role === 'manager';

    let actions = '';
    if (canEdit) actions += `<button class="btn btn-sm btn-secondary" data-action="edit-prop" data-id="${p.id}" style="margin-right:4px;">Edit</button>`;
    if (canDelete) actions += `<button class="btn btn-sm" style="background:var(--color-error); color:white;" data-action="delete-prop" data-id="${p.id}">Delete</button>`;

    let approvalBadge = 'badge-neutral';
    if (p.approvalStatus === 'pending') approvalBadge = 'badge-warning';
    else if (p.approvalStatus === 'approved') approvalBadge = 'badge-success';
    else if (p.approvalStatus === 'rejected') approvalBadge = 'badge-error';

    return `
      <tr>
        <td style="font-weight:600;">${p.title}</td>
        <td>${getLinkedLabel(p)}</td>
        <td>v${p.version || '1.0'}</td>
        <td style="font-weight:bold;">${formatCurrency(p.grandTotal || 0)}</td>
        <td><span class="badge badge-neutral">${getLabel(p.status, STATUSES)}</span></td>
        <td><span class="badge ${approvalBadge}">${getLabel(p.approvalStatus, APPROVALS)}</span></td>
        <td>${ownerName}</td>
        <td>${p.validUntil ? new Date(p.validUntil).toLocaleDateString() : '—'}</td>
        <td style="text-align:right;">${actions}</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="card" style="overflow-x:auto;">
      <table class="data-table">
        <thead>
          <tr>
            <th>Proposal</th>
            <th>Linked To</th>
            <th>Version</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Approval</th>
            <th>Owner</th>
            <th>Valid Until</th>
            <th style="text-align:right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${rows || '<tr><td colspan="9" style="text-align:center;">No proposals found</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
}

// ── Modal ─────────────────────────────────────────────────────

function renderLineItems() {
  const tbody = document.getElementById('line-items-body');
  if (!tbody) return;

  tbody.innerHTML = currentLineItems.map((it, i) => `
    <tr>
      <td><input type="text" class="login-input li-desc" data-idx="${i}" value="${it.description}" placeholder="Item description"></td>
      <td style="width:80px;"><input type="number" class="login-input li-qty" data-idx="${i}" value="${it.quantity}" min="1"></td>
      <td style="width:120px;"><input type="number" class="login-input li-price" data-idx="${i}" value="${it.unitPrice}" min="0" step="0.01"></td>
      <td style="width:90px;"><input type="number" class="login-input li-disc" data-idx="${i}" value="${it.discountPercent}" min="0" max="100"></td>
      <td style="width:90px;"><input type="number" class="login-input li-tax" data-idx="${i}" value="${it.taxPercent}" min="0" max="100"></td>
      <td style="width:40px; text-align:right;"><button class="btn btn-sm btn-remove-li" data-idx="${i}" style="color:var(--color-error); padding:4px;">&times;</button></td>
    </tr>
  `).join('');

  updateTotalsDisplay();
}

function updateTotalsDisplay() {
  const totals = calculateTotals(currentLineItems);
  const elSub = document.getElementById('modal-prop-subtotal');
  const elDisc = document.getElementById('modal-prop-discount');
  const elTax = document.getElementById('modal-prop-tax');
  const elGrand = document.getElementById('modal-prop-grand');
  
  if (elSub) elSub.textContent = formatCurrency(totals.subtotal);
  if (elDisc) elDisc.textContent = '-' + formatCurrency(totals.discountTotal);
  if (elTax) elTax.textContent = '+' + formatCurrency(totals.taxTotal);
  if (elGrand) elGrand.textContent = formatCurrency(totals.grandTotal);
}

export function renderProposalModal(propId = null, defaults = {}) {
  const user = Auth.getCurrentUser();
  if (!user) return;

  let defaultValid = new Date();
  defaultValid.setDate(defaultValid.getDate() + 30);
  const dValidStr = defaultValid.toISOString().split('T')[0];

  let p = {
    title: defaults.title || '',
    requirementId: defaults.requirementId || '',
    dealId: defaults.dealId || '',
    contactId: defaults.contactId || '',
    version: defaults.version || '1.0',
    status: defaults.status || 'draft',
    approvalStatus: defaults.approvalStatus || 'not_required',
    validUntil: defaults.validUntil || dValidStr,
    notes: defaults.notes || '',
    assignedTo: defaults.assignedTo || user.id,
    lineItems: defaults.lineItems || []
  };

  if (propId) {
    const existing = Store.getProposalById(propId);
    if (!existing || !Store.canUserEditProposal(existing, user)) {
      return Toast.error('Error', 'Permission denied or not found.');
    }
    p = { ...p, ...existing };
  }

  currentLineItems = JSON.parse(JSON.stringify(p.lineItems));
  if (currentLineItems.length === 0) {
    currentLineItems.push({ id: 'li_' + Date.now(), description: '', quantity: 1, unitPrice: 0, discountPercent: 0, taxPercent: 0 });
  }

  let ownerOptions = '';
  if (user.role === 'manager') {
    ownerOptions = Store.getUsers().map(u => `<option value="${u.id}" ${u.id === p.assignedTo ? 'selected' : ''}>${u.name}</option>`).join('');
  } else if (user.role === 'team_lead') {
    const teamUsers = Store.getUsersByTeam(user.teamId).filter(u => u.id !== user.id);
    teamUsers.push(user);
    ownerOptions = teamUsers.map(u => `<option value="${u.id}" ${u.id === p.assignedTo ? 'selected' : ''}>${u.name}</option>`).join('');
  } else {
    ownerOptions = `<option value="${user.id}" selected>${user.name}</option>`;
  }

  const isManager = user.role === 'manager';

  const modalHtml = `
    <div class="modal" id="prop-modal">
      <div class="modal-content" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
        <div class="modal-header">
          <h2 class="modal-title">${propId ? 'Edit Proposal' : 'New Proposal'}</h2>
          <button class="modal-close" id="btn-close-prop-modal">&times;</button>
        </div>
        <div class="modal-body">
          
          <div style="display:flex; gap:1rem; margin-bottom:1rem;">
            <div style="flex:2;">
              <label class="login-label">Proposal Title <span style="color:red;">*</span></label>
              <input type="text" id="modal-prop-title" class="login-input" value="${p.title}">
            </div>
            <div style="flex:1;">
              <label class="login-label">Version</label>
              <input type="text" id="modal-prop-version" class="login-input" value="${p.version}">
            </div>
          </div>

          <div style="display:flex; gap:1rem; margin-bottom:1rem;">
            <div style="flex:1;">
              <label class="login-label">Requirement (Optional)</label>
              <select id="modal-prop-req" class="login-input">
                <option value="">-- None --</option>
                ${Store.getRequirementsForUser(user).map(r => `<option value="${r.id}" ${r.id === p.requirementId ? 'selected' : ''}>${r.title}</option>`).join('')}
              </select>
            </div>
            <div style="flex:1;">
              <label class="login-label">Deal (Optional)</label>
              <select id="modal-prop-deal" class="login-input">
                <option value="">-- None --</option>
                ${Store.getDealsForUser(user).map(d => `<option value="${d.id}" ${d.id === p.dealId ? 'selected' : ''}>${d.title}</option>`).join('')}
              </select>
            </div>
            <div style="flex:1;">
              <label class="login-label">Contact (Optional)</label>
              <select id="modal-prop-contact" class="login-input">
                <option value="">-- None --</option>
                ${Store.getContacts().map(c => `<option value="${c.id}" ${c.id === p.contactId ? 'selected' : ''}>${c.name} (${c.company})</option>`).join('')}
              </select>
            </div>
          </div>

          <div style="display:flex; gap:1rem; margin-bottom:1rem;">
            <div style="flex:1;">
              <label class="login-label">Status</label>
              <select id="modal-prop-status" class="login-input">
                ${STATUSES.map(s => `<option value="${s.key}" ${p.status === s.key ? 'selected' : ''}>${s.label}</option>`).join('')}
              </select>
            </div>
            <div style="flex:1;">
              <label class="login-label">Approval Status</label>
              <select id="modal-prop-approval" class="login-input" ${!isManager ? 'disabled' : ''}>
                ${APPROVALS.map(a => `<option value="${a.key}" ${p.approvalStatus === a.key ? 'selected' : ''}>${a.label}</option>`).join('')}
              </select>
              ${!isManager ? `<div style="font-size:0.75rem; color:var(--color-muted);">Only managers can approve/reject.</div>` : ''}
            </div>
            <div style="flex:1;">
              <label class="login-label">Valid Until</label>
              <input type="date" id="modal-prop-valid" class="login-input" value="${p.validUntil ? p.validUntil.split('T')[0] : ''}">
            </div>
            <div style="flex:1;">
              <label class="login-label">Assigned To</label>
              <select id="modal-prop-owner" class="login-input" ${user.role === 'employee' ? 'disabled' : ''}>
                ${ownerOptions}
              </select>
            </div>
          </div>

          <div style="margin-bottom:1rem; padding-top:1rem; border-top:1px solid var(--color-hairline-soft);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <h3 style="font-size:1rem; margin:0;">Line Items</h3>
              <button class="btn btn-sm btn-secondary" id="btn-add-li">Add Item</button>
            </div>
            <table class="data-table" style="margin-bottom:0;">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Disc %</th>
                  <th>Tax %</th>
                  <th></th>
                </tr>
              </thead>
              <tbody id="line-items-body">
              </tbody>
            </table>
          </div>

          <div class="totals-panel" style="background:var(--color-surface-soft); padding:1rem; border-radius:4px; margin-bottom:1rem; text-align:right; border:1px solid var(--color-hairline-soft);">
            <div style="display:flex; justify-content:flex-end; gap:2rem;">
              <div>Subtotal: <strong id="modal-prop-subtotal">$0.00</strong></div>
              <div style="color:var(--color-error);">Discount: <strong id="modal-prop-discount">-$0.00</strong></div>
              <div style="color:var(--color-muted);">Tax: <strong id="modal-prop-tax">+$0.00</strong></div>
              <div style="font-size:1.1rem;">Grand Total: <strong id="modal-prop-grand" style="color:var(--color-primary);">$0.00</strong></div>
            </div>
          </div>

          <div style="margin-bottom:1rem;">
            <label class="login-label">Notes / Terms</label>
            <textarea id="modal-prop-notes" class="login-input" style="height:60px;">${p.notes}</textarea>
          </div>

        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="btn-cancel-prop-modal">Cancel</button>
          <button class="btn btn-primary" id="btn-save-prop" data-id="${propId || ''}">Save Proposal</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  renderLineItems();

  const m = document.getElementById('prop-modal');
  
  m.addEventListener('input', e => {
    if (e.target.classList.contains('li-desc') || e.target.classList.contains('li-qty') || 
        e.target.classList.contains('li-price') || e.target.classList.contains('li-disc') || 
        e.target.classList.contains('li-tax')) {
      const idx = e.target.dataset.idx;
      if (idx !== undefined) {
        if (e.target.classList.contains('li-desc')) currentLineItems[idx].description = e.target.value;
        if (e.target.classList.contains('li-qty')) currentLineItems[idx].quantity = parseFloat(e.target.value) || 0;
        if (e.target.classList.contains('li-price')) currentLineItems[idx].unitPrice = parseFloat(e.target.value) || 0;
        if (e.target.classList.contains('li-disc')) currentLineItems[idx].discountPercent = parseFloat(e.target.value) || 0;
        if (e.target.classList.contains('li-tax')) currentLineItems[idx].taxPercent = parseFloat(e.target.value) || 0;
        updateTotalsDisplay();
      }
    }
  });

  document.getElementById('btn-add-li').addEventListener('click', () => {
    currentLineItems.push({ id: 'li_' + Date.now(), description: '', quantity: 1, unitPrice: 0, discountPercent: 0, taxPercent: 0 });
    renderLineItems();
  });

  m.addEventListener('click', e => {
    if (e.target.classList.contains('btn-remove-li')) {
      const idx = e.target.dataset.idx;
      if (idx !== undefined) {
        currentLineItems.splice(idx, 1);
        renderLineItems();
      }
    }
  });

  const closeFn = () => { if (m) m.remove(); };
  document.getElementById('btn-close-prop-modal').addEventListener('click', closeFn);
  document.getElementById('btn-cancel-prop-modal').addEventListener('click', closeFn);

  document.getElementById('btn-save-prop').addEventListener('click', () => {
    const title = document.getElementById('modal-prop-title').value.trim();
    if (!title) return Toast.error('Validation Error', 'Title is required.');

    if (currentLineItems.length === 0) return Toast.error('Validation Error', 'At least one line item is required.');

    // Validate each line item field strictly
    for (let i = 0; i < currentLineItems.length; i++) {
      const it = currentLineItems[i];
      if (!it.description || !it.description.trim()) {
        return Toast.error('Validation Error', `Line item ${i + 1}: description is required.`);
      }
      const qty = parseFloat(it.quantity);
      if (isNaN(qty) || qty <= 0) {
        return Toast.error('Validation Error', `Line item ${i + 1}: quantity must be > 0.`);
      }
      const up = parseFloat(it.unitPrice);
      if (isNaN(up) || up < 0) {
        return Toast.error('Validation Error', `Line item ${i + 1}: unit price must be >= 0.`);
      }
      const dp = parseFloat(it.discountPercent);
      if (isNaN(dp) || dp < 0 || dp > 100) {
        return Toast.error('Validation Error', `Line item ${i + 1}: discount must be 0-100%.`);
      }
      const tp = parseFloat(it.taxPercent);
      if (isNaN(tp) || tp < 0 || tp > 100) {
        return Toast.error('Validation Error', `Line item ${i + 1}: tax must be 0-100%.`);
      }
    }

    // Recalculate totals from line items — never trust DOM display
    const totals = calculateTotals(currentLineItems);

    // Assignment validation
    let assignedTo = document.getElementById('modal-prop-owner').value;
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

    let finalTeamId = assignedUser.teamId || user.teamId || null;

    // Validate linked records
    let reqId = document.getElementById('modal-prop-req').value || null;
    let dealId = document.getElementById('modal-prop-deal').value || null;
    const contactId = document.getElementById('modal-prop-contact').value || null;
    let linkedTeamId = null;

    if (reqId) {
      const r = Store.getRequirementById(reqId);
      if (!r) return Toast.error('Error', 'Linked Requirement does not exist.');
      if (!Store.canUserViewRequirement(r, user)) return Toast.error('Error', 'Permission denied for linked Requirement.');
      if (r.dealId) dealId = r.dealId; // cascade deal link
      if (r.teamId) linkedTeamId = r.teamId;
    }

    if (dealId) {
      const d = Store.getDealById(dealId);
      if (!d) return Toast.error('Error', 'Linked Deal does not exist.');
      if (!Auth.canViewRecord(d)) return Toast.error('Error', 'Permission denied for linked Deal.');
      linkedTeamId = d.teamId;
    }

    // teamId derivation: assigned user -> linked deal/requirement -> current user
    if (!finalTeamId && linkedTeamId) finalTeamId = linkedTeamId;
    if (!finalTeamId) finalTeamId = user.teamId || null;

    if (contactId) {
      const c = Store.getContactById(contactId);
      if (!c) return Toast.error('Error', 'Linked Contact does not exist.');
    }

    let status = document.getElementById('modal-prop-status').value;
    if (!STATUSES.some(s => s.key === status)) return Toast.error('Validation Error', 'Invalid status.');

    // Approval logic — enforced before Store write
    let needsApproval = currentLineItems.some(it => (parseFloat(it.discountPercent) || 0) > 10);

    let approvalStatus;
    if (isManager) {
      approvalStatus = document.getElementById('modal-prop-approval').value;
      if (!APPROVALS.some(a => a.key === approvalStatus)) {
        return Toast.error('Validation Error', 'Invalid approval status.');
      }
    } else {
      // Non-manager: cannot set approved/rejected ever
      if (needsApproval) {
        approvalStatus = 'pending';
      } else {
        approvalStatus = 'not_required';
      }
    }

    // Guard: cannot accept a proposal unless approval is cleared
    if (status === 'accepted' && approvalStatus !== 'approved' && approvalStatus !== 'not_required') {
      return Toast.error('Validation Error', 'Cannot accept a proposal that is pending approval.');
    }

    const validUntilRaw = document.getElementById('modal-prop-valid').value;
    let normalizedValid = null;
    if (validUntilRaw) {
      const d = new Date(validUntilRaw);
      if (isNaN(d.getTime())) {
        return Toast.error('Validation Error', 'Invalid Valid Until date.');
      }
      normalizedValid = d.toISOString();
    }

    const payload = {
      title,
      requirementId: reqId,
      dealId,
      contactId,
      version: document.getElementById('modal-prop-version').value.trim(),
      status,
      approvalStatus,
      validUntil: normalizedValid,
      notes: document.getElementById('modal-prop-notes').value.trim(),
      assignedTo,
      teamId: finalTeamId,
      lineItems: currentLineItems,
      subtotal: totals.subtotal,
      discountTotal: totals.discountTotal,
      taxTotal: totals.taxTotal,
      grandTotal: totals.grandTotal,
      updatedAt: new Date().toISOString()
    };

    if (propId) {
      const ex = Store.getProposalById(propId);
      if (!ex || !Store.canUserEditProposal(ex, user)) return Toast.error('Error', 'Permission denied.');

      if (status === 'accepted' && ex.status !== 'accepted') payload.acceptedAt = new Date().toISOString();
      if (status === 'rejected' && ex.status !== 'rejected') payload.rejectedAt = new Date().toISOString();
      if (status === 'sent' && ex.status !== 'sent') payload.sentAt = new Date().toISOString();

      Store.updateProposal(propId, payload);
      Toast.success('Saved', 'Proposal updated.');
    } else {
      payload.id = 'prop_' + Date.now().toString(36);
      payload.createdBy = user.id;
      payload.createdAt = new Date().toISOString();

      if (status === 'accepted') payload.acceptedAt = new Date().toISOString();
      if (status === 'rejected') payload.rejectedAt = new Date().toISOString();
      if (status === 'sent') payload.sentAt = new Date().toISOString();

      Store.createProposal(payload);
      Toast.success('Created', 'Proposal added.');
    }

    if (needsApproval && approvalStatus === 'pending') {
      Toast.warning('Approval Required', 'Discount exceeds 10%. Proposal is pending approval.');
    }

    closeFn();
    reRender();
  });
}

// ── Main Render ───────────────────────────────────────────────

export function renderProposals() {
  const user = Auth.getCurrentUser();
  if (!user) return '';

  const props = getFilteredData();

  return `
    <div class="content-inner">
      <div class="page-header">
        <div>
          <h1 class="page-header-title">Proposals & Quotations</h1>
          <p class="page-header-subtitle">Manage commercial offers, line items, and approvals.</p>
        </div>
        <button class="btn btn-primary" id="btn-new-prop">New Proposal</button>
      </div>

      ${buildKPIs(props)}
      ${buildFilters(user)}
      ${buildTable(props, user)}
    </div>
  `;
}

function reRender() {
  const contentEl = document.getElementById('content-area');
  if (contentEl) contentEl.innerHTML = renderProposals();
}

export function bindProposalsEvents() {
  const content = document.getElementById('content-area');
  if (!content) return;

  content.addEventListener('click', e => {
    if (e.target.id === 'btn-new-prop') {
      renderProposalModal();
      return;
    }
    if (e.target.id === 'btn-prop-clear') {
      filters = { search: '', status: 'all', approval: 'all', owner: 'all' };
      reRender();
      return;
    }

    const action = e.target.dataset.action;
    const propId = e.target.dataset.id;
    const user = Auth.getCurrentUser();

    if (action === 'edit-prop') {
      renderProposalModal(propId);
    } else if (action === 'delete-prop') {
      if (!user || user.role !== 'manager') return Toast.error('Denied', 'Only managers can delete proposals.');
      const p = Store.getProposalById(propId);
      if (!p) return Toast.error('Error', 'Not found.');
      if (confirm('Delete this proposal?')) {
        const success = Store.deleteProposal(propId);
        if (success !== false) {
          Toast.success('Deleted', 'Proposal removed.');
        } else Toast.error('Error', 'Failed to delete.');
        reRender();
      }
    }
  });

  content.addEventListener('change', e => {
    if (['prop-status', 'prop-approval', 'prop-owner'].includes(e.target.id)) {
      filters.status = document.getElementById('prop-status').value;
      filters.approval = document.getElementById('prop-approval').value;
      filters.owner = document.getElementById('prop-owner').value;
      reRender();
    }
  });

  content.addEventListener('keyup', e => {
    if (e.target.id === 'prop-search') {
      filters.search = e.target.value;
      reRender();
    }
  });
}
