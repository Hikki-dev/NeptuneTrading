/* ── Field Video Showcase — language + scenario filter, lightbox ── */
(function () {
  let overlay, video, caption;
  let currentLang = 'all';
  let currentScenario = 'all';

  function buildOverlay() {
    if (document.getElementById('vlb-overlay')) return;

    overlay = document.createElement('div');
    overlay.className = 'vlb-overlay';
    overlay.id = 'vlb-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Video player');

    overlay.innerHTML = `
      <button class="vlb-close" id="vlb-close" aria-label="Close video">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <div class="vlb-inner" id="vlb-inner">
        <video id="vlb-video" playsinline controls></video>
      </div>
      <div class="vlb-caption" id="vlb-caption"></div>`;

    document.body.appendChild(overlay);
    video = overlay.querySelector('#vlb-video');
    caption = overlay.querySelector('#vlb-caption');

    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLightbox(); });
    overlay.querySelector('#vlb-close').addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('vlb-visible')) closeLightbox();
    });
  }

  function openLightbox(src, captionText, landscape) {
    buildOverlay();
    video.src = src;
    caption.textContent = captionText || '';
    overlay.querySelector('#vlb-inner').classList.toggle('vlb-inner-landscape', !!landscape);
    document.body.classList.add('vlb-open');
    overlay.style.display = 'flex';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      overlay.classList.add('vlb-visible');
      video.play().catch(() => {});
    }));
  }

  function closeLightbox() {
    if (!overlay) return;
    overlay.classList.remove('vlb-visible');
    document.body.classList.remove('vlb-open');
    video.pause();
    setTimeout(() => { overlay.style.display = 'none'; video.src = ''; }, 230);
  }

  function applyFilters() {
    const rail = document.getElementById('field-video-rail');
    if (!rail) return;
    rail.querySelectorAll('.field-video-card').forEach((card) => {
      const scenarioMatch = currentScenario === 'all' || card.dataset.category === currentScenario;
      const langMatch = currentLang === 'all' || card.dataset.lang === currentLang;
      card.classList.toggle('filter-hidden', !(scenarioMatch && langMatch));
    });
    rail.scrollTo({ left: 0 });
    requestAnimationFrame(updateRailArrows);
  }

  let updateRailArrows = () => {};

  function initRailArrows() {
    const rail = document.getElementById('field-video-rail');
    const prevBtn = document.querySelector('[data-rail-arrow="prev"]');
    const nextBtn = document.querySelector('[data-rail-arrow="next"]');
    if (!rail || !prevBtn || !nextBtn) return;

    const scrollByCard = (dir) => {
      const card = rail.querySelector('.field-video-card:not(.filter-hidden)');
      const amount = (card ? card.getBoundingClientRect().width + 18 : 220) * dir;
      rail.scrollBy({ left: amount, behavior: 'smooth' });
    };

    updateRailArrows = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      prevBtn.disabled = rail.scrollLeft <= 4;
      nextBtn.disabled = max <= 4 || rail.scrollLeft >= max - 4;
    };

    prevBtn.addEventListener('click', () => scrollByCard(-1));
    nextBtn.addEventListener('click', () => scrollByCard(1));
    rail.addEventListener('scroll', updateRailArrows, { passive: true });
    window.addEventListener('resize', updateRailArrows);
    updateRailArrows();
  }

  function initLangSwitch() {
    const buttons = document.querySelectorAll('.field-lang-btn');
    if (!buttons.length) return;
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        currentLang = btn.dataset.lang;
        buttons.forEach((b) => b.classList.toggle('active', b === btn));
        applyFilters();
      });
    });
  }

  function initFilterTabs() {
    const tabs = document.querySelectorAll('.field-filter-tab');
    if (!tabs.length) return;
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        currentScenario = tab.dataset.filter;
        tabs.forEach((t) => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        applyFilters();
      });
    });
  }

  function initCards() {
    document.querySelectorAll('.field-video-card, .testimonial-quote-video').forEach((card) => {
      // Preload video on hover to ensure instant playback upon click
      card.addEventListener('mouseenter', () => {
        const videoUrl = card.dataset.video;
        if (videoUrl) {
          const preloadVideo = document.createElement('video');
          preloadVideo.src = videoUrl;
          preloadVideo.preload = 'auto';
        }
      }, { once: true });

      card.addEventListener('click', () => {
        openLightbox(card.dataset.video, card.dataset.caption, card.dataset.landscape === 'true');
      });
    });
  }

  function init() {
    initLangSwitch();
    initFilterTabs();
    initCards();
    initRailArrows();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
