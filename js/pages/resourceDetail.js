// ==============================================
// risePaisa — Resource Detail Page (Clone of Course Detail)
// ==============================================
import { getResources, getSettings } from '../admin/store.js';
import { ICONS, setPageMeta, initAccordions } from '../components.js';

export function renderResourceDetailPage(slug) {
  const RESOURCES = getResources();
  const resource = RESOURCES.find(r => r.slug === slug);
  if (!resource) {
    setPageMeta('Resource Not Found', '');
    return `<div class="section"><div class="container" style="text-align:center"><h1>Resource Not Found</h1><p>Sorry, we couldn't find that resource.</p><a href="#/resources" class="btn btn-primary" style="margin-top:var(--space-6)">Browse Resources</a></div></div>`;
  }

  setPageMeta(resource.title, resource.shortDescription);
  const WHATSAPP_NUMBER = getSettings().whatsapp;
  const waLink    = `https://wa.me/${WHATSAPP_NUMBER}?text=I want to buy the resource: ${encodeURIComponent(resource.title)}`;
  const waAskLink = `https://wa.me/${WHATSAPP_NUMBER}?text=I have a question about the resource: ${encodeURIComponent(resource.title)}`;

  const thumbMap = {
    1: 'assets/images/resource-notion.png',
    2: 'assets/images/resource-budget.png',
  };

  // Calculate content stats
  const totalItems = resource.whatsIncluded.length;
  const totalLearnItems = resource.whatYouLearn.length;

  // Anchor price (original price before discount)
  const anchorPrice = Math.round(resource.price * 2);

  // Parse target audience into bullet points
  const audiencePoints = resource.targetAudience
    .split(/,\s*(?:and\s+)?|;\s*/)
    .map(s => s.trim().replace(/^and\s+/i, ''))
    .filter(s => s.length > 0);

  // Parse fullDescription into paragraphs
  const descParagraphs = resource.fullDescription.split('\n').filter(p => p.trim());

  return `
    <!-- Hero -->
    <div class="cd-hero" id="resource-hero">
      <div class="container">
        <div class="cd-breadcrumb">
          <a href="#/">Home</a><span class="cd-sep">/</span>
          <a href="#/resources">Resources</a><span class="cd-sep">/</span>
          <span>${resource.title}</span>
        </div>
        <h1 class="cd-title">${resource.title}</h1>
        <div class="cd-instructor">
          <div class="cd-avatar">A</div>
          <span>Creator: <strong>${resource.creator}</strong></span>
        </div>
        <span class="cd-category-tag">${resource.category}</span>
      </div>
    </div>

    <!-- Body -->
    <div class="cd-body">
      <div class="container">
        <div class="cd-grid">
          <!-- LEFT: Main Content -->
          <div class="cd-main">

            <!-- Preview -->
            <section class="cd-section" id="resource-preview">
              <h2 class="cd-section-title">Preview</h2>
              <div class="cd-video-wrap">
                ${resource.previewVideoUrl
                  ? `<iframe src="${resource.previewVideoUrl}" frameborder="0" allowfullscreen loading="lazy"></iframe>`
                  : `<div class="cd-video-placeholder" style="background-image:url(${thumbMap[resource.id] || thumbMap[1]})">
                      <div class="cd-play-btn">${ICONS.play}</div>
                      <span class="cd-preview-label">Preview coming soon</span>
                    </div>`
                }
              </div>
              ${resource.imageUrl ? `
              <div class="cd-image-preview">
                <img src="${resource.imageUrl}" alt="${resource.title} preview" loading="lazy">
              </div>
              ` : ''}
              <div class="cd-meta-bar">
                <div class="cd-meta-item">
                  <span class="cd-meta-icon">${ICONS.bookOpen}</span>
                  <span>${totalItems} items included</span>
                </div>
                <div class="cd-meta-item">
                  <span class="cd-meta-icon">${ICONS.users}</span>
                  <span>Beginner</span>
                </div>
              </div>
            </section>

            <!-- About -->
            <section class="cd-section" id="resource-description">
              <h2 class="cd-section-title">About This Resource</h2>
              <div class="cd-about-text">
                ${descParagraphs.map(p => `<p>${p.trim()}</p>`).join('')}
              </div>
            </section>

            <!-- What You'll Learn -->
            <section class="cd-section" id="resource-outcomes">
              <h2 class="cd-section-title">What You'll Learn</h2>
              <div class="cd-learn-grid">
                ${resource.whatYouLearn.map(item => `
                  <div class="cd-learn-item">
                    <span class="cd-bullet-dot"></span>
                    <span>${item}</span>
                  </div>
                `).join('')}
              </div>
            </section>

            <!-- What's Included (single section, no modules) -->
            <section class="cd-section" id="resource-content">
              <h2 class="cd-section-title">What's Included</h2>
              <p class="cd-curriculum-summary">${totalItems} items · Instant digital delivery</p>
              <div class="cd-accordion">
                <div class="accordion-item active">
                  <button class="accordion-header">
                    <div class="cd-acc-left">
                      <span class="cd-acc-title">Included in this resource</span>
                      <span class="cd-acc-meta">${totalItems} items</span>
                    </div>
                    <span class="chevron">${ICONS.chevronDown}</span>
                  </button>
                  <div class="accordion-content">
                    <div class="accordion-body">
                      <ul>
                        ${resource.whatsIncluded.map(item => `<li>${item}</li>`).join('')}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Who Is This For -->
            <section class="cd-section" id="resource-audience">
              <h2 class="cd-section-title">Who Is This For?</h2>
              <ul class="cd-audience-list">
                ${audiencePoints.map(point => `
                  <li class="cd-audience-item">
                    <span class="cd-bullet-dot"></span>
                    <span>${point.charAt(0).toUpperCase() + point.slice(1)}</span>
                  </li>
                `).join('')}
              </ul>
            </section>

          </div>

          <!-- RIGHT: Sticky Pricing Card -->
          <div class="cd-sidebar">
            <div class="cd-pricing-card" id="resource-pricing-card">
              <img src="${thumbMap[resource.id] || thumbMap[1]}" alt="${resource.title}" class="cd-pricing-thumb" loading="lazy">

              <div class="cd-price-block">
                <span class="cd-price-anchor">NPR ${anchorPrice.toLocaleString()}</span>
                <span class="cd-price-current"><span class="cd-price-currency">NPR </span>${resource.price.toLocaleString()}</span>
                <span class="cd-discount-badge">50% OFF</span>
              </div>

              <div class="cd-price-labels">
                <span class="cd-label-item">Instant delivery</span>
                <span class="cd-label-item">Lifetime access</span>
                <span class="cd-label-item">Mobile + Desktop</span>
                <span class="cd-label-item">Free updates</span>
              </div>

              <a href="${waLink}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-lg cd-cta-primary" id="buy-whatsapp-btn">
                ${ICONS.whatsapp} Buy Now via WhatsApp
              </a>
              <a href="${waAskLink}" target="_blank" rel="noopener" class="btn btn-ghost btn-lg cd-cta-secondary">
                ${ICONS.mail} Ask a Question
              </a>

              <div class="cd-trust-signals">
                <div class="cd-trust-item">
                  <span class="cd-trust-dot"></span>
                  <span>One-time payment</span>
                </div>
                <div class="cd-trust-item">
                  <span class="cd-trust-dot"></span>
                  <span>Instant access</span>
                </div>
                <div class="cd-trust-item">
                  <span class="cd-trust-dot"></span>
                  <span>No prior experience needed</span>
                </div>
              </div>

              <div class="cd-features-list">
                <div class="cd-feature-item">
                  <span class="cd-bullet-dot"></span>
                  <span>Full lifetime access</span>
                </div>
                <div class="cd-feature-item">
                  <span class="cd-bullet-dot"></span>
                  <span>Access on mobile and desktop</span>
                </div>
                <div class="cd-feature-item">
                  <span class="cd-bullet-dot"></span>
                  <span>Free future updates</span>
                </div>
                <div class="cd-feature-item">
                  <span class="cd-bullet-dot"></span>
                  <span>Direct support from creator</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Sticky CTA -->
    <div class="cd-mobile-cta" id="resource-mobile-cta">
      <div class="cd-mobile-cta-inner">
        <div class="cd-mobile-price">
          <span class="cd-mobile-anchor">NPR ${anchorPrice.toLocaleString()}</span>
          <span class="cd-mobile-current">NPR ${resource.price.toLocaleString()}</span>
        </div>
        <a href="${waLink}" target="_blank" rel="noopener" class="btn btn-whatsapp cd-mobile-buy">
          ${ICONS.whatsapp} Buy Now
        </a>
      </div>
    </div>
  `;
}

export function initResourceDetailPage() {
  initAccordions();

  // Mobile sticky CTA: show/hide based on scroll
  const mobileCta = document.getElementById('resource-mobile-cta');
  const pricingCard = document.getElementById('resource-pricing-card');
  if (mobileCta && pricingCard) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        mobileCta.classList.toggle('visible', !entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(pricingCard);
  }
}
