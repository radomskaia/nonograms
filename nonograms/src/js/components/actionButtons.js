import { createDOMElement, loadFromStorage, saveToStorage } from "../utils.js";
import { resetTimer, saveTimer, stopTimer, updateTimer } from "./timer.js";
import { getDOMElement, setDOMElement } from "../elementsDOM.js";
import { updateDropList, updateTab } from "./levelTabs.js";
import { createGameTable, renderGameClues } from "./gameField.js";
import { getGameState, setGameState } from "../gameState.js";
import { gamesData } from "../gamesData.js";
import {
  CSS_CLASSES,
  DOM_ELEMENTS,
  GAME_STATES,
  ICONS_PATH,
  MODAL_MESSAGES,
} from "../gameConstants.js";
import { calculateMatrix } from "../matrix.js";
import { showModalWindow } from "./modal.js";
import { updateScoreTableView } from "./scoreTable.js";
import { toggleMuteAudio } from "./audio.js";
import { changeTheme } from "./changeTheme.js";

const options = {
  settings: {
    volume: {
      callback: toggleMuteAudio,
      path: ICONS_PATH.volumeOn,
      title: "Volume",
    },
    changeTheme: {
      callback: changeTheme,
      path: ICONS_PATH.lightTheme,
      title: "Change theme",
    },
    score: {
      callback: scoreButtonHandler,
      path: ICONS_PATH.score,
      title: "Results of the last games",
    },
  },
  actions: {
    reset: {
      callback: resetGameField,
      path: ICONS_PATH.reset,
      title: "Reset game",
    },
    save: {
      callback: saveGame,
      path: ICONS_PATH.save,
      title: "Save game",
    },
    continue: {
      callback: continueGame,
      path: ICONS_PATH.continue,
      title: "Continue game",
    },
    solution: {
      callback: showSolution,
      path: ICONS_PATH.solution,
      title: "Show solution",
    },
    random: {
      callback: randomGame,
      path: ICONS_PATH.random,
      title: "Select a random game",
    },
  },
};

const buttons = {
  [DOM_ELEMENTS.continueButton]: null,
  [DOM_ELEMENTS.score]: null,
  [DOM_ELEMENTS.save]: null,
  [DOM_ELEMENTS.reset]: null,
  [DOM_ELEMENTS.solution]: null,
  [DOM_ELEMENTS.volume]: null,
  [DOM_ELEMENTS.changeTheme]: null,
};

export function createButtonsWrapper(type) {
  const wrapper = createDOMElement({
    classList: ["flex", "flex--align-justify-center", "flex_gap-30"],
  });

  Object.entries(options[type]).forEach(([key, value]) => {
    const { callback, path, title } = value;
    const button = createButton(key, callback, path, title, type);
    if (key in buttons) {
      buttons[key] = button;
    }
    wrapper.append(button);
  });

  return wrapper;
}

function createButton(buttonName, callBack, path, title, type) {
  const button = createDOMElement({
    tagName: "button",
    classList: ["button"],
  });
  const img = createDOMElement({
    tagName: "img",
    classList: ["iconButton", `iconButton--${type}`],
    attributes: {
      title: title,
      src: path,
      alt: buttonName,
    },
  });
  if (
    buttonName === DOM_ELEMENTS.volume ||
    buttonName === DOM_ELEMENTS.changeTheme
  ) {
    setDOMElement(buttonName, img);
  }
  button.append(img);
  button.addEventListener("click", callBack);
  return button;
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
  buttonDisabled(false, [DOM_ELEMENTS.reset]);
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
  buttonDisabled(true, [DOM_ELEMENTS.save]);
  buttonDisabled(true, [DOM_ELEMENTS.reset]);
  buttonDisabled(false, [DOM_ELEMENTS.solution]);
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
  buttonDisabled(false, [DOM_ELEMENTS.reset]);
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
