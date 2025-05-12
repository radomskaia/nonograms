import { createDOMElement } from "../utils.js";
import { getDOMElement, setDOMElement } from "../elementsDOM.js";
import { getGameState, setGameState } from "../gameState.js";
import { showModalWindow } from "./modal.js";
import { createTimer, saveTimer, startTimer, stopTimer } from "./timer.js";
import {
  CSS_CLASSES,
  DOM_ELEMENTS,
  GAME_STATES,
  MODAL_MESSAGES,
  SOUNDS,
} from "../gameConstants.js";
import { pushScoreTable, saveScoreTable } from "./scoreTable.js";
import { buttonDisabled } from "./actionButtons.js";
import { playAudio, playVictory } from "./audio.js";

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
let gameCells, gameClues;

export function createGameField() {
  const fieldWrapper = createDOMElement({
    tagName: "table",
    classList: ["gameTable"],
  });
  tbody = createDOMElement({
    tagName: "tbody",
  });
  tbody.addEventListener("contextmenu", (event) => event.preventDefault());
  fieldWrapper.append(tbody);
  createGameTable();
  return fieldWrapper;
}

export function createGameTable() {
  tbody.replaceChildren();
  const size = getGameState("size");
  gameClues = {
    row: [],
    column: [],
  };
  gameCells = [];
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
        cell.append(createTimer());
        cell.classList.add("timerCell");
      } else if (j === 0) {
        cell = createGameCell(gameClues.row, true);
      } else if (i === 0) {
        cell = createGameCell(gameClues.column, true);
        cell.addEventListener("mouseenter", function () {
          gameCells.forEach((row) => row[j - 1].classList.add("highlightCell"));
          cell.classList.add("highlightCell");
        });

        cell.addEventListener("mouseleave", function () {
          gameCells.forEach((row) =>
            row[j - 1].classList.remove("highlightCell"),
          );
          cell.classList.remove("highlightCell");
        });
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

  if (!isHeader) {
    cell.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      mousedownHandler(event, cell, i, j);
    });
    cell.addEventListener("click", (event) =>
      mousedownHandler(event, cell, i, j),
    );
    cell.addEventListener("mouseenter", function () {
      gameCells.forEach((row) => row[j].classList.add("highlightCell"));
      gameClues.column[j].classList.add("highlightCell");
    });

    cell.addEventListener("mouseleave", function () {
      gameCells.forEach((row) => row[j].classList.remove("highlightCell"));
      gameClues.column[j].classList.remove("highlightCell");
    });

    let touchTime;
    let touchTimer;

    cell.addEventListener("touchstart", (event) => {
      if (event.target === cell) {
        event.preventDefault()
        touchTime = Date.now()
        touchTimer = setTimeout(() => {
          mousedownHandler(2, cell, i, j);
        }, 300)
    }
    })

    cell.addEventListener("touchend", () => {
      const now = Date.now();
      const timeDiff = now - touchTime;
      if (timeDiff <= 300) {
        clearTimeout(touchTimer)
        mousedownHandler(0, cell, i, j);
      }
    });

    cell.addEventListener("touchcancel", () => {
      clearTimeout(touchTimer)
    });
  }

  return cell;
}

function mousedownHandler(event, cell, i, j) {
  if (getGameState(GAME_STATES.isEndGame)) {
    return;
  }

  if (!getGameState(GAME_STATES.isTimer)) {
    startTimer();
    setGameState(GAME_STATES.isTimer, true);
    buttonDisabled(false, [DOM_ELEMENTS.save]);
    buttonDisabled(false, [DOM_ELEMENTS.reset]);
  }

  const action = clickActions[event.button ?? event];
  if (!action) {
    return;
  }

  const levelMatrix = getGameState(GAME_STATES.levelMatrix);
  const userMatrix = getGameState(GAME_STATES.userMatrix);

  cell.classList.toggle(action.toggle);
  cell.classList.remove(action.remove);
  action.handler(levelMatrix[i][j], userMatrix, i, j);
}

function leftButtonHandler(correctValue, userMatrix, i, j) {
  if (userMatrix[i][j] === 1) {
    userMatrix[i][j] = 0;
    playAudio(SOUNDS.clear);
  } else {
    userMatrix[i][j] = 1;
    playAudio(SOUNDS.filled);
  }
  changeCorrectCount(correctValue, userMatrix[i][j]);
}

function rightButtonHandler(correctValue, userMatrix, i, j) {
  const previousValue = userMatrix[i][j];
  if (userMatrix[i][j] === 2) {
    userMatrix[i][j] = 0;
    playAudio(SOUNDS.clear);
  } else {
    userMatrix[i][j] = 2;
    playAudio(SOUNDS.crossed);
  }

  if (previousValue === 1) {
    changeCorrectCount(correctValue, userMatrix[i][j]);
  }
}

function changeCorrectCount(correctValue, userValue) {
  let correctCount = getGameState(GAME_STATES.correctCount);

  userValue = userValue === 2 ? 0 : userValue;
  correctCount += correctValue === userValue ? 1 : -1;

  setGameState(GAME_STATES.correctCount, correctCount);
  checkGameOver(correctCount);
}

function checkGameOver(correctCount) {
  if (correctCount !== getGameState(GAME_STATES.levelMatrixSum)) {
    return;
  }
  gameOver();
}

function gameOver() {
  playVictory();
  stopTimer();
  saveTimer();
  setGameState(GAME_STATES.isEndGame, true);
  const name = getGameState(GAME_STATES.levelName);
  const size = getGameState([GAME_STATES.size]);
  const timer = getGameState([GAME_STATES.timer]);
  const winnerData = {
    [GAME_STATES.timer]: timer,
    data: [
      `${name[0].toUpperCase()}${name.slice(1)}`,
      `${size}x${size}`,
      `${getDOMElement(DOM_ELEMENTS.timerMinutes).textContent}
      : ${getDOMElement(DOM_ELEMENTS.timerSeconds).textContent}`,
    ],
  };
  buttonDisabled(false, [DOM_ELEMENTS.score]);
  buttonDisabled(true, [DOM_ELEMENTS.save]);
  buttonDisabled(true, [DOM_ELEMENTS.solution]);
  pushScoreTable(winnerData);
  saveScoreTable();
  const textContent =
    MODAL_MESSAGES.firstPart + timer + MODAL_MESSAGES.lastPart;
  showModalWindow(textContent, true);
  setGameState(GAME_STATES.isTimer, false);
}
