import { getGameState, setGameState } from "../gameState.js";
import { CSS_CLASSES, GAME_STATES } from "../gameConstants.js";

export function changeTheme() {
  const isLightTheme = !getGameState(GAME_STATES.isLightTheme);
  toggleTheme(isLightTheme);
}

function toggleTheme(isDarkMode) {
  document.body.toggleAttribute(CSS_CLASSES.theme, isDarkMode);
  setGameState(GAME_STATES.isLightTheme, isDarkMode);
}

const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)");

isDarkMode.addEventListener("change", (event) => {
  toggleTheme(event.matches);
});
