// ==============================================
// risePaisa — Blog Listing Page
// ==============================================
import { getArticles } from '../admin/store.js';
import { ICONS, renderArticleCard, setPageMeta } from '../components.js';

export function renderBlogPage(queryParams) {
  setPageMeta('Blog & Articles', 'Free finance articles about NEPSE, personal finance, taxation, and fintech — all written for Nepal.');

  const categories = [
    { slug: 'all', label: 'All Articles' },
    { slug: 'nepse', label: 'NEPSE & Investing' },
    { slug: 'personal-finance', label: 'Personal Finance' },
    { slug: 'taxation', label: 'Taxation' },
    { slug: 'fintech', label: 'Fintech' },
  ];

  const activeCat = queryParams?.get('cat') || 'all';

  return `
    <div class="page-header" id="blog-header">
      <div class="container">
        <h1>Blog & Articles</h1>
        <p>Free financial knowledge for every Nepali. Read, learn, grow.</p>
      </div>
    </div>
    <section class="section" id="blog-listing">
      <div class="container">
        <div class="search-bar">
          <span class="search-icon">${ICONS.search}</span>
          <input type="text" class="form-input" id="blog-search" placeholder="Search articles..." style="padding-left:var(--space-10)">
        </div>
        <div class="filter-tabs" id="blog-filters">
          ${categories.map(cat => `
            <button class="filter-tab ${cat.slug === activeCat ? 'active' : ''}" data-category="${cat.slug}">${cat.label}</button>
          `).join('')}
        </div>
        <div class="grid-3" id="blog-grid">
          ${filterArticles(activeCat, '').map(a => renderArticleCard(a)).join('')}
        </div>
        <div id="no-results" style="display:none;text-align:center;padding:var(--space-12)">
          <p style="font-size:var(--text-lg);color:var(--color-text-muted)">No articles found. Try a different search or category.</p>
        </div>
      </div>
    </section>
  `;
}

function filterArticles(categorySlug, searchQuery = '') {
  let filtered = getArticles();
  if (categorySlug && categorySlug !== 'all') {
    filtered = filtered.filter(a => a.categorySlug === categorySlug);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    );
  }
  return filtered;
}

export function initBlogPage() {
  const filters = document.querySelectorAll('#blog-filters .filter-tab');
  const grid = document.getElementById('blog-grid');
  const searchInput = document.getElementById('blog-search');
  const noResults = document.getElementById('no-results');
  let currentCat = 'all';

  function updateGrid() {
    const search = searchInput?.value || '';
    const articles = filterArticles(currentCat, search);
    
    if (articles.length === 0) {
      grid.style.display = 'none';
      noResults.style.display = 'block';
    } else {
      grid.style.display = '';
      noResults.style.display = 'none';
      grid.innerHTML = articles.map(a => renderArticleCard(a)).join('');
      grid.querySelectorAll('.card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.animation = `fadeInUp 0.4s ease forwards ${i * 80}ms`;
      });
    }
  }

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCat = btn.dataset.category;
      updateGrid();
    });
  });

  if (searchInput) {
    let timeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(timeout);
      timeout = setTimeout(updateGrid, 250);
    });
  }
}
