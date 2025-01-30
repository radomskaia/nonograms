import { createDOMElement } from "../utils.js";

import { setDOMElement } from "../elementsDOM.js";
import { CSS_CLASSES, GAME_STATES } from "../gameConstants.js";
import { getGameState, setGameState } from "../gameState.js";
import { createGameTable, renderGameClues } from "./gameField.js";
import { calculateMatrix } from "../matrix.js";
import { gamesData } from "../gamesData.js";
import { resetGameField } from "./actionButtons.js";

const options = new Map();

export function createLevelControls(levels) {
  const levelWrapper = createDOMElement({
    tagName: "div",
    classList: ["levelWrapper"],
  });
  const levelList = createDOMElement({
    tagName: "ul",
    classList: ["flex", "flex--justify-center", "flex_gap-20", "levelList"],
  });
  levels.forEach((level) => levelList.append(createRadioButton(level)));

  const levelDropList = createDropList();

  levelWrapper.append(levelList, levelDropList);

  return levelWrapper;
}

function createRadioButton(id) {
  const element = createDOMElement({
    tagName: "li",
  });
  const inputElement = createDOMElement({
    tagName: "input",
    classList: [CSS_CLASSES.displayNone],
    attributes: {
      type: "radio",
      name: "level",
      id: id,
    },
  });

  if (id === getGameState(GAME_STATES.size)) {
    inputElement.checked = true;
  }

  const labelElement = createDOMElement({
    tagName: "label",
    classList: ["button", "tabButton"],
    textContent: `${id} x ${id}`,
    attributes: {
      for: id,
    },
  });

  setDOMElement(`levelInput${id}`, inputElement);

  element.append(inputElement, labelElement);

  element.addEventListener("click", () => updateTab(id));

  return element;
}

function createDropList() {
  const selectElement = createDOMElement({
    tagName: "select",
    classList: ["levelField"],
    attributes: {
      id: "level-picture",
    },
  });

  selectElement.addEventListener("change", () =>
    dropListHandler(selectElement.value),
  );

  gamesData.forEach(({ name, size }, index) => {
    options.set(name, new Map());
    const optionElement = createDOMElement({
      tagName: "option",
      textContent: name,
    });
    options.get(name).set(GAME_STATES.element, optionElement);
    options.get(name).set(GAME_STATES.size, size);
    options.get(name).set(GAME_STATES.index, index);
    selectElement.append(optionElement);
  });

  return selectElement;
}

function dropListHandler(levelName) {
  const dataIndex = options.get(levelName).get(GAME_STATES.index);

  setGameState(GAME_STATES.levelName, levelName);
  setGameState(GAME_STATES.levelMatrix, gamesData[dataIndex].matrix);
  updateLevel();
}

export function updateTab(id) {
  if (getGameState(GAME_STATES.size) === id) {
    return;
  }

  setGameState(GAME_STATES.size, id);
  createGameTable();
  updateDropList();
  updateLevel();
}

export function updateLevel() {
  calculateMatrix();
  renderGameClues();
  resetGameField();
}

export function updateDropList(isContinue = false) {
  const currLevel = getGameState(GAME_STATES.size);
  const gameName = getGameState(GAME_STATES.levelName);
  let lastSize;

  options.forEach((data, name) => {
    const index = data.get(GAME_STATES.index);
    const size = data.get(GAME_STATES.size);
    const element = data.get(GAME_STATES.element);

    if (currLevel !== size) {
      element.classList.add(CSS_CLASSES.displayNone);
      return;
    }

    element.classList.remove(CSS_CLASSES.displayNone);

    if (isContinue && name === gameName) {
      element.selected = true;
    }

    const isFirstElement = size !== lastSize;
    lastSize = size;
    if (isContinue || !isFirstElement) {
      return;
    }
    element.selected = true;
    setGameState(GAME_STATES.levelMatrix, gamesData[index].matrix);
    setGameState(GAME_STATES.levelName, name);
  });
}
