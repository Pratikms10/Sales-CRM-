# AI Change Audit Report

## Generated On
2026-06-17_15-51-16

## Branch
main

## Baseline Commit
0f2bd91

## Task Summary
Phase 1B SOP pipeline page and deal detail stage controls with permission guard fix

## Git Status
```text
 M audits/CHANGE_AUDIT.md
 M css/components.css
 M js/app.js
 A js/pages/deal-detail.js
 A js/pages/pipeline.js
```

## Files Changed
```text
M	css/components.css
M	js/app.js
A	js/pages/deal-detail.js
A	js/pages/pipeline.js
```

## Change Summary
```text
 css/components.css      | 212 ++++++++++++++++++++++++++++++++++++++++++++++++
 js/app.js               |  18 +++-
 js/pages/deal-detail.js | 206 ++++++++++++++++++++++++++++++++++++++++++++++
 js/pages/pipeline.js    | 171 ++++++++++++++++++++++++++++++++++++++
 4 files changed, 606 insertions(+), 1 deletion(-)
```

## Full Diff
```diff
diff --git a/css/components.css b/css/components.css
index 0980f8a..e980079 100644
--- a/css/components.css
+++ b/css/components.css
@@ -621,3 +621,215 @@
   color: var(--color-muted);
   max-width: 400px;
 }
+
+/* -- Pipeline Board (Kanban) ------------------------------- */
+.pipeline-board {
+  display: flex;
+  gap: var(--space-md);
+  overflow-x: auto;
+  padding-bottom: var(--space-base);
+  min-height: 500px;
+  align-items: flex-start;
+}
+
+.pipeline-column {
+  flex: 0 0 320px;
+  background: var(--color-surface-strong);
+  border-radius: var(--rounded-md);
+  display: flex;
+  flex-direction: column;
+  max-height: calc(100vh - 200px);
+}
+
+.pipeline-column-header {
+  padding: var(--space-md);
+  border-bottom: 2px solid transparent;
+  display: flex;
+  justify-content: space-between;
+  align-items: center;
+  border-radius: var(--rounded-md) var(--rounded-md) 0 0;
+  background: var(--color-canvas);
+}
+
+.pipeline-column-title {
+  font: var(--text-title-sm);
+  color: var(--color-ink);
+  display: flex;
+  align-items: center;
+  gap: var(--space-xs);
+}
+
+.pipeline-column-count {
+  font: var(--text-badge);
+  background: var(--color-surface-strong);
+  color: var(--color-muted);
+  padding: 2px 8px;
+  border-radius: var(--rounded-full);
+}
+
+.pipeline-column-body {
+  padding: var(--space-sm);
+  overflow-y: auto;
+  flex: 1;
+  display: flex;
+  flex-direction: column;
+  gap: var(--space-sm);
+}
+
+/* -- Deal Card --------------------------------------------- */
+.deal-card {
+  background: var(--color-canvas);
+  border-radius: var(--rounded-sm);
+  box-shadow: var(--shadow-card);
+  padding: var(--space-md);
+  cursor: pointer;
+  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
+  border: 1px solid var(--color-hairline-soft);
+}
+
+.deal-card:hover {
+  transform: translateY(-2px);
+  box-shadow: var(--shadow-dropdown);
+}
+
+.deal-card-header {
+  display: flex;
+  justify-content: space-between;
+  align-items: flex-start;
+  margin-bottom: var(--space-xs);
+}
+
+.deal-card-title {
+  font: var(--text-title-sm);
+  color: var(--color-ink);
+  margin: 0;
+}
+
+.deal-card-value {
+  font: var(--text-body-sm);
+  font-weight: 600;
+  color: var(--color-success);
+  margin-bottom: var(--space-sm);
+}
+
+.deal-card-footer {
+  display: flex;
+  justify-content: space-between;
+  align-items: center;
+  margin-top: var(--space-sm);
+  padding-top: var(--space-sm);
+  border-top: 1px solid var(--color-hairline-soft);
+}
+
+.deal-card-time {
+  font: var(--text-caption-sm);
+  color: var(--color-muted);
+}
+
+.deal-card-actions {
+  display: flex;
+  gap: var(--space-xs);
+  margin-top: var(--space-sm);
+}
+
+/* -- Deal Detail Page -------------------------------------- */
+.deal-detail-header {
+  background: var(--color-canvas);
+  padding: var(--space-xl);
+  border-radius: var(--rounded-md);
+  box-shadow: var(--shadow-card);
+  margin-bottom: var(--space-xl);
+  display: flex;
+  justify-content: space-between;
+  align-items: flex-start;
+}
+
+.deal-detail-title {
+  font: var(--text-display-lg);
+  color: var(--color-ink);
+  margin-bottom: var(--space-xs);
+}
+
+.deal-detail-value {
+  font: var(--text-display-md);
+  color: var(--color-success);
+  margin-bottom: var(--space-md);
+}
+
+/* SOP Progress Bar */
+.sop-progress {
+  display: flex;
+  align-items: center;
+  width: 100%;
+  margin: var(--space-lg) 0;
+  background: var(--color-surface-strong);
+  padding: var(--space-md);
+  border-radius: var(--rounded-lg);
+}
+
+.sop-step {
+  flex: 1;
+  text-align: center;
+  position: relative;
+}
+
+.sop-step-dot {
+  width: 24px;
+  height: 24px;
+  border-radius: var(--rounded-full);
+  background: var(--color-surface-soft);
+  border: 2px solid var(--color-hairline);
+  margin: 0 auto var(--space-xs);
+  z-index: 2;
+  position: relative;
+  transition: all var(--transition-fast);
+}
+
+.sop-step-label {
+  font: var(--text-caption-sm);
+  color: var(--color-muted);
+}
+
+.sop-step.is-completed .sop-step-dot {
+  background: var(--color-primary);
+  border-color: var(--color-primary);
+}
+
+.sop-step.is-current .sop-step-dot {
+  background: var(--color-canvas);
+  border-color: var(--color-primary);
+  border-width: 4px;
+}
+
+.sop-step.is-completed .sop-step-label {
+  color: var(--color-ink);
+  font-weight: 500;
+}
+
+.sop-step.is-current .sop-step-label {
+  color: var(--color-primary);
+  font-weight: 600;
+}
+
+/* Line connecting steps */
+.sop-step:not(:last-child)::after {
+  content: '';
+  position: absolute;
+  top: 12px;
+  left: 50%;
+  width: 100%;
+  height: 2px;
+  background: var(--color-hairline);
+  z-index: 1;
+}
+
+.sop-step.is-completed:not(:last-child)::after {
+  background: var(--color-primary);
+}
+
+.deal-actions-bar {
+  display: flex;
+  gap: var(--space-md);
+  align-items: center;
+}
+
diff --git a/js/app.js b/js/app.js
index 8d0a6c4..0ca826b 100644
--- a/js/app.js
+++ b/js/app.js
@@ -11,6 +11,8 @@ import { renderSidebar, bindSidebarEvents } from './components/sidebar.js';
 import { renderTopbar } from './components/topbar.js';
 import { renderLoginPage, bindLoginEvents } from './pages/login.js';
 import { renderDashboard } from './pages/dashboard.js';
+import { renderPipeline, bindPipelineEvents } from './pages/pipeline.js';
+import { renderDealDetail, bindDealDetailEvents } from './pages/deal-detail.js';
 
 // ΓöÇΓöÇ DOM References ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
 
@@ -94,9 +96,17 @@ function renderPage(pageId, params) {
       contentEl.innerHTML = renderDashboard();
       break;
     case 'pipeline':
+      contentEl.innerHTML = renderPipeline();
+      break;
+    case 'deals':
+      if (params && params.id) {
+        contentEl.innerHTML = renderDealDetail(params);
+      } else {
+        contentEl.innerHTML = renderComingSoon(pageId);
+      }
+      break;
     case 'leads':
     case 'contacts':
-    case 'deals':
     case 'team':
     case 'reports':
     case 'settings':
@@ -107,6 +117,12 @@ function renderPage(pageId, params) {
   }
 }
 
+// ΓöÇΓöÇ Event Delegation for Main Content ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+// Bind events that live inside the content-area once, or within the render calls.
+// Since we completely replace innerHTML, we can bind on the document or contentEl.
+bindPipelineEvents();
+bindDealDetailEvents();
+
 // ΓöÇΓöÇ Bootstrap ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
 
 function init() {
diff --git a/js/pages/deal-detail.js b/js/pages/deal-detail.js
new file mode 100644
index 0000000..06dbf08
--- /dev/null
+++ b/js/pages/deal-detail.js
@@ -0,0 +1,206 @@
+// ============================================================
+// TechnoEdge CRM ΓÇö Deal Detail Page
+// Detail view with SOP progress bar and activity history
+// ============================================================
+
+import { Store } from '../store.js';
+import { Auth } from '../auth.js';
+import { SOP_STAGES, formatCurrency, timeAgo, formatDateTime } from '../utils.js';
+import { Router } from '../router.js';
+import { Toast } from '../components/toast.js';
+
+export function renderDealDetail(params) {
+  const user = Auth.getCurrentUser();
+  if (!user || !params || !params.id) {
+    Router.navigate('#/pipeline');
+    return '';
+  }
+
+  const deal = Store.getDealById(params.id);
+  if (!deal) {
+    Toast.error('Not Found', 'Deal not found.');
+    Router.navigate('#/pipeline');
+    return '';
+  }
+
+  if (!Auth.canViewRecord(deal)) {
+    Toast.error('Access Denied', 'You do not have permission to view this deal.');
+    Router.navigate('#/pipeline');
+    return '';
+  }
+
+  const currentStageIndex = SOP_STAGES.findIndex(s => s.key === deal.stage);
+  
+  // Build SOP Progress Bar
+  const sopProgressHtml = SOP_STAGES.map((stage, index) => {
+    let stateClass = '';
+    if (index < currentStageIndex) stateClass = 'is-completed';
+    else if (index === currentStageIndex) stateClass = 'is-current';
+    
+    return `
+      <div class="sop-step ${stateClass}">
+        <div class="sop-step-dot"></div>
+        <div class="sop-step-label">${stage.label}</div>
+      </div>
+    `;
+  }).join('');
+
+  // Action Controls
+  let actionHtml = '';
+  const canMoveForward = currentStageIndex < SOP_STAGES.length - 1 && (user.role === 'manager' || Auth.canEditRecord(deal));
+  
+  if (user.role === 'manager') {
+    const CHEVRON_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>';
+    const options = SOP_STAGES.map(s => `<option value="${s.key}" ${s.key === deal.stage ? 'selected' : ''}>${s.label}</option>`).join('');
+    actionHtml = `
+      <div class="deal-actions-bar">
+        <div class="login-select-wrapper" style="margin-bottom: 0; width: 200px;">
+          <select class="login-select" id="override-stage-select" style="height: 40px; padding-right: 36px; cursor: pointer;">
+            ${options}
+          </select>
+          <span class="login-select-arrow" style="pointer-events: none; top: 50%; transform: translateY(-50%);">${CHEVRON_ICON}</span>
+        </div>
+        <button class="btn btn-primary" id="btn-override-stage" data-deal-id="${deal.id}">Override Stage</button>
+      </div>
+    `;
+  } else if (canMoveForward) {
+    const nextStage = SOP_STAGES[currentStageIndex + 1];
+    actionHtml = `
+      <div class="deal-actions-bar">
+        <button class="btn btn-primary" id="btn-next-stage" data-deal-id="${deal.id}" data-next-stage="${nextStage.key}">
+          Move to ${nextStage.label}
+        </button>
+      </div>
+    `;
+  }
+
+  // Activities
+  const activities = Store.getActivitiesForDeal(deal.id);
+  const activitiesHtml = activities.map(act => {
+    const creator = Store.getUserById(act.createdBy);
+    return `
+      <div class="activity-feed-item">
+        <span class="activity-feed-dot"></span>
+        <div class="activity-feed-content">
+          <div class="activity-feed-text">
+            <strong>${creator ? creator.name : 'Unknown'}</strong><br>
+            <span style="color: var(--color-muted);">${act.content}</span>
+          </div>
+          <div class="activity-feed-time">${formatDateTime(act.createdAt)} (${timeAgo(act.createdAt)})</div>
+        </div>
+      </div>
+    `;
+  }).join('') || '<div class="activity-feed-empty">No activities recorded.</div>';
+
+  return `
+    <div class="content-inner">
+      <div class="deal-detail-header">
+        <div>
+          <h1 class="deal-detail-title">${deal.title}</h1>
+          <div class="deal-detail-value">${formatCurrency(deal.value, deal.currency)}</div>
+          <span class="badge badge-neutral">Priority: ${deal.priority}</span>
+        </div>
+        ${actionHtml}
+      </div>
+
+      <div class="dashboard-section">
+        <h4 class="dashboard-section-title">SOP Progress</h4>
+        <div class="sop-progress">
+          ${sopProgressHtml}
+        </div>
+      </div>
+
+      <div class="dashboard-section">
+        <h4 class="dashboard-section-title">Activity History</h4>
+        <div class="activity-feed">
+          <div class="activity-feed-list">
+            ${activitiesHtml}
+          </div>
+        </div>
+      </div>
+    </div>
+  `;
+}
+
+export function bindDealDetailEvents() {
+  const content = document.getElementById('content-area');
+  if (!content) return;
+
+  content.addEventListener('click', (e) => {
+    // Next Stage button (Employee/TL)
+    if (e.target.id === 'btn-next-stage') {
+      const dealId = e.target.dataset.dealId;
+      const nextStage = e.target.dataset.nextStage;
+      executeStageChange(dealId, nextStage);
+    }
+    
+    // Override Stage button (Manager)
+    if (e.target.id === 'btn-override-stage') {
+      const dealId = e.target.dataset.dealId;
+      const select = document.getElementById('override-stage-select');
+      if (select) {
+        const toStage = select.value;
+        const deal = Store.getDealById(dealId);
+        if (deal && deal.stage !== toStage) {
+          executeStageChange(dealId, toStage, true);
+        }
+      }
+    }
+  });
+}
+
+function executeStageChange(dealId, toStage, isOverride = false) {
+  const user = Auth.getCurrentUser();
+  const deal = Store.getDealById(dealId);
+  if (!deal || !user) return;
+
+  const fromStage = deal.stage;
+  const fromIndex = SOP_STAGES.findIndex(s => s.key === fromStage);
+  const toIndex = SOP_STAGES.findIndex(s => s.key === toStage);
+
+  if (toIndex === -1) {
+    Toast.error('Invalid Stage', 'The selected stage does not exist.');
+    return;
+  }
+
+  if (fromIndex === toIndex) {
+    return; // Target is same as current, do nothing
+  }
+
+  // Permission validation
+  if (user.role !== 'manager') {
+    if (!Auth.canEditRecord(deal)) {
+      Toast.error('Permission Denied', 'You do not have permission to edit this deal.');
+      return;
+    }
+    if (isOverride) {
+      Toast.error('Permission Denied', 'Only Managers can override deal stages.');
+      return;
+    }
+    if (toIndex !== fromIndex + 1) {
+      Toast.error('Invalid Move', 'You can only move a deal exactly one stage forward.');
+      return;
+    }
+  }
+
+  Store.updateDeal(deal.id, { stage: toStage });
+
+  Store.createActivity({
+    id: 'act_' + Date.now().toString(36),
+    dealId: deal.id,
+    type: 'stage_change',
+    content: `Deal ${isOverride ? 'overridden' : 'moved'} from ${SOP_STAGES[fromIndex].label} to ${SOP_STAGES[toIndex].label}`,
+    fromStage: fromStage,
+    toStage: toStage,
+    createdBy: user.id,
+    createdAt: new Date().toISOString()
+  });
+
+  Toast.success('Stage Updated', `Deal is now in ${SOP_STAGES[toIndex].label}`);
+  
+  // Re-render
+  const contentEl = document.getElementById('content-area');
+  if (contentEl) {
+    contentEl.innerHTML = renderDealDetail({ id: dealId });
+  }
+}
diff --git a/js/pages/pipeline.js b/js/pages/pipeline.js
new file mode 100644
index 0000000..f27524b
--- /dev/null
+++ b/js/pages/pipeline.js
@@ -0,0 +1,171 @@
+// ============================================================
+// TechnoEdge CRM ΓÇö Pipeline Page
+// Kanban board for SOP deal stages
+// ============================================================
+
+import { Store } from '../store.js';
+import { Auth } from '../auth.js';
+import { SOP_STAGES, formatCurrency, getInitials, timeAgo } from '../utils.js';
+import { Router } from '../router.js';
+import { Toast } from '../components/toast.js';
+
+export function renderPipeline() {
+  const user = Auth.getCurrentUser();
+  if (!user) return '';
+
+  const deals = Store.getDealsForUser(user);
+
+  // Group deals by stage
+  const dealsByStage = {};
+  SOP_STAGES.forEach(s => { dealsByStage[s.key] = []; });
+  
+  deals.forEach(deal => {
+    if (dealsByStage[deal.stage]) {
+      dealsByStage[deal.stage].push(deal);
+    }
+  });
+
+  const columnsHTML = SOP_STAGES.map((stage, index) => {
+    const stageDeals = dealsByStage[stage.key];
+    const nextStageObj = index < SOP_STAGES.length - 1 ? SOP_STAGES[index + 1] : null;
+    
+    const cardsHTML = stageDeals.map(deal => buildDealCard(deal, user, nextStageObj)).join('');
+
+    return `
+      <div class="pipeline-column">
+        <div class="pipeline-column-header">
+          <div class="pipeline-column-title">
+            <span class="stage-badge stage-badge-${stage.key}" style="width: 12px; height: 12px; padding: 0;"></span>
+            ${stage.label}
+          </div>
+          <span class="pipeline-column-count">${stageDeals.length}</span>
+        </div>
+        <div class="pipeline-column-body">
+          ${cardsHTML}
+        </div>
+      </div>
+    `;
+  }).join('');
+
+  return `
+    <div class="content-inner" style="max-width: none;">
+      <div class="page-header">
+        <h1 class="page-header-title">Pipeline</h1>
+        <p class="page-header-subtitle">Manage deals across standard operating procedure stages.</p>
+      </div>
+      <div class="pipeline-board">
+        ${columnsHTML}
+      </div>
+    </div>
+  `;
+}
+
+function buildDealCard(deal, user, nextStageObj) {
+  const assignee = deal.assignedTo ? Store.getUserById(deal.assignedTo) : null;
+  const initials = getInitials(assignee ? assignee.name : '?');
+  const avatarBg = assignee ? assignee.avatarColor : 'var(--color-muted)';
+
+  let actionHtml = '';
+  const canMove = nextStageObj && (user.role === 'manager' || Auth.canEditRecord(deal));
+  
+  if (canMove) {
+    actionHtml = `
+      <div class="deal-card-actions">
+        <button class="btn btn-primary btn-sm btn-full move-forward-btn" data-deal-id="${deal.id}" data-next-stage="${nextStageObj.key}">Move to ${nextStageObj.label}</button>
+      </div>
+    `;
+  }
+
+  return `
+    <div class="deal-card" data-deal-id="${deal.id}">
+      <div class="deal-card-header">
+        <h4 class="deal-card-title">${deal.title}</h4>
+      </div>
+      <div class="deal-card-value">${formatCurrency(deal.value, deal.currency)}</div>
+      <div style="margin-bottom: var(--space-xs)">
+        <span class="badge badge-neutral">${deal.priority}</span>
+      </div>
+      <div class="deal-card-footer">
+        <span class="deal-card-time">Updated ${timeAgo(deal.updatedAt)}</span>
+        <div class="avatar avatar-sm" style="background-color: ${avatarBg}" title="Assigned to ${assignee ? assignee.name : 'Unassigned'}">${initials}</div>
+      </div>
+      ${actionHtml}
+    </div>
+  `;
+}
+
+export function bindPipelineEvents() {
+  const content = document.getElementById('content-area');
+  if (!content) return;
+
+  content.addEventListener('click', (e) => {
+    const moveBtn = e.target.closest('.move-forward-btn');
+    const card = e.target.closest('.deal-card');
+
+    if (moveBtn) {
+      e.stopPropagation();
+      const dealId = moveBtn.dataset.dealId;
+      const nextStage = moveBtn.dataset.nextStage;
+      handleStageMove(dealId, nextStage);
+    } else if (card) {
+      // Navigate to deal detail
+      Router.navigate('#/deals/' + card.dataset.dealId);
+    }
+  });
+}
+
+function handleStageMove(dealId, toStage) {
+  const user = Auth.getCurrentUser();
+  const deal = Store.getDealById(dealId);
+  if (!deal || !user) return;
+
+  const fromStage = deal.stage;
+
+  // Find indexes
+  const fromIndex = SOP_STAGES.findIndex(s => s.key === fromStage);
+  const toIndex = SOP_STAGES.findIndex(s => s.key === toStage);
+
+  if (toIndex === -1) {
+    Toast.error('Invalid Stage', 'The selected stage does not exist.');
+    return;
+  }
+
+  if (fromIndex === toIndex) {
+    return; // Target is same as current, do nothing
+  }
+
+  // Validation
+  if (user.role !== 'manager') {
+    if (!Auth.canEditRecord(deal)) {
+      Toast.error('Permission Denied', 'You do not have permission to edit this deal.');
+      return;
+    }
+    if (toIndex !== fromIndex + 1) {
+      Toast.error('Invalid Move', 'You can only move a deal exactly one stage forward.');
+      return;
+    }
+  }
+
+  // Update deal
+  Store.updateDeal(deal.id, { stage: toStage });
+
+  // Log activity
+  Store.createActivity({
+    id: 'act_' + Date.now().toString(36),
+    dealId: deal.id,
+    type: 'stage_change',
+    content: `Deal moved from ${SOP_STAGES[fromIndex].label} to ${SOP_STAGES[toIndex].label}`,
+    fromStage: fromStage,
+    toStage: toStage,
+    createdBy: user.id,
+    createdAt: new Date().toISOString()
+  });
+
+  Toast.success('Stage Updated', `Moved to ${SOP_STAGES[toIndex].label}`);
+  
+  // Re-render
+  const contentEl = document.getElementById('content-area');
+  if (contentEl) {
+    contentEl.innerHTML = renderPipeline();
+  }
+}
```

## Tests Run
```text
Browser preview performed externally: Manager and Employee pipeline/deal-detail role behavior checked
```

## Risks / Pending Checks
- Review whether all changed files match the requested task.
- Confirm role access rules are not broken.
- Confirm AI/RAG/integrations/call recording were not added in this phase.

## Rollback Command
```bash
git restore --staged .
git restore .
git clean -fd
```
