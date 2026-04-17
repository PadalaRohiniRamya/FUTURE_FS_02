// Auth utility functions
const API_URL = '/api/auth';

// Check if user is already logged in
function checkAuth() {
  const token = localStorage.getItem('crm_token');
  if (token && window.location.pathname.includes('index.html') || 
      token && window.location.pathname === '/') {
    window.location.href = '/dashboard';
  }
}

// Handle login form submission
function initLogin() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  checkAuth();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('loginBtn');
    const errorMsg = document.getElementById('errorMsg');
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    btn.textContent = 'Signing in...';
    btn.disabled = true;
    errorMsg.classList.remove('show');

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('crm_token', data.token);
      localStorage.setItem('crm_user', JSON.stringify(data.user));
      window.location.href = '/dashboard';
    } catch (error) {
      errorMsg.textContent = error.message;
      errorMsg.classList.add('show');
    } finally {
      btn.textContent = 'Sign In';
      btn.disabled = false;
    }
  });
}

// Logout
function logout() {
  localStorage.removeItem('crm_token');
  localStorage.removeItem('crm_user');
  window.location.href = '/';
}

// Get auth header
function getAuthHeaders() {
  const token = localStorage.getItem('crm_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

// Protect dashboard page
function requireAuth() {
  const token = localStorage.getItem('crm_token');
  if (!token) {
    window.location.href = '/';
    return false;
  }
  return true;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initLogin);
