import { createDOMElement } from "../utils.js";

import { getDOMElement, setDOMElement } from "../elementsDOM.js";
import { CSS_CLASSES } from "../gameConstants.js";
import { getGameState, resetGameField, setGameState } from "../gameState.js";
import { createGameTable, renderGameClues } from "./gameField.js";
import {
  calculateClues,
  calculateLevelMatrixSum,
  createProcessMatrix,
} from "../matrix.js";
import { matrixPicture } from "../matrixPicture.js";

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
  calculateClues();
  createProcessMatrix();
  calculateLevelMatrixSum();
  renderGameClues();
  resetGameField();
}

export function createLevels(levels) {
  const levelWrapper = createDOMElement({
    tagName: "div",
    classList: ["levelWrapper"],
  });
  const levelList = createLevelList(levels);
  const levelDropList = createDropList();
  updateDropList();
  updateLevel();
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

function createDropList() {
  const levelSelect = createDOMElement({
    tagName: "select",
    classList: ["levelField"],
    attributes: {
      id: "level-picture",
    },
  });
  levelSelect.addEventListener("change", () => {
    const levelName = levelSelect.value;
    setGameState("levelName", levelName);
    setGameState(
      "levelMatrix",
      matrixPicture[getGameState("cellCount")][levelName],
    );
    updateLevel();
  });
  const options = {};
  const optionsElements = new Map();
  Object.entries(matrixPicture).forEach(([key, value]) => {
    options[key] = [];
    Object.keys(value).forEach((name) => {
      options[key].push(name);
    });
  });
  Object.entries(options).forEach(([key, value]) => {
    optionsElements.set(key, new Map());
    value.forEach((item) => {
      const optionEl = createDOMElement({
        tagName: "option",
        textContent: item,
      });

      optionsElements.get(key).set(item, optionEl);
      levelSelect.append(optionEl);
    });
  });
  setDOMElement("options", optionsElements);
  return levelSelect;
}

export function updateDropList(isSaved = false) {
  const currLevel = getGameState("cellCount");
  const options = getDOMElement("options");
  const gameName = getGameState("levelName");
  options.forEach((value, key) => {
    if (currLevel === +key) {
      value.forEach((item, key) => {
        if (isSaved && key === gameName) {
          item.selected = true;
        }
        item.classList.remove("display-none");
      });
      if (isSaved) {
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
