// ==============================================
// risePaisa — About Page (Premium UI Enhancement)
// ==============================================
import { ICONS, setPageMeta, getWhatsApp } from '../components.js';

export function renderAboutPage() {
  setPageMeta('About Us', 'risePaisa is Nepal\'s trusted financial education platform. Founded by Aakash Das, we\'re on a mission to improve financial literacy across Nepal.');

  return `
    <div class="about-hero" id="about-hero" style="background:var(--color-bg-alt);border-bottom:1px solid var(--color-border)">
      <div class="container">
        <div class="hero-badge" style="margin:0 auto var(--space-6)">🇳🇵 Our Story</div>
        <h1>About risePaisa</h1>
        <p>Building Nepal's most trusted financial education platform - one lesson at a time.</p>
      </div>
    </div>

    <!-- Story -->
    <section class="section" id="about-story">
      <div class="container container-narrow" style="max-width:800px">
        <div class="about-story-accent">
          <h2 class="about-section-heading">The risePaisa Story</h2>
          <div class="about-story-content">
            <p>
              risePaisa was built on a simple reality: people in Nepal are trying to improve their financial life, but they lack clear, reliable direction.
            </p>
            <p>
              The problem is not effort - it’s confusion. Scattered information, unclear advice, and no structured path make it difficult to make the right financial decisions.
            </p>
            <p>
              risePaisa brings clarity. We simplify how money works in Nepal and turn it into practical, step-by-step systems that help you earn better, manage smarter, and build real financial stability over time.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Subtle divider -->
    <div class="about-divider"><span></span></div>

    <!-- Mission & Vision -->
    <section class="section" id="about-mission" style="background:var(--color-bg-alt)">
      <div class="container">
        <div class="section-header">
          <h2 class="about-section-heading">Mission & Vision</h2>
        </div>
        <div class="about-mission">
          <div class="mission-card about-enhanced-card">
            <div class="mission-card__icon-wrap">
              <span class="mission-card__icon">${ICONS.target}</span>
            </div>
            <h3>Our Mission</h3>
            <p style="font-size:var(--text-lg)">
              To make financial knowledge in Nepal clear, practical, and accessible so every Nepali can make better money decisions, regardless of background or income.
            </p>
            <ul class="mission-checklist">
              <li>
                <span class="mission-check-icon">${ICONS.check}</span>
                Make financial education available in simple, accessible language
              </li>
              <li>
                <span class="mission-check-icon">${ICONS.check}</span>
                Focus 100% on Nepal's financial ecosystem
              </li>
              <li>
                <span class="mission-check-icon">${ICONS.check}</span>
                Enable confident, informed financial decisions
              </li>
            </ul>
          </div>
          <div class="mission-card about-enhanced-card">
            <div class="mission-card__icon-wrap">
              <span class="mission-card__icon">${ICONS.eye}</span>
            </div>
            <h3>Our Vision</h3>
            <p style="font-size:var(--text-lg)">
              To become Nepal’s most trusted financial education platform the standard for understanding, managing, and growing money.
            </p>
            <p style="margin-top:var(--space-4);font-size:var(--text-lg)">
              We aim to build a Nepal where financial literacy is a basic skill where every young person can manage money, understand taxes, and invest with clarity and confidence.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Subtle divider -->
    <div class="about-divider"><span></span></div>

    <!-- Founder -->
    <section class="section" id="about-founder">
      <div class="container">
        <div class="section-header">
          <h2 class="about-section-heading">Meet the Founder</h2>
        </div>
        <div class="founder-section about-founder-premium">
          <div class="founder-photo-wrap">
            <div class="founder-photo">
              <img src="assets/images/founder.png" alt="Aakash Das — Founder of risePaisa" loading="lazy">
            </div>
            <div class="founder-glow"></div>
          </div>
          <div class="founder-info">
            <div class="founder-name-row">
              <h3>Aakash Das</h3>
              <span class="founder-verified" title="Verified Founder">✓</span>
            </div>
            <p class="founder-title">Founder & Lead Instructor, risePaisa</p>
            <div class="founder-bio-highlight">
              <p>
                Aakash Das is building a new standard for financial education in Nepal. He is a financial educator building practical systems for real financial understanding. He founded risePaisa to address a critical gap the absence of clear, structured financial guidance tailored to Nepal.
              </p>
            </div>
            <p class="founder-details">
              His approach is direct: remove confusion, focus on what works in Nepal, and teach in a way that leads to real execution not just knowledge.
            </p>
            <div class="founder-actions">
              <a href="https://wa.me/${getWhatsApp()}" target="_blank" rel="noopener" class="btn btn-whatsapp founder-cta-btn">
                ${ICONS.whatsapp} Connect on WhatsApp
              </a>
              <a href="#/contact" class="btn btn-ghost founder-cta-ghost">
                ${ICONS.mail} Get in Touch
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section" style="background:var(--color-bg-alt)">
      <div class="container">
        <div class="cta-banner">
          <h2>Ready to Start Learning?</h2>
          <p>Join hundreds of Nepali youth who are taking control of their financial future with risePaisa.</p>
          <div style="display:flex;gap:var(--space-4);justify-content:center;flex-wrap:wrap">
            <a href="#/courses" class="btn btn-primary btn-lg">Explore Courses</a>
            <a href="#/blog" class="btn btn-secondary btn-lg">Read Free Articles</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initAboutPage() {
  // Scroll-triggered fade-in animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('about-animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.mission-card, .founder-section, .about-story-accent, .cta-banner').forEach(el => {
    el.classList.add('about-animate-target');
    observer.observe(el);
  });
}
