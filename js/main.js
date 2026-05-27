document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("site-navbar");
  const hamburger = document.querySelector(".nav-hamburger");
  const mobileMenu = document.getElementById("nav-mobile-menu");
  const progressBar = document.querySelector(".nav-scroll-progress");

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
    form.addEventListener("submit", (event) => {
      const accessKey = form.querySelector("input[name='access_key']");
      if (accessKey && accessKey.value === "WEB3FORMS_ACCESS_KEY") {
        event.preventDefault();
        const note = form.querySelector("[data-form-note]");
        if (note) {
          note.textContent = "The enquiry form is ready for Web3Forms. Add the live access key before enabling submissions.";
          note.style.color = "#2563eb";
          note.style.fontWeight = "700";
        }
      }
    });
  });
});
