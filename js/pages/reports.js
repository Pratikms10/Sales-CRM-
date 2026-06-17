// ============================================================
// TechnoEdge CRM — Reports & Analytics Page
// Manager-only reports with team/status filters
// ============================================================

import { Store } from '../store.js';
import { Auth } from '../auth.js';
import { formatCurrency, capitalize, formatDate, formatDateTime, timeAgo, SOP_STAGES } from '../utils.js';

// ── Stage Probability Map (forecast weighting) ──────────────

const STAGE_PROBABILITY = {
  sales: 20,
  requirement: 35,
  sourcing: 50,
  delivery: 70,
  feedback: 80,
  invoice: 90,
  renewal: 60
};

function getStageProbability(stageKey) {
  return STAGE_PROBABILITY[stageKey] || 0;
}

function calculateForecast(deals) {
  return deals
    .filter(d => d.status === 'active')
    .reduce((sum, d) => sum + (d.value || 0) * getStageProbability(d.stage) / 100, 0);
}

function daysSince(dateStr) {
  if (!dateStr) return 999;
  const now = new Date();
  const then = new Date(dateStr);
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

// ── Current Filter State ────────────────────────────────────

let reportFilters = {
  teamId: '',
  dealStatus: ''
};

// ── Filtered Data Helper ────────────────────────────────────

function getFilteredReportData() {
  let leads = Store.getLeads();
  let deals = Store.getDeals();
  const allUsers = Store.getUsers();
  const allTeams = Store.getTeams();

  // Validate teamId against Store
  if (reportFilters.teamId) {
    const validTeam = allTeams.find(t => t.id === reportFilters.teamId);
    if (!validTeam) reportFilters.teamId = '';
  }

  // Team filter
  if (reportFilters.teamId) {
    const teamUsers = Store.getUsersByTeam(reportFilters.teamId);
    const teamUserIds = teamUsers.map(u => u.id);

    leads = leads.filter(l => teamUserIds.includes(l.assignedTo));
    deals = deals.filter(d => d.teamId === reportFilters.teamId || teamUserIds.includes(d.assignedTo));
  }

  // Deal status filter
  if (reportFilters.dealStatus) {
    deals = deals.filter(d => d.status === reportFilters.dealStatus);
  }

  return { leads, deals, allUsers, allTeams };
}

// ── Main Render ─────────────────────────────────────────────

export function renderReports() {
  if (!Auth.canAccessPage('reports')) {
    return `
      <div class="content-inner">
        <div class="coming-soon">
          <div class="coming-soon-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>
          <h3 class="coming-soon-title">Access Denied</h3>
          <p class="coming-soon-desc">You do not have permission to view Reports. This section is available to Managers only.</p>
        </div>
      </div>
    `;
  }

  const allTeams = Store.getTeams();
  const { leads, deals } = getFilteredReportData();

  const teamOptions = allTeams.map(t =>
    `<option value="${t.id}" ${reportFilters.teamId === t.id ? 'selected' : ''}>${t.name}</option>`
  ).join('');

  return `
    <div class="content-inner">
      <div class="page-header">
        <div>
          <h1 class="page-header-title">Reports & Analytics</h1>
          <p class="page-header-subtitle">Organization-wide performance metrics and pipeline intelligence.</p>
        </div>
      </div>

      <div class="card" style="margin-bottom: var(--space-lg);">
        <div class="filter-bar" style="display:flex; gap:1rem; padding:1rem; border-bottom:1px solid var(--color-border); flex-wrap:wrap; align-items:center;">
          <select class="login-input" id="report-filter-team" style="max-width:180px;">
            <option value="">All Teams</option>
            ${teamOptions}
          </select>
          <select class="login-input" id="report-filter-status" style="max-width:150px;">
            <option value="">All Deals</option>
            <option value="active" ${reportFilters.dealStatus === 'active' ? 'selected' : ''}>Active</option>
            <option value="won" ${reportFilters.dealStatus === 'won' ? 'selected' : ''}>Won</option>
            <option value="lost" ${reportFilters.dealStatus === 'lost' ? 'selected' : ''}>Lost</option>
          </select>
          <button class="btn btn-secondary btn-sm" id="btn-clear-report-filters">Clear</button>
        </div>
      </div>

      ${buildKpiCards(leads, deals)}

      ${buildPipelineReport(deals)}

      <div class="report-grid report-grid-2" style="margin-bottom: var(--space-xl);">
        ${buildDistributionReport(leads, 'status', 'Leads by Status')}
        ${buildDistributionReport(leads, 'source', 'Leads by Source')}
      </div>

      ${buildTeamPerformance()}

      ${buildEmployeePerformance()}

      ${buildStuckDeals()}

      ${buildRecentActivity()}
    </div>
  `;
}

// ── KPI Cards ───────────────────────────────────────────────

function buildKpiCards(leads, deals) {
  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(l => l.status === 'qualified').length;
  const convertedLeads = leads.filter(l => l.status === 'converted').length;

  const activeDeals = deals.filter(d => d.status === 'active');
  const activeDealCount = activeDeals.length;
  const openPipeline = activeDeals.reduce((s, d) => s + (d.value || 0), 0);
  const wonRevenue = deals.filter(d => d.status === 'won').reduce((s, d) => s + (d.value || 0), 0);
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0.0';
  const forecastRevenue = calculateForecast(deals);

  const kpis = [
    { label: 'Total Leads',         value: totalLeads,                    color: 'var(--color-stage-sales)',       bg: 'var(--color-primary-disabled)' },
    { label: 'Qualified Leads',     value: qualifiedLeads,                color: 'var(--color-stage-sourcing)',    bg: 'var(--color-info-soft)' },
    { label: 'Converted Leads',     value: convertedLeads,                color: 'var(--color-success)',           bg: 'var(--color-success-soft)' },
    { label: 'Active Deals',        value: activeDealCount,               color: 'var(--color-stage-delivery)',    bg: 'var(--color-warning-soft)' },
    { label: 'Open Pipeline',       value: formatCurrency(openPipeline),  color: 'var(--color-stage-feedback)',    bg: '#f3e8ff' },
    { label: 'Won Revenue',         value: formatCurrency(wonRevenue),    color: 'var(--color-success)',           bg: 'var(--color-success-soft)' },
    { label: 'Lead Conversion Rate',value: conversionRate + '%',          color: 'var(--color-stage-invoice)',     bg: 'var(--color-info-soft)' },
    { label: 'Forecast Revenue',    value: formatCurrency(forecastRevenue),color:'var(--color-stage-renewal)',     bg: 'var(--color-primary-disabled)' }
  ];

  const cardsHtml = kpis.map(k => `
    <div class="stat-card">
      <div class="stat-card-icon" style="background:${k.bg}; color:${k.color};">
        <span style="font-size:1.2rem; font-weight:700;">${typeof k.value === 'number' ? '#' : '₹'}</span>
      </div>
      <div class="stat-card-content">
        <div class="stat-card-label">${k.label}</div>
        <div class="stat-card-value">${k.value}</div>
      </div>
    </div>
  `).join('');

  return `<div class="stat-cards" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));">${cardsHtml}</div>`;
}

// ── Pipeline Stage Report ───────────────────────────────────

function buildPipelineReport(deals) {
  const activeDeals = deals.filter(d => d.status === 'active');
  const maxVal = Math.max(...SOP_STAGES.map(s =>
    activeDeals.filter(d => d.stage === s.key).reduce((sum, d) => sum + (d.value || 0), 0)
  ), 1);

  const rows = SOP_STAGES.map(s => {
    const stageDeals = activeDeals.filter(d => d.stage === s.key);
    const count = stageDeals.length;
    const total = stageDeals.reduce((sum, d) => sum + (d.value || 0), 0);
    const forecast = total * getStageProbability(s.key) / 100;
    const pct = maxVal > 0 ? (total / maxVal * 100) : 0;

    return `
      <div class="report-metric-row">
        <div class="report-metric-label">
          <span class="stage-badge stage-badge-${s.key}" style="margin-right: 0.5rem;">${s.label}</span>
        </div>
        <div class="report-metric-stats">
          <span>${count} deal${count !== 1 ? 's' : ''}</span>
          <span>${formatCurrency(total)}</span>
          <span style="color:var(--color-muted)">Fcst: ${formatCurrency(forecast)}</span>
        </div>
        <div class="report-bar">
          <div class="report-bar-fill" style="width:${pct}%; background:${s.color};"></div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="report-card card" style="margin-bottom: var(--space-xl);">
      <div style="padding:1.5rem; border-bottom:1px solid var(--color-hairline-soft);">
        <h3 style="margin:0;">Pipeline by SOP Stage</h3>
      </div>
      <div style="padding:1.5rem;">
        ${rows}
      </div>
    </div>
  `;
}

// ── Distribution Report (Leads by Status / Source) ──────────

function buildDistributionReport(leads, field, title) {
  const counts = {};
  leads.forEach(l => {
    const val = l[field] || 'Unknown';
    counts[val] = (counts[val] || 0) + 1;
  });

  const total = leads.length || 1;
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const maxCount = entries.length > 0 ? entries[0][1] : 1;

  const COLORS = ['var(--color-stage-sales)', 'var(--color-stage-requirement)', 'var(--color-stage-sourcing)', 'var(--color-stage-delivery)', 'var(--color-stage-feedback)', 'var(--color-stage-invoice)', 'var(--color-stage-renewal)', 'var(--color-primary)'];

  const rows = entries.map(([label, count], i) => {
    const pct = ((count / total) * 100).toFixed(1);
    const barPct = (count / maxCount) * 100;
    const color = COLORS[i % COLORS.length];
    return `
      <div class="report-metric-row">
        <div class="report-metric-label"><span>${capitalize(label)}</span></div>
        <div class="report-metric-stats">
          <span>${count}</span>
          <span style="color:var(--color-muted);">${pct}%</span>
        </div>
        <div class="report-bar">
          <div class="report-bar-fill" style="width:${barPct}%; background:${color};"></div>
        </div>
      </div>
    `;
  }).join('');

  const emptyHtml = entries.length === 0 ? `<p style="color:var(--color-muted); text-align:center; padding:1rem;">No data.</p>` : '';

  return `
    <div class="report-card card">
      <div style="padding:1.5rem; border-bottom:1px solid var(--color-hairline-soft);">
        <h3 style="margin:0;">${title}</h3>
      </div>
      <div style="padding:1.5rem;">
        ${rows}
        ${emptyHtml}
      </div>
    </div>
  `;
}

// ── Team Performance ────────────────────────────────────────

function buildTeamPerformance() {
  const { deals, leads, allTeams, allUsers } = getFilteredReportData();

  let teams = allTeams;
  if (reportFilters.teamId) {
    teams = allTeams.filter(t => t.id === reportFilters.teamId);
  }

  const rows = teams.map(team => {
    const tUsers = Store.getUsersByTeam(team.id);
    const tUserIds = tUsers.map(u => u.id);
    const leadUser = allUsers.find(u => u.id === team.leadId);

    const tDeals = deals.filter(d => d.teamId === team.id || tUserIds.includes(d.assignedTo));
    const tLeads = leads.filter(l => tUserIds.includes(l.assignedTo));

    const openLeads = tLeads.filter(l => l.status === 'new' || l.status === 'contacted').length;
    const activeDeals = tDeals.filter(d => d.status === 'active');
    const pipelineValue = activeDeals.reduce((s, d) => s + (d.value || 0), 0);
    const wonDeals = tDeals.filter(d => d.status === 'won');
    const wonRevenue = wonDeals.reduce((s, d) => s + (d.value || 0), 0);
    const forecast = calculateForecast(tDeals);

    return `
      <tr>
        <td style="font-weight:500;">${team.name}</td>
        <td>${leadUser ? leadUser.name : '—'}</td>
        <td>${tUsers.length}</td>
        <td>${openLeads}</td>
        <td>${activeDeals.length}</td>
        <td style="font-weight:600;">${formatCurrency(pipelineValue)}</td>
        <td style="color:var(--color-success); font-weight:600;">${formatCurrency(wonRevenue)}</td>
        <td>${formatCurrency(forecast)}</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="report-card card" style="margin-bottom: var(--space-xl);">
      <div style="padding:1.5rem; border-bottom:1px solid var(--color-hairline-soft);">
        <h3 style="margin:0;">Team Performance</h3>
      </div>
      <div style="overflow-x:auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th>Team</th>
              <th>Team Lead</th>
              <th>Members</th>
              <th>Open Leads</th>
              <th>Active Deals</th>
              <th>Pipeline Value</th>
              <th>Won Revenue</th>
              <th>Forecast Revenue</th>
            </tr>
          </thead>
          <tbody>
            ${rows || '<tr><td colspan="8" style="text-align:center; padding:1.5rem; color:var(--color-muted);">No teams.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ── Employee Performance ────────────────────────────────────

function buildEmployeePerformance() {
  const { deals, leads, allUsers, allTeams } = getFilteredReportData();

  let users = allUsers.filter(u => u.role === 'team_lead' || u.role === 'employee');

  // Also include managers who own records
  const managerUsers = allUsers.filter(u => u.role === 'manager');
  managerUsers.forEach(m => {
    const hasRecords = deals.some(d => d.assignedTo === m.id) || leads.some(l => l.assignedTo === m.id);
    if (hasRecords && !users.find(u => u.id === m.id)) users.push(m);
  });

  if (reportFilters.teamId) {
    const teamUserIds = Store.getUsersByTeam(reportFilters.teamId).map(u => u.id);
    users = users.filter(u => teamUserIds.includes(u.id));
  }

  // Build performance data
  const perfData = users.map(u => {
    const uDeals = deals.filter(d => d.assignedTo === u.id);
    const uLeads = leads.filter(l => l.assignedTo === u.id);
    const openLeads = uLeads.filter(l => l.status === 'new' || l.status === 'contacted').length;
    const activeDeals = uDeals.filter(d => d.status === 'active');
    const pipelineValue = activeDeals.reduce((s, d) => s + (d.value || 0), 0);
    const wonDeals = uDeals.filter(d => d.status === 'won');
    const wonRevenue = wonDeals.reduce((s, d) => s + (d.value || 0), 0);
    const teamName = u.teamId ? (allTeams.find(t => t.id === u.teamId)?.name || '—') : '—';

    return { user: u, openLeads, activeDeals: activeDeals.length, pipelineValue, wonDeals: wonDeals.length, wonRevenue, teamName };
  });

  // Sort by pipeline value descending
  perfData.sort((a, b) => b.pipelineValue - a.pipelineValue);

  const rows = perfData.map(p => {
    const roleLabel = p.user.role === 'team_lead' ? 'Team Lead' : capitalize(p.user.role);
    return `
      <tr>
        <td style="font-weight:500;">${p.user.name}</td>
        <td><span class="badge badge-neutral">${roleLabel}</span></td>
        <td style="font-size:0.85rem;">${p.teamName}</td>
        <td>${p.openLeads}</td>
        <td>${p.activeDeals}</td>
        <td style="font-weight:600;">${formatCurrency(p.pipelineValue)}</td>
        <td>${p.wonDeals}</td>
        <td style="color:var(--color-success); font-weight:600;">${formatCurrency(p.wonRevenue)}</td>
      </tr>
    `;
  }).join('');

  const emptyRow = perfData.length === 0 ? '<tr><td colspan="8" style="text-align:center; padding:1.5rem; color:var(--color-muted);">No employees found.</td></tr>' : '';

  return `
    <div class="report-card card" style="margin-bottom: var(--space-xl);">
      <div style="padding:1.5rem; border-bottom:1px solid var(--color-hairline-soft);">
        <h3 style="margin:0;">Employee Performance</h3>
      </div>
      <div style="overflow-x:auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Role</th>
              <th>Team</th>
              <th>Open Leads</th>
              <th>Active Deals</th>
              <th>Pipeline Value</th>
              <th>Won Deals</th>
              <th>Won Revenue</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
            ${emptyRow}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ── Stuck Deals ─────────────────────────────────────────────

function buildStuckDeals() {
  const { deals, allUsers, allTeams } = getFilteredReportData();
  const stuckDeals = deals
    .filter(d => d.status === 'active' && daysSince(d.updatedAt) > 7)
    .sort((a, b) => daysSince(b.updatedAt) - daysSince(a.updatedAt));

  if (stuckDeals.length === 0) {
    return `
      <div class="report-card card" style="margin-bottom: var(--space-xl);">
        <div style="padding:1.5rem; border-bottom:1px solid var(--color-hairline-soft);">
          <h3 style="margin:0;">Stuck Deals</h3>
        </div>
        <div class="empty-state" style="padding: var(--space-xl);">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div class="empty-state-title">No Stuck Deals</div>
          <div class="empty-state-desc">All active deals have been updated within the last 7 days. Great momentum!</div>
        </div>
      </div>
    `;
  }

  const rows = stuckDeals.map(d => {
    const owner = d.assignedTo ? Store.getUserById(d.assignedTo) : null;
    const team = d.teamId ? Store.getTeamById(d.teamId) : null;
    const stageObj = SOP_STAGES.find(s => s.key === d.stage);
    const stageLabel = stageObj ? stageObj.label : capitalize(d.stage);
    const days = daysSince(d.updatedAt);

    return `
      <tr>
        <td><a href="#/deals/${d.id}" class="text-link" style="font-weight:500;">${d.title}</a></td>
        <td><span class="stage-badge stage-badge-${d.stage}">${stageLabel}</span></td>
        <td>${owner ? owner.name : '<span style="color:var(--color-muted)">Unassigned</span>'}</td>
        <td style="font-size:0.85rem;">${team ? team.name : '—'}</td>
        <td style="font-weight:600;">${formatCurrency(d.value)}</td>
        <td><span class="badge badge-error">${days} day${days !== 1 ? 's' : ''}</span></td>
        <td style="text-align:right;"><a href="#/deals/${d.id}" class="btn btn-sm btn-secondary">View</a></td>
      </tr>
    `;
  }).join('');

  return `
    <div class="report-card card" style="margin-bottom: var(--space-xl);">
      <div style="padding:1.5rem; border-bottom:1px solid var(--color-hairline-soft);">
        <h3 style="margin:0;">Stuck Deals <span class="badge badge-error" style="margin-left:0.5rem;">${stuckDeals.length}</span></h3>
      </div>
      <div style="overflow-x:auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th>Deal</th>
              <th>Stage</th>
              <th>Owner</th>
              <th>Team</th>
              <th>Value</th>
              <th>Days Stuck</th>
              <th style="text-align:right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ── Recent Activity ─────────────────────────────────────────

function buildRecentActivity() {
  const { deals } = getFilteredReportData();
  const dealIds = new Set(deals.map(d => d.id));

  let activities = Store.getActivities()
    .filter(a => dealIds.has(a.dealId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  const ACTIVITY_ICONS = {
    call: '📞', email: '✉️', meeting: '🤝', note: '📝', stage_change: '🔄', assignment: '👤'
  };

  if (activities.length === 0) {
    return `
      <div class="report-card card" style="margin-bottom: var(--space-xl);">
        <div style="padding:1.5rem; border-bottom:1px solid var(--color-hairline-soft);">
          <h3 style="margin:0;">Recent Sales Activity</h3>
        </div>
        <div class="activity-feed-empty" style="padding:var(--space-xl);">No recent activity for the current filter.</div>
      </div>
    `;
  }

  const items = activities.map(a => {
    const user = Store.getUserById(a.createdBy);
    const deal = Store.getDealById(a.dealId);
    const icon = ACTIVITY_ICONS[a.type] || '📌';
    return `
      <div class="activity-feed-item">
        <span class="activity-feed-dot" style="background: var(--color-primary);"></span>
        <div class="activity-feed-content">
          <div class="activity-feed-text">
            <strong>${user ? user.name : 'Unknown'}</strong> — ${deal ? deal.title : 'Unknown deal'}<br/>
            <span style="color:var(--color-muted);">${icon} ${a.content}</span>
          </div>
          <div class="activity-feed-time">${timeAgo(a.createdAt)}</div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="report-card card" style="margin-bottom: var(--space-xl);">
      <div style="padding:1.5rem; border-bottom:1px solid var(--color-hairline-soft);">
        <h3 style="margin:0;">Recent Sales Activity</h3>
      </div>
      <div class="activity-feed-list">
        ${items}
      </div>
    </div>
  `;
}

// ── Event Binding ───────────────────────────────────────────

export function bindReportsEvents() {
  const content = document.getElementById('content-area');
  if (!content) return;

  content.addEventListener('change', (e) => {
    const user = Auth.getCurrentUser();
    if (!user || user.role !== 'manager') return;

    if (e.target.id === 'report-filter-team') {
      reportFilters.teamId = e.target.value;
      reRenderReports();
    }
    if (e.target.id === 'report-filter-status') {
      reportFilters.dealStatus = e.target.value;
      reRenderReports();
    }
  });

  content.addEventListener('click', (e) => {
    const user = Auth.getCurrentUser();
    if (!user || user.role !== 'manager') return;

    if (e.target.id === 'btn-clear-report-filters') {
      reportFilters = { teamId: '', dealStatus: '' };
      reRenderReports();
    }
  });
}

function reRenderReports() {
  const contentEl = document.getElementById('content-area');
  if (contentEl) {
    contentEl.innerHTML = renderReports();
  }
}
