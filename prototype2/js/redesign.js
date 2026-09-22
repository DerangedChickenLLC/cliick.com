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

/* Subpages: the nav rides fixed like the homepage's, so it needs a ground
   once you leave the top. Not part of the colour spike — keep this. */
{
  const body = document.body;
  if (body.classList.contains("page-gray")) {
    const stick = () => body.classList.toggle("nav-stuck", window.scrollY > 24);
    stick();
    window.addEventListener("scroll", stick, { passive: true });
  }
}

/* SPIKE (#37) — the subpage tint is a continuous function of scroll
   progress, walking the same three pairs the homepage scenes step through.
   Home can step because each step lands on a scene you watch arrive; a
   subpage has no such beat, so it interpolates instead. */
{
  const body = document.body;
  if (body.classList.contains("page-gray")) {
    /* EXPERIMENT (#37) — the colour lives in the shadows, not the highlights.
       The scrim blends with `lighten`, which takes the per-channel maximum:
       it can only ever raise a pixel to the tint, never past it. So the tint
       is a DARK colour — it sets a floor. Black corners become deep indigo;
       anything already brighter than the floor (the photograph's own sunset)
       is left exactly as it was. That is a split tone: cool shadows, the
       photo's warm highlights untouched.

       A bright tint here would be identical to painting normally, because
       nothing in the picture is brighter than it. That is what the previous
       values were doing, and why they read as raised highlights. */
    /* The two floors are not the same height, because the two halves of the
       photograph are not. The left is deep shade, so a dark indigo floor
       catches it. The right is the sunset — its own darkest parts still sit
       around 53,42,43, so a floor down at 56,28,26 never touched a pixel and
       the warm side was doing nothing at all. Raised until it engages the
       shade under the light without reaching the light itself: measured, it
       moves the right-hand mid-tones and shadows while the highlights stay
       within a point of untouched. Low blue on purpose — this lifts warm
       shade toward gold, not toward a wash. */
    const STOPS = [
      { cool: [16, 24, 62], coolA: 0.95, coolY: 28, warm: [118, 76, 36], warmA: 0.85, warmY: 22 },
      { cool: [30, 24, 70], coolA: 1.00, coolY: 46, warm: [128, 66, 58], warmA: 0.95, warmY: 38 },
      { cool: [46, 26, 66], coolA: 0.95, coolY: 62, warm: [136, 92, 40], warmA: 1.00, warmY: 54 },
    ];
    /* The opaque closing band covers the last stretch of every subpage, so the
       arc has to finish before you reach it or its end never gets seen. */
    const RUNWAY = 0.78;
    const mix = (a, b, t) => a + (b - a) * t;
    const rgb = (a, b, t) => a.map((v, i) => Math.round(mix(v, b[i], t))).join(", ");
    let queued = false;

    const paint = () => {
      queued = false;
      const span = document.documentElement.scrollHeight - window.innerHeight;
      const raw = span > 0 ? Math.min(1, Math.max(0, window.scrollY / span)) : 0;
      const p = Math.min(1, raw / RUNWAY);
      const seg = Math.min(STOPS.length - 2, Math.floor(p * (STOPS.length - 1)));
      const t = p * (STOPS.length - 1) - seg;
      const a = STOPS[seg];
      const b = STOPS[seg + 1];
      /* The pair arrives as the hero leaves, the way it arrives on Home when
         scene 0 gives way. The hero's own height is the runway, so a tall
         hero holds the photograph longer — which is what it is there for. */
      const hero = document.querySelector(".page-hero");
      const runway = hero ? hero.offsetHeight : window.innerHeight;
      const arrive = Math.min(1, window.scrollY / runway);

      const st = body.style;
      /* Full strength: with `lighten` the layer opacity dilutes the floor back
         toward the backdrop, so 0.66 was only two thirds of a lift. The mode
         already protects the highlights — the scrim does not need holding
         back the way an additive one did. */
      st.setProperty("--pair-op", (arrive * arrive * (3 - 2 * arrive)).toFixed(3));
      st.setProperty("--pair-cool", rgb(a.cool, b.cool, t));
      st.setProperty("--pair-cool-a", mix(a.coolA, b.coolA, t).toFixed(3));
      st.setProperty("--pair-cool-y", mix(a.coolY, b.coolY, t).toFixed(1) + "%");
      st.setProperty("--pair-warm", rgb(a.warm, b.warm, t));
      st.setProperty("--pair-warm-a", mix(a.warmA, b.warmA, t).toFixed(3));
      st.setProperty("--pair-warm-y", mix(a.warmY, b.warmY, t).toFixed(1) + "%");
    };

    const tick = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
  }
}
