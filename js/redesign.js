// Cliick.com redesign prototype — issue #3

// --- Stage phone: fixed phone whose screen tracks the section in view ------
// The phone sits fixed from the hero onward; scrolling changes which screen
// shows (crossfade) and reveals each section's copy. Small screens, reduced
// motion, and no-JS all fall back to static per-section phones in .win boxes.
const stage = document.getElementById("stage");
const stageMotion = window.matchMedia(
  "(min-width: 1200px) and (prefers-reduced-motion: no-preference)"
);

if (stage && stageMotion.matches) {
  document.body.classList.add("stage-motion");

  const phoneUnit = stage.querySelector(".stage-phone");
  const screens = Array.from(phoneUnit.querySelectorAll("[data-screen]"));
  const hero = stage.querySelector(".hero");
  const rows = Array.from(stage.querySelectorAll(".showcase .row"));
  const showcase = stage.querySelector(".showcase");

  const showScreen = (index) => {
    screens.forEach((img, i) => img.classList.toggle("active", i === index));
  };

  // Whichever section crosses the vertical center of the viewport wins.
  const centerBand = { rootMargin: "-45% 0px -45% 0px", threshold: 0 };
  new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) showScreen(0);
    });
  }, centerBand).observe(hero);
  rows.forEach((row, i) => {
    new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) showScreen(i + 1);
      });
    }, centerBand).observe(row);
  });

  // The gray mock window appears once the showcase starts…
  new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      phoneUnit.classList.toggle("in-showcase", e.isIntersecting);
    });
  }, { rootMargin: "-25% 0px -25% 0px", threshold: 0 }).observe(showcase);

  // …and the whole phone bows out when the stage has scrolled past.
  new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      phoneUnit.classList.toggle("is-hidden", !e.isIntersecting);
    });
  }, { rootMargin: "0px 0px -20% 0px", threshold: 0 }).observe(stage);

  // Copy reveal per section.
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      e.target.classList.toggle("in-view", e.isIntersecting);
    });
  }, { rootMargin: "0px 0px -18% 0px", threshold: 0.15 });
  stage.querySelectorAll(".showcase-copy").forEach((el) => revealObserver.observe(el));
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
