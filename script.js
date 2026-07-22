/* ============================================================
   MARGIELA COFFEE — interactions
   1. Mobile nav toggle
   2. Live open/closed status based on posted hours
   3. Scroll-reveal for .reveal elements
   ============================================================ */

(function () {
  "use strict";

  /* ---------- 1. Mobile nav toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");

  function setNavOpen(open) {
    nav.setAttribute("data-open", String(open));
    navToggle.setAttribute("aria-expanded", String(open));
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.getAttribute("data-open") === "true";
      setNavOpen(!isOpen);
    });

    // Close menu after a link is tapped (mobile)
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setNavOpen(false));
    });

    // Close on escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setNavOpen(false);
    });
  }

  /* ---------- 2. Open / closed status ---------- */
  // Hours: Monday closed, Tue–Fri 7:00–18:00, Sat 8:00–19:00, Sun 8:00–15:00
  const HOURS = {
    1: null,              // Monday: closed
    2: [7, 18],
    3: [7, 18],
    4: [7, 18],
    5: [7, 18],
    6: [8, 19],
    0: [8, 15],
  };

  function updateStatus() {
    const statusEl = document.getElementById("statusText");
    if (!statusEl) return;

    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours() + now.getMinutes() / 60;
    const today = HOURS[day];

    const isOpen = !!today && hour >= today[0] && hour < today[1];
    statusEl.parentElement && statusEl.setAttribute("data-open", String(isOpen));

    if (!today) {
      statusEl.textContent = "Closed today — back open tomorrow.";
    } else if (isOpen) {
      statusEl.textContent = `Open now, until ${formatHour(today[1])}.`;
    } else if (hour < today[0]) {
      statusEl.textContent = `Closed — opens today at ${formatHour(today[0])}.`;
    } else {
      statusEl.textContent = "Closed for the day — see you tomorrow.";
    }
  }

  function formatHour(h) {
    const suffix = h >= 12 ? "pm" : "am";
    const hour12 = ((h + 11) % 12) + 1;
    return `${hour12}${suffix}`;
  }

  updateStatus();

  /* ---------- 3. Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach((el) => observer.observe(el));
  }
})();