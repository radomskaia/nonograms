import { createActionButton, createDOMElement } from "../utils.js";
import { getGameState } from "../gameState.js";

let modal, modalText;
export function showModalWindow() {
  const timer = getGameState("timer");
  modalText.textContent = `Great! You have solved the nonogram in ${timer} seconds!`;
  modal.showModal();
}

export function createModal() {
  modal = createDOMElement({
    tagName: "dialog",
    classList: [
      "modal",
      "flex",
      "flex--column",
      "flex--align-center",
      "flex_gap-20",
    ],
  });

  const modalButton = createActionButton("close", () => modal.close());

  modalText = createDOMElement({
    tagName: "p",
  });

  modal.append(modalText, modalButton);

  return {
    modal: modal,
    text: modalText,
  };
}
