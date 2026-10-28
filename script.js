/* ==========================================================================
   STATE MANAGEMENT & NAVIGATION
   ========================================================================== */
let currentPage = 1;
let wishesInterval = null;
let typingTimeout = null;

// Messages list for continuous floating stream
const wishMessages = [
  "Happy Birthday, Siya! 🎂",
  "Stay Cute Forever, Princess! 🎀",
  "Keep Smiling Always! 🌸",
  "Lots of Love for You! 💗",
  "May Your Dreams Come True! ✨",
  "You Deserve All the Happiness! 🧸",
  "Sending You a Million Virtual Hugs! 🤗",
  "Keep Shining, Birthday Girl! 👑",
  "Lots of Candles, Lots of Wishes! 🕯️",
  "You Are Today's Little Star! ⭐",
  "Have a Magical Day! 🌷",
  "Stay Sweet & Wonderful! 🧁"
];

const typingPhrases = "Every moment spent with you is wonderful, Siya! Today is all about celebrating your magic, warmth, and sweetness... 💖";

// Initialize Background Particles
document.addEventListener("DOMContentLoaded", () => {
  createBgParticles();
  setupCanvas();
});

// Switch Sections
function goToPage(pageNum) {
  const currentElem = document.getElementById(`page${currentPage}`);
  const nextElem = document.getElementById(`page${pageNum}`);

  if (currentElem) {
    currentElem.classList.remove("active");
  }

  currentPage = pageNum;

  setTimeout(() => {
    if (nextElem) {
      nextElem.classList.add("active");
    }

    // Trigger page-specific routines
    if (pageNum === 2) {
      startTypingEffect();
      triggerConfetti();
    } else {
      clearTimeout(typingTimeout);
    }

    if (pageNum === 4) {
      startFloatingWishes();
    } else {
      stopFloatingWishes();
    }

    if (pageNum === 5) {
      triggerConfetti();
    }
  }, 200);
}

/* ==========================================================================
   BACKGROUND FLOATING EMOJIS
   ========================================================================== */
function createBgParticles() {
  const container = document.getElementById("bg-decorations");
  const emojis = ["🌸", "💗", "✨", "🎀", "🧸", "⭐", "🦋"];
  const particleCount = 12; // Optimized for mobile performance

  for (let i = 0; i < particleCount; i++) {
    const span = document.createElement("span");
    span.className = "bg-particle";
    span.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    span.style.left = `${Math.random() * 95}%`;
    span.style.animationDuration = `${6 + Math.random() * 6}s`;
    span.style.animationDelay = `${Math.random() * 5}s`;
    span.style.fontSize = `${1 + Math.random() * 0.8}rem`;
    container.appendChild(span);
  }
}

/* ==========================================================================
   TYPING EFFECT (PAGE 2)
   ========================================================================== */
function startTypingEffect() {
  const textContainer = document.getElementById("typing-text");
  textContainer.innerText = "";
  let index = 0;

  function typeChar() {
    if (index < typingPhrases.length) {
      textContainer.innerText += typingPhrases.charAt(index);
      index++;
      typingTimeout = setTimeout(typeChar, 45);
    }
  }

  typeChar();
}

/* ==========================================================================
   CONTINUOUS FLOATING WISHES (PAGE 4)
   ========================================================================== */
function startFloatingWishes() {
  const container = document.getElementById("wishes-stream-container");
  container.innerHTML = "";

  if (wishesInterval) clearInterval(wishesInterval);

  // Spawn wishes continuously
  wishesInterval = setInterval(() => {
    if (currentPage !== 4) return;

    const wish = document.createElement("div");
    wish.className = "floating-wish";
    wish.innerText = wishMessages[Math.floor(Math.random() * wishMessages.length)];

    // Randomized positions & sizes
    const leftPos = Math.random() * 60 + 10; // Keep within margins
    const duration = 5 + Math.random() * 4;
    const fontSize = 0.85 + Math.random() * 0.25;

    wish.style.left = `${leftPos}%`;
    wish.style.animationDuration = `${duration}s`;
    wish.style.fontSize = `${fontSize}rem`;

    container.appendChild(wish);

    // Clean up DOM element when animation completes
    setTimeout(() => {
      wish.remove();
    }, duration * 1000);
  }, 1200);
}

function stopFloatingWishes() {
  if (wishesInterval) clearInterval(wishesInterval);
  const container = document.getElementById("wishes-stream-container");
  if (container) container.innerHTML = "";
}

/* ==========================================================================
   MUSIC TOGGLE CONTROL
   ========================================================================== */
const musicBtn = document.getElementById("music-toggle");
const bgMusic = document.getElementById("bg-music");
let isPlaying = false;

musicBtn.addEventListener("click", () => {
  if (isPlaying) {
    bgMusic.pause();
    musicBtn.innerText = "🎵 Play Music";
    isPlaying = false;
  } else {
    bgMusic.play().then(() => {
      musicBtn.innerText = "⏸️ Pause";
      isPlaying = true;
    }).catch(() => {
      musicBtn.innerText = "🎵 Play Music";
    });
  }
});

/* ==========================================================================
   CANVAS EFFECTS (CONFETTI & HEART EXPLOSION)
   ========================================================================== */
let canvas, ctx;
let particles = [];

function setupCanvas() {
  canvas = document.getElementById("effects-canvas");
  ctx = canvas.getContext("2d");
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  requestAnimationFrame(updateParticles);
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function updateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.alpha -= p.decay;

    ctx.save();
    ctx.globalAlpha = Math.max(p.alpha, 0);
    ctx.font = `${p.size}px sans-serif`;
    ctx.fillText(p.char, p.x, p.y);
    ctx.restore();

    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }

  requestAnimationFrame(updateParticles);
}

function triggerConfetti() {
  const shapes = ["🌸", "💖", "✨", "🎀", "⭐"];
  for (let i = 0; i < 25; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 3,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.7) * 12,
      gravity: 0.25,
      size: 16 + Math.random() * 12,
      char: shapes[Math.floor(Math.random() * shapes.length)],
      alpha: 1,
      decay: 0.015 + Math.random() * 0.01
    });
  }
}

function triggerHugExplosion() {
  triggerConfetti();

  const hugBtn = document.getElementById("hug-btn");
  hugBtn.innerText = "Sending Hugs! 🫂💖";
  
  setTimeout(() => {
    alert("Sending you the biggest virtual hug everrr! 🫂💖");
    hugBtn.innerText = "One More Hug? 🤗";
  }, 300);
}
