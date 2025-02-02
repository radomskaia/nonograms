import { getDOMElement, setDOMElement } from "../elementsDOM.js";
import { getGameState, setGameState } from "../gameState.js";
import { createDOMElement } from "../utils.js";
import { DOM_ELEMENTS, GAME_STATES } from "../gameConstants.js";

const MS_IN_SECOND = 1000;
const MS_IN_MINUTE = 60 * MS_IN_SECOND;

let timerIntervalId;

const previousValues = {};
let startDate;

export function createTimer() {
  const timerWrapper = createDOMElement({
    classList: [
      "flex",
      "flex--align-justify-center",
      "flex_gap-10",
      "timerWrapper",
    ],
  });
  const timerMinutes = createDOMElement({
    tagName: "p",
    textContent: "00",
  });
  const timerSeparator = createDOMElement({
    tagName: "p",
    textContent: ":",
    classList: ["flex", "flex--align-justify-center", "flex_gap-10"],
  });
  const timerSeconds = createDOMElement({
    tagName: "p",
    textContent: "00",
  });

  timerWrapper.append(timerMinutes, timerSeparator, timerSeconds);

  setDOMElement(DOM_ELEMENTS.timerMinutes, timerMinutes);
  setDOMElement(DOM_ELEMENTS.timerSeconds, timerSeconds);
  return timerWrapper;
}

function getTime(date, divider) {
  return Math.floor(date / divider);
}

function updateTextContent(type, newValue) {
  if (newValue === previousValues[type]) {
    return;
  }
  const element =
    type === "seconds"
      ? getDOMElement(DOM_ELEMENTS.timerSeconds)
      : getDOMElement(DOM_ELEMENTS.timerMinutes);
  element.textContent = `${newValue}`.padStart(2, "0");
  previousValues[type] = newValue;
}

export function updateTimer(startDate, isContinue = false) {
  let timeDifference = !isContinue
    ? Date.now() - startDate
    : startDate * MS_IN_SECOND;
  let newValues = {};
  newValues.minutes = getTime(timeDifference, MS_IN_MINUTE);
  timeDifference %= MS_IN_MINUTE;
  newValues.seconds = getTime(timeDifference, MS_IN_SECOND);

  updateTextContent("minutes", newValues.minutes);
  updateTextContent("seconds", newValues.seconds);
}

export function startTimer() {
  const timerState = getGameState(GAME_STATES.timer) * MS_IN_SECOND;
  startDate = Date.now() - timerState;
  updateTimer(startDate);
  timerIntervalId = setInterval(updateTimer, MS_IN_SECOND, startDate);
}

export function stopTimer() {
  clearInterval(timerIntervalId);
}

export function saveTimer() {
  const difference = Date.now() - startDate;
  const time = getTime(difference, MS_IN_SECOND);
  setGameState(GAME_STATES.timer, time);
}

export function resetTimer() {
  updateTextContent("minutes", 0);
  updateTextContent("seconds", 0);
  setGameState(GAME_STATES.timer, 0);
}
