import { LEVELS } from "./gameConstants.js";

export const elementsDOM = {
  actionButtons: {},
  levelButtons: {
    [LEVELS[0]]: {},
    [LEVELS[1]]: {},
    [LEVELS[2]]: {},
  },
  modal: {},
  gameCells: null,
  gameClues: null,
  tbody: null,
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
