import { GAME_STATES } from "./gameConstants.js";

const gameState = {
  [GAME_STATES.timer]: 0,
  [GAME_STATES.isTimer]: false,
  [GAME_STATES.size]: 5,
  [GAME_STATES.levelMatrix]: null,
  [GAME_STATES.levelName]: null,
  [GAME_STATES.levelMatrixSum]: 0,
  [GAME_STATES.userMatrix]: null,
  [GAME_STATES.correctCount]: 0,
  [GAME_STATES.clues]: null,
  [GAME_STATES.isEndGame]: false,
  [GAME_STATES.isSound]: true,
  [GAME_STATES.isLightTheme]: false,
  [GAME_STATES.score]: [],
};

export function getGameState(parameter) {
  if (parameter === GAME_STATES.save) {
    return {
      [GAME_STATES.timer]: gameState.timer,
      [GAME_STATES.size]: gameState.size,
      [GAME_STATES.levelMatrix]: gameState.levelMatrix,
      [GAME_STATES.levelName]: gameState.levelName,
      [GAME_STATES.levelMatrixSum]: gameState.levelMatrixSum,
      [GAME_STATES.userMatrix]: gameState.userMatrix,
      [GAME_STATES.correctCount]: gameState.correctCount,
      [GAME_STATES.clues]: gameState.timer,
    };
  }
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
