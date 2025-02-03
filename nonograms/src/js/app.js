import { createAppView } from "./createAppView.js";
import { updateDropList, updateLevel } from "./components/levelTabs.js";
import { DOM_ELEMENTS, GAME_STATES } from "./gameConstants.js";
import { isEmptyLocalStorage, loadFromStorage } from "./utils.js";
import { setGameState } from "./gameState.js";
import { buttonDisabled, volumeHandler } from "./components/actionButtons.js";
import { audioInit } from "./components/audio.js";

export function init() {
  createAppView();

  const isScoreEmpty = isEmptyLocalStorage(GAME_STATES.score);
  if (!isScoreEmpty) {
    setGameState([GAME_STATES.score], loadFromStorage([GAME_STATES.score]));
  }
  buttonDisabled(true, [DOM_ELEMENTS.save]);
  buttonDisabled(isScoreEmpty, [DOM_ELEMENTS.score]);
  buttonDisabled(isEmptyLocalStorage(GAME_STATES.save), [
    DOM_ELEMENTS.continueButton,
  ]);
  updateDropList();
  updateLevel();
  audioInit();
  const isMuted = loadFromStorage([GAME_STATES.isMuted]);
  if (isMuted) {
    volumeHandler();
  }
}
