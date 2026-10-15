/* HUMMER events: photo + video lightbox built for weak connections.
   - photos open instantly on the already-loaded thumbnail, then swap to the
     sharp version once it arrives (medium size on phones and slow links)
   - videos use a low-bitrate file on 2G/3G/data-saver, show a buffering
     spinner, and offer a retry if the network drops */
(function () {
  const groups = document.querySelectorAll('[data-ev-group]');
  if (!groups.length) return;

  const conn = navigator.connection || {};
  const slow = () => !!(conn.saveData || /(^|-)2g$|3g/.test(conn.effectiveType || ''));
  const fullFor = (el) => (slow() || window.innerWidth <= 900) && el.dataset.mid ? el.dataset.mid : el.dataset.full;
  const videoFor = (el) => (slow() && el.dataset.videoLow) || el.dataset.video;

  let box, stage, cap, prev, next, items = [], idx = 0, opener = null, x0 = null, token = 0;
  const ICON = (d) => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

  function build() {
    box = document.createElement('div');
    box.className = 'evlb';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Event gallery');
    box.innerHTML =
      `<button class="evlb-btn evlb-close" type="button" aria-label="Close">${ICON('<path d="M18 6L6 18M6 6l12 12"/>')}</button>` +
      `<button class="evlb-btn evlb-prev" type="button" aria-label="Previous">${ICON('<path d="M15 18l-6-6 6-6"/>')}</button>` +
      `<div class="evlb-stage"></div><p class="evlb-cap"></p>` +
      `<button class="evlb-btn evlb-next" type="button" aria-label="Next">${ICON('<path d="M9 18l6-6-6-6"/>')}</button>`;
    document.body.appendChild(box);
    stage = box.querySelector('.evlb-stage');
    cap = box.querySelector('.evlb-cap');
    prev = box.querySelector('.evlb-prev');
    next = box.querySelector('.evlb-next');
    box.querySelector('.evlb-close').addEventListener('click', close);
    prev.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));
    box.addEventListener('click', (e) => { if (e.target === box || e.target === stage) close(); });
    box.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    });
    document.addEventListener('keydown', (e) => {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'Tab') {
        const f = [...box.querySelectorAll('button:not([hidden])')];
        const i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
  }

  function status(html) {
    let m = stage.querySelector('.evlb-status');
    if (!m) { m = document.createElement('div'); m.className = 'evlb-status'; stage.appendChild(m); }
    m.innerHTML = html;
    return m;
  }
  const clearStatus = () => { const m = stage.querySelector('.evlb-status'); if (m) m.remove(); };
  const retryBtn = (label) => `<span>${label}</span><button type="button" class="evlb-retry">Try again</button>`;

  function showPhoto(el, my) {
    const thumb = document.createElement('img');
    thumb.src = el.dataset.thumb || el.querySelector('img').currentSrc;
    thumb.alt = el.dataset.alt || '';
    thumb.className = 'evlb-ph';
    stage.appendChild(thumb);
    status('<span class="evlb-spin" aria-hidden="true"></span>');

    const load = () => {
      const big = new Image();
      big.decoding = 'async';
      big.onload = () => {
        if (my !== token) return;
        big.alt = el.dataset.alt || '';
        stage.textContent = '';
        stage.appendChild(big);
        preloadNeighbours();
      };
      big.onerror = () => {
        if (my !== token) return;
        const m = status(retryBtn('Photo could not load.'));
        m.querySelector('.evlb-retry').addEventListener('click', () => { status('<span class="evlb-spin" aria-hidden="true"></span>'); load(); });
      };
      big.src = fullFor(el);
    };
    load();
  }

  function showVideo(el, my) {
    const v = document.createElement('video');
    v.controls = true;
    v.playsInline = true;
    v.preload = 'metadata';
    v.poster = el.querySelector('img').currentSrc || el.querySelector('img').src;
    stage.appendChild(v);
    status('<span class="evlb-spin" aria-hidden="true"></span>');
    const src = videoFor(el);
    const start = () => { v.src = src; v.play().catch(() => {}); };
    v.addEventListener('waiting', () => { if (my === token) status('<span class="evlb-spin" aria-hidden="true"></span>'); });
    ['playing', 'canplay', 'pause'].forEach((ev) => v.addEventListener(ev, clearStatus));
    v.addEventListener('error', () => {
      if (my !== token) return;
      const m = status(retryBtn('Video could not load. Check your connection.'));
      m.querySelector('.evlb-retry').addEventListener('click', () => { status('<span class="evlb-spin" aria-hidden="true"></span>'); start(); });
    });
    start();
  }

  // quietly fetch the next/previous photo, only on a good connection
  function preloadNeighbours() {
    if (slow() || items.length < 2) return;
    [1, -1].forEach((d) => {
      const el = items[(idx + d + items.length) % items.length];
      if (el.dataset.full) new Image().src = fullFor(el);
    });
  }

  function show() {
    const my = ++token;
    const el = items[idx];
    const old = stage.querySelector('video');
    if (old) { old.pause(); old.removeAttribute('src'); old.load(); }
    stage.textContent = '';
    cap.textContent = el.dataset.alt || '';
    prev.hidden = next.hidden = items.length < 2;
    if (el.dataset.video) showVideo(el, my); else showPhoto(el, my);
  }

  function go(d) { idx = (idx + d + items.length) % items.length; show(); }

  function open(list, i, trigger) {
    if (!box) build();
    items = list; idx = i; opener = trigger;
    show();
    box.classList.add('is-open');
    document.body.classList.add('evlb-open');
    requestAnimationFrame(() => box.classList.add('is-visible'));
    box.querySelector('.evlb-close').focus();
  }

  function close() {
    token++;
    box.classList.remove('is-visible');
    document.body.classList.remove('evlb-open');
    const v = stage.querySelector('video');
    if (v) { v.pause(); v.removeAttribute('src'); v.load(); }
    setTimeout(() => { box.classList.remove('is-open'); stage.textContent = ''; }, 200);
    if (opener) opener.focus();
  }

  groups.forEach((g) => {
    const list = [...g.querySelectorAll('.ev-media')];
    list.forEach((el, i) => el.addEventListener('click', () => open(list, i, el)));
  });
})();
