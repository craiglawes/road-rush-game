const powerupPool = [];

function initPowerups() {
  powerupPool.length = 0;
  for (let i = 0; i < POWERUP_POOL_SIZE; i++) {
    powerupPool.push({ active: false, lane: 0, worldZ: 0, type: null, angle: 0 });
  }
}

function spawnPowerup() {
  const obj = powerupPool.find(p => !p.active);
  if (!obj) return;
  const types = Object.values(POWERUP_TYPES);
  obj.active = true;
  obj.lane   = Math.floor(Math.random() * NUM_LANES);
  obj.worldZ = gameState.cameraZ + 50 * SEGMENT_LENGTH;
  obj.type   = types[Math.floor(Math.random() * types.length)];
  obj.angle  = 0;
}

function updatePowerups(dt) {
  // Spawn timer
  gameState.powerupSpawnTimer -= dt;
  if (gameState.powerupSpawnTimer <= 0) {
    spawnPowerup();
    gameState.powerupSpawnTimer = POWERUP_SPAWN_BASE + Math.random() * POWERUP_SPAWN_RAND;
  }

  for (const obj of powerupPool) {
    if (!obj.active) continue;
    obj.angle += dt * 2.5; // spin
    obj.worldZ -= gameState.speed * gameState.player.boostMult * dt;

    if (obj.worldZ < gameState.cameraZ - SEGMENT_LENGTH * 2) {
      obj.active = false;
      continue;
    }

    // Pickup collision
    const zDist = Math.abs(obj.worldZ - gameState.cameraZ);
    if (zDist < COLLISION_Z_THRESHOLD) {
      const playerCenter = getPlayerLaneCenter();
      const laneDist = Math.abs(playerCenter - obj.lane);
      if (laneDist < COLLISION_LANE_THRESH) {
        applyPowerup(obj.type);
        obj.active = false;
        playPowerUp();
      }
    }
  }

  // Tick active power-up timers
  for (let i = gameState.activePowerUps.length - 1; i >= 0; i--) {
    const ap = gameState.activePowerUps[i];
    ap.remaining -= dt;
    if (ap.remaining <= 0) {
      expirePowerup(ap.type);
      gameState.activePowerUps.splice(i, 1);
    }
  }
}

function applyPowerup(type) {
  const p = gameState.player;
  if (type.id === 'SPEED_BOOST') {
    p.boostActive     = true;
    p.boostTimer      = type.duration;
    p.boostMult       = type.speedMultiplier;
    p.scoreMultiplier = type.scoreMultiplier;
    // Remove any existing boost
    gameState.activePowerUps = gameState.activePowerUps.filter(ap => ap.type.id !== 'SPEED_BOOST');
    gameState.activePowerUps.push({ type, remaining: type.duration });
  } else if (type.id === 'SHIELD') {
    p.shieldActive = true;
    p.shieldHits   = type.hits;
    gameState.activePowerUps = gameState.activePowerUps.filter(ap => ap.type.id !== 'SHIELD');
    gameState.activePowerUps.push({ type, remaining: type.duration });
  } else if (type.id === 'EXTRA_LIFE') {
    gameState.lives = Math.min(gameState.lives + 1, 5);
    // instant — no timer needed
  }
}

function expirePowerup(type) {
  const p = gameState.player;
  if (type.id === 'SPEED_BOOST') {
    p.boostActive     = false;
    p.boostMult       = 1;
    p.scoreMultiplier = 1;
  } else if (type.id === 'SHIELD') {
    p.shieldActive = false;
    p.shieldHits   = 0;
  }
}

function drawPowerups(ctx, W, H) {
  const sorted = powerupPool
    .filter(p => p.active)
    .sort((a, b) => b.worldZ - a.worldZ);

  for (const obj of sorted) {
    const pos = entityScreenPos(obj.lane, obj.worldZ, W, H);
    if (!pos) continue;
    const size = 28 * pos.scale;
    if (size < 4) continue;

    ctx.save();
    ctx.translate(pos.x, pos.y - size * 1.5);
    ctx.rotate(obj.angle);

    // Glow
    ctx.shadowColor  = obj.type.glow;
    ctx.shadowBlur   = 18 * pos.scale;

    // Diamond shape
    ctx.fillStyle = obj.type.color;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size, 0);
    ctx.lineTo(0, size);
    ctx.lineTo(-size, 0);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.restore();

    // Symbol label (emoji, drawn unrotated)
    ctx.save();
    ctx.font         = `bold ${Math.max(10, size * 0.9)}px sans-serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(obj.type.symbol, pos.x, pos.y - size * 1.5);
    ctx.restore();
  }
}
