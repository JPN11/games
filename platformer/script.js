const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const goal = {
    x: 1200,
    y: 200,
    width: 50,
    height: 50,
    color: 'gold'
};

const player = {
    x: 50,
    y: 50,
    width: 30,
    height: 30,
    speed: 5,
    dx: 0,
    dy: 0
};

const gravity = 0.5;
const friction = 0.9;
const jumpStrength = -30;

const platforms = [
    { x: 100, y: 500, width: 200, height: 20, color: 'green' },
    { x: 400, y: 400, width: 200, height: 20, color: 'brown' },
    { x: 700, y: 300, width: 200, height: 20, color: 'purple' },
    { x: 1000, y: 200, width: 200, height: 20, color: 'orange' }
];

const spikes = [
    { x: 0, y: 580, width: 5000000, height: 20, color: 'red' },
    { x: 600, y: 380, width: 50, height: 20, color: 'red' },
    { x: 900, y: 280, width: 50, height: 20, color: 'red' }
];

let scrollOffset = 0;
let isOnPlatform = false;

function update() {
    player.dy += gravity; // Apply gravity
    player.dx *= friction; // Apply friction
    player.dy *= friction; // Apply friction
    player.x += player.dx; // Update position
    player.y += player.dy; // Update position

    // Scrolling mechanism
    if (player.x > canvas.width / 2) {
        scrollOffset = player.x - canvas.width / 2;
    }

    checkCollision(); // Check for collisions

    // Check if player falls off platforms
    if (!isOnPlatform && player.dy > 0 && player.y + player.height > canvas.height) {
        alert("Game Over! You fell off the platforms.");
        resetGame();
    }
}

function checkCollision() {
    isOnPlatform = false;

    platforms.forEach(platform => {
        if (player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y < platform.y + platform.height &&
            player.y + player.height > platform.y) {
            // Collision detected
            player.y = platform.y - player.height; // Place player on top of the platform
            player.dy = 0; // Reset vertical velocity
            isOnPlatform = true; // Player is on a platform
        }
    });

    spikes.forEach(spike => {
        if (player.x < spike.x + spike.width &&
            player.x + player.width > spike.x &&
            player.y < spike.y + spike.height &&
            player.y + player.height > spike.y) {
            // Collision with spike detected
            alert("Game Over!"); // Simple game over alert
            resetGame(); // Reset the game
        }
    });

    if (player.x < goal.x + goal.width &&
        player.x + player.width > goal.x &&
        player.y < goal.y + goal.height &&
        player.y + player.height > goal.y) {
        // Collision with goal detected
        alert("You won!"); // Simple game over alert
        resetGame(); // Reset the game
    }

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height; // Prevent falling through the floor
        player.dy = 0; // Reset vertical velocity
    }
}

function resetGame() {
    player.x = 50;
    player.y = 50;
    player.dx = 0;
    player.dy = 0;
    scrollOffset = 0;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = "green";
    ctx.fillRect(player.x - scrollOffset, player.y, player.width, player.height);

    // Draw platforms
    platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x - scrollOffset, platform.y, platform.width, platform.height);
    });

    // Draw spikes
    spikes.forEach(spike => {
        ctx.fillStyle = spike.color;
        ctx.fillRect(spike.x - scrollOffset, spike.y, spike.width, spike.height);
    });

    // Draw goal
    ctx.fillStyle = goal.color;
    ctx.fillRect(goal.x - scrollOffset, goal.y, goal.width, goal.height);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') player.dx = player.speed;
    if (e.key === 'ArrowLeft') player.dx = -player.speed;
    if (e.key === 'ArrowUp' && player.dy === 0) player.dy = jumpStrength;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') player.dx = 0;
});

gameLoop();