// Cliick.com redesign prototype — issue #3

// --- Pinned scene stage -----------------------------------------------------
// The stage frame pins while the track scrolls through it. Scroll progress
// picks the active scene; CSS keyed off data-scene / is-past / is-active /
// is-future does all the motion, so copy, screen, window, and backdrop all
// move on the same clock. Small screens, reduced motion, and no-JS render
// the .fallback-flow instead.
const stageTrack = document.getElementById("stage");
const stageMotion = window.matchMedia(
  "(min-width: 1200px) and (prefers-reduced-motion: no-preference)"
);

if (stageTrack) {
  const frame = stageTrack.querySelector(".stage-frame");
  const scenes = Array.from(frame.querySelectorAll(".scene"));
  const screens = Array.from(frame.querySelectorAll("[data-screen]"));

  // Scene boundaries as fractions of track progress. Scene 0 (hero) holds a
  // little longer; tune these to taste.
  const BOUNDS = [0.22, 0.48, 0.74];

  let current = -1;
  const update = () => {
    if (!stageMotion.matches) return;
    const rect = stageTrack.getBoundingClientRect();
    const runway = rect.height - window.innerHeight;
    const p = Math.min(1, Math.max(0, -rect.top / runway));
    let scene = 0;
    BOUNDS.forEach((b, i) => {
      if (p >= b) scene = i + 1;
    });
    if (scene === current) return;
    current = scene;
    frame.dataset.scene = String(scene);
    document.body.classList.toggle("nav-solid", scene !== 0);
    scenes.forEach((el, i) => {
      el.classList.toggle("is-past", i < scene);
      el.classList.toggle("is-active", i === scene);
      el.classList.toggle("is-future", i > scene);
    });
    screens.forEach((img, i) => img.classList.toggle("active", i === scene));
  };

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    },
    { passive: true }
  );
  window.addEventListener("resize", update, { passive: true });

  // Live gate: engage/disengage the motion experience whenever the media
  // query flips (window resized across 1200px, reduced-motion toggled),
  // not just at load.
  const applyMode = () => {
    const on = stageMotion.matches;
    document.body.classList.toggle("stage-motion", on);
    if (on) {
      current = -1; // force a re-sync of scene state
      update();
    } else {
      document.body.classList.remove("nav-solid");
    }
  };
  stageMotion.addEventListener("change", applyMode);
  applyMode();
}

// --- Prototype palette switcher ---------------------------------------------
// Cycles candidate palettes for the mock's unresolved grays. Persists across
// pages via localStorage; also settable with ?palette=white|soft|warm|figma.
// REMOVE (this block + the matching redesign.css block) before launch.
{
  const PALETTES = ["figma", "white", "soft", "warm", "photo"];
  const fromQuery = new URLSearchParams(location.search).get("palette");
  const saved = PALETTES.includes(fromQuery)
    ? fromQuery
    : localStorage.getItem("proto-palette");
  if (PALETTES.includes(saved) && saved !== "figma") {
    document.body.dataset.palette = saved;
  }
  const sw = document.createElement("button");
  sw.className = "palette-switch";
  sw.type = "button";
  const label = () => `Palette: ${document.body.dataset.palette || "figma"}`;
  sw.textContent = label();
  sw.addEventListener("click", () => {
    const cur = document.body.dataset.palette || "figma";
    const next = PALETTES[(PALETTES.indexOf(cur) + 1) % PALETTES.length];
    if (next === "figma") delete document.body.dataset.palette;
    else document.body.dataset.palette = next;
    localStorage.setItem("proto-palette", next);
    sw.textContent = label();
  });
  document.body.appendChild(sw);
}

// --- Premium plan billing-cycle toggle -------------------------------------
// Monthly pricing isn't finalized; the toggle moves but flags the price as TBD.
document.querySelectorAll(".plan-toggle").forEach((toggle) => {
  const note = toggle.parentElement.querySelector(".plan-toggle-note");
  toggle.addEventListener("click", () => {
    const monthly = toggle.dataset.cycle === "annual";
    toggle.dataset.cycle = monthly ? "monthly" : "annual";
    if (note) {
      note.textContent = monthly ? "Monthly pricing coming soon" : "";
    }
  });
});

// --- FAQ live search --------------------------------------------------------
const faqSearch = document.querySelector(".faq-search");
if (faqSearch) {
  const sections = Array.from(document.querySelectorAll(".faq-section"));
  const empty = document.querySelector(".faq-empty");

  faqSearch.addEventListener("input", () => {
    const q = faqSearch.value.trim().toLowerCase();
    let anyVisible = false;

    sections.forEach((section) => {
      let sectionHasMatch = false;
      section.querySelectorAll("details").forEach((item) => {
        const match = q === "" || item.textContent.toLowerCase().includes(q);
        item.hidden = !match;
        if (match) sectionHasMatch = true;
        // Open matches while searching so the hit is visible; close when cleared.
        if (q !== "") {
          item.open = match;
        } else {
          item.open = false;
        }
      });
      section.hidden = !sectionHasMatch;
      if (sectionHasMatch) anyVisible = true;
    });

    if (empty) empty.style.display = anyVisible ? "none" : "block";
  });
}
