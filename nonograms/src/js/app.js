import { createDOMTree } from "@/js/createHTML/createDOMTree.js";
import {
  calculateClues,
  calculateLevelMatrixSum,
  createProcessMatrix,
} from "@/js/matrix.js";

export function init() {
  createProcessMatrix();
  calculateLevelMatrixSum();
  calculateClues();
  createDOMTree();
}
