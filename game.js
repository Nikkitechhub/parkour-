const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const levelText = document.getElementById("levelText");
const deathText = document.getElementById("deathText");
const message = document.getElementById("message");

const startScreen = document.getElementById("start-screen");
const winScreen = document.getElementById("win-screen");

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const jumpBtn = document.getElementById("jumpBtn");


// ======================================================
// CANVAS
// ======================================================

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);

  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();


// ======================================================
// CONSTANTS
// ======================================================

const GRAVITY = 0.65;
const MOVE_SPEED = 4.8;
const JUMP_POWER = 12.5;

let gameStarted = false;
let gameWon = false;

let currentLevel = 0;
let deaths = 0;

let cameraX = 0;

let shake = 0;

const keys = {
  left: false,
  right: false,
  jump: false
};


// ======================================================
// INPUT
// ======================================================

window.addEventListener("keydown", (e) => {

  if (
    e.code === "ArrowLeft" ||
    e.code === "KeyA"
  ) {
    keys.left = true;
  }

  if (
    e.code === "ArrowRight" ||
    e.code === "KeyD"
  ) {
    keys.right = true;
  }

  if (
    e.code === "Space" ||
    e.code === "ArrowUp" ||
    e.code === "KeyW"
  ) {
    keys.jump = true;
    e.preventDefault();
  }
});


window.addEventListener("keyup", (e) => {

  if (
    e.code === "ArrowLeft" ||
    e.code === "KeyA"
  ) {
    keys.left = false;
  }

  if (
    e.code === "ArrowRight" ||
    e.code === "KeyD"
  ) {
    keys.right = false;
  }

  if (
    e.code === "Space" ||
    e.code === "ArrowUp" ||
    e.code === "KeyW"
  ) {
    keys.jump = false;
  }
});


// ======================================================
// MOBILE CONTROLS
// ======================================================

function holdButton(button, keyName) {

  const start = (e) => {
    e.preventDefault();
    keys[keyName] = true;
  };

  const end = (e) => {
    e.preventDefault();
    keys[keyName] = false;
  };

  button.addEventListener("pointerdown", start);
  button.addEventListener("pointerup", end);
  button.addEventListener("pointercancel", end);
  button.addEventListener("pointerleave", end);
}

holdButton(leftBtn, "left");
holdButton(rightBtn, "right");
holdButton(jumpBtn, "jump");


// ======================================================
// LEVEL DATA
// ======================================================

