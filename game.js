const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
  x: canvas.width / 2 - 15,
  y: canvas.height - 60,
  width: 30,
  height: 30,
  speed: 5,
  bullets: []
};

const enemies = [];
let score=0;
let keys = {};
let lastEnemySpawn = 0;

document.addEventListener('keydown', (e) => keys[e.code] = true);
document.addEventListener('keyup', (e) => keys[e.code] = false);

function drawPlayer() {
  ctx.fillStyle = 'cyan';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
  ctx.fillStyle = 'yellow';
  player.bullets.forEach((bullet, index) => {
    bullet.y -= bullet.speed;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    // 画面外なら削除
    if (bullet.y < 0) player.bullets.splice(index, 1);
  });
}

function drawEnemies() {
  ctx.fillStyle = 'red';
  enemies.forEach((enemy, eIndex) => {
    enemy.y += enemy.speed;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

    // 弾と衝突判定
    player.bullets.forEach((bullet, bIndex) => {
      if (bullet.x < enemy.x + enemy.width &&
          bullet.x + bullet.width > enemy.x &&
          bullet.y < enemy.y + enemy.height &&
          bullet.y + bullet.height > enemy.y) {
        enemies.splice(eIndex, 1);
        player.bullets.splice(bIndex, 1);
        score += 100;
      }
    });

    // 画面外なら削除
    if (enemy.y > canvas.height) enemies.splice(eIndex, 1);
  });
}
function drawScore(){
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);    
}

function spawnEnemy() {
  const now = Date.now();
  if (now - lastEnemySpawn > 1000) {
    enemies.push({
      x: Math.random() * (canvas.width - 30),
      y: -30,
      width: 30,
      height: 30,
      speed: 2
    });
    lastEnemySpawn = now;
  }
}

function update() {
  if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
  if (keys['ArrowRight'] && player.x + player.width < canvas.width) player.x += player.speed;

  if (keys['Space']) {
    if (!player.lastShot || Date.now() - player.lastShot > 300) {
      player.bullets.push({
        x: player.x + player.width / 2 - 2.5,
        y: player.y,
        width: 5,
        height: 10,
        speed: 7
      });
      player.lastShot = Date.now();
    }
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  update();
  drawPlayer();
  drawBullets();
  drawEnemies();
  drawScore();
  spawnEnemy();

  requestAnimationFrame(gameLoop);
}

gameLoop();
