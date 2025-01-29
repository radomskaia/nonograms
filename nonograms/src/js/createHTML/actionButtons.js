import { createActionButton } from "../utils.js";

export function createActionButtons(buttonsList) {
  const actionButtons = [];
  Object.entries(buttonsList).forEach(([key, value]) => {
    const button = createActionButton(key, value);
    actionButtons.push(button);
  });
  return actionButtons;
}
