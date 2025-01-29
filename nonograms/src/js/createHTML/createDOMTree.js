import { createDOMElement } from "../utils.js";
import { createActionButtons } from "./actionButtons.js";
import { createLevels } from "./levelTabs.js";
import { LEVELS } from "../gameConstants.js";
import { createModal } from "./modal.js";
import { createGameField } from "./gameField.js";
import {
  changeTheme,
  continueGame,
  resetGameField,
  saveGame,
  showSolution,
} from "../gameState.js";
import { setDOMElement } from "../elementsDOM.js";

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
  allElements.timerMin = createDOMElement({
    tagName: "p",
    textContent: "00",
    //classList: ["minutes"],
  });
  allElements.timerSeparator = createDOMElement({
    tagName: "p",
    textContent: ":",
    classList: ["flex", "flex--align-justify-center", "flex_gap-10"],
  });
  allElements.timerSec = createDOMElement({
    tagName: "p",
    textContent: "00",
    //classList: ["minutes"],
  });

  allElements.timerWrapper.append(
    allElements.timerMin,
    allElements.timerSeparator,
    allElements.timerSec,
  );

  allElements.settingsWrapper = createDOMElement({
    classList: ["flex", "flex--align-justify-center", "flex_gap-10"],
  });

  allElements.settingsWrapper.append(
    ...createActionButtons({
      sound: () => {},
      theme: changeTheme,
      recordList: () => {},
    }),
  );

  allElements.flexDiv.append(
    allElements.headerPrimary,
    allElements.timerWrapper,
    allElements.settingsWrapper,
  );

  allElements.fieldWrapper = createGameField();
  allElements.buttonsWrapper = createDOMElement({
    classList: ["flex", "flex--align-justify-center", "flex_gap-10"],
  });
  allElements.levelList = createLevels(Object.values(LEVELS));

  allElements.buttonsWrapper.append(
    allElements.levelList,
    ...createActionButtons({
      reset: resetGameField,
      save: saveGame,
      continue: continueGame,
      solution: showSolution,
    }),
  );

  allElements.container.append(
    allElements.flexDiv,
    allElements.buttonsWrapper,
    allElements.fieldWrapper,
  );

  allElements.modal = createModal();
  document.body.append(allElements.container, allElements.modal.modal);

  setDOMElement("timerMin", allElements.timerMin);
  setDOMElement("timerSec", allElements.timerSec);
}
