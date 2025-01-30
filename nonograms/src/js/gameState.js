import { getDOMElement } from "./elementsDOM.js";
import { createGameTable, renderGameClues } from "./createHTML/gameField.js";
import { updateDropList, updateTab } from "./createHTML/levelTabs.js";
import {
  resetTimer,
  saveTimer,
  stopTimer,
  updateTimer,
} from "./createHTML/timer.js";

const gameState = {
  timer: 0,
  isTimer: false,
  cellCount: 5,
  levelMatrix: null,
  levelName: null,
  levelMatrixSum: 0,
  processMatrix: null,
  correctCellCount: 0,
  clues: null,
  isEndGame: false,
  isSound: true,
  isLightTheme: false,
};

export function getGameState(parameter) {
  if (parameter in gameState) {
    return gameState[parameter];
  }
  throw new Error(`Property "${parameter}" does not exist in gameState.`);
}

export function saveGame() {
  if (getGameState("isEndGame")) {
    console.log("You cant save the game after solution");
    return;
  }
  saveTimer();
  const currentGame = JSON.stringify(gameState);
  window.localStorage.setItem("savedGame", currentGame);
}

export function continueGame() {
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

export function setGameState(parameter, value) {
  if (parameter in gameState) {
    gameState[parameter] = value;
  } else {
    throw new Error(
      `Cannot set non-existent property "${parameter}" in gameState.`,
    );
  }
}

export function changeTheme() {
  setGameState("isLightTheme", !getGameState("isLightTheme"));
  document.body.toggleAttribute("data-theme", gameState.isLightTheme);
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

export function showSolution() {
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

//function gameReducer(state = gameState, action) {
//  switch (action.type) {
//    case "INCREASE_CORRECT_CELL_COUNT":
//      return updateTimer(state, action);
//    case "TOGGLE_PLAY":
//      return toggleGamePlay(state, action);
//    case "UPDATE_CELL_COUNT":
//      return updateCellCount(state, action);
//    case "TOGGLE_SOUND":
//    case "TOGGLE_THEME":
//      return updateSettings(state, action);
//    default:
//      return state;
//  }
//}
//
//function changeCellCount(action) {
//  correctCellCount;
//}
