// ============================================================
// TechnoEdge CRM — Activities & Follow-ups Page
// ============================================================

import { Store } from '../store.js';
import { Auth } from '../auth.js';
import { Toast } from '../components/toast.js';
import { Router } from '../router.js';
import { generateId, formatDateTime, timeAgo } from '../utils.js';

let filters = {
  search: '',
  type: 'all',
  status: 'all',
  timing: 'all',
  owner: 'all'
};

const ACTIVITY_TYPES = [
  { key: 'call', label: 'Call' },
  { key: 'email', label: 'Email' },
  { key: 'meeting', label: 'Meeting' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'note', label: 'Note' },
  { key: 'follow_up', label: 'Follow-up' },
  { key: 'stage_change', label: 'Stage Change' },
  { key: 'assignment', label: 'Assignment' }
];

// ── Helpers ───────────────────────────────────────────────────

function getStatusLabel(status) {
  if (status === 'completed') return 'Completed';
  if (status === 'cancelled') return 'Cancelled';
  return 'Open';
}

function getLinkedRecordLabel(act) {
  if (act.dealId) {
    const d = Store.getDealById(act.dealId);
    return d ? `<a href="#/deals/${d.id}" class="btn-link">Deal: ${d.title}</a>` : 'Deal (Deleted)';
  }
  if (act.leadId) {
    const l = Store.getLeadById(act.leadId);
    return l ? `Lead: ${l.name} (${l.company})` : 'Lead (Deleted)';
  }
  if (act.contactId) {
    const c = Store.getContactById(act.contactId);
    return c ? `Contact: ${c.name} (${c.company})` : 'Contact (Deleted)';
  }
  return 'None';
}

function getFollowUpTiming(dueAtStr, status) {
  if (!dueAtStr || status === 'completed' || status === 'cancelled') return null;
  const due = new Date(dueAtStr);
  const now = new Date();
  
  if (isNaN(due.getTime())) return null;

  if (due.getFullYear() === now.getFullYear() && 
      due.getMonth() === now.getMonth() && 
      due.getDate() === now.getDate()) {
    return 'today';
  }
  
  if (due < now) return 'overdue';
  return 'upcoming';
}