const levels = [

  // LEVEL 1
  {
    width: 3000,

    spawn: {
      x: 100,
      y: 400
    },

    platforms: [
      { x: 0, y: 520, w: 650, h: 50 },
      { x: 780, y: 520, w: 500, h: 50 },
      { x: 1420, y: 470, w: 350, h: 50 },
      { x: 1900, y: 520, w: 500, h: 50 },
      { x: 2500, y: 430, w: 400, h: 50 }
    ],

    spikes: [
      { x: 420, y: 490, w: 50, h: 30 },
      { x: 470, y: 490, w: 50, h: 30 },

      // Troll spike after landing
      { x: 930, y: 490, w: 50, h: 30 },

      { x: 1600, y: 440, w: 50, h: 30 },
      { x: 2050, y: 490, w: 50, h: 30 }
    ],

    movingPlatforms: [
      {
        x: 1320,
        y: 450,
        w: 100,
        h: 25,
        minX: 1280,
        maxX: 1450,
        speed: 1.5,
        dir: 1
      }
    ],

    goal: {
      x: 2770,
      y: 350,
      w: 40,
      h: 80
    }
  },


  // LEVEL 2
  {
    width: 3500,

    spawn: {
      x: 100,
      y: 400
    },

    platforms: [
      { x: 0, y: 520, w: 500, h: 50 },
      { x: 650, y: 470, w: 300, h: 50 },
      { x: 1080, y: 400, w: 250, h: 50 },
      { x: 1450, y: 500, w: 400, h: 50 },
      { x: 2000, y: 430, w: 300, h: 50 },
      { x: 2450, y: 520, w: 350, h: 50 },
      { x: 3000, y: 400, w: 400, h: 50 }
    ],

    spikes: [
      { x: 330, y: 490, w: 50, h: 30 },

      { x: 700, y: 440, w: 50, h: 30 },

      { x: 1160, y: 370, w: 50, h: 30 },

      { x: 1580, y: 470, w: 50, h: 30 },

      // Hidden troll trap
      { x: 2150, y: 400, w: 50, h: 30 },

      { x: 2600, y: 490, w: 50, h: 30 }
    ],

    movingPlatforms: [
      {
        x: 500,
        y: 430,
        w: 100,
        h: 25,
        minX: 500,
        maxX: 650,
        speed: 2,
        dir: 1
      },

      {
        x: 1850,
        y: 400,
        w: 100,
        h: 25,
        minX: 1800,
        maxX: 2000,
        speed: 1.8,
        dir: 1
      },

      {
        x: 2800,
        y: 350,
        w: 120,
        h: 25,
        minX: 2800,
        maxX: 3000,
        speed: 2,
        dir: 1
      }
    ],

    goal: {
      x: 3260,
      y: 320,
      w: 40,
      h: 80
    }
  },


  // LEVEL 3
  {
    width: 4300,

    spawn: {
      x: 100,
      y: 400
    },

    platforms: [
      { x: 0, y: 520, w: 550, h: 50 },

      { x: 700, y: 480, w: 250, h: 50 },

      { x: 1100, y: 400, w: 250, h: 50 },

      { x: 1500, y: 520, w: 300, h: 50 },

      { x: 1950, y: 450, w: 250, h: 50 },

      { x: 2350, y: 370, w: 250, h: 50 },

      { x: 2750, y: 500, w: 400, h: 50 },

      { x: 3300, y: 420, w: 250, h: 50 },

      { x: 3700, y: 340, w: 450, h: 50 }
    ],

    spikes: [
      { x: 400, y: 490, w: 50, h: 30 },

      { x: 760, y: 450, w: 50, h: 30 },

      { x: 1180, y: 370, w: 50, h: 30 },

      { x: 1620, y: 490, w: 50, h: 30 },

      { x: 2050, y: 420, w: 50, h: 30 },

      { x: 2420, y: 340, w: 50, h: 30 },

      // Troll traps
      { x: 2900, y: 470, w: 50, h: 30 },
      { x: 3000, y: 470, w: 50, h: 30 },

      { x: 3370, y: 390, w: 50, h: 30 },

      { x: 3920, y: 310, w: 50, h: 30 }
    ],

    movingPlatforms: [
      {
        x: 550,
        y: 400,
        w: 110,
        h: 25,
        minX: 540,
        maxX: 700,
        speed: 2,
        dir: 1
      },

      {
        x: 1350,
        y: 350,
        w: 100,
        h: 25,
        minX: 1350,
        maxX: 1500,
        speed: 2.2,
        dir: 1
      },

      {
        x: 2200,
        y: 330,
        w: 110,
        h: 25,
        minX: 2180,
        maxX: 2350,
        speed: 2,
        dir: 1
      },

      {
        x: 3150,
        y: 390,
        w: 120,
        h: 25,
        minX: 3150,
        maxX: 3300,
        speed: 2.5,
        dir: 1
      }
    ],

    goal: {
      x: 4050,
      y: 260,
      w: 40,
      h: 80
    }
  }
];


// ======================================================
// PLAYER
// ======================================================

const player = {
  x: 100,
  y: 400,

  w: 32,
  h: 42,

  vx: 0,
  vy: 0,

  grounded: false,

  jumpLock: false,

  facing: 1
};


// ======================================================
// GAME STATE
// ======================================================

let level = levels[0];

function loadLevel(index) {

  currentLevel = index;
  level = levels[currentLevel];

  player.x = level.spawn.x;
  player.y = level.spawn.y;

  player.vx = 0;
  player.vy = 0;

  player.grounded = false;
  player.jumpLock = false;

  cameraX = 0;

  levelText.textContent = currentLevel + 1;
}


