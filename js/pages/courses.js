// ==============================================
// risePaisa — Courses Page (Auth-Aware)
// ==============================================
import { getCourses } from '../admin/store.js';
import { renderCourseCard, setPageMeta } from '../components.js';
import { isLoggedIn, getUserCourses } from '../auth/auth.js';

export function renderCoursesPage() {
  setPageMeta('Courses', 'Browse our Nepal-focused finance courses — NEPSE stock market basics and personal finance masterclass, designed for Nepali youth.');

  const allCourses = getCourses();
  const loggedIn = isLoggedIn();
  const assignedSlugs = getUserCourses();

  // If logged in, show ONLY assigned courses
  const COURSES = loggedIn
    ? allCourses.filter(c => assignedSlugs.includes(c.slug))
    : allCourses;

  const categories = ['All', ...new Set(COURSES.map(c => c.category))];

  const headerSubtext = loggedIn
    ? `<span class="courses-enrolled-badge">📚 Showing your enrolled courses (${COURSES.length})</span>`
    : '';

  return `
    <div class="page-header" id="courses-header">
      <div class="container">
        <h1>${loggedIn ? 'My Courses' : 'Our Courses'}</h1>
        <p>${loggedIn ? 'Access your purchased courses below.' : 'Practical financial education designed for Nepal. Learn at your own pace.'}</p>
        ${headerSubtext}
      </div>
    </div>
    <section class="section" id="courses-listing">
      <div class="container">
        ${!loggedIn && categories.length > 1 ? `
          <div class="filter-tabs" id="course-filters">
            ${categories.map((cat, i) => `
              <button class="filter-tab ${i === 0 ? 'active' : ''}" data-category="${cat}">${cat}</button>
            `).join('')}
          </div>
        ` : ''}
        <div class="grid-2" id="courses-grid" style="max-width:860px;margin:0 auto">
          ${COURSES.length > 0
            ? COURSES.map(c => renderCourseCard(c, loggedIn)).join('')
            : loggedIn
              ? `<div style="text-align:center;padding:var(--space-12);color:var(--color-text-muted);grid-column:1/-1">
                   <p style="font-size:var(--text-lg);margin-bottom:var(--space-4)">No courses assigned yet.</p>
                   <p>Contact admin to get access to courses.</p>
                 </div>`
              : ''
          }
        </div>
      </div>
    </section>
  `;
}

export function initCoursesPage() {
  const allCourses = getCourses();
  const loggedIn = isLoggedIn();
  const assignedSlugs = getUserCourses();
  const COURSES = loggedIn
    ? allCourses.filter(c => assignedSlugs.includes(c.slug))
    : allCourses;

  const filters = document.querySelectorAll('#course-filters .filter-tab');
  const grid = document.getElementById('courses-grid');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.category;
      const filtered = cat === 'All' ? COURSES : COURSES.filter(c => c.category === cat);

      grid.innerHTML = filtered.map(c => renderCourseCard(c, loggedIn)).join('');
      // Re-animate
      grid.querySelectorAll('.card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.animation = `fadeInUp 0.4s ease forwards ${i * 80}ms`;
      });
    });
  });
}
