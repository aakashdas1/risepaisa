// ==============================================
// risePaisa — Premium UI Enhancements
// Scroll animations, parallax, particles,
// cursor glow, micro-interactions
// ==============================================

// ── Scroll-Reveal Observer ────────────────────
export function initScrollReveal() {
  const revealEls = document.querySelectorAll(
    '.card, .topic-card, .stat-item, .mission-card, .contact-info-card, ' +
    '.section-header, .about-teaser > *, .cta-banner, .founder-section > *, ' +
    '.accordion-item, .pricing-card, .filter-tabs'
  );

  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger within the same parent group
        const siblings = Array.from(entry.target.parentElement.children)
          .filter(el => el.classList.contains('card') ||
                        el.classList.contains('topic-card') ||
                        el.classList.contains('stat-item') ||
                        el.classList.contains('accordion-item'));
        const idx = siblings.indexOf(entry.target);
        const delay = siblings.length > 1 ? idx * 80 : 0;

        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

// ── Hero Mouse-Parallax Ambient Light ─────────
export function initHeroParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  let raf = null;
  let targetX = 20, targetY = 55;
  let currentX = 20, currentY = 55;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function animate() {
    currentX = lerp(currentX, targetX, 0.05);
    currentY = lerp(currentY, targetY, 0.05);
    heroBg.style.setProperty('--gx', currentX.toFixed(1) + '%');
    heroBg.style.setProperty('--gy', currentY.toFixed(1) + '%');
    raf = requestAnimationFrame(animate);
  }

  const hero = document.querySelector('.hero');
  if (!hero) return;

  function onMouseMove(e) {
    const rect = hero.getBoundingClientRect();
    targetX = ((e.clientX - rect.left) / rect.width) * 100;
    targetY = ((e.clientY - rect.top)  / rect.height) * 100;
  }

  hero.addEventListener('mousemove', onMouseMove, { passive: true });
  raf = requestAnimationFrame(animate);

  // Cleanup when section leaves viewport
  const cleanupObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) {
      cancelAnimationFrame(raf);
      hero.removeEventListener('mousemove', onMouseMove);
      cleanupObserver.disconnect();
    }
  }, { threshold: 0 });
  cleanupObserver.observe(hero);
}

// ── Floating Particles in Hero ────────────────
export function initHeroParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  // Remove old particles
  hero.querySelectorAll('.hero-particle').forEach(p => p.remove());

  const count = window.innerWidth < 768 ? 4 : 8;
  const colors = [
    'rgba(29,161,242,0.6)',
    'rgba(77,184,255,0.4)',
    'rgba(139,92,246,0.35)',
    'rgba(255,255,255,0.3)',
  ];

  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div');
    dot.className = 'hero-particle';

    const size = 3 + Math.random() * 5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const top = 15 + Math.random() * 70;
    const right = 5 + Math.random() * 55;
    const dur = 6 + Math.random() * 8;
    const delay = Math.random() * 5;

    dot.style.cssText = `
      width:${size}px;height:${size}px;
      background:${color};
      top:${top}%;right:${right}%;
      box-shadow:0 0 ${size * 2}px ${color};
      animation:floatSlow ${dur}s ease-in-out infinite ${delay}s;
      border-radius:50%;
      position:absolute;z-index:0;pointer-events:none;
    `;
    hero.appendChild(dot);
  }
}

// ── Stat Counter with Ease ────────────────────
export function initPremiumStatCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const start = performance.now();

        // Mark started to avoid double trigger
        if (el.dataset.counted) return;
        el.dataset.counted = '1';

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Custom ease-out-expo
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => observer.observe(c));
}

// ── Button Press Micro-interaction ───────────
export function initButtonMicroInteractions() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousedown', () => {
      btn.style.transition = 'transform 80ms ease, box-shadow 80ms ease';
    });
    btn.addEventListener('mouseup', () => {
      btn.style.transition = '';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = '';
    });
  });
}

// ── Card Tilt Effect (subtle 3D) ──────────────
export function initCardTilt() {
  const cards = document.querySelectorAll('.card, .topic-card, .mission-card');
  if (window.innerWidth < 1024) return; // Desktop only

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
      card.style.transform = `translateY(-6px) rotateX(${-y}deg) rotateY(${x}deg)`;
      card.style.transition = 'transform 0.1s linear';
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s var(--ease-out)';
    });
  });
}

// ── Section Heading Glow Accent ───────────────
export function initHeadingGlow() {
  document.querySelectorAll('.section-header h2').forEach(h2 => {
    h2.style.cssText += `
      text-shadow: 0 0 40px rgba(29,161,242,0.15);
    `;
  });
}

// ── Navbar Active Link Indicator ──────────────
export function enhanceActiveNavLink() {
  const active = document.querySelector('.nav-link.active');
  if (active) {
    active.style.textShadow = '0 0 12px rgba(29,161,242,0.35)';
  }
}

// ── Smooth Anchor Highlight ───────────────────
export function initSmoothAnchorHighlight() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', () => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        target.style.transition = 'box-shadow 0.3s ease';
        target.style.boxShadow = '0 0 0 2px rgba(29,161,242,0.3)';
        setTimeout(() => { target.style.boxShadow = ''; }, 1200);
      }
    });
  });
}

// ── Master Init ───────────────────────────────
export function initAllEnhancements() {
  // Run after a paint frame so DOM is fully rendered
  requestAnimationFrame(() => {
    initScrollReveal();
    initHeroParallax();
    initHeroParticles();
    initPremiumStatCounters();
    initButtonMicroInteractions();
    initCardTilt();
    initHeadingGlow();
    enhanceActiveNavLink();
  });
}
