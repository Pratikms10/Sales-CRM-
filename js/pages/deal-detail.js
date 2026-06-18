// ============================================================
// TechnoEdge CRM — Deal Detail Page
// Detail view with SOP progress bar and activity history
// ============================================================

import { Store } from '../store.js';
import { Auth } from '../auth.js';
import { SOP_STAGES, formatCurrency, timeAgo, formatDateTime } from '../utils.js';
import { Router } from '../router.js';
import { Toast } from '../components/toast.js';
import { renderActivityModal } from './activities.js';

export function renderDealDetail(params) {
  const user = Auth.getCurrentUser();
  if (!user || !params || !params.id) {
    Router.navigate('#/pipeline');
    return '';
  }

  const deal = Store.getDealById(params.id);
  if (!deal) {
    Toast.error('Not Found', 'Deal not found.');
    Router.navigate('#/pipeline');
    return '';
  }

  if (!Auth.canViewRecord(deal)) {
    Toast.error('Access Denied', 'You do not have permission to view this deal.');
    Router.navigate('#/pipeline');
    return '';
  }

  const currentStageIndex = SOP_STAGES.findIndex(s => s.key === deal.stage);

  // Build SOP Progress Bar
  const sopProgressHtml = SOP_STAGES.map((stage, index) => {
    let stateClass = '';
    if (index < currentStageIndex) stateClass = 'is-completed';
    else if (index === currentStageIndex) stateClass = 'is-current';

    return `
      <div class="sop-step ${stateClass}">
        <div class="sop-step-dot"></div>
        <div class="sop-step-label">${stage.label}</div>
      </div>
    `;
  }).join('');

  // Action Controls
  let actionHtml = '';
  const canMoveForward = currentStageIndex < SOP_STAGES.length - 1 && (user.role === 'manager' || Auth.canEditRecord(deal));

  if (user.role === 'manager') {
    const CHEVRON_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>';
    const options = SOP_STAGES.map(s => `<option value="${s.key}" ${s.key === deal.stage ? 'selected' : ''}>${s.label}</option>`).join('');
    actionHtml = `
      <div class="deal-actions-bar">
        <div class="login-select-wrapper" style="margin-bottom: 0; width: 200px;">
          <select class="login-select" id="override-stage-select" style="height: 40px; padding-right: 36px; cursor: pointer;">
            ${options}
          </select>
          <span class="login-select-arrow" style="pointer-events: none; top: 50%; transform: translateY(-50%);">${CHEVRON_ICON}</span>
        </div>
        <button class="btn btn-primary" id="btn-override-stage" data-deal-id="${deal.id}">Override Stage</button>
      </div>
    `;
  } else if (canMoveForward) {
    const nextStage = SOP_STAGES[currentStageIndex + 1];
    actionHtml = `
      <div class="deal-actions-bar">
        <button class="btn btn-primary" id="btn-next-stage" data-deal-id="${deal.id}" data-next-stage="${nextStage.key}">
          Move to ${nextStage.label}
        </button>
      </div>
    `;
  }

  const activities = Store.getActivitiesForDeal(deal.id);
  const ACTIVITY_ICONS = { call: '📞', email: '✉️', meeting: '🤝', whatsapp: '💬', linkedin: '🔗', note: '📝', follow_up: '⏰', stage_change: '🔄', assignment: '👤' };

  const activitiesHtml = activities.map(act => {
    const creator = Store.getUserById(act.createdBy);
    const rawType = act.type || 'note';
    const icon = ACTIVITY_ICONS[rawType] || '📌';
    const typeLabel = rawType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

    let extraHtml = '';
    if (act.status && act.status !== 'completed' && act.status !== 'cancelled') {
      extraHtml += `<span class="badge badge-warning" style="margin-right:4px;">Open</span>`;
    }
    if (act.dueAt) {
      extraHtml += `<span style="font-size:0.75rem; color:var(--color-muted); margin-right:4px;">Due: ${new Date(act.dueAt).toLocaleDateString()}</span>`;
    }
    if (act.outcome) {
      extraHtml += `<div style="margin-top:4px; font-size:0.8rem; font-style:italic;">Outcome: ${act.outcome}</div>`;
    }

    return `
      <div class="activity-feed-item">
        <span class="activity-feed-dot"></span>
        <div class="activity-feed-content">
          <div class="activity-feed-text">
            <strong>${creator ? creator.name : 'Unknown'}</strong> <span style="color:var(--color-muted); font-size:0.85rem;">logged ${typeLabel}</span><br>
            <span style="color: var(--color-ink);">${icon} ${act.content}</span>
            ${extraHtml}
          </div>
          <div class="activity-feed-time">${formatDateTime(act.createdAt)} (${timeAgo(act.createdAt)})</div>
        </div>
      </div>
    `;
  }).join('') || '<div class="activity-feed-empty">No activities recorded.</div>';

  const reqs = Store.getRequirementsForUser(user).filter(r => r.dealId === deal.id);
  const props = Store.getProposalsForUser(user).filter(p => p.dealId === deal.id);

  let reqHtml = reqs.length === 0 ? '<div style="color:var(--color-muted); font-size:0.85rem; margin-bottom:1rem;">No linked requirements.</div>' :
    reqs.map(r => `
      <div style="border:1px solid var(--color-hairline-soft); border-radius:4px; padding:8px; margin-bottom:8px; background:var(--color-surface-card);">
        <div style="font-weight:600; font-size:0.9rem;">${r.title}</div>
        <div style="font-size:0.8rem; color:var(--color-muted);">Type: ${r.requirementType} | Status: ${r.status}</div>
      </div>
    `).join('');

  let propHtml = props.length === 0 ? '<div style="color:var(--color-muted); font-size:0.85rem; margin-bottom:1rem;">No linked proposals.</div>' :
    props.map(p => `
      <div style="border:1px solid var(--color-hairline-soft); border-radius:4px; padding:8px; margin-bottom:8px; background:var(--color-surface-card);">
        <div style="font-weight:600; font-size:0.9rem;">${p.title} <span class="badge badge-neutral" style="font-size:0.7rem;">v${p.version || '1.0'}</span></div>
        <div style="font-size:0.8rem; color:var(--color-muted);">Status: ${p.status} | Total: ${formatCurrency(p.grandTotal || 0)}</div>
      </div>
    `).join('');

  const reqPropSection = `
    <div class="dashboard-section" style="display:flex; gap:1rem; flex-wrap:wrap;">
      <div style="flex:1; min-width:300px;">
        <div class="dashboard-section-header" style="justify-content:space-between; align-items:center;">
          <h4 class="dashboard-section-title" style="margin:0;">Requirements</h4>
          <a href="#/requirements" class="btn btn-sm btn-secondary">View All</a>
        </div>
        <div>${reqHtml}</div>
      </div>
      <div style="flex:1; min-width:300px;">
        <div class="dashboard-section-header" style="justify-content:space-between; align-items:center;">
          <h4 class="dashboard-section-title" style="margin:0;">Proposals</h4>
          <a href="#/proposals" class="btn btn-sm btn-secondary">View All</a>
        </div>
        <div>${propHtml}</div>
      </div>
    </div>
  `;

  return `
    <div class="content-inner">
      <div class="deal-detail-header">
        <div>
          <h1 class="deal-detail-title">${deal.title}</h1>
          <div class="deal-detail-value">${formatCurrency(deal.value, deal.currency)}</div>
          <span class="badge badge-neutral">Priority: ${deal.priority}</span>
        </div>
        ${actionHtml}
      </div>

      <div class="dashboard-section">
        <h4 class="dashboard-section-title">SOP Progress</h4>
        <div class="sop-progress">
          ${sopProgressHtml}
        </div>
      </div>

      ${reqPropSection}

      <div class="dashboard-section">
        <div class="dashboard-section-header" style="justify-content:space-between; align-items:center;">
          <h4 class="dashboard-section-title" style="margin:0;">Activity History</h4>
          <button class="btn btn-secondary btn-sm" id="btn-deal-log-activity" data-deal-id="${deal.id}">Log Activity</button>
        </div>
        <div class="activity-feed">
          <div class="activity-feed-list">
            ${activitiesHtml}
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindDealDetailEvents() {
  const content = document.getElementById('content-area');
  if (!content) return;

  content.addEventListener('click', (e) => {
    // Next Stage button (Employee/TL)
    if (e.target.id === 'btn-next-stage') {
      const dealId = e.target.dataset.dealId;
      const nextStage = e.target.dataset.nextStage;
      executeStageChange(dealId, nextStage);
    }

    // Override Stage button (Manager)
    if (e.target.id === 'btn-override-stage') {
      const dealId = e.target.dataset.dealId;
      const select = document.getElementById('override-stage-select');
      if (select) {
        const toStage = select.value;
        const deal = Store.getDealById(dealId);
        if (deal && deal.stage !== toStage) {
          executeStageChange(dealId, toStage, true);
        }
      }
    }

    // Log Activity button
    if (e.target.id === 'btn-deal-log-activity') {
      renderActivityModal(null, { linkedType: 'deal', linkedId: e.target.dataset.dealId });
    }
  });
}

function executeStageChange(dealId, toStage, isOverride = false) {
  const user = Auth.getCurrentUser();
  const deal = Store.getDealById(dealId);
  if (!deal || !user) return;

  const fromStage = deal.stage;
  const fromIndex = SOP_STAGES.findIndex(s => s.key === fromStage);
  const toIndex = SOP_STAGES.findIndex(s => s.key === toStage);

  if (toIndex === -1) {
    Toast.error('Invalid Stage', 'The selected stage does not exist.');
    return;
  }

  if (fromIndex === toIndex) {
    return; // Target is same as current, do nothing
  }

  // Permission validation
  if (user.role !== 'manager') {
    if (!Auth.canEditRecord(deal)) {
      Toast.error('Permission Denied', 'You do not have permission to edit this deal.');
      return;
    }
    if (isOverride) {
      Toast.error('Permission Denied', 'Only Managers can override deal stages.');
      return;
    }
    if (toIndex !== fromIndex + 1) {
      Toast.error('Invalid Move', 'You can only move a deal exactly one stage forward.');
      return;
    }
  }

  Store.updateDeal(deal.id, { stage: toStage });

  Store.createActivity({
    id: 'act_' + Date.now().toString(36),
    dealId: deal.id,
    type: 'stage_change',
    content: `Deal ${isOverride ? 'overridden' : 'moved'} from ${SOP_STAGES[fromIndex].label} to ${SOP_STAGES[toIndex].label}`,
    fromStage: fromStage,
    toStage: toStage,
    createdBy: user.id,
    createdAt: new Date().toISOString()
  });

  Toast.success('Stage Updated', `Deal is now in ${SOP_STAGES[toIndex].label}`);

  // Re-render
  const contentEl = document.getElementById('content-area');
  if (contentEl) {
    contentEl.innerHTML = renderDealDetail({ id: dealId });
  }
}
