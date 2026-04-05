// Pseudo-3D road using segment projection (OutRun style)

const segments = [];
let roadCanvas, roadCtx;

function buildSegments() {
  segments.length = 0;
  for (let i = 0; i < NUM_SEGMENTS; i++) {
    // Assign curve values in chunks of 20 segments
    // Straight at start; curves activated by difficulty manager
    segments.push({
      index:  i,
      worldZ: i * SEGMENT_LENGTH,
      color:  i % 2 === 0 ? 'light' : 'dark',
      curve:  0,  // updated by difficulty manager
    });
  }
}

function projectSegment(worldX, worldY, worldZ, camZ, W, H) {
  const relZ = worldZ - camZ;
  if (relZ <= 0) return null;
  const scale = CAMERA_DEPTH / (relZ / SEGMENT_LENGTH);
  const sx = (1 + scale * (worldX / (ROAD_WIDTH / 2))) * W / 2;
  const sy = (1 - scale * ((worldY - CAMERA_HEIGHT) / CAMERA_HEIGHT)) * H / 2;
  const sw = scale * W / 1.8; // projected road half-width on screen
  return { x: sx, y: sy, w: sw, scale };
}

function getSegmentAt(z) {
  const idx = Math.floor(z / SEGMENT_LENGTH) % NUM_SEGMENTS;
  return segments[idx < 0 ? idx + NUM_SEGMENTS : idx];
}

function drawRoad(ctx, W, H) {
  const camZ = gameState.cameraZ;

  // ── Sky gradient ────────────────────────────────────────────────────────
  const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.52);
  skyGrad.addColorStop(0,   COLOR.SKY_TOP);
  skyGrad.addColorStop(0.7, COLOR.SKY_MID);
  skyGrad.addColorStop(1,   COLOR.SKY_HORIZON);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, H * 0.52);

  // ── Stars (static) ──────────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  // deterministic pseudo-random stars
  for (let s = 0; s < 80; s++) {
    const sx = ((s * 137 + 31) % W);
    const sy = ((s * 97  + 17) % Math.floor(H * 0.42));
    ctx.fillRect(sx, sy, 1, 1);
  }

  // ── Project segments back-to-front ──────────────────────────────────────
  const startIdx = Math.floor(camZ / SEGMENT_LENGTH) % NUM_SEGMENTS;
  let   curveX   = 0; // accumulated horizontal curve offset

  // We need to project each segment's near and far edge.
  // Collect projected data first so we can draw trapezoids.
  const projected = [];
  let curveAcc = 0;

  for (let i = 0; i < DRAW_DISTANCE; i++) {
    const idx = (startIdx + i) % NUM_SEGMENTS;
    const seg = segments[idx];
    const segZ = camZ + i * SEGMENT_LENGTH;

    // Curve offset accumulates across distance
    curveAcc += seg.curve * (i / DRAW_DISTANCE);

    const p = projectSegment(curveAcc * ROAD_WIDTH * 0.5, 0, segZ, camZ, W, H);
    if (!p) { projected.push(null); continue; }
    projected.push({ ...p, color: seg.color, index: idx, curveAcc });
  }

  // Draw from far to near (painter's algorithm)
  for (let i = DRAW_DISTANCE - 1; i >= 0; i--) {
    const near = projected[i];
    const far  = projected[i + 1] || null;
    if (!near) continue;

    const ny = near.y;
    const fy = far ? far.y : ny - 1;
    if (ny <= fy) continue; // behind screen

    const isLight = near.color === 'light';

    // ── Grass ──────────────────────────────────────────────────────────────
    ctx.fillStyle = isLight ? COLOR.GRASS_LIGHT : COLOR.GRASS_DARK;
    ctx.fillRect(0, fy, W, ny - fy);

    // ── Road surface ───────────────────────────────────────────────────────
    ctx.fillStyle = isLight ? COLOR.ROAD_LIGHT : COLOR.ROAD_DARK;
    drawTrapezoid(ctx,
      near.x - near.w, ny,
      near.x + near.w, ny,
      far  ? far.x - far.w : near.x - near.w * 0.8, fy,
      far  ? far.x + far.w : near.x + near.w * 0.8, fy
    );

    // ── Rumble strips (outermost edge alternating red/white) ───────────────
    const rumbleW = near.w * 0.08;
    ctx.fillStyle = isLight ? COLOR.RUMBLE_RED : COLOR.RUMBLE_WHITE;
    // Left rumble
    drawTrapezoid(ctx,
      near.x - near.w, ny,
      near.x - near.w + rumbleW, ny,
      far ? far.x - far.w : near.x - near.w * 0.8, fy,
      far ? far.x - far.w + (far.w * 0.08) : (near.x - near.w * 0.8) + rumbleW * 0.8, fy
    );
    // Right rumble
    drawTrapezoid(ctx,
      near.x + near.w - rumbleW, ny,
      near.x + near.w, ny,
      far ? far.x + far.w - (far.w * 0.08) : (near.x + near.w * 0.8) - rumbleW * 0.8, fy,
      far ? far.x + far.w : near.x + near.w * 0.8, fy
    );

    // ── Lane dashes (2 dashes for 3 lanes) ────────────────────────────────
    if (isLight) {
      const dashW = near.w * 0.015;
      for (let lane = 1; lane < NUM_LANES; lane++) {
        const laneOffset = (lane / NUM_LANES) * 2 - 1; // -0.33 and +0.33
        const nx = near.x + laneOffset * near.w;
        const fx = far ? far.x + laneOffset * far.w : nx;
        drawTrapezoid(ctx,
          nx - dashW, ny,
          nx + dashW, ny,
          fx - dashW * 0.7, fy,
          fx + dashW * 0.7, fy
        );
      }
    }
  }
}

function drawTrapezoid(ctx, x1, y1, x2, y1b, x3, y2, x4, y2b) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y1b);
  ctx.lineTo(x4, y2b);
  ctx.lineTo(x3, y2);
  ctx.closePath();
  ctx.fill();
}

// Returns screen {x, y, scale} for a world entity at given lane + worldZ
function entityScreenPos(lane, worldZ, W, H) {
  const relZ = worldZ - gameState.cameraZ;
  if (relZ <= 0) return null;
  const i = Math.floor(relZ / SEGMENT_LENGTH);
  if (i >= DRAW_DISTANCE) return null;
  const scale = CAMERA_DEPTH / (relZ / SEGMENT_LENGTH);

  // Accumulate curve offset up to this segment
  const startIdx = Math.floor(gameState.cameraZ / SEGMENT_LENGTH) % NUM_SEGMENTS;
  let curveAcc = 0;
  for (let j = 0; j < i; j++) {
    const idx = (startIdx + j) % NUM_SEGMENTS;
    curveAcc += segments[idx].curve * (j / DRAW_DISTANCE);
  }

  // Lane center in world X (-1..+1 mapped to road width)
  const laneCenter = (lane - 1) / 1; // lane 0→-1, 1→0, 2→+1
  const worldX = laneCenter * (ROAD_WIDTH / 3) + curveAcc * ROAD_WIDTH * 0.5;

  const sx = (1 + scale * (worldX / (ROAD_WIDTH / 2))) * W / 2;
  const sy = (1 - scale * ((0 - CAMERA_HEIGHT) / CAMERA_HEIGHT)) * H / 2;
  return { x: sx, y: sy, scale };
}
