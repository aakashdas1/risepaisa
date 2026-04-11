// ==============================================
// risePaisa — Course Learning Interface
// Only accessible to logged-in users with access
// ==============================================
import { setPageMeta, ICONS } from '../components.js';
import { isLoggedIn, hasAccessToCourse, getCurrentUser } from '../auth/auth.js';
import { getAllCourses, getLessonsForCourse } from '../admin/store.js';
import { renderSecureVideo, initVideoProtection } from '../components/videoPlayer.js';

// ── State ────────────────────────────────────────
let _currentModuleIndex = 0;
let _currentLessonIndex = 0;

export function renderLearnPage(slug) {
  // Auth gate
  if (!isLoggedIn()) {
    setTimeout(() => { window.location.hash = '#/login'; }, 0);
    return `<div class="section" style="text-align:center;min-height:60vh;display:flex;align-items:center;justify-content:center">
      <p>Please log in to access course content.</p>
    </div>`;
  }

  if (!hasAccessToCourse(slug)) {
    setPageMeta('Access Denied', '');
    return `<div class="section" style="text-align:center;min-height:60vh;display:flex;align-items:center;justify-content:center">
      <div>
        <h1 style="font-size:var(--text-4xl);color:var(--color-accent);margin-bottom:var(--space-4)">🔒</h1>
        <h2 style="margin-bottom:var(--space-4)">Access Denied</h2>
        <p style="margin-bottom:var(--space-8);color:var(--color-text-secondary)">You don't have access to this course.</p>
        <a href="#/courses" class="btn btn-primary btn-lg">Browse My Courses</a>
      </div>
    </div>`;
  }

  const COURSES = getAllCourses();
  const course = COURSES.find(c => c.slug === slug);
  if (!course) {
    setPageMeta('Course Not Found', '');
    return `<div class="section" style="text-align:center;min-height:60vh;display:flex;align-items:center;justify-content:center">
      <div>
        <h2>Course Not Found</h2>
        <a href="#/courses" class="btn btn-primary" style="margin-top:var(--space-6)">Back to Courses</a>
      </div>
    </div>`;
  }

  setPageMeta(`Learning: ${course.title}`, course.shortDescription);

  // Get lesson content from store
  const lessonData = getLessonsForCourse(slug);
  const modules = _buildModules(course, lessonData);

  // Reset to first lesson
  _currentModuleIndex = 0;
  _currentLessonIndex = 0;

  const firstLesson = modules[0]?.lessons[0];
  const user = getCurrentUser();

  return `
    <div class="learn-layout" id="learn-layout" data-slug="${slug}">
      <!-- Sidebar -->
      <aside class="learn-sidebar" id="learn-sidebar">
        <div class="learn-sidebar-header">
          <a href="#/courses" class="learn-back-btn">${ICONS.chevronDown} Back</a>
          <h2 class="learn-sidebar-title">${course.title}</h2>
          <div class="learn-user-badge">
            <span class="learn-user-icon">👤</span>
            <span>${user?.name || user?.username || 'Student'}</span>
          </div>
        </div>
        <nav class="learn-modules" id="learn-modules">
          ${modules.map((mod, mi) => `
            <div class="learn-module ${mi === 0 ? 'active' : ''}" data-module="${mi}">
              <button class="learn-module-header" data-mod-toggle="${mi}">
                <span class="learn-module-title">${mod.title}</span>
                <span class="learn-module-meta">${mod.lessons.length} lessons</span>
                <span class="learn-module-chevron">${ICONS.chevronDown}</span>
              </button>
              <div class="learn-module-lessons">
                ${mod.lessons.map((lesson, li) => `
                  <button class="learn-lesson-btn ${mi === 0 && li === 0 ? 'active' : ''}"
                          data-module="${mi}" data-lesson="${li}">
                    <span class="learn-lesson-icon">▶</span>
                    <span class="learn-lesson-name">${lesson.title}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </nav>
      </aside>

      <!-- Mobile sidebar toggle -->
      <button class="learn-sidebar-toggle" id="learn-sidebar-toggle">
        <span>☰</span> Modules
      </button>

      <!-- Main content -->
      <main class="learn-content" id="learn-content">
        <div class="learn-video-area" id="learn-video-area">
          ${firstLesson?.youtubeUrl 
            ? renderSecureVideo(firstLesson.youtubeUrl, firstLesson.title)
            : `<div class="sv-container"><div class="sv-placeholder"><div class="sv-placeholder-icon">🎬</div><p>No video available for this lesson</p></div></div>`
          }
        </div>

        <div class="learn-lesson-info" id="learn-lesson-info">
          <h1 class="learn-lesson-title" id="learn-lesson-title">${firstLesson?.title || 'Welcome'}</h1>
          <div class="learn-lesson-desc" id="learn-lesson-desc">
            ${firstLesson?.description 
              ? `<p>${firstLesson.description}</p>` 
              : '<p style="color:var(--color-text-muted)">No description available for this lesson.</p>'
            }
          </div>
        </div>

        <div class="learn-nav-bar" id="learn-nav-bar">
          <button class="btn btn-ghost learn-nav-prev" id="learn-prev" disabled>← Previous</button>
          <span class="learn-nav-progress" id="learn-progress">Lesson 1 of ${_countTotal(modules)}</span>
          <button class="btn btn-primary learn-nav-next" id="learn-next">Next →</button>
        </div>
      </main>
    </div>
  `;
}

export function initLearnPage() {
  const layout = document.getElementById('learn-layout');
  if (!layout) return;

  const slug = layout.dataset.slug;
  const COURSES = getAllCourses();
  const course = COURSES.find(c => c.slug === slug);
  if (!course) return;

  const lessonData = getLessonsForCourse(slug);
  const modules = _buildModules(course, lessonData);

  // Module accordion toggle
  document.querySelectorAll('[data-mod-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const mi = parseInt(btn.dataset.modToggle);
      const modEl = btn.closest('.learn-module');
      modEl.classList.toggle('active');
    });
  });

  // Lesson click
  document.querySelectorAll('.learn-lesson-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mi = parseInt(btn.dataset.module);
      const li = parseInt(btn.dataset.lesson);
      _navigateToLesson(modules, mi, li);
    });
  });

  // Prev / Next
  document.getElementById('learn-prev')?.addEventListener('click', () => {
    const [mi, li] = _getPrevLesson(modules, _currentModuleIndex, _currentLessonIndex);
    if (mi !== null) _navigateToLesson(modules, mi, li);
  });

  document.getElementById('learn-next')?.addEventListener('click', () => {
    const [mi, li] = _getNextLesson(modules, _currentModuleIndex, _currentLessonIndex);
    if (mi !== null) _navigateToLesson(modules, mi, li);
  });

  // Mobile sidebar toggle
  const sidebarEl = document.getElementById('learn-sidebar');
  const toggleBtn = document.getElementById('learn-sidebar-toggle');

  toggleBtn?.addEventListener('click', () => {
    sidebarEl?.classList.toggle('mobile-open');
  });

  // Close sidebar when clicking a lesson on mobile
  sidebarEl?.querySelectorAll('.learn-lesson-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebarEl?.classList.remove('mobile-open');
      }
    });
  });

  // Close sidebar on window click outside (mobile backdrop)
  document.addEventListener('click', (e) => {
    if (sidebarEl?.classList.contains('mobile-open') && 
        !sidebarEl.contains(e.target) && 
        e.target !== toggleBtn) {
      sidebarEl.classList.remove('mobile-open');
    }
  });

  // Init video protection
  initVideoProtection();
}

