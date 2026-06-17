# AI Change Audit Report

## Generated On
2026-06-17_18-56-37

## Branch
main

## Baseline Commit
22f4eab

## Task Summary
Phase 1H Settings and Data Management page with role-scoped export, atomic JSON import, demo reset, session controls, and local preferences

## Git Status
```text
 M css/components.css
 M js/app.js
 A js/pages/settings.js
 M js/store.js
```

## Files Changed
```text
M	css/components.css
M	js/app.js
A	js/pages/settings.js
M	js/store.js
```

## Change Summary
```text
 css/components.css   |  51 ++++++
 js/app.js            |   4 +-
 js/pages/settings.js | 503 +++++++++++++++++++++++++++++++++++++++++++++++++++
 js/store.js          |  77 ++++++++
 4 files changed, 634 insertions(+), 1 deletion(-)
```

## Full Diff
```diff
diff --git a/css/components.css b/css/components.css
index af2c123..0338e6f 100644
--- a/css/components.css
+++ b/css/components.css
@@ -972,3 +972,54 @@
   transition: width var(--transition-base);
   min-width: 2px;
 }
+
+/* ΓöÇΓöÇ Settings & Data Management ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
+.settings-grid {
+  display: flex;
+  flex-direction: column;
+  gap: var(--space-lg);
+}
+
+.settings-card {
+  transition: box-shadow var(--transition-fast);
+}
+
+.settings-info-grid {
+  display: flex;
+  flex-direction: column;
+  gap: var(--space-sm);
+}
+
+.settings-info-row {
+  display: flex;
+  align-items: center;
+  justify-content: space-between;
+  padding: var(--space-sm) 0;
+  border-bottom: 1px solid var(--color-hairline-soft);
+}
+
+.settings-info-row:last-child {
+  border-bottom: none;
+}
+
+.settings-info-label {
+  font: var(--text-body-sm);
+  color: var(--color-muted);
+  font-weight: 500;
+}
+
+.settings-info-value {
+  font: var(--text-body-sm);
+  color: var(--color-ink);
+  font-weight: 600;
+}
+
+.settings-action-row {
+  display: flex;
+  gap: var(--space-md);
+  flex-wrap: wrap;
+}
+
+.danger-zone {
+  border: 1px solid var(--color-error);
+}
diff --git a/js/app.js b/js/app.js
index 289dcb3..45a11b5 100644
--- a/js/app.js
+++ b/js/app.js
@@ -18,6 +18,7 @@ import { renderContacts, bindContactsEvents } from './pages/contacts.js';
 import { renderDeals, bindDealsEvents } from './pages/deals.js';
 import { renderTeam, bindTeamEvents } from './pages/team.js';
 import { renderReports, bindReportsEvents } from './pages/reports.js';
+import { renderSettings, bindSettingsEvents } from './pages/settings.js';
 
 // ΓöÇΓöÇ DOM References ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
 
@@ -123,7 +124,7 @@ function renderPage(pageId, params) {
       contentEl.innerHTML = renderReports();
       break;
     case 'settings':
-      contentEl.innerHTML = renderComingSoon(pageId);
+      contentEl.innerHTML = renderSettings();
       break;
     default:
       contentEl.innerHTML = renderComingSoon(pageId);
@@ -140,6 +141,7 @@ bindContactsEvents();
 bindDealsEvents();
 bindTeamEvents();
 bindReportsEvents();
+bindSettingsEvents();
 
 // ΓöÇΓöÇ Bootstrap ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
 
diff --git a/js/pages/settings.js b/js/pages/settings.js
new file mode 100644
index 0000000..b30425d
--- /dev/null
+++ b/js/pages/settings.js
@@ -0,0 +1,503 @@
+// ============================================================
+// TechnoEdge CRM ΓÇö Settings & Data Management Page
+// Role-scoped settings, export/import, demo reset
+// ============================================================
+
+import { Store } from '../store.js';
+import { Auth } from '../auth.js';
+import { Router } from '../router.js';
+import { Toast } from '../components/toast.js';
+import { seedData } from '../seed.js';
+import { formatRole, formatDateTime } from '../utils.js';
+
+// ΓöÇΓöÇ Data Summary ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+function getDataSummary() {
+  return {
+    users: Store.getUsers().length,
+    teams: Store.getTeams().length,
+    leads: Store.getLeads().length,
+    contacts: Store.getContacts().length,
+    deals: Store.getDeals().length,
+    activities: Store.getActivities().length
+  };
+}
+
+// ΓöÇΓöÇ CSV Helpers ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+function escapeCsvValue(value) {
+  if (value === null || value === undefined) return '';
+  const str = String(value);
+  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
+    return '"' + str.replace(/"/g, '""') + '"';
+  }
+  return str;
+}
+
+function toCsv(rows, columns) {
+  const header = columns.map(c => escapeCsvValue(c.label)).join(',');
+  const body = rows.map(row =>
+    columns.map(c => escapeCsvValue(c.accessor(row))).join(',')
+  ).join('\n');
+  return header + '\n' + body;
+}
+
+function downloadFile(filename, content, mimeType) {
+  const blob = new Blob([content], { type: mimeType });
+  const url = URL.createObjectURL(blob);
+  const a = document.createElement('a');
+  a.href = url;
+  a.download = filename;
+  document.body.appendChild(a);
+  a.click();
+  document.body.removeChild(a);
+  URL.revokeObjectURL(url);
+}
+
+// ΓöÇΓöÇ Section Builders ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+function buildSessionCard() {
+  const user = Auth.getCurrentUser();
+  const session = Store.getSession();
+  const team = user.teamId ? Store.getTeamById(user.teamId) : null;
+
+  return `
+    <div class="card settings-card">
+      <div style="padding:1.5rem; border-bottom:1px solid var(--color-hairline-soft);">
+        <h3 style="margin:0;">Current Session</h3>
+      </div>
+      <div style="padding:1.5rem;">
+        <div class="settings-info-grid">
+          <div class="settings-info-row">
+            <span class="settings-info-label">User</span>
+            <span class="settings-info-value">${user.name}</span>
+          </div>
+          <div class="settings-info-row">
+            <span class="settings-info-label">Role</span>
+            <span class="settings-info-value"><span class="role-badge role-badge-${user.role}">${formatRole(user.role)}</span></span>
+          </div>
+          <div class="settings-info-row">
+            <span class="settings-info-label">Team</span>
+            <span class="settings-info-value">${team ? team.name : 'ΓÇö'}</span>
+          </div>
+          <div class="settings-info-row">
+            <span class="settings-info-label">Login Time</span>
+            <span class="settings-info-value">${session && session.loginAt ? formatDateTime(session.loginAt) : 'ΓÇö'}</span>
+          </div>
+          <div class="settings-info-row">
+            <span class="settings-info-label">Storage</span>
+            <span class="settings-info-value">LocalStorage</span>
+          </div>
+          <div class="settings-info-row">
+            <span class="settings-info-label">App Phase</span>
+            <span class="settings-info-value"><span class="badge badge-primary">Phase 1H Basic CRM</span></span>
+          </div>
+        </div>
+      </div>
+    </div>
+  `;
+}
+
+function buildDataSummaryCard(user) {
+  const summary = getDataSummary();
+  const label = user.role === 'manager' ? 'Organization data summary' : 'Local demo data summary';
+
+  const items = [
+    { label: 'Users', count: summary.users, color: 'var(--color-stage-sales)' },
+    { label: 'Teams', count: summary.teams, color: 'var(--color-stage-requirement)' },
+    { label: 'Leads', count: summary.leads, color: 'var(--color-stage-sourcing)' },
+    { label: 'Contacts', count: summary.contacts, color: 'var(--color-stage-delivery)' },
+    { label: 'Deals', count: summary.deals, color: 'var(--color-stage-feedback)' },
+    { label: 'Activities', count: summary.activities, color: 'var(--color-stage-invoice)' }
+  ];
+
+  const itemsHtml = items.map(i => `
+    <div style="text-align:center;">
+      <div style="font-size:1.5rem; font-weight:700; color:${i.color};">${i.count}</div>
+      <div style="font-size:0.8rem; color:var(--color-muted);">${i.label}</div>
+    </div>
+  `).join('');
+
+  return `
+    <div class="card settings-card">
+      <div style="padding:1.5rem; border-bottom:1px solid var(--color-hairline-soft);">
+        <h3 style="margin:0;">Data Summary</h3>
+        <p style="margin:0.25rem 0 0; font-size:0.85rem; color:var(--color-muted);">${label}</p>
+      </div>
+      <div style="padding:1.5rem;">
+        <div style="display:grid; grid-template-columns:repeat(6, 1fr); gap:1rem;">
+          ${itemsHtml}
+        </div>
+      </div>
+    </div>
+  `;
+}
+
+function buildExportSection() {
+  return `
+    <div class="card settings-card">
+      <div style="padding:1.5rem; border-bottom:1px solid var(--color-hairline-soft);">
+        <h3 style="margin:0;">Export Data</h3>
+        <p style="margin:0.25rem 0 0; font-size:0.85rem; color:var(--color-muted);">Download CRM data as JSON or CSV files.</p>
+      </div>
+      <div style="padding:1.5rem;">
+        <div class="settings-action-row">
+          <button class="btn btn-primary btn-sm" id="btn-export-json">Export Full JSON</button>
+          <button class="btn btn-secondary btn-sm" id="btn-export-leads-csv">Export Leads CSV</button>
+          <button class="btn btn-secondary btn-sm" id="btn-export-contacts-csv">Export Contacts CSV</button>
+          <button class="btn btn-secondary btn-sm" id="btn-export-deals-csv">Export Deals CSV</button>
+        </div>
+      </div>
+    </div>
+  `;
+}
+
+function buildImportSection() {
+  return `
+    <div class="card settings-card">
+      <div style="padding:1.5rem; border-bottom:1px solid var(--color-hairline-soft);">
+        <h3 style="margin:0;">Import Data</h3>
+        <p style="margin:0.25rem 0 0; font-size:0.85rem; color:var(--color-muted);">Imports a full CRM JSON export created by this Settings page.</p>
+      </div>
+      <div style="padding:1.5rem;">
+        <div style="margin-bottom:1rem;">
+          <input type="file" id="import-file-input" class="login-input" accept=".json" style="padding:0.5rem;">
+        </div>
+        <button class="btn btn-primary btn-sm" id="btn-import-json">Import JSON</button>
+      </div>
+    </div>
+  `;
+}
+
+function buildResetSection() {
+  return `
+    <div class="card settings-card danger-zone">
+      <div style="padding:1.5rem; border-bottom:1px solid var(--color-error);">
+        <h3 style="margin:0; color:var(--color-error);">Danger Zone</h3>
+        <p style="margin:0.25rem 0 0; font-size:0.85rem; color:var(--color-muted);">Destructive actions that cannot be undone.</p>
+      </div>
+      <div style="padding:1.5rem;">
+        <div style="display:flex; align-items:center; justify-content:space-between; gap:1rem;">
+          <div>
+            <strong>Reset Demo Data</strong>
+            <p style="margin:0.25rem 0 0; font-size:0.85rem; color:var(--color-muted);">Clears all CRM data and re-seeds the original demo dataset. You will be logged out.</p>
+          </div>
+          <button class="btn btn-sm" id="btn-reset-demo" style="background:var(--color-error); color:var(--color-on-primary); white-space:nowrap;">Reset Demo Data</button>
+        </div>
+      </div>
+    </div>
+  `;
+}
+
+function buildPreferencesSection() {
+  const settings = Store.getSettings();
+  const compactTables = settings.compactTables || false;
+
+  return `
+    <div class="card settings-card">
+      <div style="padding:1.5rem; border-bottom:1px solid var(--color-hairline-soft);">
+        <h3 style="margin:0;">Workspace Preferences</h3>
+      </div>
+      <div style="padding:1.5rem;">
+        <div class="settings-info-grid">
+          <div class="settings-info-row">
+            <span class="settings-info-label">Compact Tables</span>
+            <span class="settings-info-value">
+              <input type="checkbox" id="pref-compact-tables" ${compactTables ? 'checked' : ''}>
+            </span>
+          </div>
+          <div class="settings-info-row">
+            <span class="settings-info-label">Currency</span>
+            <span class="settings-info-value"><span class="badge badge-neutral">INR (locked)</span></span>
+          </div>
+        </div>
+        <div style="margin-top:1rem;">
+          <button class="btn btn-primary btn-sm" id="btn-save-preferences">Save Preferences</button>
+        </div>
+      </div>
+    </div>
+  `;
+}
+
+function buildSignOutSection() {
+  return `
+    <div class="card settings-card">
+      <div style="padding:1.5rem; border-bottom:1px solid var(--color-hairline-soft);">
+        <h3 style="margin:0;">Session</h3>
+      </div>
+      <div style="padding:1.5rem;">
+        <div style="display:flex; align-items:center; justify-content:space-between; gap:1rem;">
+          <div>
+            <strong>Sign Out</strong>
+            <p style="margin:0.25rem 0 0; font-size:0.85rem; color:var(--color-muted);">End your current session and return to the login screen.</p>
+          </div>
+          <button class="btn btn-secondary btn-sm" id="btn-settings-signout">Sign Out</button>
+        </div>
+      </div>
+    </div>
+  `;
+}
+
+// ΓöÇΓöÇ Main Render ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+export function renderSettings() {
+  const user = Auth.getCurrentUser();
+  if (!user) return '';
+
+  const isManager = user.role === 'manager';
+  const subtitle = isManager
+    ? 'Manage CRM data, demo records, and local workspace settings.'
+    : 'View workspace information and manage your local session.';
+
+  let managerSections = '';
+  if (isManager) {
+    managerSections = `
+      ${buildExportSection()}
+      ${buildImportSection()}
+      ${buildResetSection()}
+    `;
+  }
+
+  return `
+    <div class="content-inner">
+      <div class="page-header">
+        <div>
+          <h1 class="page-header-title">Settings</h1>
+          <p class="page-header-subtitle">${subtitle}</p>
+        </div>
+      </div>
+
+      <div class="settings-grid">
+        ${buildSessionCard()}
+        ${buildDataSummaryCard(user)}
+        ${managerSections}
+        ${buildPreferencesSection()}
+        ${buildSignOutSection()}
+      </div>
+    </div>
+  `;
+}
+
+// ΓöÇΓöÇ Action Handlers ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+function handleExportJson() {
+  const user = Auth.getCurrentUser();
+  if (!user || user.role !== 'manager') {
+    Toast.error('Permission Denied', 'Only managers can export data.');
+    return;
+  }
+  const data = Store.exportData();
+  const json = JSON.stringify(data, null, 2);
+  downloadFile('technoedge-crm-export.json', json, 'application/json');
+  Toast.success('Exported', 'Full CRM data downloaded as JSON.');
+}
+
+function handleExportCsv(type) {
+  const user = Auth.getCurrentUser();
+  if (!user || user.role !== 'manager') {
+    Toast.error('Permission Denied', 'Only managers can export data.');
+    return;
+  }
+
+  let csv = '';
+  let filename = '';
+
+  if (type === 'leads') {
+    const leads = Store.getLeads();
+    csv = toCsv(leads, [
+      { label: 'ID', accessor: r => r.id },
+      { label: 'Name', accessor: r => r.name },
+      { label: 'Company', accessor: r => r.company },
+      { label: 'Email', accessor: r => r.email },
+      { label: 'Phone', accessor: r => r.phone },
+      { label: 'Source', accessor: r => r.source },
+      { label: 'Status', accessor: r => r.status },
+      { label: 'Assigned To', accessor: r => { const u = Store.getUserById(r.assignedTo); return u ? u.name : ''; } },
+      { label: 'Created At', accessor: r => r.createdAt },
+      { label: 'Updated At', accessor: r => r.updatedAt }
+    ]);
+    filename = 'technoedge-leads.csv';
+  } else if (type === 'contacts') {
+    const contacts = Store.getContacts();
+    csv = toCsv(contacts, [
+      { label: 'ID', accessor: r => r.id },
+      { label: 'Name', accessor: r => r.name },
+      { label: 'Company', accessor: r => r.company },
+      { label: 'Designation', accessor: r => r.designation },
+      { label: 'Email', accessor: r => r.email },
+      { label: 'Phone', accessor: r => r.phone },
+      { label: 'Type', accessor: r => r.type },
+      { label: 'Tags', accessor: r => Array.isArray(r.tags) ? r.tags.join('; ') : r.tags },
+      { label: 'Created At', accessor: r => r.createdAt }
+    ]);
+    filename = 'technoedge-contacts.csv';
+  } else if (type === 'deals') {
+    const deals = Store.getDeals();
+    csv = toCsv(deals, [
+      { label: 'ID', accessor: r => r.id },
+      { label: 'Title', accessor: r => r.title },
+      { label: 'Value', accessor: r => r.value },
+      { label: 'Currency', accessor: r => r.currency },
+      { label: 'Stage', accessor: r => r.stage },
+      { label: 'Status', accessor: r => r.status },
+      { label: 'Priority', accessor: r => r.priority },
+      { label: 'Assigned To', accessor: r => { const u = Store.getUserById(r.assignedTo); return u ? u.name : ''; } },
+      { label: 'Team', accessor: r => { const t = Store.getTeamById(r.teamId); return t ? t.name : ''; } },
+      { label: 'Created At', accessor: r => r.createdAt },
+      { label: 'Updated At', accessor: r => r.updatedAt }
+    ]);
+    filename = 'technoedge-deals.csv';
+  }
+
+  downloadFile(filename, csv, 'text/csv');
+  Toast.success('Exported', `${type.charAt(0).toUpperCase() + type.slice(1)} CSV downloaded.`);
+}
+
+function handleImportJson() {
+  const user = Auth.getCurrentUser();
+  if (!user || user.role !== 'manager') {
+    Toast.error('Permission Denied', 'Only managers can import data.');
+    return;
+  }
+
+  const fileInput = document.getElementById('import-file-input');
+  if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
+    Toast.error('No File', 'Please select a JSON file to import.');
+    return;
+  }
+
+  const file = fileInput.files[0];
+  const reader = new FileReader();
+
+  reader.onerror = function() {
+    Toast.error('Read Error', 'The selected file could not be read.');
+  };
+
+  reader.onload = function(e) {
+    let payload;
+    try {
+      payload = JSON.parse(e.target.result);
+    } catch (err) {
+      Toast.error('Invalid JSON', 'The selected file is not valid JSON.');
+      return;
+    }
+
+    // Validate structure
+    const requiredKeys = ['users', 'teams', 'leads', 'contacts', 'deals', 'activities'];
+    for (const key of requiredKeys) {
+      if (!Array.isArray(payload[key])) {
+        Toast.error('Invalid Structure', `Missing or invalid "${key}" array in import file.`);
+        return;
+      }
+    }
+
+    if (!confirm('This will replace ALL existing CRM data with the imported data. Continue?')) {
+      return;
+    }
+
+    const imported = Store.importData(payload);
+
+    if (!imported) {
+      Toast.error('Import Failed', 'LocalStorage write failed. Your existing data has been preserved.');
+      return;
+    }
+
+    // Check if current user still exists
+    const currentSession = Store.getSession();
+    if (currentSession && currentSession.userId) {
+      const stillExists = Store.getUserById(currentSession.userId);
+      if (!stillExists) {
+        Store.clearSession();
+        Toast.success('Import Complete', 'Data imported. Your user no longer exists ΓÇö redirecting to login.');
+        Router.navigate('#/login');
+        return;
+      }
+    }
+
+    Toast.success('Import Complete', 'CRM data has been replaced with imported data.');
+    Router.handleRoute();
+  };
+
+  reader.readAsText(file);
+}
+
+function handleResetDemoData() {
+  const user = Auth.getCurrentUser();
+  if (!user || user.role !== 'manager') {
+    Toast.error('Permission Denied', 'Only managers can reset demo data.');
+    return;
+  }
+
+  if (!confirm('This will erase ALL CRM data and restore the original demo dataset. You will be logged out. Continue?')) {
+    return;
+  }
+
+  Store.clearAll();
+  seedData();
+  Toast.success('Reset Complete', 'Demo data has been restored. Please log in again.');
+  Router.navigate('#/login');
+}
+
+function handleSavePreferences() {
+  const compactTables = document.getElementById('pref-compact-tables')?.checked || false;
+  const settings = Store.getSettings();
+  settings.compactTables = compactTables;
+  Store.updateSettings(settings);
+  Toast.success('Saved', 'Workspace preferences updated.');
+}
+
+function reRenderSettings() {
+  const contentEl = document.getElementById('content-area');
+  if (contentEl) {
+    contentEl.innerHTML = renderSettings();
+  }
+}
+
+// ΓöÇΓöÇ Event Binding ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+
+export function bindSettingsEvents() {
+  const content = document.getElementById('content-area');
+  if (!content) return;
+
+  content.addEventListener('click', (e) => {
+    // Sign out ΓÇö all roles
+    if (e.target.id === 'btn-settings-signout') {
+      Auth.logout();
+      Toast.info('Signed out', 'You have been logged out.');
+      Router.navigate('#/login');
+      return;
+    }
+
+    // Save preferences ΓÇö all roles
+    if (e.target.id === 'btn-save-preferences') {
+      handleSavePreferences();
+      return;
+    }
+
+    // Manager-only actions
+    if (e.target.id === 'btn-export-json') {
+      handleExportJson();
+      return;
+    }
+    if (e.target.id === 'btn-export-leads-csv') {
+      handleExportCsv('leads');
+      return;
+    }
+    if (e.target.id === 'btn-export-contacts-csv') {
+      handleExportCsv('contacts');
+      return;
+    }
+    if (e.target.id === 'btn-export-deals-csv') {
+      handleExportCsv('deals');
+      return;
+    }
+    if (e.target.id === 'btn-import-json') {
+      handleImportJson();
+      return;
+    }
+    if (e.target.id === 'btn-reset-demo') {
+      handleResetDemoData();
+      return;
+    }
+  });
+}
diff --git a/js/store.js b/js/store.js
index 6328d28..3fd15ef 100644
--- a/js/store.js
+++ b/js/store.js
@@ -186,6 +186,83 @@ export const Store = {
     localStorage.setItem(KEYS.seeded, 'true');
   },
 
+  // ΓöÇΓöÇ Settings ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+  getSettings() {
+    try {
+      const data = localStorage.getItem(KEYS.settings);
+      return data ? JSON.parse(data) : {};
+    } catch (e) {
+      return {};
+    }
+  },
+
+  updateSettings(settings) {
+    try {
+      localStorage.setItem(KEYS.settings, JSON.stringify(settings));
+    } catch (e) {
+      console.error('Store: Error writing settings', e);
+    }
+  },
+
+  // ΓöÇΓöÇ Export / Import ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+  exportData() {
+    return {
+      users: getAll(KEYS.users),
+      teams: getAll(KEYS.teams),
+      leads: getAll(KEYS.leads),
+      contacts: getAll(KEYS.contacts),
+      deals: getAll(KEYS.deals),
+      activities: getAll(KEYS.activities),
+      settings: Store.getSettings(),
+      exportedAt: new Date().toISOString()
+    };
+  },
+
+  importData(payload) {
+    // Pre-serialize all datasets before touching localStorage
+    const dataKeys = [KEYS.users, KEYS.teams, KEYS.leads, KEYS.contacts, KEYS.deals, KEYS.activities, KEYS.settings];
+    const newValues = {
+      [KEYS.users]:      JSON.stringify(payload.users || []),
+      [KEYS.teams]:      JSON.stringify(payload.teams || []),
+      [KEYS.leads]:      JSON.stringify(payload.leads || []),
+      [KEYS.contacts]:   JSON.stringify(payload.contacts || []),
+      [KEYS.deals]:      JSON.stringify(payload.deals || []),
+      [KEYS.activities]: JSON.stringify(payload.activities || []),
+      [KEYS.settings]:   JSON.stringify(payload.settings || {})
+    };
+
+    // Back up existing values
+    const backup = {};
+    dataKeys.forEach(key => {
+      backup[key] = localStorage.getItem(key);
+    });
+    const seededBackup = localStorage.getItem(KEYS.seeded);
+
+    try {
+      dataKeys.forEach(key => {
+        localStorage.setItem(key, newValues[key]);
+      });
+      localStorage.setItem(KEYS.seeded, 'true');
+      return true;
+    } catch (e) {
+      console.error('Store: Import failed, rolling back', e);
+      // Restore backups
+      dataKeys.forEach(key => {
+        if (backup[key] === null) {
+          localStorage.removeItem(key);
+        } else {
+          localStorage.setItem(key, backup[key]);
+        }
+      });
+      if (seededBackup === null) {
+        localStorage.removeItem(KEYS.seeded);
+      } else {
+        localStorage.setItem(KEYS.seeded, seededBackup);
+      }
+      return false;
+    }
+  },
+
   // ΓöÇΓöÇ Full Reset ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
   clearAll() {
     Object.values(KEYS).forEach(key => localStorage.removeItem(key));
```

## Tests Run
```text
Browser preview performed externally: Manager settings actions checked; Team Lead and Employee restricted settings checked; export/import/reset behavior checked
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
