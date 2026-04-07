// ==============================================
// risePaisa — Authentication Module
// Client-side auth with SHA-256 hashing
// ==============================================
import { getUsers } from '../admin/store.js';

const SESSION_KEY = 'rp_session_v1';

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
  const users = getUsers();
  const user = users.find(
    u => u.username.toLowerCase() === username.toLowerCase().trim()
  );

  if (!user) return { success: false, error: 'Invalid username or password.' };

  const hash = await hashPassword(password);
  if (hash !== user.passwordHash) {
    return { success: false, error: 'Invalid username or password.' };
  }

  // Create session
  const session = {
    userId: user.id,
    username: user.username,
    name: user.name,
    loginAt: Date.now()
  };

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { success: true, user: session };
}

// ── Logout ───────────────────────────────────────
export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

// ── Get Current Session ──────────────────────────
export function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
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
