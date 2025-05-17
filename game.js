const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const platform = {
  x: canvas.width / 2 - 50,
  y: canvas.height - 60,
  width: 100,
  height: 10,
  speed: 2,
  dir: 1
};

const ball = {
  x: platform.x + platform.width / 2,
  y: platform.y - 10,
  radius: 10,
  vx: 0,
  vy: 0
};

let keys = {};
let gameOver = false;
let startTime = null;
let score = 0;

function resetGame() {
  platform.x = canvas.width / 2 - platform.width / 2;
  platform.dir = 1;
  ball.x = platform.x + platform.width / 2;
  ball.y = platform.y - ball.radius;
  ball.vx = 0;
  ball.vy = 0;
  keys = {};
  gameOver = false;
  startTime = Date.now();
  score = 0;
  document.getElementById('message').style.display = 'none';
}

function update() {
  if (gameOver) return;

  platform.x += platform.speed * platform.dir;
  if (platform.x <= 0 || platform.x + platform.width >= canvas.width) {
    platform.dir *= -1;
  }

  if (keys['ArrowLeft']) ball.vx -= 0.2;
  if (keys['ArrowRight']) ball.vx += 0.2;

  ball.vx *= 0.99; // friction
  ball.vy += 0.4; // gravity

  ball.x += ball.vx;
  ball.y += ball.vy;

  if (
    ball.y + ball.radius > platform.y &&
    ball.y + ball.radius < platform.y + platform.height &&
    ball.x + ball.radius > platform.x &&
    ball.x - ball.radius < platform.x + platform.width &&
    ball.vy > 0
  ) {
    ball.y = platform.y - ball.radius;
    ball.vy = 0;
  }

  if (ball.x - ball.radius < 0) {
    ball.x = ball.radius;
    ball.vx = 0;
  } else if (ball.x + ball.radius > canvas.width) {
    ball.x = canvas.width - ball.radius;
    ball.vx = 0;
  }

  if (ball.y - ball.radius > canvas.height) {
    gameOver = true;
    document.getElementById('message').style.display = 'block';
  }

  const now = Date.now();
  score = Math.floor((now - startTime) / 1000);
  document.getElementById('score').textContent = 'Score: ' + score;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#0f0';
  ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#ff0';
  ctx.fill();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

document.addEventListener('keydown', e => {
  if (gameOver && e.code === 'Space') resetGame();
  keys[e.code] = true;
});

document.addEventListener('keyup', e => {
  keys[e.code] = false;
});

resetGame();
loop();
