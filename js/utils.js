// ============================================================
// TechnoEdge CRM — Utilities
// Formatters, ID generators, date helpers
// ============================================================

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

export function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function timeAgo(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return formatDate(dateStr);
}

export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatRole(role) {
  const roleLabels = {
    manager: 'Manager',
    team_lead: 'Team Lead',
    employee: 'Employee'
  };
  return roleLabels[role] || role;
}

export function sanitizeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// SOP stage definitions (single source of truth)
export const SOP_STAGES = [
  { key: 'sales',       label: 'Sales',           icon: 'target',   color: 'var(--color-stage-sales)' },
  { key: 'requirement', label: 'Requirement',      icon: 'clipboard',color: 'var(--color-stage-requirement)' },
  { key: 'sourcing',    label: 'Sourcing',         icon: 'search',   color: 'var(--color-stage-sourcing)' },
  { key: 'delivery',    label: 'Delivery',         icon: 'truck',    color: 'var(--color-stage-delivery)' },
  { key: 'feedback',    label: 'Feedback',         icon: 'message',  color: 'var(--color-stage-feedback)' },
  { key: 'invoice',     label: 'Invoice/Payment',  icon: 'dollar',   color: 'var(--color-stage-invoice)' },
  { key: 'renewal',     label: 'Renewal',          icon: 'refresh',  color: 'var(--color-stage-renewal)' }
];
