// --- Button behavior ---
const yesBtn = document.getElementById("yes");
const noBtn = document.getElementById("no");
const hint = document.getElementById("hint");
const card = document.getElementById("card");

let dodges = 0;

function moveNoButton() {
  // Keep the button inside the card area
  const cardRect = card.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const padding = 14;
  const minX = cardRect.left + padding;
  const maxX = cardRect.right - btnRect.width - padding;
  const minY = cardRect.top + padding;
  const maxY = cardRect.bottom - btnRect.height - padding;

  const x = Math.random() * (maxX - minX) + minX;
  const y = Math.random() * (maxY - minY) + minY;

  noBtn.style.position = "fixed";
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;

  dodges++;
  if (dodges === 1) hint.textContent = "Hey! 😭";
  if (dodges === 3) hint.textContent = "Okay okay… just press Yes 😌";
  if (dodges === 6) hint.textContent = "You’re persistent 😂";
  if (dodges === 9) hint.textContent = "Okay 'No' is not a option it's YES or YES 😅";
}

noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  moveNoButton();
}, { passive: false });

yesBtn.addEventListener("click", () => {
  hint.textContent = "YAYYYYY!! 💖💖💖";
  yesBtn.disabled = true;
  noBtn.disabled = true;
  yesBtn.textContent = "She said YES 😍";
  startConfetti();
});

// --- Confetti (tiny canvas confetti, no libraries) ---
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
window.addEventListener("resize", resize);
resize();

let particles = [];
let animId = null;

function startConfetti() {
  const colors = ["#ff3b7a", "#ffcc00", "#7c4dff", "#00c2ff", "#00d084", "#ffffff"];

  particles = Array.from({ length: 180 }, () => ({
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * 200,
    r: 4 + Math.random() * 6,
    vx: -2 + Math.random() * 4,
    vy: 2 + Math.random() * 5,
    rot: Math.random() * Math.PI,
    vr: -0.1 + Math.random() * 0.2,
    color: colors[Math.floor(Math.random() * colors.length)],
    life: 300 + Math.random() * 200
  }));

  if (!animId) loop();
}

function loop() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.vy += 0.02; // gravity
    p.life -= 1;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.4);
    ctx.restore();
  });

  particles = particles.filter((p) => p.life > 0 && p.y < window.innerHeight + 50);

  if (particles.length > 0) {
    animId = requestAnimationFrame(loop);
  } else {
    cancelAnimationFrame(animId);
    animId = null;
  }
}
