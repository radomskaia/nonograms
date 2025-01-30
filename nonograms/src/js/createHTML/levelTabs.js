import { createDOMElement } from "../utils.js";

import { setDOMElement } from "../elementsDOM.js";
import { CSS_CLASSES } from "../gameConstants.js";
import { getGameState, resetGameField, setGameState } from "../gameState.js";
import { createGameTable, renderGameClues } from "./gameField.js";
import { calculateMatrix } from "../matrix.js";
import { gamesData } from "../gamesData.js";

const options = new Map();

export function createLevels(levels) {
  const levelWrapper = createDOMElement({
    tagName: "div",
    classList: ["levelWrapper"],
  });
  const levelList = createLevelList(levels);
  const levelDropList = createDropList();
  levelWrapper.append(levelList, levelDropList);
  return levelWrapper;
}

function createLevelList(levels) {
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
  if (id === 5) {
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
  liElement.append(inputElement, labelElement);
  liElement.addEventListener("click", () => {
    updateTab(id);
  });
  return liElement;
}

function createDropList() {
  const dropList = createDOMElement({
    tagName: "select",
    classList: ["levelField"],
    attributes: {
      id: "level-picture",
    },
  });
  dropList.addEventListener("change", () => {
    dropListHandler(dropList.value);
  });

  gamesData.forEach(({ name, size }, index) => {
    options.set(name, new Map());
    const optionEl = createDOMElement({
      tagName: "option",
      textContent: name,
    });
    options.get(name).set("element", optionEl);
    options.get(name).set("size", size);
    options.get(name).set("index", index);
    dropList.append(optionEl);
  });
  return dropList;
}

function dropListHandler(levelName) {
  const dataIndex = options.get(levelName).get("index");
  setGameState("levelName", levelName);

  setGameState("levelMatrix", gamesData[dataIndex].matrix);
  updateLevel();
}

export function updateTab(id) {
  const cellCount = getGameState("cellCount");
  if (cellCount === id) {
    return;
  }
  setGameState("cellCount", id);
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
  const currLevel = getGameState("cellCount");
  const gameName = getGameState("levelName");
  let lastSize;
  options.forEach((data, name) => {
    const index = data.get("index");
    const size = data.get("size");
    const element = data.get("element");

    if (currLevel !== size) {
      element.classList.add("display-none");
      return;
    }

    element.classList.remove("display-none");

    if (isContinue && name === gameName) {
      element.selected = true;
    }

    const isFirstElement = size !== lastSize;
    lastSize = size;
    if (isContinue || !isFirstElement) {
      return;
    }
    element.selected = true;
    setGameState("levelMatrix", gamesData[index].matrix);
    setGameState("levelName", name);
  });
}
