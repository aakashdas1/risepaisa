// ==============================================
// risePaisa — Admin CMS Data Store (v2)
// Provides localStorage-backed data for all content.
// Extended: users, courseLessons, adminPasswordHash
// ==============================================
import _COURSES from '../data/courses.js';
import _RESOURCES from '../data/resources.js';
import _ARTICLES from '../data/articles.js';

const STORE_KEY = 'rp_cms_v1';

// Default admin password hash (SHA-256 of "rike@2026")
const DEFAULT_ADMIN_HASH = '6f1be9f0c043a0f5e7b3f9d3b5e8c1a2d4f6e8a0b2c4d6e8f0a1b3c5d7e9f1a3';

function _clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function _defaultSettings() {
  return {
    whatsapp: '+9779761145115',
    siteName: 'risePaisa',
    tagline: "Nepal's Financial Education Platform",
    social: {
      youtube: '#',
      tiktok: '#',
      instagram: '#',
      facebook: '#',
    },
    contactLinks: {
      risepaisa: {
        tiktok: 'https://www.tiktok.com/@risepaisa',
        instagram: 'https://www.instagram.com/risepaisa/',
        facebook: 'https://www.facebook.com/risepaisa/',
        youtube: 'https://www.youtube.com/@risePaisa',
        twitter: 'https://x.com/risePaisa',
        linkedin: 'https://np.linkedin.com/company/risepaisa-nepal'
      },
      aakash: {
        tiktok: 'https://www.tiktok.com/@aakashdas_',
        instagram: 'https://www.instagram.com/aakashdas_',
        facebook: 'https://www.facebook.com/AakasshDas/',
        youtube: 'https://www.youtube.com/@aakaash-daas',
        twitter: 'https://x.com/_aakashdas_',
        linkedin: 'https://www.linkedin.com/in/aakashdas'
      }
    },
    navItems: {
      personalConsultancy: {
        label: 'Personal Consultancy',
        path: '#/consultancy',
        enabled: true
      }
    },
    pages: {
      privacy: {
        title: 'Privacy Policy',
        lastUpdated: 'March 2026',
        content: ''
      },
      terms: {
        title: 'Terms & Conditions',
        lastUpdated: 'March 2026',
        content: ''
      },
      disclaimer: {
        title: 'Disclaimer',
        lastUpdated: 'March 2026',
        content: ''
      },
      consultancy: {
        title: 'Personal Consultancy',
        description: 'We provide one-to-one personal consultancy sessions focused on finance, investing, and practical money management based on your real situation.\n\nThis is a direct video call consultancy where you can discuss your financial goals, problems, and strategy in detail.',
        pricingText: 'Consultancy is conducted via video call.\nIf you need personalized guidance and clear direction, you can book a session and get direct support.',
        priceValue: '2500',
        duration: '2 hours',
        buttonText: 'Contact for Consultancy'
      }
    }
  };
}

function _seed() {
  return {
    courses: _clone(_COURSES),
    resources: _clone(_RESOURCES),
    articles: _clone(_ARTICLES),
    settings: _defaultSettings(),
    users: [],
    adminPasswordHash: null, // null = use legacy XOR verification
    courseLessons: {},
  };
}

let _store = null;

