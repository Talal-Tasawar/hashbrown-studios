import Lenis from "lenis";

const root = document.documentElement;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

// Smooth scrolling on desktop pointers only, started once the page is idle so it never blocks first render
let lenis: Lenis | null = null;
if (finePointer && !reduce) {
  const start = () => (lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.11 }));
  const idle = () => ("requestIdleCallback" in window ? requestIdleCallback(start, { timeout: 1500 }) : setTimeout(start, 300));
  document.readyState === "complete" ? idle() : addEventListener("load", idle, { once: true });
}

// Render everything once the visitor engages, so anchor jumps land on real section heights
const engage = () => root.classList.add("engaged");
["pointerdown", "keydown", "wheel", "touchstart", "scroll"].forEach((t) => addEventListener(t, engage, { once: true, passive: true }));

// Theme toggle
document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
  const current = root.dataset.theme ?? (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  const next = current === "light" ? "dark" : "light";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch {}
});

// Mobile menu
const menuBtn = document.querySelector<HTMLButtonElement>("[data-menu-btn]");
const menu = document.getElementById("menu");
const setMenu = (open: boolean) => {
  if (!menuBtn || !menu) return;
  root.dataset.menu = open ? "open" : "closed";
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  menu.inert = !open;
  if (open) { lenis?.stop(); menu.querySelector<HTMLElement>("a")?.focus({ preventScroll: true }); }
  else lenis?.start();
};
if (menu) menu.inert = true;
menuBtn?.addEventListener("click", () => setMenu(root.dataset.menu !== "open"));
menu?.querySelectorAll("[data-menu-link]").forEach((a) => a.addEventListener("click", () => setMenu(false)));
addEventListener("keydown", (e) => {
  if (e.key === "Escape" && root.dataset.menu === "open") { setMenu(false); menuBtn?.focus(); }
});
matchMedia("(min-width: 1024px)").addEventListener("change", (e) => e.matches && setMenu(false));

// Map: styled and locked by default so the branded pin stays on the studio; "Explore map" hands control to Google Maps
const map = document.querySelector<HTMLElement>("[data-map]");
const mapFrame = map?.querySelector<HTMLIFrameElement>("[data-map-iframe]");
const exploreBtn = map?.querySelector<HTMLButtonElement>("[data-map-explore]");
if (map && mapFrame && exploreBtn) {
  map.classList.add("map-locked");
  exploreBtn.addEventListener("click", () => {
    const exploring = !map.classList.toggle("map-locked");
    mapFrame.src = (exploring ? mapFrame.dataset.exploreSrc : mapFrame.dataset.styledSrc) ?? mapFrame.src;
    mapFrame.tabIndex = exploring ? 0 : -1;
    exploreBtn.setAttribute("aria-pressed", String(exploring));
    const label = exploreBtn.querySelector("[data-map-explore-label]");
    if (label) label.textContent = exploring ? "Back to studio view" : "Explore map";
  });
}

if (finePointer && !reduce) {
  // Hero object follows the pointer with eased inertia, only while the hero is on screen
  const tilt = document.querySelector<HTMLElement>("[data-tilt]");
  if (tilt) {
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, visible = true;
    const step = () => {
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;
      tilt.style.setProperty("--ry", `${cx.toFixed(2)}deg`);
      tilt.style.setProperty("--rx", `${cy.toFixed(2)}deg`);
      tilt.style.setProperty("--sx", `${(32 - cx * 1.2).toFixed(1)}%`);
      tilt.style.setProperty("--sy", `${(22 + cy * 1.2).toFixed(1)}%`);
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.02 ? requestAnimationFrame(step) : 0;
    };
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(tilt);
    addEventListener("pointermove", (e) => {
      if (!visible) return;
      tx = (e.clientX / innerWidth - 0.5) * 34;
      ty = (e.clientY / innerHeight - 0.5) * -24;
      if (!raf) raf = requestAnimationFrame(step);
    }, { passive: true });
  }

  // Work previews tilt toward the pointer
  document.querySelectorAll<HTMLElement>("[data-ptilt]").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--px", `${(((e.clientX - r.left) / r.width - 0.5) * 9).toFixed(2)}deg`);
      el.style.setProperty("--py", `${(((e.clientY - r.top) / r.height - 0.5) * -7).toFixed(2)}deg`);
    });
    el.addEventListener("pointerleave", () => { el.style.setProperty("--px", "0deg"); el.style.setProperty("--py", "0deg"); });
  });

  // Magnetic buttons
  document.querySelectorAll<HTMLElement>(".magnetic").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1)}px`);
      el.style.setProperty("--my", `${((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1)}px`);
    });
    el.addEventListener("pointerleave", () => { el.style.setProperty("--mx", "0px"); el.style.setProperty("--my", "0px"); });
  });
}
