import { createDOMTree } from "@/js/createHTML/createDOMTree.js";
import { setGameState } from "@/js/gameState.js";
import { calculateLevelMatrixSum, createProcessMatrix } from "@/js/matrix.js";

export function init() {
  createDOMTree();
  createProcessMatrix();
  calculateLevelMatrixSum();
}
