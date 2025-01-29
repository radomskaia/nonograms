import { matrixPicture } from "./matrixPicture.js";
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
  levelMatrix: matrixPicture["5"].scull,
  levelName: "scull",
  levelMatrixSum: 0,
  processMatrix: null,
  correctCellCount: 0,
  clues: null,
  isPlaying: false,
  isEndGame: false,
  isSound: true,
  isLightTheme: false,
  isSaved: false,
};

export function getGameState(parameter) {
  if (parameter in gameState) {
    return gameState[parameter];
  }
  throw new Error(`Property "${parameter}" does not exist in gameState.`);
}

export function saveGame() {
  if (gameState.isEndGame) {
    console.log("You cant save the game after solution");
  }
  saveTimer();
  const currentGame = JSON.stringify(gameState);
  window.localStorage.setItem("savedGame", currentGame);
}

export function continueGame() {
  stopTimer();
  const savedGame = JSON.parse(window.localStorage.getItem("savedGame"));
  resetGameField();
  if (gameState.cellCount !== savedGame.cellCount) {
    gameState.cellCount = savedGame.cellCount;
    getDOMElement(`levelInput${savedGame.cellCount}`).checked = true;
    updateTab(savedGame.cellCount);
    createGameTable();
  }
  if (gameState.levelName !== savedGame.levelName) {
    gameState.levelName = savedGame.levelName;
    gameState.levelMatrix = savedGame.levelMatrix;
    gameState.levelMatrixSum = savedGame.levelMatrixSum;
    gameState.clues = savedGame.clues;
    updateDropList(true);
    renderGameClues();
  }

  gameState.processMatrix = savedGame.processMatrix;
  gameState.correctCellCount = savedGame.correctCellCount;
  gameState.timer = savedGame.timer;

  updateTimer(savedGame.timer, isContinue);
  const gameCells = getDOMElement("gameCells");
  savedGame.processMatrix.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === 1) {
        gameCells[i][j].classList.add("filledCell");
        gameCells[i][j].classList.remove("crossedCell");
      }
    });
  });
  gameState.isSaved = false;
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
  gameState.isLightTheme = !gameState.isLightTheme;
  document.body.toggleAttribute("data-theme", gameState.isLightTheme);
}

export function resetGameField() {
  stopTimer();
  resetTimer();
  const gameCells = getDOMElement("gameCells");
  gameState.processMatrix.forEach((row, i, arr) => {
    row.forEach((cell, j) => {
      arr[i][j] = 0;
      gameCells[i][j].classList.remove("crossedCell");
      gameCells[i][j].classList.remove("filledCell");
    });
  });
  gameState.correctCellCount = 0;
  gameState.isEndGame = false;
  setGameState("isTimer", false);
}

export function showSolution() {
  const gameCells = getDOMElement("gameCells");
  gameState.levelMatrix.forEach((row, i) => {
    row.forEach((cell, j) => {
      gameState.processMatrix[i][j] = 0;
      if (cell === 1) {
        gameCells[i][j].classList.add("filledCell");
        gameCells[i][j].classList.remove("crossedCell");
      } else {
        gameCells[i][j].classList.remove("filledCell");
        gameCells[i][j].classList.remove("crossedCell");
      }
    });
  });
  gameState.isEndGame = true;
  gameState.correctCellCount = 0;
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
