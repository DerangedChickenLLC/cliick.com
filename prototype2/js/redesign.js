// Cliick.com redesign prototype — issue #3

// --- Pinned scene stage -----------------------------------------------------
// The stage frame pins while the track scrolls through it. Scroll progress
// picks the active scene; CSS keyed off data-scene / is-past / is-active /
// is-future does all the motion, so copy, screen, window, and backdrop all
// move on the same clock. Small screens, reduced motion, and no-JS render
// the .fallback-flow instead.
const stageTrack = document.getElementById("stage");
// LANDSCAPE — wider than tall and at least 520px tall — is the one rule the
// layout switches use (see the top of redesign.css).
const LANDSCAPE = "(orientation: landscape) and (min-height: 520px)";
// The scenes run wherever Home can sit side by side: every landscape window,
// plus portrait ones 480px wide and up (a desktop window at its minimum, an
// upright iPad). Only real phones (440 and under) and short windows (a phone
// on its side) get the stacked Home. Every LANDSCAPE window passes this too,
// since it is at least 520 in both directions.
const STAGE = "(min-width: 480px) and (min-height: 520px)";
const stageMotion = window.matchMedia(
  STAGE + " and (prefers-reduced-motion: no-preference)"
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
    /* The track is taller than the viewport once laid out, but this runs at
       readyState "interactive" — the script is deferred, so it fires after
       the DOM is parsed and before the images have sized anything. WebKit
       measures the track mid-layout and hands back a height SHORTER than the
       viewport with a large positive top, which makes runway negative and
       -top/runway a large POSITIVE number. It clamps to 1, the page opens on
       the last scene with a solid nav, and nothing corrects it until you
       scroll. Chrome happens to have laid out far enough by then, which is
       why this only ever showed up in Safari.

       Measured in WebKit at 1440x900: top 2327.9, height 580.2, runway
       -319.8, p 7.28 -> 1. A negative or zero runway means there is nothing
       to scroll through yet, which is scene 0 by definition. */
    const p = runway > 0 ? Math.min(1, Math.max(0, -rect.top / runway)) : 0;
    let scene = 0;
    BOUNDS.forEach((b, i) => {
      if (p >= b) scene = i + 1;
    });
    /* The light drifts while the stage plays, the same gesture the subpages
       use down their own length: cool sinks, warm rises at 0.7 the rate.
       Outside the scene check on purpose — the colours step, the light does
       not, and that continuous motion is what reads as the glow being alive
       rather than the page being tinted. */
    const drift = p * window.innerHeight * 0.26;
    const fs = frame.style;
    fs.setProperty("--stage-cool-d", drift.toFixed(1) + "px");
    fs.setProperty("--stage-warm-d", (-drift * 0.7).toFixed(1) + "px");

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
  /* Re-sync once everything has sized. Without this a first measurement taken
     against an unsettled layout stands until the reader happens to scroll. */
  window.addEventListener("load", update);
  if (window.ResizeObserver) new ResizeObserver(update).observe(stageTrack);

  // Live gate: engage/disengage the motion experience whenever the media
  // query flips (window resized across the STAGE size, reduced-motion toggled),
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
  /* .nav is position:fixed only while .stage-motion is on, so if the gate is
     ever evaluated against a viewport width that has not settled — Safari
     reports transient sizes while a window is being restored — the nav falls
     back to position:absolute and scrolls away with the page instead of
     riding the top. Re-run the gate itself, not just the scene maths, once
     the page has finished loading.

     pageshow with persisted covers Safari's back/forward cache: returning to
     the page restores the DOM and the scroll position without firing load,
     so whatever state was frozen on the way out is still sitting there. */
  window.addEventListener("load", applyMode);
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) applyMode();
  });
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

