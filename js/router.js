// ============================================================
// TechnoEdge CRM — Router
// Hash-based SPA router with role guards
// ============================================================

import { Auth } from './auth.js';
import { Toast } from './components/toast.js';

// ── Route definitions ───────────────────────────────────────

const ROUTES = {
  'dashboard': { pageId: 'dashboard', title: 'Dashboard' },
  'pipeline':  { pageId: 'pipeline',  title: 'Pipeline' },
  'leads':     { pageId: 'leads',     title: 'Leads' },
  'contacts':  { pageId: 'contacts',  title: 'Contacts' },
  'deals':     { pageId: 'deals',     title: 'Deals' },
  'activities':{ pageId: 'activities',title: 'Activities' },
  'team':      { pageId: 'team',      title: 'Team' },
  'reports':   { pageId: 'reports',   title: 'Reports' },
  'settings':  { pageId: 'settings',  title: 'Settings' }
};

let currentPage = null;
let onNavigateCallback = null;

// ── Public Router API ───────────────────────────────────────

export const Router = {

  init(onNavigate) {
    onNavigateCallback = onNavigate;
    window.addEventListener('hashchange', () => Router.handleRoute());
    Router.handleRoute();
  },

  handleRoute() {
    const hash = window.location.hash || '#/login';
    const path = hash.replace('#/', '').split('/')[0];

    // If not logged in, force login page
    if (!Auth.isLoggedIn()) {
      if (path !== 'login') {
        window.location.hash = '#/login';
        return;
      }
      if (onNavigateCallback) onNavigateCallback('login', null);
      return;
    }

    // If logged in and on login page, redirect to dashboard
    if (path === 'login' || path === '') {
      window.location.hash = '#/dashboard';
      return;
    }

    // Check if route exists
    const route = ROUTES[path];
    if (!route) {
      Toast.warning('Page not found', `"${path}" does not exist. Redirecting to dashboard.`);
      window.location.hash = '#/dashboard';
      return;
    }

    // Role-based access guard
    if (!Auth.canAccessPage(route.pageId)) {
      Toast.error('Access denied', `You don't have permission to view ${route.title}.`);
      window.location.hash = '#/dashboard';
      return;
    }

    // Extract route params (e.g., #/deals/deal_01)
    const parts = hash.replace('#/', '').split('/');
    const params = parts.length > 1 ? { id: parts[1] } : null;

    currentPage = route.pageId;
    document.title = `${route.title} — TechnoEdge CRM`;

    if (onNavigateCallback) onNavigateCallback(route.pageId, params);
  },

  navigate(hash) {
    window.location.hash = hash;
  },

  getCurrentPage() {
    return currentPage;
  }
};
