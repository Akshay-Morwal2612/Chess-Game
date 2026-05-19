// // sounds.js

// // Chess sound effects
// const sounds = {
//   move: new Audio("/sounds/move.mp3"),
//   capture: new Audio("/sounds/Capture.mp3"),
//   check: new Audio("/sounds/Check.mp3"),
//   checkmate: new Audio("/sounds/Checkmate.mp3"),
//   victory: new Audio("/sounds/victory.mp3"),
// };

// // Optional: set volume for all sounds
// Object.values(sounds).forEach(sound => {
//   sound.volume = 0.6;
// });

// // Play function
// export function playSound(type) {
//   const sound = sounds[type];

//   if (!sound) return;

//   // restart sound so it can play repeatedly
//   sound.currentTime = 0;

//   sound.play().catch(err => {
//     // prevents crash if browser blocks autoplay
//     console.log("Sound play blocked:", err);
//   });
// }


const sounds = {
  move: new Audio("./sounds/move.mp3"),
  capture: new Audio("./sounds/capture.mp3"),
  check: new Audio("./sounds/check.mp3"),
  checkmate: new Audio("./sounds/checkmate.mp3"),
  victory: new Audio("./sounds/victory.mp3"),
};

Object.values(sounds).forEach(s => s.volume = 0.6);

export function playSound(type) {
  const sound = sounds[type];
  if (!sound) return;

  sound.currentTime = 0;
  sound.play().catch(() => {});
}