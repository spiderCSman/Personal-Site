/* ==========================================================================
   carterlavigne.dev — 3D build
   A corridor of stations you fly through. Camera position is driven by a
   single virtual scroll value; everything else reads off it.
   No bundler: three.js arrives through the import map in index.html.
   ========================================================================== */

import * as THREE from "three";

const SPACING = 42;                 // world units between stations
const LOOK_AHEAD = 0.85;            // how far down the path the camera aims
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const body = document.body;
const canvas = document.getElementById("scene");
const stationEls = Array.from(document.querySelectorAll(".station"));
const railBtns = Array.from(document.querySelectorAll("#rail button"));
const progressFill = document.getElementById("progress-fill");
const hudPos = document.getElementById("hud-pos");
const bootFill = document.getElementById("boot-fill");
const bootEl = document.getElementById("boot");

const COUNT = stationEls.length;
const LAST = COUNT - 1;

/* --- Path ---------------------------------------------------------------
   Dead straight, forward only. The camera holds a fixed eye height and a
   fixed centre line; the only thing scrolling changes is depth. Sway and bob
   made the corridor hard to read and hard to steer.                        */

const EYE_Y = 1.9;

function pathAt(p, out) {
  const v = out || new THREE.Vector3();
  return v.set(0, EYE_Y, -p * SPACING);
}

/* --- Theme tokens -------------------------------------------------------- */

function token(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const palette = {
  bg: new THREE.Color(),
  ink: new THREE.Color(),
  accent: new THREE.Color(),
  slab: new THREE.Color(),
  slabAlt: new THREE.Color(),
  frame: new THREE.Color(),
  line: new THREE.Color(),
  lineStrong: new THREE.Color(),
  dust: new THREE.Color(),
};

function readPalette() {
  palette.bg.set(token("--bg") || "#fbfaf7");
  palette.ink.set(token("--ink") || "#14130f");
  palette.accent.set(token("--accent") || "#5b34e8");
  palette.slab.set(token("--scene-slab") || "#ffffff");
  palette.slabAlt.set(token("--scene-slab-alt") || "#ece8de");
  palette.frame.set(token("--scene-frame") || "#14130f");
  palette.line.set(token("--scene-line") || "#d8d2c3");
  palette.lineStrong.set(token("--scene-line-strong") || "#b8b1a0");
  palette.dust.set(token("--scene-dust") || "#a29c8e");
}
readPalette();

/* --- Renderer ------------------------------------------------------------ */

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
} catch (e) {
  renderer = null;
}

if (!renderer) {
  // No WebGL. There is a real flat site — point at it rather than imitating it.
  body.classList.remove("is-booting");
  const fallback = document.getElementById("no-webgl");
  if (fallback) fallback.hidden = false;
} else {
  init();
}

