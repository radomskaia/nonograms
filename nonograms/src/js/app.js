import { createDOMTree } from "./createHTML/createDOMTree.js";
import {
  calculateClues,
  calculateLevelMatrixSum,
  createProcessMatrix,
} from "./matrix.js";
import { getDOMElement } from "./elementsDOM.js";
import { getGameState } from "./gameState.js";

export function init() {
  createProcessMatrix();
  calculateLevelMatrixSum();
  calculateClues();
  createDOMTree();
  getDOMElement("levelButtons")[getGameState("cellCount")].checked = true;
}
