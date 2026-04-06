// ─── Scenery & Weather System ─────────────────────────────────────────────────

// ── Environment definitions ───────────────────────────────────────────────────
const ENVIRONMENTS = {
  VILLAGE: {
    skyTop:     '#0c1428', skyMid: '#1e3a70', skyHorizon: '#80b8d8',
    grassLight: '#3a7a28', grassDark:  '#2a5a18',
    roadLight:  '#555566', roadDark:   '#444455',
    weather: 'none', bgType: 'hills', roadsideType: 'oak',
  },
  DESERT: {
    skyTop:     '#100a02', skyMid: '#b84008', skyHorizon: '#f0a820',
    grassLight: '#c09030', grassDark:  '#a07020',
    roadLight:  '#787060', roadDark:   '#686050',
    weather: 'sandstorm', bgType: 'mesas', roadsideType: 'cactus',
  },
  MOUNTAINS: {
    skyTop:     '#080d14', skyMid: '#101c30', skyHorizon: '#8ab0c8',
    grassLight: '#dce0e8', grassDark:  '#b8c0cc',
    roadLight:  '#687888', roadDark:   '#586070',
    weather: 'snow', bgType: 'peaks', roadsideType: 'pine',
  },
  MT_VILLAGE: {
    skyTop:     '#050810', skyMid: '#0a1020', skyHorizon: '#1c1410',
    grassLight: '#a8acb8', grassDark:  '#888898',
    roadLight:  '#404850', roadDark:   '#303840',
    weather: 'blizzard', bgType: 'mt_village', roadsideType: 'pine_building',
  },
};

// Tier index → environment key
const TIER_ENV = ['VILLAGE', 'DESERT', 'MOUNTAINS', 'MT_VILLAGE'];

// ── Scenery state ─────────────────────────────────────────────────────────────
let _sc = {
  curKey:   'VILLAGE',
  prevKey:  'VILLAGE',
  t:        1.0,       // 0 = full prev, 1 = full current
  lastTier: 0,
  particles: [],
  time: 0,
};

// ── Color utilities ───────────────────────────────────────────────────────────
function _h2r(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function _lerp3(a, b, t) {
  const [ar, ag, ab] = _h2r(a), [br, bg, bb] = _h2r(b);
  const r  = Math.round(ar + (br - ar) * t).toString(16).padStart(2, '0');
  const g  = Math.round(ag + (bg - ag) * t).toString(16).padStart(2, '0');
  const bl = Math.round(ab + (bb - ab) * t).toString(16).padStart(2, '0');
  return `#${r}${g}${bl}`;
}

function _applyEnvColors() {
  const ce = ENVIRONMENTS[_sc.curKey], pe = ENVIRONMENTS[_sc.prevKey], t = _sc.t;
  COLOR.SKY_TOP     = _lerp3(pe.skyTop,     ce.skyTop,     t);
  COLOR.SKY_MID     = _lerp3(pe.skyMid,     ce.skyMid,     t);
  COLOR.SKY_HORIZON = _lerp3(pe.skyHorizon, ce.skyHorizon, t);
  COLOR.GRASS_LIGHT = _lerp3(pe.grassLight, ce.grassLight, t);
  COLOR.GRASS_DARK  = _lerp3(pe.grassDark,  ce.grassDark,  t);
  COLOR.ROAD_LIGHT  = _lerp3(pe.roadLight,  ce.roadLight,  t);
  COLOR.ROAD_DARK   = _lerp3(pe.roadDark,   ce.roadDark,   t);
}

// ── Particle system ───────────────────────────────────────────────────────────
function _resetParticle(p, weather, W, H) {
  switch (weather) {
    case 'snow':
      p.x  = Math.random() * W;
      p.y  = Math.random() * H;
      p.vx = (Math.random() - 0.5) * 30;
      p.vy = 70 + Math.random() * 50;
      p.sz = 1 + Math.random() * 1.5;
      p.op = 0.5 + Math.random() * 0.45;
      p.dr = Math.random() * Math.PI * 2;
      p.ds = 0.8 + Math.random() * 0.8;
      break;
    case 'blizzard':
      p.x  = Math.random() * W;
      p.y  = Math.random() * H;
      p.vx = -55 + (Math.random() - 0.5) * 40;
      p.vy = 260 + Math.random() * 300;
      p.sz = 1 + Math.random() * 2.5;
      p.op = 0.65 + Math.random() * 0.35;
      p.dr = Math.random() * Math.PI * 2;
      p.ds = 2 + Math.random() * 2;
      break;
    case 'sandstorm':
      p.x  = W + Math.random() * 120;
      p.y  = Math.random() * H;
      p.vx = -300 - Math.random() * 250;
      p.vy = (Math.random() - 0.4) * 100;
      p.sz = 0.5 + Math.random() * 1.5;
      p.ln = 8 + Math.random() * 18;
      p.op = 0.08 + Math.random() * 0.28;
      break;
    default:
      p.x = -9999; p.y = -9999;
  }
}

function _initParticles(W, H) {
  _sc.particles = [];
  const weather = ENVIRONMENTS[_sc.curKey].weather;
  for (let i = 0; i < 160; i++) {
    const p = { x: 0, y: 0, vx: 0, vy: 0, sz: 1, op: 1, dr: 0, ds: 1, ln: 10 };
    _resetParticle(p, weather, W, H);
    _sc.particles.push(p);
  }
}

function _updateParticles(dt, W, H) {
  const weather = ENVIRONMENTS[_sc.curKey].weather;
  for (const p of _sc.particles) {
    if (weather === 'none') { p.x = -9999; continue; }

    if (weather === 'snow' || weather === 'blizzard') {
      p.dr += p.ds * dt;
      p.x  += (p.vx + Math.sin(p.dr) * 25) * dt;
      p.y  += p.vy * dt;
      if (p.y > H + 5 || p.x < -20 || p.x > W + 20) _resetParticle(p, weather, W, H);
    } else if (weather === 'sandstorm') {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.x < -40 || p.y < 0 || p.y > H) _resetParticle(p, weather, W, H);
    }
  }
}

