import { getGameState, setGameState } from "../gameState.js";
import {
  CSS_CLASSES,
  DOM_ELEMENTS,
  GAME_STATES,
  ICONS_PATH,
} from "../gameConstants.js";
import { getDOMElement } from "../elementsDOM.js";

export function changeTheme() {
  const isLightTheme = !getGameState(GAME_STATES.isLightTheme);
  toggleTheme(isLightTheme);
}

function toggleTheme(isDarkMode) {
  getDOMElement([DOM_ELEMENTS.changeTheme]).src = isDarkMode
    ? ICONS_PATH.darkTheme
    : ICONS_PATH.lightTheme;
  document.body.toggleAttribute(CSS_CLASSES.theme, isDarkMode);
  setGameState(GAME_STATES.isLightTheme, isDarkMode);
}

const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)");

isDarkMode.addEventListener("change", (event) => {
  toggleTheme(event.matches);
});
