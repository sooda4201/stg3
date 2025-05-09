document.onkeydown = function(e)
{	
	switch( e.keyCode )
	{
    case 13:
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerImg = new Image();
playerImg.src = 'jiki.png';

const enemiesImg=new Image();
enemiesImg.src='teki.png';

const tamaImg=new Image();
tamaImg.src='tama.png';

let boss = null;
const bossImg = new Image();
bossImg.src = 'boss.png'; 

const player = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 60,
  width: 40,
  height: 40,
  speed: 5,
  bullets: []
};
const stars = [];
const bossbullets=[]; 
let enemyBullets = [];
const enemies = [];
let score=0;
let keys = {};
let lastEnemySpawn = 0;
let gameOver=false;
let gamestop=false;

document.addEventListener('keydown', (e) => {
  keys[e.code] = true;
 //スペースでゲームリセット
  if (gameOver && e.code === 'Space') {

    resetGame();
  }
  //「ｐ」で一時停止
  if (e.key === 'p' || e.key === 'p') {
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Pose', canvas.width / 2, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText('Press p to Retry', canvas.width / 2, canvas.height / 2 + 40);
    gamestop = !gamestop;
  }

});

//星のランダム
for (let i = 0; i < 100; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 1, // 星の大きさ：1〜3px
    speed: Math.random() * 0.5 + 0.2 // 星の速さ
  });
}

//星の描画
function drawStars(){
  ctx.fillStyle = 'rgb(255, 255, 255)';
  stars.forEach((star) => {
    star.y += star.speed;

    // 星が下に行ったら上に戻す
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });
}


document.addEventListener('keyup', (e) => keys[e.code] = false);

