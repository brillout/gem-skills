/** A skill's page: copy buttons, and the weekly-installs sparkline. */

import { mountSparklines } from "../../sparkline.ts";

mountSparklines(document);

document.addEventListener("click", (event) => {
  const button = (event.target as Element).closest<HTMLElement>("[data-copy]");
  if (!button?.dataset.copy) return;
  navigator.clipboard?.writeText(button.dataset.copy).then(() => {
    button.textContent = "Copied";
    setTimeout(() => (button.textContent = "Copy"), 1500);
  });
});
