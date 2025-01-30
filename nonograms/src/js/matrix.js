import { getGameState, setGameState } from "./gameState.js";

function createUserMatrix() {
  const size = getGameState("size");
  const userMatrix = Array.from({ length: size }, () => Array(size).fill(0));
  setGameState("userMatrix", userMatrix);
}

function calculateLevelMatrixSum() {
  const levelMatrix = getGameState("levelMatrix");
  const sum = levelMatrix.reduce((a, b) => a + b.reduce((a, b) => a + b, 0), 0);
  setGameState("levelMatrixSum", sum);
}

function calculateClues() {
  const levelMatrix = getGameState("levelMatrix");
  const length = levelMatrix.length;
  const clues = {
    column: Array.from({ length: length }, () => []),
    row: Array.from({ length: length }, () => []),
  };
  let colCount = new Array(length).fill(0);
  levelMatrix.forEach((row, i) => {
    let rowCount = 0;
    row.forEach((num, j) => {
      if (num === 0 && colCount[j] === 0 && rowCount === 0) {
        return;
      }
      if (num === 0 && colCount[j] !== 0) {
        clues.column[j].push(colCount[j]);
        colCount[j] = 0;
      }
      if (num === 0 && rowCount !== 0) {
        clues.row[i].push(rowCount);
        rowCount = 0;
      }
      if (num === 0) {
        return;
      }
      rowCount++;

      colCount[j] += 1;
      if (j === length - 1 && rowCount !== 0) {
        clues.row[i].push(rowCount);
      }
    });
    if (i === length - 1) {
      colCount.forEach((sum, index) => {
        if (sum === 0) {
          return;
        }
        clues.column[index].push(sum);
      });
    }
  });
  setGameState("clues", clues);
}

export function calculateMatrix() {
  calculateClues();
  createUserMatrix();
  calculateLevelMatrixSum();
}