function _load() {
  try {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved) {
      _store = JSON.parse(saved);
      // Ensure all keys exist (backwards-compat)
      if (!Array.isArray(_store.courses))   _store.courses   = _clone(_COURSES);
      if (!Array.isArray(_store.resources)) _store.resources = _clone(_RESOURCES);
      if (!Array.isArray(_store.articles))  _store.articles  = _clone(_ARTICLES);
      if (!_store.settings) _store.settings = _defaultSettings();
      if (!_store.settings.social) _store.settings.social = _defaultSettings().social;
      if (!_store.settings.contactLinks) _store.settings.contactLinks = _defaultSettings().contactLinks;
      if (!_store.settings.contactLinks.risepaisa) _store.settings.contactLinks.risepaisa = _defaultSettings().contactLinks.risepaisa;
      if (!_store.settings.contactLinks.aakash) _store.settings.contactLinks.aakash = _defaultSettings().contactLinks.aakash;
      // Migrate aakash links if empty
      const aakash = _store.settings.contactLinks.aakash;
      if (!aakash.tiktok || aakash.tiktok === '') aakash.tiktok = 'https://www.tiktok.com/@aakashdas_';
      if (!aakash.instagram || aakash.instagram === '') aakash.instagram = 'https://www.instagram.com/aakashdas_';
      if (!aakash.facebook || aakash.facebook === '') aakash.facebook = 'https://www.facebook.com/AakasshDas/';
      if (!aakash.youtube || aakash.youtube === '') aakash.youtube = 'https://www.youtube.com/@aakaash-daas';
      if (!aakash.twitter || aakash.twitter === '') aakash.twitter = 'https://x.com/_aakashdas_';
      if (!aakash.linkedin || aakash.linkedin === '') aakash.linkedin = 'https://www.linkedin.com/in/aakashdas';
      // v2 fields
      if (!Array.isArray(_store.users)) _store.users = [];
      if (typeof _store.adminPasswordHash === 'undefined') _store.adminPasswordHash = null;
      if (!_store.courseLessons || typeof _store.courseLessons !== 'object') _store.courseLessons = {};
      // v3 fields: navItems, pages
      if (!_store.settings.navItems) _store.settings.navItems = _defaultSettings().navItems;
      if (!_store.settings.navItems.personalConsultancy) {
        _store.settings.navItems.personalConsultancy = _defaultSettings().navItems.personalConsultancy;
      } else if (_store.settings.navItems.personalConsultancy.path === '#/contact') {
        // Migration: Fix corrupted path from previous versions mapping it to the social contact page
        _store.settings.navItems.personalConsultancy.path = '#/consultancy';
      }
      if (!_store.settings.pages) _store.settings.pages = _defaultSettings().pages;
      if (!_store.settings.pages.privacy) _store.settings.pages.privacy = _defaultSettings().pages.privacy;
      if (!_store.settings.pages.terms) _store.settings.pages.terms = _defaultSettings().pages.terms;
      if (!_store.settings.pages.disclaimer) _store.settings.pages.disclaimer = _defaultSettings().pages.disclaimer;
      if (!_store.settings.pages.consultancy) _store.settings.pages.consultancy = _defaultSettings().pages.consultancy;
    } else {
      _store = _seed();
      _persist();
    }
  } catch (e) {
    _store = _seed();
    _persist();
  }
}

let _lastPersistError = null;

function _persist() {
  _lastPersistError = null;
  try {
    const data = JSON.stringify(_store);
    localStorage.setItem(STORE_KEY, data);

    // Verification: read back to confirm save succeeded
    const verification = localStorage.getItem(STORE_KEY);
    if (!verification) {
      _lastPersistError = 'Save verification failed — data was not written to storage.';
      console.error('[risePaisa CMS]', _lastPersistError);
      return false;
    }
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.code === 22 || e.code === 1014) {
      _lastPersistError = 'Storage full! Try removing large images or clearing old data.';
    } else {
      _lastPersistError = 'Storage error: ' + (e.message || 'unknown');
    }
    console.error('[risePaisa CMS] Persist failed:', _lastPersistError, e);
    return false;
  }
}

// Expose last persist error for UI feedback
export function getLastPersistError() { return _lastPersistError; }

// Bootstrap
_load();

// ── Getters ──────────────────────────────────────
export function getCourses()   { return _store.courses; }
export function getResources() { return _store.resources; }
export function getArticles()  { return _store.articles; }
export function getSettings()  { return _store.settings; }
export function getStore()     { return _store; }

// v2 Getters
export function getUsers()             { return _store.users; }
export function getAdminPasswordHash() { return _store.adminPasswordHash; }
export function getCourseLessons()     { return _store.courseLessons; }

// Get lessons for a specific course
export function getLessonsForCourse(slug) {
  return _store.courseLessons[slug] || null;
}

// ── Setters ──────────────────────────────────────
export function setCourses(data)   { _store.courses   = data; _persist(); }
export function setResources(data) { _store.resources = data; _persist(); }
export function setArticles(data)  { _store.articles  = data; _persist(); }
export function setSettings(data)  { _store.settings  = data; _persist(); }

// v2 Setters
export function setUsers(data)            { _store.users = data; _persist(); }
export function setAdminPasswordHash(hash) { _store.adminPasswordHash = hash; _persist(); }
export function setCourseLessons(data)     { _store.courseLessons = data; _persist(); }

// Set lessons for a specific course
export function setLessonsForCourse(slug, lessons) {
  _store.courseLessons[slug] = lessons;
  _persist();
}

// resetStore removed — data wipe is no longer permitted.
// Retained as no-op for backward compatibility if called anywhere.
export function resetStore() {
  console.warn('[risePaisa CMS] resetStore is disabled.');
}
