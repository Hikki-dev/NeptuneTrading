/* ── Product Detail Image Gallery (thumbnail click-to-swap) ────────── */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".hpd-gallery").forEach(gallery => {
    const mainImg = gallery.querySelector(".hpd-gallery-main img");
    const thumbs = gallery.querySelectorAll(".hpd-gallery-thumb");
    if (!mainImg || !thumbs.length) return;

    thumbs.forEach(thumb => {
      thumb.addEventListener("click", (e) => {
        e.stopPropagation();
        const full = thumb.dataset.full;
        const alt = thumb.dataset.alt;
        if (!full) return;

        thumbs.forEach(t => {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        thumb.classList.add("active");
        thumb.setAttribute("aria-selected", "true");

        mainImg.style.opacity = "0";
        window.setTimeout(() => {
          mainImg.src = full;
          if (alt) mainImg.alt = alt;
          mainImg.style.opacity = "1";
        }, 140);
      });
    });
  });
});
