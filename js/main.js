/* ── HUMMER Category Filter Tabs ────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".hummer-filter-tab");
  const grid = document.getElementById("hummer-product-grid");
  if (!tabs.length || !grid) return;

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const filter = tab.dataset.filter;

      // Update active tab
      tabs.forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      // Show / hide cards
      grid.querySelectorAll(".product-card").forEach(card => {
        if (filter === "all" || card.dataset.category === filter) {
          card.classList.remove("filter-hidden");
        } else {
          card.classList.add("filter-hidden");
        }
      });
    });
  });
});

/* ── FAQ Accordion ──────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".faq-item").forEach((item, index) => {
    const question = item.querySelector(".faq-question");
    if (!question) return;
    // Open first item by default
    if (index === 0) item.classList.add("open");
    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      // Close all
      item.closest(".faq-grid").querySelectorAll(".faq-item").forEach(i => i.classList.remove("open"));
      // Toggle clicked
      if (!isOpen) item.classList.add("open");
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#year, [data-current-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  const navbar =
    document.getElementById("site-navbar") ||
    document.querySelector("[data-header]");
  const hamburger =
    document.querySelector(".nav-hamburger") ||
    document.querySelector("[data-nav-toggle]");
  const mobileMenu =
    document.getElementById("nav-mobile-menu") ||
    document.querySelector("[data-nav-links-mobile]");
  const progressBar =
    document.querySelector(".nav-scroll-progress") ||
    document.querySelector("[data-nav-progress]");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      hamburger.classList.toggle("open", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.querySelectorAll(".nav-mobile-services-toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const group = toggle.closest(".nav-mobile-services");
      const list = group?.querySelector(".nav-mobile-services-list");
      const isOpen = !list?.classList.contains("open");

      list?.classList.toggle("open", isOpen);
      group?.classList.toggle("open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  });

  document.querySelectorAll(".has-dropdown").forEach((dropdown) => {
    const trigger = dropdown.querySelector(".nav-link");
    const menu = dropdown.querySelector(".nav-dropdown");

    if (!trigger || !menu) return;

    trigger.addEventListener("focus", () => {
      menu.classList.add("open");
      trigger.setAttribute("aria-expanded", "true");
    });

    dropdown.addEventListener("focusout", (event) => {
      if (!dropdown.contains(event.relatedTarget)) {
        menu.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
      }
    });

    dropdown.addEventListener("mouseenter", () => {
      trigger.setAttribute("aria-expanded", "true");
    });

    dropdown.addEventListener("mouseleave", () => {
      trigger.setAttribute("aria-expanded", "false");
    });
  });

  const updateChrome = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    if (navbar) {
      navbar.classList.toggle("scrolled", scrollTop > 20);
      navbar.classList.toggle("at-top", scrollTop <= 20);
    }

    if (progressBar && scrollHeight > 0) {
      progressBar.style.width = `${(scrollTop / scrollHeight) * 100}%`;
    }
  };

  window.addEventListener("scroll", updateChrome, { passive: true });
  updateChrome();

  const revealEls = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right",
  );
  if (revealEls.length && !window.__neptuneRevealInitialized) {
    window.__neptuneRevealInitialized = true;
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  const businessAreaSelect = document.getElementById("business-area-select");
  const params = new URLSearchParams(window.location.search);
  if (businessAreaSelect) {
    const areaParam = params.get("area") || params.get("brand");
    const productDivision = params.get("division");
    
    let targetArea = "";
    if (productDivision) {
      const pd = productDivision.toLowerCase();
      if (pd.includes("hummer")) {
        targetArea = "HUMMER Power Products";
      } else if (pd.includes("metal") || pd.includes("alloy")) {
        targetArea = "Metal Alloys Corporation";
      } else {
        targetArea = "Strategic Sourcing Briefs";
      }
    } else if (areaParam) {
      const ap = areaParam.toLowerCase();
      if (ap.includes("tea") || ap.includes("spice") || ap.includes("fibre") || ap.includes("export")) {
        targetArea = "Ceylon Tea & Agricultural Exports";
      } else if (ap.includes("source") || ap.includes("procure")) {
        targetArea = "Strategic Sourcing Briefs";
      } else if (ap.includes("market") || ap.includes("entry") || ap.includes("expand")) {
        targetArea = "Market Entry Coordination";
      } else if (ap.includes("hummer")) {
        targetArea = "HUMMER Power Products";
      } else if (ap.includes("metal") || ap.includes("alloy") || ap.includes("metalco")) {
        targetArea = "Metal Alloys Corporation";
      }
    }

    if (targetArea) {
      for (const option of businessAreaSelect.options) {
        if (option.value.toLowerCase() === targetArea.toLowerCase()) {
          option.selected = true;
          break;
        }
      }
    }
  }

  const productDivision = params.get("division");
  const productCategory = params.get("category");
  const productFamily = params.get("product_family") || params.get("product-family") || params.get("family");
  if (productDivision || productCategory || productFamily) {
    const divisionField = document.getElementById("product-division-field");
    const categoryField = document.getElementById("product-category-field");
    const familyField = document.getElementById("product-family-field");
    const messageField = document.querySelector("[data-contact-form] textarea[name='message']");

    if (divisionField) divisionField.value = productDivision || "";
    if (categoryField) categoryField.value = productCategory || "";
    if (familyField) familyField.value = productFamily || "";

    if (messageField && !messageField.value.trim()) {
      const parts = [];
      if (productDivision) parts.push(`Division: ${productDivision}`);
      if (productCategory) parts.push(`Category: ${productCategory}`);
      if (productFamily) parts.push(`Product Family: ${productFamily}`);
      messageField.value = `Please send product information for the following requirement:\n\n${parts.join("\n")}\n\nApplication / Project:\nEstimated Quantity:\nDestination / Delivery Location:\nRequired Timeline:\nAdditional Notes:`;
    }
  }

  document.querySelectorAll("[data-contact-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Clear previous error messages
      form.querySelectorAll(".form-field-error").forEach((el) => el.remove());
      form
        .querySelectorAll(".form-field")
        .forEach((el) => el.classList.remove("has-error"));

      let hasErrors = false;

      // Validate required fields
      const requiredInputs = form.querySelectorAll("[required]");
      requiredInputs.forEach((input) => {
        const value = input.value.trim();
        const fieldName = input.getAttribute("name");
        let errorMessage = "";

        if (!value) {
          if (fieldName === "name") errorMessage = "Please enter your name.";
          else if (fieldName === "company")
            errorMessage = "Please enter your company name.";
          else if (fieldName === "email")
            errorMessage = "Please enter your email address.";
          else if (fieldName === "business_area")
            errorMessage = "Please select a business area.";
          else if (fieldName === "message")
            errorMessage = "Please enter your message.";
          else errorMessage = "This field is required.";
        } else if (
          input.type === "email" &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ) {
          errorMessage = "Please enter a valid email address.";
        }

        if (errorMessage) {
          hasErrors = true;
          const parentField = input.closest(".form-field");
          if (parentField) {
            parentField.classList.add("has-error");
            const errorSpan = document.createElement("span");
            errorSpan.className = "form-field-error";
            errorSpan.textContent = errorMessage;
            parentField.appendChild(errorSpan);
          }
        }
      });

      if (hasErrors) {
        return;
      }

      const note = form.querySelector("[data-form-note]");
      const button = form.querySelector("button[type='submit']");
      const originalButtonText = button ? button.innerHTML : "";

      if (note) {
        note.textContent = "Submitting your enquiry...";
        note.style.color = "#475569";
        note.style.fontWeight = "600";
      }

      if (button) {
        button.disabled = true;
        button.innerHTML = "<span>Submitting...</span>";
      }

      try {
        const payload = Object.fromEntries(new FormData(form).entries());

        // Honeypot: unchecked checkboxes are absent from FormData, so explicitly
        // send an empty string. Web3Forms rejects the submission if this is non-empty.
        if (payload.botcheck === undefined) payload.botcheck = "";

        // Abort if the honeypot was filled (bot submitted via fetch)
        if (payload.botcheck !== "") throw new Error("Bot detected");

        // Map sender identity so Web3Forms shows the right From/Reply-To in the inbox
        if (payload.name)  payload.from_name = payload.name;
        if (payload.email) payload.replyto   = payload.email;

        const response = await fetch(form.action, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok || data.success === false) {
          throw new Error(data.message || "Submission failed");
        }

        // Successful submission: transition the form into a gorgeous success card
        form.reset();
        form.innerHTML = `
          <div class="enquiry-success-card reveal" style="text-align: center; padding: 48px 24px; display: flex; flex-direction: column; align-items: center; gap: 24px; background: #ffffff; border-radius: 16px; border: 1px solid rgba(4, 120, 87, 0.15); box-shadow: 0 20px 44px rgba(4, 120, 87, 0.05); margin-top: 10px;">
            <div class="success-icon-wrap" style="width: 72px; height: 72px; border-radius: 50%; background: #ecfdf5; display: grid; place-items: center; color: #059669; border: 1px solid rgba(5, 150, 105, 0.15);">
              <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <h3 style="color: #065f46; font-family: var(--font-display); font-size: 1.6rem; font-weight: 800; margin: 0;">Enquiry Submitted</h3>
            <p style="color: #047857; font-size: 1.02rem; line-height: 1.6; max-width: 420px; margin: 0; font-family: var(--font-body); font-weight: 500;">Thank you. Your enquiry has been received by Neptune Trading Company. Our trading desk will review your details and respond shortly.</p>
          </div>
        `;
      } catch (error) {
        if (note) {
          note.textContent =
            "The form could not be submitted. Please email info@neptunetrading.lk directly.";
          note.style.color = "#dc2626";
          note.style.fontWeight = "700";
        }
      } finally {
        if (button && form.contains(button)) {
          button.disabled = false;
          button.innerHTML = originalButtonText;
        }
      }
    });
  });
});

/* ── Product Image Lightbox ──────────────────────────────────────────── */
(function () {
  const ZOOM_MIN = 1;
  const ZOOM_MAX = 3;
  const ZOOM_STEPS = [1, 1.5, 2, 3];

  let overlay, lbImg, lbCaption, zoomLabel;
  let currentZoom = 1;
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  let panOffset = { x: 0, y: 0 };
  let panStart  = { x: 0, y: 0 };

  function buildOverlay() {
    if (document.getElementById('lb-overlay')) return;

    overlay = document.createElement('div');
    overlay.className = 'lb-overlay';
    overlay.id = 'lb-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Product image viewer');
    overlay.style.display = 'none';

    overlay.innerHTML = `
      <button class="lb-close" id="lb-close" aria-label="Close image viewer">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <div class="lb-inner" id="lb-inner">
        <img class="lb-img" id="lb-img" alt="" draggable="false">
        <div class="lb-caption" id="lb-caption"></div>
      </div>
      <div class="lb-controls" id="lb-controls">
        <button class="lb-ctrl-btn" id="lb-zoom-out" aria-label="Zoom out">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M8 11h6"/></svg>
        </button>
        <span class="lb-zoom-label" id="lb-zoom-label">100%</span>
        <button class="lb-ctrl-btn" id="lb-zoom-in" aria-label="Zoom in">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/></svg>
        </button>
        <button class="lb-ctrl-btn" id="lb-zoom-reset" aria-label="Reset zoom" style="font-size:0.72rem;font-weight:700;letter-spacing:0.04em;">1:1</button>
      </div>`;

    document.body.appendChild(overlay);

    lbImg     = overlay.querySelector('#lb-img');
    lbCaption = overlay.querySelector('#lb-caption');
    zoomLabel = overlay.querySelector('#lb-zoom-label');

    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLightbox(); });
    overlay.querySelector('#lb-close').addEventListener('click', closeLightbox);
    overlay.querySelector('#lb-zoom-in').addEventListener('click', (e) => { e.stopPropagation(); stepZoom(1); });
    overlay.querySelector('#lb-zoom-out').addEventListener('click', (e) => { e.stopPropagation(); stepZoom(-1); });
    overlay.querySelector('#lb-zoom-reset').addEventListener('click', (e) => { e.stopPropagation(); setZoom(1); });

    lbImg.addEventListener('click', (e) => {
      e.stopPropagation();
      setZoom(currentZoom === 1 ? 2 : 1);
    });

    overlay.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.15 : -0.15;
      setZoom(Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, currentZoom + delta)), true);
    }, { passive: false });

    lbImg.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', endDrag);

    let lastTouchDist = null;
    overlay.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        lastTouchDist = getTouchDist(e.touches);
      } else if (e.touches.length === 1 && currentZoom > 1) {
        startDrag({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
      }
    }, { passive: true });
    overlay.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && lastTouchDist !== null) {
        e.preventDefault();
        const dist = getTouchDist(e.touches);
        setZoom(Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, currentZoom * (dist / lastTouchDist))), true);
        lastTouchDist = dist;
      } else if (e.touches.length === 1 && isDragging) {
        e.preventDefault();
        onDrag({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
      }
    }, { passive: false });
    overlay.addEventListener('touchend', () => { lastTouchDist = null; endDrag(); });

    document.addEventListener('keydown', (e) => {
      if (!overlay.classList.contains('lb-visible')) return;
      if (e.key === 'Escape')      closeLightbox();
      if (e.key === '+' || e.key === '=') stepZoom(1);
      if (e.key === '-')           stepZoom(-1);
      if (e.key === '0')           setZoom(1);
    });
  }

  function getTouchDist(t) {
    const dx = t[0].clientX - t[1].clientX, dy = t[0].clientY - t[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function startDrag(e) {
    if (currentZoom <= 1) return;
    isDragging = true;
    dragStart = { x: e.clientX, y: e.clientY };
    panStart  = { x: panOffset.x, y: panOffset.y };
    lbImg.style.cursor = 'grabbing';
  }
  function onDrag(e) {
    if (!isDragging) return;
    panOffset.x = panStart.x + (e.clientX - dragStart.x);
    panOffset.y = panStart.y + (e.clientY - dragStart.y);
    applyTransform();
  }
  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    lbImg.style.cursor = currentZoom > 1 ? 'grab' : 'zoom-in';
  }

  function setZoom(z, noAnim) {
    currentZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, Math.round(z * 100) / 100));
    if (currentZoom <= 1) { currentZoom = 1; panOffset = { x: 0, y: 0 }; }
    zoomLabel.textContent = Math.round(currentZoom * 100) + '%';
    lbImg.classList.toggle('lb-zoomed', currentZoom > 1);
    lbImg.style.cursor = currentZoom > 1 ? 'grab' : 'zoom-in';
    lbImg.style.transition = noAnim ? 'none' : 'transform 220ms cubic-bezier(0.25,0.46,0.45,0.94)';
    applyTransform();
  }

  function stepZoom(dir) {
    const steps = ZOOM_STEPS;
    if (dir > 0) { setZoom(steps.find(s => s > currentZoom + 0.05) || ZOOM_MAX); }
    else         { setZoom([...steps].reverse().find(s => s < currentZoom - 0.05) || ZOOM_MIN); }
  }

  function applyTransform() {
    lbImg.style.transform = `scale(${currentZoom}) translate(${panOffset.x / currentZoom}px, ${panOffset.y / currentZoom}px)`;
  }

  function openLightbox(src, alt) {
    buildOverlay();
    currentZoom = 1;
    panOffset   = { x: 0, y: 0 };
    lbImg.src   = src;
    lbImg.alt   = alt || '';
    lbCaption.textContent = alt || '';
    lbImg.style.transform = '';
    lbImg.style.cursor    = 'zoom-in';
    lbImg.classList.remove('lb-zoomed');
    zoomLabel.textContent = '100%';
    document.body.classList.add('lb-open');
    overlay.style.display = 'flex';
    requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('lb-visible')));
  }

  function closeLightbox() {
    if (!overlay) return;
    overlay.classList.remove('lb-visible');
    document.body.classList.remove('lb-open');
    setTimeout(() => { overlay.style.display = 'none'; lbImg.src = ''; }, 230);
  }

  function initPanels() {
    document.querySelectorAll('.hpd-img-panel, .mpd-img-panel').forEach(panel => {
      const img = panel.querySelector('img:not([data-no-lb])');
      if (!img || panel.dataset.lbInit) return;
      panel.dataset.lbInit = '1';

      const hint = document.createElement('span');
      hint.className = 'lb-hint';
      hint.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/></svg> Click to enlarge';
      panel.appendChild(hint);

      panel.addEventListener('click', () => {
        openLightbox(panel.dataset.lbSrc || img.src, img.alt || '');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initPanels);
})();

/* ── Floating WhatsApp Contact Button ───────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.createElement("a");
  btn.href = "https://wa.me/94777441990";
  btn.target = "_blank";
  btn.rel = "noopener";
  btn.className = "wa-float-btn";
  btn.setAttribute("aria-label", "Chat with Neptune Trading on WhatsApp");
  btn.innerHTML = '<svg width="30" height="30" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.001 3C9.11 3 3.5 8.61 3.5 15.5c0 2.34.64 4.53 1.76 6.41L3 29l7.27-2.21a12.45 12.45 0 005.73 1.4h.01c6.89 0 12.5-5.61 12.5-12.5S22.9 3 16.001 3zm0 22.75h-.01a10.4 10.4 0 01-5.31-1.46l-.38-.23-3.94 1.2 1.22-3.84-.25-.4a10.36 10.36 0 01-1.6-5.52c0-5.75 4.68-10.43 10.44-10.43 2.79 0 5.41 1.09 7.38 3.06a10.36 10.36 0 013.06 7.38c0 5.75-4.68 10.44-10.44 10.44zm5.72-7.82c-.31-.16-1.85-.91-2.14-1.02-.29-.11-.5-.16-.71.16-.21.31-.81 1.02-1 1.23-.18.21-.37.23-.68.08-.31-.16-1.31-.48-2.5-1.54-.92-.82-1.55-1.84-1.73-2.15-.18-.31-.02-.48.14-.63.14-.14.31-.37.47-.55.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.54-.71-.55h-.6c-.21 0-.55.08-.84.39-.29.31-1.1 1.08-1.1 2.63s1.13 3.05 1.28 3.26c.16.21 2.23 3.4 5.4 4.77.75.33 1.34.52 1.8.66.76.24 1.44.21 1.99.13.61-.09 1.85-.76 2.11-1.49.26-.73.26-1.36.18-1.49-.08-.13-.29-.21-.6-.36z"/></svg>';
  document.body.appendChild(btn);
});
