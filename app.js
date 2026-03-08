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