//自機の描画
function drawPlayer() {
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

//弾の描画
function drawBullets() {
  player.bullets.forEach((bullet, index) => {
    bullet.y -= bullet.speed;
    //弾を画像で描画
    ctx.drawImage(tamaImg, bullet.x, bullet.y, bullet.width*3, bullet.height*3 );
    // 画面外なら削除
    if (bullet.y < 0) player.bullets.splice(index, 1);
  });
}

//敵の描画
function drawEnemies() {
  enemies.forEach((enemy, eIndex) => {
    enemy.y += enemy.speed;

    // 敵を画像で描画
    ctx.drawImage(enemiesImg, enemy.x, enemy.y, enemy.width*1.2, enemy.height*1.2);

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

       //自機との当たり判定
   if (enemy.x < player.x + player.width &&
    enemy.x + enemy.width > player.x &&
    enemy.y < player.y + player.height &&
    enemy.y + enemy.height > player.y) {
   gameOver = true;
 }
//弾の発射
 if (Math.random() < 0.002) { // 0.2%の確率で発射（毎フレーム）
  enemyBullets.push({
    x: enemy.x + enemy.width / 2 - 2.5,
    y: enemy.y + enemy.height,
    width: 5,
    height: 10,
    speed: 4
  });
}
  });
}

//敵の弾の描画
function drawEnemyBullets() {
  ctx.fillStyle = 'orange';
  enemyBullets.forEach((bullet, index) => {
    bullet.y += bullet.speed*1.2;
    ctx.fillRect(bullet.x, bullet.y, bullet.width*0.8, bullet.height*0.8);

    // 自機との当たり判定
    if (
      bullet.x < player.x + player.width &&
      bullet.x + bullet.width > player.x &&
      bullet.y < player.y + player.height &&
      bullet.y + bullet.height > player.y
    ) {
      gameOver = true;
    }

    // 画面外で削除
    if (bullet.y > canvas.height) {
      enemyBullets.splice(index, 1);
    }
  });
}


//敵の出現
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

//ボスの出現
function checkBossAppear() {
  if (!boss && score >= 2000) {
    boss = {
      x: canvas.width / 2 - 60,
      y: 50,
      width: 100,
      height: 60,
      hp: 30,
      speed: 2,
      direction: 1
    };
  }
}

//ボスの描画
function drawBoss() {
  if (!boss) return;
  lastEnemySpawn=0;
  enemies.length=0;

  // 横移動（バウンド）
  boss.x += boss.speed * boss.direction;
  if (boss.x < 0 || boss.x + boss.width > canvas.width) {
    boss.direction *= -1;
  }

  ctx.drawImage(bossImg, boss.x, boss.y, boss.width, boss.height);

  // HPバー
  ctx.fillStyle = 'red';
  ctx.fillRect(boss.x, boss.y - 10, boss.width, 5);
  ctx.fillStyle = 'lime';
  ctx.fillRect(boss.x, boss.y - 10, boss.width * (boss.hp / 30), 5);

  // 弾との当たり判定
  player.bullets.forEach((bullet, bIndex) => {
    if (bullet.x < boss.x + boss.width &&
        bullet.x + bullet.width > boss.x &&
        bullet.y < boss.y + boss.height &&
        bullet.y + bullet.height > boss.y) {
      boss.hp--;
      player.bullets.splice(bIndex, 1);

      if (boss.hp <= 0) {
        score += 500;
        resetGame();
        // ここでクリア画面表示とかもできる
      }
    }
  });

  // 自機との接触でゲームオーバー
  if (player.x < boss.x + boss.width &&
      player.x + player.width > boss.x &&
      player.y < boss.y + boss.height &&
      player.y + player.height > boss.y) {
        gameOver=true;
  }
  //弾の発射
 if (Math.random() < 0.05) { // 5%の確率で発射（毎フレーム）
  bossbullets.push({
    x: boss.x + boss.width / 2 - 2.5,
    y: boss.y + boss.height,
    width: 5,
    height: 10,
    speed: 4
  });
}
}

//ボスの弾の描画
function drawbossbullets(){
  ctx.fillStyle='red';
  bossbullets.forEach((bullet,index)=> {
    bullet.y += bullet.speed*1.2;
    ctx.fillRect(bullet.x, bullet.y, bullet.width*5, bullet.height*5);

    // 自機との当たり判定
    if (
    bullet.x < player.x + player.width &&
    bullet.x + bullet.width > player.x &&
    bullet.y < player.y + player.height &&
    bullet.y + bullet.height > player.y
        ) {
          gameOver = true;
        }
    
        // 画面外で削除
        if (bullet.y > canvas.height) {
          bossbullets.splice(index, 1);
        }
      });
    }

    //ゲームオーバー画面
function drawGameOver() {
  ctx.fillStyle = 'white';
  ctx.font = '40px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
  ctx.font = '20px Arial';
  ctx.fillText('Press Space to Retry', canvas.width / 2, canvas.height / 2 + 40);
  drawScore();
}

/*canvas.addEventListener('click', () => {
  if (gameOver) {
    resetGame();
  }
});*/

/*function resetGame() {
  stage++;
  player.x = canvas.width / 2 - player.width / 2;
  player.y = canvas.height - 60;
  player.bullets = [];
  enemies.length = 0;
  enemyBullets.length = 0;
  gameOver = false;
  boss = null;
  lastEnemySpawn = 0;
  gameLoop();// もう一度ループ開始
}*/


//ゲームリセット
function resetGame() {
  player.x = canvas.width / 2 - player.width / 2;
  player.y = canvas.height - 60;
  player.bullets = [];
  enemies.length = 0;
  enemyBullets.length=0;
  boss = null;
  if(!gameOver){
    score++;
  }else{
    score = 0;
  }
  gameOver = false;
  lastEnemySpawn = 0;
  gameLoop(); 
}

//スコアの表示
function drawScore(){
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
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

//ゲームループ
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //ゲームオーバーじゃなければ
  if(!gameOver){
  //ゲームストップじゃなければ 
  if(!gamestop){
  drawStars(); 
  update();
  drawPlayer();
  drawBullets();
  drawEnemies();
  checkBossAppear();     
  drawBoss();   
  drawEnemyBullets(); 
  drawScore();
  spawnEnemy();
  }
  requestAnimationFrame(gameLoop);
}else{  //ゲームオーバーならば
  drawScore();
  drawStars(); 
  drawGameOver();
}
}

gameLoop();
  }}