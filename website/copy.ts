/** Buttons that copy their `data-copy` text, such as install commands. */
export function mountCopyButtons() {
  document.addEventListener("click", (event) => {
    const button = (event.target as Element).closest<HTMLElement>("[data-copy]");
    if (!button?.dataset.copy) return;
    navigator.clipboard?.writeText(button.dataset.copy).then(() => {
      button.textContent = "Copied";
      setTimeout(() => (button.textContent = "Copy"), 1500);
    });
  });
}
