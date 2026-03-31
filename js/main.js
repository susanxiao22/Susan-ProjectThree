const pet = document.getElementById("pet");
const moodText = document.getElementById("mood");

// State
let isHungry = false;
let isSleepy = false;

// 🫧 NATURAL BLINKING (NOT LOOPED)
function blink() {
  pet.src = "img/blink.png";

  setTimeout(() => {
    pet.src = "img/normal.png";
  }, 150);
}

// Random blinking loop
setInterval(() => {
  // 100% chance to blink
  if (Math.random() < 0.8) {
    blink();
  }
}, 2000);


// 🎲 RANDOM NEED SYSTEM
function randomNeeds() {

  // Randomly become hungry
  if (Math.random() < 0.4) {
    isHungry = true;
    moodText.textContent = "I'm getting hungry...";
  }

  // Randomly become sleepy
  if (Math.random() < 0.4) {
    isSleepy = true;
    moodText.textContent = "I'm getting sleepy...";
  }
}

// Trigger every 8–12 seconds
setInterval(() => {
  randomNeeds();
}, 10000);


// 🎮 BUTTONS (for now just clear needs)
document.getElementById("feed").onclick = () => {
  isHungry = false;
  moodText.textContent = "Yum!";
  clickAnim();
};

document.getElementById("play").onclick = () => {
  moodText.textContent = "Yay!";
  clickAnim();
};

document.getElementById("sleep").onclick = () => {
  isSleepy = false;
  moodText.textContent = "Zzz...";
  clickAnim();
};


// ✨ Click animation
function clickAnim() {
  gsap.fromTo(pet,
    { scale: 1 },
    { scale: 1.10, duration: 0.2, yoyo: true, repeat: 1 }
  );
}

