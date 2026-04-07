// ==============================================
// risePaisa — Hidden Admin CMS Panel (v2)
// Access: tiny trigger at footer · Code required
// Extended: User management, lesson management, password change
// ==============================================
import {
  getCourses, getResources, getArticles, getSettings,
  setCourses, setResources, setArticles, setSettings,
  getUsers, setUsers, getAdminPasswordHash, setAdminPasswordHash,
  getCourseLessons, setCourseLessons, getLessonsForCourse, setLessonsForCourse
} from './store.js';
import { hashPassword } from '../auth/auth.js';

// ── YouTube URL → Embed URL converter (for admin save) ──
function _toYouTubeEmbed(url) {
  if (!url || typeof url !== 'string') return null;
  url = url.trim();
  if (!url) return null;
  let videoId = null;
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return `https://www.youtube.com/embed/${embedMatch[1]}`;
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) videoId = watchMatch[1];
  if (!videoId) { const m = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/); if (m) videoId = m[1]; }
  if (!videoId) { const m = url.match(/youtube\.com\/v\/([a-zA-Z0-9_-]{11})/); if (m) videoId = m[1]; }
  if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  return null;
}

// ── Secret verification (XOR legacy + SHA-256) ──
// Legacy Code: rike@2026
const _E = [32,72,44,107,28,35,116,45,26];
const _X = [82,33,71,14,92,17,68,31,44];
function _verifyLegacy(s) {
  return s.length === _E.length && [...s].every((c, i) => (c.charCodeAt(0) ^ _X[i]) === _E[i]);
}
async function _verify(s) {
  const storedHash = getAdminPasswordHash();
  if (storedHash) {
    const inputHash = await hashPassword(s);
    return inputHash === storedHash;
  }
  return _verifyLegacy(s);
}

// ── State ─────────────────────────────────────────────
let _activeSection = 'dashboard';
let _editMode = null;   // null | 'add' | 'edit'
let _editIndex = null;  // index of item being edited
let _editData  = null;  // current form data

// ── Toast ─────────────────────────────────────────────
function _toast(msg, type = 'success') {
  let el = document.getElementById('rp-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'rp-toast';
    document.body.appendChild(el);
  }
  el.innerHTML = `<span class="rp-toast-icon">${type === 'error' ? '⚠️' : '✅'}</span> ${msg}`;
  el.className = `show${type === 'error' ? ' error' : ''}`;
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.className = type === 'error' ? 'error' : ''; }, 3000);
}

// ── Router: re-render current page after save ─────────
function _reloadPage() {
  // Trigger the SPA router to re-render
  if (typeof window._rpRouterReload === 'function') window._rpRouterReload();
}

