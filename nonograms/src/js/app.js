import { createDOMTree } from "./createHTML/createDOMTree.js";
import {
  calculateClues,
  calculateLevelMatrixSum,
  createProcessMatrix,
} from "./matrix.js";
import { getDOMElement } from "./elementsDOM.js";
import { getGameState } from "./gameState.js";
import { updateLevel } from "./createHTML/levelTabs.js";

export function init() {
  createDOMTree();
  getDOMElement("levelButtons")[getGameState("cellCount")].checked = true;
}
