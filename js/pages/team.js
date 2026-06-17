// ============================================================
// TechnoEdge CRM — Team Management Page
// Role-scoped team visibility and guarded reassignment
// ============================================================

import { Store } from '../store.js';
import { Auth } from '../auth.js';
import { formatCurrency, generateId, capitalize } from '../utils.js';
import { Toast } from '../components/toast.js';

export function renderTeam() {
  if (!Auth.canAccessPage('team')) {
    return `<div class="content-inner"><h2>Access Denied</h2><p>You do not have permission to view this page.</p></div>`;
  }

  const user = Auth.getCurrentUser();
  const allTeams = Store.getTeams();
  const allUsers = Store.getUsers();
  const allLeads = Store.getLeads();
  const allDeals = Store.getDeals();
  
  let visibleTeams = [];
  let visibleUsers = [];
  
  if (user.role === 'manager') {
    visibleTeams = allTeams;
    visibleUsers = allUsers;
  } else if (user.role === 'team_lead') {
    visibleTeams = allTeams.filter(t => t.id === user.teamId);
    visibleUsers = Store.getUsersByTeam(user.teamId);
    if (!visibleUsers.find(u => u.id === user.id)) visibleUsers.push(user);
  }

  let teamsHtml = visibleTeams.map(team => {
    const tUsers = Store.getUsersByTeam(team.id);
    const tUserIds = tUsers.map(u => u.id);
    const tDeals = allDeals.filter(d => d.teamId === team.id || tUserIds.includes(d.assignedTo));
    const tLeads = allLeads.filter(l => tUserIds.includes(l.assignedTo));

    const pipelineValue = tDeals.reduce((sum, d) => sum + (d.value || 0), 0);
    const activeDeals = tDeals.filter(d => d.status === 'active').length;
    const openLeads = tLeads.filter(l => l.status === 'new' || l.status === 'contacted').length;

    const leadUser = allUsers.find(u => u.id === team.leadId);
    const leadName = leadUser ? leadUser.name : 'Unassigned';

    return `
      <div class="card" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
        <h3 style="margin: 0;">${team.name}</h3>
        <p style="margin: 0; color: var(--color-muted); font-size: 0.85rem;">Lead: ${leadName}</p>
        <div style="margin-top: 1rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div><strong style="display:block; font-size:1.2rem;">${tUsers.length}</strong> <span style="font-size:0.8rem; color:var(--color-muted);">Members</span></div>
          <div><strong style="display:block; font-size:1.2rem;">${formatCurrency(pipelineValue, 'INR')}</strong> <span style="font-size:0.8rem; color:var(--color-muted);">Pipeline</span></div>
          <div><strong style="display:block; font-size:1.2rem;">${activeDeals}</strong> <span style="font-size:0.8rem; color:var(--color-muted);">Active Deals</span></div>
          <div><strong style="display:block; font-size:1.2rem;">${openLeads}</strong> <span style="font-size:0.8rem; color:var(--color-muted);">Open Leads</span></div>
        </div>
      </div>
    `;
  }).join('');

  if (visibleTeams.length === 0) {
    teamsHtml = `<p>No teams available.</p>`;
  }

  let usersHtml = visibleUsers.map(u => {
    const uDeals = allDeals.filter(d => d.assignedTo === u.id);
    const uLeads = allLeads.filter(l => l.assignedTo === u.id);
    const uPipeline = uDeals.reduce((sum, d) => sum + (d.value || 0), 0);
    const uActiveDeals = uDeals.filter(d => d.status === 'active').length;
    const uOpenLeads = uLeads.length;

    const tName = u.teamId ? (allTeams.find(t => t.id === u.teamId)?.name || '—') : '—';

    return `
      <tr>
        <td style="font-weight: 500;">${u.name}</td>
        <td><span class="badge badge-neutral">${capitalize(u.role)}</span></td>
        <td style="font-size: 0.85rem;">${u.email}</td>
        <td style="font-size: 0.85rem;">${tName}</td>
        <td>${uOpenLeads}</td>
        <td>${uActiveDeals}</td>
        <td style="font-weight: 500;">${formatCurrency(uPipeline, 'INR')}</td>
      </tr>
    `;
  }).join('');

  if (visibleUsers.length === 0) {
    usersHtml = `<tr><td colspan="7" class="text-center" style="padding: 2rem;">No users found.</td></tr>`;
  }

  // Assignment Options
  const targetUserOptions = visibleUsers.map(u => `<option value="${u.id}">${u.name} (${capitalize(u.role)})</option>`).join('');
  
  // Reassignable records (Leads and Deals)
  const assignableLeads = Store.getLeadsForUser(user);
  const assignableDeals = Store.getDealsForUser(user);

  const leadOptions = assignableLeads.map(l => {
    const assigneeName = l.assignedTo ? (Store.getUserById(l.assignedTo)?.name || 'Unknown') : 'Unassigned';
    return `<option value="lead_${l.id}">${l.name} (${l.company}) — Curr: ${assigneeName}</option>`;
  }).join('');

  const dealOptions = assignableDeals.map(d => {
    const assigneeName = d.assignedTo ? (Store.getUserById(d.assignedTo)?.name || 'Unknown') : 'Unassigned';
    return `<option value="deal_${d.id}">${d.title} — Curr: ${assigneeName}</option>`;
  }).join('');

  return `
    <div class="content-inner">
      <div class="page-header">
        <div>
          <h1 class="page-header-title">Team Management</h1>
          <p class="page-header-subtitle">Manage teams, view performance, and reassign records.</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        ${teamsHtml}
      </div>

      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
        <div class="card">
          <div style="padding: 1.5rem; border-bottom: 1px solid var(--color-border);">
            <h3 style="margin: 0;">Team Members</h3>
          </div>
          <div style="overflow-x: auto;">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Team</th>
                  <th>Leads</th>
                  <th>Deals (Active)</th>
                  <th>Pipeline Value</th>
                </tr>
              </thead>
              <tbody>
                ${usersHtml}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div style="padding: 1.5rem; border-bottom: 1px solid var(--color-border);">
            <h3 style="margin: 0;">Record Reassignment</h3>
          </div>
          <div style="padding: 1.5rem;">
            <div style="margin-bottom: 1rem;">
              <label style="display:block; margin-bottom:0.5rem; font-weight:500;">Record Type</label>
              <select id="reassign-type" class="login-input">
                <option value="lead">Lead</option>
                <option value="deal">Deal</option>
              </select>
            </div>

            <div style="margin-bottom: 1rem;">
              <label style="display:block; margin-bottom:0.5rem; font-weight:500;">Select Record</label>
              <select id="reassign-record" class="login-input">
                <!-- Populated dynamically -->
              </select>
            </div>

            <div style="margin-bottom: 1.5rem;">
              <label style="display:block; margin-bottom:0.5rem; font-weight:500;">New Owner</label>
              <select id="reassign-target" class="login-input">
                <option value="">-- Select New Owner --</option>
                ${targetUserOptions}
              </select>
            </div>

            <button class="btn btn-primary" id="btn-reassign" style="width: 100%;">Reassign Record</button>
            <div id="reassign-data-leads" style="display:none;">${leadOptions}</div>
            <div id="reassign-data-deals" style="display:none;">${dealOptions}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function populateReassignRecordDropdown() {
  const typeSelect = document.getElementById('reassign-type');
  const recordSelect = document.getElementById('reassign-record');
  const leadsHtml = document.getElementById('reassign-data-leads');
  const dealsHtml = document.getElementById('reassign-data-deals');

  if (!typeSelect || !recordSelect || !leadsHtml || !dealsHtml) return;

  if (typeSelect.value === 'lead') {
    recordSelect.innerHTML = leadsHtml.innerHTML;
  } else {
    recordSelect.innerHTML = dealsHtml.innerHTML;
  }
}

export function bindTeamEvents() {
  const content = document.getElementById('content-area');
  if (!content) return;

  // Type change for reassignment dropdown
  content.addEventListener('change', (e) => {
    if (e.target.id === 'reassign-type') {
      populateReassignRecordDropdown();
    }
  });

  // Reassign click
  content.addEventListener('click', (e) => {
    if (e.target.id === 'btn-reassign') {
      handleReassignment();
    }
  });

  // Trigger initial population
  setTimeout(() => {
    populateReassignRecordDropdown();
  }, 0);
}

function handleReassignment() {
  const user = Auth.getCurrentUser();
  if (!user || user.role === 'employee') {
    Toast.error('Permission Denied', 'You do not have permission to reassign records.');
    return;
  }

  const type = document.getElementById('reassign-type').value;
  const recordVal = document.getElementById('reassign-record').value;
  const targetUserId = document.getElementById('reassign-target').value;

  if (!recordVal) {
    Toast.error('Validation Error', 'Please select a record to reassign.');
    return;
  }

  if (!targetUserId) {
    Toast.error('Validation Error', 'Please select a new owner.');
    return;
  }

  const targetUser = Store.getUserById(targetUserId);
  if (!targetUser) {
    Toast.error('Validation Error', 'Invalid target user.');
    return;
  }

  // Re-check target permission (TL can only assign to own team)
  if (!Auth.canAssignTo(targetUserId)) {
    Toast.error('Permission Denied', 'You can only reassign to your own team members.');
    return;
  }

  if (type === 'lead') {
    const leadId = recordVal.replace('lead_', '');
    const lead = Store.getLeadById(leadId);
    
    if (!lead) {
      Toast.error('Error', 'Lead not found.');
      return;
    }
    
    // Check if user has permission to edit this lead
    if (!Auth.canEditRecord(lead)) {
      Toast.error('Permission Denied', 'You do not have permission to reassign this lead.');
      return;
    }

    Store.updateLead(leadId, {
      assignedTo: targetUserId,
      updatedAt: new Date().toISOString()
    });

    Toast.success('Success', `Lead reassigned to ${targetUser.name}`);

  } else if (type === 'deal') {
    const dealId = recordVal.replace('deal_', '');
    const deal = Store.getDealById(dealId);
    
    if (!deal) {
      Toast.error('Error', 'Deal not found.');
      return;
    }

    // Check if user has permission to edit this deal
    if (!Auth.canEditRecord(deal)) {
      Toast.error('Permission Denied', 'You do not have permission to reassign this deal.');
      return;
    }

    const oldAssignee = deal.assignedTo ? Store.getUserById(deal.assignedTo)?.name || 'Unknown' : 'Unassigned';

    Store.updateDeal(dealId, {
      assignedTo: targetUserId,
      teamId: targetUser.teamId || null,
      updatedAt: new Date().toISOString()
    });

    Store.createActivity({
      id: generateId(),
      dealId: dealId,
      type: 'assignment',
      content: `Deal reassigned from ${oldAssignee} to ${targetUser.name}`,
      createdBy: user.id,
      createdAt: new Date().toISOString()
    });

    Toast.success('Success', `Deal reassigned to ${targetUser.name}`);
  }

  // Refresh page
  const contentEl = document.getElementById('content-area');
  if (contentEl) {
    contentEl.innerHTML = renderTeam();
    populateReassignRecordDropdown();
  }
}
