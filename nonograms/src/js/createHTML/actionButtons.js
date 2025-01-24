import {
  createActionButton,
  //disabledButtons,
  //removeOutputCSS,
} from "@/js/utils.js";
//import { startRound } from "@/js/startRound.js";
//import { gameState } from "@/js/gameState.js";
//import { newGame } from "@/js/newGame.js";
//import { elementsDOM } from "@/js/elementsDOM.js";
//import { CSS_CLASSES, GAME_MESSAGES } from "@/js/gameConstants.js";
//import { showSequence } from "@/js/sequence.js";

//function repeatHandler() {
//  if (gameState.isPressed) {
//    return;
//  }
//  disabledButtons(true, [
//    elementsDOM.keyboards[gameState.level],
//    elementsDOM.actionButtons,
//  ]);
//  showSequence(gameState.sequenceButtons);
//  gameState.isMistake = true;
//  elementsDOM.actionButtons.repeat.classList.remove(
//    CSS_CLASSES.HIGHLIGHT_BUTTON,
//  );
//  removeOutputCSS();
//  elementsDOM.outputField.textContent = GAME_MESSAGES.SIMON_SAYS;
//  gameState.sequenceArray = gameState.sequence.split("");
//  elementsDOM.actionButtons.repeat.disabled = true;
//}

export function createActionButtons(buttonsList) {
  const actionButtons = [];
  Object.entries(buttonsList).forEach(([key, value]) => {
    actionButtons.push(createActionButton(key, value));
  });
  return actionButtons;
}
