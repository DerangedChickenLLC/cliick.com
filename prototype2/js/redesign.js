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

// --- Premium plan billing-cycle toggle -------------------------------------
// Both cycles are live and priced: $72/year or $8/month. The toggle used to
// move while claiming monthly was "coming soon", which was never true.
// Prices live on the toggle's data attributes so the copy stays in the markup;
// .plan-price carries aria-live so the change is announced, not just seen.
document.querySelectorAll(".plan-toggle").forEach((toggle) => {
  const plan = toggle.closest(".plan");
  if (!plan) return;
  const amount = plan.querySelector(".plan-price .amount");
  const termNote = plan.querySelector(".plan-price .term-note");
  const cap = plan.querySelector(".plan-cap");

  const apply = (cycle) => {
    toggle.dataset.cycle = cycle;
    // mirrored onto the card so the BEST VALUE chip can hide on monthly
    plan.dataset.cycle = cycle;
    const suffix = cycle === "monthly" ? "Monthly" : "Annual";
    if (amount) amount.textContent = toggle.dataset["amount" + suffix];
    if (termNote) termNote.textContent = toggle.dataset["note" + suffix];
    if (cap) cap.innerHTML = toggle.dataset["cap" + suffix];
  };

  toggle.addEventListener("click", () => {
    apply(toggle.dataset.cycle === "annual" ? "monthly" : "annual");
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

// --- Platform affordance ----------------------------------------------------
// A phone can install from a store link; a laptop cannot, so on desktop the
// App Store badge is a dead end and the QR code is the only thing that works.
// Mark the root element and let CSS put the useful one first. With no JS
// neither class is set and both affordances show, badges first — which is
// wrong for nobody and ideal for nobody, the correct no-JS compromise.
(function () {
  var mq = window.matchMedia("(hover: none) and (pointer: coarse)");
  var ua = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  function apply() {
    var handheld = mq.matches || ua;
    var root = document.documentElement.classList;
    root.toggle("is-handheld", handheld);
    root.toggle("is-desktop", !handheld);
  }
  apply();
  // Re-evaluated rather than set once: a tablet rotating, or an environment
  // that settles after load, would otherwise be stuck with whichever answer
  // was true for the first frame.
  if (mq.addEventListener) mq.addEventListener("change", apply);
  else if (mq.addListener) mq.addListener(apply);
})();

// --- SPIKE (#37): look switcher ---------------------------------------------
// The site reads brown once the hero photo fades toward the wall. Cycles the
// candidate looks so they can be compared on the real pages rather than in
// swatches. ?look=deep|ink|royal also works, and the choice follows you across
// pages. REMOVE this block and the matching redesign.css block with the spike.
{
  const LOOKS = ["shipped", "hold", "pair"];
  const fromQuery = new URLSearchParams(location.search).get("look");
  // ?look= has to stick, or the first nav click drops you back to shipped and
  // the pages look compared when they were not.
  if (LOOKS.includes(fromQuery)) localStorage.setItem("proto-look", fromQuery);
  const saved = LOOKS.includes(fromQuery) ? fromQuery : localStorage.getItem("proto-look");
  if (LOOKS.includes(saved) && saved !== "shipped") document.body.dataset.look = saved;

  const sw = document.createElement("button");
  sw.className = "look-switch";
  sw.type = "button";
  const label = () => `Look: ${document.body.dataset.look || "shipped"}`;
  sw.textContent = label();
  sw.addEventListener("click", () => {
    const cur = document.body.dataset.look || "shipped";
    const next = LOOKS[(LOOKS.indexOf(cur) + 1) % LOOKS.length];
    if (next === "shipped") delete document.body.dataset.look;
    else document.body.dataset.look = next;
    localStorage.setItem("proto-look", next);
    sw.textContent = label();
  });
  document.body.appendChild(sw);
}

/* SPIKE (#37) — subpage tint follows scroll, the way the stage does on the
   homepage. Three steps over the length of the page; the CSS crossfades. */
{
  const body = document.body;
  if (body.classList.contains("page-gray")) {
    let last = "";
    const tick = () => {
      const span = document.documentElement.scrollHeight - window.innerHeight;
      const p = span > 0 ? window.scrollY / span : 0;
      const tint = p < 0.3 ? "1" : p < 0.58 ? "2" : "3";
      if (tint !== last) {
        last = tint;
        body.dataset.tint = tint;
      }
    };
    tick();
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
  }
}
