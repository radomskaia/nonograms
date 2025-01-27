import { createDOMElement } from "../utils.js";

//import { gameState } from "@/js/gameState.js";
import { elementsDOM, getDOMElement } from "../elementsDOM.js";
import { CSS_CLASSES } from "../gameConstants.js";
import { getGameState, setGameState } from "../gameState.js";
import { createGameTable } from "../createHTML/gameField.js";
import { calculateClues, createProcessMatrix } from "../matrix.js";

function createRadioButton(id) {
  const liElement = createDOMElement({
    tagName: "li",
  });
  const inputElement = createDOMElement({
    tagName: "input",
    classList: [CSS_CLASSES.HIDDEN],
    attributes: {
      type: "radio",
      name: "level",
      id: id,
    },
  });
  elementsDOM.levelButtons[id] = inputElement;
  const labelElement = createDOMElement({
    tagName: "label",
    classList: ["button", "tabButton"],
    textContent: `${id} x ${id}`,
    attributes: {
      for: id,
    },
  });
  liElement.append(inputElement, labelElement);
  liElement.addEventListener("click", () => {
    if (inputElement.disabled) {
      return;
    }
    updateLevel(id);
  });
  return liElement;
}

function updateLevel(id) {
  const cellCount = getGameState("cellCount");
  if (cellCount === id) {
    return;
  }
  setGameState("cellCount", id);
  createProcessMatrix();
  createGameTable();
  calculateClues();
}

export function createLevelList(levels) {
  const levelList = createDOMElement({
    tagName: "ul",
    classList: ["flex", "flex--justify-center", "flex_gap-20", "levelList"],
  });
  const levelsButton = {};
  const levelInputs = {};
  levels.forEach((level) => {
    levelsButton[level] = createRadioButton(level, levelInputs);
  });
  levelList.append(...Object.values(levelsButton));

  return levelList;
}
