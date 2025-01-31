import { createAppView } from "./createAppView.js";
import { updateDropList, updateLevel } from "./components/levelTabs.js";
import { DOM_ELEMENTS, GAME_STATES } from "./gameConstants.js";
import { loadFromStorage } from "./utils.js";
import { setGameState } from "./gameState.js";

export function init() {
  createAppView();
  const loadedScore = loadFromStorage(GAME_STATES.score);
  if (loadedScore) {
    setGameState([GAME_STATES.score]);
  } else {
    console.log(loadedScore);
    buttonDisabled(true, [DOM_ELEMENTS.score]);
  }
  const loadedGame = loadFromStorage(GAME_STATES.save);
  if (!loadedGame) {
    console.log(loadedGame);
    buttonDisabled(true, [DOM_ELEMENTS.continueButton]);
  }
  updateDropList();
  updateLevel();
}
