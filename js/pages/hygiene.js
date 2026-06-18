// ============================================================
// TechnoEdge CRM — Hygiene Dashboard
// ============================================================

import { Store } from '../store.js';
import { Auth } from '../auth.js';
import { Toast } from '../components/toast.js';
import { formatDate } from '../utils.js';

let eventsBound = false;
let currentIssues = [];

function getHiddenIds() {
  const data = sessionStorage.getItem('technoedge_hygiene_hidden');
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function addHiddenId(id) {
  const hidden = getHiddenIds();
  if (!hidden.includes(id)) {
    hidden.push(id);
    sessionStorage.setItem('technoedge_hygiene_hidden', JSON.stringify(hidden));
  }
}

function diffDays(isoString) {
  if (!isoString) return 0;
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return 0;
  const now = new Date();
  const diffTime = now - d;
  if (diffTime < 0) return 0;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function isPast(isoString) {
  if (!isoString) return false;
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return false;
  const now = new Date();
  now.setHours(0,0,0,0);
  return d < now;
}

function isWithin30Days(isoString) {
  if (!isoString) return false;
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return false;
  const now = new Date();
  now.setHours(0,0,0,0);
  const diffTime = d - now;
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return days <= 30; // Could be past, which is <= 30
}

function hasOpenActivity(linkedId, allActivities) {
  return allActivities.some(a =>
    (a.linkedId === linkedId || a.dealId === linkedId || a.leadId === linkedId || a.sourceEntityId === linkedId) &&
    !['completed', 'cancelled'].includes(a.status) &&
    a.dueAt
  );
}

function normalize(str) {
  return (str || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');
}

function generateIssues(user) {
  const issues = [];
  const addIssue = (id, type, entityType, entityId, entityTitle, severity, message, assignedTo, fixAction, rawDate) => {
    let suggestedFix = '';
    if (type === 'missing_field') suggestedFix = 'Fill required fields';
    else if (type === 'stale_record') suggestedFix = 'Update record or add activity';
    else if (type === 'overdue_followup') suggestedFix = 'Complete or reschedule follow-up';
    else if (type === 'no_next_action') suggestedFix = 'Create follow-up';
    else if (type === 'duplicate_record') suggestedFix = 'Review duplicate candidate';
    else if (type === 'unassigned_record') suggestedFix = 'Assign owner';
    else if (type === 'invalid_link') suggestedFix = 'Review broken reference';
    else if (type === 'overdue_payment') suggestedFix = 'Collect/update payment';
    else if (type === 'renewal_due') suggestedFix = 'Contact client for renewal';

    const dateLabel = rawDate ? formatDate(rawDate) : '-';

    issues.push({ id, type, entityType, entityId, entityTitle, severity, message, assignedTo, fixAction, dateLabel, suggestedFix });
  };

  const leads = Store.getLeadsForUser(user);
  const contacts = Store.getContacts();
  const deals = Store.getDealsForUser(user);
  const requirements = Store.getRequirementsForUser(user);
  const proposals = Store.getProposalsForUser(user);
  const handoffs = Store.getHandoffsForUser(user);
  const billings = Store.getBillingsForUser(user);
  const activities = Store.getActivitiesForUser(user);
  const allActivities = Store.getActivities();

  const issueId = (eType, eId, iType, key) => `${eType}_${eId}_${iType}_${key}`;

  // 1. Missing required fields
  leads.forEach(l => {
    if (!l.name || !l.company || !l.assignedTo || !l.status || !l.source || (!l.email && !l.phone)) {
      addIssue(issueId('lead', l.id, 'missing_field', 'all'), 'missing_field', 'lead', l.id, l.name || 'Unknown', 'high', 'Missing critical fields (Name, Company, Assigned, Status, Source, or Email+Phone)', l.assignedTo, 'view', l.updatedAt);
    }
    if (!l.assignedTo) {
      addIssue(issueId('lead', l.id, 'unassigned_record', 'owner'), 'unassigned_record', 'lead', l.id, l.name || 'Unknown', 'high', 'Lead has no assigned owner.', l.assignedTo, 'fix_owner', l.updatedAt);
    }
  });

  contacts.forEach(c => {
    if (!c.name || !c.company || (!c.email && !c.phone)) {
      addIssue(issueId('contact', c.id, 'missing_field', 'all'), 'missing_field', 'contact', c.id, c.name || 'Unknown', 'medium', 'Missing Name, Company, or Contact info (Email+Phone)', null, 'view', c.updatedAt);
    }
  });

  deals.forEach(d => {
    if (!d.title || d.value === undefined || !d.stage || !d.assignedTo) {
      addIssue(issueId('deal', d.id, 'missing_field', 'all'), 'missing_field', 'deal', d.id, d.title || 'Unknown', 'high', 'Missing Title, Value, Stage, or Assigned To', d.assignedTo, 'view', d.updatedAt);
    }
    if (!d.assignedTo) {
      addIssue(issueId('deal', d.id, 'unassigned_record', 'owner'), 'unassigned_record', 'deal', d.id, d.title || 'Unknown', 'high', 'Deal has no assigned owner.', d.assignedTo, 'fix_owner', d.updatedAt);
    }
  });

  requirements.forEach(r => {
    if (!r.title || !r.summary || !r.requirementType || !r.status || !r.assignedTo) {
      addIssue(issueId('requirement', r.id, 'missing_field', 'all'), 'missing_field', 'requirement', r.id, r.title || 'Unknown', 'high', 'Missing Title, Summary, Type, Status, or Assigned To', r.assignedTo, 'view', r.updatedAt);
    }
    if (!r.assignedTo) {
      addIssue(issueId('requirement', r.id, 'unassigned_record', 'owner'), 'unassigned_record', 'requirement', r.id, r.title || 'Unknown', 'high', 'Requirement has no assigned owner.', r.assignedTo, 'fix_owner', r.updatedAt);
    }
  });

  proposals.forEach(p => {
    if (!p.title || !p.status || !p.lineItems || p.lineItems.length === 0 || p.grandTotal === undefined || !p.assignedTo) {
      addIssue(issueId('proposal', p.id, 'missing_field', 'all'), 'missing_field', 'proposal', p.id, p.title || 'Unknown', 'high', 'Missing Title, Status, Line Items, Grand Total, or Assigned To', p.assignedTo, 'view', p.updatedAt);
    }
    if (!p.assignedTo) {
      addIssue(issueId('proposal', p.id, 'unassigned_record', 'owner'), 'unassigned_record', 'proposal', p.id, p.title || 'Unknown', 'high', 'Proposal has no assigned owner.', p.assignedTo, 'fix_owner', p.updatedAt);
    }
  });

  handoffs.forEach(h => {
    if (!h.title || !h.companyName || !h.projectBrief || !h.assignedTo || !h.deliveryStatus) {
      addIssue(issueId('handoff', h.id, 'missing_field', 'all'), 'missing_field', 'handoff', h.id, h.title || 'Unknown', 'high', 'Missing Title, Company, Brief, Assigned To, or Status', h.assignedTo, 'view', h.updatedAt);
    }
    if (!h.assignedTo) {
      addIssue(issueId('handoff', h.id, 'unassigned_record', 'owner'), 'unassigned_record', 'handoff', h.id, h.title || 'Unknown', 'high', 'Handoff has no assigned owner.', h.assignedTo, 'fix_owner', h.updatedAt);
    }
  });

  billings.forEach(b => {
    if (!b.title || !b.companyName || b.grandTotal === undefined || !b.paymentStatus || !b.assignedTo) {
      addIssue(issueId('billing', b.id, 'missing_field', 'all'), 'missing_field', 'billing', b.id, b.title || 'Unknown', 'high', 'Missing Title, Company, Total, Payment Status, or Assigned To', b.assignedTo, 'view', b.updatedAt);
    }
    if (!b.assignedTo) {
      addIssue(issueId('billing', b.id, 'unassigned_record', 'owner'), 'unassigned_record', 'billing', b.id, b.title || 'Unknown', 'high', 'Billing record has no assigned owner.', b.assignedTo, 'fix_owner', b.updatedAt);
    }
  });

  activities.forEach(a => {
    if (!a.assignedTo) {
      addIssue(issueId('activity', a.id, 'unassigned_record', 'owner'), 'unassigned_record', 'activity', a.id, a.title || 'Unknown', 'medium', 'Activity has no assigned owner.', a.assignedTo, 'fix_owner', a.updatedAt);
    }
  });

  // 2. Stale Records
  leads.forEach(l => {
    if (!['converted', 'lost', 'won'].includes(l.status) && diffDays(l.updatedAt) >= 14) {
      addIssue(issueId('lead', l.id, 'stale_record', 'time'), 'stale_record', 'lead', l.id, l.name || 'Unknown', 'medium', 'Lead active but not updated in 14+ days.', l.assignedTo, 'view', l.updatedAt);
    }
  });
  deals.forEach(d => {
    if (!['closed_won', 'closed_lost'].includes(d.status) && diffDays(d.updatedAt) >= 14) {
      addIssue(issueId('deal', d.id, 'stale_record', 'time'), 'stale_record', 'deal', d.id, d.title || 'Unknown', 'high', 'Deal active but not updated in 14+ days.', d.assignedTo, 'view', d.updatedAt);
    }
  });
  requirements.forEach(r => {
    if (['draft', 'captured'].includes(r.status) && diffDays(r.updatedAt) >= 10) {
      addIssue(issueId('requirement', r.id, 'stale_record', 'time'), 'stale_record', 'requirement', r.id, r.title || 'Unknown', 'medium', 'Requirement stuck in Draft/Captured for 10+ days.', r.assignedTo, 'view', r.updatedAt);
    }
  });
  proposals.forEach(p => {
    if (['draft', 'sent'].includes(p.status) && diffDays(p.updatedAt) >= 10) {
      addIssue(issueId('proposal', p.id, 'stale_record', 'time'), 'stale_record', 'proposal', p.id, p.title || 'Unknown', 'medium', 'Proposal stuck in Draft/Sent for 10+ days.', r.assignedTo, 'view', p.updatedAt);
    }
  });
  handoffs.forEach(h => {
    if (!['completed', 'cancelled', 'blocked'].includes(h.deliveryStatus) && diffDays(h.updatedAt) >= 10) {
      addIssue(issueId('handoff', h.id, 'stale_record', 'time'), 'stale_record', 'handoff', h.id, h.title || 'Unknown', 'high', 'Handoff active but not updated in 10+ days.', h.assignedTo, 'view', h.updatedAt);
    }
  });
  billings.forEach(b => {
    if (['invoiced', 'partially_paid'].includes(b.paymentStatus)) {
      if ((b.dueDate && isPast(b.dueDate)) || diffDays(b.updatedAt) >= 14) {
        addIssue(issueId('billing', b.id, 'stale_record', 'time'), 'stale_record', 'billing', b.id, b.title || 'Unknown', 'high', 'Billing stuck in Invoiced/Partial state for 14+ days or past due.', b.assignedTo, 'view', b.updatedAt);
      }
    }
  });

  // 3. Overdue follow-ups
  activities.forEach(a => {
    if (a.dueAt && isPast(a.dueAt) && !['completed', 'cancelled'].includes(a.status)) {
      addIssue(issueId('activity', a.id, 'overdue_followup', 'time'), 'overdue_followup', 'activity', a.id, a.title || 'Unknown', 'high', 'Activity due date has passed.', a.assignedTo, 'view', a.dueAt);
    }
  });
  billings.forEach(b => {
    if (b.dueDate && isPast(b.dueDate) && b.balanceDue > 0) {
      addIssue(issueId('billing', b.id, 'overdue_payment', 'time'), 'overdue_payment', 'billing', b.id, b.title || 'Unknown', 'high', 'Payment is overdue.', b.assignedTo, 'view', b.dueDate);
    }
    if (b.renewalDate && isWithin30Days(b.renewalDate) && !['renewed', 'not_renewing'].includes(b.renewalStatus)) {
      addIssue(issueId('billing', b.id, 'renewal_due', 'time'), 'renewal_due', 'billing', b.id, b.title || 'Unknown', 'medium', 'Renewal is due within 30 days or already passed.', b.assignedTo, 'view', b.renewalDate);
    }
  });

  // 4. No next action
  leads.forEach(l => {
    if (!['converted', 'lost', 'won'].includes(l.status) && !hasOpenActivity(l.id, allActivities)) {
      addIssue(issueId('lead', l.id, 'no_next_action', 'act'), 'no_next_action', 'lead', l.id, l.name || 'Unknown', 'high', 'Lead has no open follow-up activity.', l.assignedTo, 'create_followup', l.updatedAt);
    }
  });
  deals.forEach(d => {
    if (!['closed_won', 'closed_lost'].includes(d.status) && !hasOpenActivity(d.id, allActivities)) {
      addIssue(issueId('deal', d.id, 'no_next_action', 'act'), 'no_next_action', 'deal', d.id, d.title || 'Unknown', 'high', 'Deal has no open follow-up activity.', d.assignedTo, 'create_followup', d.updatedAt);
    }
  });
  proposals.forEach(p => {
    if (['draft', 'sent'].includes(p.status) && !hasOpenActivity(p.id, allActivities)) {
      addIssue(issueId('proposal', p.id, 'no_next_action', 'act'), 'no_next_action', 'proposal', p.id, p.title || 'Unknown', 'medium', 'Active proposal has no open follow-up activity.', p.assignedTo, 'create_followup', p.updatedAt);
    }
  });
  handoffs.forEach(h => {
    if (!['completed', 'cancelled'].includes(h.deliveryStatus) && !hasOpenActivity(h.id, allActivities)) {
      addIssue(issueId('handoff', h.id, 'no_next_action', 'act'), 'no_next_action', 'handoff', h.id, h.title || 'Unknown', 'medium', 'Active handoff has no open follow-up activity.', h.assignedTo, 'create_followup', h.updatedAt);
    }
  });

  // 5. Duplicate Records
  const allContacts = Store.getContacts();
  const allLeads = Store.getLeads();
  const emailMap = {}, phoneMap = {}, companyMap = {};

  allContacts.forEach(c => {
    if (user.role !== 'manager') {
       const hasLinkedDeal = deals.some(d => d.contactId === c.id || d.clientContactId === c.id);
       const hasLinkedReq = requirements.some(r => r.contactId === c.id);
       const hasLinkedProp = proposals.some(p => p.contactId === c.id);
       const hasLinkedHandoff = handoffs.some(h => h.clientContactId === c.id);
       const hasLinkedBilling = billings.some(b => b.clientContactId === c.id);
       const hasLinkedAct = activities.some(a => a.contactId === c.id);
       if (!hasLinkedDeal && !hasLinkedReq && !hasLinkedProp && !hasLinkedHandoff && !hasLinkedBilling && !hasLinkedAct) {
           return;
       }
    }
    if (c.email) { emailMap[c.email] = emailMap[c.email] || []; emailMap[c.email].push({ type: 'contact', id: c.id, name: c.name, assignedTo: null, rawDate: c.createdAt }); }
    if (c.phone) { phoneMap[c.phone] = phoneMap[c.phone] || []; phoneMap[c.phone].push({ type: 'contact', id: c.id, name: c.name, assignedTo: null, rawDate: c.createdAt }); }
    if (c.company) {
      const norm = normalize(c.company);
      if (norm) { companyMap[norm] = companyMap[norm] || []; companyMap[norm].push({ type: 'contact', id: c.id, name: c.name, assignedTo: null, rawDate: c.createdAt }); }
    }
  });
  allLeads.forEach(l => {
    if (l.email) { emailMap[l.email] = emailMap[l.email] || []; emailMap[l.email].push({ type: 'lead', id: l.id, name: l.name, assignedTo: l.assignedTo, rawDate: l.createdAt }); }
    if (l.phone) { phoneMap[l.phone] = phoneMap[l.phone] || []; phoneMap[l.phone].push({ type: 'lead', id: l.id, name: l.name, assignedTo: l.assignedTo, rawDate: l.createdAt }); }
    if (l.company) {
      const norm = normalize(l.company);
      if (norm) { companyMap[norm] = companyMap[norm] || []; companyMap[norm].push({ type: 'lead', id: l.id, name: l.name, assignedTo: l.assignedTo, rawDate: l.createdAt }); }
    }
  });

  const pushDup = (map, severity, reason) => {
    for (const key in map) {
      if (map[key].length > 1) {
        map[key].forEach(rec => {
          if (rec.type === 'lead') {
            if (!leads.some(l => l.id === rec.id)) return;
          }
          addIssue(issueId(rec.type, rec.id, 'duplicate_record', key.replace(/\s+/g,'')), 'duplicate_record', rec.type, rec.id, rec.name || 'Unknown', severity, `Duplicate detected (Same ${reason}: ${key}).`, rec.assignedTo, 'delete_dup', rec.rawDate);
        });
      }
    }
  };

  pushDup(emailMap, 'high', 'Email');
  pushDup(phoneMap, 'high', 'Phone');
  pushDup(companyMap, 'low', 'Company');

  // 6. Invalid Links
  const checkLink = (entityType, eId, eTitle, linkType, linkId, assignedTo, rawDate) => {
    if (linkId) {
      let valid = false;
      if (linkType === 'deal') valid = !!Store.getDealById(linkId);
      if (linkType === 'lead') valid = !!Store.getLeadById(linkId);
      if (linkType === 'contact') valid = !!Store.getContactById(linkId);
      if (linkType === 'requirement') valid = !!Store.getRequirementById(linkId);
      if (linkType === 'proposal') valid = !!Store.getProposalById(linkId);
      if (linkType === 'handoff') valid = !!Store.getHandoffById(linkId);

      if (!valid) {
        addIssue(issueId(entityType, eId, 'invalid_link', linkId), 'invalid_link', entityType, eId, eTitle || 'Unknown', 'high', `Broken reference to ${linkType} (ID: ${linkId})`, assignedTo, 'view', rawDate);
      }
    }
  };

  proposals.forEach(p => {
    checkLink('proposal', p.id, p.title, 'requirement', p.requirementId, p.assignedTo, p.updatedAt);
    checkLink('proposal', p.id, p.title, 'deal', p.dealId, p.assignedTo, p.updatedAt);
    checkLink('proposal', p.id, p.title, 'contact', p.contactId, p.assignedTo, p.updatedAt);
  });
  requirements.forEach(r => {
    checkLink('requirement', r.id, r.title, 'deal', r.dealId, r.assignedTo, r.updatedAt);
    checkLink('requirement', r.id, r.title, 'lead', r.leadId, r.assignedTo, r.updatedAt);
    checkLink('requirement', r.id, r.title, 'contact', r.contactId, r.assignedTo, r.updatedAt);
  });
  handoffs.forEach(h => {
    checkLink('handoff', h.id, h.title, 'deal', h.dealId, h.assignedTo, h.updatedAt);
    checkLink('handoff', h.id, h.title, 'proposal', h.proposalId, h.assignedTo, h.updatedAt);
    checkLink('handoff', h.id, h.title, 'contact', h.clientContactId, h.assignedTo, h.updatedAt);
  });
  billings.forEach(b => {
    checkLink('billing', b.id, b.title, 'deal', b.dealId, b.assignedTo, b.updatedAt);
    checkLink('billing', b.id, b.title, 'proposal', b.proposalId, b.assignedTo, b.updatedAt);
    checkLink('billing', b.id, b.title, 'handoff', b.handoffId, b.assignedTo, b.updatedAt);
    checkLink('billing', b.id, b.title, 'contact', b.clientContactId, b.assignedTo, b.updatedAt);
  });
  activities.forEach(a => {
    if (a.linkedType && a.linkedId) {
      checkLink('activity', a.id, a.title, a.linkedType, a.linkedId, a.assignedTo, a.updatedAt);
    }
    checkLink('activity', a.id, a.title, 'deal', a.dealId, a.assignedTo, a.updatedAt);
    checkLink('activity', a.id, a.title, 'lead', a.leadId, a.assignedTo, a.updatedAt);
    checkLink('activity', a.id, a.title, 'contact', a.contactId, a.assignedTo, a.updatedAt);
  });

  return issues;
}

export function renderHygiene() {
  const user = Auth.getCurrentUser();
  if (!user) return '';

  const hiddenIds = getHiddenIds();
  const rawIssues = generateIssues(user);

  const uniqueMap = new Map();
  rawIssues.forEach(i => uniqueMap.set(i.id, i));
  currentIssues = Array.from(uniqueMap.values()).filter(i => !hiddenIds.includes(i.id));

  const total = currentIssues.length;
  const missing = currentIssues.filter(i => i.type === 'missing_field').length;
  const stale = currentIssues.filter(i => i.type === 'stale_record').length;
  const overdue = currentIssues.filter(i => i.type === 'overdue_followup' || i.type === 'overdue_payment' || i.type === 'renewal_due').length;
  const duplicates = currentIssues.filter(i => i.type === 'duplicate_record').length;
  const unassigned = currentIssues.filter(i => i.type === 'unassigned_record').length;

  return `
    <div class="content-inner">
      <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
        <div>
          <h1 class="page-header-title">CRM Hygiene</h1>
          <div class="page-header-subtitle">Identify and fix data quality issues in your workspace</div>
        </div>
        <button class="btn btn-secondary" id="btn-refresh-hygiene">
          <span class="icon">↻</span> Refresh
        </button>
      </div>

      <div class="dashboard-grid" style="grid-template-columns: repeat(6, 1fr); margin-bottom: 2rem;">
        <div class="stat-card">
          <div class="stat-card-label">Total Issues</div>
          <div class="stat-card-value">${total}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">Missing Info</div>
          <div class="stat-card-value" style="color:var(--color-error);">${missing}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">Stale Records</div>
          <div class="stat-card-value" style="color:var(--color-stage-invoice);">${stale}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">Overdue</div>
          <div class="stat-card-value" style="color:var(--color-error);">${overdue}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">Duplicates</div>
          <div class="stat-card-value" style="color:var(--color-stage-sales);">${duplicates}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">Unassigned</div>
          <div class="stat-card-value" style="color:var(--color-primary);">${unassigned}</div>
        </div>
      </div>

      <div class="filters-bar" style="display:flex; gap:1rem; margin-bottom:1rem; flex-wrap:wrap; background:var(--color-surface-card); padding:1rem; border-radius:8px; border:1px solid var(--color-hairline-soft);">
        <input type="text" class="login-input" id="hygiene-filter-search" placeholder="Search issues..." style="flex:1; min-width:200px;">
        <select class="login-input" id="hygiene-filter-type" style="width:160px;">
          <option value="all">All Issue Types</option>
          <option value="missing_field">Missing Fields</option>
          <option value="stale_record">Stale Records</option>
          <option value="overdue_followup">Overdue Follow-ups</option>
          <option value="no_next_action">No Next Action</option>
          <option value="duplicate_record">Duplicates</option>
          <option value="unassigned_record">Unassigned</option>
          <option value="invalid_link">Invalid Links</option>
          <option value="overdue_payment">Overdue Payment</option>
          <option value="renewal_due">Renewal Due</option>
        </select>
        <select class="login-input" id="hygiene-filter-entity" style="width:140px;">
          <option value="all">All Entities</option>
          <option value="lead">Leads</option>
          <option value="deal">Deals</option>
          <option value="activity">Activities</option>
          <option value="requirement">Requirements</option>
          <option value="proposal">Proposals</option>
          <option value="handoff">Handoffs</option>
          <option value="billing">Billings</option>
          <option value="contact">Contacts</option>
        </select>
        <select class="login-input" id="hygiene-filter-severity" style="width:120px;">
          <option value="all">All Severities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select class="login-input" id="hygiene-filter-owner" style="width:140px;">
          <!-- Populated dynamically -->
        </select>
      </div>

      <div class="table-container" style="background:var(--color-surface-card); border-radius:8px; border:1px solid var(--color-hairline-soft); overflow-x:auto;">
        <table class="data-table" style="width:100%; text-align:left; border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:1px solid var(--color-hairline-soft);">
              <th style="padding:1rem;">Issue</th>
              <th style="padding:1rem;">Entity</th>
              <th style="padding:1rem;">Severity</th>
              <th style="padding:1rem;">Owner</th>
              <th style="padding:1rem;">Last Updated / Due Date</th>
              <th style="padding:1rem;">Suggested Fix</th>
              <th style="padding:1rem; text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody id="hygiene-tbody">
            <!-- Rendered via loadHygieneTable() -->
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export function loadHygieneTable() {
  const tbody = document.getElementById('hygiene-tbody');
  const searchInput = document.getElementById('hygiene-filter-search');
  const typeFilter = document.getElementById('hygiene-filter-type');
  const entityFilter = document.getElementById('hygiene-filter-entity');
  const severityFilter = document.getElementById('hygiene-filter-severity');
  const ownerFilter = document.getElementById('hygiene-filter-owner');

  if (!tbody || !searchInput || !typeFilter || !entityFilter || !severityFilter || !ownerFilter) return;

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
    ownerOptions += '<option value="unassigned">Unassigned</option>';
    ownerFilter.innerHTML = ownerOptions;
  }

  const search = searchInput.value.toLowerCase();
  const typeVal = typeFilter.value;
  const entityVal = entityFilter.value;
  const severityVal = severityFilter.value;
  const ownerVal = ownerFilter.value;

  const filtered = currentIssues.filter(i => {
    const matchSearch = String(i.message || '').toLowerCase().includes(search) || String(i.entityTitle || '').toLowerCase().includes(search);
    const matchType = typeVal === 'all' || i.type === typeVal;
    const matchEntity = entityVal === 'all' || i.entityType === entityVal;
    const matchSeverity = severityVal === 'all' || i.severity === severityVal;

    let matchOwner = false;
    if (ownerVal === 'all') matchOwner = true;
    else if (ownerVal === 'unassigned') matchOwner = !i.assignedTo;
    else matchOwner = i.assignedTo === ownerVal;

    return matchSearch && matchType && matchEntity && matchSeverity && matchOwner;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--color-muted);">No hygiene issues found matching your filters. Great job! 🎉</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(i => {
    const owner = i.assignedTo ? Store.getUserById(i.assignedTo) : null;
    let sevColor = 'var(--color-muted)';
    if (i.severity === 'high') sevColor = 'var(--color-error)';
    if (i.severity === 'medium') sevColor = 'var(--color-stage-invoice)';

    const actions = [];
    actions.push(`<button class="btn btn-sm btn-secondary act-view" data-type="${i.entityType}" data-id="${i.entityId}">View</button>`);
    actions.push(`<button class="btn btn-sm btn-secondary act-hide" data-issue-id="${i.id}">Mark Reviewed</button>`);

    if (i.fixAction === 'fix_owner') {
      actions.push(`<button class="btn btn-sm btn-primary act-fix-owner" data-type="${i.entityType}" data-id="${i.entityId}">Assign Owner</button>`);
    } else if (i.fixAction === 'create_followup') {
      actions.push(`<button class="btn btn-sm btn-primary act-followup" data-type="${i.entityType}" data-id="${i.entityId}" data-title="${encodeURIComponent(i.entityTitle)}" data-owner="${i.assignedTo}">Follow-up</button>`);
    } else if (i.fixAction === 'delete_dup' && user.role === 'manager') {
      actions.push(`<button class="btn btn-sm btn-secondary act-delete-dup" style="color:var(--color-error); border-color:var(--color-error);" data-type="${i.entityType}" data-id="${i.entityId}">Delete</button>`);
    }

    return `
      <tr style="border-bottom:1px solid var(--color-hairline-soft);">
        <td style="padding:1rem;">
          <div style="font-weight:600;">${i.message}</div>
          <div style="font-size:0.8rem; color:var(--color-muted);">${i.entityTitle}</div>
        </td>
        <td style="padding:1rem; text-transform:capitalize;">${i.entityType}</td>
        <td style="padding:1rem;">
          <span class="badge" style="background:${sevColor}; color:white;">${i.severity}</span>
        </td>
        <td style="padding:1rem;">${owner ? owner.name : '<span style="color:var(--color-error);">Unassigned</span>'}</td>
        <td style="padding:1rem;">${i.dateLabel}</td>
        <td style="padding:1rem;">${i.suggestedFix}</td>
        <td style="padding:1rem; text-align:right;">
          <div style="display:flex; gap:0.5rem; justify-content:flex-end;">
            ${actions.join('')}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function handleRouteAction(type, id) {
  const map = {
    'lead': '#/leads',
    'deal': `#/deals/${id}`,
    'activity': '#/activities',
    'requirement': '#/requirements',
    'proposal': '#/proposals',
    'handoff': '#/handoffs',
    'billing': '#/billing',
    'contact': '#/contacts'
  };
  import('../router.js').then(m => m.Router.navigate(map[type] || '#/dashboard'));
}

function handleAssignOwner(entityType, entityId) {
  const user = Auth.getCurrentUser();
  if (!user) return;

  const validUsers = user.role === 'employee' ? [user] :
                     user.role === 'team_lead' ? Store.getUsersByTeam(user.teamId).concat([user]) :
                     Store.getUsers().filter(u => u.isActive);

  const modalHtml = `
    <div id="hygiene-owner-modal" class="modal-overlay">
      <div class="modal" style="max-width:400px; width:90%;">
        <div class="modal-header">
          <h2>Assign Owner</h2>
          <button class="modal-close" id="btn-close-owner">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Select User</label>
            <select class="login-input" id="hygiene-new-owner">
              ${validUsers.map(u => `<option value="${u.id}">${u.name}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="btn-cancel-owner">Cancel</button>
          <button class="btn btn-primary" id="btn-save-owner">Save</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const removeModal = () => document.getElementById('hygiene-owner-modal')?.remove();

  document.getElementById('btn-close-owner').addEventListener('click', removeModal);
  document.getElementById('btn-cancel-owner').addEventListener('click', removeModal);

  document.getElementById('btn-save-owner').onclick = () => {
    const newOwnerId = document.getElementById('hygiene-new-owner').value;
    if (!newOwnerId) return;

    const validTypes = ['lead', 'deal', 'requirement', 'proposal', 'handoff', 'billing', 'activity'];
    if (!validTypes.includes(entityType)) return Toast.error('Error', 'Invalid entity type.');

    const targetUser = Store.getUserById(newOwnerId);
    if (!targetUser || !targetUser.isActive) return Toast.error('Error', 'Selected user does not exist or is inactive.');

    if (user.role === 'employee' && newOwnerId !== user.id) {
      return Toast.error('Error', 'Employees can only assign themselves.');
    }
    if (user.role === 'team_lead' && targetUser.teamId !== user.teamId && targetUser.id !== user.id) {
      return Toast.error('Error', 'Team Leads can only assign same-team users.');
    }

    let success = false;
    const Getters = {
      lead: Store.getLeadById,
      deal: Store.getDealById,
      requirement: Store.getRequirementById,
      proposal: Store.getProposalById,
      handoff: Store.getHandoffById,
      billing: Store.getBillingById,
      activity: Store.getActivityById
    };
    const Updaters = {
      lead: Store.updateLead,
      deal: Store.updateDeal,
      requirement: Store.updateRequirement,
      proposal: Store.updateProposal,
      handoff: Store.updateHandoff,
      billing: Store.updateBilling,
      activity: Store.updateActivity
    };

    const getFn = Getters[entityType];
    const upFn = Updaters[entityType];

    if (getFn && upFn) {
      const rec = getFn(entityId);
      if (rec) {
        if (rec.assignedTo && rec.assignedTo !== newOwnerId) {
          if (user.role !== 'manager') return Toast.error('Error', 'Only managers can reassign records that already have an owner.');
          if (!confirm('This record is already assigned. Are you sure you want to reassign it?')) return;
        }

        let canEdit = false;
        if (entityType === 'lead' || entityType === 'deal') canEdit = Auth.canEditRecord(rec);
        else if (entityType === 'requirement') canEdit = Store.canUserEditRequirement(rec, user);
        else if (entityType === 'proposal') canEdit = Store.canUserEditProposal(rec, user);
        else if (entityType === 'handoff') canEdit = Store.canUserEditHandoff(rec, user);
        else if (entityType === 'billing') canEdit = Store.canUserEditBilling(rec, user);
        else if (entityType === 'activity') canEdit = Store.canUserEditActivity(rec, user);

        if (!canEdit) return Toast.error('Error', 'Permission denied.');

        const payload = { assignedTo: newOwnerId, teamId: targetUser.teamId || rec.teamId || user.teamId || null };
        success = !!upFn(entityId, payload);
      }
    }

    if (success) {
      Toast.success('Updated', 'Owner assigned successfully.');
      removeModal();
      import('../router.js').then(m => m.Router.handleRoute());
    } else {
      Toast.error('Error', 'Failed to assign owner or permission denied.');
    }
  };
}

function handleDeleteDuplicate(entityType, entityId) {
  const user = Auth.getCurrentUser();
  if (!user || user.role !== 'manager') return Toast.error('Access Denied', 'Only managers can delete records.');

  if (!confirm('Are you sure you want to delete this duplicate candidate? This cannot be undone.')) return;

  if (entityType === 'contact') {
    const c = Store.getContactById(entityId);
    if (!c) return Toast.error('Error', 'Contact not found.');

    const deals = Store.getDeals().some(d => d.contactId === entityId || d.clientContactId === entityId);
    const reqs = Store.getRequirements().some(r => r.contactId === entityId);
    const props = Store.getProposals().some(p => p.contactId === entityId);
    const handoffs = Store.getHandoffs().some(h => h.clientContactId === entityId);
    const billings = Store.getBillings().some(b => b.clientContactId === entityId);
    const acts = Store.getActivities().some(a => a.contactId === entityId);

    if (deals || reqs || props || handoffs || billings || acts) {
      return Toast.error('Error', 'Cannot delete contact because it is linked to other records.');
    }

    if (Store.deleteContact(entityId)) {
      Toast.success('Deleted', 'Duplicate contact removed.');
      import('../router.js').then(m => m.Router.handleRoute());
    } else {
      Toast.error('Error', 'Failed to delete contact.');
    }
  } else if (entityType === 'lead') {
    const l = Store.getLeadById(entityId);
    if (!l) return Toast.error('Error', 'Lead not found.');

    const deals = Store.getDeals().some(d => d.leadId === entityId);
    const acts = Store.getActivities().some(a => a.leadId === entityId);
    const reqs = Store.getRequirements().some(r => r.leadId === entityId);

    if (deals || acts || reqs) {
      return Toast.error('Error', 'Cannot delete lead because it is linked to other records.');
    }

    if (Store.deleteLead(entityId)) {
      Toast.success('Deleted', 'Duplicate lead removed.');
      import('../router.js').then(m => m.Router.handleRoute());
    } else {
      Toast.error('Error', 'Failed to delete lead.');
    }
  }
}

export function bindHygieneEvents() {
  if (eventsBound) return;
  eventsBound = true;

  const content = document.getElementById('content-area');
  if (!content) return;

  content.addEventListener('click', e => {
    if (e.target.closest('#btn-refresh-hygiene')) {
      import('../router.js').then(m => m.Router.handleRoute());
    }

    const btnHide = e.target.closest('.act-hide');
    if (btnHide) {
      addHiddenId(btnHide.getAttribute('data-issue-id'));
      import('../router.js').then(m => m.Router.handleRoute());
    }

    const btnView = e.target.closest('.act-view');
    if (btnView) {
      handleRouteAction(btnView.getAttribute('data-type'), btnView.getAttribute('data-id'));
    }

    const btnOwner = e.target.closest('.act-fix-owner');
    if (btnOwner) {
      handleAssignOwner(btnOwner.getAttribute('data-type'), btnOwner.getAttribute('data-id'));
    }

    const btnDel = e.target.closest('.act-delete-dup');
    if (btnDel) {
      handleDeleteDuplicate(btnDel.getAttribute('data-type'), btnDel.getAttribute('data-id'));
    }

    const btnFollow = e.target.closest('.act-followup');
    if (btnFollow) {
      const type = btnFollow.getAttribute('data-type');
      const id = btnFollow.getAttribute('data-id');
      const title = decodeURIComponent(btnFollow.getAttribute('data-title'));
      const owner = btnFollow.getAttribute('data-owner');

      const user = Auth.getCurrentUser();
      let canEditSource = false;
      const Getters = {
        lead: Store.getLeadById,
        deal: Store.getDealById,
        contact: Store.getContactById,
        requirement: Store.getRequirementById,
        proposal: Store.getProposalById,
        handoff: Store.getHandoffById,
        billing: Store.getBillingById
      };
      const rec = Getters[type] ? Getters[type](id) : null;
      if (!rec) return Toast.error('Error', 'Source record not found.');

      if (type === 'contact') canEditSource = true;
      else if (type === 'lead' || type === 'deal') canEditSource = Auth.canEditRecord(rec);
      else if (type === 'requirement') canEditSource = Store.canUserEditRequirement(rec, user);
      else if (type === 'proposal') canEditSource = Store.canUserEditProposal(rec, user);
      else if (type === 'handoff') canEditSource = Store.canUserEditHandoff(rec, user);
      else if (type === 'billing') canEditSource = Store.canUserEditBilling(rec, user);

      if (!canEditSource) return Toast.error('Error', 'Permission denied to create follow-up for this record.');

      if (['deal', 'lead', 'contact'].includes(type)) {
        import('./activities.js').then(m => {
          m.renderActivityModal(null, { linkedType: type, linkedId: id });
        });
      } else {
        let dealId = null;
        if (rec && rec.dealId) {
          const d = Store.getDealById(rec.dealId);
          if (d && Auth.canEditRecord(d)) dealId = rec.dealId;
        }

        if (dealId) {
          import('./activities.js').then(m => {
            m.renderActivityModal(null, { linkedType: 'deal', linkedId: dealId });
          });
        } else {
          let targetOwner = user.id;
          let targetTeamId = user.teamId;
          if (owner && owner !== 'null' && owner !== 'undefined' && owner !== '') {
            const u = Store.getUserById(owner);
            if (u && u.isActive) {
              targetOwner = u.id;
              targetTeamId = u.teamId;
            }
          }

          const due = new Date();
          due.setDate(due.getDate() + 1);
          const nowIso = new Date().toISOString();

          const payload = {
            id: 'act_' + Date.now(),
            title: `Follow up on ${type}: ${title}`,
            content: `Follow up on ${type}: ${title}`,
            type: 'follow_up',
            status: 'open',
            linkedType: 'none',
            linkedId: null,
            sourceEntityType: type,
            sourceEntityId: id,
            assignedTo: targetOwner,
            teamId: targetTeamId,
            dueAt: due.toISOString(),
            createdBy: user.id,
            createdAt: nowIso,
            updatedAt: nowIso
          };
          Store.createActivity(payload);
          Toast.success('Created', 'Follow-up activity created.');
          import('../router.js').then(m => m.Router.handleRoute());
        }
      }
    }
  });

  content.addEventListener('change', e => {
    if (['hygiene-filter-search', 'hygiene-filter-type', 'hygiene-filter-entity', 'hygiene-filter-severity', 'hygiene-filter-owner'].includes(e.target.id)) {
      loadHygieneTable();
    }
  });
  content.addEventListener('keyup', e => {
    if (e.target.id === 'hygiene-filter-search') loadHygieneTable();
  });
}

export function initHygienePage() {
  loadHygieneTable();
}
