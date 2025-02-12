const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0
};

const bullets = [];
const bulletSpeed = 7;

const enemies = [];
const enemyRows = 3;
const enemyCols = 8;
const enemyWidth = 50;
const enemyHeight = 50;
const enemyPadding = 10;
const enemyOffsetTop = 30;
const enemyOffsetLeft = 30;
let enemyDirection = 1;
let enemySpeed = 5;
let gameOver = false;
let gameWon = false;

for (let row = 0; row < enemyRows; row++) {
    for (let col = 0; col < enemyCols; col++) {
        const enemyX = col * (enemyWidth + enemyPadding) + enemyOffsetLeft;
        const enemyY = row * (enemyHeight + enemyPadding) + enemyOffsetTop;
        enemies.push({ x: enemyX, y: enemyY, width: enemyWidth, height: enemyHeight });
    }
}

function drawPlayer() {
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawEnemies() {
    ctx.fillStyle = 'red';
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function drawBullets() {
    ctx.fillStyle = 'yellow';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function movePlayer() {
    player.x += player.dx;

    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

function moveEnemies() {
    let edgeReached = false;

    enemies.forEach(enemy => {
        enemy.x += enemySpeed * enemyDirection;
        if (enemy.x + enemy.width > canvas.width || enemy.x < 0) {
            edgeReached = true;
        }
    });

    if (edgeReached) {
        enemyDirection *= -1;
        enemies.forEach(enemy => {
            enemy.y += enemyHeight;
        });
    }
}

function moveBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bulletSpeed;
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

function detectCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
            }
        });
    });
}

function checkGameOver() {
    if (enemies.length === 0) {
        gameWon = true;
        gameOver = true;
    }

    enemies.forEach(enemy => {
        if (enemy.y + enemy.height > canvas.height || (
            enemy.x < player.x + player.width &&
            enemy.x + enemy.width > player.x &&
            enemy.y < player.y + player.height &&
            enemy.y + enemy.height > player.y
        )) {
            gameOver = true;
        }
    });
}

function update() {
    if (gameOver) {
        ctx.font = '48px serif';
        ctx.fillStyle = 'white';
        if (gameWon) {
            ctx.fillText('You Win!', canvas.width / 2 - 100, canvas.height / 2);
        } else {
            ctx.fillText('Game Over', canvas.width / 2 - 120, canvas.height / 2);
        }
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawEnemies();
    drawBullets();
    movePlayer();
    moveEnemies();
    moveBullets();
    detectCollisions();
    checkGameOver();
    requestAnimationFrame(update);
}

function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        player.dx = player.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        player.dx = -player.speed;
    } else if (e.key === ' ' || e.key === 'Spacebar') {
        bullets.push({
            x: player.x + player.width / 2 - 2.5,
            y: player.y,
            width: 5,
            height: 10
        });
    }
}

function keyUp(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right' || e.key === 'ArrowLeft' || e.key === 'Left') {
        player.dx = 0;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

update();