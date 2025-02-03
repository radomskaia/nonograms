import { createActionButton, createDOMElement } from "../utils.js";
import { createScoreTable } from "./scoreTable.js";
import { CSS_CLASSES } from "../gameConstants.js";

let modal, modalText, table;
export function showModalWindow(textContent, isWin) {
  modalText.textContent = textContent;
  table.classList.toggle(CSS_CLASSES.displayNone, isWin);
  modal.showModal();
}

export function createModal() {
  modal = createDOMElement({
    tagName: "dialog",
    classList: ["modal"],
  });

  const modalWrapper = createDOMElement({
    classList: ["flex", "flex--column", "flex--align-center", "flex_gap-20"],
  });
  const modalButton = createActionButton("close", () => modal.close());

  modalText = createDOMElement({
    tagName: "p",
  });

  table = createScoreTable();

  modalWrapper.append(modalText, table, modalButton);
  modal.append(modalWrapper);
  return modal;
}
