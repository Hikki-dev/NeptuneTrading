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
      } else if (pd.includes("aliaxis") || pd.includes("snow")) {
        targetArea = "Snow / Aliaxis Piping Systems";
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
      } else if (ap.includes("aliaxis") || ap.includes("snow")) {
        targetArea = "Snow / Aliaxis Piping Systems";
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
        const response = await fetch(form.action || "/api/contact", {
          method: "POST",
          body: JSON.stringify(
            Object.fromEntries(new FormData(form).entries()),
          ),
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
