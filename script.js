const dino = document.getElementById("dino");
const gameArea = document.getElementById("gameArea");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const startScreen = document.getElementById("startScreen");
const gameOver = document.getElementById("gameOver");
const scoreText = document.getElementById("score");
const finalScore = document.getElementById("finalScore");
const highScoreText = document.getElementById("highScore");
const crashSound = document.getElementById("crashSound");
const bgMusic = document.getElementById("bgMusic");
const obstacleContainer = document.getElementById("obstacleContainer");

let isJumping = false;
let jumpVelocity = 0;
let gravity = 0.5;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let speed = 6;
let gameActive = false;
let obstacles = [];
let dinoBottom = 50;

highScoreText.textContent = "High Score: " + highScore;

function startGame() {
  startScreen.classList.add("hidden");
  gameOver.classList.add("hidden");
  obstacleContainer.innerHTML = "";
  obstacles = [];
  score = 0;
  speed = 6;
  gameActive = true;
  dinoBottom = 50;
  dino.style.bottom = "50px";

  bgMusic.currentTime = 0;
  bgMusic.play();

  requestAnimationFrame(updateGame);
  setTimeout(spawnObstacle, 1500);
}

function jump() {
  if (isJumping || !gameActive) return;
  isJumping = true;
  jumpVelocity = 10;
}

function spawnObstacle() {
  if (!gameActive) return;

  const cactusCount = Math.random() < 0.5 ? 1 : 2; // only 1 or 2 cactus
  for (let i = 0; i < cactusCount; i++) {
    const cactus = document.createElement("div");
    cactus.classList.add("cactus");
    cactus.style.left = (800 + i * 50) + "px";
    obstacleContainer.appendChild(cactus);
    obstacles.push(cactus);
  }

  const delay = Math.random() * 1500 + 1000;
  setTimeout(spawnObstacle, delay);
}

function updateGame() {
  if (!gameActive) return;

  // Jump physics
  if (isJumping) {
    dinoBottom += jumpVelocity;
    jumpVelocity -= gravity;
    if (dinoBottom <= 50) {
      dinoBottom = 50;
      isJumping = false;
    }
    dino.style.bottom = dinoBottom + "px";
  }

  // Move obstacles
  for (let i = 0; i < obstacles.length; i++) {
    const cactus = obstacles[i];
    let cactusLeft = parseInt(window.getComputedStyle(cactus).left);
    cactus.style.left = cactusLeft - speed + "px";

    // Remove cactus if off-screen
    if (cactusLeft < -60) {
      cactus.remove();
      obstacles.splice(i, 1);
      score++;
      scoreText.textContent = "Score: " + score;
      if (score % 10 === 0) speed += 1;
    }

    // Collision detection
    if (cactusLeft < 130 && cactusLeft > 70 && dinoBottom < 100) {
      gameOverFunc();
      return;
    }
  }

  requestAnimationFrame(updateGame);
}

function gameOverFunc() {
  gameActive = false;
  bgMusic.pause();
  crashSound.play();
  finalScore.textContent = "Your Score: " + score;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }

  highScoreText.textContent = "High Score: " + highScore;
  gameOver.classList.remove("hidden");
}

function restartGame() {
  startGame();
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") jump();
});

document.addEventListener("touchstart", jump);
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);