/* --- Mobile menu ------------------------------------------------------------
   The four links live behind a button below the nav breakpoint. The CTA
   stays in the bar; only wayfinding is behind the tap.

   State lives in one place — a class on <body> — so CSS owns every visual
   consequence and JS owns none of them. aria-expanded is kept in step with
   it, since the class is what the stylesheet reads and the attribute is what
   a screen reader reads, and those two disagreeing is the usual bug here. */
{
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    const body = document.body;
    /* Displacement only opens empty space when the page is at the top —
       scrolled, sliding everything down just pulls the content above into
       the gap. So opening goes to the top first and the menu follows it
       down; scrolling closes it again. That keeps the one invariant the
       panel depends on: when it is open, the page is at zero. */
    let settling = false;
    /* Where the page was when the menu opened. See the scroll listener. */
    let openedAtY = 0;

    const openAtTop = () => {
      if (window.scrollY <= 0.5) return void reveal();
      settling = true;
      window.scrollTo({ top: 0, behavior: "smooth" });
      /* scrollend is the right signal but is not everywhere yet, so poll for
         arrival and give up after a second rather than trusting either. */
      const started = performance.now();
      const wait = () => {
        /* <= 0.5, not === 0: iOS can report a fractional or rubber-band
           position at the top of the page. */
        if (window.scrollY <= 0.5 || performance.now() - started > 1000) {
          settling = false;
          reveal();
          return;
        }
        requestAnimationFrame(wait);
      };
      requestAnimationFrame(wait);
    };

    const setOpen = (open) => {
      body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      if (open) {
        openedAtY = window.scrollY;
        /* The page slides to the panel's BOTTOM edge, not by the panel's
           height. Those are different numbers: the panel starts below the
           bar, so a page displaced by the height alone lands its own top
           edge partway down the glass — and through a translucent panel that
           edge is a visible seam, with the content above and below it
           reading as bands. Measured: panel 70 to 298, so a 228px shift put
           the hero's top at 228, inside the panel.

           Reading the rect here forces layout inside the same task the class
           was added in, so the variable is set before anything paints and
           the slide runs from zero rather than jumping a frame. */
        body.style.setProperty(
          "--menu-h",
          Math.ceil(menu.getBoundingClientRect().bottom) + "px"
        );
      }
    };

    const reveal = () => setOpen(true);

    toggle.addEventListener("click", () => {
      if (body.classList.contains("nav-open")) setOpen(false);
      else openAtTop();
    });

    /* Scrolling the page closes it — but only once the page has actually
       moved from where it was when the menu opened. Closing on any scroll
       EVENT failed in iOS Safari: after the smooth scroll to the top ends,
       Safari fires one more scroll event as the scroll settles, which
       arrived after the menu had opened and shut it straight away, so the
       menu never opened from anywhere below the top. Chrome does not send
       that trailing event. A settling event does not move the page, so
       measuring distance ignores it; a reader's scroll does. */
    window.addEventListener(
      "scroll",
      () => {
        if (settling || !body.classList.contains("nav-open")) return;
        if (Math.abs(window.scrollY - openedAtY) > 24) setOpen(false);
      },
      { passive: true }
    );

    /* Escape closes and returns the focus to the control that opened it,
       otherwise focus is left on a link inside a panel that is now
       display:none and the tab order starts again from the top. */
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && body.classList.contains("nav-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    /* A tap anywhere else closes it. Without this the only way out is the
       button itself, which is the complaint people actually have about these. */
    document.addEventListener("click", (e) => {
      if (!body.classList.contains("nav-open")) return;
      if (menu.contains(e.target) || toggle.contains(e.target)) return;
      setOpen(false);
    });

    /* Navigating to the current page does not reload it in every case, and a
       panel left open over the destination looks like the tap failed. */
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });

    /* Turn to landscape with the menu open and the links return to the bar,
       leaving the body class set and the hamburger showing a close mark for
       a control that is no longer there. */
    const wide = window.matchMedia(LANDSCAPE); // the menu button exists only in portrait
    const sync = () => { if (wide.matches) setOpen(false); };
    if (wide.addEventListener) wide.addEventListener("change", sync);
    else if (wide.addListener) wide.addListener(sync);
  }
}

/* The nav rides fixed on every page, so it needs a ground once you leave the
   top — including the homepage below the pinned stage's 1200px, where there
   is no scene logic to hand it one. */
{
  const body = document.body;
  /* The one light band in the scheme. A white-veiled bar disappears into it,
     so the nav needs to know when that band is the thing underneath it —
     which is a question about what is behind a fixed element, not about
     scroll depth, so it is measured against the bar's own height. */
  const lightBand = document.querySelector(".band.latte");
  const navEl = document.querySelector(".nav");

  const stick = () => {
    body.classList.toggle("nav-stuck", window.scrollY > 24);
    if (lightBand && navEl) {
      const band = lightBand.getBoundingClientRect();
      const navH = navEl.getBoundingClientRect().height;
      body.classList.toggle("nav-on-light", band.top < navH && band.bottom > 0);
    }
  };
  stick();
  window.addEventListener("scroll", stick, { passive: true });
  window.addEventListener("resize", stick, { passive: true });
}

