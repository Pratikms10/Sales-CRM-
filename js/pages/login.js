// ============================================================
// TechnoEdge CRM — Login Page
// User picker login (no passwords)
// ============================================================

import { Store } from '../store.js';
import { Auth } from '../auth.js';
import { formatRole } from '../utils.js';
import { Toast } from '../components/toast.js';

const BRAND_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 3L4 14h5v7l9-11h-5V3z"/></svg>';
const CHEVRON_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>';

const ROLE_DESCRIPTIONS = {
  manager:   'Full access to all data, teams, approvals, overrides, and reports across the organization.',
  team_lead: 'Team-level access to assigned team data, work assignment, reviews, and escalations.',
  employee:  'Personal access to assigned work only. Cannot approve or view other teams\' data.'
};

const ROLE_BADGES = {
  manager:   'role-badge-manager',
  team_lead: 'role-badge-team_lead',
  employee:  'role-badge-employee'
};

export function renderLoginPage() {
  const users = Store.getUsers();

  const userOptions = users.map(u =>
    `<option value="${u.id}" data-role="${u.role}">${u.name} — ${formatRole(u.role)}</option>`
  ).join('');

  return `
    <div class="login-page" id="login-page">
      <div class="login-card">
        <div class="login-brand">
          <div class="login-brand-logo">
            ${BRAND_ICON}
          </div>
          <div class="login-brand-name">TechnoEdge CRM</div>
          <div class="login-brand-desc">
            Sales pipeline management with SOP-based workflow tracking
          </div>
        </div>

        <div class="login-divider"></div>

        <label class="login-label" for="login-user-select">Sign in as</label>
        <div class="login-select-wrapper">
          <select class="login-select" id="login-user-select">
            <option value="" disabled selected>Choose a user…</option>
            ${userOptions}
          </select>
          <span class="login-select-arrow">${CHEVRON_ICON}</span>
        </div>

        <div id="login-role-preview"></div>

        <button class="btn btn-primary btn-full" id="login-submit-btn" disabled>
          Sign In
        </button>
      </div>
    </div>
  `;
}

export function bindLoginEvents(onLoginSuccess) {
  const select = document.getElementById('login-user-select');
  const submitBtn = document.getElementById('login-submit-btn');
  const preview = document.getElementById('login-role-preview');

  if (!select || !submitBtn) return;

  select.addEventListener('change', () => {
    const userId = select.value;
    if (!userId) {
      submitBtn.disabled = true;
      preview.innerHTML = '';
      return;
    }

    submitBtn.disabled = false;

    const user = Store.getUserById(userId);
    if (user) {
      const roleName = formatRole(user.role);
      const badgeClass = ROLE_BADGES[user.role] || '';
      const desc = ROLE_DESCRIPTIONS[user.role] || '';

      preview.innerHTML = `
        <div class="login-role-preview">
          <div class="login-role-preview-title">
            ${user.name}
            <span class="role-badge ${badgeClass}" style="margin-left: 8px;">${roleName}</span>
          </div>
          <div class="login-role-preview-desc">${desc}</div>
        </div>
      `;
    }
  });

  submitBtn.addEventListener('click', () => {
    const userId = select.value;
    if (!userId) return;

    const user = Auth.login(userId);
    if (user) {
      Toast.success('Welcome back!', `Signed in as ${user.name}`);
      if (onLoginSuccess) onLoginSuccess(user);
    } else {
      Toast.error('Login failed', 'Could not sign in. Please try again.');
    }
  });
}
