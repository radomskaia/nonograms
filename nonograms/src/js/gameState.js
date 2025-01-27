//import { LEVELS } from "@/js/gameConstants.js";
import { matrixPicture } from "./matrixPicture.js";
//import { elementsDOM } from "@/js/elementsDOM.js";

const gameState = {
  timer: 0,
  levelMatrix: matrixPicture.easy.dog,
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
