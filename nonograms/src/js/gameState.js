import { matrixPicture } from "./matrixPicture.js";
import { getDOMElement } from "./elementsDOM.js";

const gameState = {
  timer: 0,
  levelMatrix: matrixPicture["5"].scull,
  cellCount: 5,
  processMatrix: null,
  isPlaying: false,
  isClicked: false,
  isSound: true,
  isLightTheme: true,
  correctCellCount: 0,
  levelMatrixSum: 0,
  clues: null,
};

export function getGameState(parameter) {
  if (parameter in gameState) {
    return gameState[parameter];
  }
  throw new Error(`Property "${parameter}" does not exist in gameState.`);
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

export function resetGameField() {
  const gameCells = getDOMElement("gameCells");
  gameState.processMatrix.forEach((row, i, arr) => {
    row.forEach((cell, j) => {
      arr[i][j] = 0;
      gameCells[i][j].classList.remove("crossedCell");
      gameCells[i][j].classList.remove("filledCell");
    });
  });
  gameState.correctCellCount = 0;
}

function gameReducer(state = gameState, action) {
  switch (action.type) {
    case "INCREASE_CORRECT_CELL_COUNT":
      return updateTimer(state, action);
    case "TOGGLE_PLAY":
      return toggleGamePlay(state, action);
    case "UPDATE_CELL_COUNT":
      return updateCellCount(state, action);
    case "TOGGLE_SOUND":
    case "TOGGLE_THEME":
      return updateSettings(state, action);
    default:
      return state;
  }
}

function changeCellCount(action) {
  correctCellCount;
}
