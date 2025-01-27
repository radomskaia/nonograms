import { createDOMElement } from "../utils.js";
import { createActionButtons } from "../createHTML/actionButtons.js";
import { createLevels } from "../createHTML/levelTabs.js";
import { LEVELS } from "../gameConstants.js";
import { createModal } from "../createHTML/modal.js";
import { createGameField } from "../createHTML/gameField.js";

/**
 * Creates and appends the DOM tree for the game interface.
 * Initializes event listeners and returns references to the essential elements.
 *  An object containing references to the created DOM elements.
 */
export function createDOMTree() {
  const allElements = {};

  allElements.container = createDOMElement({
    classList: [
      "container",
      "flex",
      "flex--column",
      "flex--align-justify-center",
      "flex_gap-30",
    ],
  });

  allElements.flexDiv = createDOMElement({
    classList: ["flex", "flex--align-justify-center", "flex_gap-30"],
  });

  allElements.headerPrimary = createDOMElement({
    tagName: "h1",
    textContent: "Nonograms",
    classList: ["header-primary"],
  });

  allElements.timerWrapper = createDOMElement({
    classList: ["flex", "flex--align-justify-center", "flex_gap-10"],
  });

  allElements.timer = createDOMElement({
    tagName: "p",
    textContent: "XX : XX",
    classList: ["flex", "flex--align-justify-center", "flex_gap-10"],
  });

  allElements.timerWrapper.append(allElements.timer);

  allElements.settingsWrapper = createDOMElement({
    classList: ["flex", "flex--align-justify-center", "flex_gap-10"],
  });

  allElements.settingsWrapper.append(
    ...createActionButtons({
      sound: () => {},
      theme: () => {},
      recordList: () => {},
    }),
  );

  allElements.flexDiv.append(
    allElements.headerPrimary,
    allElements.timerWrapper,
    allElements.settingsWrapper,
  );

  allElements.buttonsWrapper = createDOMElement({
    classList: ["flex", "flex--align-justify-center", "flex_gap-10"],
  });
  allElements.levelList = createLevels(Object.values(LEVELS));
  allElements.buttonsWrapper.append(
    allElements.levelList,
    ...createActionButtons({
      reset: () => {},
      save: () => {},
      continue: () => {},
      solution: () => {},
    }),
  );

  allElements.fieldWrapper = createGameField();

  allElements.container.append(
    allElements.flexDiv,
    allElements.buttonsWrapper,
    allElements.fieldWrapper,
  );

  allElements.modal = createModal();
  document.body.append(allElements.container, allElements.modal.modal);
}