function init() {
  renderer.setClearColor(palette.bg, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(palette.bg, 22, 135);

  const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 400);
  camera.position.copy(pathAt(0));

  /* --- Light: flat and even, so the geometry reads as paper, not plastic. */
  const hemi = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.05);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 0.85);
  key.position.set(6, 14, 8);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.3);
  fill.position.set(-8, -4, -6);
  scene.add(fill);

  /* --- Shared materials, recoloured on theme change. --------------------- */
  const mat = {
    slab: new THREE.MeshStandardMaterial({ color: palette.slab, roughness: 0.85, metalness: 0.0 }),
    slabAlt: new THREE.MeshStandardMaterial({ color: palette.slabAlt, roughness: 0.9, metalness: 0.0 }),
    frame: new THREE.MeshStandardMaterial({ color: palette.frame, roughness: 0.7, metalness: 0.0 }),
    accent: new THREE.MeshStandardMaterial({ color: palette.accent, roughness: 0.55, metalness: 0.0 }),
    line: new THREE.LineBasicMaterial({ color: palette.line, transparent: true, opacity: 0.9 }),
    lineStrong: new THREE.LineBasicMaterial({ color: palette.lineStrong, transparent: true, opacity: 0.9 }),
    dust: new THREE.PointsMaterial({ color: palette.dust, size: 0.07, sizeAttenuation: true, transparent: true, opacity: 0.5, depthWrite: false }),
  };

  const textMats = [];   // tinted white textures — recolour by material.color

  /* --- Geometry helpers -------------------------------------------------- */

  const boxGeo = new THREE.BoxGeometry(1, 1, 1);

  function slab(w, h, d, x, y, z, material, rot) {
    const m = new THREE.Mesh(boxGeo, material);
    m.scale.set(w, h, d);
    m.position.set(x, y, z);
    if (rot) m.rotation.set(rot[0] || 0, rot[1] || 0, rot[2] || 0);
    return m;
  }

  function wireBox(w, h, d, x, y, z, material) {
    const g = new THREE.BoxGeometry(w, h, d);
    const lines = new THREE.LineSegments(new THREE.EdgesGeometry(g), material);
    lines.position.set(x, y, z);
    g.dispose();
    return lines;
  }

  /* A portal frame: four thin bars you fly through. The hairline rule of the
     flat site, given thickness.                                            */
  function portal(w, h, t) {
    const g = new THREE.Group();
    g.add(slab(w, t, t * 2.2, 0, h / 2, 0, mat.frame));
    g.add(slab(w, t, t * 2.2, 0, -h / 2, 0, mat.frame));
    g.add(slab(t, h, t * 2.2, -w / 2, 0, 0, mat.frame));
    g.add(slab(t, h, t * 2.2, w / 2, 0, 0, mat.frame));
    return g;
  }

  /* --- Type in space ----------------------------------------------------- */

  function textPlane(text, opts) {
    const o = Object.assign({ font: "500 200px 'JetBrains Mono', monospace", pad: 40, height: 3, tint: mat.accent }, opts);
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    ctx.font = o.font;
    const m = ctx.measureText(text);
    const w = Math.ceil(m.width) + o.pad * 2;
    const h = Math.ceil(
      (m.actualBoundingBoxAscent || 200) + (m.actualBoundingBoxDescent || 60)
    ) + o.pad * 2;
    c.width = w; c.height = h;
    ctx.font = o.font;
    ctx.fillStyle = "#ffffff";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(text, w / 2, h / 2);

    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;

    const material = new THREE.MeshBasicMaterial({
      map: tex, transparent: true, color: o.tint.color.clone(), fog: true, depthWrite: false,
    });
    textMats.push({ material, role: o.role || "accent" });

    const aspect = w / h;
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(o.height * aspect, o.height), material);
    return plane;
  }

  /* --- Floor + ceiling rules --------------------------------------------- */

  function gridLines(y, extentZ, halfW, step, material) {
    const pts = [];
    for (let z = 4; z >= -extentZ; z -= step) {
      pts.push(-halfW, y, z, halfW, y, z);
    }
    for (let x = -halfW; x <= halfW; x += step) {
      pts.push(x, y, 4, x, y, -extentZ);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return new THREE.LineSegments(g, material);
  }

  const corridorZ = LAST * SPACING + 60;
  scene.add(gridLines(-7.5, corridorZ, 34, 4, mat.line));
  scene.add(gridLines(13.5, corridorZ, 26, 8, mat.line));

  /* --- Dust -------------------------------------------------------------- */

  const dustCount = 1100;
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 60;
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 22 + 2;
    dustPos[i * 3 + 2] = 6 - Math.random() * corridorZ;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.Float32BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeo, mat.dust);
  scene.add(dust);

  /* --- Stations ---------------------------------------------------------- */

  const LABELS = ["00", "", "01", "001", "002", "003", "004", "005", "02", "03", "04", "05", "06"];
  const stationGroups = [];
  const here = new THREE.Vector3();

  /* Built after the webfonts resolve — the number planes are drawn to a
     canvas, so they must not bake in a fallback face. */
  function buildStations() {
    for (let i = 0; i < COUNT; i++) {
      pathAt(i, here);
      const g = new THREE.Group();
      g.position.copy(here);

      const side = stationEls[i].dataset.side || "center";
      const dir = side === "left" ? 1 : side === "right" ? -1 : (i % 2 ? 1 : -1);
      const rnd = (n) => Math.sin(i * 12.9898 + n * 78.233) * 0.5 + 0.5;

      // The frame you pass through.
      const isMajor = ["00", "01", "02", "03", "04", "05", "06"].includes(LABELS[i]);
      g.add(portal(isMajor ? 30 : 24, isMajor ? 17 : 14, isMajor ? 0.3 : 0.18));

      // Slabs: the editorial cards, extruded and pushed off-axis.
      const slabMat = i % 2 ? mat.slab : mat.slabAlt;
      g.add(slab(9 + rnd(1) * 5, 0.35, 6 + rnd(2) * 3, dir * (11 + rnd(3) * 4), -3.5 + rnd(4) * 3, -13 - rnd(5) * 8, slabMat, [0, dir * 0.22, 0]));
      g.add(slab(6 + rnd(6) * 4, 0.3, 5, -dir * (12 + rnd(7) * 5), 3 + rnd(8) * 4, -19 - rnd(9) * 7, slabMat, [0, -dir * 0.3, 0]));
      g.add(slab(0.3, 9 + rnd(10) * 6, 4, dir * (16 + rnd(11) * 3), 0, -26, mat.frame));

      // Hairline volumes, the rules of the flat grid given a third axis.
      g.add(wireBox(14, 8, 9, -dir * 9, -2 + rnd(12) * 4, -31, mat.lineStrong));
      g.add(wireBox(6, 6, 6, dir * 7, 5 + rnd(13) * 3, -36, mat.line));

      // The number, in mono, with the station's one accent element as a rule
      // set beneath it — the flat site's hairline, given a place in space.
      if (LABELS[i]) {
        const label = textPlane(LABELS[i], {
          font: "500 200px 'JetBrains Mono', ui-monospace, monospace",
          height: isMajor ? 4.4 : 2.6,
          tint: mat.accent,
          role: "accent",
        });
        label.position.set(dir * (isMajor ? 9.5 : 8), isMajor ? 4.6 : 4, -21);
        label.rotation.y = -dir * 0.34;
        g.add(label);

        const rule = slab(isMajor ? 5 : 3.2, 0.1, 0.1,
          dir * (isMajor ? 9.5 : 8), (isMajor ? 4.6 : 4) - (isMajor ? 3.0 : 1.8), -21,
          mat.accent, [0, -dir * 0.34, 0]);
        g.add(rule);
      }

      scene.add(g);
      stationGroups.push(g);
    }
  }

  /* --- Navigation state -------------------------------------------------- */

  let target = 0;      // where we want to be, in station units
  let current = 0;     // where we are
  let interacting = 0; // timestamp of last direct input

  function clampTarget(v) {
    return Math.max(0, Math.min(LAST, v));
  }

  function goTo(i) {
    target = clampTarget(i);
    interacting = performance.now();
  }

  /* Wheel / trackpad.
     Bound to the window, not the canvas: the overlay panel covers the middle
     of the screen, so a canvas-only listener means scrolling over the text
     does nothing at all. A panel that actually overflows still gets to scroll
     itself first, and hands over once it hits its own end.                  */

  function overflowingPanel(node) {
    const panel = node && node.closest ? node.closest(".panel") : null;
    if (!panel) return null;
    return panel.scrollHeight - panel.clientHeight > 2 ? panel : null;
  }

  window.addEventListener("wheel", (e) => {
    const panel = overflowingPanel(e.target);
    if (panel) {
      const down = e.deltaY > 0;
      const atTop = panel.scrollTop <= 0;
      const atBottom = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 1;
      if ((down && !atBottom) || (!down && !atTop)) return;  // the panel keeps it
    }
    e.preventDefault();
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
    target = clampTarget(target + (e.deltaY * unit) * 0.0032);
    interacting = performance.now();
  }, { passive: false });

  /* Drag to move.
     Also window-level, for the same reason as the wheel: on a phone the panel
     covers the viewport, so a canvas-only listener leaves nothing to swipe.
     A mouse drag over a panel is left alone so text stays selectable; a touch
     drag there navigates, unless that panel has its own scrolling to do.    */

  let dragging = false;
  let lastY = 0;

  window.addEventListener("pointerdown", (e) => {
    if (e.target.closest && e.target.closest("a, button, .hud, .rail")) return;
    const onPanel = e.target.closest && e.target.closest(".panel");
    if (onPanel && (e.pointerType !== "touch" || overflowingPanel(e.target))) return;
    dragging = true;
    lastY = e.clientY;
  });

  window.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dy = e.clientY - lastY;
    lastY = e.clientY;
    target = clampTarget(target + dy * 0.009);
    interacting = performance.now();
  });

  const endDrag = () => { dragging = false; };
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);

  /* Keyboard */
  window.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea") return;

    if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
      e.preventDefault(); goTo(Math.round(current) + 1);
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault(); goTo(Math.round(current) - 1);
    } else if (e.key === "Home") {
      e.preventDefault(); goTo(0);
    } else if (e.key === "End") {
      e.preventDefault(); goTo(LAST);
    } else if (/^[1-7]$/.test(e.key)) {
      const btn = railBtns[Number(e.key) - 1];
      if (btn) goTo(Number(btn.dataset.goto));
    }
  });

  /* Rail */
  railBtns.forEach((btn) => {
    btn.addEventListener("click", () => goTo(Number(btn.dataset.goto)));
  });

  /* --- Per-frame overlay sync -------------------------------------------- */

  const shown = new Array(COUNT).fill(-1);

  function syncOverlay(p) {
    for (let i = 0; i < COUNT; i++) {
      const d = Math.abs(p - i);
      const o = d >= 0.46 ? 0 : 1 - d / 0.46;
      if (Math.abs(o - shown[i]) < 0.012) continue;
      shown[i] = o;
      const el = stationEls[i];
      el.style.opacity = o.toFixed(3);
      el.style.visibility = o <= 0.002 ? "hidden" : "visible";
      el.style.transform = `translate3d(0, ${((p - i) * 26).toFixed(1)}px, 0)`;
    }

    const pct = LAST ? (p / LAST) * 100 : 0;
    progressFill.style.width = pct.toFixed(1) + "%";
    const n = Math.round(p);
    const pad = (v) => String(v).padStart(2, "0");
    hudPos.textContent = `${pad(n)} / ${pad(LAST)}`;

    // The rail marks the last major section you have reached or passed.
    let activeBtn = 0;
    railBtns.forEach((btn, idx) => { if (Number(btn.dataset.goto) <= n) activeBtn = idx; });
    railBtns.forEach((btn, idx) => btn.classList.toggle("active", idx === activeBtn));
  }

  /* --- Loop -------------------------------------------------------------- */

  const camPos = new THREE.Vector3();
  const camAim = new THREE.Vector3();
  let raf = 0;

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (document.hidden) return;
    renderFrame(now);
  }

  function renderFrame(now) {
    syncSize();
    // Weak magnetism toward the nearest station once the user stops driving.
    const idle = now - interacting > 420;
    if (idle && !dragging) {
      const nearest = Math.round(target);
      if (Math.abs(nearest - target) < 0.46) target += (nearest - target) * 0.055;
    }

    // Reduced motion: arrive rather than glide.
    current += (target - current) * (REDUCED ? 1 : 0.095);
    if (Math.abs(target - current) < 0.0004) current = target;

    pathAt(current, camPos);
    pathAt(current + LOOK_AHEAD, camAim);
    camera.position.copy(camPos);
    camera.lookAt(camAim);

    syncOverlay(current);
    renderer.render(scene, camera);
  }

  /* --- Local test harness --------------------------------------------------
     Automated browsers report their tabs as hidden, which correctly pauses the
     loop above — so nothing would ever draw under test. On localhost only,
     expose a way to jump to a station and draw a single frame by hand.      */

  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    window.__scene3d = {
      step(p) {
        if (p != null) { target = clampTarget(p); current = target; }
        renderFrame(performance.now());
      },
      get position() { return current; },
      stations: COUNT,
      scene, camera, renderer, palette,
    };
  }

  /* --- Sizing --------------------------------------------------------------
     Checked every frame rather than on resize alone. A viewport can be 0x0 at
     init (a hidden or not-yet-laid-out tab), which would otherwise leave the
     camera with a NaN aspect and never recover.                             */

  let sizeW = 0, sizeH = 0, sizeDpr = 0;

  function syncSize() {
    const w = Math.max(1, window.innerWidth);
    const h = Math.max(1, window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (w === sizeW && h === sizeH && dpr === sizeDpr) return;
    sizeW = w; sizeH = h; sizeDpr = dpr;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
  }
  syncSize();

  /* --- Theme ------------------------------------------------------------- */

  function applyPalette() {
    readPalette();
    renderer.setClearColor(palette.bg, 1);
    scene.fog.color.copy(palette.bg);
    mat.slab.color.copy(palette.slab);
    mat.slabAlt.color.copy(palette.slabAlt);
    mat.frame.color.copy(palette.frame);
    mat.accent.color.copy(palette.accent);
    mat.line.color.copy(palette.line);
    mat.lineStrong.color.copy(palette.lineStrong);
    mat.dust.color.copy(palette.dust);
    textMats.forEach(({ material, role }) => {
      material.color.copy(role === "ink" ? palette.ink : palette.accent);
    });
  }

  const themeToggle = document.getElementById("theme-toggle");
  function currentTheme() {
    const set = document.documentElement.getAttribute("data-theme");
    if (set === "light" || set === "dark") return set;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  themeToggle.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("clv.theme", next); } catch (e) {}
    applyPalette();
  });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (!document.documentElement.getAttribute("data-theme")) applyPalette();
  });

  // The scene reads its colours from CSS, so it has to follow data-theme no
  // matter who set it — the toggle here, or the value stored by the flat site.
  new MutationObserver(applyPalette).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  /* --- Boot -------------------------------------------------------------- */

  let bootPct = 0;
  const bootTick = setInterval(() => {
    bootPct = Math.min(92, bootPct + 11);
    bootFill.style.width = bootPct + "%";
  }, 90);

  function start() {
    clearInterval(bootTick);
    bootFill.style.width = "100%";
    buildStations();
    applyPalette();
    syncOverlay(0);
    raf = requestAnimationFrame(frame);
    requestAnimationFrame(() => body.classList.remove("is-booting"));
    setTimeout(() => { if (bootEl) bootEl.remove(); }, 700);
  }

  /* The number planes are baked into canvas textures, so the exact face has to
     be resident first. document.fonts.ready alone is not enough: it resolves
     once the faces the DOM asks for are in, and nothing in the DOM asks for
     mono 500 — so load that face explicitly, or the numbers bake a fallback. */
  const MONO_FACE = "500 200px 'JetBrains Mono'";
  const fonts = document.fonts;
  const fontsReady = fonts
    ? Promise.all([fonts.ready, fonts.load(MONO_FACE)]).catch(() => {})
    : Promise.resolve();
  Promise.race([fontsReady, new Promise((r) => setTimeout(r, 2500))]).then(start);
}
