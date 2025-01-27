import { createActionButton, createDOMElement } from "../utils.js";
import { elementsDOM } from "../elementsDOM.js";

export function showModalWindow() {
  elementsDOM.modal.text.textContent = "END";
  //elementsDOM.modal.word.textContent = gameState.sequence.toUpperCase();
  elementsDOM.modal.modal.showModal();
}

export function createModal() {
  const modal = createDOMElement({
    tagName: "dialog",
    classList: [
      "modal",
      "flex",
      "flex--column",
      "flex--align-center",
      "flex_gap-20",
    ],
  });
  const closeButton = createDOMElement({
    tagName: "button",
    classList: ["closeButton"],
    textContent: "❌",
  });
  const modalButton = createActionButton("newGame", () => {
    modal.close();
    //newGame();
  });

  const modalText = createDOMElement({
    tagName: "p",
  });
  const modalText2 = createDOMElement({
    tagName: "p",
    textContent: "Simon says: ",
  });
  const secretWord = createDOMElement({
    tagName: "strong",
  });
  modalText2.append(secretWord);

  modal.append(closeButton, modalText, modalText2, modalButton);

  closeButton.addEventListener("click", () => modal.close());
  modalButton.addEventListener("click", () => {
    modal.close();
    //newGame();
  });

  return {
    modal: modal,
    text: modalText,
    word: secretWord,
  };
}
