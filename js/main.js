/* ==========================================================================
   NEPTUNE TRADING COMPANY - DYNAMIC LOGIC
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile Menu Drawer Animation
  const toggle = document.querySelector("[data-nav-toggle]");
  const navMobileDrawer = document.querySelector("[data-nav-links-mobile]");

  if (toggle && navMobileDrawer) {
    toggle.addEventListener("click", () => {
      const isOpen = navMobileDrawer.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close mobile menu if resized to desktop width
    window.addEventListener("resize", () => {
      if (window.innerWidth > 991 && navMobileDrawer.classList.contains("open")) {
        navMobileDrawer.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // 2. Sticky Header Scroll and Scroll Progress Bar
  const header = document.querySelector("[data-header]");
  const progressBar = document.querySelector("[data-nav-progress]");

  const updateHeaderAndProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Toggle scrolled styling
    if (header) {
      if (scrollTop > 20) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    // Update progress bar width
    if (progressBar && scrollHeight > 0) {
      const percentage = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = `${percentage}%`;
    }
  };

  window.addEventListener("scroll", updateHeaderAndProgress);
  updateHeaderAndProgress(); // Run once on load

  // 3. Pre-select Brand from URL Parameter (e.g. ?brand=hummer)
  const brandSelect = document.getElementById("principal-select");
  if (brandSelect) {
    const urlParams = new URLSearchParams(window.location.search);
    const brandParam = urlParams.get("brand");
    
    if (brandParam) {
      // Look for match in options
      const cleanParam = brandParam.toLowerCase().trim();
      for (let option of brandSelect.options) {
        if (option.value.toLowerCase() === cleanParam || option.text.toLowerCase().includes(cleanParam)) {
          option.selected = true;
          break;
        }
      }
    }
  }

  // 4. Contact Form Handling
  document.querySelectorAll("[data-contact-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      const accessKey = form.querySelector("input[name='access_key']");
      if (accessKey && accessKey.value === "WEB3FORMS_ACCESS_KEY") {
        event.preventDefault();
        const note = form.querySelector("[data-form-note]");
        if (note) {
          note.textContent = "Thank you! To enable submissions, please replace 'WEB3FORMS_ACCESS_KEY' in the source code with your live Web3Forms access key.";
          note.style.color = "#2563eb";
          note.style.fontWeight = "bold";
        }
      }
    });
  });
});
