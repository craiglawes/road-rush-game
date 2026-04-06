// ─── Main entry point ─────────────────────────────────────────────────────────

const canvas = document.getElementById('game');
const ctx    = canvas.getContext('2d');
let W, H;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// ─── Difficulty Manager ───────────────────────────────────────────────────────
function updateDifficulty(dt) {
  const s = gameState;
  s.gameTime += dt;

  s.speed         = Math.min(INITIAL_SPEED + SPEED_RAMP_RATE * s.gameTime, MAX_SPEED);
  s.spawnInterval = Math.max(INITIAL_SPAWN_INT - SPAWN_RAMP_RATE * s.gameTime, MIN_SPAWN_INT);

  // Curves
  if (s.gameTime > CURVE_START_TIME) {
    s.curveIntensity = Math.min((s.gameTime - CURVE_START_TIME) / 90, MAX_CURVE_INTENSITY);
    applyCurves();
  }

  // Tier check
  for (let i = DIFFICULTY_TIERS.length - 1; i >= 0; i--) {
    if (s.gameTime >= DIFFICULTY_TIERS[i].time && i > s.currentTierIndex) {
      s.currentTierIndex = i;
      s.score += SCORE_TIER_BONUS;
      s.tierAnnounce = {
        text:  DIFFICULTY_TIERS[i].name + '!',
        color: DIFFICULTY_TIERS[i].color,
        timer: 3.0,
      };
      playTierUp();
      break;
    }
  }
}

let lastCurveUpdate = 0;
const CURVE_CHUNK = 20;

function applyCurves() {
  const segStart = Math.floor(gameState.cameraZ / SEGMENT_LENGTH) % NUM_SEGMENTS;
  for (let i = 0; i < NUM_SEGMENTS; i++) {
    const chunk = Math.floor(i / CURVE_CHUNK);
    // Use a deterministic sine-based curve per chunk
    segments[i].curve = Math.sin(chunk * 1.3) * gameState.curveIntensity * 0.05;
  }
}

// ─── Obstacle spawn timer ─────────────────────────────────────────────────────
function updateObstacleSpawn(dt) {
  gameState.obstacleSpawnTimer -= dt;
  if (gameState.obstacleSpawnTimer <= 0) {
    spawnObstacle();
    gameState.obstacleSpawnTimer = gameState.spawnInterval;
  }
}

// ─── Score update ─────────────────────────────────────────────────────────────
function updateScore(dt) {
  const s = gameState;
  s.score += s.speed * dt * SCORE_RATE * s.player.scoreMultiplier;
}

// ─── Render ───────────────────────────────────────────────────────────────────
function render() {
  ctx.clearRect(0, 0, W, H);

  if (gameState.current === STATE.MENU) {
    drawMenuBackground(ctx, W, H);
    return;
  }

  // Always draw road (visible in all in-game states)
  drawRoad(ctx, W, H);
  drawSceneryBg(ctx, W, H);
  drawRoadsideObjects(ctx, W, H);
  drawWeather(ctx, W, H);
  drawPowerups(ctx, W, H);
  drawObstacles(ctx, W, H);
  drawPlayer(ctx, W, H);
  drawHUD(ctx, W, H);

  if (gameState.current === STATE.COUNTDOWN) {
    drawCountdown(ctx, W, H);
  }
}

function drawMenuBackground(ctx, W, H) {
  // Simple animated road bg for menu
  ctx.fillStyle = COLOR.SKY_TOP;
  ctx.fillRect(0, 0, W, H);
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#1a1a2e');
  grad.addColorStop(0.5, '#16213e');
  grad.addColorStop(1, '#0f3460');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Grid lines for retro feel
  ctx.strokeStyle = 'rgba(100,100,200,0.2)';
  ctx.lineWidth = 1;
  const t = (Date.now() / 40) % 60;
  for (let y = H * 0.55; y < H; y += 60) {
    ctx.beginPath();
    const yOff = ((y - H * 0.55) / (H * 0.45));
    const xLeft  = W/2 - yOff * W * 0.7;
    const xRight = W/2 + yOff * W * 0.7;
    ctx.moveTo(xLeft, y + t * yOff * 3);
    ctx.lineTo(xRight, y + t * yOff * 3);
    ctx.stroke();
  }
}

// ─── Main loop ────────────────────────────────────────────────────────────────
let lastTime = 0;

function loop(timestamp) {
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
  lastTime = timestamp;
  gameState._dt = dt; // shared for HUD timer updates

  if (gameState.current === STATE.PLAYING) {
    // Update camera / road scroll
    gameState.cameraZ += gameState.speed * gameState.player.boostMult * dt;

    updateScenery(dt, W, H);
    updateDifficulty(dt);
    updateObstacleSpawn(dt);
    updatePlayer(dt, W, H);
    updateObstacles(dt);
    updatePowerups(dt);
    updateScore(dt);

    // Engine rev
    const speedNorm = (gameState.speed - INITIAL_SPEED) / (MAX_SPEED - INITIAL_SPEED);
    updateEngineRev(Math.min(1, speedNorm + (gameState.player.boostActive ? 0.3 : 0)));
  }

  if (gameState.current === STATE.COUNTDOWN) {
    gameState.cameraZ += 80 * dt; // slow scroll during countdown
    updateScenery(dt, W, H);
    gameState.countdownTimer -= dt;
    if (gameState.countdownTimer <= 0) {
      if (gameState.countdownValue > 0) {
        playCountdownBeep(gameState.countdownValue === 1);
        gameState.countdownValue--;
        gameState.countdownTimer = 1.0;
      }
      if (gameState.countdownValue === 0 && gameState.countdownTimer <= 0) {
        playCountdownBeep(true);
        gameState.current = STATE.PLAYING;
      }
    }
  }

  render();
  requestAnimationFrame(loop);
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
window.addEventListener('load', () => {
  buildSegments();
  initObstacles();
  initPowerups();
  initScenery(W, H);
  initUI();
  renderLeaderboard('menu-lb-rows');
  showScreen('screen-menu');
  requestAnimationFrame(loop);
});
