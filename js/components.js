// ==============================================
// risePaisa — Shared UI Components
// ==============================================
import { getSettings } from './admin/store.js';
import { isLoggedIn, getSession, logout } from './auth/auth.js';

const WHATSAPP_NUMBER = '+9779761145115'; // legacy fallback
const SITE_NAME = 'risePaisa';

// ── SVG Icons ────────────────────────────────────
const ICONS = {
  whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`,
  
  youtube: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  
  tiktok: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`,
  
  instagram: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.882 0 1.441 1.441 0 012.882 0z"/></svg>`,
  
  facebook: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  
  twitter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  
  chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
  
  play: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`,
  
  arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  
  target: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  
  users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  
  bookOpen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
};

// ── Navbar Component ─────────────────────────────
function renderNavbar(currentPath) {
  const settings = getSettings();
  const navCfg = settings.navItems || {};
  const pc = navCfg.personalConsultancy || {};

  const links = [
    { path: '#/', label: 'Home' },
    { path: '#/courses', label: 'Courses' },
  ];

  // Insert Personal Consultancy (admin-togglable)
  if (pc.enabled !== false) {
    links.push({ path: pc.path || '#/consultancy', label: pc.label || 'Personal Consultancy' });
  }

  links.push(
    { path: '#/resources', label: 'Resources' },
    { path: '#/blog', label: 'Blog' },
    { path: '#/about', label: 'About' },
    { path: '#/contact', label: 'Contact' },
  );

  const _loggedIn = isLoggedIn();
  const _session = getSession();

  // Auth-aware right side
  const authArea = _loggedIn
    ? `<div class="nav-auth-area">
         <span class="nav-user-badge" title="Logged in as ${_session?.name || _session?.username || 'User'}">
           <span class="nav-user-icon">👤</span>
           <span class="nav-user-name">${_session?.name || _session?.username || 'User'}</span>
         </span>
         <button class="btn btn-ghost nav-logout-btn" id="nav-logout-btn">Logout</button>
       </div>`
    : `<div class="nav-auth-area">
         <a href="#/login" class="nav-login-link ${currentPath === '#/login' ? 'active' : ''}">Login</a>
         <a href="https://wa.me/${getSettings().whatsapp}" target="_blank" rel="noopener" class="btn btn-primary nav-cta">
           ${ICONS.whatsapp} Contact Us
         </a>
       </div>`;

  // Mobile auth section
  const mobileAuth = _loggedIn
    ? `<div class="mobile-cta">
         <div class="mobile-user-info">
           <span>👤 ${_session?.name || _session?.username || 'User'}</span>
         </div>
         <button class="btn btn-ghost btn-lg" id="nav-mobile-logout" style="width:100%;margin-top:var(--space-2)">Logout</button>
       </div>`
    : `<div class="mobile-cta">
         <a href="#/login" class="btn btn-primary btn-lg" style="width:100%;margin-bottom:var(--space-2)">Login</a>
         <a href="https://wa.me/${getSettings().whatsapp}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-lg" style="width:100%">
           ${ICONS.whatsapp} Chat on WhatsApp
         </a>
       </div>`;

  return `
    <nav class="navbar" id="navbar">
      <div class="navbar-inner">
        <a href="#/" class="nav-logo" aria-label="${SITE_NAME} - Home">

          <div class="logo-text">rise<span>Paisa</span></div>
        </a>
        
        <div class="nav-links">
          ${links.map(l => `
            <a href="${l.path}" class="nav-link ${currentPath === l.path ? 'active' : ''}">${l.label}</a>
          `).join('')}
        </div>

        ${authArea}
        
        <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </div>
      
      <div class="mobile-menu" id="mobile-menu">
        ${links.map(l => `
          <a href="${l.path}" class="mobile-link ${currentPath === l.path ? 'active' : ''}">${l.label}</a>
        `).join('')}
        ${mobileAuth}
      </div>
    </nav>
  `;
}

// ── Footer Component ─────────────────────────────
function renderFooter() {
  return `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="#/" class="nav-logo">

              <div class="logo-text">rise<span>Paisa</span></div>
            </a>
            <p>Nepal's most practical financial education platform. Practical NEPSE, taxation, and personal finance strategies built for real income growth in Nepal.</p>
            <div class="footer-social">
              <a href="https://www.youtube.com/@risePaisa" target="_blank" rel="noopener" aria-label="YouTube">${ICONS.youtube}</a>
              <a href="https://www.tiktok.com/@risepaisa" target="_blank" rel="noopener" aria-label="TikTok">${ICONS.tiktok}</a>
              <a href="https://www.instagram.com/risepaisa/" target="_blank" rel="noopener" aria-label="Instagram">${ICONS.instagram}</a>
              <a href="https://www.facebook.com/risepaisa/" target="_blank" rel="noopener" aria-label="Facebook">${ICONS.facebook}</a>
            </div>
          </div>
          
          <div class="footer-section">
            <h4>Quick Links</h4>
            <a href="#/">Home</a>
            <a href="#/courses">Courses</a>
            <a href="#/resources">Resources</a>
            <a href="#/blog">Articles</a>
            <a href="#/about">About Us</a>
            <a href="#/contact">Contact</a>
          </div>
          
          <div class="footer-section">
            <h4>Topics</h4>
            <a href="#/blog?cat=nepse">NEPSE & Investing</a>
            <a href="#/blog?cat=personal-finance">Personal Finance</a>
            <a href="#/blog?cat=taxation">Taxation</a>
            <a href="#/blog?cat=fintech">Fintech Analysis</a>
          </div>
          
          <div class="footer-section">
            <h4>Legal</h4>
            <a href="#/privacy">Privacy Policy</a>
            <a href="#/terms">Terms & Conditions</a>
            <a href="#/disclaimer">Disclaimer</a>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</p>
          <span class="nepali-tag">🇳🇵 नेपालमै आधारित वित्तीय ज्ञान</span>
          <button id="rp-admin-trigger" aria-hidden="true" tabindex="-1" title="" onclick="window.__openAdmin&&window.__openAdmin()">·</button>
        </div>
      </div>
    </footer>
  `;
}

// ── WhatsApp Float Button ────────────────────────
function renderWhatsAppFloat() {
  const _wa = getSettings().whatsapp;
  return `
    <a href="https://wa.me/${_wa}?text=Hello! I'm interested in risePaisa courses." 
       target="_blank" rel="noopener" class="whatsapp-float" aria-label="Chat on WhatsApp" id="whatsapp-float">
      ${ICONS.whatsapp}
    </a>
  `;
}

// ── Course Card Component ────────────────────────
function renderCourseCard(course, isEnrolled = false) {
  const thumbMap = {
    1: 'assets/images/course-nepse.png',
    2: 'assets/images/course-finance.png',
    3: 'assets/images/course-tax.png',
    4: 'assets/images/course-mutual.png',
    5: 'assets/images/course-fintech.png',
  };
  const thumb = thumbMap[course.id] || 'assets/images/course-nepse.png';

  const ctaButton = isEnrolled
    ? `<a href="#/learn/${course.slug}" class="btn btn-primary">Start Learning</a>`
    : `<a href="#/course/${course.slug}" class="btn btn-primary">View Details</a>`;

  const enrolledBadge = isEnrolled
    ? '<span class="badge badge-enrolled">✓ Enrolled</span>'
    : '';
  
  return `
    <article class="card course-card" id="course-card-${course.id}">
      <img src="${thumb}" alt="${course.title}" class="card-image" loading="lazy">
      <div class="card-body">
        <div class="card-badges">
          <span class="badge">${course.category}</span>
          ${enrolledBadge}
        </div>
        <h3>${course.title}</h3>
        <p>${course.shortDescription}</p>
        <div class="card-meta">
          ${!isEnrolled ? `<div class="course-price"><span class="currency">NPR</span>${course.price.toLocaleString()}</div>` : '<div></div>'}
          ${ctaButton}
        </div>
      </div>
    </article>
  `;
}

// ── Resource Card Component ──────────────────────
function renderResourceCard(resource) {
  const thumbMap = {
    1: 'assets/images/resource-notion.png',
    2: 'assets/images/resource-budget.png',
  };
  const thumb = thumbMap[resource.id] || 'assets/images/resource-notion.png';
  
  return `
    <article class="card course-card" id="resource-card-${resource.id}">
      <img src="${thumb}" alt="${resource.title}" class="card-image" loading="lazy">
      <div class="card-body">
        <span class="badge">${resource.category}</span>
        <h3>${resource.title}</h3>
        <p>${resource.shortDescription}</p>
        <div class="card-meta">
          <div class="course-price">
            <span class="currency">NPR</span>${resource.price.toLocaleString()}
          </div>
          <a href="#/resource/${resource.slug}" class="btn btn-primary">View Details</a>
        </div>
      </div>
    </article>
  `;
}

// ── Article Card Component ───────────────────────
function renderArticleCard(article) {
  const catClass = {
    'Personal Finance': 'cat-personal-finance',
    'NEPSE & Investing': 'cat-nepse',
    'Taxation': 'cat-taxation',
    'Fintech': 'cat-fintech',
    'Saving & Budgeting': 'cat-saving',
  };

  const thumbHtml = article.thumbnail
    ? `<img src="${article.thumbnail}" alt="${article.title}" class="article-card-thumb" loading="lazy">`
    : `<div class="article-card-thumb article-card-thumb--placeholder"></div>`;
  
  return `
    <article class="card article-card" id="article-card-${article.id}">
      ${thumbHtml}
      <div class="card-body">
        <span class="card-category ${catClass[article.category] || 'cat-nepse'}">${article.category}</span>
        <h3><a href="#/blog/${article.slug}" style="color:inherit;text-decoration:none">${article.title}</a></h3>
        <p>${article.excerpt}</p>
        <div class="card-date" style="display:flex;align-items:center;gap:6px">
          <span style="display:inline-flex;width:14px;height:14px;flex-shrink:0;color:var(--color-text-muted)">${ICONS.clock}</span>
          ${article.readTime} · ${formatDate(article.date)}
        </div>
      </div>
    </article>
  `;
}

// ── Share Buttons ────────────────────────────────
function renderShareButtons(title, url) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(window.location.origin + '/' + url);
  
  return `
    <div class="share-buttons">
      <span style="font-size:var(--text-sm);color:var(--color-text-muted)">Share:</span>
      <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" rel="noopener" class="share-btn" aria-label="Share on Facebook">${ICONS.facebook}</a>
      <a href="https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}" target="_blank" rel="noopener" class="share-btn" aria-label="Share on Twitter">${ICONS.twitter}</a>
      <a href="https://wa.me/?text=${encodedTitle}%20${encodedUrl}" target="_blank" rel="noopener" class="share-btn" aria-label="Share on WhatsApp">${ICONS.whatsapp}</a>
    </div>
  `;
}

// ── Utility: Format Date ─────────────────────────
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ── Utility: Update Page Meta ────────────────────
function setPageMeta(title, description) {
  document.title = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Nepal's Financial Education Platform`;
  
  let meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', description || '');
  
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', title || SITE_NAME);
  
  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', description || '');
}

