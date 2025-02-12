const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");
const paddleWidth = 10;
const paddleHeight = 100;
const ballRadius = 10;

let paddle1Y = (canvas.height - paddleHeight) / 2;
let paddle2Y = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;

let score1 = 0;
let score2 = 0;

let paddle1Up = false;
let paddle1Down = false;
let paddle2Up = false;
let paddle2Down = false;

let gameOver = false;
let aiMode = false;

document.getElementById("onePlayerBtn").addEventListener("click", function() {
  aiMode = true;
  resetGame();
});

document.getElementById("twoPlayerBtn").addEventListener("click", function() {
  aiMode = false;
  resetGame();
});

function drawPaddle(x, y) {
  ctx.fillStyle = "#fff";
  ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  ctx.font = "32px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText(score1, canvas.width / 4, 50);
  ctx.fillText(score2, (3 * canvas.width) / 4, 50);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle(0, paddle1Y);
  drawPaddle(canvas.width - paddleWidth, paddle2Y);
  drawBall(ballX, ballY);
  drawScore();

  if (gameOver) {
    ctx.font = "48px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText("Game Over", canvas.width / 2 - 120, canvas.height / 2);
    return;
  }

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
    ballSpeedY = -ballSpeedY;
  }

  if (ballX + ballRadius > canvas.width) {
    if (ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
      ballSpeedX = -ballSpeedX;
    } else {
      score1++;
      checkWinCondition();
      resetBall();
    }
  }

  if (ballX - ballRadius < 0) {
    if (ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
      ballSpeedX = -ballSpeedX;
    } else {
      score2++;
      checkWinCondition();
      resetBall();
    }
  }

  if (paddle1Up) {
    paddle1Y = Math.max(paddle1Y - 5, 0);
  } else if (paddle1Down) {
    paddle1Y = Math.min(paddle1Y + 5, canvas.height - paddleHeight);
  }

  if (aiMode) {
    if (ballY > paddle2Y + paddleHeight / 2) {
      paddle2Y = Math.min(paddle2Y + 3, canvas.height - paddleHeight);
    } else if (ballY < paddle2Y + paddleHeight / 2) {
      paddle2Y = Math.max(paddle2Y - 3, 0);
    }
  } else {
    if (paddle2Up) {
      paddle2Y = Math.max(paddle2Y - 5, 0);
    } else if (paddle2Down) {
      paddle2Y = Math.min(paddle2Y + 5, canvas.height - paddleHeight);
    }
  }
}

function checkWinCondition() {
  if (score1 === 11 || score2 === 11) {
    gameOver = true;
  }
}

function movePaddles() {
  document.addEventListener("keydown", function (event) {
    switch (event.key) {
      case "ArrowUp":
        paddle2Up = true;
        break;
      case "ArrowDown":
        paddle2Down = true;
        break;
      case "w":
        paddle1Up = true;
        break;
      case "s":
        paddle1Down = true;
        break;
    }
  });

  document.addEventListener("keyup", function (event) {
    switch (event.key) {
      case "ArrowUp":
        paddle2Up = false;
        break;
      case "ArrowDown":
        paddle2Down = false;
        break;
      case "w":
        paddle1Up = false;
        break;
      case "s":
        paddle1Down = false;
        break;
    }
  });
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = 5;
  ballSpeedY = 5;
}

function resetGame() {
  score1 = 0;
  score2 = 0;
  gameOver = false;
  resetBall();
}

function gameLoop() {
  draw();
  requestAnimationFrame(gameLoop);
}

movePaddles();
gameLoop();