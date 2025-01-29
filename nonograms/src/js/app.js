import { createDOMTree } from "./createHTML/createDOMTree.js";
import { updateDropList, updateLevel } from "./createHTML/levelTabs.js";

export function init() {
  createDOMTree();
  updateDropList();
  updateLevel();
}