// ======================================================
// START / RESTART
// ======================================================

startButton.addEventListener("click", () => {

  startScreen.classList.add("hidden");

  gameStarted = true;
  gameWon = false;

  deaths = 0;

  deathText.textContent = deaths;

  loadLevel(0);

  showMessage("GOOD LUCK...");
});


restartButton.addEventListener("click", () => {

  winScreen.classList.add("hidden");

  gameStarted = true;
  gameWon = false;

  deaths = 0;

  deathText.textContent = deaths;

  loadLevel(0);
});


// ======================================================
// MESSAGE
// ======================================================

let messageTimer = 0;

function showMessage(text) {

  message.textContent = text;
  message.style.opacity = "1";

  messageTimer = 120;
}

function updateMessage() {

  if (messageTimer > 0) {

    messageTimer--;

    if (messageTimer <= 0) {
      message.style.opacity = "0";
    }
  }
}


// ======================================================
// COLLISION
// ======================================================

function intersects(a, b) {

  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}


// ======================================================
// PLAYER UPDATE
// ======================================================

function updatePlayer() {

  // Horizontal movement
  if (keys.left && !keys.right) {

    player.vx = -MOVE_SPEED;
    player.facing = -1;

  } else if (keys.right && !keys.left) {

    player.vx = MOVE_SPEED;
    player.facing = 1;

  } else {

    player.vx *= 0.78;
  }


  // Jump
  if (
    keys.jump &&
    player.grounded &&
    !player.jumpLock
  ) {

    player.vy = -JUMP_POWER;

    player.grounded = false;
    player.jumpLock = true;
  }

  if (!keys.jump) {
    player.jumpLock = false;
  }


  // Gravity
  player.vy += GRAVITY;

  if (player.vy > 18) {
    player.vy = 18;
  }


  // Horizontal movement
  player.x += player.vx;


  // Prevent leaving level
  if (player.x < 0) {
    player.x = 0;
    player.vx = 0;
  }

  if (player.x + player.w > level.width) {
    player.x = level.width - player.w;
    player.vx = 0;
  }


  // Vertical movement
  const oldY = player.y;

  player.y += player.vy;

  player.grounded = false;


  // Platforms
  const allPlatforms = [
    ...level.platforms,
    ...level.movingPlatforms
  ];

  for (const platform of allPlatforms) {

    const horizontal =
      player.x + player.w > platform.x &&
      player.x < platform.x + platform.w;

    const wasAbove =
      oldY + player.h <= platform.y;

    const nowTouching =
      player.y + player.h >= platform.y;

    if (
      horizontal &&
      wasAbove &&
      nowTouching &&
      player.vy >= 0
    ) {

      player.y = platform.y - player.h;

      player.vy = 0;

      player.grounded = true;
    }
  }


  // Falling
  if (player.y > 750) {
    killPlayer();
  }


  // Spikes
  for (const spike of level.spikes) {

    const hitbox = {
      x: spike.x + 5,
      y: spike.y + 8,
      w: spike.w - 10,
      h: spike.h - 8
    };

    if (intersects(player, hitbox)) {
      killPlayer();
      return;
    }
  }


  // Goal
  if (intersects(player, level.goal)) {
    completeLevel();
  }
}


// ======================================================
// MOVING PLATFORMS
// ======================================================

function updateMovingPlatforms() {

  for (const platform of level.movingPlatforms) {

    platform.x += platform.speed * platform.dir;

    if (platform.x >= platform.maxX) {
      platform.x = platform.maxX;
      platform.dir = -1;
    }

    if (platform.x <= platform.minX) {
      platform.x = platform.minX;
      platform.dir = 1;
    }
  }
}


// ======================================================
// DEATH
// ======================================================

let deathCooldown = 0;

function killPlayer() {

  if (deathCooldown > 0) {
    return;
  }

  deathCooldown = 45;

  deaths++;

  deathText.textContent = deaths;

  shake = 12;

  showMessage("OUCH!");


  setTimeout(() => {

    if (!gameWon) {

      player.x = level.spawn.x;
      player.y = level.spawn.y;

      player.vx = 0;
      player.vy = 0;

      cameraX = 0;
    }

  }, 250);
}


