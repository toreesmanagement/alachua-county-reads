(function () {
  /* Neutral production-ready footer helper.
     This replaces the previous Community Review Prototype script and removes review-period language. */

  const VERSION_LABEL = "Alachua County Reads • Version 1.0";

  function removeOldReviewBlocks() {
    document.querySelectorAll(
      ".community-review-banner, .why-community-review, .prototype-footer-label"
    ).forEach(el => el.remove());
  }

  function addFooterLabel() {
    const footer = document.querySelector("footer");
    if (!footer) return;

    if (!footer.querySelector(".site-version-label")) {
      const label = document.createElement("p");
      label.className = "site-version-label";
      label.textContent = VERSION_LABEL;
      footer.appendChild(label);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    removeOldReviewBlocks();
    addFooterLabel();
  });
})();
