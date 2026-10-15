/* HUMMER events: photo + video lightbox with prev/next, keys and swipe */
(function () {
  const groups = document.querySelectorAll('[data-ev-group]');
  if (!groups.length) return;

  let box, stage, cap, prev, next, items = [], idx = 0, opener = null, x0 = null;
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

  function show() {
    const el = items[idx];
    stage.textContent = '';
    let node;
    if (el.dataset.video) {
      node = document.createElement('video');
      node.src = el.dataset.video;
      node.controls = true;
      node.playsInline = true;
      node.autoplay = true;
    } else {
      node = document.createElement('img');
      node.src = el.dataset.full;
      node.alt = el.dataset.alt || '';
    }
    stage.appendChild(node);
    cap.textContent = el.dataset.alt || '';
    prev.hidden = next.hidden = items.length < 2;
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
    box.classList.remove('is-visible');
    document.body.classList.remove('evlb-open');
    const v = stage.querySelector('video');
    if (v) v.pause();
    setTimeout(() => { box.classList.remove('is-open'); stage.textContent = ''; }, 200);
    if (opener) opener.focus();
  }

  groups.forEach((g) => {
    const list = [...g.querySelectorAll('.ev-media')];
    list.forEach((el, i) => el.addEventListener('click', () => open(list, i, el)));
  });
})();
