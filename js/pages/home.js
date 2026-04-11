// ==============================================
// risePaisa — Home Page
// ==============================================
import { getCourses, getResources, getArticles } from '../admin/store.js';
import { ICONS, renderCourseCard, renderResourceCard, renderArticleCard, setPageMeta, initStatCounters, getWhatsApp } from '../components.js';

export function renderHomePage() {
  setPageMeta(null, 'Learn personal finance, stock market investing, taxation, and fintech in Nepal. Join thousands of Nepali youth building financial literacy with risePaisa.');

  const COURSES = getCourses();
  const RESOURCES = getResources();
  const ARTICLES = getArticles();

  const featuredCourses = COURSES.slice(0, 2);
  const featuredResources = RESOURCES.slice(0, 2);
  const latestArticles = ARTICLES.slice(0, 3);

  return `
    <!-- Hero Section -->
    <section class="hero" id="hero-section">
      <div class="hero-bg"></div>
      <div class="hero-grid-pattern"></div>
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge animate-fade-in" style="animation-delay:0ms">
            🇳🇵 नेपालमै आधारित वित्तीय शिक्षा
          </div>
          <h1 class="animate-fade-in-up" style="animation-delay:100ms">
            risePaisa – Hamro Nepal, Hamro Arthik Uday<br><span class="accent">Rise with risePaisa.</span>
          </h1>
          <p class="hero-subtitle animate-fade-in-up" style="animation-delay:200ms">
            Nepal's most practical financial education platform. Practical NEPSE, taxation, and personal finance strategies built for real income growth in Nepal.
          </p>
          <div class="hero-actions animate-fade-in-up" style="animation-delay:300ms">
            <a href="#/courses" class="btn btn-primary btn-lg">
              Explore Courses ${ICONS.arrowRight}
            </a>
            <a href="#/blog" class="btn btn-secondary btn-lg">
              Read Articles
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Trust Bar / Stats -->
    <section class="trust-bar" id="trust-section">
      <div class="container">
        <div class="trust-nepali">real finance for Nepal - trusted by Nepali youth 🇳🇵</div>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number" data-count="500" data-suffix="+">0</div>
            <div class="stat-label">Students Enrolled</div>
          </div>
          <div class="stat-item">
            <div class="stat-number" data-count="10000" data-suffix="+">0</div>
            <div class="stat-label">Content Views</div>
          </div>
          <div class="stat-item">
            <div class="stat-number" data-count="25" data-suffix="+">0</div>
            <div class="stat-label">Articles Published</div>
          </div>
          <div class="stat-item">
            <div class="stat-number" data-count="1" data-suffix="">0</div>
            <div class="stat-label">Expert Courses</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Courses -->
    <section class="section" id="featured-courses">
      <div class="container">
        <div class="section-header">
          <h2>Featured Courses</h2>
          <p>Build financial control and wealth with step-by-step systems built for Nepal.</p>
        </div>
        <div class="grid-2 stagger-children" style="max-width:860px;margin:0 auto">
          ${featuredCourses.map(c => renderCourseCard(c)).join('')}
        </div>
        <div style="text-align:center;margin-top:var(--space-8)">
          <a href="#/courses" class="btn btn-secondary btn-lg">View All Courses ${ICONS.arrowRight}</a>
        </div>
      </div>
    </section>

    <!-- Resources -->
    <section class="section" id="featured-resources" style="background:var(--color-bg-alt)">
      <div class="container">
        <div class="section-header">
          <h2>Resources</h2>
          <p>Templates, tools, and systems for financial growth.</p>
        </div>
        <div class="grid-2 stagger-children" style="max-width:860px;margin:0 auto">
          ${featuredResources.map(r => renderResourceCard(r)).join('')}
        </div>
        <div style="text-align:center;margin-top:var(--space-8)">
          <a href="#/resources" class="btn btn-secondary btn-lg">Explore Resources ${ICONS.arrowRight}</a>
        </div>
      </div>
    </section>


    <!-- Latest Articles -->
    <section class="section" id="latest-articles">
      <div class="container">
        <div class="section-header">
          <h2>Latest Articles</h2>
          <p>Free, in-depth finance articles written for the Nepali context.</p>
        </div>
        <div class="grid-3 stagger-children">
          ${latestArticles.map(a => renderArticleCard(a)).join('')}
        </div>
        <div style="text-align:center;margin-top:var(--space-8)">
          <a href="#/blog" class="btn btn-secondary btn-lg">Read All Articles ${ICONS.arrowRight}</a>
        </div>
      </div>
    </section>

    <!-- About Teaser -->
    <section class="section" id="about-teaser-section" style="background:var(--color-bg-alt)">
      <div class="container">
        <div class="about-teaser">
          <div class="about-teaser-img">
            <img src="assets/images/founder.png" alt="Aakash Das — Founder of risePaisa" loading="lazy">
          </div>
          <div>
            <h2>Why risePaisa?</h2>
            <p style="font-size:var(--text-lg);margin-bottom:var(--space-4)">
              Most financial advice doesn’t work in Nepal. Different rules, different systems, different reality.
            </p>
            <p>
             risePaisa fixes that. Founded by Aakash Das, it gives Nepali youth clear, practical knowledge to earn, manage, and invest money the right way - based on how Nepal actually works.
            </p>
            <a href="#/about" class="btn btn-secondary" style="margin-top:var(--space-6)">Learn More About Us ${ICONS.arrowRight}</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="section" id="final-cta">
      <div class="container">
        <div class="cta-banner">
          <h2>Start Your Financial Journey Today</h2>
          <p>Join hundreds of Nepali youth who are taking control of their financial future with risePaisa.</p>
          <div style="display:flex;gap:var(--space-4);justify-content:center;flex-wrap:wrap">
            <a href="#/courses" class="btn btn-primary btn-lg">Explore Courses</a>
            <a href="https://wa.me/${getWhatsApp()}?text=${encodeURIComponent('I want to contact you.')}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-lg">
              ${ICONS.whatsapp} Chat with Us
            </a>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initHomePage() {
  initStatCounters();
}