function getFilteredData() {
  const user = Auth.getCurrentUser();
  if (!user) return [];

  let activities = Store.getActivitiesForUser(user);

  // Apply search
  if (filters.search) {
    const term = filters.search.toLowerCase();
    activities = activities.filter(a => {
      const u = Store.getUserById(a.assignedTo || a.createdBy);
      const uName = u ? u.name.toLowerCase() : '';
      const c = (a.content || '').toLowerCase();
      let r = '';
      if (a.dealId) { const d = Store.getDealById(a.dealId); if(d) r = d.title.toLowerCase(); }
      else if (a.leadId) { const l = Store.getLeadById(a.leadId); if(l) r = l.name.toLowerCase() + ' ' + l.company.toLowerCase(); }
      else if (a.contactId) { const c = Store.getContactById(a.contactId); if(c) r = c.name.toLowerCase() + ' ' + c.company.toLowerCase(); }
      
      return c.includes(term) || uName.includes(term) || r.includes(term);
    });
  }

  // Apply type filter
  if (filters.type !== 'all') {
    activities = activities.filter(a => a.type === filters.type);
  }

  // Apply status filter
  if (filters.status !== 'all') {
    activities = activities.filter(a => {
      const s = a.status || 'completed'; // Old items without status act as completed
      return s === filters.status;
    });
  }

  // Apply owner filter
  if (filters.owner !== 'all') {
    activities = activities.filter(a => a.assignedTo === filters.owner || a.createdBy === filters.owner);
  }

  // Apply timing filter
  if (filters.timing !== 'all') {
    if (filters.timing === 'follow_ups_only') {
      activities = activities.filter(a => !!a.dueAt && a.status !== 'completed' && a.status !== 'cancelled');
    } else {
      activities = activities.filter(a => getFollowUpTiming(a.dueAt, a.status) === filters.timing);
    }
  }

  // Sort by dueAt if present, then createdAt descending
  return activities.sort((a, b) => {
    if (a.dueAt && b.dueAt) return new Date(a.dueAt) - new Date(b.dueAt);
    if (a.dueAt) return -1;
    if (b.dueAt) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}

// ── Components ────────────────────────────────────────────────

function buildKPIs(activities) {
  const total = activities.length;
  const followUps = activities.filter(a => !!a.dueAt && a.status !== 'completed' && a.status !== 'cancelled');
  
  let overdue = 0;
  let today = 0;
  
  followUps.forEach(f => {
    const timing = getFollowUpTiming(f.dueAt, f.status);
    if (timing === 'overdue') overdue++;
    if (timing === 'today') today++;
  });

  return `
    <div class="activity-kpi-grid">
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-card-label">Total Selected</div>
          <div class="stat-card-value">${total}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-card-label">Open Follow-ups</div>
          <div class="stat-card-value">${followUps.length}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-card-label" style="color: var(--color-warning);">Due Today</div>
          <div class="stat-card-value">${today}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-card-label" style="color: var(--color-error);">Overdue</div>
          <div class="stat-card-value">${overdue}</div>
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

  const typeOptions = ACTIVITY_TYPES.map(t => 
    `<option value="${t.key}" ${filters.type === t.key ? 'selected' : ''}>${t.label}</option>`
  ).join('');

  return `
    <div class="filter-bar">
      <div style="flex: 1;">
        <input type="text" id="act-search" class="login-input" placeholder="Search activities..." value="${filters.search}">
      </div>
      <div>
        <select id="act-type" class="login-input" style="padding-right:32px;">
          <option value="all">All Types</option>
          ${typeOptions}
        </select>
      </div>
      <div>
        <select id="act-status" class="login-input" style="padding-right:32px;">
          <option value="all">All Statuses</option>
          <option value="open" ${filters.status === 'open' ? 'selected' : ''}>Open</option>
          <option value="completed" ${filters.status === 'completed' ? 'selected' : ''}>Completed</option>
          <option value="cancelled" ${filters.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </div>
      <div>
        <select id="act-timing" class="login-input" style="padding-right:32px;">
          <option value="all">Any Timing</option>
          <option value="follow_ups_only" ${filters.timing === 'follow_ups_only' ? 'selected' : ''}>All Follow-ups</option>
          <option value="overdue" ${filters.timing === 'overdue' ? 'selected' : ''}>Overdue</option>
          <option value="today" ${filters.timing === 'today' ? 'selected' : ''}>Due Today</option>
          <option value="upcoming" ${filters.timing === 'upcoming' ? 'selected' : ''}>Upcoming</option>
        </select>
      </div>
      <div>
        <select id="act-owner" class="login-input" style="padding-right:32px;">
          ${ownerOptions}
        </select>
      </div>
      <button class="btn btn-secondary" id="btn-act-clear">Clear</button>
    </div>
  `;
}

function buildFollowUpCard(f, user) {
  const typeObj = ACTIVITY_TYPES.find(t => t.key === f.type);
  const typeLabel = typeObj ? typeObj.label : f.type;
  const owner = Store.getUserById(f.assignedTo || f.createdBy);
  const ownerName = owner ? owner.name : 'Unknown';
  
  const canEdit = Store.canUserEditActivity(f, user);
  const completeBtn = canEdit 
    ? `<button class="btn btn-sm" data-action="complete-act" data-id="${f.id}" style="padding:0.25rem 0.5rem; font-size:0.75rem;">Mark Complete</button>` 
    : '';

  return `
    <div class="followup-item">
      <div class="followup-item-header">
        <span class="badge badge-neutral">${typeLabel}</span>
        <span style="font-size:0.75rem; color:var(--color-muted);">${formatDateTime(f.dueAt)}</span>
      </div>
      <div style="font-weight:600; margin: 4px 0;">${f.content}</div>
      <div style="color:var(--color-muted); font-size:0.75rem;">
        Owner: ${ownerName}<br>
        Record: ${getLinkedRecordLabel(f)}
      </div>
      <div style="margin-top:8px; text-align:right;">
        ${completeBtn}
      </div>
    </div>
  `;
}

function buildFollowUpBoard(activities, user) {
  const followUps = activities.filter(a => !!a.dueAt && a.status !== 'completed' && a.status !== 'cancelled');
  
  const overdue = [];
  const today = [];
  const upcoming = [];

  followUps.forEach(f => {
    const timing = getFollowUpTiming(f.dueAt, f.status);
    if (timing === 'overdue') overdue.push(f);
    else if (timing === 'today') today.push(f);
    else upcoming.push(f);
  });

  return `
    <div class="followup-board">
      <div class="followup-column">
        <div class="followup-column-header">
          <span style="color: var(--color-error);">Overdue</span>
          <span class="badge badge-neutral">${overdue.length}</span>
        </div>
        ${overdue.map(f => buildFollowUpCard(f, user)).join('') || '<div style="color:var(--color-muted); font-size:0.8rem; text-align:center;">No overdue tasks</div>'}
      </div>
      <div class="followup-column">
        <div class="followup-column-header">
          <span style="color: var(--color-warning);">Due Today</span>
          <span class="badge badge-neutral">${today.length}</span>
        </div>
        ${today.map(f => buildFollowUpCard(f, user)).join('') || '<div style="color:var(--color-muted); font-size:0.8rem; text-align:center;">No tasks due today</div>'}
      </div>
      <div class="followup-column">
        <div class="followup-column-header">
          <span style="color: var(--color-primary);">Upcoming</span>
          <span class="badge badge-neutral">${upcoming.length}</span>
        </div>
        ${upcoming.map(f => buildFollowUpCard(f, user)).join('') || '<div style="color:var(--color-muted); font-size:0.8rem; text-align:center;">No upcoming tasks</div>'}
      </div>
    </div>
  `;
}

function buildActivityTable(activities, user) {
  const rows = activities.map(a => {
    const typeObj = ACTIVITY_TYPES.find(t => t.key === a.type);
    const typeLabel = typeObj ? typeObj.label : a.type;
    const s = a.status || 'completed';
    const sClass = `activity-status-${s}`;
    const owner = Store.getUserById(a.assignedTo || a.createdBy);
    const ownerName = owner ? owner.name : 'Unknown';

    const canEdit = Store.canUserEditActivity(a, user);
    const canDelete = user.role === 'manager';

    let actions = '';
    if (canEdit) {
      actions += `<button class="btn btn-sm btn-secondary" data-action="edit-act" data-id="${a.id}" style="margin-right:4px;">Edit</button>`;
      if (s === 'open') {
        actions += `<button class="btn btn-sm" data-action="complete-act" data-id="${a.id}" style="margin-right:4px;">Complete</button>`;
      }
    }
    if (canDelete) {
      actions += `<button class="btn btn-sm" style="background:var(--color-error); color:white;" data-action="delete-act" data-id="${a.id}">Delete</button>`;
    }

    return `
      <tr>
        <td>${typeLabel}</td>
        <td>${getLinkedRecordLabel(a)}</td>
        <td style="max-width:300px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${a.content}">${a.content}</td>
        <td>${ownerName}</td>
        <td class="${sClass}">${getStatusLabel(s)}</td>
        <td>${a.dueAt ? formatDateTime(a.dueAt) : '—'}</td>
        <td>${formatDateTime(a.createdAt)}</td>
        <td style="text-align:right;">${actions}</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="card" style="overflow-x:auto;">
      <table class="data-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Linked To</th>
            <th>Content</th>
            <th>Owner</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Created</th>
            <th style="text-align:right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${rows || '<tr><td colspan="8" style="text-align:center;">No activities found</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
}

// ── Modal ─────────────────────────────────────────────────────

function renderActivityModal(actId = null, defaults = {}) {
  const user = Auth.getCurrentUser();
  if (!user) return;

  let act = {
    type: defaults.type || 'follow_up',
    status: defaults.status || 'open',
    content: defaults.content || '',
    outcome: defaults.outcome || '',
    assignedTo: defaults.assignedTo || user.id,
    dueAt: defaults.dueAt || '',
    linkedType: defaults.linkedType || 'none',
    linkedId: defaults.linkedId || ''
  };

  if (actId) {
    const existing = Store.getActivityById(actId);
    if (!existing || !Store.canUserEditActivity(existing, user)) {
      Toast.error('Error', 'Activity not found or permission denied.');
      return;
    }
    act = { ...existing };
    if (act.dealId) { act.linkedType = 'deal'; act.linkedId = act.dealId; }
    else if (act.leadId) { act.linkedType = 'lead'; act.linkedId = act.leadId; }
    else if (act.contactId) { act.linkedType = 'contact'; act.linkedId = act.contactId; }
    else { act.linkedType = 'none'; act.linkedId = ''; }
    
    if (act.dueAt) act.dueAt = act.dueAt.slice(0, 16); // format for datetime-local
  }

  // Build Owner Options
  let ownerOptions = '';
  if (user.role === 'manager') {
    ownerOptions = Store.getUsers().map(u => `<option value="${u.id}" ${u.id === act.assignedTo ? 'selected' : ''}>${u.name}</option>`).join('');
  } else if (user.role === 'team_lead') {
    const teamUsers = Store.getUsersByTeam(user.teamId).filter(u => u.id !== user.id);
    teamUsers.push(user);
    ownerOptions = teamUsers.map(u => `<option value="${u.id}" ${u.id === act.assignedTo ? 'selected' : ''}>${u.name}</option>`).join('');
  } else {
    ownerOptions = `<option value="${user.id}" selected>${user.name}</option>`;
  }

  // Base Modal HTML
  const modalHtml = `
    <div class="modal" id="activity-modal">
      <div class="modal-content" style="max-width: 600px;">
        <div class="modal-header">
          <h2 class="modal-title">${actId ? 'Edit Activity' : 'New Activity'}</h2>
          <button class="modal-close" id="btn-close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <div style="display:flex; gap:1rem; margin-bottom:1rem;">
            <div style="flex:1;">
              <label class="login-label">Type</label>
              <select id="modal-act-type" class="login-input">
                ${ACTIVITY_TYPES.map(t => `<option value="${t.key}" ${act.type === t.key ? 'selected' : ''}>${t.label}</option>`).join('')}
              </select>
            </div>
            <div style="flex:1;">
              <label class="login-label">Status</label>
              <select id="modal-act-status" class="login-input">
                <option value="open" ${act.status === 'open' ? 'selected' : ''}>Open</option>
                <option value="completed" ${act.status === 'completed' ? 'selected' : ''}>Completed</option>
                <option value="cancelled" ${act.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
              </select>
            </div>
          </div>

          <div style="display:flex; gap:1rem; margin-bottom:1rem;">
            <div style="flex:1;">
              <label class="login-label">Linked Record Type</label>
              <select id="modal-linked-type" class="login-input">
                <option value="none" ${act.linkedType === 'none' ? 'selected' : ''}>None</option>
                <option value="deal" ${act.linkedType === 'deal' ? 'selected' : ''}>Deal</option>
                <option value="lead" ${act.linkedType === 'lead' ? 'selected' : ''}>Lead</option>
                <option value="contact" ${act.linkedType === 'contact' ? 'selected' : ''}>Contact</option>
              </select>
            </div>
            <div style="flex:1;">
              <label class="login-label">Linked Record</label>
              <select id="modal-linked-id" class="login-input" ${act.linkedType === 'none' ? 'disabled' : ''}>
                <!-- Populated dynamically -->
              </select>
            </div>
          </div>

          <div style="display:flex; gap:1rem; margin-bottom:1rem;">
            <div style="flex:1;">
              <label class="login-label">Assigned To</label>
              <select id="modal-assigned-to" class="login-input" ${user.role === 'employee' ? 'disabled' : ''}>
                ${ownerOptions}
              </select>
            </div>
            <div style="flex:1;">
              <label class="login-label">Due Date & Time (Optional)</label>
              <input type="datetime-local" id="modal-due-at" class="login-input" value="${act.dueAt || ''}">
            </div>
          </div>

          <div style="margin-bottom:1rem;">
            <label class="login-label">Content / Description <span style="color:red;">*</span></label>
            <textarea id="modal-content" class="login-input" style="height: 80px;" required>${act.content}</textarea>
          </div>

          <div style="margin-bottom:1rem;">
            <label class="login-label">Outcome (Optional)</label>
            <input type="text" id="modal-outcome" class="login-input" value="${act.outcome || ''}" placeholder="E.g., Left voicemail, meeting successful">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="btn-cancel-modal">Cancel</button>
          <button class="btn btn-primary" id="btn-save-activity" data-id="${actId || ''}">Save</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  
  // Populate linked records dropdown initially
  populateLinkedRecords(act.linkedType, act.linkedId, user);

  // Bind linked type change
  document.getElementById('modal-linked-type').addEventListener('change', (e) => {
    populateLinkedRecords(e.target.value, null, user);
  });

  // Bind close/cancel
  document.getElementById('btn-close-modal').addEventListener('click', closeActivityModal);
  document.getElementById('btn-cancel-modal').addEventListener('click', closeActivityModal);

  // Bind save
  document.getElementById('btn-save-activity').addEventListener('click', () => saveActivity(actId, user));
}

function populateLinkedRecords(type, selectedId, user) {
  const select = document.getElementById('modal-linked-id');
  if (!select) return;

  if (type === 'none') {
    select.innerHTML = '<option value="">-- None --</option>';
    select.disabled = true;
    return;
  }

  select.disabled = false;
  let options = [];

  if (type === 'deal') {
    options = Store.getDealsForUser(user).map(d => `<option value="${d.id}" ${d.id === selectedId ? 'selected' : ''}>${d.title}</option>`);
  } else if (type === 'lead') {
    options = Store.getLeadsForUser(user).map(l => `<option value="${l.id}" ${l.id === selectedId ? 'selected' : ''}>${l.name} (${l.company})</option>`);
  } else if (type === 'contact') {
    options = Store.getContacts().map(c => `<option value="${c.id}" ${c.id === selectedId ? 'selected' : ''}>${c.name} (${c.company})</option>`);
  }

  select.innerHTML = options.length ? options.join('') : '<option value="">-- No records available --</option>';
}

function closeActivityModal() {
  const modal = document.getElementById('activity-modal');
  if (modal) modal.remove();
}

function saveActivity(actId, user) {
  const type = document.getElementById('modal-act-type').value;
  const status = document.getElementById('modal-act-status').value;
  const linkedType = document.getElementById('modal-linked-type').value;
  const linkedId = document.getElementById('modal-linked-id').value;
  let assignedTo = document.getElementById('modal-assigned-to').value;
  const dueAt = document.getElementById('modal-due-at').value;
  const content = document.getElementById('modal-content').value.trim();
  const outcome = document.getElementById('modal-outcome').value.trim();

  if (!content) {
    Toast.error('Validation Error', 'Content is required.');
    return;
  }

  if (!ACTIVITY_TYPES.some(t => t.key === type)) return Toast.error('Validation Error', 'Invalid activity type.');
  if (!['open', 'completed', 'cancelled'].includes(status)) return Toast.error('Validation Error', 'Invalid status.');
  if (!['none', 'deal', 'lead', 'contact'].includes(linkedType)) return Toast.error('Validation Error', 'Invalid linked type.');

  if (linkedType !== 'none' && !linkedId) {
    return Toast.error('Validation Error', 'Please select a valid linked record or set type to None.');
  }

  let dealTeamId = null;

  if (linkedType === 'deal') {
    const deal = Store.getDealById(linkedId);
    if (!deal) return Toast.error('Validation Error', 'Selected Deal does not exist.');
    if (!Auth.canViewRecord(deal)) return Toast.error('Validation Error', 'Permission denied for this Deal.');
    dealTeamId = deal.teamId;
  } else if (linkedType === 'lead') {
    const lead = Store.getLeadById(linkedId);
    if (!lead) return Toast.error('Validation Error', 'Selected Lead does not exist.');
    if (!Auth.canViewRecord(lead)) return Toast.error('Validation Error', 'Permission denied for this Lead.');
    const assignee = Store.getUserById(lead.assignedTo);
    if (assignee) dealTeamId = assignee.teamId;
  } else if (linkedType === 'contact') {
    const contact = Store.getContactById(linkedId);
    if (!contact) return Toast.error('Validation Error', 'Selected Contact does not exist.');
  }

  // Security guard for assignment
  if (user.role === 'employee') {
    assignedTo = user.id;
  } else if (user.role === 'team_lead') {
    const target = Store.getUserById(assignedTo);
    if (!target || (target.teamId !== user.teamId && target.id !== user.id)) {
      return Toast.error('Validation Error', 'Cannot assign outside your team.');
    }
  }

  const assignedUser = Store.getUserById(assignedTo);
  if (!assignedUser) {
    return Toast.error('Validation Error', 'Assigned user does not exist.');
  }

  let finalTeamId = null;
  if (assignedUser.teamId) {
    finalTeamId = assignedUser.teamId;
  } else if (dealTeamId) {
    finalTeamId = dealTeamId;
  } else {
    finalTeamId = user.teamId || null;
  }

  let normalizedDueAt = null;
  if (dueAt) {
    const d = new Date(dueAt);
    if (isNaN(d.getTime())) {
      return Toast.error('Validation Error', 'Invalid Due Date.');
    }
    normalizedDueAt = d.toISOString();
  }

  const payload = {
    type,
    status,
    content,
    outcome,
    assignedTo,
    teamId: finalTeamId,
    dealId: linkedType === 'deal' ? linkedId : null,
    leadId: linkedType === 'lead' ? linkedId : null,
    contactId: linkedType === 'contact' ? linkedId : null,
    dueAt: normalizedDueAt,
    updatedAt: new Date().toISOString()
  };

  if (actId) {
    const existing = Store.getActivityById(actId);
    if (!existing || !Store.canUserEditActivity(existing, user)) {
      Toast.error('Error', 'Permission denied.');
      return;
    }
    
    if (status === 'completed' && existing.status !== 'completed') {
      payload.completedAt = new Date().toISOString();
    } else if (status !== 'completed') {
      payload.completedAt = null;
    }
    
    Store.updateActivity(actId, payload);
    Toast.success('Saved', 'Activity updated successfully.');
  } else {
    payload.id = 'act_' + Date.now().toString(36);
    payload.createdBy = user.id;
    payload.createdAt = new Date().toISOString();
    if (status === 'completed') payload.completedAt = payload.createdAt;
    
    Store.createActivity(payload);
    Toast.success('Created', 'Activity logged successfully.');
  }

  closeActivityModal();
  reRender();
}

// ── Main Page Render ──────────────────────────────────────────

export function renderActivities() {
  const user = Auth.getCurrentUser();
  if (!user) return '';

  const activities = getFilteredData();

  return `
    <div class="content-inner">
      <div class="page-header">
        <div>
          <h1 class="page-header-title">Activities & Follow-ups</h1>
          <p class="page-header-subtitle">Track calls, emails, meetings, notes, outreach, and follow-ups.</p>
        </div>
        <button class="btn btn-primary" id="btn-new-activity">New Activity</button>
      </div>

      ${buildKPIs(activities)}
      ${buildFilters(user)}

      <div class="dashboard-section">
        <h4 class="dashboard-section-title">Follow-up Focus</h4>
        ${buildFollowUpBoard(activities, user)}
      </div>

      <div class="dashboard-section">
        <h4 class="dashboard-section-title">Activity Log</h4>
        ${buildActivityTable(activities, user)}
      </div>
    </div>
  `;
}

function reRender() {
  const contentEl = document.getElementById('content-area');
  if (contentEl) {
    contentEl.innerHTML = renderActivities();
  }
}

// ── Events ────────────────────────────────────────────────────

export function bindActivitiesEvents() {
  const content = document.getElementById('content-area');
  if (!content) return;

  content.addEventListener('click', (e) => {
    // New Activity
    if (e.target.id === 'btn-new-activity') {
      renderActivityModal();
      return;
    }

    // Clear filters
    if (e.target.id === 'btn-act-clear') {
      filters = { search: '', type: 'all', status: 'all', timing: 'all', owner: 'all' };
      reRender();
      return;
    }

    const action = e.target.dataset.action;
    const actId = e.target.dataset.id;
    const user = Auth.getCurrentUser();

    if (action === 'edit-act') {
      renderActivityModal(actId);
    } else if (action === 'complete-act') {
      if (!user) return Toast.error('Error', 'Not logged in.');
      const act = Store.getActivityById(actId);
      if (!act) return Toast.error('Error', 'Activity not found.');
      if (!Store.canUserEditActivity(act, user)) return Toast.error('Error', 'Permission denied.');

      Store.updateActivity(actId, { 
        status: 'completed', 
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      Toast.success('Completed', 'Activity marked as complete.');
      reRender();
    } else if (action === 'delete-act') {
      if (!user) return Toast.error('Error', 'Not logged in.');
      if (user.role !== 'manager') {
        Toast.error('Denied', 'Only managers can delete activities.');
        return;
      }
      const act = Store.getActivityById(actId);
      if (!act) return Toast.error('Error', 'Activity not found.');
      
      if (confirm('Are you sure you want to delete this activity?')) {
        const success = Store.deleteActivity(actId);
        if (success) {
          Toast.success('Deleted', 'Activity removed.');
        } else {
          Toast.error('Error', 'Failed to delete activity.');
        }
        reRender();
      }
    }
  });

  content.addEventListener('change', (e) => {
    if (['act-search', 'act-type', 'act-status', 'act-timing', 'act-owner'].includes(e.target.id)) {
      filters.search = document.getElementById('act-search').value;
      filters.type = document.getElementById('act-type').value;
      filters.status = document.getElementById('act-status').value;
      filters.timing = document.getElementById('act-timing').value;
      filters.owner = document.getElementById('act-owner').value;
      reRender();
    }
  });

  content.addEventListener('keyup', (e) => {
    if (e.target.id === 'act-search') {
      filters.search = e.target.value;
      reRender();
    }
  });
}

// Export modal for external use (e.g. from deal-detail)
export { renderActivityModal };
