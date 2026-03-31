// =========================
// 🧠 STATES
// =========================
const STATES = {
  NORMAL: "normal",
  HAPPY: "happy",
  HUNGRY: "hungry",
  SLEEPING: "sleeping"
};

let currentState = STATES.NORMAL;
let previousState = STATES.NORMAL;

const pet = document.getElementById("pet");
const moodText = document.getElementById("mood");

let animInterval = null;
let typingInterval = null;

// =========================
// 🎞️ ANIMATION HELPERS
// =========================
function stopAnimation() {
  if (animInterval) {
    clearInterval(animInterval);
    animInterval = null;
  }
}

function setSprite(src) {
  stopAnimation();
  pet.src = src;
}

function playAnimation(frame1, frame2, speed = 400) {
  stopAnimation();
  let toggle = false;

  animInterval = setInterval(() => {
    pet.src = toggle ? frame1 : frame2;
    toggle = !toggle;
  }, speed);
}

// =========================
// 💬 TYPING EFFECT
// =========================
function typeDialogue(text, speed = 50) {
  if (typingInterval) clearInterval(typingInterval);

  moodText.classList.add("typing");
  moodText.textContent = "";

  let index = 0;

  typingInterval = setInterval(() => {
    if (index < text.length) {
      moodText.textContent += text.charAt(index);
      index++;
    } else {
      clearInterval(typingInterval);
      typingInterval = null;
      moodText.classList.remove("typing");
    }
  }, speed);
}

// =========================
// 🔁 STATE MACHINE
// =========================
function setState(newState) {
  if (currentState === newState) return;

  previousState = currentState;
  currentState = newState;

  stopAnimation();

  switch (newState) {
    case STATES.NORMAL:
      setSprite("img/normal.png");
      break;

    case STATES.HAPPY:
      setSprite("img/happy.png");

      setTimeout(() => {
        if (currentState === STATES.HAPPY) {
          if (isHungry) {
            setState(STATES.HUNGRY);
          } else {
            setState(STATES.NORMAL);
          }
        }
      }, 1200);
      break;

    case STATES.HUNGRY:
      playAnimation("img/hungry.png", "img/hungry2.png", 500);
      break;

    case STATES.SLEEPING:
      playAnimation("img/sleep.png", "img/sleep2.png", 600);

      setTimeout(() => {
        if (currentState === STATES.SLEEPING) {
          setState(STATES.NORMAL);
        }
      }, 4000);
      break;
  }
}

// =========================
// 📊 NEEDS SYSTEM
// =========================
let hunger = 0;
const MAX_HUNGER = 100;
const HUNGRY_THRESHOLD = 60;

let isHungry = false;
let isSleepy = false;

// Hunger increases over time
setInterval(() => {
  hunger += 5;
  if (hunger > MAX_HUNGER) hunger = MAX_HUNGER;

  if (hunger >= HUNGRY_THRESHOLD && !isHungry && currentState !== STATES.SLEEPING) {
    isHungry = true;

    typeDialogue("I'm getting hungry...", 50);
    setState(STATES.HUNGRY);
  }

}, 3000);

// Random sleepy
function randomNeeds() {
  if (Math.random() < 0.4 && !isSleepy && currentState !== STATES.SLEEPING) {
    isSleepy = true;
    typeDialogue("I'm getting sleepy...", 50);
  }
}

setInterval(randomNeeds, 10000);

// =========================
// 👁️ BLINKING (RESTORED)
// =========================
function blink() {
  if (currentState !== STATES.NORMAL) return;

  pet.src = "../img/blink.png"; 

  setTimeout(() => {
    if (currentState === STATES.NORMAL) {
      pet.src = "img/normal.png";
    }
  }, 150);
}

// Frequent blinking (like your original)
setInterval(() => {
  if (Math.random() < 0.8) {
    blink();
  }
}, 2000);

// =========================
// 🎮 BUTTONS
// =========================
document.getElementById("feed").onclick = () => {
  hunger -= 30;
  if (hunger < 0) hunger = 0;

  isHungry = false;

  typeDialogue("Yum!", 30);
  setState(STATES.HAPPY);

  clickAnim();
};

document.getElementById("play").onclick = () => {
  typeDialogue("Yay!", 30);
  setState(STATES.HAPPY);

  clickAnim();
};

document.getElementById("sleep").onclick = () => {
  isSleepy = false;

  typeDialogue("Zzz...", 30);
  setState(STATES.SLEEPING);

  clickAnim();
};

// =========================
// ✨ CLICK ANIMATION
// =========================
function clickAnim() {
  gsap.fromTo(
    pet,
    { scale: 1 },
    { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 }
  );
}