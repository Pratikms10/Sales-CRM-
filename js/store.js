// ============================================================
// TechnoEdge CRM — Data Store
// LocalStorage-backed CRUD with role-scoped queries
// ============================================================

const STORAGE_PREFIX = 'technoedge_';

const KEYS = {
  users:      STORAGE_PREFIX + 'users',
  teams:      STORAGE_PREFIX + 'teams',
  leads:      STORAGE_PREFIX + 'leads',
  contacts:   STORAGE_PREFIX + 'contacts',
  deals:      STORAGE_PREFIX + 'deals',
  activities: STORAGE_PREFIX + 'activities',
  session:    STORAGE_PREFIX + 'session',
  settings:   STORAGE_PREFIX + 'settings',
  seeded:     STORAGE_PREFIX + 'seeded'
};

// ── Generic CRUD ────────────────────────────────────────────

function getAll(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error(`Store: Error reading ${key}`, e);
    return [];
  }
}

function setAll(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Store: Error writing ${key}`, e);
  }
}

function getById(key, id) {
  const items = getAll(key);
  return items.find(item => item.id === id) || null;
}

function create(key, item) {
  const items = getAll(key);
  items.push(item);
  setAll(key, items);
  return item;
}

function update(key, id, updates) {
  const items = getAll(key);
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
  setAll(key, items);
  return items[index];
}

function remove(key, id) {
  const items = getAll(key);
  const filtered = items.filter(item => item.id !== id);
  setAll(key, filtered);
  return filtered.length < items.length;
}

// ── Public Store API ────────────────────────────────────────

export const Store = {

  // ── Users ──────────────────────────────────────────────
  getUsers()         { return getAll(KEYS.users); },
  getUserById(id)    { return getById(KEYS.users, id); },
  createUser(user)   { return create(KEYS.users, user); },
  updateUser(id, u)  { return update(KEYS.users, id, u); },
  deleteUser(id)     { return remove(KEYS.users, id); },

  getUsersByRole(role) {
    return getAll(KEYS.users).filter(u => u.role === role);
  },

  getUsersByTeam(teamId) {
    return getAll(KEYS.users).filter(u => u.teamId === teamId);
  },

  // ── Teams ──────────────────────────────────────────────
  getTeams()         { return getAll(KEYS.teams); },
  getTeamById(id)    { return getById(KEYS.teams, id); },
  createTeam(team)   { return create(KEYS.teams, team); },
  updateTeam(id, t)  { return update(KEYS.teams, id, t); },
  deleteTeam(id)     { return remove(KEYS.teams, id); },

  // ── Leads ──────────────────────────────────────────────
  getLeads()         { return getAll(KEYS.leads); },
  getLeadById(id)    { return getById(KEYS.leads, id); },
  createLead(lead)   { return create(KEYS.leads, lead); },
  updateLead(id, l)  { return update(KEYS.leads, id, l); },
  deleteLead(id)     { return remove(KEYS.leads, id); },

  getLeadsForUser(user) {
    const leads = getAll(KEYS.leads);
    if (user.role === 'manager') return leads;
    if (user.role === 'team_lead') {
      const teamMembers = Store.getUsersByTeam(user.teamId).map(u => u.id);
      teamMembers.push(user.id);
      return leads.filter(l => teamMembers.includes(l.assignedTo) || !l.assignedTo);
    }
    return leads.filter(l => l.assignedTo === user.id);
  },

  // ── Contacts ───────────────────────────────────────────
  getContacts()       { return getAll(KEYS.contacts); },
  getContactById(id)  { return getById(KEYS.contacts, id); },
  createContact(c)    { return create(KEYS.contacts, c); },
  updateContact(id,c) { return update(KEYS.contacts, id, c); },
  deleteContact(id)   { return remove(KEYS.contacts, id); },

  // ── Deals ──────────────────────────────────────────────
  getDeals()         { return getAll(KEYS.deals); },
  getDealById(id)    { return getById(KEYS.deals, id); },
  createDeal(deal)   { return create(KEYS.deals, deal); },
  updateDeal(id, d)  { return update(KEYS.deals, id, d); },
  deleteDeal(id)     { return remove(KEYS.deals, id); },

  getDealsForUser(user) {
    const deals = getAll(KEYS.deals);
    if (user.role === 'manager') return deals;
    if (user.role === 'team_lead') {
      const teamMembers = Store.getUsersByTeam(user.teamId).map(u => u.id);
      teamMembers.push(user.id);
      return deals.filter(d => teamMembers.includes(d.assignedTo) || !d.assignedTo);
    }
    return deals.filter(d => d.assignedTo === user.id);
  },

  // ── Activities ─────────────────────────────────────────
  getActivities()        { return getAll(KEYS.activities); },
  getActivityById(id)    { return getById(KEYS.activities, id); },
  createActivity(a)      { return create(KEYS.activities, a); },

  getActivitiesForDeal(dealId) {
    return getAll(KEYS.activities)
      .filter(a => a.dealId === dealId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getRecentActivities(user, limit = 10) {
    let activities = getAll(KEYS.activities);

    if (user.role !== 'manager') {
      const deals = Store.getDealsForUser(user);
      const dealIds = new Set(deals.map(d => d.id));
      activities = activities.filter(a => dealIds.has(a.dealId));
    }

    return activities
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  },

  // ── Session ────────────────────────────────────────────
  getSession() {
    try {
      const data = localStorage.getItem(KEYS.session);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  setSession(session) {
    localStorage.setItem(KEYS.session, JSON.stringify(session));
  },

  clearSession() {
    localStorage.removeItem(KEYS.session);
  },

  // ── Seed Status ────────────────────────────────────────
  isSeeded() {
    return localStorage.getItem(KEYS.seeded) === 'true';
  },

  markSeeded() {
    localStorage.setItem(KEYS.seeded, 'true');
  },

  // ── Full Reset ─────────────────────────────────────────
  clearAll() {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
  }
};
