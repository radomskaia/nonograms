import { createDOMElement } from "../utils.js";

import { setDOMElement } from "../elementsDOM.js";
import { CSS_CLASSES } from "../gameConstants.js";
import { getGameState, resetGameField, setGameState } from "../gameState.js";
import { createGameTable, renderGameClues } from "./gameField.js";
import { calculateMatrix } from "../matrix.js";
import { matrixPicture } from "../matrixPicture.js";

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

  Object.entries(matrixPicture).forEach(([key, value]) => {
    options.set(key, new Map());
    Object.keys(value).forEach((name) => {
      const optionEl = createDOMElement({
        tagName: "option",
        textContent: name,
      });
      options.get(key).set(name, optionEl);
      dropList.append(optionEl);
    });
  });
  return dropList;
}

function dropListHandler(levelName) {
  setGameState("levelName", levelName);
  setGameState(
    "levelMatrix",
    matrixPicture[getGameState("cellCount")][levelName],
  );
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
  options.forEach((value, key) => {
    if (currLevel === +key) {
      value.forEach((item, key) => {
        if (isContinue && key === gameName) {
          item.selected = true;
        }
        item.classList.remove("display-none");
      });
      if (isContinue) {
        return;
      }
      const firstElement = value.entries().next();
      firstElement.value[1].selected = true;
      const levelName = firstElement.value[0];
      setGameState("levelMatrix", matrixPicture[key][levelName]);
      setGameState("levelName", levelName);
    } else {
      value.forEach((item) => {
        item.classList.add("display-none");
      });
    }
  });
}
