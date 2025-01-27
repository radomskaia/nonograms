import { createDOMElement } from "../utils.js";

import { elementsDOM, getDOMElement, setDOMElement } from "../elementsDOM.js";
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
    updateTab(id);
  });
  return liElement;
}

function updateTab(id) {
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
  renderGameClues();
  calculateLevelMatrixSum();
}

export function createLevels(levels) {
  const levelWrapper = createDOMElement({
    tagName: "div",
    classList: ["levelWrapper"],
  });
  const levelList = createLevelList(levels);
  const levelDropList = createDropList();
  updateDropList();
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
  levelSelect.addEventListener("change", (e) => {
    setGameState(
      "levelMatrix",
      matrixPicture[getGameState("cellCount")][levelSelect.value],
    );
    updateLevel();
    resetGameField();
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

function updateDropList() {
  const currLevel = getGameState("cellCount");
  const options = getDOMElement("options");
  options.forEach((value, key) => {
    if (currLevel === +key) {
      value.forEach((item) => {
        item.classList.remove("display-none");
      });
      const firstElement = value.entries().next();
      firstElement.value[1].selected = true;
      setGameState("levelMatrix", matrixPicture[key][firstElement.value[0]]);
      updateLevel();
    } else {
      value.forEach((item) => {
        item.classList.add("display-none");
      });
    }
  });
}
