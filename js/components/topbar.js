// ============================================================
// TechnoEdge CRM — Topbar Component
// Breadcrumbs, search, user profile
// ============================================================

import { Auth } from '../auth.js';
import { getInitials, formatRole } from '../utils.js';

const SEARCH_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  pipeline:  'Pipeline',
  leads:     'Leads',
  contacts:  'Contacts',
  deals:     'Deals',
  team:      'Team',
  reports:   'Reports',
  settings:  'Settings'
};

export function renderTopbar(pageId) {
  const user = Auth.getCurrentUser();
  if (!user) return '';

  const pageTitle = PAGE_TITLES[pageId] || 'Page';
  const initials = getInitials(user.name);
  const roleName = formatRole(user.role);
  const roleCss  = `role-${user.role}`;

  return `
    <header class="topbar" id="topbar">
      <div class="topbar-left">
        <nav class="topbar-breadcrumb" aria-label="Breadcrumb">
          <span>TechnoEdge CRM</span>
          <span class="topbar-breadcrumb-separator">/</span>
          <span class="topbar-breadcrumb-current">${pageTitle}</span>
        </nav>
      </div>
      <div class="topbar-right">
        <div class="topbar-search">
          <span class="topbar-search-icon">${SEARCH_ICON}</span>
          <input 
            type="text" 
            class="topbar-search-input" 
            id="topbar-search" 
            placeholder="Search leads, deals, contacts…" 
            aria-label="Global search"
          />
        </div>
        <div class="topbar-user" id="topbar-user">
          <div class="topbar-user-avatar" style="background-color: ${user.avatarColor}">
            ${initials}
          </div>
          <span class="topbar-user-name">${user.name}</span>
          <span class="topbar-role-badge ${roleCss}">${roleName}</span>
        </div>
      </div>
    </header>
  `;
}

export function getPageTitle(pageId) {
  return PAGE_TITLES[pageId] || 'Page';
}
