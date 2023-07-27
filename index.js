const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const instructions = document.createElement("h1");
instructions.textContent = "Click to start";
instructions.style.textAlign = "center";
instructions.style.position = "absolute";
instructions.style.top = "20%";
instructions.style.left = "45%";
document.body.appendChild(instructions);

const bird = {
  x: 50,
  y: canvas.height / 2,
  radius: 20,
  velocity: 0,
  gravity: 0.2,
  jump: -5,
};

const pipes = [];
const pipeWidth = 50;
const pipeGap = 250;
const pipeDistance = 300;
let pipeTimer = 0;

let gameStarted = false;
let score = 0;

canvas.addEventListener("click", () => {
  if (!gameStarted) {
    gameStarted = true;
    pipes.length = 0;
    bird.velocity = bird.jump;
    score = 0;
  }

  bird.velocity = bird.jump;
});

function drawBird() {
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();
}

function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach((pipe) => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.height);
    ctx.fillRect(
      pipe.x,
      pipe.height + pipeGap,
      pipeWidth,
      canvas.height - pipe.height - pipeGap
    );
  });
}

function checkCollision() {
  if (bird.y + bird.radius - 1 > canvas.height) {
    gameOver();
  }
  for (let i = 0; i < pipes.length; i++) {
    const pipe = pipes[i];
    if (
      bird.x + bird.radius > pipe.x &&
      bird.x - bird.radius < pipe.x + pipeWidth &&
      (bird.y - bird.radius < pipe.height ||
        bird.y + bird.radius > pipe.height + pipeGap)
    ) {
      gameOver();
    }
  }
}

function gameOver() {
  gameStarted = false;
  bird.velocity = 0;
  bird.y = canvas.height / 2;
  alert("Game Over. Your score: " + score);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bird.y += bird.velocity;

  if (gameStarted) {
    instructions.style.display = "none";
    bird.velocity += bird.gravity;
    pipeTimer++;
    if (pipeTimer % pipeDistance === 0) {
      const minHeight = 50;
      const maxHeight = canvas.height - pipeGap - minHeight;
      const height =
        Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
      pipes.push({ x: canvas.width, height });
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
      const pipe = pipes[i];
      pipe.x -= 2;

      if (pipe.x + pipeWidth < 0) {
        pipes.splice(i, 1);
      }

      if (bird.x === pipe.x + pipeWidth) {
        score++;
      }
    }

    checkCollision();
  }

  drawPipes();
  drawBird();

  ctx.fillStyle = "black";
  ctx.font = "1.3rem Arial";
  ctx.fillText("Score: " + score, 10, 30);

  requestAnimationFrame(update);
}

update();
