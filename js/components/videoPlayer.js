// ==============================================
// risePaisa — Secure Video Player Component
// Embeds YouTube with best-effort DRM measures
// ==============================================

/**
 * Extract YouTube video ID from various URL formats.
 */
function extractYouTubeId(url) {
  if (!url) return null;
  // Standard embed
  let match = url.match(/embed\/([a-zA-Z0-9_-]{11})/);
  if (match) return match[1];
  // Watch URL
  match = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (match) return match[1];
  // Short URL
  match = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (match) return match[1];
  // Direct ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  return null;
}

/**
 * Render a secure YouTube embed with anti-copy protections.
 * @param {string} youtubeUrl — Any YouTube URL or embed URL
 * @param {string} [lessonTitle] — Optional title for accessibility
 * @returns {string} HTML string
 */
export function renderSecureVideo(youtubeUrl, lessonTitle = 'Lesson Video') {
  const videoId = extractYouTubeId(youtubeUrl);

  if (!videoId) {
    return `
      <div class="sv-container">
        <div class="sv-placeholder">
          <div class="sv-placeholder-icon">🎬</div>
          <p>Video coming soon</p>
        </div>
      </div>
    `;
  }

  // Secure embed params
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1&rel=0&controls=1&iv_load_policy=3&disablekb=0&fs=1&cc_load_policy=0&playsinline=1`;

  return `
    <div class="sv-container" id="sv-container"
         oncontextmenu="return false"
         onselectstart="return false"
         ondragstart="return false">
      <div class="sv-wrapper">
        <iframe
          src="${embedUrl}"
          title="${lessonTitle}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          loading="lazy"
          referrerpolicy="no-referrer">
        </iframe>
        <div class="sv-overlay" id="sv-overlay"></div>
      </div>
    </div>
  `;
}

/**
 * Initialize anti-copy protections on the page.
 * Call after rendering the video.
 */
export function initVideoProtection() {
  const container = document.getElementById('sv-container');
  if (!container) return;

  // Disable right-click on container
  container.addEventListener('contextmenu', e => {
    e.preventDefault();
    return false;
  });

  // Disable common copy/save shortcuts
  document.addEventListener('keydown', function _svKeyHandler(e) {
    // Store the handler reference for cleanup
    if (!container.isConnected) {
      document.removeEventListener('keydown', _svKeyHandler);
      return;
    }

    const blocked = [
      (e.ctrlKey || e.metaKey) && e.key === 's',  // Save
      (e.ctrlKey || e.metaKey) && e.key === 'u',  // View source
      (e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I', // DevTools
      (e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'i',
      (e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J',
      (e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'j',
    ];

    if (blocked.some(Boolean)) {
      e.preventDefault();
      return false;
    }
  });

  // Make overlay transparent to clicks (allows play/pause)
  // but block right-click
  const overlay = document.getElementById('sv-overlay');
  if (overlay) {
    overlay.addEventListener('contextmenu', e => {
      e.preventDefault();
      return false;
    });
    // Pass through clicks to iframe
    overlay.style.pointerEvents = 'none';
    // But re-enable for right-click interception
    container.addEventListener('mousedown', e => {
      if (e.button === 2) { // right click
        e.preventDefault();
        overlay.style.pointerEvents = 'auto';
        setTimeout(() => { overlay.style.pointerEvents = 'none'; }, 200);
      }
    });
  }
}
