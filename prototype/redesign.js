// Cliick.com redesign prototype — issue #3

// --- Statement section: animate the headline + sub-line in once scrolled
// into view. One-shot reveal (doesn't re-trigger scrolling back up).
{
  const statement = document.querySelector(".statement");
  if (statement) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          statement.classList.add("in-view");
          observer.unobserve(statement);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(statement);
  }
}

// --- Phone-pin showcase, stage 4: fully scroll-scrubbed, no timed CSS
// transitions at all. Every value below is a pure function of scroll
// fraction through the track — scroll a little, it moves a little; stop
// scrolling, it stops exactly where it is. Spec per panel:
//   1. Headline (and its eyebrow, e.g. "Step 1.") fades in FAST while it's
//      still sliding up — opacity hits 1 partway through the slide
//      (HEADLINE_FADE_FRAC of the ENTER phase), so it reads clearly for the
//      remainder of its travel instead of still-fading right up until it
//      lands. The eyebrow rides in lock-step with the headline (same
//      opacity/offset every frame), since it's meant to read as part of the
//      same entrance, not a separate reveal. Bullets/link are not part of
//      this — they stay fully hidden until the headline actually reaches
//      its resting spot.
//   2. Once the headline lands, each bullet (or the panel's paragraph,
//      for panels with no list) wipe-reveals left-to-right, one at a
//      time, as the user keeps scrolling — a clip-path inset animated
//      from fully-clipped to fully-revealed, not an opacity fade, so it
//      reads as a wipe rather than a fade. The "Learn more" link rides
//      in with the last bullet's wipe.
//   3. Hold fully revealed for a while, then the whole panel fades out
//      IN PLACE (opacity only, no motion) before the next panel's cycle.
// The phone's screen image gets its own slower linear crossfade across
// the same enter/hold/exit envelope as the panel container.
// The phone itself is NOT faded out at the end — it physically scrolls
// away via position:sticky's own release once the track ends. The extra
// clearance that needs is handled in CSS (see the margin-top on the
// pricing section), not here.
{
  const track = document.getElementById("phone-pin-track");
  const panels = track ? Array.from(track.querySelectorAll(".phone-pin-panel")) : [];
  const screens = track ? Array.from(track.querySelectorAll(".phone-screen-img")) : [];
  const motion = window.matchMedia(
    "(min-width: 1200px) and (prefers-reduced-motion: no-preference)"
  );

  if (track && panels.length) {
    const OFFSET = 220; // px — must match the CSS starting transform on the headline
    const HEADLINE_FADE_FRAC = 0.5; // headline hits full opacity halfway through its slide
    const N = panels.length;

    const panelData = panels.map((panel) => ({
      panel,
      eyebrow: panel.querySelector(".eyebrow"),
      headline: panel.querySelector("h3"),
      revealItems: Array.from(panel.querySelectorAll("li, p")),
      link: panel.querySelector(".learn-more"),
    }));

    // Each panel gets: enter (headline slides+fades in) → bullets (each
    // reveal item wipes in, one after another) → hold (fully visible) →
    // exit (fade out in place) → gap (invisible) before the NEXT panel's
    // enter. No gap reserved after the LAST panel. The LAST panel also
    // gets no exit fade at all — its copy stays fully visible and
    // scrolls away together with the phone via position:sticky's own
    // release (see the margin-top on the pricing section for the
    // clearance that needs), rather than fading out beforehand. Units
    // below are relative, then normalized so p=1 lands exactly at the
    // last panel's hold finishing.
    const ENTER = 0.3;
    const BULLETS = 0.36;
    const HOLD = 0.3;
    const EXIT = 0.3;
    const GAP = 0.1;
    // Panel 1 ("It's all about who you know") gets a bit of extra hold
    // time once it's fully in place — a slight pause before it starts
    // fading out, on top of everyone else's normal HOLD duration.
    const EXTRA_HOLD = [0, 0.15, 0];
    const holdFor = (i) => HOLD + (EXTRA_HOLD[i] || 0);

    // base[i] is cumulative rather than i*(CYCLE+GAP) — panels no longer
    // have equal length once EXTRA_HOLD varies per panel, so each one's
    // start has to be computed from the actual sum of everything before
    // it, not a uniform multiple.
    const bases = [];
    let cumulative = 0;
    panels.forEach((_, i) => {
      bases.push(cumulative);
      const isLast = i === N - 1;
      const thisCycle = isLast
        ? ENTER + BULLETS + holdFor(i)
        : ENTER + BULLETS + holdFor(i) + EXIT;
      cumulative += thisCycle + (isLast ? 0 : GAP);
    });
    const TOTAL = cumulative;

    // Container-level envelope: drives the panel's own opacity (which,
    // since it wraps the headline/bullets/link, is what actually fades
    // the whole thing out on exit) plus the phone screen's crossfade.
    // Jumps straight to 1 at the start of ENTER rather than ramping, so
    // it never throttles the headline's own faster fade underneath it.
    // isLast panels never fade past their hold — they stay at full
    // opacity all the way to the end of the scroll range. Panel 0 (via
    // alwaysVisible) skips the "0 before base" state entirely too — it's
    // visible the instant the section is reached at all, same as the
    // phone itself, not gated behind crossing into the track's own
    // scroll range first.
    const containerOpacity = (u, base, holdEnd, exitEnd, isLast, alwaysVisible) => {
      if (!alwaysVisible && u <= base) return 0;
      if (u < holdEnd) return 1;
      if (isLast) return 1;
      if (u < exitEnd) return 1 - (u - holdEnd) / EXIT;
      return 0;
    };

    // Screen crossfade: a slower linear ramp across the whole ENTER
    // phase (distinct from the headline's snappier fade), then mirrors
    // the same hold/exit shape — except for the last panel, whose screen
    // also just stays visible and scrolls away with everything else.
    // Screen snaps instantly to whichever panel is currently active — no
    // crossfade. Visible for the panel's ENTIRE cycle (not just its
    // enter/hold), so screen 0 is already showing the moment the phone
    // lands (u=0), before the headline has even started its own fade.
    const screenOpacity = (u, base, cycleEnd) => (u >= base && u < cycleEnd ? 1 : 0);

    // Headline color wipe: sweeps left-to-right from black to #fc318b
    // across the hold phase (after the panel has fully landed, before it
    // starts to exit) — see the --wipe custom property in the CSS.
    const headlineWipeProgress = (u, wipeStart, wipeEnd) => {
      if (u <= wipeStart) return 0;
      if (u >= wipeEnd) return 1;
      return (u - wipeStart) / (wipeEnd - wipeStart);
    };

    const headlineState = (u, base, enterEnd) => {
      if (u <= base) return { opacity: 0, y: OFFSET };
      if (u < enterEnd) {
        const t = (u - base) / ENTER;
        return { opacity: Math.min(1, t / HEADLINE_FADE_FRAC), y: (1 - t) * OFFSET };
      }
      return { opacity: 1, y: 0 }; // settled; container opacity handles the exit fade
    };

    // Progress (0→1) of the k-th reveal item's own slice of the BULLETS
    // phase — used both for its clip-path wipe and, for the last item,
    // to fade the "Learn more" link in alongside it.
    const bulletProgress = (u, enterEnd, k, m) => {
      const slice = BULLETS / m;
      const start = enterEnd + k * slice;
      const end = start + slice;
      if (u <= start) return 0;
      if (u >= end) return 1;
      return (u - start) / slice;
    };

    const update = () => {
      if (!motion.matches) return;
      const rect = track.getBoundingClientRect();
      const runway = rect.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / runway));
      const u = p * TOTAL;

      panelData.forEach(({ panel, eyebrow, headline, revealItems, link }, i) => {
        const isLast = i === N - 1;
        // Panel 0 (only) skips the headline slide/fade and bullet wipe —
        // everything's already fully visible the moment the container
        // itself becomes visible, no entrance animation. Panels 1+ are
        // unchanged.
        const skipEntrance = i === 0;
        const base = bases[i];
        const enterEnd = base + ENTER;
        const bulletsEnd = enterEnd + BULLETS;
        const holdEnd = bulletsEnd + holdFor(i);
        const exitEnd = isLast ? holdEnd : holdEnd + EXIT;

        const cOpacity = containerOpacity(u, base, holdEnd, exitEnd, isLast, skipEntrance);
        panel.style.opacity = String(cOpacity);
        panel.classList.toggle("is-active", cOpacity > 0.02);

        // Headline and eyebrow share the exact same entrance timing — the
        // eyebrow (e.g. "Step 1.") is meant to land in lock-step with its
        // headline right above it, not reveal separately.
        const { opacity, y } = skipEntrance
          ? { opacity: 1, y: 0 }
          : headlineState(u, base, enterEnd);

        if (headline) {
          headline.style.opacity = String(opacity);
          headline.style.transform = `translateY(${y}px)`;
          // Wipe now matches panels 1/2's exact timing rhythm: a lag
          // before it starts (same duration as their entrance take —
          // ENTER+BULLETS, i.e. bulletsEnd), then the wipe runs the full
          // hold and finishes right as the exit begins (holdEnd), no
          // lingering fully-pink pause afterward. Simpler and now
          // uniform across all three panels — no panel-0 special case.
          const wipe = headlineWipeProgress(u, bulletsEnd, holdEnd);
          headline.style.setProperty("--wipe", `${(wipe * 100).toFixed(2)}%`);
        }

        if (eyebrow) {
          eyebrow.style.opacity = String(opacity);
          eyebrow.style.transform = `translateY(${y}px)`;
        }

        const m = revealItems.length;
        let lastProgress = 1;
        revealItems.forEach((item, k) => {
          const progress = skipEntrance ? 1 : bulletProgress(u, enterEnd, k, m);
          if (k === m - 1) lastProgress = progress;
          item.style.clipPath = `inset(0 ${(1 - progress) * 100}% 0 0)`;
        });
        if (link) link.style.opacity = String(skipEntrance ? 1 : m ? lastProgress : 1);

        const screen = screens[i];
        if (screen) {
          const cycleEnd = isLast ? Infinity : bases[i + 1];
          const sOpacity = screenOpacity(u, base, cycleEnd);
          screen.style.opacity = String(sOpacity);
          screen.classList.toggle("is-active", sOpacity > 0.02);
        }
      });
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    };

    const applyMode = () => {
      if (motion.matches) {
        window.addEventListener("scroll", onScroll, { passive: true });
        update();
      } else {
        window.removeEventListener("scroll", onScroll);
        panelData.forEach(({ panel, eyebrow, headline, revealItems, link }, i) => {
          panel.style.opacity = "";
          panel.classList.toggle("is-active", i === 0);
          if (headline) {
            headline.style.opacity = "";
            headline.style.transform = "";
          }
          if (eyebrow) {
            eyebrow.style.opacity = "";
            eyebrow.style.transform = "";
          }
          revealItems.forEach((item) => { item.style.clipPath = ""; });
          if (link) link.style.opacity = "";
        });
        screens.forEach((screen, i) => {
          screen.style.opacity = "";
          screen.classList.toggle("is-active", i === 0);
        });
      }
    };
    motion.addEventListener("change", applyMode);
    window.addEventListener("resize", () => { if (motion.matches) update(); }, {
      passive: true,
    });
    applyMode();
  }
}

