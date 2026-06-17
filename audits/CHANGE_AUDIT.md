# AI Change Audit Report

## Generated On
2026-06-17_14-58-37

## Branch
main

## Baseline Commit
ce46f1d

## Task Summary
Phase 1A app shell, login, role-aware navigation, and dashboard foundation

## Git Status
```text
 A css/base.css
 A css/components.css
 A css/layout.css
 A css/variables.css
 A index.html
 A js/app.js
 A js/auth.js
 A js/components/sidebar.js
 A js/components/toast.js
 A js/components/topbar.js
 A js/pages/dashboard.js
 A js/pages/login.js
 A js/router.js
 A js/seed.js
 A js/store.js
 A js/utils.js
```

## Files Changed
```text
A	css/base.css
A	css/components.css
A	css/layout.css
A	css/variables.css
A	index.html
A	js/app.js
A	js/auth.js
A	js/components/sidebar.js
A	js/components/toast.js
A	js/components/topbar.js
A	js/pages/dashboard.js
A	js/pages/login.js
A	js/router.js
A	js/seed.js
A	js/store.js
A	js/utils.js
```

## Change Summary
```text
 css/base.css             | 138 +++++++++++
 css/components.css       | 623 +++++++++++++++++++++++++++++++++++++++++++++++
 css/layout.css           | 590 ++++++++++++++++++++++++++++++++++++++++++++
 css/variables.css        | 132 ++++++++++
 index.html               |  46 ++++
 js/app.js                | 127 ++++++++++
 js/auth.js               | 141 +++++++++++
 js/components/sidebar.js |  90 +++++++
 js/components/toast.js   |  66 +++++
 js/components/topbar.js  |  65 +++++
 js/pages/dashboard.js    | 215 ++++++++++++++++
 js/pages/login.js        | 114 +++++++++
 js/router.js             |  87 +++++++
 js/seed.js               | 365 +++++++++++++++++++++++++++
 js/store.js              | 193 +++++++++++++++
 js/utils.js              | 113 +++++++++
 16 files changed, 3105 insertions(+)
```