// ── Background scenery drawing ────────────────────────────────────────────────

function _bgHills(ctx, W, H) {
  const hy = H * 0.52;

  // Far hills (darker)
  ctx.fillStyle = '#1a4014';
  ctx.beginPath();
  ctx.moveTo(-5, hy);
  const xp = [0, .10, .18, .28, .38, .48, .58, .68, .78, .88, .96, 1.01];
  const yp = [0, -.06, -.04, -.09, -.05, -.08, -.03, -.07, -.04, -.06, -.02, 0];
  for (let i = 0; i < xp.length; i++) ctx.lineTo(xp[i] * W, hy + yp[i] * H);
  ctx.closePath();
  ctx.fill();

  // Near hills (lighter, less relief)
  ctx.fillStyle = '#234d1c';
  ctx.beginPath();
  ctx.moveTo(-5, hy);
  const xp2 = [0, .15, .28, .42, .56, .70, .82, .94, 1.01];
  const yp2 = [0, -.030, -.022, -.038, -.024, -.034, -.018, -.028, 0];
  for (let i = 0; i < xp2.length; i++) ctx.lineTo(xp2[i] * W, hy + yp2[i] * H);
  ctx.closePath();
  ctx.fill();

  // Church spire
  const sx = W * 0.71, sb = hy - H * 0.042;
  ctx.fillStyle = '#182e12';
  ctx.fillRect(sx - 3, sb - H * 0.065, 6, H * 0.065);
  ctx.beginPath();
  ctx.moveTo(sx, sb - H * 0.115);
  ctx.lineTo(sx - 9, sb - H * 0.065);
  ctx.lineTo(sx + 9, sb - H * 0.065);
  ctx.closePath();
  ctx.fill();
}

function _bgMesas(ctx, W, H) {
  const hy  = H * 0.52;
  const mesas = [[.06,.13,.11], [.24,.19,.085], [.52,.22,.130], [.78,.16,.095]];
  ctx.fillStyle = '#4a1e08';
  for (const [mx, mw, mh] of mesas) {
    const x = mx * W, w = mw * W, h = mh * H, sl = h * 0.28;
    ctx.beginPath();
    ctx.moveTo(x, hy);
    ctx.lineTo(x + sl,     hy - h);
    ctx.lineTo(x + w - sl, hy - h);
    ctx.lineTo(x + w,      hy);
    ctx.closePath();
    ctx.fill();
  }
}

