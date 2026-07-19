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
        <div class="vlb-spinner" id="vlb-spinner"></div>
        <video id="vlb-video" playsinline controls></video>
      </div>
      <div class="vlb-caption" id="vlb-caption"></div>`;

    document.body.appendChild(overlay);
    video = overlay.querySelector('#vlb-video');
    caption = overlay.querySelector('#vlb-caption');
    const spinner = overlay.querySelector('#vlb-spinner');

    // Show spinner when video is loading or buffering
    video.addEventListener('loadstart', () => spinner.classList.add('active'));
    video.addEventListener('waiting', () => spinner.classList.add('active'));

    // Hide spinner when video is ready, playing, or paused/errored
    video.addEventListener('playing', () => spinner.classList.remove('active'));
    video.addEventListener('canplay', () => spinner.classList.remove('active'));
    video.addEventListener('pause', () => spinner.classList.remove('active'));
    video.addEventListener('error', () => spinner.classList.remove('active'));

    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLightbox(); });
    overlay.querySelector('#vlb-close').addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('vlb-visible')) closeLightbox();
    });
  }

  let hlsInstance = null;

  function destroyHls() {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  }

  function loadHlsLibrary(callback) {
    if (window.Hls) {
      callback(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.8/dist/hls.min.js';
    script.onload = () => callback(true);
    script.onerror = () => {
      console.warn('Failed to load Hls.js library from CDN');
      callback(false);
    };
    document.head.appendChild(script);
  }

  function openLightbox(src, captionText, landscape) {
    buildOverlay();
    caption.textContent = captionText || '';
    overlay.querySelector('#vlb-inner').classList.toggle('vlb-inner-landscape', !!landscape);
    document.body.classList.add('vlb-open');
    overlay.style.display = 'flex';
    
    requestAnimationFrame(() => requestAnimationFrame(() => {
      overlay.classList.add('vlb-visible');
    }));

    // Resolve adaptive streaming playlist path (.m3u8)
    let hlsSrc = src;
    if (src.endsWith('.mp4')) {
      const parts = src.split('/');
      const filename = parts.pop().replace('.mp4', '.m3u8');
      hlsSrc = [...parts, 'hls', filename].join('/');
    }

    destroyHls();

    // 1. Play native HLS if supported (Safari / iOS)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsSrc;
      video.play().catch(() => {});
    } 
    // 2. Play adaptive HLS using Hls.js (Chrome / Firefox / Edge / Android)
    else {
      loadHlsLibrary((loaded) => {
        if (loaded && window.Hls && Hls.isSupported()) {
          hlsInstance = new Hls({
            maxBufferLength: 8,
            maxMaxBufferLength: 16,
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(hlsSrc);
          hlsInstance.attachMedia(video);
          hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {});
          });
          hlsInstance.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              console.warn('Hls.js fatal error, falling back to progressive MP4:', data);
              destroyHls();
              video.src = src; // fallback to progressive MP4
              video.play().catch(() => {});
            }
          });
        } else {
          // Fallback to progressive MP4
          video.src = src;
          video.play().catch(() => {});
        }
      });
    }
  }

  function closeLightbox() {
    if (!overlay) return;
    overlay.classList.remove('vlb-visible');
    document.body.classList.remove('vlb-open');
    video.pause();
    destroyHls();
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
          const testVideo = document.createElement('video');
          if (testVideo.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari / iOS HLS manifest preload
            let hlsSrc = videoUrl;
            if (videoUrl.endsWith('.mp4')) {
              const parts = videoUrl.split('/');
              const filename = parts.pop().replace('.mp4', '.m3u8');
              hlsSrc = [...parts, 'hls', filename].join('/');
            }
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = hlsSrc;
            document.head.appendChild(link);
          } else {
            // Chrome / Firefox progressive MP4 preload
            const preloadVideo = document.createElement('video');
            preloadVideo.src = videoUrl;
            preloadVideo.preload = 'auto';
          }
        }
      }, { once: true });

      card.addEventListener('click', () => {
        openLightbox(card.dataset.video, card.dataset.caption, card.dataset.landscape === 'true');
      });
    });
  }

  function initInitialPreload() {
    // Wait for the window load event so we do not block critical rendering resources
    window.addEventListener('load', () => {
      setTimeout(() => {
        document.querySelectorAll('.field-video-card, .testimonial-quote-video').forEach((card) => {
          const videoUrl = card.dataset.video;
          if (videoUrl) {
            const testVideo = document.createElement('video');
            if (testVideo.canPlayType('application/vnd.apple.mpegurl')) {
              // Safari / iOS HLS manifest preload
              let hlsSrc = videoUrl;
              if (videoUrl.endsWith('.mp4')) {
                const parts = videoUrl.split('/');
                const filename = parts.pop().replace('.mp4', '.m3u8');
                hlsSrc = [...parts, 'hls', filename].join('/');
              }
              const link = document.createElement('link');
              link.rel = 'prefetch';
              link.href = hlsSrc;
              document.head.appendChild(link);
            } else {
              // Chrome / Firefox progressive MP4 preload
              const preloadVideo = document.createElement('video');
              preloadVideo.src = videoUrl;
              preloadVideo.preload = 'auto';
              preloadVideo.muted = true;
            }
          }
        });
      }, 1000); // 1-second delay after full load to ensure idle bandwidth
    });
  }

  function init() {
    initLangSwitch();
    initFilterTabs();
    initCards();
    initRailArrows();
    initInitialPreload();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