// ======================================================
// LEVEL COMPLETE
// ======================================================

function completeLevel() {

  if (gameWon) {
    return;
  }

  gameWon = true;

  showMessage("LEVEL COMPLETE!");

  setTimeout(() => {

    if (currentLevel < levels.length - 1) {

      gameWon = false;

      loadLevel(currentLevel + 1);

      showMessage(
        "LEVEL " + (currentLevel + 1)
      );

    } else {

      winScreen.classList.remove("hidden");
    }

  }, 1000);
}


// ======================================================
// CAMERA
// ======================================================

function updateCamera() {

  const screenWidth = window.innerWidth;

  const target =
    player.x -
    screenWidth * 0.35;

  cameraX +=
    (target - cameraX) * 0.1;

  if (cameraX < 0) {
    cameraX = 0;
  }

  const maxCamera =
    Math.max(0, level.width - screenWidth);

  if (cameraX > maxCamera) {
    cameraX = maxCamera;
  }
}


// ======================================================
// DRAW BACKGROUND
// ======================================================

function drawBackground() {

  const width = window.innerWidth;
  const height = window.innerHeight;

  // Sky
  const gradient = ctx.createLinearGradient(
    0,
    0,
    0,
    height
  );

  gradient.addColorStop(0, "#4b7bec");
  gradient.addColorStop(1, "#b8e0ff");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);


  // Moon
  ctx.fillStyle = "rgba(255,255,255,0.55)";

  ctx.beginPath();

  ctx.arc(
    width - 100,
    100,
    45,
    0,
    Math.PI * 2
  );

  ctx.fill();


  // Background mountains
  ctx.save();

  ctx.translate(
    -cameraX * 0.15,
    0
  );

  ctx.fillStyle = "#7195b5";

  for (let x = -500; x < level.width + 1000; x += 400) {

    ctx.beginPath();

    ctx.moveTo(x, height);

    ctx.lineTo(x + 200, 280);

    ctx.lineTo(x + 400, height);

    ctx.closePath();

    ctx.fill();
  }

  ctx.restore();


  // Far hills
  ctx.save();

  ctx.translate(
    -cameraX * 0.3,
    0
  );

  ctx.fillStyle = "#5c8099";

  for (let x = -500; x < level.width + 1000; x += 500) {

    ctx.beginPath();

    ctx.arc(
      x + 250,
      600,
      250,
      Math.PI,
      Math.PI * 2
    );

    ctx.fill();
  }

  ctx.restore();
}


// ======================================================
// DRAW PLATFORMS
// ======================================================

function drawPlatform(platform) {

  ctx.fillStyle = "#303030";

  ctx.fillRect(
    platform.x,
    platform.y,
    platform.w,
    platform.h
  );

  // Top grass
  ctx.fillStyle = "#54c96b";

  ctx.fillRect(
    platform.x,
    platform.y,
    platform.w,
    8
  );

  // Bottom pattern
  ctx.fillStyle = "#222";

  for (
    let x = platform.x;
    x < platform.x + platform.w;
    x += 25
  ) {

    ctx.fillRect(
      x,
      platform.y + 25,
      12,
      8
    );
  }
}


// ======================================================
// DRAW SPIKE
// ======================================================

function drawSpike(spike) {

  ctx.fillStyle = "#e6e6e6";

  const count =
    Math.max(1, Math.floor(spike.w / 25));

  const spikeWidth =
    spike.w / count;

  for (let i = 0; i < count; i++) {

    const x =
      spike.x + i * spikeWidth;

    ctx.beginPath();

    ctx.moveTo(
      x,
      spike.y + spike.h
    );

    ctx.lineTo(
      x + spikeWidth / 2,
      spike.y
    );

    ctx.lineTo(
      x + spikeWidth,
      spike.y + spike.h
    );

    ctx.closePath();

    ctx.fill();
  }

  ctx.strokeStyle = "#333";
  ctx.lineWidth = 2;

  ctx.stroke();
}


