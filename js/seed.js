// ============================================================
// TechnoEdge CRM — Demo Seed Data
// 1 Manager, 2 Team Leads, 4 Employees, 2 Teams
// Plus sample leads, contacts, deals, and activities
// ============================================================

import { generateId } from './utils.js';
import { Store } from './store.js';

const AVATAR_COLORS = [
  '#ff385c', '#e00b41', '#460479', '#92174d',
  '#0969da', '#8250df', '#008a05', '#0e8a6e',
  '#c58000', '#e36414'
];

export function seedData() {
  if (Store.isSeeded()) return;

  const now = new Date();
  const daysAgo = (d) => new Date(now - d * 86400000).toISOString();

  // ── Users ──────────────────────────────────────────────
  const users = [
    {
      id: 'usr_manager_01',
      name: 'Arjun Mehta',
      email: 'arjun.mehta@technoedge.com',
      role: 'manager',
      teamId: null,
      avatarColor: AVATAR_COLORS[0],
      isActive: true
    },
    {
      id: 'usr_tl_01',
      name: 'Priya Sharma',
      email: 'priya.sharma@technoedge.com',
      role: 'team_lead',
      teamId: 'team_01',
      avatarColor: AVATAR_COLORS[4],
      isActive: true
    },
    {
      id: 'usr_tl_02',
      name: 'Rahul Verma',
      email: 'rahul.verma@technoedge.com',
      role: 'team_lead',
      teamId: 'team_02',
      avatarColor: AVATAR_COLORS[5],
      isActive: true
    },
    {
      id: 'usr_emp_01',
      name: 'Sneha Patel',
      email: 'sneha.patel@technoedge.com',
      role: 'employee',
      teamId: 'team_01',
      avatarColor: AVATAR_COLORS[6],
      isActive: true
    },
    {
      id: 'usr_emp_02',
      name: 'Vikram Singh',
      email: 'vikram.singh@technoedge.com',
      role: 'employee',
      teamId: 'team_01',
      avatarColor: AVATAR_COLORS[7],
      isActive: true
    },
    {
      id: 'usr_emp_03',
      name: 'Ananya Desai',
      email: 'ananya.desai@technoedge.com',
      role: 'employee',
      teamId: 'team_02',
      avatarColor: AVATAR_COLORS[8],
      isActive: true
    },
    {
      id: 'usr_emp_04',
      name: 'Karan Joshi',
      email: 'karan.joshi@technoedge.com',
      role: 'employee',
      teamId: 'team_02',
      avatarColor: AVATAR_COLORS[9],
      isActive: true
    }
  ];

  // ── Teams ──────────────────────────────────────────────
  const teams = [
    {
      id: 'team_01',
      name: 'North Sales',
      leadId: 'usr_tl_01',
      memberIds: ['usr_emp_01', 'usr_emp_02']
    },
    {
      id: 'team_02',
      name: 'Enterprise Team',
      leadId: 'usr_tl_02',
      memberIds: ['usr_emp_03', 'usr_emp_04']
    }
  ];

  // ── Leads ──────────────────────────────────────────────
  const leads = [
    {
      id: generateId(), name: 'Rajesh Kumar', company: 'Infosys Ltd',
      email: 'rajesh.k@infosys.com', phone: '+91 98765 43210',
      source: 'referral', status: 'qualified', assignedTo: 'usr_emp_01',
      createdBy: 'usr_tl_01', createdAt: daysAgo(15), updatedAt: daysAgo(2),
      notes: 'Looking for enterprise software solution'
    },
    {
      id: generateId(), name: 'Meera Nair', company: 'TCS',
      email: 'meera.n@tcs.com', phone: '+91 98765 43211',
      source: 'website', status: 'new', assignedTo: 'usr_emp_02',
      createdBy: 'usr_tl_01', createdAt: daysAgo(3), updatedAt: daysAgo(3),
      notes: 'Inquired about cloud services'
    },
    {
      id: generateId(), name: 'Suresh Iyer', company: 'Wipro',
      email: 'suresh.i@wipro.com', phone: '+91 98765 43212',
      source: 'cold_call', status: 'contacted', assignedTo: 'usr_emp_03',
      createdBy: 'usr_tl_02', createdAt: daysAgo(10), updatedAt: daysAgo(5),
      notes: 'Decision maker for IT procurement'
    },
    {
      id: generateId(), name: 'Divya Reddy', company: 'HCL Tech',
      email: 'divya.r@hcl.com', phone: '+91 98765 43213',
      source: 'event', status: 'qualified', assignedTo: 'usr_emp_04',
      createdBy: 'usr_tl_02', createdAt: daysAgo(20), updatedAt: daysAgo(1),
      notes: 'Met at TechSummit 2026'
    },
    {
      id: generateId(), name: 'Amit Gupta', company: 'Reliance Digital',
      email: 'amit.g@reliance.com', phone: '+91 98765 43214',
      source: 'social', status: 'new', assignedTo: null,
      createdBy: 'usr_manager_01', createdAt: daysAgo(1), updatedAt: daysAgo(1),
      notes: 'LinkedIn connection, interested in CRM'
    },
    {
      id: generateId(), name: 'Pooja Bhat', company: 'Zoho Corp',
      email: 'pooja.b@zoho.com', phone: '+91 98765 43215',
      source: 'referral', status: 'contacted', assignedTo: 'usr_emp_01',
      createdBy: 'usr_tl_01', createdAt: daysAgo(7), updatedAt: daysAgo(4),
      notes: 'Referred by Rajesh Kumar'
    },
    {
      id: generateId(), name: 'Nikhil Agarwal', company: 'Flipkart',
      email: 'nikhil.a@flipkart.com', phone: '+91 98765 43216',
      source: 'website', status: 'unqualified', assignedTo: 'usr_emp_02',
      createdBy: 'usr_tl_01', createdAt: daysAgo(30), updatedAt: daysAgo(25),
      notes: 'Budget too low for enterprise tier'
    },
    {
      id: generateId(), name: 'Kavitha Menon', company: 'Freshworks',
      email: 'kavitha.m@freshworks.com', phone: '+91 98765 43217',
      source: 'event', status: 'converted', assignedTo: 'usr_emp_03',
      createdBy: 'usr_tl_02', createdAt: daysAgo(45), updatedAt: daysAgo(10),
      notes: 'Converted to deal — 3-year contract'
    },
    {
      id: generateId(), name: 'Sanjay Pillai', company: 'Mindtree',
      email: 'sanjay.p@mindtree.com', phone: '+91 98765 43218',
      source: 'cold_call', status: 'new', assignedTo: 'usr_emp_04',
      createdBy: 'usr_tl_02', createdAt: daysAgo(2), updatedAt: daysAgo(2),
      notes: 'Initial outreach done'
    },
    {
      id: generateId(), name: 'Lakshmi Rao', company: 'Tech Mahindra',
      email: 'lakshmi.r@techmahindra.com', phone: '+91 98765 43219',
      source: 'referral', status: 'qualified', assignedTo: 'usr_emp_01',
      createdBy: 'usr_tl_01', createdAt: daysAgo(12), updatedAt: daysAgo(3),
      notes: 'Strong interest in analytics module'
    }
  ];

  // ── Contacts ───────────────────────────────────────────
  const contacts = [
    {
      id: generateId(), name: 'Rajesh Kumar', company: 'Infosys Ltd',
      email: 'rajesh.k@infosys.com', phone: '+91 98765 43210',
      designation: 'VP Engineering', type: 'client', tags: ['enterprise', 'IT'],
      createdAt: daysAgo(15)
    },
    {
      id: generateId(), name: 'Meera Nair', company: 'TCS',
      email: 'meera.n@tcs.com', phone: '+91 98765 43211',
      designation: 'Procurement Head', type: 'client', tags: ['enterprise'],
      createdAt: daysAgo(10)
    },
    {
      id: generateId(), name: 'Suresh Iyer', company: 'Wipro',
      email: 'suresh.i@wipro.com', phone: '+91 98765 43212',
      designation: 'CTO', type: 'client', tags: ['IT', 'decision-maker'],
      createdAt: daysAgo(10)
    },
    {
      id: generateId(), name: 'Divya Reddy', company: 'HCL Tech',
      email: 'divya.r@hcl.com', phone: '+91 98765 43213',
      designation: 'Director of Operations', type: 'client', tags: ['enterprise', 'ops'],
      createdAt: daysAgo(20)
    },
    {
      id: generateId(), name: 'Ravi Shankar', company: 'DataSoft Solutions',
      email: 'ravi@datasoft.in', phone: '+91 98765 43220',
      designation: 'CEO', type: 'vendor', tags: ['vendor', 'data'],
      createdAt: daysAgo(30)
    },
    {
      id: generateId(), name: 'Kavitha Menon', company: 'Freshworks',
      email: 'kavitha.m@freshworks.com', phone: '+91 98765 43217',
      designation: 'Head of Procurement', type: 'client', tags: ['SaaS', 'enterprise'],
      createdAt: daysAgo(45)
    }
  ];

  // ── Deals ──────────────────────────────────────────────
  const deals = [
    {
      id: 'deal_01', title: 'Infosys ERP Integration',
      leadId: leads[0].id, contactId: contacts[0].id,
      value: 2500000, currency: 'INR', stage: 'sourcing', status: 'active',
      assignedTo: 'usr_emp_01', teamId: 'team_01', priority: 'high',
      createdAt: daysAgo(14), updatedAt: daysAgo(1), closedAt: null,
      notes: 'Multi-module ERP integration project'
    },
    {
      id: 'deal_02', title: 'TCS Cloud Migration',
      leadId: leads[1].id, contactId: contacts[1].id,
      value: 1800000, currency: 'INR', stage: 'requirement', status: 'active',
      assignedTo: 'usr_emp_02', teamId: 'team_01', priority: 'medium',
      createdAt: daysAgo(8), updatedAt: daysAgo(2), closedAt: null,
      notes: 'Migrate legacy systems to cloud'
    },
    {
      id: 'deal_03', title: 'Wipro Analytics Suite',
      leadId: leads[2].id, contactId: contacts[2].id,
      value: 3200000, currency: 'INR', stage: 'delivery', status: 'active',
      assignedTo: 'usr_emp_03', teamId: 'team_02', priority: 'urgent',
      createdAt: daysAgo(30), updatedAt: daysAgo(1), closedAt: null,
      notes: 'Custom analytics dashboard for ops team'
    },
    {
      id: 'deal_04', title: 'HCL Digital Transformation',
      leadId: leads[3].id, contactId: contacts[3].id,
      value: 5000000, currency: 'INR', stage: 'sales', status: 'active',
      assignedTo: 'usr_emp_04', teamId: 'team_02', priority: 'high',
      createdAt: daysAgo(5), updatedAt: daysAgo(1), closedAt: null,
      notes: 'Full digital transformation roadmap'
    },
    {
      id: 'deal_05', title: 'Freshworks SaaS Platform',
      leadId: leads[7].id, contactId: contacts[5].id,
      value: 4200000, currency: 'INR', stage: 'invoice', status: 'active',
      assignedTo: 'usr_emp_03', teamId: 'team_02', priority: 'medium',
      createdAt: daysAgo(40), updatedAt: daysAgo(3), closedAt: null,
      notes: '3-year SaaS licensing deal'
    },
    {
      id: 'deal_06', title: 'Tech Mahindra Security Audit',
      leadId: leads[9].id, contactId: contacts[0].id,
      value: 800000, currency: 'INR', stage: 'feedback', status: 'active',
      assignedTo: 'usr_emp_01', teamId: 'team_01', priority: 'low',
      createdAt: daysAgo(25), updatedAt: daysAgo(5), closedAt: null,
      notes: 'Annual security audit and compliance review'
    },
    {
      id: 'deal_07', title: 'DataSoft Renewal',
      leadId: null, contactId: contacts[4].id,
      value: 600000, currency: 'INR', stage: 'renewal', status: 'active',
      assignedTo: 'usr_emp_02', teamId: 'team_01', priority: 'medium',
      createdAt: daysAgo(60), updatedAt: daysAgo(7), closedAt: null,
      notes: 'Annual contract renewal with upgrade option'
    }
  ];

  // ── Activities ─────────────────────────────────────────
  const activities = [
    {
      id: generateId(), dealId: 'deal_01', type: 'stage_change',
      content: 'Deal moved from Requirement to Sourcing',
      fromStage: 'requirement', toStage: 'sourcing',
      createdBy: 'usr_emp_01', createdAt: daysAgo(1)
    },
    {
      id: generateId(), dealId: 'deal_01', type: 'call',
      content: 'Discussed vendor shortlist with Rajesh. Three candidates identified.',
      fromStage: null, toStage: null,
      createdBy: 'usr_emp_01', createdAt: daysAgo(2)
    },
    {
      id: generateId(), dealId: 'deal_02', type: 'meeting',
      content: 'Requirements workshop with TCS team. Documented 14 user stories.',
      fromStage: null, toStage: null,
      createdBy: 'usr_emp_02', createdAt: daysAgo(2)
    },
    {
      id: generateId(), dealId: 'deal_03', type: 'stage_change',
      content: 'Deal moved from Sourcing to Delivery',
      fromStage: 'sourcing', toStage: 'delivery',
      createdBy: 'usr_emp_03', createdAt: daysAgo(1)
    },
    {
      id: generateId(), dealId: 'deal_03', type: 'note',
      content: 'Delivery phase started. Server provisioning completed.',
      fromStage: null, toStage: null,
      createdBy: 'usr_emp_03', createdAt: daysAgo(1)
    },
    {
      id: generateId(), dealId: 'deal_04', type: 'email',
      content: 'Sent initial proposal document to Divya Reddy at HCL.',
      fromStage: null, toStage: null,
      createdBy: 'usr_emp_04', createdAt: daysAgo(2)
    },
    {
      id: generateId(), dealId: 'deal_05', type: 'stage_change',
      content: 'Deal moved from Feedback to Invoice/Payment',
      fromStage: 'feedback', toStage: 'invoice',
      createdBy: 'usr_emp_03', createdAt: daysAgo(3)
    },
    {
      id: generateId(), dealId: 'deal_05', type: 'note',
      content: 'Invoice #INV-2026-042 generated. Payment terms: Net 30.',
      fromStage: null, toStage: null,
      createdBy: 'usr_emp_03', createdAt: daysAgo(3)
    },
    {
      id: generateId(), dealId: 'deal_06', type: 'call',
      content: 'Feedback call with Tech Mahindra. Client satisfied with audit results.',
      fromStage: null, toStage: null,
      createdBy: 'usr_emp_01', createdAt: daysAgo(5)
    },
    {
      id: generateId(), dealId: 'deal_07', type: 'email',
      content: 'Sent renewal proposal with 10% loyalty discount.',
      fromStage: null, toStage: null,
      createdBy: 'usr_emp_02', createdAt: daysAgo(7)
    },
    {
      id: generateId(), dealId: 'deal_01', type: 'meeting',
      content: 'Kickoff meeting with Infosys stakeholders. Project scope finalized.',
      fromStage: null, toStage: null,
      createdBy: 'usr_emp_01', createdAt: daysAgo(10)
    },
    {
      id: generateId(), dealId: 'deal_02', type: 'stage_change',
      content: 'Deal moved from Sales to Requirement',
      fromStage: 'sales', toStage: 'requirement',
      createdBy: 'usr_emp_02', createdAt: daysAgo(5)
    },
    // Follow-ups
    {
      id: generateId(), dealId: 'deal_01', type: 'follow_up',
      content: 'Follow up with Rajesh on vendor shortlisting decision.',
      status: 'open', dueAt: daysAgo(1), // Overdue
      assignedTo: 'usr_emp_01', createdBy: 'usr_emp_01', createdAt: daysAgo(2)
    },
    {
      id: generateId(), dealId: 'deal_03', type: 'call',
      content: 'Call TCS to confirm server provisioning details.',
      status: 'open', dueAt: new Date().toISOString(), // Due Today
      assignedTo: 'usr_emp_03', createdBy: 'usr_emp_03', createdAt: daysAgo(1)
    },
    {
      id: generateId(), leadId: leads[3].id, type: 'email',
      content: 'Send product demo link to Divya.',
      status: 'open', dueAt: new Date(Date.now() + 86400000 * 2).toISOString(), // Upcoming (in 2 days)
      assignedTo: 'usr_emp_02', createdBy: 'usr_emp_02', createdAt: daysAgo(1)
    },
    {
      id: generateId(), contactId: contacts[1].id, type: 'meeting',
      content: 'On-site sync with Meera regarding proposal revisions.',
      status: 'completed', dueAt: daysAgo(3), completedAt: daysAgo(2), outcome: 'Proposal approved with minor tweaks.',
      assignedTo: 'usr_emp_04', createdBy: 'usr_emp_04', createdAt: daysAgo(4)
    }
  ];

  // ── Persist ────────────────────────────────────────────
  users.forEach(u      => Store.createUser(u));
  teams.forEach(t      => Store.createTeam(t));
  leads.forEach(l      => Store.createLead(l));
  contacts.forEach(c   => Store.createContact(c));
  deals.forEach(d      => Store.createDeal(d));
  activities.forEach(a => Store.createActivity(a));

  Store.markSeeded();
  console.log('TechnoEdge CRM: Demo data seeded successfully.');
}
