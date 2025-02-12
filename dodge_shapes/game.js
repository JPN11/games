// Set up the canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

// Set canvas dimensions
canvas.width = 1000;
canvas.height = 500;

// Player object
const player = {
  x: 20,
  y: canvas.height / 2,
  radius: 18, // Radius for the circle
  color: "green", // Changed color to green
  speed: 5
};

// Array to store multiple enemies
const enemies = [];
const enemyCount = 30; // Number of enemies

// Initialize enemies
for (let i = 0; i < enemyCount; i++) {
  enemies.push({
    x: canvas.width - 70,
    y: Math.random() * (canvas.height - 50),
    width: 30,
    height: 30,
    color: "red",
    speed: 2 + Math.random() * 5 // Random speed
  });
}

// Handle keyboard input
const keys = {};
document.addEventListener("keydown", e => {
  keys[e.key] = true;
});
document.addEventListener("keyup", e => {
  keys[e.key] = false;
});

// Game loop control
let gameRunning = true;

// Initialize score
let score = 0;

// Game loop
function gameLoop() {
  if (!gameRunning) return;
  
  // Increment score every second
const scoreInterval = setInterval(() => {
  if (gameRunning) {
    score += 1;
  }
}, 1000);

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update player position
  if (keys["ArrowLeft"] && player.x - player.radius > 0) {
    player.x -= player.speed;
  }
  if (keys["ArrowRight"] && player.x + player.radius < canvas.width) {
    player.x += player.speed;
  }
  if (keys["ArrowUp"] && player.y - player.radius > 0) {
    player.y -= player.speed;
  }
  if (keys["ArrowDown"] && player.y + player.radius < canvas.height) {
    player.y += player.speed;
  }

  // Update and draw each enemy
  enemies.forEach(enemy => {
    enemy.x -= enemy.speed;
    if (enemy.x < 0) {
      enemy.x = canvas.width;
      enemy.y = Math.random() * (canvas.height - 50);
    }

    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

    // Check for collision with player
    if (
      player.x - player.radius < enemy.x + enemy.width &&
      player.x + player.radius > enemy.x &&
      player.y - player.radius < enemy.y + enemy.height &&
      player.y + player.radius > enemy.y
    ) {
      
    // Display Game Over message and final score
    clearInterval(scoreInterval); // Stop incrementing score
    let Newscore = score + 1;
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over!", canvas.width / 2 - 75, canvas.height / 2 - 10);
    ctx.font = "20px Arial";
    ctx.fillText("Final Score: " + Newscore, canvas.width / 2 - 75, canvas.height / 2 + 20);


      gameRunning = false;
      
    }
  });

  // Draw player as a circle
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fill();

  // Update and display score
  score += 1; // Increase score over time
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);
  

  // Request next frame
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();