/* --- Subpage backdrop colour ------------------------------------------------
   The homepage stage steps through three colour pairs, one per scene. The
   subpages walk the same three continuously against scroll progress: Home
   can step because each step lands on a scene you watch arrive, and a
   subpage has no such beat, so a jump there has nothing explaining it.

   The pair also arrives rather than being there from the first pixel — Home's
   scene 0 carries no scrim at all, because a landing is the photograph. */
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
    /* Home's sequence, exactly: the same three pairs at the same alphas and
       the same gradient centres as .stage-frame[data-scene="1|2|3"]. The
       spread stops and the shadow-lift blend were both experiments off this
       baseline; Home stayed the better read, so the subpages come back to it
       rather than the other way round. If these change, change them there
       too — the two sets have to stay identical. */
    const STOPS = [
      { cool: [38, 53, 111], coolA: 0.82, coolY: 46, warm: [224, 164, 94], warmA: 0.42, warmY: 38 },
      { cool: [52, 54, 104], coolA: 0.70, coolY: 46, warm: [224, 144, 126], warmA: 0.44, warmY: 38 },
      { cool: [62, 56, 108], coolA: 0.68, coolY: 46, warm: [217, 160, 91], warmA: 0.46, warmY: 38 },
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
            /* The ramp rides in the alphas rather than the layer's opacity, because
         the layer also carries the stage shade and that must not fade in.
         0.66 is what the stage scrim sits at. */
      const gain = arrive * arrive * (3 - 2 * arrive) * 0.66;

      /* Home's three pairs sit within a few RGB points of each other — they
         read as movement there because each one arrives under a new scene,
         and on a subpage there is no such beat, so the colour walk alone is
         below perception. Rather than pull the colours apart and break step
         with Home, move the light instead: the two pools drift in opposite
         directions down the page. The layer is fixed, so the content scrolls
         across a slowly moving source, which is what reads as a room being
         lit rather than a page being tinted. Colours stay identical to the
         stage scenes. */
      const drift = raw * 26;
      st.setProperty("--pair-cool", rgb(a.cool, b.cool, t));
      st.setProperty("--pair-cool-a", (mix(a.coolA, b.coolA, t) * gain).toFixed(3));
      st.setProperty("--pair-cool-y", (mix(a.coolY, b.coolY, t) + drift).toFixed(1) + "%");
      st.setProperty("--pair-warm", rgb(a.warm, b.warm, t));
      st.setProperty("--pair-warm-a", (mix(a.warmA, b.warmA, t) * gain).toFixed(3));
      st.setProperty("--pair-warm-y", (mix(a.warmY, b.warmY, t) - drift * 0.7).toFixed(1) + "%");
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

/* --- Legal pages --------------------------------------------------------------
   Terms and Privacy are written in the Documents repo and synced here as bare
   HTML fragments. The fragment uses <h1> for every section, which is fine on
   its own but wrong inside a page that already has one, so headings are
   stepped down a level on the way in. Nothing about the synced file changes,
   so the next sync cannot undo this. */
{
  const legal = document.querySelector(".legal[data-src]");
  if (legal) {
    const src = legal.getAttribute("data-src");
    const name = document.querySelector(".page-hero h1")?.textContent || "this page";
    fetch(src, { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error(r.status);
        return r.text();
      })
      .then((html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const body = doc.body;
        ["h5", "h4", "h3", "h2", "h1"].forEach((tag) => {
          body.querySelectorAll(tag).forEach((h) => {
            const next = document.createElement("h" + (Number(tag[1]) + 1));
            next.id = h.id;
            /* the fragment wraps each heading's text in <strong>; the heading
               style carries the weight, so the inner tag only fights it */
            next.textContent = h.textContent.trim();
            h.replaceWith(next);
          });
        });
        legal.replaceChildren(...body.childNodes);
      })
      .catch(() => {
        legal.innerHTML =
          '<p class="legal-status">The ' + name +
          ' could not be loaded just now. <a href="' + src +
          '">Open it directly</a>.</p>';
      });
  }
}

/* --- Support form -------------------------------------------------------------
   No backend: submitting composes an email in the reader's own mail app, so
   nothing leaves this page. The old version built the mailto even with every
   field empty; this one asks for the missing fields first. There is no email
   field: the message is sent from the reader's own address, so asking for it
   again collected something we never receive. */
{
  const form = document.getElementById("supportForm");
  if (form) {
    const status = form.querySelector(".support-status");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      form.classList.add("was-submitted");
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const d = new FormData(form);
      const body =
        "Name: " + d.get("name") + "\n\nMessage:\n" + d.get("message");
      window.location.href =
        "mailto:support@cliick.com?subject=" + encodeURIComponent(d.get("subject")) +
        "&body=" + encodeURIComponent(body);
      if (status) status.textContent = "Your mail app should open with the message ready to send.";
    });
  }
}
