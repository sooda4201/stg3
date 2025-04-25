const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerImg = new Image();
playerImg.src = 'jiki.png';

const enemiesImg=new Image();
enemiesImg.src='teki.png';

const player = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 60,
  width: 40,
  height: 40,
  speed: 5,
  bullets: []
};

const enemies = [];
let score=0;
let keys = {};
let lastEnemySpawn = 0;
let gameOver=false;

document.addEventListener('keydown', (e) => keys[e.code] = true);
document.addEventListener('keyup', (e) => keys[e.code] = false);

function drawPlayer() {
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
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
  enemies.forEach((enemy, eIndex) => {
    enemy.y += enemy.speed;

    // 敵を画像で描画
    ctx.drawImage(enemiesImg, enemy.x, enemy.y, enemy.width, enemy.height);

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

            //自機との当たり判定
            if (enemy.x < player.x + player.width &&
              enemy.x + enemy.width > player.x &&
              enemy.y < player.y + player.height &&
              enemy.y + enemy.height > player.y) {
            gameOver = true;
           }
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

function drawGameOver() {
  ctx.fillStyle = 'white';
  ctx.font = '40px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
  ctx.font = '20px Arial';
  ctx.fillText('Click to Retry', canvas.width / 2, canvas.height / 2 + 40);
}

canvas.addEventListener('click', () => {
  if (gameOver) {
    resetGame();
  }
});

function resetGame() {
  player.x = canvas.width / 2 - player.width / 2;
  player.y = canvas.height - 60;
  player.bullets = [];
  enemies.length = 0;
  score = 0;
  gameOver = false;
  lastEnemySpawn = 0;
  gameLoop(); // もう一度ループ開始
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

  if(!gameOver){
  update();
  drawPlayer();
  drawBullets();
  drawEnemies();
  drawScore();
  spawnEnemy();

  requestAnimationFrame(gameLoop);
}else{
  drawGameOver();
}
}

gameLoop();