// Cliick.com redesign prototype — issue #3

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
