// ============================================================
// TechnoEdge CRM — App Entry Point
// Bootstrap, seed, routing, page rendering
// ============================================================

import { seedData } from './seed.js';
import { Auth } from './auth.js';
import { Router } from './router.js';
import { Toast } from './components/toast.js';
import { renderSidebar, bindSidebarEvents } from './components/sidebar.js';
import { renderTopbar } from './components/topbar.js';
import { renderLoginPage, bindLoginEvents } from './pages/login.js';
import { renderDashboard } from './pages/dashboard.js';

// ── DOM References ──────────────────────────────────────────

const appEl      = document.getElementById('app');
const shellEl    = document.getElementById('app-shell');
const sidebarEl  = document.getElementById('sidebar-root');
const topbarEl   = document.getElementById('topbar-root');
const contentEl  = document.getElementById('content-area');

// ── Coming Soon page (placeholder for unbuilt pages) ────────

const COMING_SOON_ICONS = {
  pipeline: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>',
  leads:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>',
  contacts: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  deals:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>',
  team:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>',
  reports:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68 1.65 1.65 0 0010 3.17V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>'
};

const PAGE_LABELS = {
  pipeline: 'Pipeline',
  leads:    'Leads',
  contacts: 'Contacts',
  deals:    'Deals',
  team:     'Team',
  reports:  'Reports',
  settings: 'Settings'
};

function renderComingSoon(pageId) {
  const icon = COMING_SOON_ICONS[pageId] || '';
  const label = PAGE_LABELS[pageId] || pageId;
  return `
    <div class="content-inner">
      <div class="coming-soon">
        <div class="coming-soon-icon">${icon}</div>
        <h3 class="coming-soon-title">${label}</h3>
        <p class="coming-soon-desc">
          This section is coming in the next phase. 
          The foundation is ready — full ${label.toLowerCase()} management will be built soon.
        </p>
      </div>
    </div>
  `;
}

// ── Page Rendering ──────────────────────────────────────────

function renderPage(pageId, params) {

  // ── LOGIN PAGE (no shell) ────────────────────────────
  if (pageId === 'login') {
    shellEl.classList.add('is-login');
    appEl.innerHTML = renderLoginPage();
    bindLoginEvents((user) => {
      Router.navigate('#/dashboard');
    });
    return;
  }

  // ── AUTHENTICATED PAGES (with shell) ─────────────────
  shellEl.classList.remove('is-login');
  appEl.innerHTML = '';

  // Render sidebar & topbar
  sidebarEl.innerHTML = renderSidebar(pageId);
  topbarEl.innerHTML = renderTopbar(pageId);

  // Bind sidebar logout
  bindSidebarEvents(() => {
    Auth.logout();
    Toast.info('Signed out', 'You have been logged out.');
    Router.navigate('#/login');
  });

  // Render page content
  switch (pageId) {
    case 'dashboard':
      contentEl.innerHTML = renderDashboard();
      break;
    case 'pipeline':
    case 'leads':
    case 'contacts':
    case 'deals':
    case 'team':
    case 'reports':
    case 'settings':
      contentEl.innerHTML = renderComingSoon(pageId);
      break;
    default:
      contentEl.innerHTML = renderComingSoon(pageId);
  }
}

// ── Bootstrap ───────────────────────────────────────────────

function init() {
  // Seed demo data on first run
  seedData();

  // Initialize router
  Router.init(renderPage);

  console.log('TechnoEdge CRM initialized.');
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