// ── Navbar Interactivity ─────────────────────────
function initNavbar() {
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navbar = document.getElementById('navbar');
  
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    
    // Close menu on link click
    mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
  
  // Scroll behavior for navbar
  if (navbar) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      lastScroll = scrollY;
    }, { passive: true });
  }

  // Auth: Logout buttons
  const logoutBtn = document.getElementById('nav-logout-btn');
  const mobileLogoutBtn = document.getElementById('nav-mobile-logout');
  const handleLogout = () => {
    logout();
    window.location.hash = '#/';
    if (typeof window._rpRouterReload === 'function') window._rpRouterReload();
  };
  logoutBtn?.addEventListener('click', handleLogout);
  mobileLogoutBtn?.addEventListener('click', handleLogout);
}

// ── Accordion Interactivity ──────────────────────
function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const wasActive = item.classList.contains('active');
      
      // Close all
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
      
      // Toggle clicked
      if (!wasActive) {
        item.classList.add('active');
      }
    });
  });
}

// ── Animate on Scroll (simple IntersectionObserver) ─
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

// ── Stat Counter Animation ───────────────────────
function initStatCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const start = performance.now();
        
        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        
        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(c => observer.observe(c));
}

// ── getWhatsApp helper (for pages that need dynamic WA number) ──
export function getWhatsApp() { return getSettings().whatsapp; }

// Export for use in other modules
export {
  WHATSAPP_NUMBER, SITE_NAME, ICONS,
  renderNavbar, renderFooter, renderWhatsAppFloat,
  renderCourseCard, renderResourceCard, renderArticleCard, renderShareButtons,
  formatDate, setPageMeta,
  initNavbar, initAccordions, initScrollAnimations, initStatCounters
};