// ======================================================
// DRAW GOAL
// ======================================================

function drawGoal(goal) {

  // Pole
  ctx.fillStyle = "#eee";

  ctx.fillRect(
    goal.x + 5,
    goal.y,
    6,
    goal.h
  );


  // Flag
  ctx.fillStyle = "#39d353";

  ctx.beginPath();

  ctx.moveTo(
    goal.x + 11,
    goal.y
  );

  ctx.lineTo(
    goal.x + 45,
    goal.y + 15
  );

  ctx.lineTo(
    goal.x + 11,
    goal.y + 30
  );

  ctx.closePath();

  ctx.fill();


  // Glow
  ctx.strokeStyle = "rgba(57,211,83,0.5)";
  ctx.lineWidth = 4;

  ctx.strokeRect(
    goal.x - 5,
    goal.y - 5,
    goal.w + 20,
    goal.h + 10
  );
}


// ======================================================
// DRAW PLAYER
// ======================================================

function drawPlayer() {

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.25)";

  ctx.beginPath();

  ctx.ellipse(
    player.x + player.w / 2,
    player.y + player.h + 5,
    20,
    6,
    0,
    0,
    Math.PI * 2
  );

  ctx.fill();


  // Body
  ctx.fillStyle = "#ff4757";

  ctx.fillRect(
    player.x,
    player.y + 10,
    player.w,
    player.h - 10
  );


  // Head
  ctx.fillStyle = "#ff6b81";

  ctx.beginPath();

  ctx.arc(
    player.x + player.w / 2,
    player.y + 10,
    14,
    0,
    Math.PI * 2
  );

  ctx.fill();


  // Eye direction
  ctx.fillStyle = "white";

  const eyeX =
    player.facing === 1
      ? player.x + 20
      : player.x + 8;

  ctx.beginPath();

  ctx.arc(
    eyeX,
    player.y + 7,
    4,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.fillStyle = "#111";

  ctx.beginPath();

  ctx.arc(
    eyeX + player.facing * 1,
    player.y + 7,
    2,
    0,
    Math.PI * 2
  );

  ctx.fill();


  // Legs
  ctx.strokeStyle = "#8e2530";
  ctx.lineWidth = 5;

  ctx.beginPath();

  ctx.moveTo(
    player.x + 9,
    player.y + player.h
  );

  ctx.lineTo(
    player.x + 7,
    player.y + player.h + 8
  );

  ctx.moveTo(
    player.x + 23,
    player.y + player.h
  );

  ctx.lineTo(
    player.x + 25,
    player.y + player.h + 8
  );

  ctx.stroke();
}


// ======================================================
// DRAW WORLD
// ======================================================

function drawWorld() {

  ctx.save();

  // Screen shake
  if (shake > 0) {

    const sx =
      (Math.random() - 0.5) * shake;

    const sy =
      (Math.random() - 0.5) * shake;

    ctx.translate(sx, sy);
  }

  ctx.translate(-cameraX, 0);


  // Platforms
  for (const platform of level.platforms) {
    drawPlatform(platform);
  }

  for (const platform of level.movingPlatforms) {
    drawPlatform(platform);
  }


  // Spikes
  for (const spike of level.spikes) {
    drawSpike(spike);
  }


  // Goal
  drawGoal(level.goal);


  // Player
  drawPlayer();

  ctx.restore();
}


// ======================================================
// GAME LOOP
// ======================================================

function update() {

  if (!gameStarted) {
    return;
  }

  if (deathCooldown > 0) {
    deathCooldown--;
  }

  updateMovingPlatforms();

  if (!gameWon) {
    updatePlayer();
  }

  updateCamera();

  updateMessage();


  if (shake > 0) {
    shake *= 0.85;

    if (shake < 0.5) {
      shake = 0;
    }
  }
}


function draw() {

  ctx.clearRect(
    0,
    0,
    window.innerWidth,
    window.innerHeight
  );

  drawBackground();
  drawWorld();
}


function gameLoop() {

  update();
  draw();

  requestAnimationFrame(gameLoop);
}

gameLoop();
