// ==============================================
// risePaisa — Login Page
// ==============================================
import { setPageMeta, getWhatsApp } from '../components.js';
import { login, isLoggedIn } from '../auth/auth.js';

export function renderLoginPage() {
  setPageMeta('Login', 'Sign in to access your purchased courses on risePaisa.');

  // If already logged in, redirect
  if (isLoggedIn()) {
    setTimeout(() => { window.location.hash = '#/courses'; }, 0);
    return `<div class="section" style="text-align:center;min-height:60vh;display:flex;align-items:center;justify-content:center">
      <p>Redirecting to your courses...</p>
    </div>`;
  }

  return `
    <div class="login-page" id="login-page">
      <div class="login-card" id="login-card">
        <div class="login-header">
          <div class="login-logo">rise<span>Paisa</span></div>
          <h1 class="login-title">Welcome Back</h1>
          <p class="login-subtitle">Sign in to access your purchased courses</p>
        </div>

        <form class="login-form" id="login-form" autocomplete="off">
          <div class="login-field">
            <label class="login-label" for="login-username">Username</label>
            <input type="text" id="login-username" class="login-input" 
                   placeholder="Enter your username" autocomplete="username"
                   autocapitalize="none" autocorrect="off" inputmode="text"
                   required spellcheck="false">
          </div>

          <div class="login-field">
            <label class="login-label" for="login-password">Password</label>
            <div class="login-password-wrap">
              <input type="password" id="login-password" class="login-input" 
                     placeholder="Enter your password" autocomplete="current-password"
                     autocapitalize="none" autocorrect="off" spellcheck="false"
                     required>
              <button type="button" class="login-toggle-vis" id="login-toggle-vis" tabindex="-1">👁</button>
            </div>
          </div>

          <div class="login-error" id="login-error"></div>

          <button type="submit" class="btn btn-primary btn-lg login-submit" id="login-submit">
            Sign In
          </button>
        </form>

        <div class="login-footer">
          <p>Don't have an account? <a href="https://wa.me/${getWhatsApp()}?text=${encodeURIComponent('I want to contact you.')}" target="_blank" rel="noopener">Contact Admin</a></p>
        </div>

        <div class="login-decoration login-deco-1"></div>
        <div class="login-decoration login-deco-2"></div>
      </div>
    </div>
  `;
}

export function initLoginPage() {
  const form = document.getElementById('login-form');
  const usernameInput = document.getElementById('login-username');
  const passwordInput = document.getElementById('login-password');
  const errorEl = document.getElementById('login-error');
  const submitBtn = document.getElementById('login-submit');
  const toggleVis = document.getElementById('login-toggle-vis');
  const card = document.getElementById('login-card');

  if (!form) return;

  // Toggle password visibility
  toggleVis?.addEventListener('click', () => {
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    toggleVis.textContent = passwordInput.type === 'password' ? '👁' : '🙈';
  });

  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.textContent = '';
    errorEl.classList.remove('show');

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
      _showError(errorEl, card, 'Please enter both username and password.');
      return;
    }

    // Disable button during auth
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';

    try {
      const result = await login(username, password);

      if (result.success) {
        // Success animation
        card.classList.add('login-success');
        setTimeout(() => {
          window.location.hash = '#/courses';
        }, 600);
      } else {
        _showError(errorEl, card, result.error);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In';
        passwordInput.value = '';
        passwordInput.focus();
      }
    } catch (err) {
      _showError(errorEl, card, 'Something went wrong. Please try again.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
    }
  });

  // Focus username on load
  setTimeout(() => usernameInput?.focus(), 100);
}

function _showError(errorEl, card, message) {
  errorEl.textContent = message;
  errorEl.classList.add('show');
  card.classList.add('login-shake');
  setTimeout(() => card.classList.remove('login-shake'), 500);
}
