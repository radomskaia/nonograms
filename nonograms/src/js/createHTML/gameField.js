import { createDOMElement } from "../utils.js";
import { getDOMElement, setDOMElement } from "../elementsDOM.js";
import { getGameState, setGameState } from "../gameState.js";
import { showModalWindow } from "./modal.js";
import { saveTimer, startTimer, stopTimer } from "./timer.js";

const clickActions = {
  0: {
    toggle: "filledCell",
    remove: "crossedCell",
    handler: leftButtonHandler,
  },
  2: {
    toggle: "crossedCell",
    remove: "filledCell",
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
  const cellCount = getGameState("cellCount");
  const gameCells = [];
  const gameClues = {
    row: [],
    column: [],
  };
  for (let i = 0; i <= cellCount; i++) {
    if (i !== 0) {
      gameCells.push([]);
    }
    const gameRow = createDOMElement({
      tagName: "tr",
      classList: ["gameRow"],
    });
    for (let j = 0; j <= cellCount; j++) {
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
    setDOMElement("gameCells", gameCells);
    setDOMElement("gameClues", gameClues);
    tbody.append(gameRow);
  }
}

export function renderGameClues() {
  const gameCluesElements = getDOMElement("gameClues");
  const gameCluesContent = getGameState("clues");

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
  const isEndGame = getGameState("isEndGame");
  const isTimer = getGameState("isTimer");
  if (isEndGame) {
    return;
  }
  if (!isTimer) {
    startTimer();
    setGameState("isTimer", true);
  }
  const levelMatrix = getGameState("levelMatrix");
  const processMatrix = getGameState("processMatrix");
  if (event.button in clickActions) {
    cell.classList.toggle(clickActions[event.button].toggle);
    cell.classList.remove(clickActions[event.button].remove);
    clickActions[event.button].handler(levelMatrix[i][j], processMatrix, i, j);
  }
}

function leftButtonHandler(correctValue, processMatrix, i, j) {
  processMatrix[i][j] = processMatrix[i][j] === 1 ? 0 : 1;
  changeCorrectCount(correctValue, processMatrix[i][j]);
}

function rightButtonHandler(correctValue, processMatrix, i, j) {
  const oldValue = processMatrix[i][j];

  processMatrix[i][j] = processMatrix[i][j] === 2 ? 0 : 2;

  if (oldValue === 1) {
    changeCorrectCount(correctValue, processMatrix[i][j]);
  }
}

function changeCorrectCount(correctValue, userValue) {
  let correctCellCount = getGameState("correctCellCount");

  if (userValue === 2) {
    userValue = 0;
  }
  if (correctValue === userValue) {
    correctCellCount++;
  } else {
    correctCellCount--;
  }
  setGameState("correctCellCount", correctCellCount);
  checkGameOver(correctCellCount);
}

function checkGameOver(correctCellCount) {
  const levelMatrixSum = getGameState("levelMatrixSum");
  if (correctCellCount !== levelMatrixSum) {
    return;
  }

  stopTimer();
  saveTimer();
  setGameState("isEndGame", true);
  showModalWindow();
  setGameState("isTimer", false);
}
