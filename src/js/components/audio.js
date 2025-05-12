import {
  DOM_ELEMENTS,
  GAME_STATES,
  ICONS_PATH,
  SOUNDS,
} from "../gameConstants.js";
import { saveToStorage } from "../utils.js";
import { getDOMElement } from "../elementsDOM.js";

const soundsName = {
  [SOUNDS.clear]: "clear.mp3",
  [SOUNDS.filled]: "filled.mp3",
  [SOUNDS.crossed]: "crossed.mp3",
  [SOUNDS.victory]: "victory.mp3",
};
const soundsSrc = "./sounds/";
const audioElements = {};
const audioBuffers = {};
const audioCtx = new AudioContext();
let isMuted = false;

export async function audioInit() {
  for (const [type, filename] of Object.entries(soundsName)) {
    const response = await fetch(soundsSrc + filename);
    const arrayBuffer = await response.arrayBuffer();
    audioBuffers[type] = await audioCtx.decodeAudioData(arrayBuffer);
  }
}

export function toggleMuteAudio() {
  isMuted = !isMuted;
  getDOMElement([DOM_ELEMENTS.volume]).src = isMuted
    ? ICONS_PATH.volumeOff
    : ICONS_PATH.volumeOn;
  saveToStorage(GAME_STATES.isMuted, isMuted);
}

export function playAudio(type) {
   if (isMuted) {
     return
   }

  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffers[type];
  source.connect(audioCtx.destination);
  source.start(0);
  audioElements[type] = source;
}
