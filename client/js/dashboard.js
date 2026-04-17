// Dashboard - Lead management logic
const LEADS_API = '/api/leads';
let currentLeadId = null;

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  setupUser();
  setupNav();
  setupModals();
  setupFilters();
  setupMobileMenu();
  loadDashboard();
});

function setupUser() {
  const user = JSON.parse(localStorage.getItem('crm_user') || '{}');
  const el = (id) => document.getElementById(id);
  if (user.username) {
    el('userName').textContent = user.username;
    el('userEmail').textContent = user.email;
    el('userAvatar').textContent = user.username.charAt(0).toUpperCase();
  }
  el('logoutBtn').addEventListener('click', logout);
}

function setupNav() {
  document.querySelectorAll('.nav-item[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      
      // Update nav button states
      document.querySelectorAll('.nav-item[data-view]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update page titles
      document.getElementById('pageTitle').textContent =
        view === 'dashboard' ? 'Dashboard' : view === 'leads' ? 'All Leads' : 'Analytics';
      document.getElementById('pageSubtitle').textContent =
        view === 'dashboard' ? "Welcome back! Here's your lead overview." :
        view === 'leads' ? 'Manage and track all your leads.' : 'Visual insights into your leads.';

      // Toggle search box (only for leads view)
      const searchBox = document.querySelector('.search-box');
      if (searchBox) searchBox.style.display = view === 'leads' ? 'flex' : 'none';

      // Show/Hide sections
      document.querySelectorAll('[data-section]').forEach(section => {
        section.style.display = section.dataset.section === view ? 'block' : 'none';
      });

      // Reload data if needed
      if (view === 'dashboard') loadDashboard();
      if (view === 'analytics') loadStats();
      if (view === 'leads') loadLeads();
    });
  });
}

function setupMobileMenu() {
  const toggle = document.getElementById('mobileToggle');
  const sidebar = document.getElementById('sidebar');
  if (toggle) toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
}

// ── LOAD DATA ──
async function loadDashboard() {
  await Promise.all([loadStats(), loadRecentLeads()]);
}

