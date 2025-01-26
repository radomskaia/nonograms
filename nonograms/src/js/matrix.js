import { getGameState, setGameState } from "@/js/gameState.js";

export function createProcessMatrix() {
  const cellCount = getGameState("cellCount");
  const gameMatrix = Array.from({ length: cellCount }, () =>
    Array(cellCount).fill(0),
  );
  setGameState("processMatrix", gameMatrix);
  console.log(gameMatrix);
}

export function calculateLevelMatrixSum() {
  const levelMatrix = getGameState("levelMatrix");
  const sum = levelMatrix.reduce((a, b) => a + b.reduce((a, b) => a + b, 0), 0);
  setGameState("levelMatrixSum", sum);
  console.log("sum", sum);
}
