// ─── Car Drawing — rear-view (Gran Turismo style) ────────────────────────────
function drawCar(ctx, cx, cy, scale, skin, flipped) {
  const s   = scale;
  const TW  = 130 * s;   // total width incl. tyre overhang
  const BW  = 114 * s;   // inner bodywork width
  const BH  =  72 * s;   // body height (diffuser base → roofline)
  const bx  = cx - BW / 2;
  const y   = cy - BH;

  ctx.save();

  // ── GROUND SHADOW ──
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 2 * s, TW * 0.50, 6 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // ── TYRE SLIVERS (barely visible behind haunches) ──
  [cx - TW * 0.455, cx + TW * 0.455].forEach(tx => {
    ctx.fillStyle = '#161616';
    ctx.beginPath(); ctx.ellipse(tx, cy - BH * 0.28, 10 * s, BH * 0.34, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#222222';
    ctx.beginPath(); ctx.ellipse(tx, cy - BH * 0.28,  7 * s, BH * 0.26, 0, 0, Math.PI * 2); ctx.fill();
  });

  // ── DIFFUSER ──
  ctx.fillStyle = '#0a0a0a';
  ctx.beginPath();
  ctx.moveTo(bx + BW * 0.06,  cy);
  ctx.lineTo(bx + BW * 0.94,  cy);
  ctx.lineTo(bx + BW * 0.90,  cy - BH * 0.20);
  ctx.lineTo(bx + BW * 0.10,  cy - BH * 0.20);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#1e1e1e';
  ctx.lineWidth = 1.5 * s;
  for (let f = 0; f < 7; f++) {
    const fx = bx + BW * 0.12 + f * (BW * 0.76 / 6);
    ctx.beginPath(); ctx.moveTo(fx, cy - 1); ctx.lineTo(fx, cy - BH * 0.19); ctx.stroke();
  }
  // Twin exhaust pairs
  [[0.24, 0.30], [0.70, 0.76]].forEach(([a, b]) => {
    [a, b].forEach(p => {
      ctx.fillStyle = '#3a3a3a';
      ctx.beginPath(); ctx.ellipse(bx + BW * p, cy - BH * 0.10, 4.5 * s, 4 * s, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#0d0d0d';
      ctx.beginPath(); ctx.ellipse(bx + BW * p, cy - BH * 0.10,   3 * s, 2.5 * s, 0, 0, Math.PI * 2); ctx.fill();
    });
  });

  // ── BODY — shadow layer (wide haunches) ──
  ctx.fillStyle = skin.bodyDark;
  ctx.beginPath();
  ctx.moveTo(cx - TW * 0.40,  cy - BH * 0.21);
  ctx.bezierCurveTo(cx - TW * 0.46, cy - BH * 0.38, cx - TW * 0.46, cy - BH * 0.55, cx - TW * 0.42, cy - BH * 0.72);
  ctx.lineTo(cx - BW * 0.46,  y + BH * 0.10);
  ctx.lineTo(cx + BW * 0.46,  y + BH * 0.10);
  ctx.lineTo(cx + TW * 0.42,  cy - BH * 0.72);
  ctx.bezierCurveTo(cx + TW * 0.46, cy - BH * 0.55, cx + TW * 0.46, cy - BH * 0.38, cx + TW * 0.40, cy - BH * 0.21);
  ctx.closePath();
  ctx.fill();

  // ── BODY — main colour ──
  ctx.fillStyle = skin.body;
  ctx.beginPath();
  ctx.moveTo(cx - TW * 0.38,  cy - BH * 0.22);
  ctx.bezierCurveTo(cx - TW * 0.44, cy - BH * 0.39, cx - TW * 0.44, cy - BH * 0.56, cx - TW * 0.40, cy - BH * 0.73);
  ctx.lineTo(cx - BW * 0.45,  y + BH * 0.11);
  ctx.lineTo(cx + BW * 0.45,  y + BH * 0.11);
  ctx.lineTo(cx + TW * 0.40,  cy - BH * 0.73);
  ctx.bezierCurveTo(cx + TW * 0.44, cy - BH * 0.56, cx + TW * 0.44, cy - BH * 0.39, cx + TW * 0.38, cy - BH * 0.22);
  ctx.closePath();
  ctx.fill();

  // Haunch highlight ridge
  ctx.strokeStyle = skin.bodyHighlight || 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(cx - TW * 0.44, cy - BH * 0.39);
  ctx.bezierCurveTo(cx - TW * 0.45, cy - BH * 0.55, cx - TW * 0.42, cy - BH * 0.68, cx - TW * 0.38, cy - BH * 0.74);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + TW * 0.44, cy - BH * 0.39);
  ctx.bezierCurveTo(cx + TW * 0.45, cy - BH * 0.55, cx + TW * 0.42, cy - BH * 0.68, cx + TW * 0.38, cy - BH * 0.74);
  ctx.stroke();

  // ── ROOF PANEL ──
  ctx.fillStyle = skin.roofColor || skin.bodyDark;
  ctx.beginPath();
  ctx.moveTo(cx - BW * 0.46, y + BH * 0.10);
  ctx.lineTo(cx + BW * 0.46, y + BH * 0.10);
  ctx.lineTo(cx + BW * 0.34, y - BH * 0.04);
  ctx.lineTo(cx - BW * 0.34, y - BH * 0.04);
  ctx.closePath();
  ctx.fill();

  // ── REAR WINDOW ──
  ctx.fillStyle = '#0c1c2e';
  ctx.beginPath();
  ctx.moveTo(cx - BW * 0.30, y + BH * 0.12);
  ctx.lineTo(cx + BW * 0.30, y + BH * 0.12);
  ctx.bezierCurveTo(cx + BW * 0.30, y + BH * 0.40, cx + BW * 0.26, y + BH * 0.54, cx + BW * 0.22, y + BH * 0.60);
  ctx.lineTo(cx - BW * 0.22, y + BH * 0.60);
  ctx.bezierCurveTo(cx - BW * 0.26, y + BH * 0.54, cx - BW * 0.30, y + BH * 0.40, cx - BW * 0.30, y + BH * 0.12);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(150,210,255,0.08)';
  ctx.beginPath();
  ctx.moveTo(cx - BW * 0.28, y + BH * 0.14);
  ctx.lineTo(cx,              y + BH * 0.14);
  ctx.lineTo(cx - BW * 0.02, y + BH * 0.38);
  ctx.lineTo(cx - BW * 0.22, y + BH * 0.38);
  ctx.closePath();
  ctx.fill();

  // ── TAIL LIGHTS ──
  ctx.fillStyle = '#3a0000';
  ctx.fillRect(cx - TW * 0.40, y + BH * 0.64, TW * 0.80, BH * 0.11);
  ctx.shadowColor = '#ff1100';
  ctx.shadowBlur  = 12 * s;
  ctx.fillStyle   = skin.tailLight || '#ff2200';
  ctx.fillRect(cx - TW * 0.40, y + BH * 0.64, TW * 0.24, BH * 0.11);
  ctx.fillRect(cx + TW * 0.16, y + BH * 0.64, TW * 0.24, BH * 0.11);
  ctx.shadowBlur = 0;
  ctx.fillStyle  = 'rgba(255,150,100,0.6)';
  ctx.fillRect(cx - TW * 0.40, y + BH * 0.64, TW * 0.24, 2 * s);
  ctx.fillRect(cx + TW * 0.16, y + BH * 0.64, TW * 0.24, 2 * s);
  ctx.fillStyle = skin.bodyDark;
  ctx.fillRect(cx - TW * 0.155, y + BH * 0.64, TW * 0.31, BH * 0.11);

  // ── LICENSE PLATE ──
  if (skin.plate) {
    ctx.fillStyle = '#eeeeee';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(cx - BW * 0.14, y + BH * 0.78, BW * 0.28, BH * 0.13, 2 * s);
    else ctx.rect(cx - BW * 0.14, y + BH * 0.78, BW * 0.28, BH * 0.13);
    ctx.fill();
    ctx.fillStyle = '#222222';
    ctx.font      = `bold ${Math.max(6, Math.round(7 * s))}px Courier New`;
    ctx.textAlign = 'center';
    ctx.fillText(skin.plate, cx, y + BH * 0.875);
  }

  // ── RACING STRIPE ──
  if (skin.stripe) {
    ctx.save();
    ctx.globalAlpha = 0.75;
    ctx.fillStyle   = skin.stripe;
    ctx.fillRect(cx - BW * 0.065, y - BH * 0.04, BW * 0.13, BH * 0.68);
    ctx.restore();
  }

  // ── SPOILER WING ──
  const spY = y - BH * 0.14;
  ctx.fillStyle = skin.wingColor || skin.bodyDark;
  [cx - BW * 0.15, cx + BW * 0.15].forEach(ux => {
    ctx.beginPath();
    ctx.moveTo(ux - 4 * s, y + BH * 0.05);
    ctx.bezierCurveTo(ux - 5 * s, spY + 4 * s, ux - 7 * s, spY, ux - 7 * s, spY - 2 * s);
    ctx.lineTo(ux + 7 * s, spY - 2 * s);
    ctx.bezierCurveTo(ux + 5 * s, spY, ux + 4 * s, y + BH * 0.05, ux + 4 * s, y + BH * 0.05);
    ctx.closePath();
    ctx.fill();
  });
  ctx.fillStyle = 'rgba(0,0,0,0.9)';
  ctx.beginPath();
  ctx.moveTo(cx - BW * 0.52, spY);
  ctx.lineTo(cx + BW * 0.52, spY);
  ctx.lineTo(cx + BW * 0.50, spY + 7 * s);
  ctx.lineTo(cx - BW * 0.50, spY + 7 * s);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = skin.wingColor || skin.bodyDark;
  ctx.beginPath();
  ctx.moveTo(cx - BW * 0.53, spY - 9 * s);
  ctx.lineTo(cx + BW * 0.53, spY - 9 * s);
  ctx.lineTo(cx + BW * 0.52, spY);
  ctx.lineTo(cx - BW * 0.52, spY);
  ctx.closePath();
  ctx.fill();
  if (skin.wingAccentColor) {
    ctx.fillStyle = skin.wingAccentColor;
    ctx.fillRect(cx - BW * 0.53, spY - 12 * s, BW * 1.06, 3 * s);
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth   = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(cx - BW * 0.53, spY - 9 * s);
  ctx.lineTo(cx + BW * 0.53, spY - 9 * s);
  ctx.stroke();

  ctx.restore();
}

// ─── Player Update ───────────────────────────────────────────────────────────
function updatePlayer(dt, W, H) {
  const p = gameState.player;

  // Invincibility countdown
  if (p.invincible) {
    p.invincibleTimer -= dt;
    if (p.invincibleTimer <= 0) p.invincible = false;
  }

  // Boost countdown
  if (p.boostActive) {
    p.boostTimer -= dt;
    if (p.boostTimer <= 0) {
      p.boostActive     = false;
      p.boostMult       = 1;
      p.scoreMultiplier = 1;
    }
  }

  // Lane change — only on the initial key press, not while held
  if (input.leftTap  && p.targetLane > 0) p.targetLane--;
  if (input.rightTap && p.targetLane < 2) p.targetLane++;
  input.leftTap  = false;
  input.rightTap = false;

  // Smooth lane transition
  if (p.lane !== p.targetLane) {
    const dir = p.targetLane > p.lane ? 1 : -1;
    p.laneProgress += dir * LANE_CHANGE_SPEED * dt;
    if (Math.abs(p.laneProgress) >= 1) {
      p.lane        += dir;
      p.laneProgress = 0;
    }
  } else {
    p.laneProgress = 0;
  }
}

function getPlayerLaneCenter() {
  const p = gameState.player;
  return p.lane + p.laneProgress;
}

function drawPlayer(ctx, W, H) {
  const p = gameState.player;
  const skin = CAR_SKINS[gameState.selectedSkin];

  // Flicker during invincibility
  if (p.invincible && Math.floor(Date.now() / 80) % 2 === 0) return;

  // Lane 0=left, 1=center, 2=right. Offset ≈ 0.213*W between lanes (derived from road projection at car's y)
  const laneCenter = p.lane + p.laneProgress; // 0..2, smooth
  const cx = W * (0.5 + (laneCenter - 1) * 0.213);
  const cy = H * 0.82;
  const scale = 1.0;

  // Shield glow
  if (p.shieldActive) {
    ctx.save();
    ctx.globalAlpha = 0.35 + 0.15 * Math.sin(Date.now() / 200);
    ctx.fillStyle = '#44aaff';
    ctx.beginPath();
    ctx.ellipse(cx, cy - 55, 52, 72, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // Speed boost flame effect
  if (p.boostActive) {
    drawBoostFlame(ctx, cx, cy);
  }

  drawCar(ctx, cx, cy, scale, skin, false);
}

function drawBoostFlame(ctx, cx, cy) {
  const t = Date.now() / 100;
  const colors = ['#ff6600', '#ff2200', '#ffaa00'];
  for (let i = 0; i < 3; i++) {
    ctx.save();
    ctx.globalAlpha = 0.7 - i * 0.2;
    ctx.fillStyle = colors[i % colors.length];
    const flameH = (30 + Math.sin(t + i) * 10) * (1 - i * 0.2);
    ctx.beginPath();
    ctx.moveTo(cx - 10 + i * 4, cy - 5);
    ctx.quadraticCurveTo(cx + Math.sin(t + i) * 8, cy + flameH, cx, cy + flameH + 10);
    ctx.quadraticCurveTo(cx - Math.sin(t + i) * 8, cy + flameH, cx + 10 - i * 4, cy - 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
