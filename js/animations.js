/* ============================================
   NEPTUNE TRADING | ANIMATIONS & INTERACTIONS
   UI/UX Pro Max System
   ============================================ */

(function() {
  'use strict';


  /* ─── 1. NAVBAR SCROLL BEHAVIOUR ─────────────────────── */
  window.addEventListener('scroll', () => {
    document.documentElement.style.setProperty('--scroll-y', window.scrollY);
  }, { passive: true });

  /* ─── 2. SCROLL REVEAL ────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Keep observing for repeat animations if needed
        // revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ─── 3. ANIMATED COUNTERS ────────────────────────────── */
  function animateCounter(el, target, duration = 2000, suffix = '') {
    const isDecimal = target % 1 !== 0;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = isDecimal
        ? target.toFixed(1) + suffix
        : Math.round(target).toLocaleString() + suffix;
      return;
    }

    let start = 0;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = start + (target - start) * eased;
      el.textContent = isDecimal
        ? current.toFixed(1) + suffix
        : Math.round(current).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        const target = parseFloat(entry.target.dataset.target);
        const suffix = entry.target.dataset.suffix || '';
        const duration = parseInt(entry.target.dataset.duration) || 2000;
        animateCounter(entry.target, target, duration, suffix);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-counter]').forEach(el => {
    counterObserver.observe(el);
  });

  /* ─── 4. PARALLAX ─────────────────────────────────────── */
  const parallaxEls = document.querySelectorAll('[data-parallax]');

  if (parallaxEls.length) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          parallaxEls.forEach(el => {
            const speed  = parseFloat(el.dataset.parallax) || 0.3;
            const rect   = el.getBoundingClientRect();
            const center = rect.top + rect.height / 2;
            const offset = (window.innerHeight / 2 - center) * speed;
            el.style.transform = `translateY(${offset}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ─── 5. HOVER DEPTH (CARD TILT) ──────────────────────── */
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const intensity = parseFloat(card.dataset.tiltIntensity) || 6;
      card.style.transform = `perspective(800px) rotateY(${dx * intensity}deg) rotateX(${-dy * intensity}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ─── 6. SMOOTH ACTIVE NAV ─────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  /* ─── 7. HERO GLOBE PARTICLES ──────────────────────────── */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    let animationFrameId = null;
    let isAnimated = false;
    const isMobile = window.matchMedia('(max-width: 768px)');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    const particles = [];
    const NUM = 60;

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < NUM; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.5 + 0.1,
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach(q => {
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(96,165,250,${(1 - dist / 100) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96,165,250,${p.alpha})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height)  p.vy *= -1;
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    }

    function startAnimation() {
      if (!isAnimated && !isMobile.matches) {
        isAnimated = true;
        resizeCanvas();
        initParticles();
        drawParticles();
      }
    }

    function stopAnimation() {
      if (isAnimated) {
        isAnimated = false;
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    window.addEventListener('resize', () => {
      if (isAnimated && !isMobile.matches) {
        resizeCanvas();
      } else if (isMobile.matches) {
        stopAnimation();
      }
    });

    const heroSection = document.getElementById('home') || canvas.closest('section');
    if (heroSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !isMobile.matches) {
            startAnimation();
          } else {
            stopAnimation();
          }
        });
      }, { threshold: 0.05 });
      observer.observe(heroSection);
    } else {
      if (!isMobile.matches) {
        startAnimation();
      }
    }
  }

  /* ─── 8. MAP ROUTE ANIMATION TRIGGER ──────────────────── */
  const mapSection = document.getElementById('reach');
  if (mapSection) {
    const mapObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.map-route-line').forEach(line => {
            line.style.animation = 'none';
            void line.offsetWidth;
            line.style.animation = '';
          });
        }
      });
    }, { threshold: 0.3 });
    mapObserver.observe(mapSection);
  }

  /* ─── 9. PAGE LOAD SEQUENCE ────────────────────────────── */
  document.documentElement.classList.add('js-loaded');

  /* ─── 10. SMOOTH ANCHOR SCROLL ─────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── 11. SERVICE CARD STAGGER ─────────────────────────── */
  const servicesSection = document.getElementById('services');
  if (servicesSection) {
    const cards = servicesSection.querySelectorAll('.service-card');
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cards.forEach((card, i) => {
            card.style.transitionDelay = `${i * 0.08}s`;
            card.classList.add('in-view');
          });
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    cards.forEach(card => card.classList.add('reveal'));
    cardObserver.observe(servicesSection);
  }

  // Bento Cards Hover Glow Effect
  const bentoCards = document.querySelectorAll('.bento-card');
  if (bentoCards.length > 0) {
    bentoCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
      });
    });
  }

  /* ─── 13. MAGNETIC BUTTONS ───────────────────────────────────── */
  document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rect = btn.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width  / 2);
      const dy = e.clientY - (rect.top  + rect.height / 2);
      btn.style.transform = `translate(${dx * 0.18}px, ${dy * 0.18}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ─── 14. STAGGER GRID CARDS ON REVEAL ──────────────────────── */
  const staggerGrids = document.querySelectorAll('.grid-3, .grid-2');
  staggerGrids.forEach(grid => {
    const children = grid.children;
    Array.from(children).forEach((child, i) => {
      if (child.classList.contains('reveal') || child.closest('.reveal')) return;
      child.style.transitionDelay = `${i * 0.1}s`;
    });
  });

  // ─── Globe Scroll Hint — hide only at the end of the scrollable area ─────────────
  const globeScrollHint = document.getElementById('globe-scroll-hint');
  const globeCountriesEl = document.getElementById('globe-countries-scroll');
  if (globeScrollHint && globeCountriesEl) {
    const updateHintVisibility = () => {
      const maxScroll = globeCountriesEl.scrollWidth - globeCountriesEl.clientWidth;
      if (maxScroll <= 0 || globeCountriesEl.scrollLeft >= maxScroll - 15) {
        globeScrollHint.classList.add('hidden');
      } else {
        globeScrollHint.classList.remove('hidden');
      }
    };

    globeScrollHint.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      globeCountriesEl.scrollBy({ left: 160, behavior: 'smooth' });
    });

    globeCountriesEl.addEventListener('scroll', updateHintVisibility, { passive: true });
    window.addEventListener('resize', updateHintVisibility, { passive: true });
    
    // Initial check after elements render
    setTimeout(updateHintVisibility, 200);
  }

})();
