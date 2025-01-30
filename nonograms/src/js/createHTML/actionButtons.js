import { createActionButton, createDOMElement } from "../utils.js";
import { resetTimer, saveTimer, stopTimer, updateTimer } from "./timer.js";
import { getDOMElement } from "../elementsDOM.js";
import { updateDropList, updateTab } from "./levelTabs.js";
import { createGameTable, renderGameClues } from "./gameField.js";
import { getGameState, setGameState } from "../gameState.js";

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
  if (getGameState("isEndGame")) {
    console.log("You cant save the game after solution");
    return;
  }
  saveTimer();
  const currentGame = getGameState("stringify");
  window.localStorage.setItem("savedGame", currentGame);
}

function continueGame() {
  stopTimer();
  resetGameField();
  const savedGame = JSON.parse(window.localStorage.getItem("savedGame"));
  const isContinue = true;

  if (getGameState("cellCount") !== savedGame.cellCount) {
    setGameState("cellCount", savedGame.cellCount);
    getDOMElement(`levelInput${savedGame.cellCount}`).checked = true;
    updateTab(savedGame.cellCount);
    createGameTable();
  }

  if (getGameState("levelName") !== savedGame.levelName) {
    setGameState("levelName", savedGame.levelName);
    setGameState("levelMatrix", savedGame.levelMatrix);
    setGameState("levelMatrixSum", savedGame.levelMatrixSum);
    setGameState("clues", savedGame.clues);
    updateDropList(isContinue);
    renderGameClues();
  }

  setGameState("processMatrix", savedGame.processMatrix);

  setGameState("correctCellCount", savedGame.correctCellCount);
  setGameState("timer", savedGame.timer);
  console.log("savedGame.timer", savedGame.timer);
  updateTimer(savedGame.timer, isContinue);
  const gameCells = getDOMElement("gameCells");
  savedGame.processMatrix.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === 1) {
        gameCells[i][j].classList.add("filledCell");
      } else if (cell === 2) {
        gameCells[i][j].classList.add("crossedCell");
      }
    });
  });
}

function changeTheme() {
  const isLightTheme = !getGameState("isLightTheme");
  document.body.toggleAttribute("data-theme", isLightTheme);
  setGameState("isLightTheme", isLightTheme);
}

export function resetGameField() {
  stopTimer();
  resetTimer();
  const gameCells = getDOMElement("gameCells");
  const processMatrix = getGameState("processMatrix");
  processMatrix.forEach((row, i, arr) => {
    row.forEach((cell, j) => {
      arr[i][j] = 0;
      gameCells[i][j].classList.remove("crossedCell");
      gameCells[i][j].classList.remove("filledCell");
    });
  });
  setGameState("correctCellCount", 0);
  setGameState("isEndGame", false);
  setGameState("isTimer", false);
}

function showSolution() {
  const gameCells = getDOMElement("gameCells");
  const levelMatrix = getGameState("levelMatrix");
  const processMatrix = getGameState("processMatrix");
  levelMatrix.forEach((row, i) => {
    row.forEach((cell, j) => {
      processMatrix[i][j] = 0;
      if (cell === 1) {
        gameCells[i][j].classList.add("filledCell");
        gameCells[i][j].classList.remove("crossedCell");
      } else {
        gameCells[i][j].classList.remove("filledCell");
        gameCells[i][j].classList.remove("crossedCell");
      }
    });
  });
  setGameState("isEndGame", true);
  setGameState("correctCellCount", 0);
  stopTimer();
}
