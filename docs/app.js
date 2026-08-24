const revealItems = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -6% 0px",
  }
);

revealItems.forEach((item) => observer.observe(item));

const projectCards = document.querySelectorAll(".project-card");
const heroPanel = document.querySelector(".hero-panel");

function applyTilt(element, strength = 10) {
  element.addEventListener("mousemove", (e) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * strength;
    const rotateX = ((y / rect.height) - 0.5) * -strength;

    element.style.transform =
      `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  element.addEventListener("mouseleave", () => {
    element.style.transform = "";
  });
}

if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
  projectCards.forEach((card) => applyTilt(card, 8));
  if (heroPanel) applyTilt(heroPanel, 5);
}

const copyrightYear = document.getElementById("copyright-year");

if (copyrightYear) {
  copyrightYear.textContent = new Date().getFullYear();
}

/* Mobile navigation */
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.getElementById("nav-links");

if (navToggle && navLinks) {
  const setNav = (open) => {
    navToggle.setAttribute("aria-expanded", String(open));
    navLinks.classList.toggle("is-open", open);
  };

  navToggle.addEventListener("click", () => {
    setNav(navToggle.getAttribute("aria-expanded") !== "true");
  });

  navLinks.addEventListener("click", (e) => {
    if (e.target.closest("a")) setNav(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setNav(false);
  });

  // Reset state when resizing back up to the desktop layout.
  window.matchMedia("(min-width: 761px)").addEventListener("change", (e) => {
    if (e.matches) setNav(false);
  });
}