async function loadStats() {
  try {
    const res = await fetch(`${LEADS_API}/stats`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to load stats');
    const stats = await res.json();
    
    // Update Dashboard Stats
    animateCounter('statTotal', stats.total);
    animateCounter('statNew', stats.new);
    animateCounter('statContacted', stats.contacted);
    animateCounter('statConverted', stats.converted);
    
    // Update Analytics View Stats (if elements exist)
    if (document.getElementById('statTotal2')) {
      animateCounter('statTotal2', stats.total);
      animateCounter('statNew2', stats.new);
      animateCounter('statContacted2', stats.contacted);
      animateCounter('statConverted2', stats.converted);
    }
    
    renderCharts(stats);
  } catch (err) {
    console.error(err);
  }
}

async function loadRecentLeads() {
  try {
    const res = await fetch(`${LEADS_API}?sort=newest&limit=5`, { headers: getAuthHeaders() });
    const leads = await res.json();
    const tbody = document.getElementById('recentLeadsBody');
    if (leads.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:20px;">No recent leads.</td></tr>';
      return;
    }
    tbody.innerHTML = leads.slice(0, 5).map(lead => `
      <tr>
        <td><span class="lead-name">${esc(lead.name)}</span></td>
        <td><span class="badge badge-${lead.status}">● ${lead.status}</span></td>
        <td style="font-size:12px;color:var(--text-muted)">${formatDate(lead.createdAt)}</td>
      </tr>
    `).join('');
  } catch (err) { console.error(err); }
}

async function loadLeads() {
  const status = document.getElementById('filterStatus').value;
  const source = document.getElementById('filterSource').value;
  const sort = document.getElementById('sortBy').value;
  const search = document.getElementById('searchInput').value;
  const params = new URLSearchParams();
  if (status !== 'all') params.set('status', status);
  if (source !== 'all') params.set('source', source);
  if (sort) params.set('sort', sort);
  if (search) params.set('search', search);

  try {
    const res = await fetch(`${LEADS_API}?${params}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to load leads');
    const leads = await res.json();
    renderLeadsTable(leads);
  } catch (err) {
    console.error(err);
    document.getElementById('leadsTableBody').innerHTML =
      '<tr><td colspan="5" class="empty-state"><div class="icon">⚠️</div><h3>Error loading leads</h3></td></tr>';
  }
}

function renderLeadsTable(leads) {
  const tbody = document.getElementById('leadsTableBody');
  if (leads.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5"><div class="empty-state"><div class="icon">📭</div><h3>No leads found</h3><p>Try adjusting your filters or add a new lead.</p></div></td></tr>';
    return;
  }
  tbody.innerHTML = leads.map(lead => `
    <tr>
      <td><span class="lead-name">${esc(lead.name)}</span><br><small style="color:var(--text-muted)">${formatDate(lead.createdAt)}</small></td>
      <td><span class="lead-email">${esc(lead.email)}</span></td>
      <td><span class="source-badge">${esc(lead.source)}</span></td>
      <td>
        <select class="badge badge-${lead.status}" onchange="updateStatus('${lead._id}', this.value)" style="border:none;cursor:pointer;font-family:inherit;outline:none;">
          <option value="new" ${lead.status==='new'?'selected':''}>● New</option>
          <option value="contacted" ${lead.status==='contacted'?'selected':''}>● Contacted</option>
          <option value="converted" ${lead.status==='converted'?'selected':''}>● Converted</option>
        </select>
      </td>
      <td>
        <div class="actions-cell">
          <button class="btn-icon" onclick="openNotes('${lead._id}')" title="Notes (${lead.notes?.length || 0})">📝</button>
          <button class="btn-icon" onclick="editLead('${lead._id}')" title="Edit">✏️</button>
          <button class="btn-icon" onclick="deleteLead('${lead._id}')" title="Delete">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ── STATUS UPDATE ──
async function updateStatus(id, status) {
  try {
    const res = await fetch(`${LEADS_API}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Update failed');
    showToast('Status updated!', 'success');
    loadDashboard();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ── ADD / EDIT LEAD ──
function setupModals() {
  const modal = document.getElementById('leadModal');
  const notesModal = document.getElementById('notesModal');

  document.getElementById('addLeadBtn').addEventListener('click', () => {
    document.getElementById('modalTitle').textContent = 'Add New Lead';
    document.getElementById('leadForm').reset();
    document.getElementById('leadId').value = '';
    modal.classList.add('active');
  });

  document.getElementById('modalClose').addEventListener('click', () => modal.classList.remove('active'));
  document.getElementById('modalCancelBtn').addEventListener('click', () => modal.classList.remove('active'));
  document.getElementById('notesClose').addEventListener('click', () => notesModal.classList.remove('active'));
  document.getElementById('notesCancelBtn').addEventListener('click', () => notesModal.classList.remove('active'));

  // Close on overlay click
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
  notesModal.addEventListener('click', (e) => { if (e.target === notesModal) notesModal.classList.remove('active'); });

  document.getElementById('modalSaveBtn').addEventListener('click', saveLead);
  document.getElementById('addNoteBtn').addEventListener('click', addNote);
}

async function saveLead() {
  const id = document.getElementById('leadId').value;
  const data = {
    name: document.getElementById('leadName').value.trim(),
    email: document.getElementById('leadEmail').value.trim(),
    phone: document.getElementById('leadPhone').value.trim(),
    source: document.getElementById('leadSource').value,
    status: document.getElementById('leadStatus').value
  };

  if (!data.name || !data.email) {
    showToast('Name and email are required', 'error');
    return;
  }

  try {
    const url = id ? `${LEADS_API}/${id}` : LEADS_API;
    const method = id ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: getAuthHeaders(), body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Save failed');
    document.getElementById('leadModal').classList.remove('active');
    showToast(id ? 'Lead updated!' : 'Lead created!', 'success');
    loadDashboard();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function editLead(id) {
  try {
    const res = await fetch(`${LEADS_API}?`, { headers: getAuthHeaders() });
    const leads = await res.json();
    const lead = leads.find(l => l._id === id);
    if (!lead) return;

    document.getElementById('modalTitle').textContent = 'Edit Lead';
    document.getElementById('leadId').value = lead._id;
    document.getElementById('leadName').value = lead.name;
    document.getElementById('leadEmail').value = lead.email;
    document.getElementById('leadPhone').value = lead.phone || '';
    document.getElementById('leadSource').value = lead.source;
    document.getElementById('leadStatus').value = lead.status;
    document.getElementById('leadModal').classList.add('active');
  } catch (err) {
    showToast('Failed to load lead', 'error');
  }
}

async function deleteLead(id) {
  if (!confirm('Delete this lead permanently?')) return;
  try {
    const res = await fetch(`${LEADS_API}/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Delete failed');
    showToast('Lead deleted', 'success');
    loadDashboard();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ── NOTES ──
async function openNotes(id) {
  currentLeadId = id;
  try {
    const res = await fetch(`${LEADS_API}?`, { headers: getAuthHeaders() });
    const leads = await res.json();
    const lead = leads.find(l => l._id === id);
    if (!lead) return;

    document.getElementById('notesTitle').textContent = `Notes — ${lead.name}`;
    const list = document.getElementById('notesList');
    if (lead.notes && lead.notes.length > 0) {
      list.innerHTML = lead.notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map(n => `<div class="note-item"><div class="note-text">${esc(n.text)}</div><div class="note-date">${formatDate(n.createdAt)}</div></div>`).join('');
    } else {
      list.innerHTML = '<div class="empty-notes">No notes yet. Add your first follow-up note below.</div>';
    }
    document.getElementById('newNote').value = '';
    document.getElementById('notesModal').classList.add('active');
  } catch (err) {
    showToast('Failed to load notes', 'error');
  }
}

async function addNote() {
  const text = document.getElementById('newNote').value.trim();
  if (!text) { showToast('Please write a note', 'error'); return; }
  try {
    const res = await fetch(`${LEADS_API}/${currentLeadId}/notes`, {
      method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error('Failed to add note');
    showToast('Note added!', 'success');
    openNotes(currentLeadId);
    loadLeads();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ── FILTERS ──
function setupFilters() {
  let debounceTimer;
  document.getElementById('searchInput').addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(loadLeads, 300);
  });
  document.getElementById('filterStatus').addEventListener('change', loadLeads);
  document.getElementById('filterSource').addEventListener('change', loadLeads);
  document.getElementById('sortBy').addEventListener('change', loadLeads);
}

// ── UTILITIES ──
function esc(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function animateCounter(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  const duration = 800;
  const start = performance.now();
  const from = parseInt(el.textContent) || 0;
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + (target - from) * eased);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function showToast(msg, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
}
