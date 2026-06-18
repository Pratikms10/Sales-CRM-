// ============================================================
// TechnoEdge CRM — Authentication & Role Access
// Login, logout, session, permission checks
// ============================================================

import { Store } from './store.js';

// ── Navigation items with role visibility ───────────────────

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard',  hash: '#/dashboard', icon: 'dashboard', roles: ['manager', 'team_lead', 'employee'] },
  { id: 'pipeline',  label: 'Pipeline',   hash: '#/pipeline',  icon: 'pipeline',  roles: ['manager', 'team_lead', 'employee'] },
  { id: 'leads',     label: 'Leads',      hash: '#/leads',     icon: 'leads',     roles: ['manager', 'team_lead', 'employee'] },
  { id: 'contacts',  label: 'Contacts',   hash: '#/contacts',  icon: 'contacts',  roles: ['manager', 'team_lead', 'employee'] },
  { id: 'deals',     label: 'Deals',      hash: '#/deals',     icon: 'deals',     roles: ['manager', 'team_lead', 'employee'] },
  { id: 'activities',label: 'Activities', hash: '#/activities',icon: 'activities',roles: ['manager', 'team_lead', 'employee'] },
  { id: 'requirements',label: 'Requirements', hash: '#/requirements',icon: 'requirements',roles: ['manager', 'team_lead', 'employee'] },
  { id: 'proposals',   label: 'Proposals',  hash: '#/proposals', icon: 'proposals', roles: ['manager', 'team_lead', 'employee'] },
  { id: 'handoffs',    label: 'Project Handoff',hash: '#/handoffs',  icon: 'handoffs',  roles: ['manager', 'team_lead', 'employee'] },
  { id: 'billing',     label: 'Billing & Renewals',hash: '#/billing',icon: 'billing',   roles: ['manager', 'team_lead', 'employee'] },
  { id: 'team',      label: 'Team',       hash: '#/team',      icon: 'team',      roles: ['manager', 'team_lead'] },
  { id: 'reports',   label: 'Reports',    hash: '#/reports',   icon: 'reports',   roles: ['manager'] },
  { id: 'settings',  label: 'Settings',   hash: '#/settings',  icon: 'settings',  roles: ['manager', 'team_lead', 'employee'] }
];

// ── Auth Module ─────────────────────────────────────────────

export const Auth = {

  // Get current logged-in user (full object)
  getCurrentUser() {
    const session = Store.getSession();
    if (!session || !session.userId) return null;
    return Store.getUserById(session.userId);
  },

  // Check if a user is logged in
  isLoggedIn() {
    return Auth.getCurrentUser() !== null;
  },

  // Log in as a user (by ID)
  login(userId) {
    const user = Store.getUserById(userId);
    if (!user) return null;
    Store.setSession({
      userId: user.id,
      loginAt: new Date().toISOString()
    });
    return user;
  },

  // Log out
  logout() {
    Store.clearSession();
  },

  // Get nav items for current user's role
  getNavItems() {
    const user = Auth.getCurrentUser();
    if (!user) return [];
    return NAV_ITEMS.filter(item => item.roles.includes(user.role));
  },

  // Check if current user can access a specific page
  canAccessPage(pageId) {
    const user = Auth.getCurrentUser();
    if (!user) return false;
    const navItem = NAV_ITEMS.find(item => item.id === pageId);
    if (!navItem) return false;
    return navItem.roles.includes(user.role);
  },

  // ── Permission checks per ROLE_ACCESS_MATRIX.md ────────

  canApprove() {
    const user = Auth.getCurrentUser();
    return user && user.role === 'manager';
  },

  canAssign() {
    const user = Auth.getCurrentUser();
    return user && (user.role === 'manager' || user.role === 'team_lead');
  },

  canAssignTo(targetUserId) {
    const user = Auth.getCurrentUser();
    if (!user) return false;
    if (user.role === 'manager') return true;
    if (user.role === 'team_lead') {
      const target = Store.getUserById(targetUserId);
      return target && target.teamId === user.teamId;
    }
    return false;
  },

  canOverrideStage() {
    const user = Auth.getCurrentUser();
    return user && user.role === 'manager';
  },

  canViewReports() {
    const user = Auth.getCurrentUser();
    return user && user.role === 'manager';
  },

  canManageTeam(teamId) {
    const user = Auth.getCurrentUser();
    if (!user) return false;
    if (user.role === 'manager') return true;
    if (user.role === 'team_lead') return user.teamId === teamId;
    return false;
  },

  canDeleteRecord() {
    const user = Auth.getCurrentUser();
    return user && user.role === 'manager';
  },

  canEditRecord(record) {
    const user = Auth.getCurrentUser();
    if (!user) return false;
    if (user.role === 'manager') return true;
    if (user.role === 'team_lead') {
      if (!record.teamId && !record.assignedTo) return true;
      if (record.teamId === user.teamId) return true;
      const teamMembers = Store.getUsersByTeam(user.teamId).map(u => u.id);
      return teamMembers.includes(record.assignedTo);
    }
    return record.assignedTo === user.id;
  },

  canViewRecord(record) {
    const user = Auth.getCurrentUser();
    if (!user) return false;
    if (user.role === 'manager') return true;
    if (user.role === 'team_lead') {
      if (!record.assignedTo) return true;
      if (record.teamId === user.teamId) return true;
      const teamMembers = Store.getUsersByTeam(user.teamId).map(u => u.id);
      teamMembers.push(user.id);
      return teamMembers.includes(record.assignedTo);
    }
    return record.assignedTo === user.id;
  }
};
