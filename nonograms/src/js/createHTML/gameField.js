import { createDOMElement } from "../utils.js";
import { getDOMElement, setDOMElement } from "../elementsDOM.js";
import { getGameState, setGameState } from "../gameState.js";

const clickActions = {
  0: {
    toggle: "filledCell",
    remove: "crossedCell",
    handler: leftButtonHandler,
  },
  2: {
    toggle: "crossedCell",
    remove: "filledCell",
    handler: rightButtonHandler,
  },
};

export function createGameField() {
  const elements = {};
  elements.fieldWrapper = createDOMElement({
    tagName: "table",
    classList: ["gameTable"],
  });
  elements.tbody = createDOMElement({
    tagName: "tbody",
  });
  elements.fieldWrapper.append(elements.tbody);
  setDOMElement("tbody", elements.tbody);
  createGameTable();
  return elements.fieldWrapper;
}

export function createGameTable() {
  const tbody = getDOMElement("tbody");
  tbody.replaceChildren();
  const cellCount = getGameState("cellCount");
  const gameCells = [];
  const gameClues = {
    row: [],
    column: [],
  };
  for (let i = 0; i <= cellCount; i++) {
    if (i !== 0) {
      gameCells.push([]);
    }
    const gameRow = createDOMElement({
      tagName: "tr",
      classList: ["gameRow"],
    });
    for (let j = 0; j <= cellCount; j++) {
      let cell;
      if (i === 0 && j === 0) {
        cell = createGameCell(null, true);
      } else if (j === 0) {
        cell = createGameCell(gameClues.row, true);
      } else if (i === 0) {
        cell = createGameCell(gameClues.column, true);
      } else {
        cell = createGameCell(gameCells[i - 1], false, i - 1, j - 1);
      }
      gameRow.append(cell);
    }
    setDOMElement("gameCells", gameCells);
    setDOMElement("gameClues", gameClues);
    tbody.append(gameRow);
  }
  renderGameClues(gameClues);
}

export function renderGameClues(gameClues) {
  const gameCluesContent = getGameState("clues");

  Object.entries(gameCluesContent).forEach(([key, value]) => {
    const joinSymbol = key === "row" ? " " : "\n\n";
    value.forEach((arr, index) => {
      gameClues[key][index].textContent += arr.join(joinSymbol);
    });
  });
}

function createGameCell(arr, isHeader, i = 0, j = 0) {
  const options = { classList: ["cell"] };
  if (isHeader) {
    options.tagName = "th";
    options.classList.push("tableHeader");
  } else {
    options.tagName = "td";
  }
  const cell = createDOMElement(options);
  arr?.push(cell);

  if (isHeader) {
    return cell;
  }

  cell.addEventListener("mousedown", (event) => {
    const levelMatrix = getGameState("levelMatrix");
    const processMatrix = getGameState("processMatrix");
    if (event.button in clickActions) {
      cell.classList.toggle(clickActions[event.button].toggle);
      cell.classList.remove(clickActions[event.button].remove);
      clickActions[event.button].handler(levelMatrix, processMatrix, i, j);
    }
  });

  cell.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  return cell;
}

function leftButtonHandler(levelMatrix, processMatrix, i, j) {
  processMatrix[i][j] = processMatrix[i][j] === 0 ? 1 : 0;
  compareMatrix(levelMatrix, processMatrix, i, j);
}

function rightButtonHandler(levelMatrix, processMatrix, i, j) {
  if (levelMatrix[i][j] === 0 && processMatrix[i][j] === 0) {
    return;
  }
  processMatrix[i][j] = 0;
  compareMatrix(levelMatrix, processMatrix, i, j);
}

function compareMatrix(levelMatrix, processMatrix, i, j) {
  let correctCellCount = getGameState("correctCellCount");
  const levelMatrixSum = getGameState("levelMatrixSum");
  if (levelMatrix[i][j] === processMatrix[i][j]) {
    correctCellCount++;
  } else {
    correctCellCount--;
  }
  console.log("correctCellCount", correctCellCount);
  setGameState("correctCellCount", correctCellCount);
  if (correctCellCount === levelMatrixSum) {
    console.log("WIN");
  }
}
