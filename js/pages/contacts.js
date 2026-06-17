// ============================================================
// TechnoEdge CRM — Contacts Page
// Globally visible contacts with role-guarded actions
// ============================================================

import { Store } from '../store.js';
import { Auth } from '../auth.js';
import { formatDate, generateId, capitalize, getInitials } from '../utils.js';
import { Toast } from '../components/toast.js';

let currentFilters = {
  search: '',
  type: ''
};

export function renderContacts() {
  const user = Auth.getCurrentUser();
  if (!user) return '';

  const allContacts = Store.getContacts();
  
  // Apply filters
  const filteredContacts = allContacts.filter(contact => {
    if (currentFilters.type && contact.type !== currentFilters.type) return false;
    
    if (currentFilters.search) {
      const q = currentFilters.search.toLowerCase();
      const matchName = contact.name.toLowerCase().includes(q);
      const matchCompany = contact.company.toLowerCase().includes(q);
      const matchEmail = (contact.email || '').toLowerCase().includes(q);
      const matchDesignation = (contact.designation || '').toLowerCase().includes(q);
      const matchTags = (contact.tags || []).some(t => t.toLowerCase().includes(q));
      
      if (!matchName && !matchCompany && !matchEmail && !matchDesignation && !matchTags) return false;
    }
    return true;
  });

  // Sort by newest
  filteredContacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const rowsHtml = filteredContacts.map(contact => buildContactRow(contact, user)).join('');
  const emptyHtml = filteredContacts.length === 0 ? `<tr><td colspan="8" class="text-center" style="padding: 2rem;">No contacts found.</td></tr>` : '';

  return `
    <div class="content-inner">
      <div class="page-header">
        <div>
          <h1 class="page-header-title">Contacts</h1>
          <p class="page-header-subtitle">Company directory for clients and vendors.</p>
        </div>
        <button class="btn btn-primary" id="btn-new-contact">New Contact</button>
      </div>

      <div class="card" style="margin-bottom: var(--space-lg)">
        <div class="filter-bar" style="display: flex; gap: 1rem; padding: 1rem; border-bottom: 1px solid var(--color-border);">
          <input type="text" class="login-input" id="filter-search-contact" placeholder="Search name, company, email, tags..." style="max-width: 300px;" value="${currentFilters.search}">
          <select class="login-input" id="filter-type-contact" style="max-width: 200px;">
            <option value="">All Types</option>
            <option value="client" ${currentFilters.type === 'client' ? 'selected' : ''}>Client</option>
            <option value="vendor" ${currentFilters.type === 'vendor' ? 'selected' : ''}>Vendor</option>
          </select>
          <button class="btn btn-secondary" id="btn-clear-contact-filters">Clear</button>
        </div>

        <div style="overflow-x: auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Designation</th>
                <th>Contact Info</th>
                <th>Type</th>
                <th>Tags</th>
                <th>Created</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
              ${emptyHtml}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Modals -->
    <div id="modal-overlay-contact" class="modal-overlay" style="display: none;"></div>
    <div id="contact-modal" class="modal" style="display: none;">
      <!-- Content populated dynamically -->
    </div>
  `;
}