// ── Build modules from course data + lesson data ─
function _buildModules(course, lessonData) {
  if (!course.curriculum) return [];

  return course.curriculum.map((mod, mi) => {
    const storedModule = lessonData?.[mi];
    return {
      title: mod.title,
      lessons: (mod.lessons || []).map((lessonTitle, li) => {
        const storedLesson = storedModule?.lessons?.[li];
        return {
          title: lessonTitle,
          description: storedLesson?.description || '',
          youtubeUrl: storedLesson?.youtubeUrl || '',
        };
      })
    };
  });
}

// ── Navigate to lesson ──────────────────────────
function _navigateToLesson(modules, mi, li) {
  _currentModuleIndex = mi;
  _currentLessonIndex = li;
  const lesson = modules[mi]?.lessons[li];
  if (!lesson) return;

  // Update video
  const videoArea = document.getElementById('learn-video-area');
  if (videoArea) {
    videoArea.innerHTML = lesson.youtubeUrl
      ? renderSecureVideo(lesson.youtubeUrl, lesson.title)
      : `<div class="sv-container"><div class="sv-placeholder"><div class="sv-placeholder-icon">🎬</div><p>No video available for this lesson</p></div></div>`;
    initVideoProtection();
  }

  // Update lesson info
  const titleEl = document.getElementById('learn-lesson-title');
  const descEl = document.getElementById('learn-lesson-desc');
  if (titleEl) titleEl.textContent = lesson.title;
  if (descEl) descEl.innerHTML = lesson.description
    ? `<p>${lesson.description}</p>`
    : '<p style="color:var(--color-text-muted)">No description available for this lesson.</p>';

  // Update active lesson button
  document.querySelectorAll('.learn-lesson-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`.learn-lesson-btn[data-module="${mi}"][data-lesson="${li}"]`);
  activeBtn?.classList.add('active');

  // Open parent module
  document.querySelectorAll('.learn-module').forEach(m => m.classList.remove('active'));
  activeBtn?.closest('.learn-module')?.classList.add('active');

  // Update nav buttons
  const [prevMi] = _getPrevLesson(modules, mi, li);
  const [nextMi] = _getNextLesson(modules, mi, li);
  const prevBtn = document.getElementById('learn-prev');
  const nextBtn = document.getElementById('learn-next');
  if (prevBtn) prevBtn.disabled = prevMi === null;
  if (nextBtn) nextBtn.disabled = nextMi === null;

  // Update progress
  const progressEl = document.getElementById('learn-progress');
  if (progressEl) {
    const current = _getLessonNumber(modules, mi, li);
    const total = _countTotal(modules);
    progressEl.textContent = `Lesson ${current} of ${total}`;
  }

  // Close mobile sidebar
  document.getElementById('learn-sidebar')?.classList.remove('mobile-open');

  // Scroll to top of content
  document.getElementById('learn-content')?.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Navigation helpers ──────────────────────────
function _getPrevLesson(modules, mi, li) {
  if (li > 0) return [mi, li - 1];
  for (let m = mi - 1; m >= 0; m--) {
    if (modules[m].lessons.length > 0) {
      return [m, modules[m].lessons.length - 1];
    }
  }
  return [null, null];
}

function _getNextLesson(modules, mi, li) {
  if (li < modules[mi].lessons.length - 1) return [mi, li + 1];
  for (let m = mi + 1; m < modules.length; m++) {
    if (modules[m].lessons.length > 0) {
      return [m, 0];
    }
  }
  return [null, null];
}

function _countTotal(modules) {
  return modules.reduce((sum, m) => sum + m.lessons.length, 0);
}

function _getLessonNumber(modules, mi, li) {
  let n = 0;
  for (let m = 0; m < mi; m++) n += modules[m].lessons.length;
  return n + li + 1;
}
