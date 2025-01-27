import { createDOMTree } from "./createHTML/createDOMTree.js";
import { getDOMElement } from "./elementsDOM.js";
import { getGameState } from "./gameState.js";

export function init() {
  createDOMTree();
  getDOMElement("levelButtons")[getGameState("cellCount")].checked = true;
}
