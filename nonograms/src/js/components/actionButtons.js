import {
  createActionButton,
  createDOMElement,
  loadFromStorage,
  saveToStorage,
} from "../utils.js";
import { resetTimer, saveTimer, stopTimer, updateTimer } from "./timer.js";
import { getDOMElement } from "../elementsDOM.js";
import { updateDropList, updateTab } from "./levelTabs.js";
import { createGameTable, renderGameClues } from "./gameField.js";
import { getGameState, setGameState } from "../gameState.js";
import { gamesData } from "../gamesData.js";
import {
  CSS_CLASSES,
  DOM_ELEMENTS,
  GAME_STATES,
  MODAL_MESSAGES,
} from "../gameConstants.js";
import { calculateMatrix } from "../matrix.js";
import { showModalWindow } from "./modal.js";
import { updateScoreTableView } from "./scoreTable.js";
import { toggleMuteAudio } from "./audio.js";
import { changeTheme } from "./changeTheme.js";

const options = {
  settings: {
    volume: volumeHandler,
    "change theme": changeTheme,
    score: scoreButtonHandler,
  },
  actions: {
    reset: resetGameField,
    save: saveGame,
    continue: continueGame,
    solution: showSolution,
    "random game": randomGame,
  },
};

const buttons = {
  [DOM_ELEMENTS.continueButton]: null,
  [DOM_ELEMENTS.score]: null,
  [DOM_ELEMENTS.save]: null,
  volume: null,
};

export function createButtonsWrapper(type) {
  const wrapper = createDOMElement({
    classList: ["flex", "flex--align-justify-center", "flex_gap-10"],
  });

  Object.entries(options[type]).forEach(([key, value]) => {
    const button = createActionButton(key, value);
    if (key in buttons) {
      buttons[key] = button;
    }
    wrapper.append(button);
  });

  buttons.volume.textContent = "SOUND ON";
  return wrapper;
}

function saveGame() {
  saveTimer();
  saveToStorage(GAME_STATES.save, getGameState(GAME_STATES.save));
  buttonDisabled(false, [DOM_ELEMENTS.continueButton]);
}

function continueGame() {
  const savedGame = loadFromStorage(GAME_STATES.save);
  const isContinue = true;

  updateFromObj(savedGame, isContinue);

  setStatesFromObj(
    [GAME_STATES.userMatrix, GAME_STATES.correctCount, GAME_STATES.timer],
    savedGame,
  );
  updateTimer(savedGame.timer, isContinue);
  const matrix = savedGame[GAME_STATES.userMatrix];
  getDOMElement(DOM_ELEMENTS.gameCells).forEach((row, i) => {
    row.forEach((cell, j) => {
      cell.classList.toggle(CSS_CLASSES.filled, matrix[i][j] === 1);
      cell.classList.toggle(CSS_CLASSES.crossed, matrix[i][j] === 2);
    });
  });
}

function updateFromObj(obj, isContinue) {
  stopTimer();
  resetGameField();

  if (getGameState(GAME_STATES.size) !== obj[GAME_STATES.size]) {
    setStatesFromObj([GAME_STATES.size], obj);
    getDOMElement(DOM_ELEMENTS[`levelInput${obj[GAME_STATES.size]}`]).checked =
      true;
    updateTab(obj[GAME_STATES.size]);
    createGameTable();
  }
  if (getGameState(GAME_STATES.levelName) !== obj[GAME_STATES.levelName]) {
    setStatesFromObj(
      [
        GAME_STATES.levelName,
        GAME_STATES.levelMatrix,
        GAME_STATES.levelMatrixSum,
        GAME_STATES.clues,
      ],
      obj,
    );
    updateDropList(true);
    if (!isContinue) {
      calculateMatrix();
    }

    renderGameClues();
  }
}

function setStatesFromObj(parameterList, obj) {
  parameterList.forEach((parameter) => setGameState(parameter, obj[parameter]));
}

export function resetGameField() {
  stopTimer();
  resetTimer();
  setGameState(GAME_STATES.correctCount, 0);
  setGameState(GAME_STATES.isEndGame, false);
  setGameState(GAME_STATES.isTimer, false);
  const userMatrix = getGameState(GAME_STATES.userMatrix);
  getDOMElement(DOM_ELEMENTS.gameCells).forEach((row, i) => {
    row.forEach((cell, j) => {
      userMatrix[i][j] = 0;
      cell.classList.remove(CSS_CLASSES.crossed, CSS_CLASSES.filled);
    });
  });
}

function showSolution() {
  const levelMatrix = getGameState(GAME_STATES.levelMatrix);
  const userMatrix = getGameState(GAME_STATES.userMatrix);
  getDOMElement(DOM_ELEMENTS.gameCells).forEach((row, i) => {
    row.forEach((cell, j) => {
      userMatrix[i][j] = 0;
      cell.classList.toggle(CSS_CLASSES.filled, levelMatrix[i][j] === 1);
      cell.classList.remove(CSS_CLASSES.crossed);
    });
  });
  setGameState(GAME_STATES.isEndGame, true);
  setGameState(GAME_STATES.correctCount, 0);
  stopTimer();
  buttonDisabled(true, [DOM_ELEMENTS.save]);
}

function randomGame() {
  const currLevel = getGameState(GAME_STATES.levelName);
  const filteredData = gamesData.filter((data) => data.name !== currLevel);
  const index = Math.floor(Math.random() * filteredData.length);
  const data = filteredData[index];
  updateTab(data.size);
  updateFromObj(data, false);
}

function scoreButtonHandler() {
  updateScoreTableView();
  showModalWindow(MODAL_MESSAGES.scoreTable, false);
}

export function buttonDisabled(isDisabled, button) {
  buttons[button].disabled = isDisabled;
}

export function volumeHandler() {
  toggleMuteAudio();
  buttons.volume.textContent =
    buttons.volume.textContent === "SOUND ON" ? "SOUND OFF" : "SOUND ON";
}
