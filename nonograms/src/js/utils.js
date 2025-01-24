import { CSS_CLASSES } from "@/js/gameConstants.js";
import { gameState } from "@/js/gameState.js";
import { elementsDOM } from "@/js/elementsDOM.js";

/**
 * Creates and returns a new DOM element with the specified properties.
 * @param {Object} options - The options for creating the DOM element.
 * @param {string} [options.tagName='div'] - The tag name of the element.
 * @param {string[]} [options.classList=[]] - A list of CSS classes to apply to the element.
 * @param {string} [options.textContent=''] - The text content of the element.
 * @param {Object} [options.attributes={}] - A map of attributes to set on the element.
 * @returns {HTMLElement} - The created DOM element.
 */
export function createDOMElement({
  tagName = "div",
  classList = [],
  textContent = "",
  attributes = {},
} = {}) {
  const element = document.createElement(tagName);
  if (classList.length > 0) {
    element.classList.add(...classList);
  }
  if (textContent) {
    element.textContent = textContent;
  }
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) =>
      element.setAttribute(key, value),
    );
  }

  return element;
}
//
//export function removeOutputCSS() {
//  elementsDOM.outputField.classList.remove(CSS_CLASSES.MISTAKE);
//  elementsDOM.outputField.classList.remove(CSS_CLASSES.WIN_ROUND);
//}
//
//export function resetGame(isNew) {
//  gameState.isMistake = false;
//  elementsDOM.roundCounter.textContent = gameState.roundCounter;
//  elementsDOM.actionButtons.repeat.disabled = false;
//  removeOutputCSS();
//
//  Object.entries(elementsDOM.actionButtons).forEach(([key, value]) => {
//    const isButtonHide = isNew
//      ? key !== "start"
//      : key === "start" || key === "next";
//    if (isButtonHide) {
//      value.classList.add(CSS_CLASSES.HIDDEN);
//      return;
//    }
//    value.classList.remove(CSS_CLASSES.HIDDEN);
//  });
//}
//
export function createActionButton(buttonName, callBack, isHighlight = false) {
  const button = createDOMElement({
    tagName: "button",
    classList: ["button", "actionButton"],
    textContent: buttonName,
  });
  if (isHighlight) {
    button.classList.add(CSS_CLASSES.HIGHLIGHT_BUTTON);
  }
  button.addEventListener("click", callBack);
  return button;
}
//
//export function disabledButtons(isDisabled, buttonsArr) {
//  buttonsArr.forEach((buttonsList) => {
//    Object.values(buttonsList).forEach((button) => {
//      if (button.textContent === "Repeat the sequence" && gameState.isMistake) {
//        return;
//      }
//      button.disabled = isDisabled;
//    });
//  });
//}
