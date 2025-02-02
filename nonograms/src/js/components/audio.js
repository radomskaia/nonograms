import { SOUNDS } from "../gameConstants.js";

const soundsName = {
  [SOUNDS.clear]: "clear.mp3",
  [SOUNDS.filled]: "filled.mp3",
  [SOUNDS.crossed]: "crossed.mp3",
  [SOUNDS.victory]: "victory.mp3",
};
const soundsSrc = "./sounds/";
const audioElements = {};
let isPlay = false;
export function audioInit() {
  Object.entries(soundsName).forEach(([key, name]) => {
    audioElements[key] = creatAudio(soundsSrc + name);
  });
}

function creatAudio(src) {
  const audio = new Audio(src);
  audio.load();
  return audio;
}

export function toggleMuteAudio() {
  Object.values(audioElements).forEach((audio) => {
    audio.muted = !audio.muted;
  });
}

export function playAudio(type) {
  Object.entries(audioElements).forEach(([key, audio]) => {
    stopAudio(audio);
    if (key === type) {
      isPlay = true;
      audio
        .play()
        .catch((error) =>
          console.error("Ошибка воспроизведения аудио:", error),
        );
      audio.onended = () => {
        isPlay = false;
      };
    }
  });
}

export function playVictory() {
  audioElements.victory.play();
}

function stopAudio(audio) {
  if (isPlay) {
    audio.pause();
    audio.currentTime = 0;
  }
}
