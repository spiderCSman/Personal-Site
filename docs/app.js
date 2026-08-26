/* carterlavigne.dev — no dependencies. */

/* --- Theme -----------------------------------------------------------------
   The inline script in <head> has already applied any stored preference.
   Here we only handle toggling and persisting it.                          */

const THEME_KEY = "clv.theme";
const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");

function currentTheme() {
  const set = root.getAttribute("data-theme");
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {
      // Storage blocked — the choice still applies for this page view.
    }
  });
}

/* --- Mobile navigation ---------------------------------------------------- */

const navToggle = document.getElementById("nav-toggle");
const nav = document.getElementById("nav");

if (navToggle && nav) {
  const setNav = (open) => {
    navToggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  };

  navToggle.addEventListener("click", () => {
    setNav(navToggle.getAttribute("aria-expanded") !== "true");
  });

  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) setNav(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setNav(false);
  });

  window.matchMedia("(min-width: 701px)").addEventListener("change", (e) => {
    if (e.matches) setNav(false);
  });
}

/* --- Scroll reveal --------------------------------------------------------
   Staggered per group so rows cascade rather than all appearing at once.  */

const revealItems = document.querySelectorAll(".reveal");

if (revealItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const siblings = Array.from(entry.target.parentElement.children).filter((n) =>
          n.classList.contains("reveal")
        );
        const i = Math.max(0, siblings.indexOf(entry.target));
        entry.target.style.transitionDelay = Math.min(i, 5) * 70 + "ms";
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }
  );

  revealItems.forEach((item) => observer.observe(item));
}

/* --- Local: the way back to the 3D build ----------------------------------
   The 3D build ships with the site at /3d. This link is deliberately
   local-only for now — nothing on the live site points at it yet.       */

const LOCAL_HOSTS = ["localhost", "127.0.0.1", "[::1]"];
const headerTools = document.querySelector(".header-tools");

if (headerTools && LOCAL_HOSTS.includes(location.hostname)) {
  // Confirm the mount is actually there before offering it. A dev server
  // started before /3d was configured would otherwise show a link to a 404.
  fetch("/3d/index.html", { method: "HEAD" })
    .then((res) => {
      if (!res.ok) return;
      const labLink = document.createElement("a");
      labLink.className = "lab-link";
      labLink.href = "/3d/index.html";
      labLink.textContent = "3D";
      labLink.setAttribute("aria-label", "Open the local 3D build");
      headerTools.insertBefore(labLink, headerTools.firstChild);
    })
    .catch(() => {
      // No 3D build being served — leave the header alone.
    });
}

/* --- Footer year ----------------------------------------------------------- */

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
