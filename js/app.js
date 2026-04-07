// ==============================================
// risePaisa — App Router & Initialization
// ==============================================
import { renderNavbar, renderFooter, renderWhatsAppFloat, initNavbar } from './components.js';
import { initAllEnhancements } from './enhancements.js';
import { renderHomePage, initHomePage } from './pages/home.js';
import { renderCoursesPage, initCoursesPage } from './pages/courses.js';
import { renderCourseDetailPage, initCourseDetailPage } from './pages/courseDetail.js';
import { renderResourcesPage, initResourcesPage } from './pages/resources.js';
import { renderResourceDetailPage, initResourceDetailPage } from './pages/resourceDetail.js';
import { renderBlogPage, initBlogPage } from './pages/blog.js';
import { renderBlogPostPage, initBlogPostPage } from './pages/blogPost.js';
import { renderAboutPage, initAboutPage } from './pages/about.js';
import { renderContactPage, initContactPage } from './pages/contact.js';
import { renderConsultancyPage, initConsultancyPage } from './pages/consultancy.js';
import { renderLegalPage, initLegalPage } from './pages/legal.js';
import { renderLoginPage, initLoginPage } from './pages/login.js';
import { renderLearnPage, initLearnPage } from './pages/learn.js';
import { initAdmin } from './admin/admin.js';

// ── Route Definitions ────────────────────────────
const routes = [
  { pattern: /^#?\/?$/, render: () => renderHomePage(), init: () => initHomePage(), nav: '#/' },
  { pattern: /^#\/courses\/?$/, render: () => renderCoursesPage(), init: () => initCoursesPage(), nav: '#/courses' },
  { pattern: /^#\/course\/(.+)$/, render: (m) => renderCourseDetailPage(m[1]), init: () => initCourseDetailPage(), nav: '#/courses' },
  { pattern: /^#\/resources\/?$/, render: () => renderResourcesPage(), init: () => initResourcesPage(), nav: '#/resources' },
  { pattern: /^#\/resource\/(.+)$/, render: (m) => renderResourceDetailPage(m[1]), init: () => initResourceDetailPage(), nav: '#/resources' },
  { pattern: /^#\/blog\/([a-z0-9-]+)$/, render: (m) => renderBlogPostPage(m[1]), init: () => initBlogPostPage(), nav: '#/blog' },
  { pattern: /^#\/blog\/?(?:\?(.*))?$/, render: (m) => {
      const params = m[1] ? new URLSearchParams(m[1]) : null;
      return renderBlogPage(params);
    }, init: () => initBlogPage(), nav: '#/blog' },
  { pattern: /^#\/about\/?$/, render: () => renderAboutPage(), init: () => initAboutPage(), nav: '#/about' },
  { pattern: /^#\/consultancy\/?$/, render: () => renderConsultancyPage(), init: () => initConsultancyPage(), nav: '#/consultancy' },
  { pattern: /^#\/contact\/?$/, render: () => renderContactPage(), init: () => initContactPage(), nav: '#/contact' },
  { pattern: /^#\/login\/?$/, render: () => renderLoginPage(), init: () => initLoginPage(), nav: null },
  { pattern: /^#\/learn\/(.+)$/, render: (m) => renderLearnPage(m[1]), init: () => initLearnPage(), nav: null, fullscreen: true },
  { pattern: /^#\/privacy\/?$/, render: () => renderLegalPage('privacy'), init: () => initLegalPage(), nav: null },
  { pattern: /^#\/terms\/?$/, render: () => renderLegalPage('terms'), init: () => initLegalPage(), nav: null },
  { pattern: /^#\/disclaimer\/?$/, render: () => renderLegalPage('disclaimer'), init: () => initLegalPage(), nav: null },
];

// ── Router ───────────────────────────────────────
function router() {
  const hash = window.location.hash || '#/';
  
  let matchedRoute = null;
  let match = null;

  for (const route of routes) {
    const m = hash.match(route.pattern);
    if (m) {
      matchedRoute = route;
      match = m;
      break;
    }
  }

  if (!matchedRoute) {
    // 404
    document.getElementById('app').innerHTML = `
      <div class="section" style="text-align:center;min-height:60vh;display:flex;align-items:center;justify-content:center">
        <div>
          <h1 style="font-size:var(--text-6xl);color:var(--color-accent);margin-bottom:var(--space-4)">404</h1>
          <h2 style="margin-bottom:var(--space-4)">Page Not Found</h2>
          <p style="margin-bottom:var(--space-8)">The page you're looking for doesn't exist.</p>
          <a href="#/" class="btn btn-primary btn-lg">Go Home</a>
        </div>
      </div>
    `;
    return;
  }

  // Handle fullscreen routes (learn page — no navbar/footer)
  const isFullscreen = matchedRoute.fullscreen;
  const navContainer = document.getElementById('navbar-container');
  const footerContainer = document.getElementById('footer-container');
  const waContainer = document.getElementById('whatsapp-container');

  if (isFullscreen) {
    if (navContainer) navContainer.style.display = 'none';
    if (footerContainer) footerContainer.style.display = 'none';
    if (waContainer) waContainer.style.display = 'none';
  } else {
    if (navContainer) navContainer.style.display = '';
    if (footerContainer) footerContainer.style.display = '';
    if (waContainer) waContainer.style.display = '';

    // Update navbar
    const navPath = matchedRoute.nav || '';
    navContainer.innerHTML = renderNavbar(navPath);
  }

  // Render page content
  const content = matchedRoute.render(match);
  document.getElementById('app').innerHTML = content;
  
  // Initialize page interactivity
  if (!isFullscreen) {
    initNavbar();
  }
  matchedRoute.init();

  // Premium UI enhancements (runs after page init)
  if (!isFullscreen) {
    setTimeout(initAllEnhancements, 60);
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// Expose router for admin panel live-reload
window._rpRouterReload = router;

// ── Initialize App ───────────────────────────────
function initApp() {
  // Inject global components
  const body = document.body;
  
  // Navbar container
  const navContainer = document.createElement('div');
  navContainer.id = 'navbar-container';
  body.prepend(navContainer);
  
  // Footer (always visible)
  const footerContainer = document.createElement('div');
  footerContainer.id = 'footer-container';
  footerContainer.innerHTML = renderFooter();
  
  // WhatsApp float
  const waContainer = document.createElement('div');
  waContainer.id = 'whatsapp-container';
  waContainer.innerHTML = renderWhatsAppFloat();
  
  // Append after app div
  const appDiv = document.getElementById('app');
  appDiv.after(footerContainer);
  body.appendChild(waContainer);

  // Init hidden admin system (lazy — only activates on trigger click)
  initAdmin();

  // Start router
  window.addEventListener('hashchange', router);
  router();
}

// Boot
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