function _bgPeaks(ctx, W, H) {
  const hy = H * 0.52;
  const peaks = [
    [-.04, .30, .22], [.14, .26, .17], [.36, .34, .27],
    [.62,  .30, .21], [.80, .28, .24],
  ];

  // Mountain body
  ctx.fillStyle = '#182c3c';
  for (const [px, pw, ph] of peaks) {
    const x = px * W, w = pw * W, h = ph * H;
    ctx.beginPath();
    ctx.moveTo(x, hy); ctx.lineTo(x + w * .5, hy - h); ctx.lineTo(x + w, hy);
    ctx.closePath(); ctx.fill();
  }

  // Snow caps
  ctx.fillStyle = '#ccd8e8';
  for (const [px, pw, ph] of peaks) {
    const x = px * W, w = pw * W, h = ph * H, ch = h * .22, cx = x + w * .5;
    ctx.beginPath();
    ctx.moveTo(cx, hy - h);
    ctx.lineTo(cx - w * .11, hy - h + ch);
    ctx.lineTo(cx + w * .11, hy - h + ch);
    ctx.closePath(); ctx.fill();
  }
}

function _bgMtVillage(ctx, W, H) {
  const hy = H * 0.52;

  // Dark stormy mountain silhouettes
  ctx.fillStyle = '#0a0e18';
  const peaks = [
    [-.03, .28, .19], [.16, .32, .23], [.44, .26, .18], [.66, .30, .21]
  ];
  for (const [px, pw, ph] of peaks) {
    const x = px * W, w = pw * W, h = ph * H;
    ctx.beginPath();
    ctx.moveTo(x, hy); ctx.lineTo(x + w * .5, hy - h); ctx.lineTo(x + w, hy);
    ctx.closePath(); ctx.fill();
  }

  // Village building silhouettes with lit windows
  const bldgs = [
    [.14, .025, .040], [.18, .030, .050], [.23, .022, .035],
    [.54, .028, .045], [.59, .026, .055], [.63, .022, .040],
  ];
  for (const [bx, bw, bh] of bldgs) {
    const x = bx * W, w = bw * W, h = bh * H, by = hy - h;
    ctx.fillStyle = '#0a0e18';
    ctx.fillRect(x, by, w, h);
    // Pointed roof
    ctx.beginPath();
    ctx.moveTo(x - 2, by);
    ctx.lineTo(x + w * .5, by - h * .38);
    ctx.lineTo(x + w + 2, by);
    ctx.closePath(); ctx.fill();
    // Warm window glow
    ctx.fillStyle = 'rgba(255,195,70,0.75)';
    const ww = w * .26, wh = h * .22;
    ctx.fillRect(x + w * .12, by + h * .30, ww, wh);
    if (w > 16) ctx.fillRect(x + w * .58, by + h * .30, ww, wh);
  }
}

function _drawBgForKey(key, ctx, W, H) {
  if      (key === 'VILLAGE')    _bgHills(ctx, W, H);
  else if (key === 'DESERT')     _bgMesas(ctx, W, H);
  else if (key === 'MOUNTAINS')  _bgPeaks(ctx, W, H);
  else if (key === 'MT_VILLAGE') _bgMtVillage(ctx, W, H);
}

function drawSceneryBg(ctx, W, H) {
  if (_sc.t < 1.0) {
    _drawBgForKey(_sc.prevKey, ctx, W, H);
    ctx.save();
    ctx.globalAlpha = _sc.t;
    _drawBgForKey(_sc.curKey, ctx, W, H);
    ctx.restore();
  } else {
    _drawBgForKey(_sc.curKey, ctx, W, H);
  }
}

// ── Roadside objects ──────────────────────────────────────────────────────────

