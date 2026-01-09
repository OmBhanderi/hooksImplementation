const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 480;
canvas.height = 640;

const GRAVITY = 0.5;
const FLAP = -9;
let gameState = "playing";

const PIPE_WIDTH = 80;
const PIPE_GAP = 180;
const PIPE_SPEED = 3;
const pipes = [];

const bird = {
  x: 100,
  y: 300,
  vy: 0,
  size: 34,
};
let frame = 0;  
function gameLoop() {
  
  ctx.fillStyle = "#4ec0ca";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (gameState === "playing") {
    checkPipeCollision();
    updateBird();
    updatePipes();
  }

  frame++;

  if (frame % 120 === 0) {
    spawnPipe();
  }
  drawPipes();
  drawBird();
  console.log(pipes)
  requestAnimationFrame(gameLoop);
}

gameLoop();

function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.size / 2, 0, Math.PI * 2);
  ctx.fill();
}

function updateBird() {
  bird.vy += GRAVITY;
  bird.y += bird.vy;

  if (bird.y < bird.size / 2) {
    bird.y = bird.size / 2;
    bird.vy = 0;
  }

  if (bird.y > canvas.height - bird.size / 2) {
    bird.y = canvas.height - bird.size / 2;
    gameState = "gameOver";
  }
}

function flap() {
  bird.vy = FLAP;
}

function spawnPipe() {
  const gapY = Math.random() * 250 + 100;

  pipes.push({
    x: canvas.width,
    gapY,
  });   
}

function updatePipes() {
  for (let pipe of pipes) {
    pipe.x -= PIPE_SPEED;
  }

  if (pipes.length && pipes[0].x < -PIPE_WIDTH) {
    pipes.shift();
  }
}

function drawPipes() {
  ctx.fillStyle = "#5cb85c";

  for (let pipe of pipes) {
    // top
    ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.gapY);

    // bottom
    const bottomY = pipe.gapY + PIPE_GAP;
    ctx.fillRect(pipe.x, bottomY, PIPE_WIDTH, canvas.height - bottomY);
  }
}

function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function getBirdRect() {
  return {
    x: bird.x - bird.size / 2,
    y: bird.y - bird.size / 2,
    w: bird.size,
    h: bird.size
  };
}

function checkPipeCollision() {
  const birdRect = getBirdRect();

  for (let pipe of pipes) {
    // top pipe
    const topRect = {
      x: pipe.x,
      y: 0,
      w: PIPE_WIDTH,
      h: pipe.gapY
    };

    // bottom pipe
    const bottomY = pipe.gapY + PIPE_GAP;
    const bottomRect = {
      x: pipe.x,
      y: bottomY,
      w: PIPE_WIDTH,
      h: canvas.height - bottomY
    };

    if (
      rectsOverlap(birdRect, topRect) ||
      rectsOverlap(birdRect, bottomRect)
    ) {
      gameState = "gameOver";
      return;
    }
  }
}


document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    flap();
  }
});

canvas.addEventListener("click", flap());
