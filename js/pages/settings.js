// ============================================================
// TechnoEdge CRM — Settings & Data Management Page
// Role-scoped settings, export/import, demo reset
// ============================================================

import { Store } from '../store.js';
import { Auth } from '../auth.js';
import { Router } from '../router.js';
import { Toast } from '../components/toast.js';
import { seedData } from '../seed.js';
import { formatRole, formatDateTime } from '../utils.js';

// ── Data Summary ────────────────────────────────────────────

function getDataSummary() {
  return {
    users: Store.getUsers().length,
    teams: Store.getTeams().length,
    leads: Store.getLeads().length,
    contacts: Store.getContacts().length,
    deals: Store.getDeals().length,
    activities: Store.getActivities().length,
    requirements: Store.getRequirements().length,
    proposals: Store.getProposals().length,
    handoffs: Store.getHandoffs().length
  };
}

// ── CSV Helpers ─────────────────────────────────────────────

function escapeCsvValue(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function toCsv(rows, columns) {
  const header = columns.map(c => escapeCsvValue(c.label)).join(',');
  const body = rows.map(row =>
    columns.map(c => escapeCsvValue(c.accessor(row))).join(',')
  ).join('\n');
  return header + '\n' + body;
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Section Builders ────────────────────────────────────────

function buildSessionCard() {
  const user = Auth.getCurrentUser();
  const session = Store.getSession();
  const team = user.teamId ? Store.getTeamById(user.teamId) : null;

  return `
    <div class="card settings-card">
      <div style="padding:1.5rem; border-bottom:1px solid var(--color-hairline-soft);">
        <h3 style="margin:0;">Current Session</h3>
      </div>
      <div style="padding:1.5rem;">
        <div class="settings-info-grid">
          <div class="settings-info-row">
            <span class="settings-info-label">User</span>
            <span class="settings-info-value">${user.name}</span>
          </div>
          <div class="settings-info-row">
            <span class="settings-info-label">Role</span>
            <span class="settings-info-value"><span class="role-badge role-badge-${user.role}">${formatRole(user.role)}</span></span>
          </div>
          <div class="settings-info-row">
            <span class="settings-info-label">Team</span>
            <span class="settings-info-value">${team ? team.name : '—'}</span>
          </div>
          <div class="settings-info-row">
            <span class="settings-info-label">Login Time</span>
            <span class="settings-info-value">${session && session.loginAt ? formatDateTime(session.loginAt) : '—'}</span>
          </div>
          <div class="settings-info-row">
            <span class="settings-info-label">Storage</span>
            <span class="settings-info-value">LocalStorage</span>
          </div>
          <div class="settings-info-row">
            <span class="settings-info-label">App Phase</span>
            <span class="settings-info-value"><span class="badge badge-primary">Phase 1H Basic CRM</span></span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function buildDataSummaryCard(user) {
  const summary = getDataSummary();
  const label = user.role === 'manager' ? 'Organization data summary' : 'Local demo data summary';

  const items = [
    { label: 'Users', count: summary.users, color: 'var(--color-stage-sales)' },
    { label: 'Teams', count: summary.teams, color: 'var(--color-stage-requirement)' },
    { label: 'Leads', count: summary.leads, color: 'var(--color-stage-sourcing)' },
    { label: 'Contacts', count: summary.contacts, color: 'var(--color-stage-delivery)' },
    { label: 'Deals', count: summary.deals, color: 'var(--color-stage-feedback)' },
    { label: 'Activities', count: summary.activities, color: 'var(--color-stage-invoice)' },
    { label: 'Requirements', count: summary.requirements, color: 'var(--color-primary)' },
    { label: 'Proposals', count: summary.proposals, color: 'var(--color-success)' },
    { label: 'Project Handoffs', count: summary.handoffs, color: 'var(--color-stage-invoice)' }
  ];

  const itemsHtml = items.map(i => `
    <div style="text-align:center;">
      <div style="font-size:1.5rem; font-weight:700; color:${i.color};">${i.count}</div>
      <div style="font-size:0.8rem; color:var(--color-muted);">${i.label}</div>
    </div>
  `).join('');

  return `
    <div class="card settings-card">
      <div style="padding:1.5rem; border-bottom:1px solid var(--color-hairline-soft);">
        <h3 style="margin:0;">Data Summary</h3>
        <p style="margin:0.25rem 0 0; font-size:0.85rem; color:var(--color-muted);">${label}</p>
      </div>
      <div style="padding:1.5rem;">
        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:1rem;">
          ${itemsHtml}
        </div>
      </div>
    </div>
  `;
}

function buildExportSection() {
  return `
    <div class="card settings-card">
      <div style="padding:1.5rem; border-bottom:1px solid var(--color-hairline-soft);">
        <h3 style="margin:0;">Export Data</h3>
        <p style="margin:0.25rem 0 0; font-size:0.85rem; color:var(--color-muted);">Download CRM data as JSON or CSV files.</p>
      </div>
      <div style="padding:1.5rem;">
        <div class="settings-action-row">
          <button class="btn btn-primary btn-sm" id="btn-export-json">Export Full JSON</button>
          <button class="btn btn-secondary btn-sm" id="btn-export-leads-csv">Export Leads CSV</button>
          <button class="btn btn-secondary btn-sm" id="btn-export-contacts-csv">Export Contacts CSV</button>
          <button class="btn btn-secondary btn-sm" id="btn-export-deals-csv">Export Deals CSV</button>
        </div>
      </div>
    </div>
  `;
}

function buildImportSection() {
  return `
    <div class="card settings-card">
      <div style="padding:1.5rem; border-bottom:1px solid var(--color-hairline-soft);">
        <h3 style="margin:0;">Import Data</h3>
        <p style="margin:0.25rem 0 0; font-size:0.85rem; color:var(--color-muted);">Imports a full CRM JSON export created by this Settings page.</p>
      </div>
      <div style="padding:1.5rem;">
        <div style="margin-bottom:1rem;">
          <input type="file" id="import-file-input" class="login-input" accept=".json" style="padding:0.5rem;">
        </div>
        <button class="btn btn-primary btn-sm" id="btn-import-json">Import JSON</button>
      </div>
    </div>
  `;
}

function buildResetSection() {
  return `
    <div class="card settings-card danger-zone">
      <div style="padding:1.5rem; border-bottom:1px solid var(--color-error);">
        <h3 style="margin:0; color:var(--color-error);">Danger Zone</h3>
        <p style="margin:0.25rem 0 0; font-size:0.85rem; color:var(--color-muted);">Destructive actions that cannot be undone.</p>
      </div>
      <div style="padding:1.5rem;">
        <div style="display:flex; align-items:center; justify-content:space-between; gap:1rem;">
          <div>
            <strong>Reset Demo Data</strong>
            <p style="margin:0.25rem 0 0; font-size:0.85rem; color:var(--color-muted);">Clears all CRM data and re-seeds the original demo dataset. You will be logged out.</p>
          </div>
          <button class="btn btn-sm" id="btn-reset-demo" style="background:var(--color-error); color:var(--color-on-primary); white-space:nowrap;">Reset Demo Data</button>
        </div>
      </div>
    </div>
  `;
}

function buildPreferencesSection() {
  const settings = Store.getSettings();
  const compactTables = settings.compactTables || false;

  return `
    <div class="card settings-card">
      <div style="padding:1.5rem; border-bottom:1px solid var(--color-hairline-soft);">
        <h3 style="margin:0;">Workspace Preferences</h3>
      </div>
      <div style="padding:1.5rem;">
        <div class="settings-info-grid">
          <div class="settings-info-row">
            <span class="settings-info-label">Compact Tables</span>
            <span class="settings-info-value">
              <input type="checkbox" id="pref-compact-tables" ${compactTables ? 'checked' : ''}>
            </span>
          </div>
          <div class="settings-info-row">
            <span class="settings-info-label">Currency</span>
            <span class="settings-info-value"><span class="badge badge-neutral">INR (locked)</span></span>
          </div>
        </div>
        <div style="margin-top:1rem;">
          <button class="btn btn-primary btn-sm" id="btn-save-preferences">Save Preferences</button>
        </div>
      </div>
    </div>
  `;
}

function buildSignOutSection() {
  return `
    <div class="card settings-card">
      <div style="padding:1.5rem; border-bottom:1px solid var(--color-hairline-soft);">
        <h3 style="margin:0;">Session</h3>
      </div>
      <div style="padding:1.5rem;">
        <div style="display:flex; align-items:center; justify-content:space-between; gap:1rem;">
          <div>
            <strong>Sign Out</strong>
            <p style="margin:0.25rem 0 0; font-size:0.85rem; color:var(--color-muted);">End your current session and return to the login screen.</p>
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-settings-signout">Sign Out</button>
        </div>
      </div>
    </div>
  `;
}

// ── Main Render ─────────────────────────────────────────────

export function renderSettings() {
  const user = Auth.getCurrentUser();
  if (!user) return '';

  const isManager = user.role === 'manager';
  const subtitle = isManager
    ? 'Manage CRM data, demo records, and local workspace settings.'
    : 'View workspace information and manage your local session.';

  let managerSections = '';
  if (isManager) {
    managerSections = `
      ${buildExportSection()}
      ${buildImportSection()}
      ${buildResetSection()}
    `;
  }

  return `
    <div class="content-inner">
      <div class="page-header">
        <div>
          <h1 class="page-header-title">Settings</h1>
          <p class="page-header-subtitle">${subtitle}</p>
        </div>
      </div>

      <div class="settings-grid">
        ${buildSessionCard()}
        ${buildDataSummaryCard(user)}
        ${managerSections}
        ${buildPreferencesSection()}
        ${buildSignOutSection()}
      </div>
    </div>
  `;
}

// ── Action Handlers ─────────────────────────────────────────

function handleExportJson() {
  const user = Auth.getCurrentUser();
  if (!user || user.role !== 'manager') {
    Toast.error('Permission Denied', 'Only managers can export data.');
    return;
  }
  const data = Store.exportData();
  const json = JSON.stringify(data, null, 2);
  downloadFile('technoedge-crm-export.json', json, 'application/json');
  Toast.success('Exported', 'Full CRM data downloaded as JSON.');
}

function handleExportCsv(type) {
  const user = Auth.getCurrentUser();
  if (!user || user.role !== 'manager') {
    Toast.error('Permission Denied', 'Only managers can export data.');
    return;
  }

  let csv = '';
  let filename = '';

  if (type === 'leads') {
    const leads = Store.getLeads();
    csv = toCsv(leads, [
      { label: 'ID', accessor: r => r.id },
      { label: 'Name', accessor: r => r.name },
      { label: 'Company', accessor: r => r.company },
      { label: 'Email', accessor: r => r.email },
      { label: 'Phone', accessor: r => r.phone },
      { label: 'Source', accessor: r => r.source },
      { label: 'Status', accessor: r => r.status },
      { label: 'Assigned To', accessor: r => { const u = Store.getUserById(r.assignedTo); return u ? u.name : ''; } },
      { label: 'Created At', accessor: r => r.createdAt },
      { label: 'Updated At', accessor: r => r.updatedAt }
    ]);
    filename = 'technoedge-leads.csv';
  } else if (type === 'contacts') {
    const contacts = Store.getContacts();
    csv = toCsv(contacts, [
      { label: 'ID', accessor: r => r.id },
      { label: 'Name', accessor: r => r.name },
      { label: 'Company', accessor: r => r.company },
      { label: 'Designation', accessor: r => r.designation },
      { label: 'Email', accessor: r => r.email },
      { label: 'Phone', accessor: r => r.phone },
      { label: 'Type', accessor: r => r.type },
      { label: 'Tags', accessor: r => Array.isArray(r.tags) ? r.tags.join('; ') : r.tags },
      { label: 'Created At', accessor: r => r.createdAt }
    ]);
    filename = 'technoedge-contacts.csv';
  } else if (type === 'deals') {
    const deals = Store.getDeals();
    csv = toCsv(deals, [
      { label: 'ID', accessor: r => r.id },
      { label: 'Title', accessor: r => r.title },
      { label: 'Value', accessor: r => r.value },
      { label: 'Currency', accessor: r => r.currency },
      { label: 'Stage', accessor: r => r.stage },
      { label: 'Status', accessor: r => r.status },
      { label: 'Priority', accessor: r => r.priority },
      { label: 'Assigned To', accessor: r => { const u = Store.getUserById(r.assignedTo); return u ? u.name : ''; } },
      { label: 'Team', accessor: r => { const t = Store.getTeamById(r.teamId); return t ? t.name : ''; } },
      { label: 'Created At', accessor: r => r.createdAt },
      { label: 'Updated At', accessor: r => r.updatedAt }
    ]);
    filename = 'technoedge-deals.csv';
  }

  downloadFile(filename, csv, 'text/csv');
  Toast.success('Exported', `${type.charAt(0).toUpperCase() + type.slice(1)} CSV downloaded.`);
}

function handleImportJson() {
  const user = Auth.getCurrentUser();
  if (!user || user.role !== 'manager') {
    Toast.error('Permission Denied', 'Only managers can import data.');
    return;
  }

  const fileInput = document.getElementById('import-file-input');
  if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    Toast.error('No File', 'Please select a JSON file to import.');
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onerror = function() {
    Toast.error('Read Error', 'The selected file could not be read.');
  };

  reader.onload = function(e) {
    let payload;
    try {
      payload = JSON.parse(e.target.result);
    } catch (err) {
      Toast.error('Invalid JSON', 'The selected file is not valid JSON.');
      return;
    }

    // Validate structure
    const requiredKeys = ['users', 'teams', 'leads', 'contacts', 'deals', 'activities'];
    const optionalArrayKeys = ['requirements', 'proposals', 'handoffs'];
    for (const key of requiredKeys) {
      if (!Array.isArray(payload[key])) {
        Toast.error('Invalid Structure', `Missing or invalid "${key}" array in import file.`);
        return;
      }
    }
    for (const key of optionalArrayKeys) {
      if (payload[key] !== undefined && !Array.isArray(payload[key])) {
        Toast.error('Invalid Structure', `"${key}" must be an array if present.`);
        return;
      }
    }

    if (!confirm('This will replace ALL existing CRM data with the imported data. Continue?')) {
      return;
    }

    const imported = Store.importData(payload);

    if (!imported) {
      Toast.error('Import Failed', 'LocalStorage write failed. Your existing data has been preserved.');
      return;
    }

    // Check if current user still exists
    const currentSession = Store.getSession();
    if (currentSession && currentSession.userId) {
      const stillExists = Store.getUserById(currentSession.userId);
      if (!stillExists) {
        Store.clearSession();
        Toast.success('Import Complete', 'Data imported. Your user no longer exists — redirecting to login.');
        Router.navigate('#/login');
        return;
      }
    }

    Toast.success('Import Complete', 'CRM data has been replaced with imported data.');
    Router.handleRoute();
  };

  reader.readAsText(file);
}

function handleResetDemoData() {
  const user = Auth.getCurrentUser();
  if (!user || user.role !== 'manager') {
    Toast.error('Permission Denied', 'Only managers can reset demo data.');
    return;
  }

  if (!confirm('This will erase ALL CRM data and restore the original demo dataset. You will be logged out. Continue?')) {
    return;
  }

  Store.clearAll();
  seedData();
  Toast.success('Reset Complete', 'Demo data has been restored. Please log in again.');
  Router.navigate('#/login');
}

function handleSavePreferences() {
  const compactTables = document.getElementById('pref-compact-tables')?.checked || false;
  const settings = Store.getSettings();
  settings.compactTables = compactTables;
  Store.updateSettings(settings);
  Toast.success('Saved', 'Workspace preferences updated.');
}

function reRenderSettings() {
  const contentEl = document.getElementById('content-area');
  if (contentEl) {
    contentEl.innerHTML = renderSettings();
  }
}

// ── Event Binding ───────────────────────────────────────────

export function bindSettingsEvents() {
  const content = document.getElementById('content-area');
  if (!content) return;

  content.addEventListener('click', (e) => {
    // Sign out — all roles
    if (e.target.id === 'btn-settings-signout') {
      Auth.logout();
      Toast.info('Signed out', 'You have been logged out.');
      Router.navigate('#/login');
      return;
    }

    // Save preferences — all roles
    if (e.target.id === 'btn-save-preferences') {
      handleSavePreferences();
      return;
    }

    // Manager-only actions
    if (e.target.id === 'btn-export-json') {
      handleExportJson();
      return;
    }
    if (e.target.id === 'btn-export-leads-csv') {
      handleExportCsv('leads');
      return;
    }
    if (e.target.id === 'btn-export-contacts-csv') {
      handleExportCsv('contacts');
      return;
    }
    if (e.target.id === 'btn-export-deals-csv') {
      handleExportCsv('deals');
      return;
    }
    if (e.target.id === 'btn-import-json') {
      handleImportJson();
      return;
    }
    if (e.target.id === 'btn-reset-demo') {
      handleResetDemoData();
      return;
    }
  });
}