function _roadsidePos(segIdx, side, W, H) {
  if (segIdx <= 0) return null;
  const relZ  = segIdx * SEGMENT_LENGTH;
  const scale = CAMERA_DEPTH / (relZ / SEGMENT_LENGTH);
  if (scale < 0.025) return null;

  const offX = side === 'left' ? -(ROAD_WIDTH * .68) : (ROAD_WIDTH * .68);

  // Accumulate curve offset (same as entityScreenPos)
  const startIdx = Math.floor(gameState.cameraZ / SEGMENT_LENGTH) % NUM_SEGMENTS;
  let curveAcc = 0;
  for (let j = 0; j < segIdx; j++) {
    curveAcc += segments[(startIdx + j) % NUM_SEGMENTS].curve * (j / DRAW_DISTANCE);
  }

  const totalX = offX + curveAcc * ROAD_WIDTH * .5;
  const sx = (1 + scale * (totalX / (ROAD_WIDTH / 2))) * W / 2;
  const sy = (1 + scale) * H / 2;   // road-surface Y (worldY = 0)
  return { x: sx, y: sy, scale };
}

function _pine(ctx, x, y, s, snow) {
  const tH = 22 * s, tW = 7 * s;
  ctx.fillStyle = '#2a1a0a';
  ctx.fillRect(x - tW / 2, y - tH, tW, tH);

  // Three overlapping tiers
  const tiers = [
    { yBase: tH,       hw: 48 * s, h: 58 * s, col: '#0d280d' },
    { yBase: tH + 38 * s, hw: 35 * s, h: 52 * s, col: '#0a2008' },
    { yBase: tH + 72 * s, hw: 22 * s, h: 44 * s, col: '#071506' },
  ];
  for (const tier of tiers) {
    ctx.fillStyle = tier.col;
    ctx.beginPath();
    ctx.moveTo(x - tier.hw,  y - tier.yBase);
    ctx.lineTo(x + tier.hw,  y - tier.yBase);
    ctx.lineTo(x,            y - tier.yBase - tier.h);
    ctx.closePath(); ctx.fill();
  }

  if (snow) {
    ctx.fillStyle = 'rgba(215,228,245,0.8)';
    ctx.beginPath();
    ctx.moveTo(x - 13 * s, y - tH - 72 * s);
    ctx.lineTo(x + 13 * s, y - tH - 72 * s);
    ctx.lineTo(x,           y - tH - 116 * s);
    ctx.closePath(); ctx.fill();
  }
}

function _oak(ctx, x, y, s) {
  const tH = 45 * s, tW = 7 * s, cr = 52 * s;
  ctx.fillStyle = '#2e2010';
  ctx.fillRect(x - tW / 2, y - tH, tW, tH);
  ctx.fillStyle = '#1a4a15';
  ctx.beginPath();
  ctx.arc(x, y - tH - cr * .65, cr, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#226018';
  ctx.beginPath();
  ctx.arc(x - cr * .20, y - tH - cr * .85, cr * .62, 0, Math.PI * 2);
  ctx.fill();
}

function _cactus(ctx, x, y, s) {
  const h = 110 * s, w = 11 * s;
  ctx.fillStyle = '#254818';
  ctx.fillRect(x - w / 2, y - h, w, h);
  // Rounded trunk top
  ctx.beginPath();
  ctx.arc(x, y - h, w / 2, Math.PI, 0);
  ctx.fill();
  // Left arm
  const ay = y - h * .55;
  ctx.fillRect(x - w * 2.6, ay, w * 2.2, w * .9);
  ctx.fillRect(x - w * 2.6, ay - h * .28, w * .9, h * .28);
  ctx.beginPath(); ctx.arc(x - w * 2.6, ay - h * .28, w * .45, Math.PI, 0); ctx.fill();
  // Right arm
  ctx.fillRect(x + w * .5, ay + w * .4, w * 2.2, w * .9);
  ctx.fillRect(x + w * 1.8, ay + w * .4 - h * .22, w * .9, h * .22);
  ctx.beginPath(); ctx.arc(x + w * 1.8 + w * .45, ay + w * .4 - h * .22, w * .45, Math.PI, 0); ctx.fill();
}

function _building(ctx, x, y, s) {
  const bh = 72 * s, bw = 50 * s;
  ctx.fillStyle = '#3c3830';
  ctx.fillRect(x - bw / 2, y - bh, bw, bh);
  ctx.fillStyle = '#28241c';
  ctx.beginPath();
  ctx.moveTo(x - bw / 2 - 4 * s, y - bh);
  ctx.lineTo(x, y - bh - 26 * s);
  ctx.lineTo(x + bw / 2 + 4 * s, y - bh);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,195,70,0.55)';
  const ww = 9 * s, wh = 11 * s;
  ctx.fillRect(x - bw * .22, y - bh * .65, ww, wh);
  ctx.fillRect(x + bw * .08, y - bh * .65, ww, wh);
}

