const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const infoDisplay = document.getElementById("info-display");
const gameOverDisplay = document.getElementById("game-over");
const finalScoreDisplay = document.getElementById("final-score");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load sound effects
const explosionSound = new Audio(
  " missile_command/8-bit-explosion-low-resonant-45659.mp3"
);
const missileAlertSound = new Audio(
  "missile_command/8-bit-alarm-38563.mp3"
);
const lowAmmoSound = new Audio("low_ammo.mp3");

// Game variables
let score = 0;
let level = 1;
let missileSpawnRate = 1000; // Spawn rate in milliseconds
let groundHits = 0; // Track missiles that hit the ground
const maxGroundHits = 5; // Game over after 5 ground hits
const launchers = [
  { x: canvas.width * 0.2, y: canvas.height - 30, ammo: 10 },
  { x: canvas.width * 0.5, y: canvas.height - 30, ammo: 10 },
  { x: canvas.width * 0.8, y: canvas.height - 30, ammo: 10 },
];

const missiles = [];
const explosions = [];

function spawnMissile() {
  const targetX = Math.random() * canvas.width;
  missiles.push({
    x: Math.random() * canvas.width,
    y: 0,
    targetX,
    targetY: canvas.height,
  });
  missileAlertSound.play(); // Play missile alert sound on spawn
}

function updateInfoDisplay() {
  infoDisplay.innerHTML = `Score: ${score} | Level: ${level} | Ammo: Launcher 1: ${launchers[0].ammo} | Launcher 2: ${launchers[1].ammo} | Launcher 3: ${launchers[2].ammo}`;
}

function increaseLevel() {
  level++;
  missileSpawnRate = Math.max(300, missileSpawnRate - 100); // Decrease spawn rate to increase difficulty
  clearInterval(missileInterval);
  missileInterval = setInterval(spawnMissile, missileSpawnRate);
}

function drawLaunchers() {
  launchers.forEach((launcher) => {
    ctx.fillStyle = "blue";
    ctx.fillRect(launcher.x - 20, launcher.y, 40, 10);
  });
}

function drawMissiles() {
  ctx.fillStyle = "red";
  missiles.forEach((missile) => {
    ctx.beginPath();
    ctx.arc(missile.x, missile.y, 15, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawExplosions() {
  explosions.forEach((exp, index) => {
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI * 2);
    ctx.fill();

    // Expand and fade explosion
    exp.radius += 2;
    if (exp.radius > 30) explosions.splice(index, 1);
  });
}

function updateMissiles() {
  missiles.forEach((missile, index) => {
    missile.y += 2; // Missile speed
    if (missile.y > canvas.height) {
      missiles.splice(index, 1); // Remove missile if it hits the ground
      groundHits++; // Increase ground hit count
      if (groundHits >= maxGroundHits) endGame(); // Trigger game over
    }
  });
}

function checkCollisions() {
  missiles.forEach((missile, mIndex) => {
    explosions.forEach((exp, eIndex) => {
      const dist = Math.hypot(missile.x - exp.x, missile.y - exp.y);
      if (dist < exp.radius) {
        missiles.splice(mIndex, 1); // Destroy missile
        explosions.splice(eIndex, 1); // Remove explosion
        score += 10; // Increase score by 10 for each hit
        explosionSound.play(); // Play explosion sound
        if (score % 100 === 0) increaseLevel(); // Level up every 100 points
        updateInfoDisplay(); // Update score and level
      }
    });
  });
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLaunchers();
  drawMissiles();
  drawExplosions();
  updateMissiles();
  checkCollisions();
  if (!gameOver) requestAnimationFrame(gameLoop);
}

function endGame() {
  gameOver = true;
  clearInterval(missileInterval); // Stop spawning new missiles
  finalScoreDisplay.textContent = score; // Display final score
  gameOverDisplay.style.display = "block"; // Show game over screen
}

canvas.addEventListener("click", (e) => {
  const launcher = launchers.find((l) => l.ammo > 0);
  if (!launcher) return;

  // Play low ammo sound if only 1 ammo is left
  if (launcher.ammo === 1) lowAmmoSound.play();

  explosions.push({ x: e.clientX, y: e.clientY, radius: 1 });
  launcher.ammo--;
  updateInfoDisplay();
});

// Start missile spawning interval
let missileInterval = setInterval(spawnMissile, missileSpawnRate);
let gameOver = false;
updateInfoDisplay();
gameLoop();