// ============================================================
// TechnoEdge CRM — Dashboard Page
// Role-aware dashboard with stat cards and activity feed
// ============================================================

import { Auth } from '../auth.js';
import { Store } from '../store.js';
import { formatCurrency, formatRole, getGreeting, timeAgo, getInitials, SOP_STAGES } from '../utils.js';

// ── Stat card icon SVGs ─────────────────────────────────────

const STAT_ICONS = {
  revenue:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
  deals:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>',
  leads:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
  pipeline:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
  team:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>',
  tasks:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>',
  activity:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  conversion: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>'
};

const ACTIVITY_ICONS = {
  call:         '📞',
  email:        '✉️',
  meeting:      '🤝',
  note:         '📝',
  stage_change: '🔄',
  assignment:   '👤'
};

// ── Build dashboard HTML ────────────────────────────────────

export function renderDashboard() {
  const user = Auth.getCurrentUser();
  if (!user) return '';

  const greeting = getGreeting();
  const roleName = formatRole(user.role);
  const roleBadgeClass = `role-badge-${user.role}`;

  // Get role-scoped data
  const deals = Store.getDealsForUser(user);
  const leads = Store.getLeadsForUser(user);
  const activities = Store.getRecentActivities(user, 8);

  const activeDeals = deals.filter(d => d.status === 'active');
  const totalValue = activeDeals.reduce((sum, d) => sum + (d.value || 0), 0);
  const newLeads = leads.filter(l => l.status === 'new').length;
  const qualifiedLeads = leads.filter(l => l.status === 'qualified').length;

  // Build stat cards based on role
  const statCards = buildStatCards(user, activeDeals, leads, totalValue, newLeads, qualifiedLeads);

  // Pipeline mini bar
  const pipelineMini = buildPipelineMini(activeDeals);

  // Activity feed
  const activityFeed = buildActivityFeed(activities);

  const followUps = Store.getFollowUpsForUser(user);
  let overdue = 0; let today = 0; let upcoming = 0;
  const now = new Date();

  followUps.forEach(f => {
    const due = new Date(f.dueAt);
    if (isNaN(due.getTime())) return;

    if (due.getFullYear() === now.getFullYear() &&
        due.getMonth() === now.getMonth() &&
        due.getDate() === now.getDate()) {
      today++;
    } else if (due < now) {
      overdue++;
    } else {
      upcoming++;
    }
  });

  const sortedFollowUps = followUps.sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt)).slice(0, 5);
  const followUpsWidget = buildFollowUpsWidget(sortedFollowUps, overdue, today, upcoming);

  return `
    <div class="content-inner">
      <div class="dashboard-greeting">
        <div class="dashboard-greeting-text">${greeting}, ${user.name.split(' ')[0]}</div>
        <div class="dashboard-greeting-sub">
          <span class="role-badge ${roleBadgeClass}">${roleName}</span>
          <span>Here's what's happening ${user.role === 'manager' ? 'across your organization' : user.role === 'team_lead' ? 'with your team' : 'with your work'}</span>
        </div>
      </div>

      ${statCards}

      <div style="display:flex; gap:1.5rem; flex-wrap:wrap; margin-bottom:1.5rem;">
        <div class="dashboard-section" style="flex:1; min-width:300px; margin-bottom:0;">
          <div class="dashboard-section-header">
            <h4 class="dashboard-section-title">Follow-ups</h4>
            <a href="#/activities" class="btn-link" style="font-size:0.85rem;">View All</a>
          </div>
          ${followUpsWidget}
        </div>

        <div class="dashboard-section" style="flex:2; min-width:400px; margin-bottom:0;">
          <div class="dashboard-section-header">
            <h4 class="dashboard-section-title">Pipeline Overview</h4>
          </div>
          ${pipelineMini}
        </div>
      </div>

      <div class="dashboard-section">
        <div class="dashboard-section-header">
          <h4 class="dashboard-section-title">Recent Activity</h4>
        </div>
        ${activityFeed}
      </div>
    </div>
  `;
}

// ── Stat Cards ──────────────────────────────────────────────

