const obstaclePool = [];
const OBSTACLE_POOL_SIZE = 20;

function initObstacles() {
  obstaclePool.length = 0;
  _lastSpawnedLane = -1;
  for (let i = 0; i < OBSTACLE_POOL_SIZE; i++) {
    obstaclePool.push({
      active:  false,
      lane:    1,
      worldZ:  0,
      palette: OBSTACLE_PALETTES[0],
      nearMissGiven: false,
    });
  }
}

let _lastSpawnedLane = -1;

function spawnObstacle() {
  const obj = obstaclePool.find(o => !o.active);
  if (!obj) return;
  obj.active   = true;

  // Pick a lane that differs from the last spawned lane so the player
  // always gets a gap between same-lane obstacles.
  let lane;
  do { lane = Math.floor(Math.random() * NUM_LANES); }
  while (lane === _lastSpawnedLane);
  _lastSpawnedLane = lane;
  obj.lane = lane;

  // Start spawning close (20 segments) and ramp to full draw distance over 30s
  const spawnSegs = Math.min(DRAW_DISTANCE, 20 + Math.floor(gameState.gameTime * 2.7));
  obj.worldZ   = gameState.cameraZ + spawnSegs * SEGMENT_LENGTH;
  obj.palette  = OBSTACLE_PALETTES[Math.floor(Math.random() * OBSTACLE_PALETTES.length)];
  obj.nearMissGiven = false;
}

function updateObstacles(dt) {
  for (const obj of obstaclePool) {
    if (!obj.active) continue;

    obj.worldZ -= gameState.speed * gameState.player.boostMult * dt;

    // Deactivate when passed behind camera
    if (obj.worldZ < gameState.cameraZ - SEGMENT_LENGTH * 2) {
      obj.active = false;
      continue;
    }

    // ── Collision check ──────────────────────────────────────────────────
    // Only check obstacles strictly ahead of the player — once passed, no collision
    const zDiff = obj.worldZ - gameState.cameraZ;
    if (zDiff >= COLLISION_Z_MIN && zDiff < COLLISION_Z_THRESHOLD) {
      const playerCenter = getPlayerLaneCenter();
      const entityCenter = obj.lane;
      const laneDist = Math.abs(playerCenter - entityCenter);

      if (laneDist < COLLISION_LANE_THRESH) {
        handleObstacleHit();
        obj.active = false;
        continue;
      }

      // Near-miss bonus
      if (!obj.nearMissGiven && laneDist < NEAR_MISS_THRESH) {
        gameState.score += SCORE_NEAR_MISS;
        gameState.nearMissText = { timer: 1.0 };
        obj.nearMissGiven = true;
      }
    }
  }
}

function handleObstacleHit() {
  const p = gameState.player;
  if (p.invincible) return;

  if (p.shieldActive) {
    p.shieldHits--;
    playShieldHit();
    if (p.shieldHits <= 0) {
      p.shieldActive = false;
      gameState.activePowerUps = gameState.activePowerUps.filter(ap => ap.type.id !== 'SHIELD');
    }
    p.invincible = true;
    p.invincibleTimer = 0.6;
    return;
  }

  playCrash();
  gameState.lives--;
  gameState.flashColor = 'rgba(255,0,0,0.5)';
  gameState.flashTimer = 0.4;

  p.invincible = true;
  p.invincibleTimer = INVINCIBILITY_TIME;

  if (gameState.lives <= 0) {
    endGame();
  }
}

function drawObstacles(ctx, W, H) {
  // Sort far to near so closer ones draw on top
  const sorted = obstaclePool
    .filter(o => o.active)
    .sort((a, b) => b.worldZ - a.worldZ);

  for (const obj of sorted) {
    const pos = entityScreenPos(obj.lane, obj.worldZ, W, H);
    if (!pos) continue;

    const scale = pos.scale * 0.9;
    if (scale < 0.05) continue;

    drawCar(ctx, pos.x, pos.y, scale, obj.palette, false);
  }
}
