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

export function createActionButton(buttonName, callBack) {
  const button = createDOMElement({
    tagName: "button",
    classList: ["button", "actionButton"],
    textContent: buttonName,
  });
  button.addEventListener("click", callBack);
  return button;
}
