// ==============================================
// risePaisa — Resources Page (Clone of Courses)
// ==============================================
import { getResources } from '../admin/store.js';
import { renderResourceCard, setPageMeta } from '../components.js';

export function renderResourcesPage() {
  setPageMeta('Resources', 'Browse premium templates, tools, and systems for financial growth — Notion trackers, budget planners, and more designed for Nepal.');

  const RESOURCES = getResources();
  const categories = ['All', ...new Set(RESOURCES.map(r => r.category))];

  return `
    <div class="page-header" id="resources-header">
      <div class="container">
        <h1>Resources</h1>
        <p>Templates, tools, and systems for financial growth.</p>
      </div>
    </div>
    <section class="section" id="resources-listing">
      <div class="container">
        <div class="filter-tabs" id="resource-filters">
          ${categories.map((cat, i) => `
            <button class="filter-tab ${i === 0 ? 'active' : ''}" data-category="${cat}">${cat}</button>
          `).join('')}
        </div>
        <div class="grid-2" id="resources-grid" style="max-width:860px;margin:0 auto">
          ${RESOURCES.map(r => renderResourceCard(r)).join('')}
        </div>
      </div>
    </section>
  `;
}

export function initResourcesPage() {
  const RESOURCES = getResources();
  const filters = document.querySelectorAll('#resource-filters .filter-tab');
  const grid = document.getElementById('resources-grid');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.category;
      const filtered = cat === 'All' ? RESOURCES : RESOURCES.filter(r => r.category === cat);

      grid.innerHTML = filtered.map(r => renderResourceCard(r)).join('');
      // Re-animate
      grid.querySelectorAll('.card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.animation = `fadeInUp 0.4s ease forwards ${i * 80}ms`;
      });
    });
  });
}
