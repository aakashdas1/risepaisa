// ==============================================
// risePaisa — Authentication Module
// Client-side auth with SHA-256 hashing
// Session: localStorage with 24h expiry
// ==============================================
import { getUsers } from '../admin/store.js';

const SESSION_KEY = 'rp_session_v2';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// ── SHA-256 Hashing ──────────────────────────────
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── Login ────────────────────────────────────────
export async function login(username, password) {
  // Normalize inputs: trim whitespace that mobile keyboards often append
  const normalizedUsername = (username || '').trim();
  const normalizedPassword = (password || '').trim();

  console.log('[risePaisa Auth] Login attempt for:', normalizedUsername);
  console.log('[risePaisa Auth] Password length:', normalizedPassword.length, '(raw:', (password || '').length, ')');

  if (!normalizedUsername || !normalizedPassword) {
    return { success: false, error: 'Please enter both username and password.' };
  }

  const users = getUsers();
  console.log('[risePaisa Auth] Total registered users:', users.length);

  const user = users.find(
    u => u.username.toLowerCase() === normalizedUsername.toLowerCase()
  );

  if (!user) {
    console.warn('[risePaisa Auth] Login FAILED — user not found:', normalizedUsername);
    return { success: false, error: 'Invalid username or password.' };
  }

  // Hash the normalized password and compare
  const hash = await hashPassword(normalizedPassword);

  if (hash !== user.passwordHash) {
    console.warn('[risePaisa Auth] Login FAILED — password mismatch for:', normalizedUsername);
    console.debug('[risePaisa Auth] Expected hash:', user.passwordHash?.substring(0, 12) + '...');
    console.debug('[risePaisa Auth] Got hash:     ', hash.substring(0, 12) + '...');
    return { success: false, error: 'Invalid username or password.' };
  }

  // Create session with expiry (persists in localStorage)
  const session = {
    userId: user.id,
    username: user.username,
    name: user.name,
    loginAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION_MS,
    // Store assigned courses in session for quick access
    assignedCourses: user.assignedCourses || [],
  };

  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    console.log('[risePaisa Auth] Login SUCCESS for:', username, '— session stored in localStorage');
  } catch (e) {
    console.error('[risePaisa Auth] Failed to persist session:', e);
    return { success: false, error: 'Storage error. Please try again.' };
  }

  return { success: true, user: session };
}

// ── Logout ───────────────────────────────────────
export function logout() {
  localStorage.removeItem(SESSION_KEY);
  // Also clean up legacy sessionStorage key if present
  sessionStorage.removeItem('rp_session_v1');
  console.log('[risePaisa Auth] Logged out — session cleared.');
}

// ── Get Current Session ──────────────────────────
export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw);

    // Check expiry
    if (session.expiresAt && Date.now() > session.expiresAt) {
      console.log('[risePaisa Auth] Session expired — auto-logout.');
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

// ── Get Current User (full object from store) ────
export function getCurrentUser() {
  const session = getSession();
  if (!session) return null;

  const users = getUsers();
  return users.find(u => u.id === session.userId) || null;
}

// ── Is Logged In ─────────────────────────────────
export function isLoggedIn() {
  return getSession() !== null;
}

// ── Get Assigned Course Slugs ────────────────────
export function getUserCourses() {
  const user = getCurrentUser();
  if (!user) return [];
  return user.assignedCourses || [];
}

// ── Check if user has access to course ───────────
export function hasAccessToCourse(slug) {
  const courses = getUserCourses();
  return courses.includes(slug);
}
