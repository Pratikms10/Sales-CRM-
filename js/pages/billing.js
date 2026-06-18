// ============================================================
// TechnoEdge CRM — Invoice, Payment & Renewal Tracker
// ============================================================

import { Store } from '../store.js';
import { Auth } from '../auth.js';
import { generateId, formatDate, formatCurrency } from '../utils.js';
import { Toast } from '../components/toast.js';

const PAYMENT_STATUSES = [
  { key: 'draft', label: 'Draft' },
  { key: 'invoiced', label: 'Invoiced' },
  { key: 'partially_paid', label: 'Partially Paid' },
  { key: 'paid', label: 'Paid' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'cancelled', label: 'Cancelled' }
];

const PAYMENT_MODES = [
  { key: 'not_recorded', label: 'Not Recorded' },
  { key: 'bank_transfer', label: 'Bank Transfer' },
  { key: 'upi', label: 'UPI' },
  { key: 'cheque', label: 'Cheque' },
  { key: 'cash', label: 'Cash' },
  { key: 'card', label: 'Card' }
];

const RENEWAL_STATUSES = [
  { key: 'none', label: 'None' },
  { key: 'renewal_due', label: 'Renewal Due' },
  { key: 'renewal_contacted', label: 'Renewal Contacted' },
  { key: 'renewal_interested', label: 'Renewal Interested' },
  { key: 'renewed', label: 'Renewed' },
  { key: 'not_renewing', label: 'Not Renewing' }
];

let currentBillingId = null;

