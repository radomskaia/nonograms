import { createActionButton, createDOMElement } from "../utils.js";
import { resetTimer, saveTimer, stopTimer, updateTimer } from "./timer.js";
import { getDOMElement } from "../elementsDOM.js";
import { updateDropList, updateTab } from "./levelTabs.js";
import { createGameTable, renderGameClues } from "./gameField.js";
import { getGameState, setGameState } from "../gameState.js";
import { gamesData } from "../gamesData.js";
import { CSS_CLASSES, DOM_ELEMENTS, GAME_STATES } from "../gameConstants.js";

export function createButtonsWrapper(type) {
  const options = {
    settings: {
      sound: () => {},
      "change theme": changeTheme,
      "record List": () => {},
    },
    actions: {
      reset: resetGameField,
      save: saveGame,
      continue: continueGame,
      solution: showSolution,
      "random game": () => {},
    },
  };

  const wrapper = createDOMElement({
    classList: ["flex", "flex--align-justify-center", "flex_gap-10"],
  });

  Object.entries(options[type]).forEach(([key, value]) => {
    const button = createActionButton(key, value);
    wrapper.append(button);
  });

  return wrapper;
}

function saveGame() {
  if (getGameState(GAME_STATES.isEndGame)) {
    console.log("You cant save the game after solution");
    return;
  }
  saveTimer();
  const currentGame = getGameState(GAME_STATES.stringify);
  window.localStorage.setItem(GAME_STATES.savedGame, currentGame);
}

function continueGame() {
  const savedGame = JSON.parse(
    window.localStorage.getItem(GAME_STATES.savedGame),
  );
  const isContinue = true;

  updateFromObj(savedGame);

  setStatesFromObj(
    [GAME_STATES.userMatrix, GAME_STATES.correctCount, GAME_STATES.timer],
    savedGame,
  );
  updateTimer(savedGame.timer, isContinue);
  const gameCells = getDOMElement(DOM_ELEMENTS.gameCells);
  savedGame.userMatrix.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === 1) {
        gameCells[i][j].classList.add(CSS_CLASSES.filled);
      } else if (cell === 2) {
        gameCells[i][j].classList.add(CSS_CLASSES.crossed);
      }
    });
  });
}

function updateFromObj(obj) {
  stopTimer();

  if (getGameState(GAME_STATES.size) !== obj[GAME_STATES.size]) {
    setStatesFromObj([GAME_STATES.size], obj);
    getDOMElement(DOM_ELEMENTS[`levelInput${obj[GAME_STATES.size]}`]).checked =
      true;
    updateTab(obj[GAME_STATES.size]);
    createGameTable();
  }
  resetGameField();
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
    renderGameClues();
  }
}

function setStatesFromObj(parameterList, obj) {
  parameterList.forEach((parameter) => {
    setGameState(parameter, obj[parameter]);
  });
}

function changeTheme() {
  const isLightTheme = !getGameState(GAME_STATES.isLightTheme);
  document.body.toggleAttribute(CSS_CLASSES.theme, isLightTheme);
  setGameState(GAME_STATES.isLightTheme, isLightTheme);
}

export function resetGameField() {
  stopTimer();
  resetTimer();
  const gameCells = getDOMElement(DOM_ELEMENTS.gameCells);
  const userMatrix = getGameState(GAME_STATES.userMatrix);
  userMatrix.forEach((row, i, arr) => {
    row.forEach((cell, j) => {
      arr[i][j] = 0;
      gameCells[i][j].classList.remove(CSS_CLASSES.crossed);
      gameCells[i][j].classList.remove(CSS_CLASSES.filled);
    });
  });
  setGameState(GAME_STATES.correctCount, 0);
  setGameState(GAME_STATES.isEndGame, false);
  setGameState(GAME_STATES.isTimer, false);
}

function showSolution() {
  const gameCells = getDOMElement(DOM_ELEMENTS.gameCells);
  const levelMatrix = getGameState(GAME_STATES.levelMatrix);
  const userMatrix = getGameState(GAME_STATES.userMatrix);
  levelMatrix.forEach((row, i) => {
    row.forEach((cell, j) => {
      userMatrix[i][j] = 0;
      if (cell === 1) {
        gameCells[i][j].classList.add(CSS_CLASSES.filled);
        gameCells[i][j].classList.remove(CSS_CLASSES.crossed);
      } else {
        gameCells[i][j].classList.remove(CSS_CLASSES.filled);
        gameCells[i][j].classList.remove(CSS_CLASSES.crossed);
      }
    });
  });
  setGameState(GAME_STATES.isEndGame, true);
  setGameState(GAME_STATES.correctCount, 0);
  stopTimer();
}
