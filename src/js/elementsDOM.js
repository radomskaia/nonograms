import { DOM_ELEMENTS } from "./gameConstants.js";

const elementsDOM = {
  [DOM_ELEMENTS.gameCells]: null,
  [DOM_ELEMENTS.gameClues]: null,
  [DOM_ELEMENTS.timerMinutes]: null,
  [DOM_ELEMENTS.timerSeconds]: null,
  [DOM_ELEMENTS.levelInput5]: null,
  [DOM_ELEMENTS.levelInput10]: null,
  [DOM_ELEMENTS.levelInput15]: null,
  [DOM_ELEMENTS.scoreTable]: null,
  [DOM_ELEMENTS.volume]: null,
  [DOM_ELEMENTS.changeTheme]: null,
};

export function getDOMElement(element) {
  if (element in elementsDOM) {
    return elementsDOM[element];
  }
  throw new Error(`Property "${element}" does not exist in elementsDOM.`);
}

export function setDOMElement(element, value) {
  if (element in elementsDOM) {
    elementsDOM[element] = value;
  } else {
    throw new Error(
      `Cannot set non-existent property "${element}" in elementsDOM.`,
    );
  }
}