export function renderBilling() {
  const user = Auth.getCurrentUser();
  if (!user) return '';

  const billings = Store.getBillingsForUser(user);

  const total = billings.length;
  const outstanding = billings.reduce((sum, b) => sum + (Number(b.balanceDue) || 0), 0);
  const revenue = billings.reduce((sum, b) => sum + (Number(b.amountPaid) || 0), 0);
  const overdueCount = billings.filter(b => b.paymentStatus === 'overdue').length;
  const renewalDueCount = billings.filter(b => b.renewalStatus === 'renewal_due').length;

  return `
    <div class="content-inner">
      <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
        <div>
          <h1 class="page-header-title">Billing & Renewals</h1>
          <div class="page-header-subtitle">Track invoices, payments, and upcoming renewals</div>
        </div>
        <button class="btn btn-primary" id="btn-new-billing">
          <span class="icon">➕</span> New Record
        </button>
      </div>

      <div class="dashboard-grid" style="grid-template-columns: repeat(5, 1fr); margin-bottom: 2rem;">
        <div class="stat-card">
          <div class="stat-card-label">Total Records</div>
          <div class="stat-card-value">${total}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">Outstanding</div>
          <div class="stat-card-value" style="color:var(--color-error);">${formatCurrency(outstanding, 'INR')}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">Paid Revenue</div>
          <div class="stat-card-value" style="color:var(--color-success);">${formatCurrency(revenue, 'INR')}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">Overdue</div>
          <div class="stat-card-value" style="color:var(--color-error);">${overdueCount}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">Renewal Due</div>
          <div class="stat-card-value" style="color:var(--color-primary);">${renewalDueCount}</div>
        </div>
      </div>

      <div class="filters-bar" style="display:flex; gap:1rem; margin-bottom:1rem; flex-wrap:wrap; background:var(--color-surface-card); padding:1rem; border-radius:8px; border:1px solid var(--color-hairline-soft);">
        <input type="text" class="login-input" id="billing-filter-search" placeholder="Search invoice or company..." style="flex:1; min-width:200px;">
        <select class="login-input" id="billing-filter-status" style="width:160px;">
          <option value="all">All Statuses</option>
          ${PAYMENT_STATUSES.map(s => `<option value="${s.key}">${s.label}</option>`).join('')}
        </select>
        <select class="login-input" id="billing-filter-renewal" style="width:160px;">
          <option value="all">All Renewals</option>
          ${RENEWAL_STATUSES.map(s => `<option value="${s.key}">${s.label}</option>`).join('')}
        </select>
        <select class="login-input" id="billing-filter-owner" style="width:160px;">
        </select>
      </div>

      <div class="table-container" style="background:var(--color-surface-card); border-radius:8px; border:1px solid var(--color-hairline-soft); overflow-x:auto;">
        <table class="data-table" style="width:100%; text-align:left; border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:1px solid var(--color-hairline-soft);">
              <th style="padding:1rem;">Invoice / Company</th>
              <th style="padding:1rem;">Linked Record</th>
              <th style="padding:1rem;">Timeline</th>
              <th style="padding:1rem;">Status</th>
              <th style="padding:1rem;">Financials</th>
              <th style="padding:1rem;">Renewal</th>
              <th style="padding:1rem;">Assigned To</th>
              <th style="padding:1rem; text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody id="billings-tbody">
            <!-- Rendered via loadTable() -->
          </tbody>
        </table>
      </div>
    </div>

    <!-- Billing Modal -->
    <div id="billing-modal" class="modal-overlay" style="display:none;">
      <div class="modal" style="max-width:850px; width:90%;">
        <div class="modal-header">
          <h2 id="modal-billing-heading">Create Billing Record</h2>
          <button class="modal-close" id="btn-close-billing-modal">&times;</button>
        </div>
        <div class="modal-body" style="max-height:70vh; overflow-y:auto;">

          <div style="margin-bottom:1.5rem; padding:1rem; background:var(--color-surface-soft); border-radius:8px; border:1px solid var(--color-hairline-soft);">
            <h4 style="margin:0 0 1rem 0;">Link Record</h4>
            <div class="form-grid" style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:1rem;">
              <div class="form-group">
                <label>Deal (Closed Won)</label>
                <select class="login-input" id="modal-billing-deal">
                  <option value="">-- Select Deal --</option>
                </select>
              </div>
              <div class="form-group">
                <label>Proposal (Accepted)</label>
                <select class="login-input" id="modal-billing-proposal">
                  <option value="">-- Select Proposal --</option>
                </select>
              </div>
              <div class="form-group">
                <label>Project Handoff (Active)</label>
                <select class="login-input" id="modal-billing-handoff">
                  <option value="">-- Select Handoff --</option>
                </select>
              </div>
            </div>
            <div style="display:flex; justify-content:flex-end; margin-top:0.5rem;">
              <button class="btn btn-sm btn-secondary" id="btn-autofill-billing">Auto-Fill from Selection</button>
            </div>
          </div>

          <div class="form-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div class="form-group" style="grid-column: 1 / -1;">
              <label>Record Title *</label>
              <input type="text" class="login-input" id="modal-billing-title" placeholder="e.g. AWS Training Phase 1 Invoice">
            </div>

            <div class="form-group">
              <label>Company Name *</label>
              <input type="text" class="login-input" id="modal-billing-company">
            </div>
            <div class="form-group">
              <label>Client Contact</label>
              <select class="login-input" id="modal-billing-contact">
                <option value="">-- Select Contact --</option>
              </select>
            </div>

            <div class="form-group">
              <label>Invoice Number</label>
              <input type="text" class="login-input" id="modal-billing-invoice-number">
            </div>
            <div class="form-group">
              <label>Currency</label>
              <select class="login-input" id="modal-billing-currency">
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <div class="form-group">
              <label>Invoice Date</label>
              <input type="date" class="login-input" id="modal-billing-invoice-date">
            </div>
            <div class="form-group">
              <label>Due Date</label>
              <input type="date" class="login-input" id="modal-billing-due-date">
            </div>

            <!-- Financials Section -->
            <div style="grid-column: 1 / -1; margin-top: 1rem;">
              <h4 style="margin:0 0 1rem 0; border-bottom:1px solid var(--color-hairline-soft); padding-bottom:0.5rem;">Financials</h4>
            </div>

            <div class="form-group">
              <label>Subtotal *</label>
              <input type="number" step="0.01" class="login-input" id="modal-billing-subtotal" value="0">
            </div>
            <div class="form-group">
              <label>Discount Total</label>
              <input type="number" step="0.01" class="login-input" id="modal-billing-discount" value="0">
            </div>
            <div class="form-group">
              <label>Tax Total</label>
              <input type="number" step="0.01" class="login-input" id="modal-billing-tax" value="0">
            </div>
            <div class="form-group">
              <label>Grand Total *</label>
              <input type="number" step="0.01" class="login-input" id="modal-billing-grand-total" value="0">
            </div>

            <!-- Payments Section -->
            <div style="grid-column: 1 / -1; margin-top: 1rem;">
              <h4 style="margin:0 0 1rem 0; border-bottom:1px solid var(--color-hairline-soft); padding-bottom:0.5rem;">Payment Tracking</h4>
            </div>

            <div class="form-group">
              <label>Amount Paid</label>
              <input type="number" step="0.01" class="login-input" id="modal-billing-amount-paid" value="0">
            </div>
            <div class="form-group">
              <label>Payment Mode</label>
              <select class="login-input" id="modal-billing-payment-mode">
                ${PAYMENT_MODES.map(m => `<option value="${m.key}">${m.label}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>Payment Status *</label>
              <select class="login-input" id="modal-billing-payment-status">
                ${PAYMENT_STATUSES.map(s => `<option value="${s.key}">${s.label}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>Calculated Balance Due</label>
              <input type="number" class="login-input" id="modal-billing-balance-due" disabled>
            </div>

            <!-- Renewals Section -->
            <div style="grid-column: 1 / -1; margin-top: 1rem;">
              <h4 style="margin:0 0 1rem 0; border-bottom:1px solid var(--color-hairline-soft); padding-bottom:0.5rem;">Renewal Tracking</h4>
            </div>

            <div class="form-group">
              <label>Renewal Status</label>
              <select class="login-input" id="modal-billing-renewal-status">
                ${RENEWAL_STATUSES.map(s => `<option value="${s.key}">${s.label}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>Renewal Date</label>
              <input type="date" class="login-input" id="modal-billing-renewal-date">
            </div>
            <div class="form-group">
              <label>Expected Renewal Value</label>
              <input type="number" step="0.01" class="login-input" id="modal-billing-renewal-value">
            </div>

            <div class="form-group" style="grid-column: 1 / -1; margin-top: 1rem;">
              <label>Assigned To *</label>
              <select class="login-input" id="modal-billing-assigned"></select>
            </div>

            <div class="form-group" style="grid-column: 1 / -1;">
              <label>Internal Notes</label>
              <textarea class="login-input" id="modal-billing-notes" rows="2" placeholder="Private team notes..."></textarea>
            </div>

          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="btn-cancel-billing">Cancel</button>
          <button class="btn btn-primary" id="btn-save-billing">Save Record</button>
        </div>
      </div>
    </div>
  `;
}

function loadTable() {
  const tbody = document.getElementById('billings-tbody');
  const searchInput = document.getElementById('billing-filter-search');
  const statusFilter = document.getElementById('billing-filter-status');
  const renewalFilter = document.getElementById('billing-filter-renewal');
  const ownerFilter = document.getElementById('billing-filter-owner');

  if (!tbody || !searchInput || !statusFilter || !renewalFilter || !ownerFilter) return;

  const user = Auth.getCurrentUser();
  if (!user) return;

  if (ownerFilter.options.length === 0) {
    let ownerOptions = '<option value="all">All Owners</option>';
    if (user.role === 'employee') {
      ownerOptions += `<option value="${user.id}">${user.name} (You)</option>`;
    } else if (user.role === 'team_lead') {
      const teamUsers = Store.getUsersByTeam(user.teamId);
      teamUsers.push(user);
      const uniqueUsers = Array.from(new Map(teamUsers.map(u => [u.id, u])).values());
      ownerOptions += uniqueUsers.map(u => `<option value="${u.id}">${u.name}</option>`).join('');
    } else {
      const allUsers = Store.getUsers().filter(u => u.isActive);
      ownerOptions += allUsers.map(u => `<option value="${u.id}">${u.name}</option>`).join('');
    }
    ownerFilter.innerHTML = ownerOptions;
  }

  const billings = Store.getBillingsForUser(user);
  const search = searchInput.value.toLowerCase();
  const statusVal = statusFilter.value;
  const renewalVal = renewalFilter.value;
  const ownerVal = ownerFilter.value;

  const filtered = billings.filter(b => {
    const matchSearch = String(b.title || '').toLowerCase().includes(search) ||
                        String(b.companyName || '').toLowerCase().includes(search) ||
                        String(b.invoiceNumber || '').toLowerCase().includes(search);
    const matchStatus = statusVal === 'all' || b.paymentStatus === statusVal;
    const matchRenewal = renewalVal === 'all' || b.renewalStatus === renewalVal;
    const matchOwner = ownerVal === 'all' || b.assignedTo === ownerVal;
    return matchSearch && matchStatus && matchRenewal && matchOwner;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:2rem; color:var(--color-muted);">No billing records found.</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(b => {
    const deal = b.dealId ? Store.getDealById(b.dealId) : null;
    const prop = b.proposalId ? Store.getProposalById(b.proposalId) : null;
    const handoff = b.handoffId ? Store.getHandoffById(b.handoffId) : null;
    const owner = Store.getUserById(b.assignedTo);

    const pLabel = PAYMENT_STATUSES.find(s => s.key === b.paymentStatus)?.label || b.paymentStatus;
    const rLabel = RENEWAL_STATUSES.find(s => s.key === b.renewalStatus)?.label || b.renewalStatus;

    let statusBadgeClass = 'badge-neutral';
    if (b.paymentStatus === 'paid') statusBadgeClass = 'badge-success';
    else if (b.paymentStatus === 'overdue' || b.paymentStatus === 'cancelled') statusBadgeClass = 'badge-error';
    else if (b.paymentStatus === 'partially_paid') statusBadgeClass = 'badge-primary';

    const actions = [];
    if (Store.canUserEditBilling(b, user)) {
      actions.push(`<button class="btn btn-sm btn-secondary edit-billing" data-id="${b.id}">Edit</button>`);
    }
    if (user.role === 'manager') {
      actions.push(`<button class="btn btn-sm btn-secondary delete-billing" style="color:var(--color-error); border-color:var(--color-error);" data-id="${b.id}">Delete</button>`);
    }

    return `
      <tr style="border-bottom:1px solid var(--color-hairline-soft);">
        <td style="padding:1rem;">
          <div style="font-weight:600;">${b.title}</div>
          <div style="font-size:0.8rem; color:var(--color-muted);">${b.companyName}</div>
          ${b.invoiceNumber ? `<div style="font-size:0.8rem;">Inv: ${b.invoiceNumber}</div>` : ''}
        </td>
        <td style="padding:1rem;">
          ${deal ? `<div style="font-size:0.85rem;">Deal: <a href="#/deals/${deal.id}">${deal.title}</a></div>` : ''}
          ${prop ? `<div style="font-size:0.8rem; color:var(--color-muted);">Prop: ${prop.title}</div>` : ''}
          ${handoff ? `<div style="font-size:0.8rem; color:var(--color-muted);">Handoff: ${handoff.title}</div>` : ''}
        </td>
        <td style="padding:1rem; font-size:0.85rem; color:var(--color-muted);">
          <div>Inv: ${b.invoiceDate ? formatDate(b.invoiceDate) : '-'}</div>
          <div>Due: ${b.dueDate ? formatDate(b.dueDate) : '-'}</div>
        </td>
        <td style="padding:1rem;">
          <span class="badge ${statusBadgeClass}">${pLabel}</span>
        </td>
        <td style="padding:1rem; font-size:0.85rem;">
          <div>Total: ${formatCurrency(b.grandTotal, b.currency)}</div>
          <div style="color:var(--color-success);">Paid: ${formatCurrency(b.amountPaid, b.currency)}</div>
          <div style="color:var(--color-error);">Due: ${formatCurrency(b.balanceDue, b.currency)}</div>
        </td>
        <td style="padding:1rem; font-size:0.85rem;">
          <div><span class="badge badge-neutral">${rLabel}</span></div>
          ${b.renewalDate ? `<div style="color:var(--color-muted); margin-top:4px;">Date: ${formatDate(b.renewalDate)}</div>` : ''}
        </td>
        <td style="padding:1rem;">${owner ? owner.name : 'Unassigned'}</td>
        <td style="padding:1rem; text-align:right;">
          <div style="display:flex; gap:0.5rem; justify-content:flex-end;">
            ${actions.join('')}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function updateBalanceUI() {
  const grandTotal = Number(document.getElementById('modal-billing-grand-total').value) || 0;
  const amountPaid = Number(document.getElementById('modal-billing-amount-paid').value) || 0;
  const balanceInput = document.getElementById('modal-billing-balance-due');
  balanceInput.value = Math.max(0, grandTotal - amountPaid).toFixed(2);
}

function openModal(id = null, defaultData = null) {
  const modal = document.getElementById('billing-modal');
  if (!modal) return;
  const user = Auth.getCurrentUser();
  if (!user) return;
  currentBillingId = id;

  document.getElementById('modal-billing-heading').innerText = id ? 'Edit Billing Record' : 'Create Billing Record';

  const deals = Store.getDealsForUser(user).filter(d => d.status === 'closed_won');
  const props = Store.getProposalsForUser(user).filter(p => p.status === 'accepted');
  const handoffs = Store.getHandoffsForUser(user).filter(h => h.deliveryStatus === 'handed_over' || h.deliveryStatus === 'in_delivery' || h.deliveryStatus === 'completed');
  const contacts = Store.getContacts();

  document.getElementById('modal-billing-deal').innerHTML = '<option value="">-- Select Deal --</option>' + deals.map(d => `<option value="${d.id}">${d.title}</option>`).join('');
  document.getElementById('modal-billing-proposal').innerHTML = '<option value="">-- Select Proposal --</option>' + props.map(p => `<option value="${p.id}">${p.title}</option>`).join('');
  document.getElementById('modal-billing-handoff').innerHTML = '<option value="">-- Select Handoff --</option>' + handoffs.map(h => `<option value="${h.id}">${h.title}</option>`).join('');
  document.getElementById('modal-billing-contact').innerHTML = '<option value="">-- Select Contact --</option>' + contacts.map(c => `<option value="${c.id}">${c.name} (${c.company})</option>`).join('');

  const assignedSelect = document.getElementById('modal-billing-assigned');
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

  if (id) {
    const b = Store.getBillingById(id);
    if (!b || !Store.canUserEditBilling(b, user)) {
      Toast.error('Error', 'Cannot edit this billing record.');
      return;
    }
    document.getElementById('modal-billing-title').value = b.title || '';
    document.getElementById('modal-billing-deal').value = b.dealId || '';
    document.getElementById('modal-billing-proposal').value = b.proposalId || '';
    document.getElementById('modal-billing-handoff').value = b.handoffId || '';
    document.getElementById('modal-billing-company').value = b.companyName || '';
    document.getElementById('modal-billing-contact').value = b.clientContactId || '';
    document.getElementById('modal-billing-invoice-number').value = b.invoiceNumber || '';
    document.getElementById('modal-billing-currency').value = b.currency || 'INR';
    document.getElementById('modal-billing-invoice-date').value = b.invoiceDate ? b.invoiceDate.split('T')[0] : '';
    document.getElementById('modal-billing-due-date').value = b.dueDate ? b.dueDate.split('T')[0] : '';
    document.getElementById('modal-billing-subtotal').value = b.subtotal || 0;
    document.getElementById('modal-billing-discount').value = b.discountTotal || 0;
    document.getElementById('modal-billing-tax').value = b.taxTotal || 0;
    document.getElementById('modal-billing-grand-total').value = b.grandTotal || 0;
    document.getElementById('modal-billing-amount-paid').value = b.amountPaid || 0;
    document.getElementById('modal-billing-payment-mode').value = b.paymentMode || 'not_recorded';
    document.getElementById('modal-billing-payment-status').value = b.paymentStatus || 'draft';
    document.getElementById('modal-billing-renewal-status').value = b.renewalStatus || 'none';
    document.getElementById('modal-billing-renewal-date').value = b.renewalDate ? b.renewalDate.split('T')[0] : '';
    document.getElementById('modal-billing-renewal-value').value = b.renewalValue || '';
    document.getElementById('modal-billing-assigned').value = b.assignedTo || user.id;
    document.getElementById('modal-billing-notes').value = b.notes || '';

    updateBalanceUI();
  } else {
    document.getElementById('modal-billing-title').value = '';
    document.getElementById('modal-billing-deal').value = defaultData?.dealId || '';
    document.getElementById('modal-billing-proposal').value = defaultData?.proposalId || '';
    document.getElementById('modal-billing-handoff').value = defaultData?.handoffId || '';
    document.getElementById('modal-billing-company').value = defaultData?.companyName || '';
    document.getElementById('modal-billing-contact').value = defaultData?.contactId || '';
    document.getElementById('modal-billing-invoice-number').value = '';
    document.getElementById('modal-billing-currency').value = 'INR';
    document.getElementById('modal-billing-invoice-date').value = '';
    document.getElementById('modal-billing-due-date').value = '';
    document.getElementById('modal-billing-subtotal').value = 0;
    document.getElementById('modal-billing-discount').value = 0;
    document.getElementById('modal-billing-tax').value = 0;
    document.getElementById('modal-billing-grand-total').value = 0;
    document.getElementById('modal-billing-amount-paid').value = 0;
    document.getElementById('modal-billing-payment-mode').value = 'not_recorded';
    document.getElementById('modal-billing-payment-status').value = 'draft';
    document.getElementById('modal-billing-renewal-status').value = 'none';
    document.getElementById('modal-billing-renewal-date').value = '';
    document.getElementById('modal-billing-renewal-value').value = '';
    document.getElementById('modal-billing-assigned').value = user.id;
    document.getElementById('modal-billing-notes').value = '';

    updateBalanceUI();

    if (defaultData?.dealId || defaultData?.proposalId || defaultData?.handoffId) {
       document.getElementById('btn-autofill-billing').click();
    }
  }

  modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('billing-modal');
  if (modal) modal.style.display = 'none';
  currentBillingId = null;
}

function handleSaveBilling() {
  const user = Auth.getCurrentUser();
  if (!user) return;

  const title = document.getElementById('modal-billing-title').value.trim();
  const companyName = document.getElementById('modal-billing-company').value.trim();
  const invoiceNumber = document.getElementById('modal-billing-invoice-number').value.trim();
  const currency = document.getElementById('modal-billing-currency').value;
  let paymentStatus = document.getElementById('modal-billing-payment-status').value;
  const paymentMode = document.getElementById('modal-billing-payment-mode').value;
  const renewalStatus = document.getElementById('modal-billing-renewal-status').value;

  if (!title || !companyName) {
    return Toast.error('Validation Error', 'Title and Company Name are required.');
  }

  if (!PAYMENT_STATUSES.some(s => s.key === paymentStatus)) return Toast.error('Error', 'Invalid payment status.');
  if (!PAYMENT_MODES.some(m => m.key === paymentMode)) return Toast.error('Error', 'Invalid payment mode.');
  if (!RENEWAL_STATUSES.some(s => s.key === renewalStatus)) return Toast.error('Error', 'Invalid renewal status.');

  let dealId = document.getElementById('modal-billing-deal').value || null;
  let proposalId = document.getElementById('modal-billing-proposal').value || null;
  const handoffId = document.getElementById('modal-billing-handoff').value || null;
  const contactId = document.getElementById('modal-billing-contact').value || null;

  if (contactId && !Store.getContactById(contactId)) {
    return Toast.error('Validation Error', 'Selected contact does not exist.');
  }

  let dealTeamId = null;
  let requirementTeamId = null;
  let handoffTeamId = null;

  // Cascade relations securely
  if (handoffId) {
    const h = Store.getHandoffById(handoffId);
    if (!h) return Toast.error('Error', 'Linked Handoff does not exist.');
    if (!Store.canUserViewHandoff(h, user)) return Toast.error('Error', 'Permission denied for linked Handoff.');
    if (h.deliveryStatus === 'cancelled' || h.deliveryStatus === 'blocked') {
      if (user.role !== 'manager') return Toast.error('Error', 'Cannot create billing from blocked/cancelled handoff.');
      if (!confirm('Handoff is blocked/cancelled. Create draft billing anyway?')) return;
      paymentStatus = 'draft';
    }
    if (!dealId && h.dealId) dealId = h.dealId;
    if (!proposalId && h.proposalId) proposalId = h.proposalId;
    handoffTeamId = h.teamId;
  }

  if (proposalId) {
    const p = Store.getProposalById(proposalId);
    if (!p) return Toast.error('Error', 'Linked Proposal does not exist.');
    if (!Store.canUserViewProposal(p, user)) return Toast.error('Error', 'Permission denied for linked Proposal.');
    if (p.status !== 'accepted') {
       if (user.role !== 'manager') return Toast.error('Error', 'Proposal must be Accepted to create billing.');
       if (!confirm('Proposal is not accepted. Create draft billing anyway?')) return;
       paymentStatus = 'draft';
    }
    if (!dealId && p.dealId) dealId = p.dealId;
    if (p.requirementId) {
      const r = Store.getRequirementById(p.requirementId);
      if (!r) return Toast.error('Error', 'Underlying Requirement does not exist.');
      if (!Store.canUserViewRequirement(r, user)) return Toast.error('Error', 'Permission denied for underlying Requirement.');
      requirementTeamId = r.teamId;
    }
  }

  if (dealId) {
    const d = Store.getDealById(dealId);
    if (!d) return Toast.error('Error', 'Linked Deal does not exist.');
    if (!Auth.canViewRecord(d)) return Toast.error('Error', 'Permission denied for linked Deal.');
    if (d.status !== 'closed_won') {
       if (user.role !== 'manager') return Toast.error('Error', 'Deal must be Closed Won to create billing.');
       if (!confirm('Deal is not closed won. Create draft billing anyway?')) return;
       paymentStatus = 'draft';
    }
    dealTeamId = d.teamId;
  }

  // Duplicate Check
  if (!currentBillingId) {
    const allBillings = Store.getBillings();
    const dup = allBillings.find(b =>
      (handoffId && b.handoffId === handoffId) ||
      (proposalId && b.proposalId === proposalId) ||
      (dealId && b.dealId === dealId)
    );
    if (dup) {
      if (user.role !== 'manager') return Toast.error('Duplicate Error', 'An active billing record already exists for this pipeline link.');
      if (!confirm('A billing record exists for this pipeline link. Create duplicate?')) return;
    }
  }

  let assignedTo = document.getElementById('modal-billing-assigned').value;
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

  // Derive Team ID
  let finalTeamId = assignedUser.teamId || null;
  if (!finalTeamId && handoffTeamId) finalTeamId = handoffTeamId;
  if (!finalTeamId && dealTeamId) finalTeamId = dealTeamId;
  if (!finalTeamId && requirementTeamId) finalTeamId = requirementTeamId;
  if (!finalTeamId) finalTeamId = user.teamId || null;

  // Number parses
  const subtotalRaw = document.getElementById('modal-billing-subtotal').value;
  const discountTotalRaw = document.getElementById('modal-billing-discount').value;
  const taxTotalRaw = document.getElementById('modal-billing-tax').value;
  const grandTotalRaw = document.getElementById('modal-billing-grand-total').value;
  const amountPaidRaw = document.getElementById('modal-billing-amount-paid').value;

  const subtotal = Number(subtotalRaw);
  const discountTotal = Number(discountTotalRaw);
  const taxTotal = Number(taxTotalRaw);
  const grandTotal = Number(grandTotalRaw);
  const amountPaid = Number(amountPaidRaw);

  if (isNaN(subtotal) || subtotal < 0) return Toast.error('Validation Error', 'Invalid subtotal.');
  if (isNaN(discountTotal) || discountTotal < 0) return Toast.error('Validation Error', 'Invalid discount total.');
  if (isNaN(taxTotal) || taxTotal < 0) return Toast.error('Validation Error', 'Invalid tax total.');
  if (isNaN(grandTotal) || grandTotal < 0) return Toast.error('Validation Error', 'Invalid grand total.');
  if (isNaN(amountPaid) || amountPaid < 0) return Toast.error('Validation Error', 'Invalid amount paid.');

  if (amountPaid > grandTotal) {
     if (user.role !== 'manager') return Toast.error('Error', 'Amount paid cannot exceed grand total.');
     if (!confirm('Amount paid exceeds grand total. Proceed?')) return;
  }

  // Strictly calculate balance
  const balanceDue = Math.max(0, grandTotal - amountPaid);

  // Date parses
  const invDateRaw = document.getElementById('modal-billing-invoice-date').value;
  const dueDateRaw = document.getElementById('modal-billing-due-date').value;
  const renDateRaw = document.getElementById('modal-billing-renewal-date').value;
  let invoiceDate = null, dueDate = null, renewalDate = null;

  if (invDateRaw) {
    const d = new Date(invDateRaw);
    if (isNaN(d.getTime())) return Toast.error('Validation Error', 'Invalid invoice date.');
    invoiceDate = d.toISOString();
  }
  if (dueDateRaw) {
    const d = new Date(dueDateRaw);
    if (isNaN(d.getTime())) return Toast.error('Validation Error', 'Invalid due date.');
    dueDate = d.toISOString();
  }
  if (renDateRaw) {
    const d = new Date(renDateRaw);
    if (isNaN(d.getTime())) return Toast.error('Validation Error', 'Invalid renewal date.');
    renewalDate = d.toISOString();
  }

  const renewalValueRaw = document.getElementById('modal-billing-renewal-value').value;
  let renewalValue = null;
  if (renewalValueRaw) {
    renewalValue = Number(renewalValueRaw);
    if (isNaN(renewalValue) || renewalValue < 0) return Toast.error('Validation Error', 'Invalid renewal value.');
  }

  // Old Record Check
  const oldRecord = currentBillingId ? Store.getBillingById(currentBillingId) : null;
  if (currentBillingId) {
    if (!oldRecord) return Toast.error('Error', 'Billing record not found.');
    if (!Store.canUserEditBilling(oldRecord, user)) return Toast.error('Error', 'Cannot edit this billing record.');
  }

  // Payment Status Auto-Calculations
  if (amountPaid <= 0 && (paymentStatus === 'paid' || paymentStatus === 'partially_paid')) {
    return Toast.error('Validation Error', 'Cannot mark paid or partially paid when amount paid is zero.');
  }

  if (amountPaid >= grandTotal && grandTotal > 0 && paymentStatus !== 'paid') {
    if (user.role === 'manager') {
      if (!confirm('Amount covers total. Leave status as ' + paymentStatus + '?')) return;
    } else {
      paymentStatus = 'paid';
    }
  } else if (amountPaid > 0 && amountPaid < grandTotal && paymentStatus !== 'partially_paid') {
    if (user.role === 'manager') {
      if (!confirm('Amount is partial. Leave status as ' + paymentStatus + '?')) return;
    } else {
      paymentStatus = 'partially_paid';
    }
  }

  if (dueDate && balanceDue > 0 && !['overdue', 'draft', 'cancelled'].includes(paymentStatus)) {
    const now = new Date();
    now.setHours(0,0,0,0);
    const dueObj = new Date(dueDate);
    if (dueObj < now) {
      if (user.role === 'manager') {
        if (!confirm('Invoice is overdue. Leave status as ' + paymentStatus + '?')) return;
      } else {
        paymentStatus = 'overdue';
      }
    }
  }

  let paidAt = oldRecord ? oldRecord.paidAt : null;
  if (paymentStatus === 'paid' && (!oldRecord || oldRecord.paymentStatus !== 'paid')) {
    paidAt = new Date().toISOString();
  } else if (paymentStatus !== 'paid') {
    paidAt = null; // Reset if unmarked
  }

  let cancelledAt = oldRecord ? oldRecord.cancelledAt : null;
  if (paymentStatus === 'cancelled' && (!oldRecord || oldRecord.paymentStatus !== 'cancelled')) {
    cancelledAt = new Date().toISOString();
  } else if (paymentStatus !== 'cancelled') {
    cancelledAt = null; // Reset if unmarked
  }

  const payload = {
    title,
    dealId,
    proposalId,
    handoffId,
    companyName,
    clientContactId: contactId,
    invoiceNumber,
    invoiceDate,
    dueDate,
    currency,
    subtotal,
    taxTotal,
    discountTotal,
    grandTotal,
    amountPaid,
    balanceDue,
    paymentStatus,
    paymentMode,
    renewalStatus,
    renewalDate,
    renewalValue,
    assignedTo,
    teamId: finalTeamId,
    notes: document.getElementById('modal-billing-notes').value.trim(),
    paidAt,
    cancelledAt
  };

  let saved;
  if (currentBillingId) {
    saved = Store.updateBilling(currentBillingId, payload);
    if (!saved) return Toast.error('Error', 'Failed to update billing.');
    Toast.success('Updated', 'Billing record updated successfully.');

    // Log updates
    if (oldRecord.paymentStatus !== saved.paymentStatus) {
      Store.createActivity({
         id: generateId(),
         title: `Invoice marked as ${saved.paymentStatus.replace('_', ' ')}`,
         type: 'stage_change',
         dealId: saved.dealId || null,
         assignedTo: user.id,
         teamId: user.teamId,
         createdBy: user.id,
         createdAt: new Date().toISOString()
      });
    }
    if (oldRecord.renewalStatus !== saved.renewalStatus) {
      Store.createActivity({
         id: generateId(),
         title: `Renewal status changed to ${saved.renewalStatus.replace('_', ' ')}`,
         type: 'note',
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
         title: `Billing reassigned to ${assignedUser.name}`,
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

    saved = Store.createBilling(payload);
    if (!saved) return Toast.error('Error', 'Failed to create billing.');
    Toast.success('Created', 'Billing record created successfully.');

    Store.createActivity({
       id: generateId(),
       title: `Billing Record Created`,
       type: 'stage_change',
       notes: `Invoice tracked for ${saved.companyName}`,
       dealId: saved.dealId || null,
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

export function bindBillingEvents() {
  if (eventsBound) return;
  eventsBound = true;

  const content = document.getElementById('content-area');
  if (!content) return;

  content.addEventListener('click', e => {
    if (e.target.closest('#btn-new-billing')) openModal();
    if (e.target.closest('#btn-close-billing-modal') || e.target.closest('#btn-cancel-billing')) closeModal();
    if (e.target.closest('#btn-save-billing')) handleSaveBilling();

    const editBtn = e.target.closest('.edit-billing');
    if (editBtn) openModal(editBtn.getAttribute('data-id'));

    const deleteBtn = e.target.closest('.delete-billing');
    if (deleteBtn) {
      const user = Auth.getCurrentUser();
      if (user?.role !== 'manager') {
        Toast.error('Access Denied', 'Only managers can delete billing records.');
        return;
      }
      const id = deleteBtn.getAttribute('data-id');
      const b = Store.getBillingById(id);
      if (!b) return Toast.error('Error', 'Billing record not found.');

      if (confirm('Are you sure you want to delete this billing record?')) {
        if (Store.deleteBilling(id)) {
          Toast.success('Deleted', 'Billing record deleted.');
          import('../router.js').then(m => m.Router.handleRoute());
        } else {
          Toast.error('Error', 'Failed to delete record.');
        }
      }
    }

    if (e.target.id === 'btn-autofill-billing') {
      const dealId = document.getElementById('modal-billing-deal').value;
      const propId = document.getElementById('modal-billing-proposal').value;
      const handoffId = document.getElementById('modal-billing-handoff').value;

      let sourceContactId = null;
      let sourceCompany = '';
      let sourceSubtotal = 0;
      let sourceDiscount = 0;
      let sourceTax = 0;
      let sourceGrand = 0;

      // priority order: Proposal -> Handoff -> Deal
      if (propId) {
        const p = Store.getProposalById(propId);
        if (p) {
          sourceSubtotal = p.subtotal;
          sourceDiscount = p.discountTotal;
          sourceTax = p.taxTotal;
          sourceGrand = p.grandTotal;
          if (p.dealId && !dealId) document.getElementById('modal-billing-deal').value = p.dealId;
        }
      }

      if (handoffId) {
        const h = Store.getHandoffById(handoffId);
        if (h) {
          if (h.clientContactId) sourceContactId = h.clientContactId;
          if (h.companyName) sourceCompany = h.companyName;
          if (h.dealId && !dealId) document.getElementById('modal-billing-deal').value = h.dealId;
          if (h.proposalId && !propId) document.getElementById('modal-billing-proposal').value = h.proposalId;
        }
      }

      // Read current dealId again in case it was cascaded
      const activeDealId = document.getElementById('modal-billing-deal').value;
      if (activeDealId) {
        const d = Store.getDealById(activeDealId);
        if (d) {
          if (!sourceContactId && d.contactId) sourceContactId = d.contactId;
          if (!sourceCompany && d.leadId) {
            const l = Store.getLeadById(d.leadId);
            if (l) sourceCompany = l.company;
          }
          if (sourceGrand === 0 && !propId) {
             sourceGrand = d.value;
             sourceSubtotal = d.value;
          }
        }
      }

      if (sourceCompany) document.getElementById('modal-billing-company').value = sourceCompany;
      if (sourceContactId) document.getElementById('modal-billing-contact').value = sourceContactId;

      document.getElementById('modal-billing-subtotal').value = sourceSubtotal || 0;
      document.getElementById('modal-billing-discount').value = sourceDiscount || 0;
      document.getElementById('modal-billing-tax').value = sourceTax || 0;
      document.getElementById('modal-billing-grand-total').value = sourceGrand || 0;

      updateBalanceUI();
      Toast.success('Auto-Filled', 'Data populated from selected links.');
    }
  });

  content.addEventListener('input', e => {
    if (e.target.id === 'billing-filter-search') loadTable();
    if (['modal-billing-grand-total', 'modal-billing-amount-paid'].includes(e.target.id)) {
      updateBalanceUI();
    }
  });

  content.addEventListener('change', e => {
    if (['billing-filter-status', 'billing-filter-renewal', 'billing-filter-owner'].includes(e.target.id)) loadTable();
  });
}

export function initBillingPage() {
  loadTable();
  const pendingDealId = sessionStorage.getItem('pendingBillingDealId');
  if (pendingDealId) {
    sessionStorage.removeItem('pendingBillingDealId');
    openModal(null, { dealId: pendingDealId });
  }
}
