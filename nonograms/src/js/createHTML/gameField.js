import { createDOMElement } from "@/js/utils.js";
import { getDOMElement } from "@/js/elementsDOM.js";

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
  const gameCells = getDOMElement("gameCells");
  const { row: rowClues, column: columnClues } = getDOMElement("gameClues");
  for (let i = 0; i < 16; i++) {
    if (i !== 0) {
      gameCells.push([]);
    }
    const gameRow = createDOMElement({
      tagName: "tr",
      classList: ["gameRow"],
    });
    for (let j = 0; j < 16; j++) {
      let cell;
      if (i === 0 && j === 0) {
        cell = createGameCell(null, true);
      } else if (j === 0) {
        cell = createGameCell(columnClues, true);
      } else if (i === 0) {
        cell = createGameCell(rowClues, true);
      } else {
        cell = createGameCell(gameCells[i - 1]);
      }
      gameRow.append(cell);
    }
    elements.tbody.append(gameRow);
  }
  return elements.fieldWrapper;
}

function createGameCell(arr, isHeader = false) {
  const options = { classList: ["cell"] };
  if (isHeader) {
    options.tagName = "th";
    options.classList.push("tableHeader");
  } else {
    options.tagName = "td";
  }
  const cell = createDOMElement(options);
  arr?.push(cell);
  return cell;
}
