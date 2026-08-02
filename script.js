/* ============================================================
   MARGIELA COFFEE — User Interactions
   1. Mobile navigation toggle
   2. Live open/closed status based on business hours
   3. Scroll reveal animation for .reveal elements
   ============================================================ */

(function () {
  "use strict";

  /* ---------- 1. Mobile Navigation Toggle ---------- */
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

    // Close the navigation menu after a link is selected on mobile devices.
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setNavOpen(false));
    });

    // Close the navigation menu when the Escape key is pressed.
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setNavOpen(false);
    });
  }

  /* ---------- 2. Live Business Status ---------- */
  // Business hours:
  // Monday: Closed
  // Tuesday–Friday: 7:00 AM–7:00 PM
  // Saturday: 7:00 AM–8:00 PM
  // Sunday: 8:00 AM–8:00 PM
  const HOURS = {
    1: null,              // Monday: closed
    2: [7, 19],
    3: [7, 19],
    4: [7, 19],
    5: [7, 19],
    6: [7, 20],
    0: [8, 20],
  };

  // Updates the café's open/closed status based on the current day and time.
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

  // Converts a 24-hour value into a 12-hour time string.
  // Example: 19 → "7pm"
  function formatHour(h) {
    const suffix = h >= 12 ? "pm" : "am";
    const hour12 = ((h + 11) % 12) + 1;
    return `${hour12}${suffix}`;
  }

  updateStatus();

  /* ---------- 3. Scroll Reveal Animation ---------- */
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