function buildContactRow(contact, user) {
  const canDelete = user.role === 'manager';

  let actionsHtml = `<div class="table-actions">`;
  // All roles can edit contacts
  actionsHtml += `<button class="btn btn-sm btn-secondary btn-edit-contact" data-id="${contact.id}">Edit</button>`;

  // Only manager can see delete
  if (canDelete) {
    actionsHtml += `<button class="btn btn-sm btn-danger btn-delete-contact" data-id="${contact.id}">Delete</button>`;
  }
  
  actionsHtml += `</div>`;

  const tagsHtml = (contact.tags || []).map(t => `<span class="badge badge-info" style="margin-right: 4px; font-size: 0.75rem;">${t}</span>`).join('');

  return `
    <tr>
      <td>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <div class="avatar avatar-sm" style="background: var(--color-primary-disabled); color: var(--color-primary);">${getInitials(contact.name)}</div>
          <span style="font-weight: 500;">${contact.name}</span>
        </div>
      </td>
      <td>${contact.company}</td>
      <td><span style="color: var(--color-muted); font-size: 0.85rem;">${contact.designation || '—'}</span></td>
      <td>
        <div style="font-size: 0.85rem;">
          ${contact.email ? `<a href="mailto:${contact.email}" class="text-link">${contact.email}</a><br>` : ''}
          ${contact.phone ? `<span style="color: var(--color-muted)">${contact.phone}</span>` : ''}
        </div>
      </td>
      <td><span class="badge badge-neutral">${capitalize(contact.type)}</span></td>
      <td>${tagsHtml}</td>
      <td style="font-size: 0.85rem; color: var(--color-muted);">${formatDate(contact.createdAt)}</td>
      <td style="text-align: right;">
        ${actionsHtml}
      </td>
    </tr>
  `;
}

export function bindContactsEvents() {
  const content = document.getElementById('content-area');
  if (!content) return;

  // Filters
  content.addEventListener('input', (e) => {
    if (e.target.id === 'filter-search-contact') {
      currentFilters.search = e.target.value;
      reRenderContactsOnly();
    }
  });

  content.addEventListener('change', (e) => {
    if (e.target.id === 'filter-type-contact') {
      currentFilters.type = e.target.value;
      reRenderContactsOnly();
    }
  });

  content.addEventListener('click', (e) => {
    // Clear Filters
    if (e.target.id === 'btn-clear-contact-filters') {
      currentFilters = { search: '', type: '' };
      reRenderContactsFull();
      return;
    }

    // New Contact
    if (e.target.id === 'btn-new-contact') {
      openContactModal();
      return;
    }

    // Edit Contact
    const editBtn = e.target.closest('.btn-edit-contact');
    if (editBtn) {
      openContactModal(editBtn.dataset.id);
      return;
    }

    // Delete Contact
    const deleteBtn = e.target.closest('.btn-delete-contact');
    if (deleteBtn) {
      if (confirm('Are you sure you want to delete this contact?')) {
        const user = Auth.getCurrentUser();
        // Guard check inside handler
        if (!user || user.role !== 'manager') {
          Toast.error('Permission Denied', 'Only managers can delete contacts.');
          return;
        }
        
        const id = deleteBtn.dataset.id;
        Store.deleteContact(id);
        Toast.success('Deleted', 'Contact has been removed.');
        reRenderContactsFull();
      }
      return;
    }
    
    // Modal actions
    if (e.target.id === 'modal-overlay-contact' || e.target.closest('.btn-close-contact-modal')) {
      closeContactModal();
      return;
    }

    if (e.target.id === 'btn-save-contact') {
      saveContact();
      return;
    }
  });
}

function reRenderContactsOnly() {
  clearTimeout(window.contactFilterDebounce);
  window.contactFilterDebounce = setTimeout(() => {
    reRenderContactsFull();
  }, 300);
}

function reRenderContactsFull() {
  const contentEl = document.getElementById('content-area');
  if (contentEl) {
    contentEl.innerHTML = renderContacts();
  }
}

