import { createAppView } from "./createAppView.js";
import { updateDropList, updateLevel } from "./components/levelTabs.js";

export function init() {
  createAppView();
  updateDropList();
  updateLevel();
}
