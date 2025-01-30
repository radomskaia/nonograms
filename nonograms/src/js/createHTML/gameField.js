import { createDOMElement } from "../utils.js";
import { getDOMElement, setDOMElement } from "../elementsDOM.js";
import { getGameState, setGameState } from "../gameState.js";
import { showModalWindow } from "./modal.js";
import { saveTimer, startTimer, stopTimer } from "./timer.js";
import { CSS_CLASSES, DOM_ELEMENTS, GAME_STATES } from "../gameConstants.js";

const clickActions = {
  0: {
    toggle: CSS_CLASSES.filled,
    remove: CSS_CLASSES.crossed,
    handler: leftButtonHandler,
  },
  2: {
    toggle: CSS_CLASSES.crossed,
    remove: CSS_CLASSES.filled,
    handler: rightButtonHandler,
  },
};

let tbody;

export function createGameField() {
  const fieldWrapper = createDOMElement({
    tagName: "table",
    classList: ["gameTable"],
  });
  tbody = createDOMElement({
    tagName: "tbody",
  });
  fieldWrapper.append(tbody);
  createGameTable();
  return fieldWrapper;
}

export function createGameTable() {
  tbody.replaceChildren();
  const size = getGameState("size");
  const gameCells = [];
  const gameClues = {
    row: [],
    column: [],
  };
  for (let i = 0; i <= size; i++) {
    if (i !== 0) {
      gameCells.push([]);
    }
    const gameRow = createDOMElement({
      tagName: "tr",
      classList: ["gameRow"],
    });
    for (let j = 0; j <= size; j++) {
      let cell;
      if (i === 0 && j === 0) {
        cell = createGameCell(null, true);
      } else if (j === 0) {
        cell = createGameCell(gameClues.row, true);
      } else if (i === 0) {
        cell = createGameCell(gameClues.column, true);
      } else {
        cell = createGameCell(gameCells[i - 1], false, i - 1, j - 1);
      }
      gameRow.append(cell);
    }
    setDOMElement(DOM_ELEMENTS.gameCells, gameCells);
    setDOMElement(DOM_ELEMENTS.gameClues, gameClues);
    tbody.append(gameRow);
  }
}

export function renderGameClues() {
  const gameCluesElements = getDOMElement(DOM_ELEMENTS.gameClues);
  const gameCluesContent = getGameState(GAME_STATES.clues);
  Object.entries(gameCluesContent).forEach(([key, value]) => {
    const joinSymbol = key === "row" ? " " : "\n\n";
    value.forEach((arr, index) => {
      gameCluesElements[key][index].textContent = arr.join(joinSymbol);
    });
  });
}

function createGameCell(arr, isHeader, i = 0, j = 0) {
  const options = { classList: ["cell"] };
  if (isHeader) {
    options.tagName = "th";
    options.classList.push("tableHeader");
  } else {
    options.tagName = "td";
  }
  const cell = createDOMElement(options);
  arr?.push(cell);

  if (isHeader) {
    return cell;
  }

  cell.addEventListener("mousedown", (event) => {
    mousedownHandler(event, cell, i, j);
  });

  cell.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  return cell;
}

function mousedownHandler(event, cell, i, j) {
  const isEndGame = getGameState(GAME_STATES.isEndGame);
  const isTimer = getGameState(GAME_STATES.isTimer);
  if (isEndGame) {
    return;
  }
  if (!isTimer) {
    startTimer();
    setGameState(GAME_STATES.isTimer, true);
  }
  const levelMatrix = getGameState(GAME_STATES.levelMatrix);
  const userMatrix = getGameState(GAME_STATES.userMatrix);
  if (event.button in clickActions) {
    cell.classList.toggle(clickActions[event.button].toggle);
    cell.classList.remove(clickActions[event.button].remove);
    clickActions[event.button].handler(levelMatrix[i][j], userMatrix, i, j);
  }
}

function leftButtonHandler(correctValue, userMatrix, i, j) {
  userMatrix[i][j] = userMatrix[i][j] === 1 ? 0 : 1;
  changeCorrectCount(correctValue, userMatrix[i][j]);
}

function rightButtonHandler(correctValue, userMatrix, i, j) {
  const oldValue = userMatrix[i][j];

  userMatrix[i][j] = userMatrix[i][j] === 2 ? 0 : 2;

  if (oldValue === 1) {
    changeCorrectCount(correctValue, userMatrix[i][j]);
  }
}

function changeCorrectCount(correctValue, userValue) {
  let correctCount = getGameState(GAME_STATES.correctCount);

  if (userValue === 2) {
    userValue = 0;
  }
  if (correctValue === userValue) {
    correctCount++;
  } else {
    correctCount--;
  }
  setGameState(GAME_STATES.correctCount, correctCount);
  checkGameOver(correctCount);
}

function checkGameOver(correctCount) {
  const levelMatrixSum = getGameState(GAME_STATES.levelMatrixSum);
  if (correctCount !== levelMatrixSum) {
    return;
  }

  stopTimer();
  saveTimer();
  setGameState(GAME_STATES.isEndGame, true);
  showModalWindow();
  setGameState(GAME_STATES.isTimer, false);
}