function openContactModal(contactId = null) {
  const modal = document.getElementById('contact-modal');
  const overlay = document.getElementById('modal-overlay-contact');
  
  let contact = { name: '', company: '', designation: '', email: '', phone: '', type: 'client', tags: [] };
  
  if (contactId) {
    contact = Store.getContactById(contactId);
    if (!contact) {
      Toast.error('Error', 'Contact not found.');
      return;
    }
  }

  const isEdit = !!contactId;
  const title = isEdit ? 'Edit Contact' : 'New Contact';
  
  const tagsString = (contact.tags || []).join(', ');

  modal.innerHTML = `
    <div class="modal-header">
      <h3 style="margin:0">${title}</h3>
      <button class="btn btn-sm btn-close-contact-modal" style="background:none; border:none; font-size:1.5rem; cursor:pointer;">&times;</button>
    </div>
    <div class="modal-body" style="padding: 1.5rem;">
      <input type="hidden" id="form-contact-id" value="${contactId || ''}">
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
        <div>
          <label style="display:block; margin-bottom:0.5rem; font-weight:500;">Name *</label>
          <input type="text" id="form-contact-name" class="login-input" value="${contact.name}" required>
        </div>
        <div>
          <label style="display:block; margin-bottom:0.5rem; font-weight:500;">Company *</label>
          <input type="text" id="form-contact-company" class="login-input" value="${contact.company}" required>
        </div>
      </div>

      <div style="margin-bottom: 1rem;">
        <label style="display:block; margin-bottom:0.5rem; font-weight:500;">Designation</label>
        <input type="text" id="form-contact-designation" class="login-input" value="${contact.designation || ''}">
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
        <div>
          <label style="display:block; margin-bottom:0.5rem; font-weight:500;">Email * (or Phone)</label>
          <input type="email" id="form-contact-email" class="login-input" value="${contact.email || ''}">
        </div>
        <div>
          <label style="display:block; margin-bottom:0.5rem; font-weight:500;">Phone * (or Email)</label>
          <input type="text" id="form-contact-phone" class="login-input" value="${contact.phone || ''}">
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
        <div>
          <label style="display:block; margin-bottom:0.5rem; font-weight:500;">Type</label>
          <select id="form-contact-type" class="login-input">
            <option value="client" ${contact.type === 'client' ? 'selected' : ''}>Client</option>
            <option value="vendor" ${contact.type === 'vendor' ? 'selected' : ''}>Vendor</option>
          </select>
        </div>
        <div>
          <label style="display:block; margin-bottom:0.5rem; font-weight:500;">Tags (comma-separated)</label>
          <input type="text" id="form-contact-tags" class="login-input" placeholder="e.g. enterprise, IT" value="${tagsString}">
        </div>
      </div>
      
      <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
        <button class="btn btn-secondary btn-close-contact-modal">Cancel</button>
        <button class="btn btn-primary" id="btn-save-contact">Save Contact</button>
      </div>
    </div>
  `;

  overlay.style.display = 'block';
  modal.style.display = 'block';
}

function closeContactModal() {
  document.getElementById('modal-overlay-contact').style.display = 'none';
  document.getElementById('contact-modal').style.display = 'none';
}

function saveContact() {
  const user = Auth.getCurrentUser();
  if (!user) return;

  const id = document.getElementById('form-contact-id').value;
  const name = document.getElementById('form-contact-name').value.trim();
  const company = document.getElementById('form-contact-company').value.trim();
  const email = document.getElementById('form-contact-email').value.trim();
  const phone = document.getElementById('form-contact-phone').value.trim();
  const designation = document.getElementById('form-contact-designation').value.trim();
  const type = document.getElementById('form-contact-type').value;
  const tagsInput = document.getElementById('form-contact-tags').value.trim();
  
  if (!name || !company) {
    Toast.error('Validation Error', 'Name and Company are required.');
    return;
  }

  if (!email && !phone) {
    Toast.error('Validation Error', 'Either Email or Phone must be provided.');
    return;
  }

  // Parse comma-separated tags into an array
  const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];

  const contactData = {
    name,
    company,
    designation,
    email,
    phone,
    type,
    tags
  };

  if (id) {
    Store.updateContact(id, contactData);
    Toast.success('Success', 'Contact updated.');
  } else {
    contactData.id = generateId();
    contactData.createdBy = user.id;
    contactData.createdAt = new Date().toISOString();
    contactData.updatedAt = contactData.createdAt;
    Store.createContact(contactData);
    Toast.success('Success', 'Contact created.');
  }

  closeContactModal();
  reRenderContactsFull();
}
