// Shared JS for all pages (mobile nav, back-to-top, year)
(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const btn = document.getElementById("menuBtn");
  const links = document.getElementById("navLinks");
  if (btn && links) {
    btn.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        if (links.classList.contains("open")) {
          links.classList.remove("open");
          btn.setAttribute("aria-expanded","false");
        }
      });
    });
  }

  const toTop = document.getElementById("toTop");
  if (toTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 700) toTop.classList.add("show");
      else toTop.classList.remove("show");
    });
  }
})();