// --- Header: on first load it's pinned to the hero (position:absolute,
// see CSS) — it scrolls away naturally as part of the page, not as a
// free-floating fixed bar. Once scrolled past the hero it switches to
// position:fixed (body.nav-floating) and resumes the usual hide-on-
// scroll-down / reveal-on-scroll-up behavior as a solid black bar.
// Runs on every page.
{
  const nav = document.querySelector(".nav");
  const hero = document.querySelector(".hero");
  if (nav) {
    const TOP_THRESHOLD = 8; // px of scroll before we're no longer "at the top"

    const getHeroBottom = () =>
      hero ? hero.getBoundingClientRect().bottom + window.scrollY : 0;
    let heroBottom = getHeroBottom();
    window.addEventListener(
      "resize",
      () => {
        heroBottom = getHeroBottom();
      },
      { passive: true }
    );

    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      const menuOpen = document.body.classList.contains("nav-open");
      const floating = y >= heroBottom || menuOpen;
      document.body.classList.toggle("nav-floating", floating);

      const pastTop = y > TOP_THRESHOLD;
      document.body.classList.toggle("nav-solid", pastTop);

      if (!floating) {
        // Still pinned to the hero — it's scrolling away naturally with
        // the page, no hide/reveal logic needed.
        document.body.classList.remove("nav-hidden");
      } else if (!menuOpen) {
        if (y > lastY) {
          document.body.classList.add("nav-hidden"); // scrolling down: away it goes
        } else {
          document.body.classList.remove("nav-hidden"); // scrolling up: reveal
        }
      }
      lastY = y;
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
      },
      { passive: true }
    );
    update();
  }
}

// --- Hamburger nav (≤1199px) -------------------------------------------
{
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    const setOpen = (open) => {
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.remove("nav-hidden");
      if (open) {
        document.body.classList.add("nav-solid");
      } else if (window.scrollY <= 8) {
        document.body.classList.remove("nav-solid");
      }
    };
    toggle.addEventListener("click", () => {
      setOpen(!document.body.classList.contains("nav-open"));
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => setOpen(false))
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
  }
}


// --- Premium plan billing-cycle toggle -------------------------------------
// Monthly pricing isn't finalized; the toggle moves but flags the price as TBD.
document.querySelectorAll(".plan-toggle").forEach((toggle) => {
  const note = toggle.parentElement.querySelector(".plan-toggle-note[aria-live]");
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
