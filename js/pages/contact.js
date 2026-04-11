// ==============================================
// risePaisa — Contact Page (Dual Contact Section)
// Dynamic links from Admin → Settings → Contact Links
// ==============================================
import { ICONS, setPageMeta } from '../components.js';
import { getSettings } from '../admin/store.js';

// ── LinkedIn icon (not in shared ICONS) ──────────
const ICON_LINKEDIN = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;

// ── Verified check badge icon ────────────────────
const ICON_VERIFIED_BADGE = `<svg viewBox="0 0 22 22" fill="none" class="contact-verified-badge"><circle cx="11" cy="11" r="11" fill="var(--color-accent)"/><path d="M6.5 11.5L9.5 14.5L15.5 8.5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// ── External link icon ───────────────────────────
const ICON_EXTERNAL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;

// ── Platform definitions (icon + display label + description fallback) ──
const PLATFORM_DEFS = {
  tiktok:    { icon: ICONS.tiktok,    label: 'TikTok' },
  instagram: { icon: ICONS.instagram, label: 'Instagram' },
  facebook:  { icon: ICONS.facebook,  label: 'Facebook' },
  youtube:   { icon: ICONS.youtube,   label: 'YouTube' },
  twitter:   { icon: ICONS.twitter,   label: 'X' },
  linkedin:  { icon: ICON_LINKEDIN,   label: 'LinkedIn' },
};

const RISEPAISA_DESCRIPTIONS = {
  tiktok:    'Daily 60-sec finance truths for Nepal',
  instagram: 'Finance visuals, carousels & case studies',
  facebook:  'Live sessions on tax, FD, stocks & mutual funds',
  youtube:   'In-depth finance breakdowns (Nepal focused)',
  twitter:   "Sharp takes on Nepal's financial system",
  linkedin:  'Nepal-focused financial literacy advocacy',
};

const AAKASH_DESCRIPTIONS = {
  tiktok:    'Life beyond finance tips',
  instagram: 'Daily life, travel & BTS',
  facebook:  'Personal updates & community',
  youtube:   'Vlogs, lifestyle & uncensored thoughts',
  twitter:   'Unfiltered personal takes',
  linkedin:  'Professional journey & milestones',
};

// ── Build social array from stored links ─────────
function _buildSocials(links, ownerName, descriptions) {
  if (!links) return [];
  const result = [];
  for (const [key, def] of Object.entries(PLATFORM_DEFS)) {
    const url = links[key];
    // Skip if empty or just '#'
    if (!url || url === '#' || url.trim() === '') continue;
    result.push({
      platform: def.label,
      icon: def.icon,
      title: ownerName,
      desc: descriptions[key] || '',
      url: url.trim(),
    });
  }
  return result;
}

// ── Social card renderer ─────────────────────────
function renderSocialCard(social) {
  return `
    <a href="${social.url}" target="_blank" rel="noopener" class="social-link-card" id="social-${social.platform.toLowerCase()}-${social.title.replace(/\s+/g, '-').toLowerCase()}">
      <div class="social-link-card__icon">${social.icon}</div>
      <div class="social-link-card__info">
        <div class="social-link-card__title">${social.title}</div>
        <div class="social-link-card__desc">${social.desc}</div>
      </div>
      <div class="social-link-card__arrow">${ICON_EXTERNAL}</div>
    </a>
  `;
}

// ── Contact block renderer ───────────────────────
function renderContactBlock(name, description, imgSrc, socials) {
  if (socials.length === 0) return ''; // Hide entire block if no links
  return `
    <div class="contact-block">
      <div class="contact-block__header">
        <div class="contact-block__avatar">
          <img src="${imgSrc}" alt="${name}" loading="lazy">
        </div>
        <div class="contact-block__name-row">
          <h3 class="contact-block__name">${name} ${ICON_VERIFIED_BADGE}</h3>
        </div>
        <p class="contact-block__desc">${description}</p>
      </div>
      <div class="contact-block__socials">
        ${socials.map(s => renderSocialCard(s)).join('')}
      </div>
    </div>
  `;
}

// ── Page render ──────────────────────────────────
export function renderContactPage() {
  setPageMeta('Contact Us', 'Connect with risePaisa for financial education or reach out to Aakash Das personally.');

  const settings = getSettings();
  const cl = settings.contactLinks || {};

  const risePaisaSocials = _buildSocials(cl.risepaisa, 'risePaisa', RISEPAISA_DESCRIPTIONS);
  const aakashSocials    = _buildSocials(cl.aakash,    'Aakash Das', AAKASH_DESCRIPTIONS);

  return `
    <div class="page-header" id="contact-header">
      <div class="container">
        <h1>Connect With Us</h1>
        <p>Choose how you want to connect — brand insights or personal journey.</p>
      </div>
    </div>
    <section class="section" id="contact-section">
      <div class="container">
        <div class="contact-dual-grid">
          ${renderContactBlock(
            'risePaisa',
            'Daily finance education and deep insights for Nepal.',
            'assets/images/risepaisa.jpg',
            risePaisaSocials
          )}
          ${renderContactBlock(
            'Aakash Das',
            'Life, business, and behind-the-scenes beyond finance.',
            'assets/images/founder.png',
            aakashSocials
          )}
        </div>
        ${risePaisaSocials.length === 0 && aakashSocials.length === 0 ? `
          <div style="text-align:center;padding:48px 0;color:var(--color-text-muted)">
            <p style="font-size:1.1rem;margin-bottom:8px">No contact links configured yet.</p>
            <p style="font-size:0.9rem">Manage links from Admin Panel → Settings → Contact Links.</p>
          </div>
        ` : ''}
      </div>
    </section>
  `;
}

// ── Page init ────────────────────────────────────
export function initContactPage() {
  // No special interactivity needed
}
