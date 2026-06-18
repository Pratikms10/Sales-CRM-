// ============================================================
// TechnoEdge CRM — Global Search
// ============================================================

import { Store } from '../store.js';
import { Auth } from '../auth.js';

let debounceTimeout;
let activeIndex = -1;

function escapeHtml(unsafe) {
  return (unsafe || '').toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalize(str) {
  return String(str || '').toLowerCase();
}

function matchFields(query, item, fields) {
  return fields.some(f => normalize(item[f]).includes(query));
}

// Ensure the document-level click handler is bound only once per app lifecycle
if (!window.__globalSearchDocumentClickBound) {
  window.__globalSearchDocumentClickBound = true;
  document.addEventListener('click', (e) => {
    const container = document.querySelector('.topbar-search');
    // If we clicked outside the topbar-search container entirely
    if (container && !container.contains(e.target)) {
      const dropdown = container.querySelector('.topbar-search-dropdown');
      if (dropdown && dropdown.classList.contains('is-open')) {
        dropdown.classList.remove('is-open');
        dropdown.innerHTML = '';
        activeIndex = -1; // Reset active index since dropdown closed
      }
    }
  });
}

// Ensure global hotkey is bound only once per app lifecycle
if (!window.__globalSearchHotkeyBound) {
  window.__globalSearchHotkeyBound = true;
  document.addEventListener('keydown', (e) => {
    if (e.key === '/') {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT' || activeEl.isContentEditable)) {
        return;
      }
      e.preventDefault();
      const input = document.getElementById('topbar-search');
      if (input) input.focus();
    }
  });
}

export function initGlobalSearch() {
  const input = document.getElementById('topbar-search');
  if (!input) return;
  if (input.dataset.searchInitialized) return;
  input.dataset.searchInitialized = 'true';

  const container = input.closest('.topbar-search');
  if (!container) return;

  let dropdown = container.querySelector('.topbar-search-dropdown');
  if (!dropdown) {
    dropdown = document.createElement('div');
    dropdown.className = 'topbar-search-dropdown';
    container.appendChild(dropdown);
  }

  function closeSearch() {
    dropdown.classList.remove('is-open');
    dropdown.innerHTML = '';
    activeIndex = -1;
  }

  function performSearch(query) {
    const user = Auth.getCurrentUser();
    if (!user) return closeSearch();

    const q = query.toLowerCase().trim();
    if (q.length < 2) return closeSearch();

    let totalCount = 0;
    let resultsHtml = '';

    const addGroup = (title, items, type) => {
      const validItems = items.filter(item => item && item.id !== undefined && item.id !== null && String(item.id).trim() !== '');
      if (validItems.length === 0 || totalCount >= 20) return;

      const limited = validItems.slice(0, Math.min(5, 20 - totalCount));
      if (limited.length === 0) return;

      totalCount += limited.length;

      resultsHtml += `<div class="search-result-group">${escapeHtml(title)}</div>`;
      limited.forEach((item) => {
        const safeId = escapeHtml(String(item.id));
        const titleText = escapeHtml(item.title || item.name || 'Untitled');
        const subText = escapeHtml(item.company || item.companyName || item.email || item.summary || item.content || '');
        const badgeText = escapeHtml(item.status || item.stage || item.deliveryStatus || item.paymentStatus || item.requirementType || item.type || '');

        resultsHtml += `
          <div class="search-result-item" data-type="${type}" data-id="${safeId}">
            <div class="search-result-content">
              <div class="search-result-title">${titleText}</div>
              ${subText ? `<div class="search-result-subtitle">${subText}</div>` : ''}
            </div>
            ${badgeText ? `<div class="search-result-badge">${badgeText}</div>` : ''}
          </div>
        `;
      });
    };

    // Leads
    const leads = Store.getLeadsForUser(user).filter(l => matchFields(q, l, ['name', 'company', 'email', 'phone', 'source', 'status']));
    addGroup('Leads', leads, 'lead');

    // Deals
    const deals = Store.getDealsForUser(user).filter(d => matchFields(q, d, ['title', 'companyName', 'stage', 'status', 'value']));
    addGroup('Deals', deals, 'deal');

    // Contacts
    const contacts = Store.getContacts().filter(c => matchFields(q, c, ['name', 'company', 'email', 'phone', 'designation', 'tags']));
    addGroup('Contacts', contacts, 'contact');

    // Requirements
    const reqs = Store.getRequirementsForUser(user).filter(r => matchFields(q, r, ['title', 'summary', 'requirementType', 'status', 'priority']));
    addGroup('Requirements', reqs, 'requirement');

    // Proposals
    const props = Store.getProposalsForUser(user).filter(p => matchFields(q, p, ['title', 'status', 'approvalStatus', 'grandTotal']));
    addGroup('Proposals', props, 'proposal');

    // Handoffs
    const handoffs = Store.getHandoffsForUser(user).filter(h => matchFields(q, h, ['title', 'companyName', 'deliveryStatus', 'projectBrief']));
    addGroup('Project Handoffs', handoffs, 'handoff');

    // Billings
    const billings = Store.getBillingsForUser(user).filter(b => matchFields(q, b, ['title', 'companyName', 'invoiceNumber', 'paymentStatus', 'renewalStatus']));
    addGroup('Billing & Renewals', billings, 'billing');

    // Activities
    const activities = Store.getActivitiesForUser(user).filter(a => matchFields(q, a, ['title', 'content', 'type', 'status']));
    addGroup('Activities', activities, 'activity');

    if (totalCount === 0) {
      resultsHtml = '<div class="search-empty-state">No matching records found.</div>';
    }

    dropdown.innerHTML = resultsHtml;
    dropdown.classList.add('is-open');
    activeIndex = -1;
  }

  input.addEventListener('input', (e) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      performSearch(e.target.value);
    }, 200);
  });

  input.addEventListener('focus', (e) => {
    if (e.target.value.trim().length >= 2) {
      performSearch(e.target.value);
    }
  });

  input.addEventListener('keydown', (e) => {
    if (!dropdown.classList.contains('is-open')) return;
    const items = dropdown.querySelectorAll('.search-result-item');
    if (items.length === 0) {
      if (e.key === 'Escape') closeSearch();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % items.length;
      updateActiveItem(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + items.length) % items.length;
      updateActiveItem(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < items.length) {
        items[activeIndex].click();
      } else {
        items[0].click(); // Auto-select first if none explicitly focused
      }
    } else if (e.key === 'Escape') {
      closeSearch();
      input.blur();
    }
  });

  function updateActiveItem(items) {
    items.forEach((item, idx) => {
      if (idx === activeIndex) {
        item.classList.add('active');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('active');
      }
    });
  }

  dropdown.addEventListener('click', (e) => {
    const item = e.target.closest('.search-result-item');
    if (item) {
      const type = item.getAttribute('data-type');
      const id = item.getAttribute('data-id');

      const map = {
        'lead': '#/leads',
        'contact': '#/contacts',
        'deal': `#/deals/${id}`,
        'requirement': '#/requirements',
        'proposal': '#/proposals',
        'handoff': '#/handoffs',
        'billing': '#/billing',
        'activity': '#/activities'
      };

      const route = map[type];
      if (route) {
        closeSearch();
        input.value = '';
        input.blur();
        import('../router.js').then(m => m.Router.navigate(route));
      }
    }
  });
}