function buildStatCards(user, activeDeals, leads, totalValue, newLeads, qualifiedLeads) {
  let cards = [];

  if (user.role === 'manager') {
    cards = [
      { label: 'Total Pipeline Value', value: formatCurrency(totalValue), icon: 'revenue',    color: 'var(--color-stage-sales)',       bg: 'var(--color-primary-disabled)' },
      { label: 'Active Deals',         value: activeDeals.length,         icon: 'deals',      color: 'var(--color-stage-delivery)',    bg: 'var(--color-info-soft)' },
      { label: 'Total Leads',          value: leads.length,               icon: 'leads',      color: 'var(--color-stage-feedback)',    bg: '#f3e8ff' },
      { label: 'Conversion Rate',      value: leads.length > 0 ? Math.round((qualifiedLeads / leads.length) * 100) + '%' : '0%', icon: 'conversion', color: 'var(--color-stage-invoice)', bg: 'var(--color-success-soft)' }
    ];
  } else if (user.role === 'team_lead') {
    cards = [
      { label: 'Team Pipeline Value',  value: formatCurrency(totalValue), icon: 'revenue',   color: 'var(--color-stage-sales)',     bg: 'var(--color-primary-disabled)' },
      { label: 'Team Active Deals',    value: activeDeals.length,         icon: 'deals',     color: 'var(--color-stage-delivery)',  bg: 'var(--color-info-soft)' },
      { label: 'New Leads',            value: newLeads,                   icon: 'leads',     color: 'var(--color-stage-requirement)', bg: 'var(--color-warning-soft)' },
      { label: 'Team Members',         value: Store.getUsersByTeam(user.teamId).length, icon: 'team', color: 'var(--color-stage-feedback)', bg: '#f3e8ff' }
    ];
  } else {
    cards = [
      { label: 'My Pipeline Value',    value: formatCurrency(totalValue), icon: 'revenue',  color: 'var(--color-stage-sales)',      bg: 'var(--color-primary-disabled)' },
      { label: 'My Active Deals',      value: activeDeals.length,         icon: 'deals',    color: 'var(--color-stage-delivery)',   bg: 'var(--color-info-soft)' },
      { label: 'My Leads',             value: leads.length,               icon: 'leads',    color: 'var(--color-stage-sourcing)',   bg: 'var(--color-warning-soft)' },
      { label: 'Recent Activities',    value: Store.getRecentActivities(user, 100).length, icon: 'activity', color: 'var(--color-stage-invoice)', bg: 'var(--color-success-soft)' }
    ];
  }

  const cardsHTML = cards.map(card => `
    <div class="stat-card">
      <div class="stat-card-icon" style="background: ${card.bg}; color: ${card.color};">
        ${STAT_ICONS[card.icon] || ''}
      </div>
      <div class="stat-card-content">
        <div class="stat-card-label">${card.label}</div>
        <div class="stat-card-value">${card.value}</div>
      </div>
    </div>
  `).join('');

  return `<div class="stat-cards">${cardsHTML}</div>`;
}

// ── Pipeline Mini Bar ───────────────────────────────────────

function buildPipelineMini(activeDeals) {
  const stageCounts = {};
  SOP_STAGES.forEach(s => { stageCounts[s.key] = 0; });
  activeDeals.forEach(d => {
    if (stageCounts[d.stage] !== undefined) stageCounts[d.stage]++;
  });

  const total = activeDeals.length || 1;

  const segments = SOP_STAGES.map(s => {
    const count = stageCounts[s.key];
    const flex = Math.max(count / total, 0.05);
    return `<div class="pipeline-mini-segment" style="flex: ${flex}; background: ${s.color};" title="${s.label}: ${count}"></div>`;
  }).join('');

  const legendItems = SOP_STAGES.map(s => `
    <div class="pipeline-mini-legend-item">
      <span class="pipeline-mini-legend-dot" style="background: ${s.color};"></span>
      ${s.label}: <strong>${stageCounts[s.key]}</strong>
    </div>
  `).join('');

  return `
    <div class="pipeline-mini">
      <div class="pipeline-mini-bar">${segments}</div>
      <div class="pipeline-mini-legend">${legendItems}</div>
    </div>
  `;
}

