function drawHUD(ctx, W, H) {
  const s = gameState;

  // ── Score ────────────────────────────────────────────────────────────────
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.font      = `bold ${Math.round(H * 0.038)}px 'Courier New', monospace`;
  ctx.textAlign = 'right';
  ctx.shadowColor = '#000'; ctx.shadowBlur = 6;
  ctx.fillText(`${Math.floor(s.score).toString().padStart(7, '0')}`, W - 16, 38);
  ctx.font      = `${Math.round(H * 0.022)}px 'Courier New', monospace`;
  ctx.fillText('SCORE', W - 16, 58);
  ctx.restore();

  // ── High Score ───────────────────────────────────────────────────────────
  const hi = getHighScore();
  ctx.save();
  ctx.fillStyle = '#ffdd44';
  ctx.font      = `${Math.round(H * 0.022)}px 'Courier New', monospace`;
  ctx.textAlign = 'center';
  ctx.shadowColor = '#000'; ctx.shadowBlur = 4;
  ctx.fillText(`BEST  ${Math.floor(hi).toString().padStart(7, '0')}`, W / 2, 28);
  ctx.restore();

  // ── Lives ────────────────────────────────────────────────────────────────
  ctx.save();
  ctx.font      = `${Math.round(H * 0.030)}px sans-serif`;
  ctx.textAlign = 'left';
  ctx.shadowColor = '#000'; ctx.shadowBlur = 4;
  for (let i = 0; i < s.lives; i++) {
    ctx.fillText('❤', 14 + i * 28, 38);
  }
  ctx.restore();

  // ── Speed bar ────────────────────────────────────────────────────────────
  const barW = 120, barH = 10;
  const bx = W - barW - 16, by = 68;
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  roundedBar(ctx, bx, by, barW, barH, 4);
  const speedNorm = (s.speed - INITIAL_SPEED) / (MAX_SPEED - INITIAL_SPEED);
  const barColor = speedNorm < 0.5 ? '#44ff44' : speedNorm < 0.8 ? '#ffaa00' : '#ff2200';
  ctx.fillStyle = barColor;
  roundedBar(ctx, bx, by, Math.max(4, barW * speedNorm), barH, 4);
  ctx.fillStyle = '#aaaaaa';
  ctx.font      = `${Math.round(H * 0.018)}px 'Courier New', monospace`;
  ctx.textAlign = 'right';
  ctx.fillText('SPEED', W - 16, by + barH + 14);
  ctx.restore();

  // ── Active power-ups ─────────────────────────────────────────────────────
  let py = H - 80;
  for (const ap of s.activePowerUps) {
    const maxDur = ap.type.duration || 1;
    const frac   = Math.max(0, ap.remaining / maxDur);

    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    roundedBar(ctx, 14, py, 140, 22, 6);

    ctx.fillStyle = ap.type.color;
    roundedBar(ctx, 14, py, Math.max(6, 140 * frac), 22, 6);

    ctx.fillStyle = '#ffffff';
    ctx.font      = `bold ${Math.round(H * 0.020)}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.shadowColor = '#000'; ctx.shadowBlur = 3;
    ctx.fillText(`${ap.type.symbol} ${ap.type.label}`, 22, py + 15);
    ctx.restore();

    py -= 30;
  }

  // ── Flash overlay (crash / hit) ───────────────────────────────────────────
  if (s.flashTimer > 0) {
    ctx.save();
    ctx.fillStyle = s.flashColor;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
    s.flashTimer -= s._dt || (1 / 60);
  }

  // ── Near-miss text ────────────────────────────────────────────────────────
  if (s.nearMissText) {
    s.nearMissText.timer -= s._dt || (1 / 60);
    const alpha = Math.min(1, s.nearMissText.timer * 3);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle   = '#ffff00';
    ctx.font        = `bold ${Math.round(H * 0.045)}px 'Courier New', monospace`;
    ctx.textAlign   = 'center';
    ctx.shadowColor = '#ff8800'; ctx.shadowBlur = 12;
    ctx.fillText(`CLOSE!  +${SCORE_NEAR_MISS}`, W / 2, H * 0.45);
    ctx.restore();
    if (s.nearMissText.timer <= 0) s.nearMissText = null;
  }

  // ── Tier announcement ──────────────────────────────────────────────────────
  if (s.tierAnnounce) {
    s.tierAnnounce.timer -= s._dt || (1 / 60);
    const alpha = Math.min(1, s.tierAnnounce.timer * 2);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle   = s.tierAnnounce.color;
    ctx.font        = `bold ${Math.round(H * 0.065)}px 'Courier New', monospace`;
    ctx.textAlign   = 'center';
    ctx.shadowColor = s.tierAnnounce.color; ctx.shadowBlur = 20;
    ctx.fillText(s.tierAnnounce.text, W / 2, H * 0.38);
    ctx.restore();
    if (s.tierAnnounce.timer <= 0) s.tierAnnounce = null;
  }
}

function roundedBar(ctx, x, y, w, h, r) {
  if (w <= 0) return;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y,     x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x,     y + h, r);
  ctx.arcTo(x,     y + h, x,     y,     r);
  ctx.arcTo(x,     y,     x + w, y,     r);
  ctx.closePath();
  ctx.fill();
}