## Full Diff
```diff
diff --git a/css/base.css b/css/base.css
new file mode 100644
index 0000000..74dd5a3
--- /dev/null
+++ b/css/base.css
@@ -0,0 +1,138 @@
+/* ============================================================
+   TechnoEdge CRM ΓÇö Base Styles
+   Reset, font loading, global defaults
+   ============================================================ */
+
+/* ΓöÇΓöÇ Google Fonts: Inter ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
+
+/* ΓöÇΓöÇ Modern Reset ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+*,
+*::before,
+*::after {
+  margin: 0;
+  padding: 0;
+  box-sizing: border-box;
+}
+
+html {
+  font-size: 16px;
+  -webkit-font-smoothing: antialiased;
+  -moz-osx-font-smoothing: grayscale;
+  text-rendering: optimizeLegibility;
+  scroll-behavior: smooth;
+}
+
+body {
+  font: var(--text-body-md);
+  color: var(--color-ink);
+  background-color: var(--color-surface-soft);
+  min-height: 100vh;
+  overflow-x: hidden;
+}
+
+/* ΓöÇΓöÇ Typography defaults ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+h1, h2, h3, h4, h5, h6 {
+  color: var(--color-ink);
+  font-weight: 600;
+}
+
+h1 { font: var(--text-display-xl); }
+h2 { font: var(--text-display-lg); }
+h3 { font: var(--text-display-md); }
+h4 { font: var(--text-display-sm); }
+h5 { font: var(--text-title-md); }
+h6 { font: var(--text-title-sm); }
+
+p {
+  font: var(--text-body-md);
+  color: var(--color-body);
+}
+
+a {
+  color: var(--color-ink);
+  text-decoration: none;
+  transition: color var(--transition-fast);
+}
+
+a:hover {
+  color: var(--color-primary);
+}
+
+/* ΓöÇΓöÇ Lists ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+ul, ol {
+  list-style: none;
+}
+
+/* ΓöÇΓöÇ Images ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+img, svg {
+  display: block;
+  max-width: 100%;
+}
+
+/* ΓöÇΓöÇ Inputs ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+input, select, textarea, button {
+  font: inherit;
+  color: inherit;
+  border: none;
+  outline: none;
+  background: none;
+}
+
+button {
+  cursor: pointer;
+}
+
+/* ΓöÇΓöÇ Tables ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+table {
+  border-collapse: collapse;
+  width: 100%;
+}
+
+/* ΓöÇΓöÇ Selection ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+::selection {
+  background-color: var(--color-primary);
+  color: var(--color-on-primary);
+}
+
+/* ΓöÇΓöÇ Scrollbar ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+::-webkit-scrollbar {
+  width: 6px;
+  height: 6px;
+}
+
+::-webkit-scrollbar-track {
+  background: transparent;
+}
+
+::-webkit-scrollbar-thumb {
+  background: var(--color-hairline);
+  border-radius: var(--rounded-full);
+}
+
+::-webkit-scrollbar-thumb:hover {
+  background: var(--color-border-strong);
+}
+
+/* ΓöÇΓöÇ Utility: Screen reader only ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+.sr-only {
+  position: absolute;
+  width: 1px;
+  height: 1px;
+  padding: 0;
+  margin: -1px;
+  overflow: hidden;
+  clip: rect(0, 0, 0, 0);
+  white-space: nowrap;
+  border: 0;
+}
+
+/* ΓöÇΓöÇ Utility: visually hidden but focusable ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+.sr-only-focusable:focus {
+  position: static;
+  width: auto;
+  height: auto;
+  overflow: visible;
+  clip: auto;
+  white-space: normal;
+}
diff --git a/css/components.css b/css/components.css
new file mode 100644
index 0000000..0980f8a
--- /dev/null
+++ b/css/components.css
@@ -0,0 +1,623 @@
+/* ============================================================
+   TechnoEdge CRM ΓÇö Component Styles
+   Buttons, cards, badges, toasts, and shared components
+   ============================================================ */
+
+/* ΓöÇΓöÇ Buttons ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+.btn {
+  display: inline-flex;
+  align-items: center;
+  justify-content: center;
+  gap: var(--space-sm);
+  border-radius: var(--rounded-sm);
+  font: var(--text-button-md);
+  padding: 14px 24px;
+  height: 48px;
+  cursor: pointer;
+  transition: all var(--transition-fast);
+  white-space: nowrap;
+  text-decoration: none;
+  user-select: none;
+}
+
+.btn:disabled {
+  cursor: not-allowed;
+  opacity: 0.5;
+}
+
+/* Primary */
+.btn-primary {
+  background-color: var(--color-primary);
+  color: var(--color-on-primary);
+}
+
+.btn-primary:hover:not(:disabled) {
+  background-color: var(--color-primary-active);
+}
+
+.btn-primary:active:not(:disabled) {
+  transform: scale(0.98);
+}
+
+/* Secondary */
+.btn-secondary {
+  background-color: var(--color-canvas);
+  color: var(--color-ink);
+  border: 1px solid var(--color-ink);
+}
+
+.btn-secondary:hover:not(:disabled) {
+  background-color: var(--color-surface-soft);
+}
+
+/* Tertiary / Text */
+.btn-tertiary {
+  background: transparent;
+  color: var(--color-ink);
+  padding: 10px 16px;
+  height: auto;
+}
+
+.btn-tertiary:hover:not(:disabled) {
+  text-decoration: underline;
+}
+
+/* Small */
+.btn-sm {
+  font: var(--text-button-sm);
+  padding: 10px 20px;
+  height: 36px;
+}
+
+/* Full Width */
+.btn-full {
+  width: 100%;
+}
+
+/* Icon button */
+.btn-icon {
+  width: 40px;
+  height: 40px;
+  padding: 0;
+  border-radius: var(--rounded-full);
+  background: var(--color-surface-strong);
+  color: var(--color-ink);
+}
+
+.btn-icon:hover {
+  background: var(--color-hairline);
+}
+
+.btn-icon svg {
+  width: 18px;
+  height: 18px;
+  fill: currentColor;
+}
+
+/* ΓöÇΓöÇ Cards ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+.card {
+  background: var(--color-canvas);
+  border-radius: var(--rounded-md);
+  box-shadow: var(--shadow-card);
+  overflow: hidden;
+  transition: box-shadow var(--transition-fast);
+}
+
+.card:hover {
+  box-shadow: var(--shadow-dropdown);
+}
+
+.card-body {
+  padding: var(--space-lg);
+}
+
+/* ΓöÇΓöÇ Stat Cards ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+.stat-cards {
+  display: grid;
+  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
+  gap: var(--space-lg);
+  margin-bottom: var(--space-xl);
+}
+
+.stat-card {
+  background: var(--color-canvas);
+  border-radius: var(--rounded-md);
+  box-shadow: var(--shadow-card);
+  padding: var(--space-lg);
+  display: flex;
+  align-items: flex-start;
+  gap: var(--space-base);
+  transition: all var(--transition-fast);
+}
+
+.stat-card:hover {
+  transform: translateY(-2px);
+  box-shadow: var(--shadow-dropdown);
+}
+
+.stat-card-icon {
+  width: 48px;
+  height: 48px;
+  border-radius: var(--rounded-sm);
+  display: flex;
+  align-items: center;
+  justify-content: center;
+  flex-shrink: 0;
+}
+
+.stat-card-icon svg {
+  width: 24px;
+  height: 24px;
+  fill: currentColor;
+}
+
+.stat-card-content {
+  flex: 1;
+  min-width: 0;
+}
+
+.stat-card-label {
+  font: var(--text-body-sm);
+  color: var(--color-muted);
+  margin-bottom: var(--space-xs);
+}
+
+.stat-card-value {
+  font: var(--text-display-lg);
+  color: var(--color-ink);
+  margin-bottom: var(--space-xxs);
+}
+
+.stat-card-change {
+  font: var(--text-caption-sm);
+  display: flex;
+  align-items: center;
+  gap: var(--space-xs);
+}
+
+.stat-card-change.positive {
+  color: var(--color-success);
+}
+
+.stat-card-change.negative {
+  color: var(--color-error);
+}
+
+/* ΓöÇΓöÇ Badges ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+.badge {
+  display: inline-flex;
+  align-items: center;
+  gap: var(--space-xs);
+  font: var(--text-badge);
+  padding: 4px 10px;
+  border-radius: var(--rounded-full);
+  white-space: nowrap;
+}
+
+.badge-primary {
+  background: var(--color-primary-disabled);
+  color: var(--color-primary);
+}
+
+.badge-success {
+  background: var(--color-success-soft);
+  color: var(--color-success);
+}
+
+.badge-warning {
+  background: var(--color-warning-soft);
+  color: var(--color-warning);
+}
+
+.badge-info {
+  background: var(--color-info-soft);
+  color: var(--color-info);
+}
+
+.badge-error {
+  background: var(--color-error-soft);
+  color: var(--color-error);
+}
+
+.badge-neutral {
+  background: var(--color-surface-strong);
+  color: var(--color-muted);
+}
+
+/* Role badges */
+.role-badge {
+  font: var(--text-badge);
+  padding: 4px 10px;
+  border-radius: var(--rounded-full);
+}
+
+.role-badge-manager {
+  background: var(--color-primary-disabled);
+  color: var(--color-primary);
+}
+
+.role-badge-team_lead {
+  background: var(--color-info-soft);
+  color: var(--color-info);
+}
+
+.role-badge-employee {
+  background: var(--color-success-soft);
+  color: var(--color-success);
+}
+
+/* Stage badges */
+.stage-badge {
+  font: var(--text-badge);
+  padding: 4px 10px;
+  border-radius: var(--rounded-full);
+  color: var(--color-on-primary);
+}
+
+.stage-badge-sales        { background: var(--color-stage-sales); }
+.stage-badge-requirement   { background: var(--color-stage-requirement); }
+.stage-badge-sourcing      { background: var(--color-stage-sourcing); }
+.stage-badge-delivery      { background: var(--color-stage-delivery); }
+.stage-badge-feedback      { background: var(--color-stage-feedback); }
+.stage-badge-invoice       { background: var(--color-stage-invoice); }
+.stage-badge-renewal       { background: var(--color-stage-renewal); }
+
+/* ΓöÇΓöÇ Avatar ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+.avatar {
+  width: 40px;
+  height: 40px;
+  border-radius: var(--rounded-full);
+  display: inline-flex;
+  align-items: center;
+  justify-content: center;
+  font: var(--text-caption);
+  font-weight: 700;
+  color: var(--color-on-primary);
+  flex-shrink: 0;
+}
+
+.avatar-sm { width: 32px; height: 32px; font-size: 12px; }
+.avatar-lg { width: 56px; height: 56px; font-size: 20px; }
+.avatar-xl { width: 80px; height: 80px; font-size: 28px; }
+
+/* ΓöÇΓöÇ Toast Notifications ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+.toast-container {
+  position: fixed;
+  top: var(--space-lg);
+  right: var(--space-lg);
+  z-index: 9999;
+  display: flex;
+  flex-direction: column;
+  gap: var(--space-sm);
+  pointer-events: none;
+}
+
+.toast {
+  display: flex;
+  align-items: center;
+  gap: var(--space-md);
+  min-width: 320px;
+  max-width: 480px;
+  padding: var(--space-base) var(--space-lg);
+  background: var(--color-canvas);
+  border-radius: var(--rounded-sm);
+  box-shadow: var(--shadow-dropdown);
+  pointer-events: all;
+  animation: toastSlideIn var(--transition-base);
+  border-left: 4px solid var(--color-ink);
+}
+
+.toast.toast-leaving {
+  animation: toastSlideOut var(--transition-fast) forwards;
+}
+
+.toast-success { border-left-color: var(--color-success); }
+.toast-error   { border-left-color: var(--color-error); }
+.toast-warning { border-left-color: var(--color-warning); }
+.toast-info    { border-left-color: var(--color-info); }
+
+.toast-icon {
+  width: 20px;
+  height: 20px;
+  flex-shrink: 0;
+}
+
+.toast-icon svg {
+  width: 20px;
+  height: 20px;
+  fill: currentColor;
+}
+
+.toast-success .toast-icon { color: var(--color-success); }
+.toast-error   .toast-icon { color: var(--color-error); }
+.toast-warning .toast-icon { color: var(--color-warning); }
+.toast-info    .toast-icon { color: var(--color-info); }
+
+.toast-content {
+  flex: 1;
+}
+
+.toast-title {
+  font: var(--text-caption);
+  color: var(--color-ink);
+}
+
+.toast-message {
+  font: var(--text-body-sm);
+  color: var(--color-muted);
+}
+
+.toast-close {
+  width: 24px;
+  height: 24px;
+  border-radius: var(--rounded-full);
+  display: flex;
+  align-items: center;
+  justify-content: center;
+  color: var(--color-muted);
+  cursor: pointer;
+  transition: all var(--transition-fast);
+  flex-shrink: 0;
+}
+
+.toast-close:hover {
+  background: var(--color-surface-soft);
+  color: var(--color-ink);
+}
+
+.toast-close svg {
+  width: 14px;
+  height: 14px;
+  fill: currentColor;
+}
+
+@keyframes toastSlideIn {
+  from {
+    opacity: 0;
+    transform: translateX(100%);
+  }
+  to {
+    opacity: 1;
+    transform: translateX(0);
+  }
+}
+
+@keyframes toastSlideOut {
+  from {
+    opacity: 1;
+    transform: translateX(0);
+  }
+  to {
+    opacity: 0;
+    transform: translateX(100%);
+  }
+}
+
+/* ΓöÇΓöÇ Empty State ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+.empty-state {
+  display: flex;
+  flex-direction: column;
+  align-items: center;
+  justify-content: center;
+  padding: var(--space-section);
+  text-align: center;
+}
+
+.empty-state-icon {
+  width: 64px;
+  height: 64px;
+  background: var(--color-surface-soft);
+  border-radius: var(--rounded-full);
+  display: flex;
+  align-items: center;
+  justify-content: center;
+  margin-bottom: var(--space-lg);
+}
+
+.empty-state-icon svg {
+  width: 32px;
+  height: 32px;
+  fill: var(--color-muted-soft);
+}
+
+.empty-state-title {
+  font: var(--text-title-md);
+  color: var(--color-ink);
+  margin-bottom: var(--space-sm);
+}
+
+.empty-state-desc {
+  font: var(--text-body-sm);
+  color: var(--color-muted);
+  max-width: 360px;
+  margin-bottom: var(--space-lg);
+}
+
+/* ΓöÇΓöÇ Dashboard Sections ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+.dashboard-greeting {
+  margin-bottom: var(--space-xl);
+}
+
+.dashboard-greeting-text {
+  font: var(--text-display-xl);
+  color: var(--color-ink);
+  margin-bottom: var(--space-xs);
+}
+
+.dashboard-greeting-sub {
+  font: var(--text-body-md);
+  color: var(--color-muted);
+  display: flex;
+  align-items: center;
+  gap: var(--space-sm);
+}
+
+.dashboard-section {
+  margin-bottom: var(--space-xl);
+}
+
+.dashboard-section-header {
+  display: flex;
+  align-items: center;
+  justify-content: space-between;
+  margin-bottom: var(--space-base);
+}
+
+.dashboard-section-title {
+  font: var(--text-display-sm);
+  color: var(--color-ink);
+}
+
+/* ΓöÇΓöÇ Pipeline Mini Bar ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+.pipeline-mini {
+  background: var(--color-canvas);
+  border-radius: var(--rounded-md);
+  box-shadow: var(--shadow-card);
+  padding: var(--space-lg);
+}
+
+.pipeline-mini-bar {
+  display: flex;
+  gap: 2px;
+  height: 8px;
+  border-radius: var(--rounded-full);
+  overflow: hidden;
+  margin-bottom: var(--space-base);
+}
+
+.pipeline-mini-segment {
+  flex: 1;
+  border-radius: var(--rounded-full);
+  transition: flex var(--transition-base);
+}
+
+.pipeline-mini-legend {
+  display: flex;
+  flex-wrap: wrap;
+  gap: var(--space-base);
+}
+
+.pipeline-mini-legend-item {
+  display: flex;
+  align-items: center;
+  gap: var(--space-xs);
+  font: var(--text-caption-sm);
+  color: var(--color-muted);
+}
+
+.pipeline-mini-legend-dot {
+  width: 8px;
+  height: 8px;
+  border-radius: var(--rounded-full);
+  flex-shrink: 0;
+}
+
+/* ΓöÇΓöÇ Activity Feed ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+.activity-feed {
+  background: var(--color-canvas);
+  border-radius: var(--rounded-md);
+  box-shadow: var(--shadow-card);
+}
+
+.activity-feed-header {
+  padding: var(--space-lg);
+  border-bottom: 1px solid var(--color-hairline-soft);
+}
+
+.activity-feed-title {
+  font: var(--text-title-md);
+  color: var(--color-ink);
+}
+
+.activity-feed-list {
+  padding: var(--space-sm) 0;
+}
+
+.activity-feed-item {
+  display: flex;
+  align-items: flex-start;
+  gap: var(--space-md);
+  padding: var(--space-md) var(--space-lg);
+  transition: background var(--transition-fast);
+}
+
+.activity-feed-item:hover {
+  background: var(--color-surface-soft);
+}
+
+.activity-feed-dot {
+  width: 8px;
+  height: 8px;
+  border-radius: var(--rounded-full);
+  background: var(--color-primary);
+  margin-top: 6px;
+  flex-shrink: 0;
+}
+
+.activity-feed-content {
+  flex: 1;
+}
+
+.activity-feed-text {
+  font: var(--text-body-sm);
+  color: var(--color-ink);
+}
+
+.activity-feed-time {
+  font: var(--text-caption-sm);
+  color: var(--color-muted-soft);
+  margin-top: var(--space-xxs);
+}
+
+.activity-feed-empty {
+  padding: var(--space-xl);
+  text-align: center;
+  font: var(--text-body-sm);
+  color: var(--color-muted);
+}
+
+/* ΓöÇΓöÇ Quick Actions ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+.quick-actions {
+  display: flex;
+  gap: var(--space-md);
+  flex-wrap: wrap;
+}
+
+/* ΓöÇΓöÇ "Coming Soon" placeholder ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+.coming-soon {
+  display: flex;
+  flex-direction: column;
+  align-items: center;
+  justify-content: center;
+  min-height: 400px;
+  text-align: center;
+}
+
+.coming-soon-icon {
+  width: 80px;
+  height: 80px;
+  background: var(--color-surface-soft);
+  border-radius: var(--rounded-full);
+  display: flex;
+  align-items: center;
+  justify-content: center;
+  margin-bottom: var(--space-lg);
+}
+
+.coming-soon-icon svg {
+  width: 40px;
+  height: 40px;
+  fill: var(--color-muted-soft);
+}
+
+.coming-soon-title {
+  font: var(--text-display-sm);
+  color: var(--color-ink);
+  margin-bottom: var(--space-sm);
+}
+
+.coming-soon-desc {
+  font: var(--text-body-md);
+  color: var(--color-muted);
+  max-width: 400px;
+}
diff --git a/css/layout.css b/css/layout.css
new file mode 100644
index 0000000..8e4e264
--- /dev/null
+++ b/css/layout.css
@@ -0,0 +1,590 @@
+/* ============================================================
+   TechnoEdge CRM ΓÇö Layout
+   App shell: sidebar, topbar, content area
+   ============================================================ */
+
+/* ΓöÇΓöÇ App Shell ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+.app-shell {
+  display: flex;
+  min-height: 100vh;
+}
+
+/* Hide shell when on login page */
+.app-shell.is-login {
+  display: none;
+}
+
+/* ΓöÇΓöÇ Sidebar ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+.sidebar {
+  position: fixed;
+  top: 0;
+  left: 0;
+  bottom: 0;
+  width: var(--sidebar-width);
+  background-color: var(--color-canvas);
+  border-right: 1px solid var(--color-hairline-soft);
+  display: flex;
+  flex-direction: column;
+  z-index: 100;
+  transition: width var(--transition-base);
+  overflow: hidden;
+}
+
+/* ΓöÇΓöÇ Sidebar: Brand ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+.sidebar-brand {
+  display: flex;
+  align-items: center;
+  gap: var(--space-md);
+  padding: var(--space-lg) var(--space-lg);
+  border-bottom: 1px solid var(--color-hairline-soft);
+  min-height: var(--topbar-height);
+}
+
+.sidebar-brand-logo {
+  width: 36px;
+  height: 36px;
+  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-active) 100%);
+  border-radius: var(--rounded-sm);
+  display: flex;
+  align-items: center;
+  justify-content: center;
+  flex-shrink: 0;
+}
+
+.sidebar-brand-logo svg {
+  width: 20px;
+  height: 20px;
+  fill: var(--color-on-primary);
+}
+
+.sidebar-brand-name {
+  font: var(--text-title-md);
+  color: var(--color-ink);
+  white-space: nowrap;
+}
+
+.sidebar-brand-tag {
+  font: var(--text-uppercase-tag);
+  text-transform: uppercase;
+  letter-spacing: 0.32px;
+  color: var(--color-primary);
+  background: var(--color-primary-disabled);
+  padding: 2px 6px;
+  border-radius: var(--rounded-full);
+  margin-left: auto;
+}
+
+/* ΓöÇΓöÇ Sidebar: Navigation ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+.sidebar-nav {
+  flex: 1;
+  overflow-y: auto;
+  padding: var(--space-sm) var(--space-md);
+}
+
+.sidebar-nav-section {
+  margin-bottom: var(--space-sm);
+}
+
+.sidebar-nav-label {
+  font: var(--text-micro-label);
+  color: var(--color-muted-soft);
+  text-transform: uppercase;
+  letter-spacing: 0.5px;
+  padding: var(--space-sm) var(--space-sm);
+  margin-bottom: var(--space-xxs);
+}
+
+.sidebar-nav-item {
+  display: flex;
+  align-items: center;
+  gap: var(--space-md);
+  padding: 10px var(--space-sm);
+  border-radius: var(--rounded-sm);
+  color: var(--color-body);
+  font: var(--text-body-sm);
+  font-weight: 500;
+  cursor: pointer;
+  transition: all var(--transition-fast);
+  position: relative;
+  text-decoration: none;
+  user-select: none;
+}
+
+.sidebar-nav-item:hover {
+  background-color: var(--color-surface-soft);
+  color: var(--color-ink);
+}
+
+.sidebar-nav-item.active {
+  background-color: var(--color-primary);
+  color: var(--color-on-primary);
+}
+
+.sidebar-nav-item.active:hover {
+  background-color: var(--color-primary-active);
+  color: var(--color-on-primary);
+}
+
+.sidebar-nav-item-icon {
+  width: 20px;
+  height: 20px;
+  display: flex;
+  align-items: center;
+  justify-content: center;
+  flex-shrink: 0;
+  opacity: 0.8;
+}
+
+.sidebar-nav-item.active .sidebar-nav-item-icon {
+  opacity: 1;
+}
+
+.sidebar-nav-item-icon svg {
+  width: 20px;
+  height: 20px;
+  fill: currentColor;
+}
+
+.sidebar-nav-item-label {
+  white-space: nowrap;
+}
+
+.sidebar-nav-item-badge {
+  margin-left: auto;
+  font: var(--text-badge);
+  background: var(--color-primary);
+  color: var(--color-on-primary);
+  padding: 2px 8px;
+  border-radius: var(--rounded-full);
+  min-width: 20px;
+  text-align: center;
+}
+
+.sidebar-nav-item.active .sidebar-nav-item-badge {
+  background: rgba(255, 255, 255, 0.25);
+  color: var(--color-on-primary);
+}
+
+/* ΓöÇΓöÇ Sidebar: User Section ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+.sidebar-user {
+  padding: var(--space-base) var(--space-lg);
+  border-top: 1px solid var(--color-hairline-soft);
+  display: flex;
+  align-items: center;
+  gap: var(--space-md);
+}
+
+.sidebar-user-avatar {
+  width: 36px;
+  height: 36px;
+  border-radius: var(--rounded-full);
+  display: flex;
+  align-items: center;
+  justify-content: center;
+  font: var(--text-caption);
+  font-weight: 600;
+  color: var(--color-on-primary);
+  flex-shrink: 0;
+}
+
+.sidebar-user-info {
+  flex: 1;
+  min-width: 0;
+}
+
+.sidebar-user-name {
+  font: var(--text-caption);
+  color: var(--color-ink);
+  white-space: nowrap;
+  overflow: hidden;
+  text-overflow: ellipsis;
+}
+
+.sidebar-user-role {
+  font: var(--text-caption-sm);
+  color: var(--color-muted);
+  white-space: nowrap;
+  overflow: hidden;
+  text-overflow: ellipsis;
+}
+
+.sidebar-logout-btn {
+  width: 32px;
+  height: 32px;
+  border-radius: var(--rounded-full);
+  display: flex;
+  align-items: center;
+  justify-content: center;
+  color: var(--color-muted);
+  transition: all var(--transition-fast);
+  flex-shrink: 0;
+}
+
+.sidebar-logout-btn:hover {
+  background-color: var(--color-error-soft);
+  color: var(--color-error);
+}
+
+.sidebar-logout-btn svg {
+  width: 18px;
+  height: 18px;
+  fill: currentColor;
+}
+
+/* ΓöÇΓöÇ Topbar ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+.topbar {
+  position: fixed;
+  top: 0;
+  left: var(--sidebar-width);
+  right: 0;
+  height: var(--topbar-height);
+  background-color: var(--color-canvas);
+  border-bottom: 1px solid var(--color-hairline-soft);
+  display: flex;
+  align-items: center;
+  justify-content: space-between;
+  padding: 0 var(--space-xl);
+  z-index: 90;
+  transition: left var(--transition-base);
+}
+
+.topbar-left {
+  display: flex;
+  align-items: center;
+  gap: var(--space-base);
+}
+
+.topbar-breadcrumb {
+  display: flex;
+  align-items: center;
+  gap: var(--space-sm);
+  font: var(--text-body-sm);
+  color: var(--color-muted);
+}
+
+.topbar-breadcrumb-separator {
+  color: var(--color-hairline);
+}
+
+.topbar-breadcrumb-current {
+  font-weight: 600;
+  color: var(--color-ink);
+}
+
+.topbar-right {
+  display: flex;
+  align-items: center;
+  gap: var(--space-base);
+}
+
+.topbar-search {
+  position: relative;
+  width: 280px;
+}
+
+.topbar-search-input {
+  width: 100%;
+  height: 40px;
+  background-color: var(--color-surface-soft);
+  border: 1px solid transparent;
+  border-radius: var(--rounded-full);
+  padding: 0 var(--space-base) 0 40px;
+  font: var(--text-body-sm);
+  color: var(--color-ink);
+  transition: all var(--transition-fast);
+}
+
+.topbar-search-input::placeholder {
+  color: var(--color-muted-soft);
+}
+
+.topbar-search-input:focus {
+  background-color: var(--color-canvas);
+  border-color: var(--color-ink);
+}
+
+.topbar-search-icon {
+  position: absolute;
+  left: 14px;
+  top: 50%;
+  transform: translateY(-50%);
+  width: 16px;
+  height: 16px;
+  color: var(--color-muted-soft);
+  pointer-events: none;
+}
+
+.topbar-search-icon svg {
+  width: 16px;
+  height: 16px;
+  fill: currentColor;
+}
+
+.topbar-user {
+  display: flex;
+  align-items: center;
+  gap: var(--space-sm);
+  padding: 6px 12px 6px 6px;
+  border-radius: var(--rounded-full);
+  border: 1px solid var(--color-hairline);
+  cursor: pointer;
+  transition: all var(--transition-fast);
+}
+
+.topbar-user:hover {
+  box-shadow: var(--shadow-dropdown);
+}
+
+.topbar-user-avatar {
+  width: 30px;
+  height: 30px;
+  border-radius: var(--rounded-full);
+  display: flex;
+  align-items: center;
+  justify-content: center;
+  font: var(--text-badge);
+  font-weight: 700;
+  color: var(--color-on-primary);
+}
+
+.topbar-user-name {
+  font: var(--text-body-sm);
+  font-weight: 500;
+  color: var(--color-ink);
+}
+
+.topbar-role-badge {
+  font: var(--text-uppercase-tag);
+  text-transform: uppercase;
+  letter-spacing: 0.32px;
+  padding: 3px 8px;
+  border-radius: var(--rounded-full);
+}
+
+.topbar-role-badge.role-manager {
+  background: var(--color-primary-disabled);
+  color: var(--color-primary);
+}
+
+.topbar-role-badge.role-team_lead {
+  background: var(--color-info-soft);
+  color: var(--color-info);
+}
+
+.topbar-role-badge.role-employee {
+  background: var(--color-success-soft);
+  color: var(--color-success);
+}
+
+/* ΓöÇΓöÇ Content Area ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+.content-area {
+  margin-left: var(--sidebar-width);
+  margin-top: var(--topbar-height);
+  padding: var(--space-xl);
+  min-height: calc(100vh - var(--topbar-height));
+  transition: margin-left var(--transition-base);
+}
+
+.content-inner {
+  max-width: var(--content-max-width);
+  margin: 0 auto;
+  animation: fadeIn var(--transition-base);
+}
+
+/* ΓöÇΓöÇ Page Header ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+.page-header {
+  margin-bottom: var(--space-xl);
+}
+
+.page-header-title {
+  font: var(--text-display-xl);
+  color: var(--color-ink);
+  margin-bottom: var(--space-xs);
+}
+
+.page-header-subtitle {
+  font: var(--text-body-md);
+  color: var(--color-muted);
+}
+
+/* ΓöÇΓöÇ Login Page (full-screen, no shell) ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+.login-page {
+  min-height: 100vh;
+  display: flex;
+  align-items: center;
+  justify-content: center;
+  background: linear-gradient(135deg, #fef2f4 0%, #f7f7f7 40%, #f0f4ff 100%);
+  padding: var(--space-xl);
+}
+
+.login-card {
+  width: 100%;
+  max-width: 420px;
+  background: var(--color-canvas);
+  border-radius: var(--rounded-lg);
+  box-shadow: var(--shadow-card);
+  padding: var(--space-xxl);
+  animation: slideUp var(--transition-slow);
+}
+
+.login-brand {
+  display: flex;
+  flex-direction: column;
+  align-items: center;
+  gap: var(--space-md);
+  margin-bottom: var(--space-xl);
+}
+
+.login-brand-logo {
+  width: 56px;
+  height: 56px;
+  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-active) 100%);
+  border-radius: var(--rounded-md);
+  display: flex;
+  align-items: center;
+  justify-content: center;
+}
+
+.login-brand-logo svg {
+  width: 32px;
+  height: 32px;
+  fill: var(--color-on-primary);
+}
+
+.login-brand-name {
+  font: var(--text-display-sm);
+  color: var(--color-ink);
+}
+
+.login-brand-desc {
+  font: var(--text-body-sm);
+  color: var(--color-muted);
+  text-align: center;
+}
+
+.login-divider {
+  height: 1px;
+  background: var(--color-hairline-soft);
+  margin: var(--space-lg) 0;
+}
+
+.login-label {
+  font: var(--text-caption);
+  color: var(--color-ink);
+  margin-bottom: var(--space-sm);
+  display: block;
+}
+
+.login-select-wrapper {
+  position: relative;
+  margin-bottom: var(--space-lg);
+}
+
+.login-select {
+  width: 100%;
+  height: 56px;
+  background-color: var(--color-canvas);
+  border: 1px solid var(--color-hairline);
+  border-radius: var(--rounded-sm);
+  padding: 0 var(--space-base);
+  font: var(--text-body-md);
+  color: var(--color-ink);
+  appearance: none;
+  cursor: pointer;
+  transition: border-color var(--transition-fast);
+}
+
+.login-select:focus {
+  border-color: var(--color-ink);
+  border-width: 2px;
+  padding: 0 calc(var(--space-base) - 1px);
+}
+
+.login-select-arrow {
+  position: absolute;
+  right: var(--space-base);
+  top: 50%;
+  transform: translateY(-50%);
+  width: 16px;
+  height: 16px;
+  color: var(--color-muted);
+  pointer-events: none;
+}
+
+.login-select-arrow svg {
+  width: 16px;
+  height: 16px;
+  fill: currentColor;
+}
+
+.login-role-preview {
+  background: var(--color-surface-soft);
+  border-radius: var(--rounded-sm);
+  padding: var(--space-base);
+  margin-bottom: var(--space-lg);
+  animation: fadeIn var(--transition-fast);
+}
+
+.login-role-preview-title {
+  font: var(--text-caption);
+  color: var(--color-ink);
+  margin-bottom: var(--space-xs);
+}
+
+.login-role-preview-desc {
+  font: var(--text-body-sm);
+  color: var(--color-muted);
+}
+
+/* ΓöÇΓöÇ Animations ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+@keyframes fadeIn {
+  from { opacity: 0; }
+  to   { opacity: 1; }
+}
+
+@keyframes slideUp {
+  from {
+    opacity: 0;
+    transform: translateY(16px);
+  }
+  to {
+    opacity: 1;
+    transform: translateY(0);
+  }
+}
+
+@keyframes slideDown {
+  from {
+    opacity: 0;
+    transform: translateY(-8px);
+  }
+  to {
+    opacity: 1;
+    transform: translateY(0);
+  }
+}
+
+/* ΓöÇΓöÇ Responsive ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+@media (max-width: 1128px) {
+  .topbar-search {
+    width: 200px;
+  }
+}
+
+@media (max-width: 744px) {
+  .sidebar {
+    transform: translateX(-100%);
+  }
+
+  .sidebar.is-open {
+    transform: translateX(0);
+  }
+
+  .topbar {
+    left: 0;
+  }
+
+  .content-area {
+    margin-left: 0;
+  }
+}
diff --git a/css/variables.css b/css/variables.css
new file mode 100644
index 0000000..cb349f7
--- /dev/null
+++ b/css/variables.css
@@ -0,0 +1,132 @@
+/* ============================================================
+   TechnoEdge CRM ΓÇö Design Tokens
+   Source of truth: DESIGN.md (Airbnb-inspired system)
+   Font substitute: Inter (for Airbnb Cereal VF)
+   ============================================================ */
+
+:root {
+  /* ΓöÇΓöÇ Brand & Accent ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+  --color-primary:            #ff385c;
+  --color-primary-active:     #e00b41;
+  --color-primary-disabled:   #ffd1da;
+  --color-primary-error:      #c13515;
+  --color-primary-error-hover:#b32505;
+
+  /* Sub-brand (reserved for future phases) */
+  --color-luxe:               #460479;
+  --color-plus:               #92174d;
+
+  /* ΓöÇΓöÇ Text ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+  --color-ink:                #222222;
+  --color-body:               #3f3f3f;
+  --color-muted:              #6a6a6a;
+  --color-muted-soft:         #929292;
+  --color-on-primary:         #ffffff;
+  --color-on-dark:            #ffffff;
+  --color-legal-link:         #428bff;
+  --color-star-rating:        #222222;
+
+  /* ΓöÇΓöÇ Surfaces ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+  --color-canvas:             #ffffff;
+  --color-surface-soft:       #f7f7f7;
+  --color-surface-card:       #ffffff;
+  --color-surface-strong:     #f2f2f2;
+
+  /* ΓöÇΓöÇ Borders & Hairlines ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+  --color-hairline:           #dddddd;
+  --color-hairline-soft:      #ebebeb;
+  --color-border-strong:      #c1c1c1;
+
+  /* ΓöÇΓöÇ Scrim ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+  --color-scrim:              rgba(0, 0, 0, 0.5);
+
+  /* ΓöÇΓöÇ Semantic (CRM-specific) ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+  --color-success:            #008a05;
+  --color-success-soft:       #e6f6e6;
+  --color-warning:            #c58000;
+  --color-warning-soft:       #fff4e0;
+  --color-info:               #0969da;
+  --color-info-soft:          #ddf4ff;
+  --color-error:              #c13515;
+  --color-error-soft:         #ffebe9;
+
+  /* ΓöÇΓöÇ Pipeline Stage Colors ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+  --color-stage-sales:        #ff385c;
+  --color-stage-requirement:  #e36414;
+  --color-stage-sourcing:     #c58000;
+  --color-stage-delivery:     #0969da;
+  --color-stage-feedback:     #8250df;
+  --color-stage-invoice:      #008a05;
+  --color-stage-renewal:      #0e8a6e;
+
+  /* ΓöÇΓöÇ Typography ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+  --font-family:              'Inter', -apple-system, system-ui, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
+
+  /* Display */
+  --text-display-xl:          700 28px/1.43 var(--font-family);
+  --text-display-lg:          500 22px/1.18 var(--font-family);
+  --text-display-md:          700 21px/1.43 var(--font-family);
+  --text-display-sm:          600 20px/1.20 var(--font-family);
+
+  /* Title */
+  --text-title-md:            600 16px/1.25 var(--font-family);
+  --text-title-sm:            500 16px/1.25 var(--font-family);
+
+  /* Body */
+  --text-body-md:             400 16px/1.5 var(--font-family);
+  --text-body-sm:             400 14px/1.43 var(--font-family);
+
+  /* Caption */
+  --text-caption:             500 14px/1.29 var(--font-family);
+  --text-caption-sm:          400 13px/1.23 var(--font-family);
+
+  /* Badge / Micro */
+  --text-badge:               600 11px/1.18 var(--font-family);
+  --text-micro-label:         700 12px/1.33 var(--font-family);
+  --text-uppercase-tag:       700 8px/1.25 var(--font-family);
+
+  /* Button */
+  --text-button-md:           500 16px/1.25 var(--font-family);
+  --text-button-sm:           500 14px/1.29 var(--font-family);
+
+  /* Link / Nav */
+  --text-link:                400 14px/1.43 var(--font-family);
+  --text-nav-link:            600 16px/1.25 var(--font-family);
+
+  /* ΓöÇΓöÇ Spacing ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+  --space-xxs:                2px;
+  --space-xs:                 4px;
+  --space-sm:                 8px;
+  --space-md:                 12px;
+  --space-base:               16px;
+  --space-lg:                 24px;
+  --space-xl:                 32px;
+  --space-xxl:                48px;
+  --space-section:            64px;
+
+  /* ΓöÇΓöÇ Border Radius ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+  --rounded-none:             0px;
+  --rounded-xs:               4px;
+  --rounded-sm:               8px;
+  --rounded-md:               14px;
+  --rounded-lg:               20px;
+  --rounded-xl:               32px;
+  --rounded-full:             9999px;
+
+  /* ΓöÇΓöÇ Elevation ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+  --shadow-card:              rgba(0, 0, 0, 0.02) 0 0 0 1px,
+                              rgba(0, 0, 0, 0.04) 0 2px 6px 0,
+                              rgba(0, 0, 0, 0.1) 0 4px 8px 0;
+  --shadow-dropdown:          0 2px 16px rgba(0, 0, 0, 0.12);
+
+  /* ΓöÇΓöÇ Layout ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+  --sidebar-width:            260px;
+  --sidebar-collapsed-width:  72px;
+  --topbar-height:            64px;
+  --content-max-width:        1280px;
+
+  /* ΓöÇΓöÇ Transitions ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+  --transition-fast:          150ms ease;
+  --transition-base:          250ms ease;
+  --transition-slow:          350ms ease;
+}
diff --git a/index.html b/index.html
new file mode 100644
index 0000000..0b78a5b
--- /dev/null
+++ b/index.html
@@ -0,0 +1,46 @@
+<!DOCTYPE html>
+<html lang="en">
+<head>
+  <meta charset="UTF-8" />
+  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
+  <meta name="description" content="TechnoEdge CRM ΓÇö SOP-driven sales pipeline management with role-based access control." />
+  <meta name="theme-color" content="#ff385c" />
+  <title>TechnoEdge CRM</title>
+
+  <!-- Stylesheets (order matters: tokens ΓåÆ reset ΓåÆ layout ΓåÆ components) -->
+  <link rel="stylesheet" href="css/variables.css" />
+  <link rel="stylesheet" href="css/base.css" />
+  <link rel="stylesheet" href="css/layout.css" />
+  <link rel="stylesheet" href="css/components.css" />
+
+  <!-- Favicon (inline SVG data URI) -->
+  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ff385c'><path d='M13 3L4 14h5v7l9-11h-5V3z'/></svg>" />
+</head>
+<body>
+  <!-- 
+    App Structure:
+    - #app: Login page renders here (full-screen, no shell)
+    - #app-shell: Sidebar + Topbar + Content (hidden during login)
+  -->
+
+  <!-- Login / overlay pages render here -->
+  <div id="app"></div>
+
+  <!-- Authenticated app shell -->
+  <div class="app-shell is-login" id="app-shell">
+    <!-- Sidebar (injected by JS) -->
+    <div id="sidebar-root"></div>
+
+    <!-- Topbar (injected by JS) -->
+    <div id="topbar-root"></div>
+
+    <!-- Main content area -->
+    <main class="content-area" id="content-area">
+      <!-- Page content injected by router -->
+    </main>
+  </div>
+
+  <!-- App bootstrap -->
+  <script type="module" src="js/app.js"></script>
+</body>
+</html>
diff --git a/js/app.js b/js/app.js
new file mode 100644
index 0000000..8d0a6c4
--- /dev/null
+++ b/js/app.js
@@ -0,0 +1,127 @@
+// ============================================================
+// TechnoEdge CRM ΓÇö App Entry Point
+// Bootstrap, seed, routing, page rendering
+// ============================================================
+
+import { seedData } from './seed.js';
+import { Auth } from './auth.js';
+import { Router } from './router.js';
+import { Toast } from './components/toast.js';
+import { renderSidebar, bindSidebarEvents } from './components/sidebar.js';
+import { renderTopbar } from './components/topbar.js';
+import { renderLoginPage, bindLoginEvents } from './pages/login.js';
+import { renderDashboard } from './pages/dashboard.js';
+
+// ΓöÇΓöÇ DOM References ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+const appEl      = document.getElementById('app');
+const shellEl    = document.getElementById('app-shell');
+const sidebarEl  = document.getElementById('sidebar-root');
+const topbarEl   = document.getElementById('topbar-root');
+const contentEl  = document.getElementById('content-area');
+
+// ΓöÇΓöÇ Coming Soon page (placeholder for unbuilt pages) ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+const COMING_SOON_ICONS = {
+  pipeline: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>',
+  leads:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>',
+  contacts: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
+  deals:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>',
+  team:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>',
+  reports:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
+  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68 1.65 1.65 0 0010 3.17V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>'
+};
+
+const PAGE_LABELS = {
+  pipeline: 'Pipeline',
+  leads:    'Leads',
+  contacts: 'Contacts',
+  deals:    'Deals',
+  team:     'Team',
+  reports:  'Reports',
+  settings: 'Settings'
+};
+
+function renderComingSoon(pageId) {
+  const icon = COMING_SOON_ICONS[pageId] || '';
+  const label = PAGE_LABELS[pageId] || pageId;
+  return `
+    <div class="content-inner">
+      <div class="coming-soon">
+        <div class="coming-soon-icon">${icon}</div>
+        <h3 class="coming-soon-title">${label}</h3>
+        <p class="coming-soon-desc">
+          This section is coming in the next phase. 
+          The foundation is ready ΓÇö full ${label.toLowerCase()} management will be built soon.
+        </p>
+      </div>
+    </div>
+  `;
+}
+
+// ΓöÇΓöÇ Page Rendering ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+function renderPage(pageId, params) {
+
+  // ΓöÇΓöÇ LOGIN PAGE (no shell) ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+  if (pageId === 'login') {
+    shellEl.classList.add('is-login');
+    appEl.innerHTML = renderLoginPage();
+    bindLoginEvents((user) => {
+      Router.navigate('#/dashboard');
+    });
+    return;
+  }
+
+  // ΓöÇΓöÇ AUTHENTICATED PAGES (with shell) ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+  shellEl.classList.remove('is-login');
+  appEl.innerHTML = '';
+
+  // Render sidebar & topbar
+  sidebarEl.innerHTML = renderSidebar(pageId);
+  topbarEl.innerHTML = renderTopbar(pageId);
+
+  // Bind sidebar logout
+  bindSidebarEvents(() => {
+    Auth.logout();
+    Toast.info('Signed out', 'You have been logged out.');
+    Router.navigate('#/login');
+  });
+
+  // Render page content
+  switch (pageId) {
+    case 'dashboard':
+      contentEl.innerHTML = renderDashboard();
+      break;
+    case 'pipeline':
+    case 'leads':
+    case 'contacts':
+    case 'deals':
+    case 'team':
+    case 'reports':
+    case 'settings':
+      contentEl.innerHTML = renderComingSoon(pageId);
+      break;
+    default:
+      contentEl.innerHTML = renderComingSoon(pageId);
+  }
+}
+
+// ΓöÇΓöÇ Bootstrap ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+function init() {
+  // Seed demo data on first run
+  seedData();
+
+  // Initialize router
+  Router.init(renderPage);
+
+  console.log('TechnoEdge CRM initialized.');
+}
+
+// Start the app when DOM is ready
+if (document.readyState === 'loading') {
+  document.addEventListener('DOMContentLoaded', init);
+} else {
+  init();
+}
diff --git a/js/auth.js b/js/auth.js
new file mode 100644
index 0000000..da17883
--- /dev/null
+++ b/js/auth.js
@@ -0,0 +1,141 @@
+// ============================================================
+// TechnoEdge CRM ΓÇö Authentication & Role Access
+// Login, logout, session, permission checks
+// ============================================================
+
+import { Store } from './store.js';
+
+// ΓöÇΓöÇ Navigation items with role visibility ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+const NAV_ITEMS = [
+  { id: 'dashboard', label: 'Dashboard',  hash: '#/dashboard', icon: 'dashboard', roles: ['manager', 'team_lead', 'employee'] },
+  { id: 'pipeline',  label: 'Pipeline',   hash: '#/pipeline',  icon: 'pipeline',  roles: ['manager', 'team_lead', 'employee'] },
+  { id: 'leads',     label: 'Leads',      hash: '#/leads',     icon: 'leads',     roles: ['manager', 'team_lead', 'employee'] },
+  { id: 'contacts',  label: 'Contacts',   hash: '#/contacts',  icon: 'contacts',  roles: ['manager', 'team_lead', 'employee'] },
+  { id: 'deals',     label: 'Deals',      hash: '#/deals',     icon: 'deals',     roles: ['manager', 'team_lead', 'employee'] },
+  { id: 'team',      label: 'Team',       hash: '#/team',      icon: 'team',      roles: ['manager', 'team_lead'] },
+  { id: 'reports',   label: 'Reports',    hash: '#/reports',   icon: 'reports',   roles: ['manager'] },
+  { id: 'settings',  label: 'Settings',   hash: '#/settings',  icon: 'settings',  roles: ['manager', 'team_lead', 'employee'] }
+];
+
+// ΓöÇΓöÇ Auth Module ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+export const Auth = {
+
+  // Get current logged-in user (full object)
+  getCurrentUser() {
+    const session = Store.getSession();
+    if (!session || !session.userId) return null;
+    return Store.getUserById(session.userId);
+  },
+
+  // Check if a user is logged in
+  isLoggedIn() {
+    return Auth.getCurrentUser() !== null;
+  },
+
+  // Log in as a user (by ID)
+  login(userId) {
+    const user = Store.getUserById(userId);
+    if (!user) return null;
+    Store.setSession({
+      userId: user.id,
+      loginAt: new Date().toISOString()
+    });
+    return user;
+  },
+
+  // Log out
+  logout() {
+    Store.clearSession();
+  },
+
+  // Get nav items for current user's role
+  getNavItems() {
+    const user = Auth.getCurrentUser();
+    if (!user) return [];
+    return NAV_ITEMS.filter(item => item.roles.includes(user.role));
+  },
+
+  // Check if current user can access a specific page
+  canAccessPage(pageId) {
+    const user = Auth.getCurrentUser();
+    if (!user) return false;
+    const navItem = NAV_ITEMS.find(item => item.id === pageId);
+    if (!navItem) return false;
+    return navItem.roles.includes(user.role);
+  },
+
+  // ΓöÇΓöÇ Permission checks per ROLE_ACCESS_MATRIX.md ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+  canApprove() {
+    const user = Auth.getCurrentUser();
+    return user && user.role === 'manager';
+  },
+
+  canAssign() {
+    const user = Auth.getCurrentUser();
+    return user && (user.role === 'manager' || user.role === 'team_lead');
+  },
+
+  canAssignTo(targetUserId) {
+    const user = Auth.getCurrentUser();
+    if (!user) return false;
+    if (user.role === 'manager') return true;
+    if (user.role === 'team_lead') {
+      const target = Store.getUserById(targetUserId);
+      return target && target.teamId === user.teamId;
+    }
+    return false;
+  },
+
+  canOverrideStage() {
+    const user = Auth.getCurrentUser();
+    return user && user.role === 'manager';
+  },
+
+  canViewReports() {
+    const user = Auth.getCurrentUser();
+    return user && user.role === 'manager';
+  },
+
+  canManageTeam(teamId) {
+    const user = Auth.getCurrentUser();
+    if (!user) return false;
+    if (user.role === 'manager') return true;
+    if (user.role === 'team_lead') return user.teamId === teamId;
+    return false;
+  },
+
+  canDeleteRecord() {
+    const user = Auth.getCurrentUser();
+    return user && user.role === 'manager';
+  },
+
+  canEditRecord(record) {
+    const user = Auth.getCurrentUser();
+    if (!user) return false;
+    if (user.role === 'manager') return true;
+    if (user.role === 'team_lead') {
+      if (!record.teamId && !record.assignedTo) return true;
+      if (record.teamId === user.teamId) return true;
+      const teamMembers = Store.getUsersByTeam(user.teamId).map(u => u.id);
+      return teamMembers.includes(record.assignedTo);
+    }
+    return record.assignedTo === user.id;
+  },
+
+  canViewRecord(record) {
+    const user = Auth.getCurrentUser();
+    if (!user) return false;
+    if (user.role === 'manager') return true;
+    if (user.role === 'team_lead') {
+      if (!record.assignedTo) return true;
+      if (record.teamId === user.teamId) return true;
+      const teamMembers = Store.getUsersByTeam(user.teamId).map(u => u.id);
+      teamMembers.push(user.id);
+      return teamMembers.includes(record.assignedTo);
+    }
+    return record.assignedTo === user.id;
+  }
+};
diff --git a/js/components/sidebar.js b/js/components/sidebar.js
new file mode 100644
index 0000000..cb9df9b
--- /dev/null
+++ b/js/components/sidebar.js
@@ -0,0 +1,90 @@
+// ============================================================
+// TechnoEdge CRM ΓÇö Sidebar Component
+// Role-based navigation sidebar
+// ============================================================
+
+import { Auth } from '../auth.js';
+import { getInitials, formatRole } from '../utils.js';
+
+// SVG icons for navigation items
+const NAV_ICONS = {
+  dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
+  pipeline:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
+  leads:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
+  contacts:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
+  deals:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>',
+  team:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
+  reports:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
+  settings:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>'
+};
+
+const LOGOUT_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>';
+
+const BRAND_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 3L4 14h5v7l9-11h-5V3z"/></svg>';
+
+export function renderSidebar(activePageId) {
+  const user = Auth.getCurrentUser();
+  if (!user) return '';
+
+  const navItems = Auth.getNavItems();
+  const initials = getInitials(user.name);
+  const roleName = formatRole(user.role);
+
+  const navHTML = navItems.map(item => {
+    const isActive = item.id === activePageId;
+    const icon = NAV_ICONS[item.icon] || '';
+    return `
+      <a href="${item.hash}" 
+         class="sidebar-nav-item ${isActive ? 'active' : ''}" 
+         data-page="${item.id}"
+         id="nav-${item.id}">
+        <span class="sidebar-nav-item-icon">${icon}</span>
+        <span class="sidebar-nav-item-label">${item.label}</span>
+      </a>
+    `;
+  }).join('');
+
+  return `
+    <div class="sidebar" id="sidebar">
+      <div class="sidebar-brand">
+        <div class="sidebar-brand-logo">
+          ${BRAND_ICON}
+        </div>
+        <div>
+          <div class="sidebar-brand-name">TechnoEdge</div>
+        </div>
+        <span class="sidebar-brand-tag">CRM</span>
+      </div>
+
+      <nav class="sidebar-nav">
+        <div class="sidebar-nav-section">
+          <div class="sidebar-nav-label">Menu</div>
+          ${navHTML}
+        </div>
+      </nav>
+
+      <div class="sidebar-user">
+        <div class="sidebar-user-avatar" style="background-color: ${user.avatarColor}">
+          ${initials}
+        </div>
+        <div class="sidebar-user-info">
+          <div class="sidebar-user-name">${user.name}</div>
+          <div class="sidebar-user-role">${roleName}</div>
+        </div>
+        <button class="sidebar-logout-btn" id="sidebar-logout-btn" title="Logout">
+          ${LOGOUT_ICON}
+        </button>
+      </div>
+    </div>
+  `;
+}
+
+export function bindSidebarEvents(onLogout) {
+  const logoutBtn = document.getElementById('sidebar-logout-btn');
+  if (logoutBtn) {
+    logoutBtn.addEventListener('click', (e) => {
+      e.preventDefault();
+      if (onLogout) onLogout();
+    });
+  }
+}
diff --git a/js/components/toast.js b/js/components/toast.js
new file mode 100644
index 0000000..8733d15
--- /dev/null
+++ b/js/components/toast.js
@@ -0,0 +1,66 @@
+// ============================================================
+// TechnoEdge CRM ΓÇö Toast Notifications
+// Slide-in toast system with auto-dismiss
+// ============================================================
+
+let container = null;
+
+function ensureContainer() {
+  if (!container) {
+    container = document.createElement('div');
+    container.className = 'toast-container';
+    container.id = 'toast-container';
+    document.body.appendChild(container);
+  }
+  return container;
+}
+
+const ICONS = {
+  success: '<svg viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>',
+  error:   '<svg viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/></svg>',
+  warning: '<svg viewBox="0 0 20 20"><path d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"/></svg>',
+  info:    '<svg viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/></svg>'
+};
+
+function createToast(type, title, message, duration = 4000) {
+  const c = ensureContainer();
+
+  const toast = document.createElement('div');
+  toast.className = `toast toast-${type}`;
+  toast.innerHTML = `
+    <span class="toast-icon">${ICONS[type] || ICONS.info}</span>
+    <div class="toast-content">
+      <div class="toast-title">${title}</div>
+      ${message ? `<div class="toast-message">${message}</div>` : ''}
+    </div>
+    <button class="toast-close" aria-label="Close notification">
+      <svg viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/></svg>
+    </button>
+  `;
+
+  const closeBtn = toast.querySelector('.toast-close');
+  closeBtn.addEventListener('click', () => dismissToast(toast));
+
+  c.appendChild(toast);
+
+  if (duration > 0) {
+    setTimeout(() => dismissToast(toast), duration);
+  }
+
+  return toast;
+}
+
+function dismissToast(toast) {
+  if (!toast || !toast.parentNode) return;
+  toast.classList.add('toast-leaving');
+  setTimeout(() => {
+    if (toast.parentNode) toast.parentNode.removeChild(toast);
+  }, 200);
+}
+
+export const Toast = {
+  success(title, message, duration) { return createToast('success', title, message, duration); },
+  error(title, message, duration)   { return createToast('error', title, message, duration); },
+  warning(title, message, duration) { return createToast('warning', title, message, duration); },
+  info(title, message, duration)    { return createToast('info', title, message, duration); }
+};
diff --git a/js/components/topbar.js b/js/components/topbar.js
new file mode 100644
index 0000000..e41774d
--- /dev/null
+++ b/js/components/topbar.js
@@ -0,0 +1,65 @@
+// ============================================================
+// TechnoEdge CRM ΓÇö Topbar Component
+// Breadcrumbs, search, user profile
+// ============================================================
+
+import { Auth } from '../auth.js';
+import { getInitials, formatRole } from '../utils.js';
+
+const SEARCH_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
+
+const PAGE_TITLES = {
+  dashboard: 'Dashboard',
+  pipeline:  'Pipeline',
+  leads:     'Leads',
+  contacts:  'Contacts',
+  deals:     'Deals',
+  team:      'Team',
+  reports:   'Reports',
+  settings:  'Settings'
+};
+
+export function renderTopbar(pageId) {
+  const user = Auth.getCurrentUser();
+  if (!user) return '';
+
+  const pageTitle = PAGE_TITLES[pageId] || 'Page';
+  const initials = getInitials(user.name);
+  const roleName = formatRole(user.role);
+  const roleCss  = `role-${user.role}`;
+
+  return `
+    <header class="topbar" id="topbar">
+      <div class="topbar-left">
+        <nav class="topbar-breadcrumb" aria-label="Breadcrumb">
+          <span>TechnoEdge CRM</span>
+          <span class="topbar-breadcrumb-separator">/</span>
+          <span class="topbar-breadcrumb-current">${pageTitle}</span>
+        </nav>
+      </div>
+      <div class="topbar-right">
+        <div class="topbar-search">
+          <span class="topbar-search-icon">${SEARCH_ICON}</span>
+          <input 
+            type="text" 
+            class="topbar-search-input" 
+            id="topbar-search" 
+            placeholder="Search leads, deals, contactsΓÇª" 
+            aria-label="Global search"
+          />
+        </div>
+        <div class="topbar-user" id="topbar-user">
+          <div class="topbar-user-avatar" style="background-color: ${user.avatarColor}">
+            ${initials}
+          </div>
+          <span class="topbar-user-name">${user.name}</span>
+          <span class="topbar-role-badge ${roleCss}">${roleName}</span>
+        </div>
+      </div>
+    </header>
+  `;
+}
+
+export function getPageTitle(pageId) {
+  return PAGE_TITLES[pageId] || 'Page';
+}
diff --git a/js/pages/dashboard.js b/js/pages/dashboard.js
new file mode 100644
index 0000000..f70f796
--- /dev/null
+++ b/js/pages/dashboard.js
@@ -0,0 +1,215 @@
+// ============================================================
+// TechnoEdge CRM ΓÇö Dashboard Page
+// Role-aware dashboard with stat cards and activity feed
+// ============================================================
+
+import { Auth } from '../auth.js';
+import { Store } from '../store.js';
+import { formatCurrency, formatRole, getGreeting, timeAgo, getInitials, SOP_STAGES } from '../utils.js';
+
+// ΓöÇΓöÇ Stat card icon SVGs ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+const STAT_ICONS = {
+  revenue:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
+  deals:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>',
+  leads:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
+  pipeline:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
+  team:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>',
+  tasks:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>',
+  activity:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
+  conversion: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>'
+};
+
+const ACTIVITY_ICONS = {
+  call:         '≡ƒô₧',
+  email:        'Γ£ë∩╕Å',
+  meeting:      '≡ƒñ¥',
+  note:         '≡ƒô¥',
+  stage_change: '≡ƒöä',
+  assignment:   '≡ƒæñ'
+};
+
+// ΓöÇΓöÇ Build dashboard HTML ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+export function renderDashboard() {
+  const user = Auth.getCurrentUser();
+  if (!user) return '';
+
+  const greeting = getGreeting();
+  const roleName = formatRole(user.role);
+  const roleBadgeClass = `role-badge-${user.role}`;
+
+  // Get role-scoped data
+  const deals = Store.getDealsForUser(user);
+  const leads = Store.getLeadsForUser(user);
+  const activities = Store.getRecentActivities(user, 8);
+
+  const activeDeals = deals.filter(d => d.status === 'active');
+  const totalValue = activeDeals.reduce((sum, d) => sum + (d.value || 0), 0);
+  const newLeads = leads.filter(l => l.status === 'new').length;
+  const qualifiedLeads = leads.filter(l => l.status === 'qualified').length;
+
+  // Build stat cards based on role
+  const statCards = buildStatCards(user, activeDeals, leads, totalValue, newLeads, qualifiedLeads);
+
+  // Pipeline mini bar
+  const pipelineMini = buildPipelineMini(activeDeals);
+
+  // Activity feed
+  const activityFeed = buildActivityFeed(activities);
+
+  return `
+    <div class="content-inner">
+      <div class="dashboard-greeting">
+        <div class="dashboard-greeting-text">${greeting}, ${user.name.split(' ')[0]}</div>
+        <div class="dashboard-greeting-sub">
+          <span class="role-badge ${roleBadgeClass}">${roleName}</span>
+          <span>Here's what's happening ${user.role === 'manager' ? 'across your organization' : user.role === 'team_lead' ? 'with your team' : 'with your work'}</span>
+        </div>
+      </div>
+
+      ${statCards}
+
+      <div class="dashboard-section">
+        <div class="dashboard-section-header">
+          <h4 class="dashboard-section-title">Pipeline Overview</h4>
+        </div>
+        ${pipelineMini}
+      </div>
+
+      <div class="dashboard-section">
+        <div class="dashboard-section-header">
+          <h4 class="dashboard-section-title">Recent Activity</h4>
+        </div>
+        ${activityFeed}
+      </div>
+    </div>
+  `;
+}
+
+// ΓöÇΓöÇ Stat Cards ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+function buildStatCards(user, activeDeals, leads, totalValue, newLeads, qualifiedLeads) {
+  let cards = [];
+
+  if (user.role === 'manager') {
+    cards = [
+      { label: 'Total Pipeline Value', value: formatCurrency(totalValue), icon: 'revenue',    color: 'var(--color-stage-sales)',       bg: 'var(--color-primary-disabled)' },
+      { label: 'Active Deals',         value: activeDeals.length,         icon: 'deals',      color: 'var(--color-stage-delivery)',    bg: 'var(--color-info-soft)' },
+      { label: 'Total Leads',          value: leads.length,               icon: 'leads',      color: 'var(--color-stage-feedback)',    bg: '#f3e8ff' },
+      { label: 'Conversion Rate',      value: leads.length > 0 ? Math.round((qualifiedLeads / leads.length) * 100) + '%' : '0%', icon: 'conversion', color: 'var(--color-stage-invoice)', bg: 'var(--color-success-soft)' }
+    ];
+  } else if (user.role === 'team_lead') {
+    cards = [
+      { label: 'Team Pipeline Value',  value: formatCurrency(totalValue), icon: 'revenue',   color: 'var(--color-stage-sales)',     bg: 'var(--color-primary-disabled)' },
+      { label: 'Team Active Deals',    value: activeDeals.length,         icon: 'deals',     color: 'var(--color-stage-delivery)',  bg: 'var(--color-info-soft)' },
+      { label: 'New Leads',            value: newLeads,                   icon: 'leads',     color: 'var(--color-stage-requirement)', bg: 'var(--color-warning-soft)' },
+      { label: 'Team Members',         value: Store.getUsersByTeam(user.teamId).length, icon: 'team', color: 'var(--color-stage-feedback)', bg: '#f3e8ff' }
+    ];
+  } else {
+    cards = [
+      { label: 'My Pipeline Value',    value: formatCurrency(totalValue), icon: 'revenue',  color: 'var(--color-stage-sales)',      bg: 'var(--color-primary-disabled)' },
+      { label: 'My Active Deals',      value: activeDeals.length,         icon: 'deals',    color: 'var(--color-stage-delivery)',   bg: 'var(--color-info-soft)' },
+      { label: 'My Leads',             value: leads.length,               icon: 'leads',    color: 'var(--color-stage-sourcing)',   bg: 'var(--color-warning-soft)' },
+      { label: 'Recent Activities',    value: Store.getRecentActivities(user, 100).length, icon: 'activity', color: 'var(--color-stage-invoice)', bg: 'var(--color-success-soft)' }
+    ];
+  }
+
+  const cardsHTML = cards.map(card => `
+    <div class="stat-card">
+      <div class="stat-card-icon" style="background: ${card.bg}; color: ${card.color};">
+        ${STAT_ICONS[card.icon] || ''}
+      </div>
+      <div class="stat-card-content">
+        <div class="stat-card-label">${card.label}</div>
+        <div class="stat-card-value">${card.value}</div>
+      </div>
+    </div>
+  `).join('');
+
+  return `<div class="stat-cards">${cardsHTML}</div>`;
+}
+
+// ΓöÇΓöÇ Pipeline Mini Bar ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+function buildPipelineMini(activeDeals) {
+  const stageCounts = {};
+  SOP_STAGES.forEach(s => { stageCounts[s.key] = 0; });
+  activeDeals.forEach(d => {
+    if (stageCounts[d.stage] !== undefined) stageCounts[d.stage]++;
+  });
+
+  const total = activeDeals.length || 1;
+
+  const segments = SOP_STAGES.map(s => {
+    const count = stageCounts[s.key];
+    const flex = Math.max(count / total, 0.05);
+    return `<div class="pipeline-mini-segment" style="flex: ${flex}; background: ${s.color};" title="${s.label}: ${count}"></div>`;
+  }).join('');
+
+  const legendItems = SOP_STAGES.map(s => `
+    <div class="pipeline-mini-legend-item">
+      <span class="pipeline-mini-legend-dot" style="background: ${s.color};"></span>
+      ${s.label}: <strong>${stageCounts[s.key]}</strong>
+    </div>
+  `).join('');
+
+  return `
+    <div class="pipeline-mini">
+      <div class="pipeline-mini-bar">${segments}</div>
+      <div class="pipeline-mini-legend">${legendItems}</div>
+    </div>
+  `;
+}
+
+// ΓöÇΓöÇ Activity Feed ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+function buildActivityFeed(activities) {
+  if (!activities || activities.length === 0) {
+    return `
+      <div class="activity-feed">
+        <div class="activity-feed-empty">No recent activity to show.</div>
+      </div>
+    `;
+  }
+
+  const items = activities.map(a => {
+    const icon = ACTIVITY_ICONS[a.type] || '≡ƒôî';
+    const user = Store.getUserById(a.createdBy);
+    const userName = user ? user.name : 'Unknown';
+    const deal = Store.getDealById(a.dealId);
+    const dealTitle = deal ? deal.title : 'Unknown deal';
+    const time = timeAgo(a.createdAt);
+
+    return `
+      <div class="activity-feed-item">
+        <span class="activity-feed-dot" style="background: ${getActivityColor(a.type)};"></span>
+        <div class="activity-feed-content">
+          <div class="activity-feed-text">
+            <strong>${userName}</strong> ΓÇö ${dealTitle}<br/>
+            <span style="color: var(--color-muted);">${icon} ${a.content}</span>
+          </div>
+          <div class="activity-feed-time">${time}</div>
+        </div>
+      </div>
+    `;
+  }).join('');
+
+  return `
+    <div class="activity-feed">
+      <div class="activity-feed-list">${items}</div>
+    </div>
+  `;
+}
+
+function getActivityColor(type) {
+  const colors = {
+    call:         'var(--color-stage-sales)',
+    email:        'var(--color-stage-delivery)',
+    meeting:      'var(--color-stage-feedback)',
+    note:         'var(--color-stage-sourcing)',
+    stage_change: 'var(--color-stage-invoice)',
+    assignment:   'var(--color-stage-renewal)'
+  };
+  return colors[type] || 'var(--color-primary)';
+}
diff --git a/js/pages/login.js b/js/pages/login.js
new file mode 100644
index 0000000..5a0b91a
--- /dev/null
+++ b/js/pages/login.js
@@ -0,0 +1,114 @@
+// ============================================================
+// TechnoEdge CRM ΓÇö Login Page
+// User picker login (no passwords)
+// ============================================================
+
+import { Store } from '../store.js';
+import { Auth } from '../auth.js';
+import { formatRole } from '../utils.js';
+import { Toast } from '../components/toast.js';
+
+const BRAND_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 3L4 14h5v7l9-11h-5V3z"/></svg>';
+const CHEVRON_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>';
+
+const ROLE_DESCRIPTIONS = {
+  manager:   'Full access to all data, teams, approvals, overrides, and reports across the organization.',
+  team_lead: 'Team-level access to assigned team data, work assignment, reviews, and escalations.',
+  employee:  'Personal access to assigned work only. Cannot approve or view other teams\' data.'
+};
+
+const ROLE_BADGES = {
+  manager:   'role-badge-manager',
+  team_lead: 'role-badge-team_lead',
+  employee:  'role-badge-employee'
+};
+
+export function renderLoginPage() {
+  const users = Store.getUsers();
+
+  const userOptions = users.map(u =>
+    `<option value="${u.id}" data-role="${u.role}">${u.name} ΓÇö ${formatRole(u.role)}</option>`
+  ).join('');
+
+  return `
+    <div class="login-page" id="login-page">
+      <div class="login-card">
+        <div class="login-brand">
+          <div class="login-brand-logo">
+            ${BRAND_ICON}
+          </div>
+          <div class="login-brand-name">TechnoEdge CRM</div>
+          <div class="login-brand-desc">
+            Sales pipeline management with SOP-based workflow tracking
+          </div>
+        </div>
+
+        <div class="login-divider"></div>
+
+        <label class="login-label" for="login-user-select">Sign in as</label>
+        <div class="login-select-wrapper">
+          <select class="login-select" id="login-user-select">
+            <option value="" disabled selected>Choose a userΓÇª</option>
+            ${userOptions}
+          </select>
+          <span class="login-select-arrow">${CHEVRON_ICON}</span>
+        </div>
+
+        <div id="login-role-preview"></div>
+
+        <button class="btn btn-primary btn-full" id="login-submit-btn" disabled>
+          Sign In
+        </button>
+      </div>
+    </div>
+  `;
+}
+
+export function bindLoginEvents(onLoginSuccess) {
+  const select = document.getElementById('login-user-select');
+  const submitBtn = document.getElementById('login-submit-btn');
+  const preview = document.getElementById('login-role-preview');
+
+  if (!select || !submitBtn) return;
+
+  select.addEventListener('change', () => {
+    const userId = select.value;
+    if (!userId) {
+      submitBtn.disabled = true;
+      preview.innerHTML = '';
+      return;
+    }
+
+    submitBtn.disabled = false;
+
+    const user = Store.getUserById(userId);
+    if (user) {
+      const roleName = formatRole(user.role);
+      const badgeClass = ROLE_BADGES[user.role] || '';
+      const desc = ROLE_DESCRIPTIONS[user.role] || '';
+
+      preview.innerHTML = `
+        <div class="login-role-preview">
+          <div class="login-role-preview-title">
+            ${user.name}
+            <span class="role-badge ${badgeClass}" style="margin-left: 8px;">${roleName}</span>
+          </div>
+          <div class="login-role-preview-desc">${desc}</div>
+        </div>
+      `;
+    }
+  });
+
+  submitBtn.addEventListener('click', () => {
+    const userId = select.value;
+    if (!userId) return;
+
+    const user = Auth.login(userId);
+    if (user) {
+      Toast.success('Welcome back!', `Signed in as ${user.name}`);
+      if (onLoginSuccess) onLoginSuccess(user);
+    } else {
+      Toast.error('Login failed', 'Could not sign in. Please try again.');
+    }
+  });
+}
diff --git a/js/router.js b/js/router.js
new file mode 100644
index 0000000..4bd880e
--- /dev/null
+++ b/js/router.js
@@ -0,0 +1,87 @@
+// ============================================================
+// TechnoEdge CRM ΓÇö Router
+// Hash-based SPA router with role guards
+// ============================================================
+
+import { Auth } from './auth.js';
+import { Toast } from './components/toast.js';
+
+// ΓöÇΓöÇ Route definitions ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+const ROUTES = {
+  'dashboard': { pageId: 'dashboard', title: 'Dashboard' },
+  'pipeline':  { pageId: 'pipeline',  title: 'Pipeline' },
+  'leads':     { pageId: 'leads',     title: 'Leads' },
+  'contacts':  { pageId: 'contacts',  title: 'Contacts' },
+  'deals':     { pageId: 'deals',     title: 'Deals' },
+  'team':      { pageId: 'team',      title: 'Team' },
+  'reports':   { pageId: 'reports',   title: 'Reports' },
+  'settings':  { pageId: 'settings',  title: 'Settings' }
+};
+
+let currentPage = null;
+let onNavigateCallback = null;
+
+// ΓöÇΓöÇ Public Router API ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+export const Router = {
+
+  init(onNavigate) {
+    onNavigateCallback = onNavigate;
+    window.addEventListener('hashchange', () => Router.handleRoute());
+    Router.handleRoute();
+  },
+
+  handleRoute() {
+    const hash = window.location.hash || '#/login';
+    const path = hash.replace('#/', '').split('/')[0];
+
+    // If not logged in, force login page
+    if (!Auth.isLoggedIn()) {
+      if (path !== 'login') {
+        window.location.hash = '#/login';
+        return;
+      }
+      if (onNavigateCallback) onNavigateCallback('login', null);
+      return;
+    }
+
+    // If logged in and on login page, redirect to dashboard
+    if (path === 'login' || path === '') {
+      window.location.hash = '#/dashboard';
+      return;
+    }
+
+    // Check if route exists
+    const route = ROUTES[path];
+    if (!route) {
+      Toast.warning('Page not found', `"${path}" does not exist. Redirecting to dashboard.`);
+      window.location.hash = '#/dashboard';
+      return;
+    }
+
+    // Role-based access guard
+    if (!Auth.canAccessPage(route.pageId)) {
+      Toast.error('Access denied', `You don't have permission to view ${route.title}.`);
+      window.location.hash = '#/dashboard';
+      return;
+    }
+
+    // Extract route params (e.g., #/deals/deal_01)
+    const parts = hash.replace('#/', '').split('/');
+    const params = parts.length > 1 ? { id: parts[1] } : null;
+
+    currentPage = route.pageId;
+    document.title = `${route.title} ΓÇö TechnoEdge CRM`;
+
+    if (onNavigateCallback) onNavigateCallback(route.pageId, params);
+  },
+
+  navigate(hash) {
+    window.location.hash = hash;
+  },
+
+  getCurrentPage() {
+    return currentPage;
+  }
+};
diff --git a/js/seed.js b/js/seed.js
new file mode 100644
index 0000000..f63bb39
--- /dev/null
+++ b/js/seed.js
@@ -0,0 +1,365 @@
+// ============================================================
+// TechnoEdge CRM ΓÇö Demo Seed Data
+// 1 Manager, 2 Team Leads, 4 Employees, 2 Teams
+// Plus sample leads, contacts, deals, and activities
+// ============================================================
+
+import { generateId } from './utils.js';
+import { Store } from './store.js';
+
+const AVATAR_COLORS = [
+  '#ff385c', '#e00b41', '#460479', '#92174d',
+  '#0969da', '#8250df', '#008a05', '#0e8a6e',
+  '#c58000', '#e36414'
+];
+
+export function seedData() {
+  if (Store.isSeeded()) return;
+
+  const now = new Date();
+  const daysAgo = (d) => new Date(now - d * 86400000).toISOString();
+
+  // ΓöÇΓöÇ Users ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+  const users = [
+    {
+      id: 'usr_manager_01',
+      name: 'Arjun Mehta',
+      email: 'arjun.mehta@technoedge.com',
+      role: 'manager',
+      teamId: null,
+      avatarColor: AVATAR_COLORS[0],
+      isActive: true
+    },
+    {
+      id: 'usr_tl_01',
+      name: 'Priya Sharma',
+      email: 'priya.sharma@technoedge.com',
+      role: 'team_lead',
+      teamId: 'team_01',
+      avatarColor: AVATAR_COLORS[4],
+      isActive: true
+    },
+    {
+      id: 'usr_tl_02',
+      name: 'Rahul Verma',
+      email: 'rahul.verma@technoedge.com',
+      role: 'team_lead',
+      teamId: 'team_02',
+      avatarColor: AVATAR_COLORS[5],
+      isActive: true
+    },
+    {
+      id: 'usr_emp_01',
+      name: 'Sneha Patel',
+      email: 'sneha.patel@technoedge.com',
+      role: 'employee',
+      teamId: 'team_01',
+      avatarColor: AVATAR_COLORS[6],
+      isActive: true
+    },
+    {
+      id: 'usr_emp_02',
+      name: 'Vikram Singh',
+      email: 'vikram.singh@technoedge.com',
+      role: 'employee',
+      teamId: 'team_01',
+      avatarColor: AVATAR_COLORS[7],
+      isActive: true
+    },
+    {
+      id: 'usr_emp_03',
+      name: 'Ananya Desai',
+      email: 'ananya.desai@technoedge.com',
+      role: 'employee',
+      teamId: 'team_02',
+      avatarColor: AVATAR_COLORS[8],
+      isActive: true
+    },
+    {
+      id: 'usr_emp_04',
+      name: 'Karan Joshi',
+      email: 'karan.joshi@technoedge.com',
+      role: 'employee',
+      teamId: 'team_02',
+      avatarColor: AVATAR_COLORS[9],
+      isActive: true
+    }
+  ];
+
+  // ΓöÇΓöÇ Teams ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+  const teams = [
+    {
+      id: 'team_01',
+      name: 'North Sales',
+      leadId: 'usr_tl_01',
+      memberIds: ['usr_emp_01', 'usr_emp_02']
+    },
+    {
+      id: 'team_02',
+      name: 'Enterprise Team',
+      leadId: 'usr_tl_02',
+      memberIds: ['usr_emp_03', 'usr_emp_04']
+    }
+  ];
+
+  // ΓöÇΓöÇ Leads ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+  const leads = [
+    {
+      id: generateId(), name: 'Rajesh Kumar', company: 'Infosys Ltd',
+      email: 'rajesh.k@infosys.com', phone: '+91 98765 43210',
+      source: 'referral', status: 'qualified', assignedTo: 'usr_emp_01',
+      createdBy: 'usr_tl_01', createdAt: daysAgo(15), updatedAt: daysAgo(2),
+      notes: 'Looking for enterprise software solution'
+    },
+    {
+      id: generateId(), name: 'Meera Nair', company: 'TCS',
+      email: 'meera.n@tcs.com', phone: '+91 98765 43211',
+      source: 'website', status: 'new', assignedTo: 'usr_emp_02',
+      createdBy: 'usr_tl_01', createdAt: daysAgo(3), updatedAt: daysAgo(3),
+      notes: 'Inquired about cloud services'
+    },
+    {
+      id: generateId(), name: 'Suresh Iyer', company: 'Wipro',
+      email: 'suresh.i@wipro.com', phone: '+91 98765 43212',
+      source: 'cold_call', status: 'contacted', assignedTo: 'usr_emp_03',
+      createdBy: 'usr_tl_02', createdAt: daysAgo(10), updatedAt: daysAgo(5),
+      notes: 'Decision maker for IT procurement'
+    },
+    {
+      id: generateId(), name: 'Divya Reddy', company: 'HCL Tech',
+      email: 'divya.r@hcl.com', phone: '+91 98765 43213',
+      source: 'event', status: 'qualified', assignedTo: 'usr_emp_04',
+      createdBy: 'usr_tl_02', createdAt: daysAgo(20), updatedAt: daysAgo(1),
+      notes: 'Met at TechSummit 2026'
+    },
+    {
+      id: generateId(), name: 'Amit Gupta', company: 'Reliance Digital',
+      email: 'amit.g@reliance.com', phone: '+91 98765 43214',
+      source: 'social', status: 'new', assignedTo: null,
+      createdBy: 'usr_manager_01', createdAt: daysAgo(1), updatedAt: daysAgo(1),
+      notes: 'LinkedIn connection, interested in CRM'
+    },
+    {
+      id: generateId(), name: 'Pooja Bhat', company: 'Zoho Corp',
+      email: 'pooja.b@zoho.com', phone: '+91 98765 43215',
+      source: 'referral', status: 'contacted', assignedTo: 'usr_emp_01',
+      createdBy: 'usr_tl_01', createdAt: daysAgo(7), updatedAt: daysAgo(4),
+      notes: 'Referred by Rajesh Kumar'
+    },
+    {
+      id: generateId(), name: 'Nikhil Agarwal', company: 'Flipkart',
+      email: 'nikhil.a@flipkart.com', phone: '+91 98765 43216',
+      source: 'website', status: 'unqualified', assignedTo: 'usr_emp_02',
+      createdBy: 'usr_tl_01', createdAt: daysAgo(30), updatedAt: daysAgo(25),
+      notes: 'Budget too low for enterprise tier'
+    },
+    {
+      id: generateId(), name: 'Kavitha Menon', company: 'Freshworks',
+      email: 'kavitha.m@freshworks.com', phone: '+91 98765 43217',
+      source: 'event', status: 'converted', assignedTo: 'usr_emp_03',
+      createdBy: 'usr_tl_02', createdAt: daysAgo(45), updatedAt: daysAgo(10),
+      notes: 'Converted to deal ΓÇö 3-year contract'
+    },
+    {
+      id: generateId(), name: 'Sanjay Pillai', company: 'Mindtree',
+      email: 'sanjay.p@mindtree.com', phone: '+91 98765 43218',
+      source: 'cold_call', status: 'new', assignedTo: 'usr_emp_04',
+      createdBy: 'usr_tl_02', createdAt: daysAgo(2), updatedAt: daysAgo(2),
+      notes: 'Initial outreach done'
+    },
+    {
+      id: generateId(), name: 'Lakshmi Rao', company: 'Tech Mahindra',
+      email: 'lakshmi.r@techmahindra.com', phone: '+91 98765 43219',
+      source: 'referral', status: 'qualified', assignedTo: 'usr_emp_01',
+      createdBy: 'usr_tl_01', createdAt: daysAgo(12), updatedAt: daysAgo(3),
+      notes: 'Strong interest in analytics module'
+    }
+  ];
+
+  // ΓöÇΓöÇ Contacts ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+  const contacts = [
+    {
+      id: generateId(), name: 'Rajesh Kumar', company: 'Infosys Ltd',
+      email: 'rajesh.k@infosys.com', phone: '+91 98765 43210',
+      designation: 'VP Engineering', type: 'client', tags: ['enterprise', 'IT'],
+      createdAt: daysAgo(15)
+    },
+    {
+      id: generateId(), name: 'Meera Nair', company: 'TCS',
+      email: 'meera.n@tcs.com', phone: '+91 98765 43211',
+      designation: 'Procurement Head', type: 'client', tags: ['enterprise'],
+      createdAt: daysAgo(10)
+    },
+    {
+      id: generateId(), name: 'Suresh Iyer', company: 'Wipro',
+      email: 'suresh.i@wipro.com', phone: '+91 98765 43212',
+      designation: 'CTO', type: 'client', tags: ['IT', 'decision-maker'],
+      createdAt: daysAgo(10)
+    },
+    {
+      id: generateId(), name: 'Divya Reddy', company: 'HCL Tech',
+      email: 'divya.r@hcl.com', phone: '+91 98765 43213',
+      designation: 'Director of Operations', type: 'client', tags: ['enterprise', 'ops'],
+      createdAt: daysAgo(20)
+    },
+    {
+      id: generateId(), name: 'Ravi Shankar', company: 'DataSoft Solutions',
+      email: 'ravi@datasoft.in', phone: '+91 98765 43220',
+      designation: 'CEO', type: 'vendor', tags: ['vendor', 'data'],
+      createdAt: daysAgo(30)
+    },
+    {
+      id: generateId(), name: 'Kavitha Menon', company: 'Freshworks',
+      email: 'kavitha.m@freshworks.com', phone: '+91 98765 43217',
+      designation: 'Head of Procurement', type: 'client', tags: ['SaaS', 'enterprise'],
+      createdAt: daysAgo(45)
+    }
+  ];
+
+  // ΓöÇΓöÇ Deals ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+  const deals = [
+    {
+      id: 'deal_01', title: 'Infosys ERP Integration',
+      leadId: leads[0].id, contactId: contacts[0].id,
+      value: 2500000, currency: 'INR', stage: 'sourcing', status: 'active',
+      assignedTo: 'usr_emp_01', teamId: 'team_01', priority: 'high',
+      createdAt: daysAgo(14), updatedAt: daysAgo(1), closedAt: null,
+      notes: 'Multi-module ERP integration project'
+    },
+    {
+      id: 'deal_02', title: 'TCS Cloud Migration',
+      leadId: leads[1].id, contactId: contacts[1].id,
+      value: 1800000, currency: 'INR', stage: 'requirement', status: 'active',
+      assignedTo: 'usr_emp_02', teamId: 'team_01', priority: 'medium',
+      createdAt: daysAgo(8), updatedAt: daysAgo(2), closedAt: null,
+      notes: 'Migrate legacy systems to cloud'
+    },
+    {
+      id: 'deal_03', title: 'Wipro Analytics Suite',
+      leadId: leads[2].id, contactId: contacts[2].id,
+      value: 3200000, currency: 'INR', stage: 'delivery', status: 'active',
+      assignedTo: 'usr_emp_03', teamId: 'team_02', priority: 'urgent',
+      createdAt: daysAgo(30), updatedAt: daysAgo(1), closedAt: null,
+      notes: 'Custom analytics dashboard for ops team'
+    },
+    {
+      id: 'deal_04', title: 'HCL Digital Transformation',
+      leadId: leads[3].id, contactId: contacts[3].id,
+      value: 5000000, currency: 'INR', stage: 'sales', status: 'active',
+      assignedTo: 'usr_emp_04', teamId: 'team_02', priority: 'high',
+      createdAt: daysAgo(5), updatedAt: daysAgo(1), closedAt: null,
+      notes: 'Full digital transformation roadmap'
+    },
+    {
+      id: 'deal_05', title: 'Freshworks SaaS Platform',
+      leadId: leads[7].id, contactId: contacts[5].id,
+      value: 4200000, currency: 'INR', stage: 'invoice', status: 'active',
+      assignedTo: 'usr_emp_03', teamId: 'team_02', priority: 'medium',
+      createdAt: daysAgo(40), updatedAt: daysAgo(3), closedAt: null,
+      notes: '3-year SaaS licensing deal'
+    },
+    {
+      id: 'deal_06', title: 'Tech Mahindra Security Audit',
+      leadId: leads[9].id, contactId: contacts[0].id,
+      value: 800000, currency: 'INR', stage: 'feedback', status: 'active',
+      assignedTo: 'usr_emp_01', teamId: 'team_01', priority: 'low',
+      createdAt: daysAgo(25), updatedAt: daysAgo(5), closedAt: null,
+      notes: 'Annual security audit and compliance review'
+    },
+    {
+      id: 'deal_07', title: 'DataSoft Renewal',
+      leadId: null, contactId: contacts[4].id,
+      value: 600000, currency: 'INR', stage: 'renewal', status: 'active',
+      assignedTo: 'usr_emp_02', teamId: 'team_01', priority: 'medium',
+      createdAt: daysAgo(60), updatedAt: daysAgo(7), closedAt: null,
+      notes: 'Annual contract renewal with upgrade option'
+    }
+  ];
+
+  // ΓöÇΓöÇ Activities ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+  const activities = [
+    {
+      id: generateId(), dealId: 'deal_01', type: 'stage_change',
+      content: 'Deal moved from Requirement to Sourcing',
+      fromStage: 'requirement', toStage: 'sourcing',
+      createdBy: 'usr_emp_01', createdAt: daysAgo(1)
+    },
+    {
+      id: generateId(), dealId: 'deal_01', type: 'call',
+      content: 'Discussed vendor shortlist with Rajesh. Three candidates identified.',
+      fromStage: null, toStage: null,
+      createdBy: 'usr_emp_01', createdAt: daysAgo(2)
+    },
+    {
+      id: generateId(), dealId: 'deal_02', type: 'meeting',
+      content: 'Requirements workshop with TCS team. Documented 14 user stories.',
+      fromStage: null, toStage: null,
+      createdBy: 'usr_emp_02', createdAt: daysAgo(2)
+    },
+    {
+      id: generateId(), dealId: 'deal_03', type: 'stage_change',
+      content: 'Deal moved from Sourcing to Delivery',
+      fromStage: 'sourcing', toStage: 'delivery',
+      createdBy: 'usr_emp_03', createdAt: daysAgo(1)
+    },
+    {
+      id: generateId(), dealId: 'deal_03', type: 'note',
+      content: 'Delivery phase started. Server provisioning completed.',
+      fromStage: null, toStage: null,
+      createdBy: 'usr_emp_03', createdAt: daysAgo(1)
+    },
+    {
+      id: generateId(), dealId: 'deal_04', type: 'email',
+      content: 'Sent initial proposal document to Divya Reddy at HCL.',
+      fromStage: null, toStage: null,
+      createdBy: 'usr_emp_04', createdAt: daysAgo(2)
+    },
+    {
+      id: generateId(), dealId: 'deal_05', type: 'stage_change',
+      content: 'Deal moved from Feedback to Invoice/Payment',
+      fromStage: 'feedback', toStage: 'invoice',
+      createdBy: 'usr_emp_03', createdAt: daysAgo(3)
+    },
+    {
+      id: generateId(), dealId: 'deal_05', type: 'note',
+      content: 'Invoice #INV-2026-042 generated. Payment terms: Net 30.',
+      fromStage: null, toStage: null,
+      createdBy: 'usr_emp_03', createdAt: daysAgo(3)
+    },
+    {
+      id: generateId(), dealId: 'deal_06', type: 'call',
+      content: 'Feedback call with Tech Mahindra. Client satisfied with audit results.',
+      fromStage: null, toStage: null,
+      createdBy: 'usr_emp_01', createdAt: daysAgo(5)
+    },
+    {
+      id: generateId(), dealId: 'deal_07', type: 'email',
+      content: 'Sent renewal proposal with 10% loyalty discount.',
+      fromStage: null, toStage: null,
+      createdBy: 'usr_emp_02', createdAt: daysAgo(7)
+    },
+    {
+      id: generateId(), dealId: 'deal_01', type: 'meeting',
+      content: 'Kickoff meeting with Infosys stakeholders. Project scope finalized.',
+      fromStage: null, toStage: null,
+      createdBy: 'usr_emp_01', createdAt: daysAgo(10)
+    },
+    {
+      id: generateId(), dealId: 'deal_02', type: 'stage_change',
+      content: 'Deal moved from Sales to Requirement',
+      fromStage: 'sales', toStage: 'requirement',
+      createdBy: 'usr_emp_02', createdAt: daysAgo(5)
+    }
+  ];
+
+  // ΓöÇΓöÇ Persist ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+  users.forEach(u      => Store.createUser(u));
+  teams.forEach(t      => Store.createTeam(t));
+  leads.forEach(l      => Store.createLead(l));
+  contacts.forEach(c   => Store.createContact(c));
+  deals.forEach(d      => Store.createDeal(d));
+  activities.forEach(a => Store.createActivity(a));
+
+  Store.markSeeded();
+  console.log('TechnoEdge CRM: Demo data seeded successfully.');
+}
diff --git a/js/store.js b/js/store.js
new file mode 100644
index 0000000..6328d28
--- /dev/null
+++ b/js/store.js
@@ -0,0 +1,193 @@
+// ============================================================
+// TechnoEdge CRM ΓÇö Data Store
+// LocalStorage-backed CRUD with role-scoped queries
+// ============================================================
+
+const STORAGE_PREFIX = 'technoedge_';
+
+const KEYS = {
+  users:      STORAGE_PREFIX + 'users',
+  teams:      STORAGE_PREFIX + 'teams',
+  leads:      STORAGE_PREFIX + 'leads',
+  contacts:   STORAGE_PREFIX + 'contacts',
+  deals:      STORAGE_PREFIX + 'deals',
+  activities: STORAGE_PREFIX + 'activities',
+  session:    STORAGE_PREFIX + 'session',
+  settings:   STORAGE_PREFIX + 'settings',
+  seeded:     STORAGE_PREFIX + 'seeded'
+};
+
+// ΓöÇΓöÇ Generic CRUD ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+function getAll(key) {
+  try {
+    const data = localStorage.getItem(key);
+    return data ? JSON.parse(data) : [];
+  } catch (e) {
+    console.error(`Store: Error reading ${key}`, e);
+    return [];
+  }
+}
+
+function setAll(key, data) {
+  try {
+    localStorage.setItem(key, JSON.stringify(data));
+  } catch (e) {
+    console.error(`Store: Error writing ${key}`, e);
+  }
+}
+
+function getById(key, id) {
+  const items = getAll(key);
+  return items.find(item => item.id === id) || null;
+}
+
+function create(key, item) {
+  const items = getAll(key);
+  items.push(item);
+  setAll(key, items);
+  return item;
+}
+
+function update(key, id, updates) {
+  const items = getAll(key);
+  const index = items.findIndex(item => item.id === id);
+  if (index === -1) return null;
+  items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
+  setAll(key, items);
+  return items[index];
+}
+
+function remove(key, id) {
+  const items = getAll(key);
+  const filtered = items.filter(item => item.id !== id);
+  setAll(key, filtered);
+  return filtered.length < items.length;
+}
+
+// ΓöÇΓöÇ Public Store API ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+export const Store = {
+
+  // ΓöÇΓöÇ Users ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+  getUsers()         { return getAll(KEYS.users); },
+  getUserById(id)    { return getById(KEYS.users, id); },
+  createUser(user)   { return create(KEYS.users, user); },
+  updateUser(id, u)  { return update(KEYS.users, id, u); },
+  deleteUser(id)     { return remove(KEYS.users, id); },
+
+  getUsersByRole(role) {
+    return getAll(KEYS.users).filter(u => u.role === role);
+  },
+
+  getUsersByTeam(teamId) {
+    return getAll(KEYS.users).filter(u => u.teamId === teamId);
+  },
+
+  // ΓöÇΓöÇ Teams ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+  getTeams()         { return getAll(KEYS.teams); },
+  getTeamById(id)    { return getById(KEYS.teams, id); },
+  createTeam(team)   { return create(KEYS.teams, team); },
+  updateTeam(id, t)  { return update(KEYS.teams, id, t); },
+  deleteTeam(id)     { return remove(KEYS.teams, id); },
+
+  // ΓöÇΓöÇ Leads ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+  getLeads()         { return getAll(KEYS.leads); },
+  getLeadById(id)    { return getById(KEYS.leads, id); },
+  createLead(lead)   { return create(KEYS.leads, lead); },
+  updateLead(id, l)  { return update(KEYS.leads, id, l); },
+  deleteLead(id)     { return remove(KEYS.leads, id); },
+
+  getLeadsForUser(user) {
+    const leads = getAll(KEYS.leads);
+    if (user.role === 'manager') return leads;
+    if (user.role === 'team_lead') {
+      const teamMembers = Store.getUsersByTeam(user.teamId).map(u => u.id);
+      teamMembers.push(user.id);
+      return leads.filter(l => teamMembers.includes(l.assignedTo) || !l.assignedTo);
+    }
+    return leads.filter(l => l.assignedTo === user.id);
+  },
+
+  // ΓöÇΓöÇ Contacts ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+  getContacts()       { return getAll(KEYS.contacts); },
+  getContactById(id)  { return getById(KEYS.contacts, id); },
+  createContact(c)    { return create(KEYS.contacts, c); },
+  updateContact(id,c) { return update(KEYS.contacts, id, c); },
+  deleteContact(id)   { return remove(KEYS.contacts, id); },
+
+  // ΓöÇΓöÇ Deals ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+  getDeals()         { return getAll(KEYS.deals); },
+  getDealById(id)    { return getById(KEYS.deals, id); },
+  createDeal(deal)   { return create(KEYS.deals, deal); },
+  updateDeal(id, d)  { return update(KEYS.deals, id, d); },
+  deleteDeal(id)     { return remove(KEYS.deals, id); },
+
+  getDealsForUser(user) {
+    const deals = getAll(KEYS.deals);
+    if (user.role === 'manager') return deals;
+    if (user.role === 'team_lead') {
+      const teamMembers = Store.getUsersByTeam(user.teamId).map(u => u.id);
+      teamMembers.push(user.id);
+      return deals.filter(d => teamMembers.includes(d.assignedTo) || !d.assignedTo);
+    }
+    return deals.filter(d => d.assignedTo === user.id);
+  },
+
+  // ΓöÇΓöÇ Activities ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+  getActivities()        { return getAll(KEYS.activities); },
+  getActivityById(id)    { return getById(KEYS.activities, id); },
+  createActivity(a)      { return create(KEYS.activities, a); },
+
+  getActivitiesForDeal(dealId) {
+    return getAll(KEYS.activities)
+      .filter(a => a.dealId === dealId)
+      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
+  },
+
+  getRecentActivities(user, limit = 10) {
+    let activities = getAll(KEYS.activities);
+
+    if (user.role !== 'manager') {
+      const deals = Store.getDealsForUser(user);
+      const dealIds = new Set(deals.map(d => d.id));
+      activities = activities.filter(a => dealIds.has(a.dealId));
+    }
+
+    return activities
+      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
+      .slice(0, limit);
+  },
+
+  // ΓöÇΓöÇ Session ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+  getSession() {
+    try {
+      const data = localStorage.getItem(KEYS.session);
+      return data ? JSON.parse(data) : null;
+    } catch (e) {
+      return null;
+    }
+  },
+
+  setSession(session) {
+    localStorage.setItem(KEYS.session, JSON.stringify(session));
+  },
+
+  clearSession() {
+    localStorage.removeItem(KEYS.session);
+  },
+
+  // ΓöÇΓöÇ Seed Status ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+  isSeeded() {
+    return localStorage.getItem(KEYS.seeded) === 'true';
+  },
+
+  markSeeded() {
+    localStorage.setItem(KEYS.seeded, 'true');
+  },
+
+  // ΓöÇΓöÇ Full Reset ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+  clearAll() {
+    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
+  }
+};
diff --git a/js/utils.js b/js/utils.js
new file mode 100644
index 0000000..befc46b
--- /dev/null
+++ b/js/utils.js
@@ -0,0 +1,113 @@
+// ============================================================
+// TechnoEdge CRM ΓÇö Utilities
+// Formatters, ID generators, date helpers
+// ============================================================
+
+export function generateId() {
+  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
+}
+
+export function formatCurrency(amount, currency = 'INR') {
+  return new Intl.NumberFormat('en-IN', {
+    style: 'currency',
+    currency: currency,
+    minimumFractionDigits: 0,
+    maximumFractionDigits: 0
+  }).format(amount);
+}
+
+export function formatDate(dateStr) {
+  if (!dateStr) return 'ΓÇö';
+  const date = new Date(dateStr);
+  return date.toLocaleDateString('en-IN', {
+    day: 'numeric',
+    month: 'short',
+    year: 'numeric'
+  });
+}
+
+export function formatDateTime(dateStr) {
+  if (!dateStr) return 'ΓÇö';
+  const date = new Date(dateStr);
+  return date.toLocaleDateString('en-IN', {
+    day: 'numeric',
+    month: 'short',
+    year: 'numeric',
+    hour: '2-digit',
+    minute: '2-digit'
+  });
+}
+
+export function timeAgo(dateStr) {
+  if (!dateStr) return '';
+  const now = new Date();
+  const date = new Date(dateStr);
+  const seconds = Math.floor((now - date) / 1000);
+
+  if (seconds < 60) return 'Just now';
+  const minutes = Math.floor(seconds / 60);
+  if (minutes < 60) return `${minutes}m ago`;
+  const hours = Math.floor(minutes / 60);
+  if (hours < 24) return `${hours}h ago`;
+  const days = Math.floor(hours / 24);
+  if (days < 7) return `${days}d ago`;
+  const weeks = Math.floor(days / 7);
+  if (weeks < 4) return `${weeks}w ago`;
+  return formatDate(dateStr);
+}
+
+export function getInitials(name) {
+  if (!name) return '?';
+  return name
+    .split(' ')
+    .map(part => part[0])
+    .join('')
+    .toUpperCase()
+    .substring(0, 2);
+}
+
+export function capitalize(str) {
+  if (!str) return '';
+  return str.charAt(0).toUpperCase() + str.slice(1);
+}
+
+export function formatRole(role) {
+  const roleLabels = {
+    manager: 'Manager',
+    team_lead: 'Team Lead',
+    employee: 'Employee'
+  };
+  return roleLabels[role] || role;
+}
+
+export function sanitizeHTML(str) {
+  const div = document.createElement('div');
+  div.textContent = str;
+  return div.innerHTML;
+}
+
+export function debounce(fn, delay = 300) {
+  let timer;
+  return function (...args) {
+    clearTimeout(timer);
+    timer = setTimeout(() => fn.apply(this, args), delay);
+  };
+}
+
+export function getGreeting() {
+  const hour = new Date().getHours();
+  if (hour < 12) return 'Good morning';
+  if (hour < 17) return 'Good afternoon';
+  return 'Good evening';
+}
+
+// SOP stage definitions (single source of truth)
+export const SOP_STAGES = [
+  { key: 'sales',       label: 'Sales',           icon: 'target',   color: 'var(--color-stage-sales)' },
+  { key: 'requirement', label: 'Requirement',      icon: 'clipboard',color: 'var(--color-stage-requirement)' },
+  { key: 'sourcing',    label: 'Sourcing',         icon: 'search',   color: 'var(--color-stage-sourcing)' },
+  { key: 'delivery',    label: 'Delivery',         icon: 'truck',    color: 'var(--color-stage-delivery)' },
+  { key: 'feedback',    label: 'Feedback',         icon: 'message',  color: 'var(--color-stage-feedback)' },
+  { key: 'invoice',     label: 'Invoice/Payment',  icon: 'dollar',   color: 'var(--color-stage-invoice)' },
+  { key: 'renewal',     label: 'Renewal',          icon: 'refresh',  color: 'var(--color-stage-renewal)' }
+];
```

## Tests Run
```text
Manual check: opened index.html, tested Manager/Team Lead/Employee login, navigation visibility, logout, and browser console
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
