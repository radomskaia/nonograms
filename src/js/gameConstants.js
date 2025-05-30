export const LEVELS = { easy: 5, medium: 10, hard: 15 };

export const MODAL_MESSAGES = {
  firstPart: "Great! You have solved the nonogram in ",
  lastPart: " seconds!",
  scoreTable: "List of winners",
};

export const CSS_CLASSES = {
  displayNone: "display-none",
  crossed: "crossedCell",
  filled: "filledCell",
  theme: "data-theme",
};

export const GAME_STATES = {
  timer: "timer",
  isTimer: "isTimer",
  size: "size",
  levelMatrix: "matrix",
  levelName: "name",
  levelMatrixSum: "levelMatrixSum",
  userMatrix: "userMatrix",
  correctCount: "correctCount",
  clues: "clues",
  isEndGame: "isEndGame",
  isSound: "isSound",
  isLightTheme: "isLightTheme",
  save: "savedGame",
  index: "index",
  element: "element",
  score: "scoreTable",
  isMuted: "isMuted",
};

export const DOM_ELEMENTS = {
  gameCells: "gameCells",
  gameClues: "gameClues",
  timerMinutes: "timerMinutes",
  timerSeconds: "timerSeconds",
  levelInput5: "levelInput5",
  levelInput10: "levelInput10",
  levelInput15: "levelInput15",
  scoreTable: "scoreTable",
  score: "score",
  continueButton: "continue",
  save: "save",
  reset: "reset",
  solution: "solution",
  volume: "volume",
  changeTheme: "changeTheme",
};

export const SOUNDS = {
  clear: "clear",
  filled: "filled.",
  crossed: "crossed",
  victory: "victory",
};

export const LS_PREFIX = "radomskaia--nonograms--";

export const ICONS_PATH = {
  volumeOn: "./icons/volume-loud.svg",
  volumeOff: "./icons/volume-cross.svg",
  lightTheme: "./icons/cloud-sun.svg",
  darkTheme: "./icons/cloudy-moon.svg",
  score: "./icons/cup-star.svg",
  solution: "./icons/eye.svg",
  save: "./icons/save.svg",
  continue: "./icons/load.svg",
  reset: "./icons/reset.svg",
  random: "./icons/perspective-dice-random.svg",
};
