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
  if (parameter === "stringify") {
    return JSON.stringify(gameState);
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
