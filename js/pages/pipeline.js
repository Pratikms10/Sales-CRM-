// ============================================================
// TechnoEdge CRM — Pipeline Page
// Kanban board for SOP deal stages
// ============================================================

import { Store } from '../store.js';
import { Auth } from '../auth.js';
import { SOP_STAGES, formatCurrency, getInitials, timeAgo } from '../utils.js';
import { Router } from '../router.js';
import { Toast } from '../components/toast.js';

export function renderPipeline() {
  const user = Auth.getCurrentUser();
  if (!user) return '';

  const deals = Store.getDealsForUser(user);

  // Group deals by stage
  const dealsByStage = {};
  SOP_STAGES.forEach(s => { dealsByStage[s.key] = []; });
  
  deals.forEach(deal => {
    if (dealsByStage[deal.stage]) {
      dealsByStage[deal.stage].push(deal);
    }
  });

  const columnsHTML = SOP_STAGES.map((stage, index) => {
    const stageDeals = dealsByStage[stage.key];
    const nextStageObj = index < SOP_STAGES.length - 1 ? SOP_STAGES[index + 1] : null;
    
    const cardsHTML = stageDeals.map(deal => buildDealCard(deal, user, nextStageObj)).join('');

    return `
      <div class="pipeline-column">
        <div class="pipeline-column-header">
          <div class="pipeline-column-title">
            <span class="stage-badge stage-badge-${stage.key}" style="width: 12px; height: 12px; padding: 0;"></span>
            ${stage.label}
          </div>
          <span class="pipeline-column-count">${stageDeals.length}</span>
        </div>
        <div class="pipeline-column-body">
          ${cardsHTML}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="content-inner" style="max-width: none;">
      <div class="page-header">
        <h1 class="page-header-title">Pipeline</h1>
        <p class="page-header-subtitle">Manage deals across standard operating procedure stages.</p>
      </div>
      <div class="pipeline-board">
        ${columnsHTML}
      </div>
    </div>
  `;
}

function buildDealCard(deal, user, nextStageObj) {
  const assignee = deal.assignedTo ? Store.getUserById(deal.assignedTo) : null;
  const initials = getInitials(assignee ? assignee.name : '?');
  const avatarBg = assignee ? assignee.avatarColor : 'var(--color-muted)';

  let actionHtml = '';
  const canMove = nextStageObj && (user.role === 'manager' || Auth.canEditRecord(deal));
  
  if (canMove) {
    actionHtml = `
      <div class="deal-card-actions">
        <button class="btn btn-primary btn-sm btn-full move-forward-btn" data-deal-id="${deal.id}" data-next-stage="${nextStageObj.key}">Move to ${nextStageObj.label}</button>
      </div>
    `;
  }

  return `
    <div class="deal-card" data-deal-id="${deal.id}">
      <div class="deal-card-header">
        <h4 class="deal-card-title">${deal.title}</h4>
      </div>
      <div class="deal-card-value">${formatCurrency(deal.value, deal.currency)}</div>
      <div style="margin-bottom: var(--space-xs)">
        <span class="badge badge-neutral">${deal.priority}</span>
      </div>
      <div class="deal-card-footer">
        <span class="deal-card-time">Updated ${timeAgo(deal.updatedAt)}</span>
        <div class="avatar avatar-sm" style="background-color: ${avatarBg}" title="Assigned to ${assignee ? assignee.name : 'Unassigned'}">${initials}</div>
      </div>
      ${actionHtml}
    </div>
  `;
}

export function bindPipelineEvents() {
  const content = document.getElementById('content-area');
  if (!content) return;

  content.addEventListener('click', (e) => {
    const moveBtn = e.target.closest('.move-forward-btn');
    const card = e.target.closest('.deal-card');

    if (moveBtn) {
      e.stopPropagation();
      const dealId = moveBtn.dataset.dealId;
      const nextStage = moveBtn.dataset.nextStage;
      handleStageMove(dealId, nextStage);
    } else if (card) {
      // Navigate to deal detail
      Router.navigate('#/deals/' + card.dataset.dealId);
    }
  });
}

function handleStageMove(dealId, toStage) {
  const user = Auth.getCurrentUser();
  const deal = Store.getDealById(dealId);
  if (!deal || !user) return;

  const fromStage = deal.stage;

  // Find indexes
  const fromIndex = SOP_STAGES.findIndex(s => s.key === fromStage);
  const toIndex = SOP_STAGES.findIndex(s => s.key === toStage);

  if (toIndex === -1) {
    Toast.error('Invalid Stage', 'The selected stage does not exist.');
    return;
  }

  if (fromIndex === toIndex) {
    return; // Target is same as current, do nothing
  }

  // Validation
  if (user.role !== 'manager') {
    if (!Auth.canEditRecord(deal)) {
      Toast.error('Permission Denied', 'You do not have permission to edit this deal.');
      return;
    }
    if (toIndex !== fromIndex + 1) {
      Toast.error('Invalid Move', 'You can only move a deal exactly one stage forward.');
      return;
    }
  }

  // Update deal
  Store.updateDeal(deal.id, { stage: toStage });

  // Log activity
  Store.createActivity({
    id: 'act_' + Date.now().toString(36),
    dealId: deal.id,
    type: 'stage_change',
    content: `Deal moved from ${SOP_STAGES[fromIndex].label} to ${SOP_STAGES[toIndex].label}`,
    fromStage: fromStage,
    toStage: toStage,
    createdBy: user.id,
    createdAt: new Date().toISOString()
  });

  Toast.success('Stage Updated', `Moved to ${SOP_STAGES[toIndex].label}`);
  
  // Re-render
  const contentEl = document.getElementById('content-area');
  if (contentEl) {
    contentEl.innerHTML = renderPipeline();
  }
}
