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
// 💬 TYPING EFFECT (INTERRUPTIBLE)
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
// 📊 NEEDS
// =========================
let isHungry = false;
let isSleepy = false;

function randomNeeds() {
  // Hunger (priority)
  if (Math.random() < 0.4 && !isHungry && currentState !== STATES.SLEEPING) {
    isHungry = true;

    typeDialogue("I'm getting hungry...", 50);
    setState(STATES.HUNGRY);
  }

  // Sleepy (no animation yet)
  if (Math.random() < 0.4 && !isSleepy && currentState !== STATES.SLEEPING) {
    isSleepy = true;

    typeDialogue("I'm getting sleepy...", 50);
  }
}

setInterval(randomNeeds, 10000);

// =========================
// 👁️ BLINKING (ONLY IDLE)
// =========================
function blink() {
  if (currentState !== STATES.NORMAL) return;

  pet.src = "img/blink.png";

  setTimeout(() => {
    if (currentState === STATES.NORMAL) {
      pet.src = "img/normal.png";
    }
  }, 150);
}

setInterval(() => {
  if (Math.random() < 0.8) {
    blink();
  }
}, 2000);

// =========================
// 🎮 BUTTONS
// =========================
document.getElementById("feed").onclick = () => {
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