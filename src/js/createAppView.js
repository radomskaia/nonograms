import { createDOMElement } from "./utils.js";
import { createButtonsWrapper } from "./components/actionButtons.js";
import { createLevelControls } from "./components/levelTabs.js";
import { LEVELS } from "./gameConstants.js";
import { createModal } from "./components/modal.js";
import { createGameField } from "./components/gameField.js";

/**
 * Creates and appends the DOM tree for the game interface.
 * Initializes event listeners and returns references to the essential elements.
 *  An object containing references to the created DOM elements.
 */
export function createAppView() {
  const main = createDOMElement({
    tagName: "main",
    classList: [
      "flex",
      "flex--column",
      "flex--align-justify-center",
      "flex_gap-30",
    ],
  });

  const header = createDOMElement({
    tagName: "header",
    classList: [
      "flex",
      "flex--align-justify-center",
      "flex--justify-around",
      "width100",
    ],
  });

  const headerPrimary = createDOMElement({
    tagName: "h1",
    textContent: "Nonograms",
    classList: ["header-primary"],
  });

  header.append(headerPrimary, createButtonsWrapper("settings"));

  main.append(
    createLevelControls(Object.values(LEVELS)),
    createButtonsWrapper("actions"),
    createGameField(),
  );

  document.body.classList.add(
    "container",
    "flex",
    "flex--column",
    "flex--align-justify-center",
    "flex_gap-30",
  );
  document.body.append(header, main, createModal());
}