// ── Follow-ups Widget ───────────────────────────────────────

function buildFollowUpsWidget(followUps, overdue, today, upcoming) {
  const summaryHtml = `
    <div style="display:flex; justify-content:space-between; margin-bottom:1rem; font-size:0.85rem; font-weight:600; text-align:center;">
      <div style="flex:1;">
        <div style="color:var(--color-error); font-size:1.2rem;">${overdue}</div>
        <div style="color:var(--color-muted); font-size:0.75rem;">Overdue</div>
      </div>
      <div style="flex:1;">
        <div style="color:var(--color-warning); font-size:1.2rem;">${today}</div>
        <div style="color:var(--color-muted); font-size:0.75rem;">Today</div>
      </div>
      <div style="flex:1;">
        <div style="color:var(--color-primary); font-size:1.2rem;">${upcoming}</div>
        <div style="color:var(--color-muted); font-size:0.75rem;">Upcoming</div>
      </div>
    </div>
  `;

  if (followUps.length === 0) {
    return summaryHtml + `<div style="text-align:center; color:var(--color-muted); font-size:0.85rem; padding:1rem 0;">No open follow-ups.</div>`;
  }

  const itemsHtml = followUps.map(f => {
    const owner = Store.getUserById(f.assignedTo || f.createdBy);
    const ownerName = owner ? owner.name : 'Unknown';
    let recordLabel = 'No Link';
    if (f.dealId) { const d = Store.getDealById(f.dealId); if (d) recordLabel = d.title; }
    else if (f.leadId) { const l = Store.getLeadById(f.leadId); if (l) recordLabel = l.name; }
    else if (f.contactId) { const c = Store.getContactById(f.contactId); if (c) recordLabel = c.name; }

    return `
      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-hairline-soft); padding:0.5rem 0;">
        <div style="max-width:200px;">
          <div style="font-weight:600; font-size:0.85rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${f.content}">${f.content}</div>
          <div style="font-size:0.75rem; color:var(--color-muted);">${recordLabel} • ${ownerName}</div>
        </div>
        <div style="font-size:0.75rem; text-align:right;">
          <div style="font-weight:600;">${new Date(f.dueAt).toLocaleDateString()}</div>
        </div>
      </div>
    `;
  }).join('');

  return summaryHtml + itemsHtml;
}

// ── Activity Feed ───────────────────────────────────────────

function buildActivityFeed(activities) {
  if (!activities || activities.length === 0) {
    return `
      <div class="activity-feed">
        <div class="activity-feed-empty">No recent activity to show.</div>
      </div>
    `;
  }

  const items = activities.map(a => {
    const icon = ACTIVITY_ICONS[a.type] || '📌';
    const user = Store.getUserById(a.createdBy);
    const userName = user ? user.name : 'Unknown';
    const deal = Store.getDealById(a.dealId);
    const dealTitle = deal ? deal.title : 'Unknown deal';
    const time = timeAgo(a.createdAt);

    return `
      <div class="activity-feed-item">
        <span class="activity-feed-dot" style="background: ${getActivityColor(a.type)};"></span>
        <div class="activity-feed-content">
          <div class="activity-feed-text">
            <strong>${userName}</strong> — ${dealTitle}<br/>
            <span style="color: var(--color-muted);">${icon} ${a.content}</span>
          </div>
          <div class="activity-feed-time">${time}</div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="activity-feed">
      <div class="activity-feed-list">${items}</div>
    </div>
  `;
}

function getActivityColor(type) {
  const colors = {
    call:         'var(--color-stage-sales)',
    email:        'var(--color-stage-delivery)',
    meeting:      'var(--color-stage-feedback)',
    note:         'var(--color-stage-sourcing)',
    stage_change: 'var(--color-stage-invoice)',
    assignment:   'var(--color-stage-renewal)'
  };
  return colors[type] || 'var(--color-primary)';
}
