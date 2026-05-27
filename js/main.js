document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#year, [data-current-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  const navbar = document.getElementById("site-navbar") || document.querySelector("[data-header]");
  const hamburger = document.querySelector(".nav-hamburger") || document.querySelector("[data-nav-toggle]");
  const mobileMenu = document.getElementById("nav-mobile-menu") || document.querySelector("[data-nav-links-mobile]");
  const progressBar = document.querySelector(".nav-scroll-progress") || document.querySelector("[data-nav-progress]");

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

  const updateChrome = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

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

  const revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
  if (revealEls.length && !window.__neptuneRevealInitialized) {
    window.__neptuneRevealInitialized = true;
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  const brandSelect = document.getElementById("principal-select");
  if (brandSelect) {
    const brandParam = new URLSearchParams(window.location.search).get("brand");
    if (brandParam) {
      for (const option of brandSelect.options) {
        if (option.value.toLowerCase() === brandParam.toLowerCase()) {
          option.selected = true;
          break;
        }
      }
    }
  }

  document.querySelectorAll("[data-contact-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const note = form.querySelector("[data-form-note]");
      const button = form.querySelector("button[type='submit']");
      const originalButtonText = button ? button.innerHTML : "";

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

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
          body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok || data.success === false) {
          throw new Error(data.message || "Submission failed");
        }

        form.reset();
        if (note) {
          note.textContent = "Thank you. Your enquiry has been received by Neptune Trading Company.";
          note.style.color = "#047857";
          note.style.fontWeight = "700";
        }
      } catch (error) {
        if (note) {
          note.textContent = "The form could not be submitted. Please email info@neptunelogistics.lk directly.";
          note.style.color = "#dc2626";
          note.style.fontWeight = "700";
        }
      } finally {
        if (button) {
          button.disabled = false;
          button.innerHTML = originalButtonText;
        }
      }
    });
  });
});
