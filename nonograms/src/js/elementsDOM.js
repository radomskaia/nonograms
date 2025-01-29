const elementsDOM = {
  gameCells: null,
  gameClues: null,
  timerMinutes: null,
  timerSeconds: null,
  levelInput5: null,
  levelInput10: null,
  levelInput15: null,
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
