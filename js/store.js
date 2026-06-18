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
  requirements: STORAGE_PREFIX + 'requirements',
  proposals:  STORAGE_PREFIX + 'proposals',
  handoffs:   STORAGE_PREFIX + 'handoffs',
  billings:   STORAGE_PREFIX + 'billings',
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
  updateActivity(id, a)  { return update(KEYS.activities, id, a); },
  deleteActivity(id)     { return remove(KEYS.activities, id); },

  getActivitiesForDeal(dealId) {
    return getAll(KEYS.activities)
      .filter(a => a.dealId === dealId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getActivitiesForUser(user) {
    if (!user) return [];
    const activities = getAll(KEYS.activities);
    if (user.role === 'manager') return activities;

    const deals = Store.getDealsForUser(user);
    const dealIds = new Set(deals.map(d => d.id));
    const leads = Store.getLeadsForUser(user);
    const leadIds = new Set(leads.map(l => l.id));

    if (user.role === 'team_lead') {
      const teamUserIds = new Set(Store.getUsersByTeam(user.teamId).map(u => u.id));
      teamUserIds.add(user.id);

      return activities.filter(a => {
        if (a.teamId === user.teamId) return true;
        if (teamUserIds.has(a.assignedTo) || teamUserIds.has(a.createdBy)) return true;
        if (a.dealId && dealIds.has(a.dealId)) return true;
        if (a.leadId && leadIds.has(a.leadId)) return true;
        return false;
      });
    }

    // Employee
    return activities.filter(a => {
      if (a.assignedTo === user.id || a.createdBy === user.id) return true;
      if (a.dealId && dealIds.has(a.dealId)) return true;
      if (a.leadId && leadIds.has(a.leadId)) return true;
      return false;
    });
  },

  getFollowUpsForUser(user) {
    if (!user) return [];
    return Store.getActivitiesForUser(user)
      .filter(a => a.dueAt && a.status !== 'completed' && a.status !== 'cancelled');
  },

  canUserViewActivity(activity, user) {
    if (!activity || !user) return false;
    if (user.role === 'manager') return true;
    const activities = Store.getActivitiesForUser(user);
    return activities.some(a => a.id === activity.id);
  },

  canUserEditActivity(activity, user) {
    if (!activity || !user) return false;
    if (user.role === 'manager') return true;
    if (user.role === 'team_lead') {
      return Store.canUserViewActivity(activity, user);
    }
    return activity.assignedTo === user.id || activity.createdBy === user.id;
  },

  getRecentActivities(user, limit = 10) {
    const activities = Store.getActivitiesForUser(user);
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

  // ── Settings ───────────────────────────────────────────
  getSettings() {
    try {
      const data = localStorage.getItem(KEYS.settings);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  },

  updateSettings(settings) {
    try {
      localStorage.setItem(KEYS.settings, JSON.stringify(settings));
    } catch (e) {
      console.error('Store: Error writing settings', e);
    }
  },

  // ── Requirements ──────────────────────────────────────────
  getRequirements() { return getAll(KEYS.requirements); },
  getRequirementById(id) { return getById(KEYS.requirements, id); },
  createRequirement(req) { return create(KEYS.requirements, req); },
  updateRequirement(id, updates) { return update(KEYS.requirements, id, updates); },
  deleteRequirement(id) { return remove(KEYS.requirements, id); },

  getRequirementsForUser(user) {
    if (!user) return [];
    const reqs = Store.getRequirements();
    if (user.role === 'manager') return reqs;

    const deals = Store.getDealsForUser(user);
    const dealIds = new Set(deals.map(d => d.id));
    const leads = Store.getLeadsForUser(user);
    const leadIds = new Set(leads.map(l => l.id));

    if (user.role === 'team_lead') {
      const teamUserIds = new Set(Store.getUsersByTeam(user.teamId).map(u => u.id));
      teamUserIds.add(user.id);

      return reqs.filter(r => {
        if (r.teamId === user.teamId) return true;
        if (teamUserIds.has(r.assignedTo) || teamUserIds.has(r.createdBy)) return true;
        if (r.dealId && dealIds.has(r.dealId)) return true;
        if (r.leadId && leadIds.has(r.leadId)) return true;
        return false;
      });
    }

    // Employee
    return reqs.filter(r => {
      if (r.assignedTo === user.id || r.createdBy === user.id) return true;
      if (r.dealId && dealIds.has(r.dealId)) return true;
      if (r.leadId && leadIds.has(r.leadId)) return true;
      return false;
    });
  },

  canUserViewRequirement(req, user) {
    if (!req || !user) return false;
    if (user.role === 'manager') return true;
    const reqs = Store.getRequirementsForUser(user);
    return reqs.some(r => r.id === req.id);
  },

  canUserEditRequirement(req, user) {
    if (!req || !user) return false;
    if (user.role === 'manager') return true;
    if (user.role === 'team_lead') {
      return Store.canUserViewRequirement(req, user);
    }
    return req.assignedTo === user.id || req.createdBy === user.id;
  },

  // ── Proposals ────────────────────────────────────────────
  getProposals() { return getAll(KEYS.proposals); },
  getProposalById(id) { return getById(KEYS.proposals, id); },
  createProposal(prop) { return create(KEYS.proposals, prop); },
  updateProposal(id, updates) { return update(KEYS.proposals, id, updates); },
  deleteProposal(id) { return remove(KEYS.proposals, id); },

  getProposalsForUser(user) {
    if (!user) return [];
    const props = Store.getProposals();
    if (user.role === 'manager') return props;

    const deals = Store.getDealsForUser(user);
    const dealIds = new Set(deals.map(d => d.id));

    const visibleReqs = Store.getRequirementsForUser(user);
    const visibleReqIds = new Set(visibleReqs.map(r => r.id));

    if (user.role === 'team_lead') {
      const teamUserIds = new Set(Store.getUsersByTeam(user.teamId).map(u => u.id));
      teamUserIds.add(user.id);

      return props.filter(p => {
        if (p.teamId === user.teamId) return true;
        if (teamUserIds.has(p.assignedTo) || teamUserIds.has(p.createdBy)) return true;
        if (p.dealId && dealIds.has(p.dealId)) return true;
        if (p.requirementId && visibleReqIds.has(p.requirementId)) return true;
        return false;
      });
    }

    // Employee
    return props.filter(p => {
      if (p.assignedTo === user.id || p.createdBy === user.id) return true;
      if (p.dealId && dealIds.has(p.dealId)) return true;
      if (p.requirementId && visibleReqIds.has(p.requirementId)) return true;
      return false;
    });
  },

  canUserViewProposal(prop, user) {
    if (!prop || !user) return false;
    if (user.role === 'manager') return true;
    const props = Store.getProposalsForUser(user);
    return props.some(p => p.id === prop.id);
  },

  canUserEditProposal(prop, user) {
    if (!prop || !user) return false;
    if (user.role === 'manager') return true;
    if (user.role === 'team_lead') {
      return Store.canUserViewProposal(prop, user);
    }
    return prop.assignedTo === user.id || prop.createdBy === user.id;
  },

  // ── Handoffs ─────────────────────────────────────────────
  getHandoffs() { return getAll(KEYS.handoffs); },
  getHandoffById(id) { return getById(KEYS.handoffs, id); },
  createHandoff(handoff) { return create(KEYS.handoffs, handoff); },
  updateHandoff(id, updates) { return update(KEYS.handoffs, id, updates); },
  deleteHandoff(id) { return remove(KEYS.handoffs, id); },

  getHandoffsForUser(user) {
    if (!user) return [];
    const handoffs = Store.getHandoffs();
    if (user.role === 'manager') return handoffs;

    if (user.role === 'team_lead') {
      const teamUserIds = new Set(Store.getUsersByTeam(user.teamId).map(u => u.id));
      teamUserIds.add(user.id);
      return handoffs.filter(h => {
        if (h.teamId === user.teamId) return true;
        if (teamUserIds.has(h.assignedTo) || teamUserIds.has(h.createdBy)) return true;
        return false;
      });
    }

    // Employee
    return handoffs.filter(h => h.assignedTo === user.id || h.createdBy === user.id);
  },

  canUserViewHandoff(handoff, user) {
    if (!handoff || !user) return false;
    if (user.role === 'manager') return true;
    const handoffs = Store.getHandoffsForUser(user);
    return handoffs.some(h => h.id === handoff.id);
  },

  canUserEditHandoff(handoff, user) {
    if (!handoff || !user) return false;
    if (user.role === 'manager') return true;
    if (user.role === 'team_lead') {
      return Store.canUserViewHandoff(handoff, user);
    }
    return handoff.assignedTo === user.id || handoff.createdBy === user.id;
  },

  // ── Billings ───────────────────────────────────────────
  getBillings() { return getAll(KEYS.billings); },
  getBillingById(id) { return getById(KEYS.billings, id); },
  createBilling(payload) { return create(KEYS.billings, payload); },
  updateBilling(id, updates) { return update(KEYS.billings, id, updates); },
  deleteBilling(id) { return remove(KEYS.billings, id); },

  getBillingsForUser(user) {
    if (!user) return [];
    const billings = Store.getBillings();
    if (user.role === 'manager') return billings;

    const handoffIds = new Set(Store.getHandoffsForUser(user).map(h => h.id));
    const dealIds = new Set(Store.getDealsForUser(user).map(d => d.id));
    const proposalIds = new Set(Store.getProposalsForUser(user).map(p => p.id));

    if (user.role === 'team_lead') {
      const teamUserIds = new Set(Store.getUsersByTeam(user.teamId).map(u => u.id));
      teamUserIds.add(user.id);
      return billings.filter(b => {
        if (b.teamId === user.teamId) return true;
        if (teamUserIds.has(b.assignedTo) || teamUserIds.has(b.createdBy)) return true;
        if (b.handoffId && handoffIds.has(b.handoffId)) return true;
        if (b.dealId && dealIds.has(b.dealId)) return true;
        if (b.proposalId && proposalIds.has(b.proposalId)) return true;
        return false;
      });
    }

    // Employee
    return billings.filter(b => {
      if (b.assignedTo === user.id || b.createdBy === user.id) return true;
      if (b.handoffId && handoffIds.has(b.handoffId)) return true;
      if (b.dealId && dealIds.has(b.dealId)) return true;
      if (b.proposalId && proposalIds.has(b.proposalId)) return true;
      return false;
    });
  },

  canUserViewBilling(billing, user) {
    if (!billing || !user) return false;
    if (user.role === 'manager') return true;
    const billings = Store.getBillingsForUser(user);
    return billings.some(b => b.id === billing.id);
  },

  canUserEditBilling(billing, user) {
    if (!billing || !user) return false;
    if (user.role === 'manager') return true;
    if (user.role === 'team_lead') {
      return Store.canUserViewBilling(billing, user);
    }
    return billing.assignedTo === user.id || billing.createdBy === user.id;
  },


  // ── Export / Import ────────────────────────────────────
  exportData() {
    return {
      users: getAll(KEYS.users),
      teams: getAll(KEYS.teams),
      leads: getAll(KEYS.leads),
      contacts: getAll(KEYS.contacts),
      deals: getAll(KEYS.deals),
      activities: getAll(KEYS.activities),
      requirements: getAll(KEYS.requirements),
      proposals: getAll(KEYS.proposals),
      handoffs: getAll(KEYS.handoffs),
      billings: getAll(KEYS.billings),
      settings: Store.getSettings(),
      exportedAt: new Date().toISOString()
    };
  },

  importData(payload) {
    // Pre-serialize all datasets before touching localStorage
    const dataKeys = [KEYS.users, KEYS.teams, KEYS.leads, KEYS.contacts, KEYS.deals, KEYS.activities, KEYS.requirements, KEYS.proposals, KEYS.handoffs, KEYS.billings, KEYS.settings];
    const newValues = {
      [KEYS.users]:        JSON.stringify(payload.users || []),
      [KEYS.teams]:        JSON.stringify(payload.teams || []),
      [KEYS.leads]:        JSON.stringify(payload.leads || []),
      [KEYS.contacts]:     JSON.stringify(payload.contacts || []),
      [KEYS.deals]:        JSON.stringify(payload.deals || []),
      [KEYS.activities]:   JSON.stringify(payload.activities || []),
      [KEYS.requirements]: JSON.stringify(payload.requirements || []),
      [KEYS.proposals]:    JSON.stringify(payload.proposals || []),
      [KEYS.handoffs]:     JSON.stringify(payload.handoffs || []),
      [KEYS.billings]:     JSON.stringify(payload.billings || []),
      [KEYS.settings]:     JSON.stringify(payload.settings || {})
    };

    // Back up existing values
    const backup = {};
    dataKeys.forEach(key => {
      backup[key] = localStorage.getItem(key);
    });
    const seededBackup = localStorage.getItem(KEYS.seeded);

    try {
      dataKeys.forEach(key => {
        localStorage.setItem(key, newValues[key]);
      });
      localStorage.setItem(KEYS.seeded, 'true');
      return true;
    } catch (e) {
      console.error('Store: Import failed, rolling back', e);
      // Restore backups
      dataKeys.forEach(key => {
        if (backup[key] === null) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, backup[key]);
        }
      });
      if (seededBackup === null) {
        localStorage.removeItem(KEYS.seeded);
      } else {
        localStorage.setItem(KEYS.seeded, seededBackup);
      }
      return false;
    }
  },

  // ── Full Reset ─────────────────────────────────────────
  clearAll() {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
  }
};