function drawRoadsideObjects(ctx, W, H) {
  const env   = ENVIRONMENTS[_sc.curKey];
  const rtype = env.roadsideType;
  const snow  = (_sc.curKey === 'MOUNTAINS' || _sc.curKey === 'MT_VILLAGE');
  const SPACING = 5;

  // Draw far-to-near (painter's algorithm)
  for (let i = DRAW_DISTANCE - 1; i >= 3; i--) {
    if (i % SPACING !== 0) continue;

    for (const side of ['left', 'right']) {
      // Stagger left/right objects by 2 segments so they don't align perfectly
      const si  = side === 'left' ? i : Math.min(DRAW_DISTANCE - 1, i + 2);
      const pos = _roadsidePos(si, side, W, H);
      if (!pos) continue;

      switch (rtype) {
        case 'oak':
          _oak(ctx, pos.x, pos.y, pos.scale);
          break;
        case 'cactus':
          _cactus(ctx, pos.x, pos.y, pos.scale);
          break;
        case 'pine':
          _pine(ctx, pos.x, pos.y, pos.scale, snow);
          break;
        case 'pine_building':
          if (i % 10 < 5) _pine(ctx, pos.x, pos.y, pos.scale, snow);
          else             _building(ctx, pos.x, pos.y, pos.scale);
          break;
      }
    }
  }
}

// ── Weather particles ─────────────────────────────────────────────────────────

function drawWeather(ctx, W, H) {
  const weather = ENVIRONMENTS[_sc.curKey].weather;
  if (weather === 'none') return;

  for (const p of _sc.particles) {
    if (p.x < -60 || p.x > W + 60 || p.y < -60 || p.y > H + 60) continue;
    const alpha = p.op * _sc.t;

    if (weather === 'snow' || weather === 'blizzard') {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
      ctx.fill();
    } else if (weather === 'sandstorm') {
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = 'rgba(200,145,45,1)';
      ctx.lineWidth   = p.sz;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.ln, p.y + p.ln * .12);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;

  // Blizzard near-whiteout gradient overlay
  if (weather === 'blizzard' && _sc.t > 0) {
    const intensity = Math.min(_sc.t * .35, .35);
    const grad = ctx.createLinearGradient(0, H * .35, 0, H);
    grad.addColorStop(0, `rgba(200,212,235,${intensity * .5})`);
    grad.addColorStop(1, `rgba(200,212,235,${intensity})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, H * .35, W, H * .65);
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

function initScenery(W, H) {
  _sc.curKey   = 'VILLAGE';
  _sc.prevKey  = 'VILLAGE';
  _sc.t        = 1.0;
  _sc.lastTier = 0;
  _sc.time     = 0;
  _applyEnvColors();
  _initParticles(W, H);
}

function updateScenery(dt, W, H) {
  _sc.time += dt;

  // Check for tier-based environment transition
  const tier = gameState.currentTierIndex;
  if (tier !== _sc.lastTier) {
    _sc.prevKey  = _sc.curKey;
    _sc.curKey   = TIER_ENV[tier];
    _sc.t        = 0;
    _sc.lastTier = tier;
    _initParticles(W, H);
  }

  // Advance cross-fade (3-second transition)
  if (_sc.t < 1.0) _sc.t = Math.min(1.0, _sc.t + dt / 3.0);

  _applyEnvColors();
  _updateParticles(dt, W, H);
}