// ── Auth Modal ────────────────────────────────────────
function _createAuthModal() {
  const overlay = document.createElement('div');
  overlay.id = 'rp-auth-overlay';
  overlay.innerHTML = `
    <div id="rp-auth-box">
      <div class="rp-auth-logo">rise<span>Paisa</span></div>
      <div class="rp-auth-sub">Admin Access</div>
      <label class="rp-auth-label" for="rp-auth-code-input">Access Code</label>
      <div class="rp-auth-input-wrap">
        <input type="password" id="rp-auth-code-input" class="rp-auth-input"
               placeholder="Enter access code..."
               autocomplete="off" spellcheck="false">
        <button class="rp-auth-toggle" id="rp-auth-toggle-vis" type="button" title="Show/hide">👁</button>
      </div>
      <div class="rp-auth-error" id="rp-auth-error">Incorrect code. Access denied.</div>
      <button class="rp-auth-btn" id="rp-auth-submit">Unlock Admin Panel</button>
      <button class="rp-auth-cancel" id="rp-auth-cancel">Cancel</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const input  = document.getElementById('rp-auth-code-input');
  const errEl  = document.getElementById('rp-auth-error');
  const toggleVis = document.getElementById('rp-auth-toggle-vis');
  const submitBtn = document.getElementById('rp-auth-submit');
  const cancelBtn = document.getElementById('rp-auth-cancel');

  toggleVis.addEventListener('click', () => {
    input.type = input.type === 'password' ? 'text' : 'password';
    toggleVis.textContent = input.type === 'password' ? '👁' : '🙈';
  });

  async function tryAuth() {
    errEl.classList.remove('show');
    submitBtn.disabled = true;
    const ok = await _verify(input.value);
    if (ok) {
      overlay.remove();
      _openPanel();
    } else {
      errEl.classList.add('show');
      input.value = '';
      input.focus();
      submitBtn.disabled = false;
    }
  }

  submitBtn.addEventListener('click', tryAuth);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') tryAuth(); });
  cancelBtn.addEventListener('click', () => overlay.remove());

  // Close on backdrop click
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  setTimeout(() => input.focus(), 80);
}

// ── Admin Panel Shell ─────────────────────────────────
function _openPanel() {
  // Prevent scroll on body
  document.body.style.overflow = 'hidden';

  const panel = document.createElement('div');
  panel.id = 'rp-admin-panel';
  panel.innerHTML = `
    <aside class="rp-sidebar">
      <div class="rp-sidebar-header">
        <div class="rp-sidebar-logo">rise<span>Paisa</span></div>
        <div class="rp-admin-badge">Admin</div>
      </div>
      <nav class="rp-sidebar-nav">
        <div class="rp-nav-section">Main</div>
        ${_navLink('dashboard', '📊', 'Dashboard')}
        <div class="rp-nav-section">Content</div>
        ${_navLink('courses',   '📚', 'Courses')}
        ${_navLink('resources', '📦', 'Resources')}
        ${_navLink('blog',      '✍️', 'Blog Articles')}
        ${_navLink('users',     '👥', 'Users')}
        ${_navLink('content_pages', '📄', 'Content Pages')}
        <div class="rp-nav-section">System</div>
        ${_navLink('settings',  '⚙️', 'Settings')}
      </nav>
      <div class="rp-sidebar-footer">
        <button class="rp-logout-btn" id="rp-logout">
          <span class="rp-nav-icon">🚪</span>
          <span>Close Admin</span>
        </button>
      </div>
    </aside>
    <main class="rp-content" id="rp-main-content">
      <div class="rp-content-inner" id="rp-section-area"></div>
    </main>
  `;
  document.body.appendChild(panel);

  // Init nav click events
  panel.querySelectorAll('.rp-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      _activeSection = link.dataset.section;
      _editMode = null;
      _editIndex = null;
      _editData = null;
      _updateNav();
      _renderSection();
    });
  });

  document.getElementById('rp-logout').addEventListener('click', _closePanel);

  _renderSection();
}

function _navLink(section, icon, label) {
  return `<button class="rp-nav-link ${_activeSection === section ? 'active' : ''}" data-section="${section}">
    <span class="rp-nav-icon">${icon}</span>
    <span>${label}</span>
  </button>`;
}

function _updateNav() {
  document.querySelectorAll('.rp-nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.section === _activeSection);
  });
}

function _closePanel() {
  document.getElementById('rp-admin-panel')?.remove();
  document.body.style.overflow = '';
  _reloadPage();
}

// ── Section Router ────────────────────────────────────
function _renderSection() {
  const area = document.getElementById('rp-section-area');
  if (!area) return;
  switch (_activeSection) {
    case 'dashboard': area.innerHTML = _renderDashboard(); break;
    case 'courses':   area.innerHTML = _editMode ? _renderCourseForm()   : _renderCoursesList();   break;
    case 'resources': area.innerHTML = _editMode ? _renderResourceForm() : _renderResourcesList(); break;
    case 'blog':      area.innerHTML = _editMode ? _renderArticleForm()  : _renderArticlesList();  break;
    case 'users':     area.innerHTML = _editMode ? _renderUserForm()     : _renderUsersList();     break;
    case 'content_pages': area.innerHTML = _renderContentPages(); break;
    case 'settings':  area.innerHTML = _renderSettings(); break;
  }
  _bindSectionEvents();
}

// ── Dashboard ─────────────────────────────────────────
function _renderDashboard() {
  const courses   = getCourses();
  const resources = getResources();
  const articles  = getArticles();
  const settings  = getSettings();
  const users     = getUsers();

  return `
    <div class="rp-content-header">
      <div>
        <h2 class="rp-content-title">Dashboard</h2>
        <p class="rp-content-sub">Welcome back — here's your content overview.</p>
      </div>
    </div>
    <div class="rp-stats-grid">
      <div class="rp-stat-card">
        <div class="rp-stat-num">${courses.length}</div>
        <div class="rp-stat-label">Courses</div>
      </div>
      <div class="rp-stat-card">
        <div class="rp-stat-num">${users.length}</div>
        <div class="rp-stat-label">Students</div>
      </div>
      <div class="rp-stat-card">
        <div class="rp-stat-num">${resources.length}</div>
        <div class="rp-stat-label">Resources</div>
      </div>
      <div class="rp-stat-card">
        <div class="rp-stat-num">${articles.length}</div>
        <div class="rp-stat-label">Articles</div>
      </div>
    </div>

    <div class="rp-info-bar">
      📱 <strong>WhatsApp:</strong> +${settings.whatsapp} &nbsp;|&nbsp;
      🌐 <strong>Site:</strong> ${settings.siteName}
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div class="rp-list">
        <div class="rp-list-header">
          <span class="rp-list-title">Recent Courses</span>
          <button class="rp-btn rp-btn-primary rp-btn-sm" onclick="window._rpNav('courses')">Manage</button>
        </div>
        ${courses.slice(0,3).map(c => `
          <div class="rp-list-item">
            <div class="rp-list-thumb-placeholder">📚</div>
            <div class="rp-list-info">
              <div class="rp-list-name">${c.title}</div>
              <div class="rp-list-meta">NPR ${(c.price||0).toLocaleString()} · ${c.category}</div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="rp-list">
        <div class="rp-list-header">
          <span class="rp-list-title">Recent Articles</span>
          <button class="rp-btn rp-btn-primary rp-btn-sm" onclick="window._rpNav('blog')">Manage</button>
        </div>
        ${articles.slice(0,3).map(a => `
          <div class="rp-list-item">
            <div class="rp-list-thumb-placeholder">✍️</div>
            <div class="rp-list-info">
              <div class="rp-list-name">${a.title}</div>
              <div class="rp-list-meta">${a.category} · ${a.readTime}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ── Courses List ──────────────────────────────────────
function _renderCoursesList() {
  const courses = getCourses();
  return `
    <div class="rp-content-header">
      <div>
        <h2 class="rp-content-title">Courses</h2>
        <p class="rp-content-sub">Manage your course catalog.</p>
      </div>
      <button class="rp-btn rp-btn-primary" id="rp-course-add">+ Add Course</button>
    </div>
    <div class="rp-list">
      <div class="rp-list-header">
        <span class="rp-list-title">All Courses <span class="rp-list-count">(${courses.length})</span></span>
      </div>
      ${courses.length === 0 ? `<div style="padding:32px;text-align:center;color:#6b7a8d">No courses yet. Add your first course!</div>` : ''}
      ${courses.map((c, i) => `
        <div class="rp-list-item">
          <div class="rp-list-thumb-placeholder">📚</div>
          <div class="rp-list-info">
            <div class="rp-list-name">${c.title}${c.featured ? '<span class="rp-featured-badge">Featured</span>' : ''}</div>
            <div class="rp-list-meta">NPR ${(c.price||0).toLocaleString()} · ${c.category} · ${(c.curriculum||[]).length} modules</div>
          </div>
          <div class="rp-list-actions">
            <button class="rp-btn rp-btn-ghost rp-btn-sm" data-course-edit="${i}">Edit</button>
            <button class="rp-btn rp-btn-danger rp-btn-sm" data-course-del="${i}">Delete</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ── Course Form ───────────────────────────────────────
function _renderCourseForm() {
  const c = _editData || {};
  const curriculum = c.curriculum || [{ title: '', lessons: [''] }];
  const whatYouLearn = c.whatYouLearn || [''];
  const storedLessons = c.slug ? getLessonsForCourse(c.slug) : null;

  return `
    <div class="rp-content-header">
      <div>
        <h2 class="rp-content-title">${_editMode === 'add' ? 'Add New Course' : 'Edit Course'}</h2>
        <p class="rp-content-sub">${_editMode === 'add' ? 'Fill in the details below.' : 'Update course information.'}</p>
      </div>
      <button class="rp-btn rp-btn-ghost" id="rp-back-courses">← Back</button>
    </div>

    <div class="rp-form-panel">
      <div class="rp-form-header"><h3>Basic Information</h3></div>
      <div class="rp-form-grid">
        <div class="rp-form-group">
          <label class="rp-form-label">Title *</label>
          <input class="rp-input" id="rf-title" value="${_esc(c.title||'')}" placeholder="Course title">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Slug *</label>
          <input class="rp-input" id="rf-slug" value="${_esc(c.slug||'')}" placeholder="course-slug-here">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Category</label>
          <select class="rp-select" id="rf-category">
            ${['NEPSE & Investing','Personal Finance','Taxation','Fintech','Saving & Budgeting'].map(cat =>
              `<option value="${cat}" ${c.category === cat ? 'selected' : ''}>${cat}</option>`
            ).join('')}
          </select>
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Instructor</label>
          <input class="rp-input" id="rf-instructor" value="${_esc(c.instructor||'Aakash Das')}" placeholder="Instructor name">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Price (NPR)</label>
          <input class="rp-input" id="rf-price" type="number" value="${c.price||0}" placeholder="1499">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Target Audience</label>
          <input class="rp-input" id="rf-audience" value="${_esc(c.targetAudience||'')}" placeholder="Who is this for?">
        </div>
        <div class="rp-form-group span-2">
          <label class="rp-form-label">Short Description</label>
          <textarea class="rp-textarea" id="rf-short">${_esc(c.shortDescription||'')}</textarea>
        </div>
        <div class="rp-form-group span-2">
          <label class="rp-form-label">Full Description</label>
          <textarea class="rp-textarea tall" id="rf-full">${_esc(c.fullDescription||'')}</textarea>
        </div>
        <div class="rp-form-group span-2">
          <label class="rp-form-label">Thumbnail Image</label>
          ${_renderImageUpload('rf-thumb', c.thumbnail || '')}
        </div>
        <div class="rp-form-group span-2">
          <label class="rp-form-label">Preview Video URL (optional) — paste any YouTube link</label>
          <input class="rp-input" id="rf-video" value="${_esc(c.previewVideoUrl||'')}" placeholder="https://www.youtube.com/watch?v=XXXXX or https://youtu.be/XXXXX">
          <div style="font-size:11px;color:#6b7a8d;margin-top:4px">Accepts: youtube.com/watch?v=, youtu.be/, or youtube.com/embed/ formats. Auto-converted on save.</div>
        </div>
        <div class="rp-form-group span-2">
          <div class="rp-toggle-wrap">
            <label class="rp-toggle">
              <input type="checkbox" id="rf-featured" ${c.featured ? 'checked' : ''}>
              <span class="rp-toggle-slider"></span>
            </label>
            <span class="rp-toggle-label">Featured on homepage</span>
          </div>
        </div>
      </div>
    </div>

    <div class="rp-form-panel">
      <div class="rp-form-header"><h3>What You'll Learn</h3><span style="font-size:12px;color:#6b7a8d">Add key learning outcomes</span></div>
      <div class="rp-tag-list" id="rf-learn-list">
        ${whatYouLearn.map((item, i) => `
          <div class="rp-tag-row" data-learn="${i}">
            <input class="rp-input rp-learn-item" value="${_esc(item)}" placeholder="Learning outcome ${i+1}">
            <button class="rp-tag-remove" data-remove-learn="${i}" title="Remove">×</button>
          </div>
        `).join('')}
      </div>
      <button class="rp-tag-add" id="rf-add-learn">+ Add Item</button>
    </div>

    <div class="rp-form-panel">
      <div class="rp-form-header"><h3>Curriculum</h3><span style="font-size:12px;color:#6b7a8d">Modules and lessons</span></div>
      <div id="rf-curriculum-list">
        ${curriculum.map((mod, mi) => {
          const storedMod = storedLessons?.[mi];
          return `
          <div class="rp-module-card" data-module="${mi}">
            <div class="rp-module-header">
              <input class="rp-input rp-module-title" data-mod="${mi}" value="${_esc(mod.title)}" placeholder="Module ${mi+1} title">
              <button class="rp-btn rp-btn-danger rp-btn-sm" data-remove-module="${mi}">Remove Module</button>
            </div>
            <div class="rp-module-lessons" id="rf-lessons-${mi}">
              ${(mod.lessons||['']).map((l, li) => {
                const sl = storedMod?.lessons?.[li];
                return `
                <div class="rp-lesson-block" data-lesson-row="${mi}-${li}">
                  <div class="rp-lesson-title-row">
                    <input class="rp-input rp-lesson-item" data-mod="${mi}" data-lesson="${li}" value="${_esc(l)}" placeholder="Lesson title">
                    <button class="rp-tag-remove" data-remove-lesson="${mi}-${li}" title="Remove">×</button>
                  </div>
                  <div class="rp-lesson-extras">
                    <input class="rp-input rp-lesson-url" data-mod="${mi}" data-lesson="${li}" value="${_esc(sl?.youtubeUrl||'')}" placeholder="YouTube URL (e.g. https://youtu.be/VIDEO_ID)">
                    <textarea class="rp-textarea rp-lesson-desc" data-mod="${mi}" data-lesson="${li}" rows="2" placeholder="Lesson description (optional)">${_esc(sl?.description||'')}</textarea>
                  </div>
                </div>
                `;
              }).join('')}
              <button class="rp-tag-add rp-add-lesson" data-mod="${mi}" style="margin-left:0">+ Add Lesson</button>
            </div>
          </div>
          `;
        }).join('')}
      </div>
      <button class="rp-tag-add" id="rf-add-module">+ Add Module</button>
    </div>

    <div class="rp-form-actions">
      <button class="rp-btn rp-btn-primary" id="rp-course-save">💾 Save Course</button>
      <button class="rp-btn rp-btn-ghost" id="rp-back-courses2">Cancel</button>
    </div>
  `;
}

// ── Resources List ────────────────────────────────────
function _renderResourcesList() {
  const resources = getResources();
  return `
    <div class="rp-content-header">
      <div>
        <h2 class="rp-content-title">Resources</h2>
        <p class="rp-content-sub">Manage templates and downloadable resources.</p>
      </div>
      <button class="rp-btn rp-btn-primary" id="rp-resource-add">+ Add Resource</button>
    </div>
    <div class="rp-list">
      <div class="rp-list-header">
        <span class="rp-list-title">All Resources <span class="rp-list-count">(${resources.length})</span></span>
      </div>
      ${resources.length === 0 ? `<div style="padding:32px;text-align:center;color:#6b7a8d">No resources yet.</div>` : ''}
      ${resources.map((r, i) => `
        <div class="rp-list-item">
          <div class="rp-list-thumb-placeholder">📦</div>
          <div class="rp-list-info">
            <div class="rp-list-name">${r.title}${r.featured ? '<span class="rp-featured-badge">Featured</span>' : ''}</div>
            <div class="rp-list-meta">NPR ${(r.price||0).toLocaleString()} · ${r.category}</div>
          </div>
          <div class="rp-list-actions">
            <button class="rp-btn rp-btn-ghost rp-btn-sm" data-res-edit="${i}">Edit</button>
            <button class="rp-btn rp-btn-danger rp-btn-sm" data-res-del="${i}">Delete</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ── Resource Form ─────────────────────────────────────
function _renderResourceForm() {
  const r = _editData || {};
  const whatYouLearn  = r.whatYouLearn  || [''];
  const whatsIncluded = r.whatsIncluded || [''];

  return `
    <div class="rp-content-header">
      <div>
        <h2 class="rp-content-title">${_editMode === 'add' ? 'Add New Resource' : 'Edit Resource'}</h2>
        <p class="rp-content-sub">Templates, tools, and downloadable content.</p>
      </div>
      <button class="rp-btn rp-btn-ghost" id="rp-back-resources">← Back</button>
    </div>

    <div class="rp-form-panel">
      <div class="rp-form-header"><h3>Basic Information</h3></div>
      <div class="rp-form-grid">
        <div class="rp-form-group">
          <label class="rp-form-label">Title *</label>
          <input class="rp-input" id="rrf-title" value="${_esc(r.title||'')}" placeholder="Resource title">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Slug *</label>
          <input class="rp-input" id="rrf-slug" value="${_esc(r.slug||'')}" placeholder="resource-slug">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Category</label>
          <select class="rp-select" id="rrf-category">
            ${['Notion','Finance Tools','Spreadsheet','Template','Guide'].map(cat =>
              `<option value="${cat}" ${r.category === cat ? 'selected' : ''}>${cat}</option>`
            ).join('')}
          </select>
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Creator</label>
          <input class="rp-input" id="rrf-creator" value="${_esc(r.creator||'Aakash Das')}" placeholder="Creator name">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Price (NPR)</label>
          <input class="rp-input" id="rrf-price" type="number" value="${r.price||0}" placeholder="499">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Target Audience</label>
          <input class="rp-input" id="rrf-audience" value="${_esc(r.targetAudience||'')}" placeholder="Who is this for?">
        </div>
        <div class="rp-form-group span-2">
          <label class="rp-form-label">Short Description</label>
          <textarea class="rp-textarea" id="rrf-short">${_esc(r.shortDescription||'')}</textarea>
        </div>
        <div class="rp-form-group span-2">
          <label class="rp-form-label">Full Description</label>
          <textarea class="rp-textarea tall" id="rrf-full">${_esc(r.fullDescription||'')}</textarea>
        </div>
        <div class="rp-form-group span-2">
          <label class="rp-form-label">Thumbnail Image</label>
          ${_renderImageUpload('rrf-thumb', r.thumbnail || '')}
        </div>
        <div class="rp-form-group span-2">
          <label class="rp-form-label">Preview Image</label>
          ${_renderImageUpload('rrf-imgurl', r.imageUrl || '')}
        </div>
        <div class="rp-form-group span-2">
          <div class="rp-toggle-wrap">
            <label class="rp-toggle">
              <input type="checkbox" id="rrf-featured" ${r.featured ? 'checked' : ''}>
              <span class="rp-toggle-slider"></span>
            </label>
            <span class="rp-toggle-label">Featured on homepage</span>
          </div>
        </div>
      </div>
    </div>

    <div class="rp-form-panel">
      <div class="rp-form-header"><h3>What You'll Learn</h3></div>
      <div class="rp-tag-list" id="rrf-learn-list">
        ${whatYouLearn.map((item, i) => `
          <div class="rp-tag-row" data-rlearn="${i}">
            <input class="rp-input rp-rlearn-item" value="${_esc(item)}" placeholder="Learning outcome ${i+1}">
            <button class="rp-tag-remove" data-remove-rlearn="${i}" title="Remove">×</button>
          </div>
        `).join('')}
      </div>
      <button class="rp-tag-add" id="rrf-add-learn">+ Add Item</button>
    </div>

    <div class="rp-form-panel">
      <div class="rp-form-header"><h3>What's Included</h3></div>
      <div class="rp-tag-list" id="rrf-included-list">
        ${whatsIncluded.map((item, i) => `
          <div class="rp-tag-row" data-rinc="${i}">
            <input class="rp-input rp-rinc-item" value="${_esc(item)}" placeholder="Included item ${i+1}">
            <button class="rp-tag-remove" data-remove-rinc="${i}" title="Remove">×</button>
          </div>
        `).join('')}
      </div>
      <button class="rp-tag-add" id="rrf-add-inc">+ Add Item</button>
    </div>

    <div class="rp-form-actions">
      <button class="rp-btn rp-btn-primary" id="rp-resource-save">💾 Save Resource</button>
      <button class="rp-btn rp-btn-ghost" id="rp-back-resources2">Cancel</button>
    </div>
  `;
}

// ── Articles List ─────────────────────────────────────
function _renderArticlesList() {
  const articles = getArticles();
  return `
    <div class="rp-content-header">
      <div>
        <h2 class="rp-content-title">Blog Articles</h2>
        <p class="rp-content-sub">Manage your published articles.</p>
      </div>
      <button class="rp-btn rp-btn-primary" id="rp-article-add">+ Add Article</button>
    </div>
    <div class="rp-list">
      <div class="rp-list-header">
        <span class="rp-list-title">All Articles <span class="rp-list-count">(${articles.length})</span></span>
      </div>
      ${articles.length === 0 ? `<div style="padding:32px;text-align:center;color:#6b7a8d">No articles yet.</div>` : ''}
      ${articles.map((a, i) => `
        <div class="rp-list-item">
          <div class="rp-list-thumb-placeholder">✍️</div>
          <div class="rp-list-info">
            <div class="rp-list-name">${a.title}${a.featured ? '<span class="rp-featured-badge">Featured</span>' : ''}</div>
            <div class="rp-list-meta">${a.category} · ${a.readTime} · ${a.date}</div>
          </div>
          <div class="rp-list-actions">
            <button class="rp-btn rp-btn-ghost rp-btn-sm" data-art-edit="${i}">Edit</button>
            <button class="rp-btn rp-btn-danger rp-btn-sm" data-art-del="${i}">Delete</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ── Article Form ──────────────────────────────────────
function _renderArticleForm() {
  const a = _editData || {};
  return `
    <div class="rp-content-header">
      <div>
        <h2 class="rp-content-title">${_editMode === 'add' ? 'Add New Article' : 'Edit Article'}</h2>
        <p class="rp-content-sub">Blog posts appear on the Blog & Articles page.</p>
      </div>
      <button class="rp-btn rp-btn-ghost" id="rp-back-blog">← Back</button>
    </div>

    <div class="rp-form-panel">
      <div class="rp-form-header"><h3>Article Information</h3></div>
      <div class="rp-form-grid">
        <div class="rp-form-group">
          <label class="rp-form-label">Title *</label>
          <input class="rp-input" id="af-title" value="${_esc(a.title||'')}" placeholder="Article title">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Slug *</label>
          <input class="rp-input" id="af-slug" value="${_esc(a.slug||'')}" placeholder="article-slug">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Category</label>
          <select class="rp-select" id="af-category">
            ${['NEPSE & Investing','Personal Finance','Taxation','Fintech','Saving & Budgeting'].map(cat =>
              `<option value="${cat}" ${a.category === cat ? 'selected' : ''}>${cat}</option>`
            ).join('')}
          </select>
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Category Slug</label>
          <select class="rp-select" id="af-catslug">
            ${['nepse','personal-finance','taxation','fintech','saving'].map(sl =>
              `<option value="${sl}" ${a.categorySlug === sl ? 'selected' : ''}>${sl}</option>`
            ).join('')}
          </select>
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Author</label>
          <input class="rp-input" id="af-author" value="${_esc(a.author||'Aakash Das')}" placeholder="Author name">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Date (YYYY-MM-DD)</label>
          <input class="rp-input" id="af-date" type="date" value="${_esc(a.date||new Date().toISOString().split('T')[0])}">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Read Time</label>
          <input class="rp-input" id="af-readtime" value="${_esc(a.readTime||'5 min read')}" placeholder="5 min read">
        </div>
        <div class="rp-form-group span-2">
          <label class="rp-form-label">Thumbnail Image</label>
          ${_renderImageUpload('af-thumb', a.thumbnail || '')}
        </div>
        <div class="rp-form-group span-2">
          <label class="rp-form-label">Excerpt (short summary)</label>
          <textarea class="rp-textarea" id="af-excerpt">${_esc(a.excerpt||'')}</textarea>
        </div>
        <div class="rp-form-group span-2">
          <div class="rp-toggle-wrap">
            <label class="rp-toggle">
              <input type="checkbox" id="af-featured" ${a.featured ? 'checked' : ''}>
              <span class="rp-toggle-slider"></span>
            </label>
            <span class="rp-toggle-label">Featured article</span>
          </div>
        </div>
      </div>
    </div>

    <div class="rp-form-panel">
      <div class="rp-form-header">
        <h3>Article Content (HTML)</h3>
        <span style="font-size:12px;color:#6b7a8d">Use &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;blockquote&gt;, &lt;strong&gt;</span>
      </div>
      <div class="rp-form-grid full">
        <div class="rp-form-group">
          <textarea class="rp-textarea code" id="af-content" style="min-height:320px">${_esc(a.content||'')}</textarea>
        </div>
      </div>
    </div>

    <div class="rp-form-actions">
      <button class="rp-btn rp-btn-primary" id="rp-article-save">💾 Save Article</button>
      <button class="rp-btn rp-btn-ghost" id="rp-back-blog2">Cancel</button>
    </div>
  `;
}

// ── Users List ────────────────────────────────────────
function _renderUsersList() {
  const users = getUsers();
  return `
    <div class="rp-content-header">
      <div>
        <h2 class="rp-content-title">Users</h2>
        <p class="rp-content-sub">Manage student accounts and course access.</p>
      </div>
      <button class="rp-btn rp-btn-primary" id="rp-user-add">+ Add User</button>
    </div>
    <div class="rp-list">
      <div class="rp-list-header">
        <span class="rp-list-title">All Users <span class="rp-list-count">(${users.length})</span></span>
      </div>
      ${users.length === 0 ? `<div style="padding:32px;text-align:center;color:#6b7a8d">No users yet. Create your first student account!</div>` : ''}
      ${users.map((u, i) => `
        <div class="rp-list-item">
          <div class="rp-list-thumb-placeholder">👤</div>
          <div class="rp-list-info">
            <div class="rp-list-name">${_esc(u.name || u.username)}</div>
            <div class="rp-list-meta">@${_esc(u.username)} · ${(u.assignedCourses||[]).length} courses assigned</div>
          </div>
          <div class="rp-list-actions">
            <button class="rp-btn rp-btn-ghost rp-btn-sm" data-user-edit="${i}">Edit</button>
            <button class="rp-btn rp-btn-danger rp-btn-sm" data-user-del="${i}">Delete</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ── User Form ─────────────────────────────────────────
function _renderUserForm() {
  const u = _editData || {};
  const courses = getCourses();
  const assigned = u.assignedCourses || [];
  const isEdit = _editMode === 'edit';

  return `
    <div class="rp-content-header">
      <div>
        <h2 class="rp-content-title">${isEdit ? 'Edit User' : 'Create New User'}</h2>
        <p class="rp-content-sub">${isEdit ? 'Update user details and course access.' : 'Set up login credentials and assign courses.'}</p>
      </div>
      <button class="rp-btn rp-btn-ghost" id="rp-back-users">← Back</button>
    </div>

    <div class="rp-form-panel">
      <div class="rp-form-header"><h3>Account Information</h3></div>
      <div class="rp-form-grid">
        <div class="rp-form-group">
          <label class="rp-form-label">Username *</label>
          <input class="rp-input" id="uf-username" value="${_esc(u.username||'')}" placeholder="student_username" ${isEdit ? 'readonly style="opacity:0.6"' : ''}>
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">${isEdit ? 'New Password (leave blank to keep)' : 'Password *'}</label>
          <input class="rp-input" id="uf-password" type="text" value="" placeholder="${isEdit ? 'Leave blank to keep current' : 'Create a password'}">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Full Name</label>
          <input class="rp-input" id="uf-name" value="${_esc(u.name||'')}" placeholder="Student's full name">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Email</label>
          <input class="rp-input" id="uf-email" type="email" value="${_esc(u.email||'')}" placeholder="student@example.com">
        </div>
      </div>
    </div>

    <div class="rp-form-panel">
      <div class="rp-form-header"><h3>Assign Courses</h3><span style="font-size:12px;color:#6b7a8d">Select courses this user can access</span></div>
      <div class="rp-form-grid full">
        ${courses.length === 0 ? '<div style="padding:16px;color:#6b7a8d">No courses available. Create courses first.</div>' : ''}
        ${courses.map(c => `
          <div class="rp-form-group" style="grid-column:span 1">
            <div class="rp-toggle-wrap">
              <label class="rp-toggle">
                <input type="checkbox" class="uf-course-check" data-slug="${c.slug}" ${assigned.includes(c.slug) ? 'checked' : ''}>
                <span class="rp-toggle-slider"></span>
              </label>
              <span class="rp-toggle-label">${_esc(c.title)}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="rp-form-actions">
      <button class="rp-btn rp-btn-primary" id="rp-user-save">💾 ${isEdit ? 'Update User' : 'Create User'}</button>
      <button class="rp-btn rp-btn-ghost" id="rp-back-users2">Cancel</button>
    </div>
  `;
}

// ── Content Pages (CMS) ───────────────────────────────
function _renderContentPages() {
  const s = getSettings();
  const pages = s.pages || {};
  const pageTypes = [
    { key: 'privacy', icon: '🔒', defaultTitle: 'Privacy Policy' },
    { key: 'terms', icon: '📜', defaultTitle: 'Terms & Conditions' },
    { key: 'disclaimer', icon: '⚠️', defaultTitle: 'Disclaimer' },
  ];

  return `
    <div class="rp-content-header">
      <div>
        <h2 class="rp-content-title">Content Pages</h2>
        <p class="rp-content-sub">Edit website pages. Leave content empty to use built-in defaults.</p>
      </div>
    </div>

    <div class="rp-info-bar">
      💡 Edits take effect instantly on next page navigation. Use HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt; for formatting.
    </div>

    ${pageTypes.map(pt => {
      const pg = pages[pt.key] || {};
      return `
        <div class="rp-settings-section">
          <h3>${pt.icon} ${pt.defaultTitle}</h3>
          <div class="rp-form-grid">
            <div class="rp-form-group">
              <label class="rp-form-label">Page Title</label>
              <input class="rp-input" id="cp-${pt.key}-title" value="${_esc(pg.title || pt.defaultTitle)}" placeholder="${pt.defaultTitle}">
            </div>
            <div class="rp-form-group">
              <label class="rp-form-label">Last Updated</label>
              <input class="rp-input" id="cp-${pt.key}-updated" value="${_esc(pg.lastUpdated || '')}" placeholder="e.g. April 2026">
            </div>
            <div class="rp-form-group span-2">
              <label class="rp-form-label">Content (HTML) — leave empty to use defaults</label>
              <textarea class="rp-textarea code" id="cp-${pt.key}-content" style="min-height:200px">${_esc(pg.content || '')}</textarea>
            </div>
          </div>
        </div>
      `;
    }).join('')}

    <div class="rp-settings-section">
      <h3>🤝 Personal Consultancy</h3>
      <div class="rp-form-grid">
        <div class="rp-form-group">
          <label class="rp-form-label">Page Title</label>
          <input class="rp-input" id="cp-consultancy-title" value="${_esc(pages.consultancy?.title || '')}" placeholder="Personal Consultancy">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Button Text</label>
          <input class="rp-input" id="cp-consultancy-btn" value="${_esc(pages.consultancy?.buttonText || '')}" placeholder="Contact for Consultancy">
        </div>
        <div class="rp-form-group span-2">
          <label class="rp-form-label">Description Paragraph</label>
          <textarea class="rp-textarea" id="cp-consultancy-desc">${_esc(pages.consultancy?.description || '')}</textarea>
        </div>
        <div class="rp-form-group span-2">
          <label class="rp-form-label">Pricing Text</label>
          <textarea class="rp-textarea" id="cp-consultancy-pricing" rows="2">${_esc(pages.consultancy?.pricingText || '')}</textarea>
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Price Value</label>
          <input class="rp-input" id="cp-consultancy-price-val" value="${_esc(pages.consultancy?.priceValue || '')}" placeholder="2500">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Duration</label>
          <input class="rp-input" id="cp-consultancy-duration" value="${_esc(pages.consultancy?.duration || '')}" placeholder="2 hours">
        </div>
      </div>
    </div>

    <div class="rp-form-actions">
      <button class="rp-btn rp-btn-primary" id="rp-content-pages-save">💾 Save All Content Pages</button>
    </div>
  `;
}

// ── Settings ──────────────────────────────────────────
function _renderSettings() {
  const s = getSettings();
  const soc = s.social || {};
  const cl = s.contactLinks || {};
  const nav = s.navItems || {};
  const pc = nav.personalConsultancy || {};
  return `
    <div class="rp-content-header">
      <div>
        <h2 class="rp-content-title">Settings</h2>
        <p class="rp-content-sub">Update site-wide configuration.</p>
      </div>
    </div>

    <div class="rp-info-bar">
      💡 Changes to <strong>WhatsApp</strong> and <strong>social links</strong> apply on next page navigation. No reload needed.
    </div>

    <div class="rp-settings-section">
      <h3>🧭 Navbar Management</h3>
      <div class="rp-form-grid">
        <div class="rp-form-group span-2">
          <div class="rp-toggle-wrap">
            <label class="rp-toggle">
              <input type="checkbox" id="st-pc-enabled" ${pc.enabled !== false ? 'checked' : ''}>
              <span class="rp-toggle-slider"></span>
            </label>
            <span class="rp-toggle-label">Show "Personal Consultancy" in navbar</span>
          </div>
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Menu Label</label>
          <input class="rp-input" id="st-pc-label" value="${_esc(pc.label || 'Personal Consultancy')}" placeholder="Personal Consultancy">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Link / Path</label>
          <input class="rp-input" id="st-pc-path" value="${_esc(pc.path || '#/consultancy')}" placeholder="#/consultancy or https://...">
        </div>
      </div>
      <div class="rp-form-actions" style="border-top:none;margin-top:16px;padding-top:0">
        <button class="rp-btn rp-btn-primary" id="rp-navbar-save">💾 Save Navbar Settings</button>
      </div>
    </div>

    <div class="rp-settings-section">
      <h3>📱 Contact & WhatsApp</h3>
      <div class="rp-form-grid">
        <div class="rp-form-group">
          <label class="rp-form-label">WhatsApp Number (with country code)</label>
          <input class="rp-input" id="st-whatsapp" value="${_esc(s.whatsapp||'')}" placeholder="+9779761145115">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Site Name</label>
          <input class="rp-input" id="st-sitename" value="${_esc(s.siteName||'risePaisa')}" placeholder="risePaisa">
        </div>
      </div>
    </div>

    <div class="rp-settings-section">
      <h3>🌐 Social Media Links</h3>
      <div class="rp-form-grid">
        <div class="rp-form-group">
          <label class="rp-form-label">YouTube URL</label>
          <input class="rp-input" id="st-yt" value="${_esc(soc.youtube||'#')}" placeholder="https://youtube.com/@...">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">TikTok URL</label>
          <input class="rp-input" id="st-tt" value="${_esc(soc.tiktok||'#')}" placeholder="https://tiktok.com/@...">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Instagram URL</label>
          <input class="rp-input" id="st-ig" value="${_esc(soc.instagram||'#')}" placeholder="https://instagram.com/...">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Facebook URL</label>
          <input class="rp-input" id="st-fb" value="${_esc(soc.facebook||'#')}" placeholder="https://facebook.com/...">
        </div>
      </div>
      <div class="rp-form-actions" style="border-top:none;margin-top:16px;padding-top:0">
        <button class="rp-btn rp-btn-primary" id="rp-settings-save">💾 Save Settings</button>
      </div>
    </div>

    <div class="rp-settings-section">
      <h3>🔗 Contact Page Links — risePaisa</h3>
      <div class="rp-form-grid">
        <div class="rp-form-group">
          <label class="rp-form-label">TikTok URL</label>
          <input class="rp-input" id="cl-rp-tiktok" type="url" value="${_esc(cl.risepaisa?.tiktok||'')}" placeholder="https://tiktok.com/@...">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Instagram URL</label>
          <input class="rp-input" id="cl-rp-instagram" type="url" value="${_esc(cl.risepaisa?.instagram||'')}" placeholder="https://instagram.com/...">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Facebook URL</label>
          <input class="rp-input" id="cl-rp-facebook" type="url" value="${_esc(cl.risepaisa?.facebook||'')}" placeholder="https://facebook.com/...">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">YouTube URL</label>
          <input class="rp-input" id="cl-rp-youtube" type="url" value="${_esc(cl.risepaisa?.youtube||'')}" placeholder="https://youtube.com/@...">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Twitter / X URL</label>
          <input class="rp-input" id="cl-rp-twitter" type="url" value="${_esc(cl.risepaisa?.twitter||'')}" placeholder="https://x.com/...">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">LinkedIn URL</label>
          <input class="rp-input" id="cl-rp-linkedin" type="url" value="${_esc(cl.risepaisa?.linkedin||'')}" placeholder="https://linkedin.com/company/...">
        </div>
      </div>
    </div>

    <div class="rp-settings-section">
      <h3>🔗 Contact Page Links — Aakash Das</h3>
      <div class="rp-form-grid">
        <div class="rp-form-group">
          <label class="rp-form-label">TikTok URL</label>
          <input class="rp-input" id="cl-ak-tiktok" type="url" value="${_esc(cl.aakash?.tiktok||'')}" placeholder="https://tiktok.com/@...">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Instagram URL</label>
          <input class="rp-input" id="cl-ak-instagram" type="url" value="${_esc(cl.aakash?.instagram||'')}" placeholder="https://instagram.com/...">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Facebook URL</label>
          <input class="rp-input" id="cl-ak-facebook" type="url" value="${_esc(cl.aakash?.facebook||'')}" placeholder="https://facebook.com/...">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">YouTube URL</label>
          <input class="rp-input" id="cl-ak-youtube" type="url" value="${_esc(cl.aakash?.youtube||'')}" placeholder="https://youtube.com/@...">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Twitter / X URL</label>
          <input class="rp-input" id="cl-ak-twitter" type="url" value="${_esc(cl.aakash?.twitter||'')}" placeholder="https://x.com/...">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">LinkedIn URL</label>
          <input class="rp-input" id="cl-ak-linkedin" type="url" value="${_esc(cl.aakash?.linkedin||'')}" placeholder="https://linkedin.com/company/...">
        </div>
      </div>
      <div class="rp-form-actions" style="border-top:none;margin-top:16px;padding-top:0">
        <button class="rp-btn rp-btn-primary" id="rp-contact-links-save">💾 Save Contact Links</button>
      </div>
    </div>

    <div class="rp-settings-section">
      <h3>🔐 Change Admin Password</h3>
      <div class="rp-form-grid">
        <div class="rp-form-group">
          <label class="rp-form-label">Current Password</label>
          <input class="rp-input" id="st-cur-pass" type="password" placeholder="Enter current password">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">New Password</label>
          <input class="rp-input" id="st-new-pass" type="password" placeholder="Enter new password">
        </div>
        <div class="rp-form-group">
          <label class="rp-form-label">Confirm New Password</label>
          <input class="rp-input" id="st-confirm-pass" type="password" placeholder="Confirm new password">
        </div>
      </div>
      <div class="rp-form-actions" style="border-top:none;margin-top:16px;padding-top:0">
        <button class="rp-btn rp-btn-primary" id="rp-change-pass">🔑 Change Password</button>
      </div>
    </div>
  `;
}

// ── Event Binder ──────────────────────────────────────
function _bindSectionEvents() {
  const area = document.getElementById('rp-section-area');
  if (!area) return;

  // Global navigation from dashboard quick-links
  window._rpNav = (section) => {
    _activeSection = section;
    _editMode = null;
    _editIndex = null;
    _editData = null;
    _updateNav();
    _renderSection();
  };

  // ─── Dashboard shortcuts have no extra events ───

  // ─── Courses ─────────────────────────────────────
  area.querySelector('#rp-course-add')?.addEventListener('click', () => {
    _editMode = 'add';
    _editData = { curriculum: [{ title: '', lessons: [''] }], whatYouLearn: [''], featured: false };
    _renderSection();
  });

  area.querySelectorAll('[data-course-edit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.courseEdit);
      _editMode = 'edit';
      _editIndex = i;
      _editData = JSON.parse(JSON.stringify(getCourses()[i]));
      _renderSection();
    });
  });

  area.querySelectorAll('[data-course-del]').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.courseDel);
      if (!confirm(`Delete "${getCourses()[i].title}"? This cannot be undone.`)) return;
      const courses = getCourses().filter((_, idx) => idx !== i);
      setCourses(courses);
      _toast('Course deleted.');
      _renderSection();
    });
  });

  // Course form back buttons
  area.querySelector('#rp-back-courses')?.addEventListener('click', () => {
    _editMode = null; _editData = null; _renderSection();
  });
  area.querySelector('#rp-back-courses2')?.addEventListener('click', () => {
    _editMode = null; _editData = null; _renderSection();
  });

  // Course form save
  area.querySelector('#rp-course-save')?.addEventListener('click', () => {
    const title   = document.getElementById('rf-title')?.value.trim();
    const slug    = document.getElementById('rf-slug')?.value.trim();
    if (!title || !slug) { _toast('Title and slug are required.', 'error'); return; }

    // Collect whatYouLearn
    const learnItems = [...document.querySelectorAll('.rp-learn-item')]
      .map(el => el.value.trim()).filter(Boolean);

    // Collect curriculum + lesson extras together
    const moduleCards = [...document.querySelectorAll('[data-module]')];
    const curriculum = [];
    const lessonModules = []; // for courseLessons store

    moduleCards.forEach(card => {
      const mi = card.dataset.module;
      const modTitle = card.querySelector(`.rp-module-title[data-mod="${mi}"]`)?.value.trim() || '';
      const lessonBlocks = [...card.querySelectorAll('.rp-lesson-block')];
      
      const lessons = [];
      const storedLessons = [];

      lessonBlocks.forEach((block, li) => {
        const titleVal = block.querySelector(`.rp-lesson-item[data-mod="${mi}"]`)?.value.trim() || '';
        const urlVal   = block.querySelector(`.rp-lesson-url[data-mod="${mi}"]`)?.value.trim() || '';
        const descVal  = block.querySelector(`.rp-lesson-desc[data-mod="${mi}"]`)?.value.trim() || '';
        if (titleVal) {
          lessons.push(titleVal);
          storedLessons.push({ id: `m${mi}l${li}`, title: titleVal, youtubeUrl: urlVal, description: descVal });
        }
      });

      if (modTitle || lessons.length > 0) {
        curriculum.push({ title: modTitle, lessons });
        lessonModules.push({ moduleTitle: modTitle, lessons: storedLessons });
      }
    });

      // Auto-convert YouTube URL to embed format
      const rawVideoUrl = document.getElementById('rf-video')?.value.trim() || '';
      let previewVideoUrl = null;
      if (rawVideoUrl) {
        previewVideoUrl = _toYouTubeEmbed(rawVideoUrl);
        if (!previewVideoUrl) {
          _toast('Invalid YouTube URL. Please paste a valid youtube.com or youtu.be link.', 'error');
          return;
        }
      }

    const item = {
      id: _editMode === 'add' ? (Date.now()) : (_editData.id || Date.now()),
      slug,
      title,
      shortDescription: document.getElementById('rf-short')?.value.trim() || '',
      fullDescription:  document.getElementById('rf-full')?.value.trim() || '',
      price: parseInt(document.getElementById('rf-price')?.value) || 0,
      currency: 'NPR',
      instructor: document.getElementById('rf-instructor')?.value.trim() || 'Aakash Das',
      category: document.getElementById('rf-category')?.value || 'Personal Finance',
      thumbnail: document.getElementById('rf-thumb')?.value.trim() || null,
      previewVideoUrl,
      featured: document.getElementById('rf-featured')?.checked || false,
      whatYouLearn: learnItems,
      curriculum,
      targetAudience: document.getElementById('rf-audience')?.value.trim() || '',
    };

    const courses = getCourses();
    if (_editMode === 'add') {
      courses.push(item);
    } else {
      courses[_editIndex] = item;
    }
    setCourses(courses);

    // Save lesson extras (YouTube URLs + descriptions)
    setLessonsForCourse(slug, lessonModules);

    _toast(`Course "${title}" saved!`);
    _editMode = null; _editData = null; _editIndex = null;
    _renderSection();
    _reloadPage();
  });

  // Curriculum dynamic rows
  area.querySelector('#rf-add-learn')?.addEventListener('click', () => {
    const list = document.getElementById('rf-learn-list');
    const i = list.querySelectorAll('.rp-tag-row').length;
    list.insertAdjacentHTML('beforeend', `
      <div class="rp-tag-row" data-learn="${i}">
        <input class="rp-input rp-learn-item" value="" placeholder="Learning outcome ${i+1}">
        <button class="rp-tag-remove" data-remove-learn="${i}" title="Remove">×</button>
      </div>
    `);
    _bindRemoveListeners('#rf-learn-list', '[data-remove-learn]', '.rp-tag-row[data-learn]');
  });

  area.querySelector('#rf-add-module')?.addEventListener('click', () => {
    const list = document.getElementById('rf-curriculum-list');
    const mi = list.querySelectorAll('[data-module]').length;
    list.insertAdjacentHTML('beforeend', `
      <div class="rp-module-card" data-module="${mi}">
        <div class="rp-module-header">
          <input class="rp-input rp-module-title" data-mod="${mi}" value="" placeholder="Module ${mi+1} title">
          <button class="rp-btn rp-btn-danger rp-btn-sm" data-remove-module="${mi}">Remove Module</button>
        </div>
        <div class="rp-module-lessons" id="rf-lessons-${mi}">
          <div class="rp-tag-row" data-lesson-row="${mi}-0">
            <input class="rp-input rp-lesson-item" data-mod="${mi}" data-lesson="0" value="" placeholder="Lesson title">
            <button class="rp-tag-remove" data-remove-lesson="${mi}-0" title="Remove">×</button>
          </div>
          <button class="rp-tag-add rp-add-lesson" data-mod="${mi}" style="margin-left:0">+ Add Lesson</button>
        </div>
      </div>
    `);
    _bindCurriculumEvents();
  });

  _bindRemoveListeners('#rf-learn-list', '[data-remove-learn]', '.rp-tag-row[data-learn]');
  _bindCurriculumEvents();

  // ─── Resources ────────────────────────────────────
  area.querySelector('#rp-resource-add')?.addEventListener('click', () => {
    _editMode = 'add';
    _editData = { whatYouLearn: [''], whatsIncluded: [''], featured: false };
    _renderSection();
  });

  area.querySelectorAll('[data-res-edit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.resEdit);
      _editMode = 'edit'; _editIndex = i;
      _editData = JSON.parse(JSON.stringify(getResources()[i]));
      _renderSection();
    });
  });

  area.querySelectorAll('[data-res-del]').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.resDel);
      if (!confirm(`Delete "${getResources()[i].title}"?`)) return;
      setResources(getResources().filter((_, idx) => idx !== i));
      _toast('Resource deleted.');
      _renderSection();
    });
  });

  area.querySelector('#rp-back-resources')?.addEventListener('click',  () => { _editMode = null; _editData = null; _renderSection(); });
  area.querySelector('#rp-back-resources2')?.addEventListener('click', () => { _editMode = null; _editData = null; _renderSection(); });

  area.querySelector('#rp-resource-save')?.addEventListener('click', () => {
    const title = document.getElementById('rrf-title')?.value.trim();
    const slug  = document.getElementById('rrf-slug')?.value.trim();
    if (!title || !slug) { _toast('Title and slug are required.', 'error'); return; }

    const learnItems    = [...document.querySelectorAll('.rp-rlearn-item')].map(e => e.value.trim()).filter(Boolean);
    const includedItems = [...document.querySelectorAll('.rp-rinc-item')].map(e => e.value.trim()).filter(Boolean);

    const item = {
      id: _editMode === 'add' ? Date.now() : (_editData.id || Date.now()),
      slug, title,
      shortDescription: document.getElementById('rrf-short')?.value.trim() || '',
      fullDescription:  document.getElementById('rrf-full')?.value.trim() || '',
      price:    parseInt(document.getElementById('rrf-price')?.value) || 0,
      currency: 'NPR',
      creator:  document.getElementById('rrf-creator')?.value.trim() || 'Aakash Das',
      category: document.getElementById('rrf-category')?.value || 'Notion',
      thumbnail: document.getElementById('rrf-thumb')?.value.trim() || null,
      imageUrl:  document.getElementById('rrf-imgurl')?.value.trim() || null,
      previewVideoUrl: null,
      featured:  document.getElementById('rrf-featured')?.checked || false,
      whatYouLearn:  learnItems,
      whatsIncluded: includedItems,
      targetAudience: document.getElementById('rrf-audience')?.value.trim() || '',
    };

    const resources = getResources();
    if (_editMode === 'add') resources.push(item);
    else resources[_editIndex] = item;
    setResources(resources);
    _toast(`Resource "${title}" saved!`);
    _editMode = null; _editData = null; _editIndex = null;
    _renderSection();
    _reloadPage();
  });

  area.querySelector('#rrf-add-learn')?.addEventListener('click', () => {
    const list = document.getElementById('rrf-learn-list');
    const i = list.querySelectorAll('.rp-tag-row').length;
    list.insertAdjacentHTML('beforeend', `
      <div class="rp-tag-row" data-rlearn="${i}">
        <input class="rp-input rp-rlearn-item" value="" placeholder="Item ${i+1}">
        <button class="rp-tag-remove" data-remove-rlearn="${i}" title="Remove">×</button>
      </div>
    `);
    _bindRemoveListeners('#rrf-learn-list', '[data-remove-rlearn]', '.rp-tag-row[data-rlearn]');
  });

  area.querySelector('#rrf-add-inc')?.addEventListener('click', () => {
    const list = document.getElementById('rrf-included-list');
    const i = list.querySelectorAll('.rp-tag-row').length;
    list.insertAdjacentHTML('beforeend', `
      <div class="rp-tag-row" data-rinc="${i}">
        <input class="rp-input rp-rinc-item" value="" placeholder="Item ${i+1}">
        <button class="rp-tag-remove" data-remove-rinc="${i}" title="Remove">×</button>
      </div>
    `);
    _bindRemoveListeners('#rrf-included-list', '[data-remove-rinc]', '.rp-tag-row[data-rinc]');
  });

  _bindRemoveListeners('#rrf-learn-list',    '[data-remove-rlearn]', '.rp-tag-row[data-rlearn]');
  _bindRemoveListeners('#rrf-included-list', '[data-remove-rinc]',   '.rp-tag-row[data-rinc]');

  // ─── Articles ─────────────────────────────────────
  area.querySelector('#rp-article-add')?.addEventListener('click', () => {
    _editMode = 'add';
    _editData = { featured: false, date: new Date().toISOString().split('T')[0] };
    _renderSection();
  });

  area.querySelectorAll('[data-art-edit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.artEdit);
      _editMode = 'edit'; _editIndex = i;
      _editData = JSON.parse(JSON.stringify(getArticles()[i]));
      _renderSection();
    });
  });

  area.querySelectorAll('[data-art-del]').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.artDel);
      if (!confirm(`Delete "${getArticles()[i].title}"?`)) return;
      setArticles(getArticles().filter((_, idx) => idx !== i));
      _toast('Article deleted.');
      _renderSection();
    });
  });

  area.querySelector('#rp-back-blog')?.addEventListener('click',  () => { _editMode = null; _editData = null; _renderSection(); });
  area.querySelector('#rp-back-blog2')?.addEventListener('click', () => { _editMode = null; _editData = null; _renderSection(); });

  area.querySelector('#rp-article-save')?.addEventListener('click', () => {
    const title = document.getElementById('af-title')?.value.trim();
    const slug  = document.getElementById('af-slug')?.value.trim();
    if (!title || !slug) { _toast('Title and slug are required.', 'error'); return; }

    const item = {
      id: _editMode === 'add' ? Date.now() : (_editData.id || Date.now()),
      slug, title,
      excerpt:     document.getElementById('af-excerpt')?.value.trim() || '',
      category:    document.getElementById('af-category')?.value || 'Personal Finance',
      categorySlug:document.getElementById('af-catslug')?.value || 'personal-finance',
      author:      document.getElementById('af-author')?.value.trim() || 'Aakash Das',
      date:        document.getElementById('af-date')?.value || new Date().toISOString().split('T')[0],
      readTime:    document.getElementById('af-readtime')?.value.trim() || '5 min read',
      thumbnail:   document.getElementById('af-thumb')?.value.trim() || null,
      featured:    document.getElementById('af-featured')?.checked || false,
      content:     document.getElementById('af-content')?.value || '',
    };

    const articles = getArticles();
    if (_editMode === 'add') articles.push(item);
    else articles[_editIndex] = item;
    setArticles(articles);
    _toast(`Article "${title}" saved!`);
    _editMode = null; _editData = null; _editIndex = null;
    _renderSection();
    _reloadPage();
  });

  // ─── Users ─────────────────────────────────────────
  area.querySelector('#rp-user-add')?.addEventListener('click', () => {
    _editMode = 'add';
    _editData = { assignedCourses: [] };
    _renderSection();
  });

  area.querySelectorAll('[data-user-edit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.userEdit);
      _editMode = 'edit'; _editIndex = i;
      _editData = JSON.parse(JSON.stringify(getUsers()[i]));
      _renderSection();
    });
  });

  area.querySelectorAll('[data-user-del]').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.userDel);
      const u = getUsers()[i];
      if (!confirm(`Delete user "${u.name || u.username}"? This cannot be undone.`)) return;
      setUsers(getUsers().filter((_, idx) => idx !== i));
      _toast('User deleted.');
      _renderSection();
    });
  });

  area.querySelector('#rp-back-users')?.addEventListener('click', () => {
    _editMode = null; _editData = null; _renderSection();
  });
  area.querySelector('#rp-back-users2')?.addEventListener('click', () => {
    _editMode = null; _editData = null; _renderSection();
  });

  area.querySelector('#rp-user-save')?.addEventListener('click', async () => {
    const username = document.getElementById('uf-username')?.value.trim();
    const password = document.getElementById('uf-password')?.value;
    const name     = document.getElementById('uf-name')?.value.trim();
    const email    = document.getElementById('uf-email')?.value.trim();

    if (!username) { _toast('Username is required.', 'error'); return; }
    if (_editMode === 'add' && !password) { _toast('Password is required.', 'error'); return; }

    // Check for duplicate username on add
    if (_editMode === 'add') {
      const existing = getUsers().find(u => u.username.toLowerCase() === username.toLowerCase());
      if (existing) { _toast('Username already exists.', 'error'); return; }
    }

    // Collect assigned courses
    const assignedCourses = [...document.querySelectorAll('.uf-course-check:checked')]
      .map(el => el.dataset.slug);

    // Hash password if provided
    let passwordHash = _editData?.passwordHash || '';
    if (password) {
      passwordHash = await hashPassword(password);
    }

    const item = {
      id: _editMode === 'add' ? Date.now() : (_editData.id || Date.now()),
      username,
      passwordHash,
      name: name || username,
      email: email || '',
      assignedCourses,
      createdAt: _editMode === 'add' ? new Date().toISOString().split('T')[0] : (_editData.createdAt || new Date().toISOString().split('T')[0]),
    };

    const users = getUsers();
    if (_editMode === 'add') users.push(item);
    else users[_editIndex] = item;
    setUsers(users);
    _toast(`User "${item.name}" saved!`);
    _editMode = null; _editData = null; _editIndex = null;
    _renderSection();
  });

  // ─── Settings ─────────────────────────────────────
  area.querySelector('#rp-settings-save')?.addEventListener('click', () => {
    const existing = getSettings();
    const s = {
      ...existing,
      whatsapp: document.getElementById('st-whatsapp')?.value.trim() || '+9779761145115',
      siteName: document.getElementById('st-sitename')?.value.trim()  || 'risePaisa',
      tagline:  existing.tagline,
      social: {
        youtube:   document.getElementById('st-yt')?.value.trim() || '#',
        tiktok:    document.getElementById('st-tt')?.value.trim() || '#',
        instagram: document.getElementById('st-ig')?.value.trim() || '#',
        facebook:  document.getElementById('st-fb')?.value.trim() || '#',
      }
    };
    setSettings(s);
    _toast('Settings saved! ✓ Social links & WhatsApp updated.');
  });

  // Change admin password
  area.querySelector('#rp-change-pass')?.addEventListener('click', async () => {
    const curPass = document.getElementById('st-cur-pass')?.value;
    const newPass = document.getElementById('st-new-pass')?.value;
    const confirmPass = document.getElementById('st-confirm-pass')?.value;

    if (!curPass || !newPass || !confirmPass) {
      _toast('All password fields are required.', 'error'); return;
    }
    if (newPass !== confirmPass) {
      _toast('New passwords do not match.', 'error'); return;
    }
    if (newPass.length < 4) {
      _toast('Password must be at least 4 characters.', 'error'); return;
    }

    // Verify current password
    const ok = await _verify(curPass);
    if (!ok) {
      _toast('Current password is incorrect.', 'error'); return;
    }

    // Hash and save new password
    const newHash = await hashPassword(newPass);
    setAdminPasswordHash(newHash);
    _toast('Admin password changed successfully! ✓');
    document.getElementById('st-cur-pass').value = '';
    document.getElementById('st-new-pass').value = '';
    document.getElementById('st-confirm-pass').value = '';
  });

  // Contact links save
  area.querySelector('#rp-contact-links-save')?.addEventListener('click', () => {
    const s = getSettings();
    s.contactLinks = {
      risepaisa: {
        tiktok:    document.getElementById('cl-rp-tiktok')?.value.trim() || '',
        instagram: document.getElementById('cl-rp-instagram')?.value.trim() || '',
        facebook:  document.getElementById('cl-rp-facebook')?.value.trim() || '',
        youtube:   document.getElementById('cl-rp-youtube')?.value.trim() || '',
        twitter:   document.getElementById('cl-rp-twitter')?.value.trim() || '',
        linkedin:  document.getElementById('cl-rp-linkedin')?.value.trim() || '',
      },
      aakash: {
        tiktok:    document.getElementById('cl-ak-tiktok')?.value.trim() || '',
        instagram: document.getElementById('cl-ak-instagram')?.value.trim() || '',
        facebook:  document.getElementById('cl-ak-facebook')?.value.trim() || '',
        youtube:   document.getElementById('cl-ak-youtube')?.value.trim() || '',
        twitter:   document.getElementById('cl-ak-twitter')?.value.trim() || '',
        linkedin:  document.getElementById('cl-ak-linkedin')?.value.trim() || '',
      }
    };
    setSettings(s);
    _toast('Contact links saved! ✓');
  });

  // Navbar settings save
  area.querySelector('#rp-navbar-save')?.addEventListener('click', () => {
    const s = getSettings();
    if (!s.navItems) s.navItems = {};
    s.navItems.personalConsultancy = {
      enabled: document.getElementById('st-pc-enabled')?.checked ?? true,
      label: document.getElementById('st-pc-label')?.value.trim() || 'Personal Consultancy',
      path: document.getElementById('st-pc-path')?.value.trim() || '#/consultancy',
    };
    setSettings(s);
    _toast('Navbar settings saved! ✓');
    _reloadPage();
  });

  // Content pages save
  area.querySelector('#rp-content-pages-save')?.addEventListener('click', () => {
    const s = getSettings();
    if (!s.pages) s.pages = {};
    ['privacy', 'terms', 'disclaimer'].forEach(key => {
      s.pages[key] = {
        title: document.getElementById(`cp-${key}-title`)?.value.trim() || '',
        lastUpdated: document.getElementById(`cp-${key}-updated`)?.value.trim() || '',
        content: document.getElementById(`cp-${key}-content`)?.value || '',
      };
    });

    s.pages.consultancy = {
      title: document.getElementById('cp-consultancy-title')?.value.trim() || '',
      buttonText: document.getElementById('cp-consultancy-btn')?.value.trim() || '',
      description: document.getElementById('cp-consultancy-desc')?.value.trim() || '',
      pricingText: document.getElementById('cp-consultancy-pricing')?.value.trim() || '',
      priceValue: document.getElementById('cp-consultancy-price-val')?.value.trim() || '',
      duration: document.getElementById('cp-consultancy-duration')?.value.trim() || '',
    };

    setSettings(s);
    _toast('Content pages saved! ✓');
  });

  // Bind image upload widgets
  _bindImageUploads();
}

// ── Dynamic remove list helpers ───────────────────────
function _bindRemoveListeners(listSelector, btnSelector, rowSelector) {
  const list = document.querySelector(listSelector);
  if (!list) return;
  list.querySelectorAll(btnSelector).forEach(btn => {
    btn.onclick = null;
    btn.addEventListener('click', e => {
      e.preventDefault();
      const rows = list.querySelectorAll(rowSelector.split('[')[0] + '[' + rowSelector.split('[')[1]);
      if (rows.length <= 1) return; // keep at least one
      btn.closest('.rp-tag-row')?.remove();
    });
  });
}

function _bindCurriculumEvents() {
  const list = document.getElementById('rf-curriculum-list');
  if (!list) return;

  list.querySelectorAll('[data-remove-module]').forEach(btn => {
    btn.onclick = () => {
      const modules = list.querySelectorAll('[data-module]');
      if (modules.length <= 1) return;
      btn.closest('.rp-module-card')?.remove();
    };
  });

  list.querySelectorAll('.rp-add-lesson').forEach(btn => {
    btn.onclick = () => {
      const mi = btn.dataset.mod;
      const lessonsContainer = document.getElementById(`rf-lessons-${mi}`);
      const li = lessonsContainer.querySelectorAll('.rp-lesson-block').length;
      const block = document.createElement('div');
      block.className = 'rp-lesson-block';
      block.dataset.lessonRow = `${mi}-${li}`;
      block.innerHTML = `
        <div class="rp-lesson-title-row">
          <input class="rp-input rp-lesson-item" data-mod="${mi}" data-lesson="${li}" value="" placeholder="Lesson title">
          <button class="rp-tag-remove" data-remove-lesson="${mi}-${li}" title="Remove">×</button>
        </div>
        <div class="rp-lesson-extras">
          <input class="rp-input rp-lesson-url" data-mod="${mi}" data-lesson="${li}" value="" placeholder="YouTube URL (e.g. https://youtu.be/VIDEO_ID)">
          <textarea class="rp-textarea rp-lesson-desc" data-mod="${mi}" data-lesson="${li}" rows="2" placeholder="Lesson description (optional)"></textarea>
        </div>
      `;
      btn.before(block);
      _bindLessonRemoveEvents(lessonsContainer);
    };
  });

  list.querySelectorAll('[data-remove-lesson]').forEach(btn => {
    btn.onclick = () => {
      const mi = btn.dataset.removeLesson.split('-')[0];
      const container = document.getElementById(`rf-lessons-${mi}`);
      const rows = container.querySelectorAll('.rp-lesson-block');
      if (rows.length <= 1) return;
      btn.closest('.rp-lesson-block')?.remove();
    };
  });
}

function _bindLessonRemoveEvents(container) {
  container.querySelectorAll('[data-remove-lesson]').forEach(btn => {
    btn.onclick = () => {
      const rows = container.querySelectorAll('.rp-lesson-block');
      if (rows.length <= 1) return;
      btn.closest('.rp-lesson-block')?.remove();
    };
  });
}

// ── Image Upload Widget ───────────────────────────────
const _ALLOWED_IMG_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const _MAX_IMG_SIZE = 2 * 1024 * 1024; // 2MB

function _renderImageUpload(fieldId, currentValue) {
  const hasImage = currentValue && currentValue.length > 0;
  return `
    <div class="rp-img-upload" data-img-field="${fieldId}">
      <input type="hidden" id="${fieldId}" value="${_esc(currentValue)}">
      <div class="rp-img-preview ${hasImage ? 'has-image' : ''}">
        ${hasImage ? `<img src="${_esc(currentValue)}" alt="Preview">` : '<span class="rp-img-placeholder">No image selected</span>'}
      </div>
      <div class="rp-img-actions">
        <label class="rp-btn rp-btn-primary rp-btn-sm rp-img-upload-label">
          📷 ${hasImage ? 'Replace' : 'Upload'}
          <input type="file" accept=".jpg,.jpeg,.png,.webp" class="rp-img-file-input" data-target="${fieldId}" hidden>
        </label>
        ${hasImage ? `<button class="rp-btn rp-btn-danger rp-btn-sm rp-img-remove" data-target="${fieldId}" type="button">✕ Remove</button>` : ''}
      </div>
      <div class="rp-img-info">Max 2MB · JPG, PNG, WEBP</div>
    </div>
  `;
}

function _bindImageUploads() {
  document.querySelectorAll('.rp-img-file-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const targetId = input.dataset.target;

      // Validate type
      if (!_ALLOWED_IMG_TYPES.includes(file.type)) {
        _toast('Invalid file type. Use JPG, PNG, or WEBP.', 'error');
        input.value = '';
        return;
      }
      // Validate size
      if (file.size > _MAX_IMG_SIZE) {
        _toast('File too large. Maximum size is 2MB.', 'error');
        input.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        const hiddenInput = document.getElementById(targetId);
        if (hiddenInput) hiddenInput.value = dataUrl;

        // Update preview
        const container = document.querySelector(`.rp-img-upload[data-img-field="${targetId}"]`);
        if (container) {
          const preview = container.querySelector('.rp-img-preview');
          preview.classList.add('has-image');
          preview.innerHTML = `<img src="${dataUrl}" alt="Preview">`;
          // Show remove button
          const actions = container.querySelector('.rp-img-actions');
          if (!actions.querySelector('.rp-img-remove')) {
            actions.insertAdjacentHTML('beforeend', `<button class="rp-btn rp-btn-danger rp-btn-sm rp-img-remove" data-target="${targetId}" type="button">✕ Remove</button>`);
            _bindImageRemoveBtn(container);
          }
          // Update label text
          const label = actions.querySelector('.rp-img-upload-label');
          if (label) label.childNodes[0].textContent = '📷 Replace ';
        }
        _toast('Image loaded! Remember to save.');
      };
      reader.readAsDataURL(file);
    });
  });

  document.querySelectorAll('.rp-img-upload').forEach(container => {
    _bindImageRemoveBtn(container);
  });
}

function _bindImageRemoveBtn(container) {
  container.querySelectorAll('.rp-img-remove').forEach(btn => {
    btn.onclick = () => {
      const targetId = btn.dataset.target;
      const hiddenInput = document.getElementById(targetId);
      if (hiddenInput) hiddenInput.value = '';
      const preview = container.querySelector('.rp-img-preview');
      preview.classList.remove('has-image');
      preview.innerHTML = '<span class="rp-img-placeholder">No image selected</span>';
      btn.remove();
      // Update label text
      const label = container.querySelector('.rp-img-upload-label');
      if (label) label.childNodes[0].textContent = '📷 Upload ';
      // Clear file input
      const fileInput = container.querySelector('.rp-img-file-input');
      if (fileInput) fileInput.value = '';
    };
  });
}

// ── HTML escape helper ────────────────────────────────
function _esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ── Public init ───────────────────────────────────────
export function initAdmin() {
  // Expose trigger
  window.__openAdmin = _createAuthModal;
}
