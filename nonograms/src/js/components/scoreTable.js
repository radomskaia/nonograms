import { createDOMElement, saveToStorage } from "../utils.js";
import { GAME_STATES } from "../gameConstants.js";
import { getGameState } from "../gameState.js";

let tbody;

export function createScoreTable() {
  const tableHeaders = ["№", "Name", "Size", "Time"];
  const table = createDOMElement({
    tagName: "table",
    classList: ["scoreTable"],
  });
  const thead = createDOMElement({
    tagName: "thead",
  });

  thead.append(createTableRow(tableHeaders, "th"));

  tbody = createDOMElement({
    tagName: "tbody",
  });
  //setDOMElement(DOM_ELEMENTS.scoreTable, tbody);
  table.append(thead, tbody);
  return table;
}

function createTableRow(tableData, type) {
  const thRow = createDOMElement({
    tagName: "tr",
  });

  tableData.forEach((tableHeader) => {
    const tableData = createDOMElement({
      tagName: type,
      textContent: tableHeader,
      classList: ["data"],
    });
    thRow.append(tableData);
  });
  return thRow;
}

export function updateScoreTableView() {
  tbody.replaceChildren();
  const sortedData = [...getGameState(GAME_STATES.score)];
  sortedData.sort((a, b) => a[GAME_STATES.timer] - b[GAME_STATES.timer]);

  sortedData.forEach((obj, index) => {
    const tableValues = [index + 1, ...obj.data];
    tbody.append(createTableRow(tableValues, "td"));
  });
}

export function pushScoreTable(value) {
  const score = getGameState(GAME_STATES.score);
  if (score.length < 5) {
    score.push(value);
  } else {
    score.shift();
    score.push(value);
  }
}

export function saveScoreTable() {
  saveToStorage(GAME_STATES.score, getGameState(GAME_STATES.score));
}
