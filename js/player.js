// ─── Wheel helper (used by per-car draw functions) ────────────────────────────
function drawWheel(ctx, tx, ty, s, rimHex, rimLightHex, rimDarkHex, spokeHex) {
  ctx.fillStyle = '#191919';
  ctx.beginPath(); ctx.ellipse(tx, ty, 11*s, 19*s, 0, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#0d0d0d';
  ctx.beginPath(); ctx.ellipse(tx, ty,  9*s, 17*s, 0, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#252525'; ctx.lineWidth = 1.2*s;
  ctx.beginPath(); ctx.ellipse(tx, ty,  9*s, 17*s, 0, 0, Math.PI*2); ctx.stroke();
  const rg = ctx.createRadialGradient(tx - 2*s, ty - 2.5*s, 0, tx, ty, 7.5*s);
  rg.addColorStop(0, rimLightHex); rg.addColorStop(0.65, rimHex); rg.addColorStop(1, rimDarkHex);
  ctx.fillStyle = rg;
  ctx.beginPath(); ctx.ellipse(tx, ty, 7.5*s, 7.5*s, 0, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = spokeHex; ctx.lineWidth = 1.8*s; ctx.lineCap = 'round';
  for (let k = 0; k < 5; k++) {
    const a = k / 5 * Math.PI * 2 + 0.3;
    ctx.beginPath();
    ctx.moveTo(tx + Math.cos(a)*2.5*s, ty + Math.sin(a)*2.5*s);
    ctx.lineTo(tx + Math.cos(a)*6.5*s, ty + Math.sin(a)*6.5*s);
    ctx.stroke();
  }
  ctx.lineCap = 'butt';
  const hg = ctx.createRadialGradient(tx - 0.5*s, ty - 0.5*s, 0, tx, ty, 2.5*s);
  hg.addColorStop(0, rimLightHex); hg.addColorStop(1, rimHex);
  ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(tx, ty, 2.5*s, 0, Math.PI*2); ctx.fill();
}

// ─── Ferrari 488 GTB — rear-view ─────────────────────────────────────────────
function drawFerrari(ctx, cx, cy, s, skin) {
  const TW = 158*s, BW = 140*s, BH = 84*s, bx = cx - BW/2, y = cy - BH;

  ctx.save();

  // ── Ground shadow ──
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath(); ctx.ellipse(cx, cy+2*s, TW*0.50, 6*s, 0, 0, Math.PI*2); ctx.fill();

  // ── Wheels ──
  drawWheel(ctx, cx-TW*0.455, cy-BH*0.30, s, '#c8c8c8','#e0e0e0','#848484','#909090');
  drawWheel(ctx, cx+TW*0.455, cy-BH*0.30, s, '#c8c8c8','#e0e0e0','#848484','#909090');

  // ── Body shadow layer (haunches) ──
  ctx.fillStyle = '#6e0c00';
  ctx.beginPath();
  ctx.moveTo(cx-TW*0.43, cy-BH*0.10);
  ctx.bezierCurveTo(cx-TW*0.50,cy-BH*0.28, cx-TW*0.50,cy-BH*0.55, cx-TW*0.46,cy-BH*0.68);
  ctx.lineTo(cx-BW*0.48, cy-BH*0.73); ctx.lineTo(cx+BW*0.48, cy-BH*0.73);
  ctx.lineTo(cx+TW*0.46, cy-BH*0.68);
  ctx.bezierCurveTo(cx+TW*0.50,cy-BH*0.55, cx+TW*0.50,cy-BH*0.28, cx+TW*0.43,cy-BH*0.10);
  ctx.closePath(); ctx.fill();

  // ── Main body — Ferrari red ──
  ctx.fillStyle = '#D41800';
  ctx.beginPath();
  ctx.moveTo(cx-TW*0.40, cy-BH*0.11);
  ctx.bezierCurveTo(cx-TW*0.47,cy-BH*0.30, cx-TW*0.47,cy-BH*0.56, cx-TW*0.43,cy-BH*0.69);
  ctx.lineTo(cx-BW*0.47, cy-BH*0.74); ctx.lineTo(cx+BW*0.47, cy-BH*0.74);
  ctx.lineTo(cx+TW*0.43, cy-BH*0.69);
  ctx.bezierCurveTo(cx+TW*0.47,cy-BH*0.56, cx+TW*0.47,cy-BH*0.30, cx+TW*0.40,cy-BH*0.11);
  ctx.closePath(); ctx.fill();

  // Body edge highlight
  ctx.strokeStyle = 'rgba(255,80,50,0.15)'; ctx.lineWidth = 2*s;
  ctx.beginPath(); ctx.moveTo(cx-TW*0.44,cy-BH*0.15); ctx.lineTo(cx-TW*0.44,cy-BH*0.66); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx+TW*0.44,cy-BH*0.15); ctx.lineTo(cx+TW*0.44,cy-BH*0.66); ctx.stroke();

  // ── Large diffuser — lower 36% of car ──
  const diffTop = cy - BH*0.36;
  ctx.fillStyle = '#0d0d0d';
  ctx.beginPath();
  ctx.moveTo(cx-TW*0.44, cy); ctx.lineTo(cx+TW*0.44, cy);
  ctx.lineTo(cx+BW*0.47, diffTop); ctx.lineTo(cx-BW*0.47, diffTop);
  ctx.closePath(); ctx.fill();
  // Fins
  ctx.strokeStyle = '#252525'; ctx.lineWidth = 1.4*s;
  for (let f = 1; f <= 5; f++) {
    const t = f / 6;
    ctx.beginPath();
    ctx.moveTo(cx - TW*0.44 + t*TW*0.88, cy - 1);
    ctx.lineTo(cx - BW*0.47 + t*BW*0.94, diffTop + 1);
    ctx.stroke();
  }
  // Corner vents
  ctx.fillStyle = '#0a0a0a';
  ctx.beginPath(); ctx.moveTo(cx-TW*0.44,cy); ctx.lineTo(cx-TW*0.44+BW*0.14,cy); ctx.lineTo(cx-BW*0.47,diffTop); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx+TW*0.44,cy); ctx.lineTo(cx+TW*0.44-BW*0.14,cy); ctx.lineTo(cx+BW*0.47,diffTop); ctx.closePath(); ctx.fill();

  // ── Outer exhaust pipes (real 488 positions) ──
  [cx - BW*0.30, cx + BW*0.30].forEach(ex => {
    ctx.fillStyle = '#2a2a2a'; ctx.beginPath(); ctx.ellipse(ex, cy-BH*0.09, 9*s, 7.5*s, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#101010'; ctx.beginPath(); ctx.ellipse(ex, cy-BH*0.09, 6*s, 5*s, 0, 0, Math.PI*2); ctx.fill();
    ctx.shadowColor = 'rgba(255,100,30,0.5)'; ctx.shadowBlur = 5*s;
    ctx.fillStyle = '#1a0600'; ctx.beginPath(); ctx.ellipse(ex, cy-BH*0.09, 3.2*s, 2.6*s, 0, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
  });

  // ── Round tail lights — 488 GTB signature ──
  const tlCY  = cy - BH*0.55;
  const tlRX  = 19*s;
  const tlRY  = 17*s;
  const tlCXL = cx - TW*0.30;
  const tlCXR = cx + TW*0.30;

  [tlCXL, tlCXR].forEach(tlX => {
    // Dark housing recess
    ctx.fillStyle = '#0e0000';
    ctx.beginPath(); ctx.ellipse(tlX, tlCY, tlRX+4*s, tlRY+4*s, 0, 0, Math.PI*2); ctx.fill();
    // Outer red ring with glow
    ctx.shadowColor = '#ff1200'; ctx.shadowBlur = 16*s;
    ctx.fillStyle = '#c20c00';
    ctx.beginPath(); ctx.ellipse(tlX, tlCY, tlRX, tlRY, 0, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
    // Inner dark ring
    ctx.fillStyle = '#1a0000';
    ctx.beginPath(); ctx.ellipse(tlX, tlCY, tlRX*0.60, tlRY*0.60, 0, 0, Math.PI*2); ctx.fill();
    // Inner LED ring
    ctx.shadowColor = '#ff4400'; ctx.shadowBlur = 8*s;
    ctx.strokeStyle = '#ff3300'; ctx.lineWidth = 2.5*s;
    ctx.beginPath(); ctx.ellipse(tlX, tlCY, tlRX*0.60, tlRY*0.60, 0, 0, Math.PI*2); ctx.stroke();
    ctx.shadowBlur = 0;
    // Centre dark pupil
    ctx.fillStyle = '#0a0000';
    ctx.beginPath(); ctx.ellipse(tlX, tlCY, tlRX*0.32, tlRY*0.32, 0, 0, Math.PI*2); ctx.fill();
  });

  // ── Black centre fascia between lights ──
  const fasciaTop = cy - BH*0.76;
  const fasciaBot = diffTop;
  ctx.fillStyle = '#111111';
  ctx.beginPath();
  ctx.moveTo(tlCXL + tlRX*0.7, fasciaTop);
  ctx.lineTo(tlCXR - tlRX*0.7, fasciaTop);
  ctx.lineTo(tlCXR - tlRX*0.5, fasciaBot);
  ctx.lineTo(tlCXL + tlRX*0.5, fasciaBot);
  ctx.closePath(); ctx.fill();

  // ── Roof — black ──
  const roofBotY = cy - BH*0.74;
  const roofTopY = y - BH*0.06;
  ctx.fillStyle = '#111111';
  ctx.beginPath();
  ctx.moveTo(cx - BW*0.40, roofBotY);
  ctx.lineTo(cx + BW*0.40, roofBotY);
  ctx.bezierCurveTo(cx + BW*0.38, roofBotY - 4*s, cx + BW*0.22, roofTopY + 10*s, cx + BW*0.18, roofTopY);
  ctx.lineTo(cx - BW*0.18, roofTopY);
  ctx.bezierCurveTo(cx - BW*0.22, roofTopY + 10*s, cx - BW*0.38, roofBotY - 4*s, cx - BW*0.40, roofBotY);
  ctx.closePath(); ctx.fill();

  // ── Rear window — wide trapezoid ──
  const winTop = y + BH*0.05;
  const winBot = cy - BH*0.72;
  ctx.fillStyle = '#0a1828';
  ctx.beginPath();
  ctx.moveTo(cx - BW*0.21, winTop); ctx.lineTo(cx + BW*0.21, winTop);
  ctx.lineTo(cx + BW*0.36, winBot); ctx.lineTo(cx - BW*0.36, winBot);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(160,220,255,0.07)';
  ctx.beginPath();
  ctx.moveTo(cx - BW*0.21, winTop + 2*s); ctx.lineTo(cx, winTop + 2*s);
  ctx.lineTo(cx + BW*0.02, winBot + 2*s); ctx.lineTo(cx - BW*0.18, winBot + 2*s);
  ctx.closePath(); ctx.fill();

  // ── Small spoiler wing ──
  const spBase = roofBotY - 2*s;   // sits just above trunk edge
  const spTop  = roofBotY - 24*s;  // wing height
  // Two small support struts
  ctx.fillStyle = '#1a1a1a';
  [-BW*0.28, BW*0.28].forEach(ox => {
    ctx.beginPath();
    ctx.moveTo(cx + ox - 3*s, spBase);
    ctx.lineTo(cx + ox + 3*s, spBase);
    ctx.lineTo(cx + ox + 2*s, spTop + 4*s);
    ctx.lineTo(cx + ox - 2*s, spTop + 4*s);
    ctx.closePath(); ctx.fill();
  });
  // Wing blade
  ctx.fillStyle = '#111111';
  ctx.beginPath();
  ctx.moveTo(cx - BW*0.44, spTop);
  ctx.lineTo(cx + BW*0.44, spTop);
  ctx.lineTo(cx + BW*0.44, spTop + 6*s);
  ctx.lineTo(cx - BW*0.44, spTop + 6*s);
  ctx.closePath(); ctx.fill();
  // Top edge highlight
  ctx.strokeStyle = 'rgba(100,100,100,0.5)'; ctx.lineWidth = 1*s;
  ctx.beginPath(); ctx.moveTo(cx - BW*0.44, spTop); ctx.lineTo(cx + BW*0.44, spTop); ctx.stroke();
  // Trunk lip below wing
  ctx.fillStyle = '#0d0d0d';
  ctx.beginPath();
  ctx.moveTo(cx - BW*0.44, spBase);
  ctx.lineTo(cx + BW*0.44, spBase);
  ctx.lineTo(cx + BW*0.43, spBase - 4*s);
  ctx.lineTo(cx - BW*0.43, spBase - 4*s);
  ctx.closePath(); ctx.fill();

  // ── Prancing horse badge (centre fascia) ──
  const hx = cx, hy = fasciaTop + (fasciaBot - fasciaTop) * 0.42;
  ctx.save(); ctx.translate(hx, hy);
  ctx.fillStyle = '#f0c000';
  ctx.beginPath();
  ctx.moveTo(0,-7*s); ctx.lineTo(5.5*s,-4.5*s); ctx.lineTo(5.5*s,2*s);
  ctx.bezierCurveTo(5.5*s,5.5*s, 0,8*s, 0,8*s);
  ctx.bezierCurveTo(0,8*s, -5.5*s,5.5*s, -5.5*s,2*s);
  ctx.lineTo(-5.5*s,-4.5*s); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#880000';
  ctx.beginPath(); ctx.ellipse(0.4*s, 0.5*s, 2*s, 3.4*s, -0.18, 0, Math.PI*2); ctx.fill();
  ctx.restore();

  // ── License plate ──
  if (skin && skin.plate) {
    ctx.fillStyle = '#eeeeee';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(cx - BW*0.14, y + BH*0.80, BW*0.28, BH*0.13, 2*s);
    else ctx.rect(cx - BW*0.14, y + BH*0.80, BW*0.28, BH*0.13);
    ctx.fill();
    ctx.fillStyle = '#111111';
    ctx.font = `bold ${Math.round(7*s)}px 'Courier New'`;
    ctx.textAlign = 'center';
    ctx.fillText(skin.plate, cx, y + BH*0.89);
  }

  ctx.restore();
}

// ─── Lamborghini — rear-view ─────────────────────────────────────────────────
function drawLamborghini(ctx, cx, cy, s, skin) {
  const TW = 160*s, BW = 144*s, BH = 74*s, bx = cx - BW/2, y = cy - BH;

  ctx.save();

  // ── Ground shadow ──
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath(); ctx.ellipse(cx, cy+2*s, TW*0.50, 6*s, 0, 0, Math.PI*2); ctx.fill();

  // ── Wheels (gold-tinted rims) ──
  drawWheel(ctx, cx-TW*0.455, cy-BH*0.28, s, '#c8a800','#e0c000','#806800','#907800');
  drawWheel(ctx, cx+TW*0.455, cy-BH*0.28, s, '#c8a800','#e0c000','#806800','#907800');

  // ── Angular body shadow (sharp lineTo — Lamborghini has no curves) ──
  ctx.fillStyle = skin.bodyDark || '#996600';
  ctx.beginPath();
  ctx.moveTo(cx-TW*0.43, cy-BH*0.16);
  ctx.lineTo(cx-TW*0.48, cy-BH*0.44);
  ctx.lineTo(cx-TW*0.45, cy-BH*0.76);
  ctx.lineTo(cx-BW*0.47, cy-BH*0.82);
  ctx.lineTo(cx+BW*0.47, cy-BH*0.82);
  ctx.lineTo(cx+TW*0.45, cy-BH*0.76);
  ctx.lineTo(cx+TW*0.48, cy-BH*0.44);
  ctx.lineTo(cx+TW*0.43, cy-BH*0.16);
  ctx.closePath(); ctx.fill();

  // ── Angular body main colour ──
  ctx.fillStyle = skin.body || '#FFB800';
  ctx.beginPath();
  ctx.moveTo(cx-TW*0.41, cy-BH*0.17);
  ctx.lineTo(cx-TW*0.46, cy-BH*0.45);
  ctx.lineTo(cx-TW*0.43, cy-BH*0.77);
  ctx.lineTo(cx-BW*0.46, cy-BH*0.83);
  ctx.lineTo(cx+BW*0.46, cy-BH*0.83);
  ctx.lineTo(cx+TW*0.43, cy-BH*0.77);
  ctx.lineTo(cx+TW*0.46, cy-BH*0.45);
  ctx.lineTo(cx+TW*0.41, cy-BH*0.17);
  ctx.closePath(); ctx.fill();

  // Sharp edge highlight line (Lamborghini crease)
  ctx.strokeStyle = 'rgba(255,220,80,0.25)'; ctx.lineWidth = 1.5*s;
  ctx.beginPath(); ctx.moveTo(cx-TW*0.46,cy-BH*0.45); ctx.lineTo(cx-TW*0.43,cy-BH*0.77); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx+TW*0.46,cy-BH*0.45); ctx.lineTo(cx+TW*0.43,cy-BH*0.77); ctx.stroke();

  // ── Flat diffuser with geometric cutouts ──
  const diffTop = cy - BH*0.32;
  ctx.fillStyle = '#0d0d0d';
  ctx.beginPath();
  ctx.moveTo(cx-TW*0.45, cy); ctx.lineTo(cx+TW*0.45, cy);
  ctx.lineTo(cx+BW*0.48, diffTop); ctx.lineTo(cx-BW*0.48, diffTop);
  ctx.closePath(); ctx.fill();
  // Geometric fins (wider, more aggressive)
  ctx.strokeStyle = '#252525'; ctx.lineWidth = 1.5*s;
  for (let f = 1; f <= 6; f++) {
    const t = f / 7;
    ctx.beginPath();
    ctx.moveTo(cx - TW*0.45 + t*TW*0.90, cy-1);
    ctx.lineTo(cx - BW*0.48 + t*BW*0.96, diffTop+1);
    ctx.stroke();
  }
  // Corner cutouts
  ctx.fillStyle = '#0a0a0a';
  ctx.beginPath(); ctx.moveTo(cx-TW*0.45,cy); ctx.lineTo(cx-TW*0.45+BW*0.18,cy); ctx.lineTo(cx-BW*0.48,diffTop); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx+TW*0.45,cy); ctx.lineTo(cx+TW*0.45-BW*0.18,cy); ctx.lineTo(cx+BW*0.48,diffTop); ctx.closePath(); ctx.fill();

  // ── Two outer exhausts (Huracán style) ──
  [cx - BW*0.28, cx + BW*0.28].forEach(ex => {
    ctx.fillStyle = '#2a2a2a'; ctx.beginPath(); ctx.ellipse(ex, cy-BH*0.10, 8.5*s, 7*s, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#101010'; ctx.beginPath(); ctx.ellipse(ex, cy-BH*0.10, 5.5*s, 4.5*s, 0, 0, Math.PI*2); ctx.fill();
    ctx.shadowColor = 'rgba(255,100,30,0.4)'; ctx.shadowBlur = 4*s;
    ctx.fillStyle = '#1a0600'; ctx.beginPath(); ctx.ellipse(ex, cy-BH*0.10, 3*s, 2.4*s, 0, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
  });

  // ── Large rounded-rect tail lights — Temerario style ──
  const tlCY = cy - BH*0.60;
  const tlW  = 34*s, tlH = 13*s, tlR = 5*s;
  const tlCXL = cx - TW*0.28, tlCXR = cx + TW*0.28;

  [tlCXL, tlCXR].forEach(tlX => {
    // Housing recess
    ctx.fillStyle = '#0e0000';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(tlX - tlW/2 - 2*s, tlCY - tlH/2 - 2*s, tlW + 4*s, tlH + 4*s, tlR + 2*s);
    else ctx.rect(tlX - tlW/2 - 2*s, tlCY - tlH/2 - 2*s, tlW + 4*s, tlH + 4*s);
    ctx.fill();
    // Red fill with glow
    ctx.shadowColor = '#ff1200'; ctx.shadowBlur = 14*s;
    ctx.fillStyle = '#cc0800';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(tlX - tlW/2, tlCY - tlH/2, tlW, tlH, tlR);
    else ctx.rect(tlX - tlW/2, tlCY - tlH/2, tlW, tlH);
    ctx.fill();
    ctx.shadowBlur = 0;
    // Inner border ring
    ctx.shadowColor = '#ff4400'; ctx.shadowBlur = 6*s;
    ctx.strokeStyle = '#ff3300'; ctx.lineWidth = 2*s;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(tlX - tlW/2 + 4*s, tlCY - tlH/2 + 3*s, tlW - 8*s, tlH - 6*s, tlR - 2*s);
    else ctx.rect(tlX - tlW/2 + 4*s, tlCY - tlH/2 + 3*s, tlW - 8*s, tlH - 6*s);
    ctx.stroke();
    ctx.shadowBlur = 0;
  });

  // ── Black centre fascia between lights ──
  ctx.fillStyle = '#111111';
  ctx.fillRect(cx - BW*0.13, cy - BH*0.82, BW*0.26, BH*0.50);

  // ── Flat roof ──
  ctx.fillStyle = skin.roofColor || '#664400';
  ctx.beginPath();
  ctx.moveTo(cx-BW*0.46, cy-BH*0.83); ctx.lineTo(cx+BW*0.46, cy-BH*0.83);
  ctx.lineTo(cx+BW*0.34, y - BH*0.04); ctx.lineTo(cx-BW*0.34, y - BH*0.04);
  ctx.closePath(); ctx.fill();

  // ── Wide low rear window ──
  ctx.fillStyle = '#0c1c2e';
  ctx.beginPath();
  ctx.moveTo(cx-BW*0.33, y+BH*0.12); ctx.lineTo(cx+BW*0.33, y+BH*0.12);
  ctx.lineTo(cx+BW*0.24, y+BH*0.56); ctx.lineTo(cx-BW*0.24, y+BH*0.56);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(150,210,255,0.07)';
  ctx.beginPath();
  ctx.moveTo(cx-BW*0.31, y+BH*0.14); ctx.lineTo(cx, y+BH*0.14);
  ctx.lineTo(cx-BW*0.01, y+BH*0.36); ctx.lineTo(cx-BW*0.22, y+BH*0.36);
  ctx.closePath(); ctx.fill();

  // ── License plate ──
  if (skin && skin.plate) {
    ctx.fillStyle = '#eeeeee';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(cx - BW*0.14, y + BH*0.78, BW*0.28, BH*0.13, 2*s);
    else ctx.rect(cx - BW*0.14, y + BH*0.78, BW*0.28, BH*0.13);
    ctx.fill();
    ctx.fillStyle = '#111111';
    ctx.font = `bold ${Math.round(7*s)}px 'Courier New'`;
    ctx.textAlign = 'center';
    ctx.fillText(skin.plate, cx, y + BH*0.875);
  }

  ctx.restore();
}

// ─── Porsche GT3 RS — rear-view ──────────────────────────────────────────────
function drawPorsche(ctx, cx, cy, s, skin) {
  const TW = 132*s, BW = 116*s, BH = 72*s, bx = cx - BW/2, y = cy - BH;

  ctx.save();

  // ── Ground shadow ──
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath(); ctx.ellipse(cx, cy+2*s, TW*0.50, 6*s, 0, 0, Math.PI*2); ctx.fill();

  // ── Wheels ──
  drawWheel(ctx, cx-TW*0.455, cy-BH*0.28, s, '#888888','#aaaaaa','#555555','#666666');
  drawWheel(ctx, cx+TW*0.455, cy-BH*0.28, s, '#888888','#aaaaaa','#555555','#666666');

  // ── Wide haunches ──
  ctx.fillStyle = '#909090';
  ctx.beginPath();
  ctx.moveTo(cx-TW*0.40,cy-BH*0.21); ctx.bezierCurveTo(cx-TW*0.46,cy-BH*0.38, cx-TW*0.46,cy-BH*0.55, cx-TW*0.42,cy-BH*0.72);
  ctx.lineTo(cx-BW*0.46,y+BH*0.10); ctx.lineTo(cx+BW*0.46,y+BH*0.10);
  ctx.lineTo(cx+TW*0.42,cy-BH*0.72); ctx.bezierCurveTo(cx+TW*0.46,cy-BH*0.55, cx+TW*0.46,cy-BH*0.38, cx+TW*0.40,cy-BH*0.21);
  ctx.closePath(); ctx.fill();

  ctx.fillStyle = '#D8D8D8';
  ctx.beginPath();
  ctx.moveTo(cx-TW*0.38,cy-BH*0.22); ctx.bezierCurveTo(cx-TW*0.44,cy-BH*0.39, cx-TW*0.44,cy-BH*0.56, cx-TW*0.40,cy-BH*0.73);
  ctx.lineTo(cx-BW*0.45,y+BH*0.11); ctx.lineTo(cx+BW*0.45,y+BH*0.11);
  ctx.lineTo(cx+TW*0.40,cy-BH*0.73); ctx.bezierCurveTo(cx+TW*0.44,cy-BH*0.56, cx+TW*0.44,cy-BH*0.39, cx+TW*0.38,cy-BH*0.22);
  ctx.closePath(); ctx.fill();

  ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 2*s;
  ctx.beginPath(); ctx.moveTo(cx-TW*0.44,cy-BH*0.39); ctx.bezierCurveTo(cx-TW*0.45,cy-BH*0.55, cx-TW*0.42,cy-BH*0.68, cx-TW*0.38,cy-BH*0.74); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx+TW*0.44,cy-BH*0.39); ctx.bezierCurveTo(cx+TW*0.45,cy-BH*0.55, cx+TW*0.42,cy-BH*0.68, cx+TW*0.38,cy-BH*0.74); ctx.stroke();

  // ── Multi-fin diffuser ──
  ctx.fillStyle = '#0a0a0a';
  ctx.beginPath();
  ctx.moveTo(bx+BW*0.04,cy); ctx.lineTo(bx+BW*0.96,cy);
  ctx.lineTo(bx+BW*0.88,cy-BH*0.24); ctx.lineTo(bx+BW*0.12,cy-BH*0.24);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#1e1e1e'; ctx.lineWidth = 1.2*s;
  for (let f = 0; f < 9; f++) {
    const fx = bx + BW*0.10 + f*(BW*0.80/8);
    ctx.beginPath(); ctx.moveTo(fx, cy-1); ctx.lineTo(fx, cy-BH*0.23); ctx.stroke();
  }

  // ── Twin central square exhausts ──
  [cx - 6*s, cx + 6*s].forEach(ex => {
    ctx.fillStyle = '#2a2a2a'; ctx.fillRect(ex - 4.5*s, cy-BH*0.17, 9*s, 8*s);
    ctx.fillStyle = '#0d0d0d'; ctx.fillRect(ex - 3*s,   cy-BH*0.16, 6*s, 5.5*s);
  });

  // ── Roof ──
  ctx.fillStyle = '#707070';
  ctx.beginPath();
  ctx.moveTo(cx-BW*0.46,y+BH*0.10); ctx.lineTo(cx+BW*0.46,y+BH*0.10);
  ctx.lineTo(cx+BW*0.34,y-BH*0.04); ctx.lineTo(cx-BW*0.34,y-BH*0.04);
  ctx.closePath(); ctx.fill();

  // ── Rear window with louver stripes ──
  ctx.fillStyle = '#0c1c2e';
  ctx.beginPath();
  ctx.moveTo(cx-BW*0.28,y+BH*0.12); ctx.lineTo(cx+BW*0.28,y+BH*0.12);
  ctx.bezierCurveTo(cx+BW*0.28,y+BH*0.40, cx+BW*0.24,y+BH*0.54, cx+BW*0.20,y+BH*0.60);
  ctx.lineTo(cx-BW*0.20,y+BH*0.60);
  ctx.bezierCurveTo(cx-BW*0.24,y+BH*0.54, cx-BW*0.28,y+BH*0.40, cx-BW*0.28,y+BH*0.12);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(200,200,200,0.18)'; ctx.lineWidth = 2*s;
  for (let i = 0; i < 4; i++) {
    const ly = y + BH*(0.18 + i*0.10);
    ctx.beginPath(); ctx.moveTo(cx-BW*0.26,ly); ctx.lineTo(cx+BW*0.26,ly); ctx.stroke();
  }
  ctx.fillStyle = 'rgba(150,210,255,0.08)';
  ctx.beginPath(); ctx.moveTo(cx-BW*0.26,y+BH*0.14); ctx.lineTo(cx,y+BH*0.14); ctx.lineTo(cx-BW*0.01,y+BH*0.38); ctx.lineTo(cx-BW*0.20,y+BH*0.38); ctx.closePath(); ctx.fill();

  // ── GT3 RS badge ──
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = `bold ${Math.round(5.5*s)}px Arial`;
  ctx.textAlign = 'center';
  ctx.fillText('GT3 RS', cx, y + BH*0.49);

  // ── Full-width light bar ──
  const tlY = y + BH*0.62;
  ctx.fillStyle = '#1a0000'; ctx.fillRect(bx+BW*0.02, tlY, BW*0.96, 7*s);
  ctx.shadowColor = '#cc0000'; ctx.shadowBlur = 10*s;
  ctx.fillStyle = '#cc1100'; ctx.fillRect(bx+BW*0.03, tlY+1, BW*0.94, 4.5*s);
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(0,0,0,0.75)';
  ctx.font = `bold ${Math.round(5.5*s)}px Arial`;
  ctx.textAlign = 'center';
  ctx.fillText('PORSCHE', cx, tlY + 4*s);

  // ── Swan-neck raised spoiler ──
  const spY = y - BH*0.18;
  ctx.strokeStyle = '#222222'; ctx.lineWidth = 3*s; ctx.lineCap = 'round';
  [cx - BW*0.15, cx + BW*0.15].forEach(sx => {
    ctx.beginPath();
    ctx.moveTo(sx, y + BH*0.08);
    ctx.bezierCurveTo(sx, y - BH*0.02, sx, spY + 6*s, sx, spY + 3*s);
    ctx.stroke();
  });
  ctx.lineCap = 'butt';
  ctx.fillStyle = '#0d0d0d';
  ctx.beginPath(); ctx.moveTo(cx-BW*0.50,spY); ctx.lineTo(cx+BW*0.50,spY); ctx.lineTo(cx+BW*0.49,spY+9*s); ctx.lineTo(cx-BW*0.49,spY+9*s); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#111111';
  ctx.beginPath(); ctx.moveTo(cx-BW*0.51,spY-11*s); ctx.lineTo(cx+BW*0.51,spY-11*s); ctx.lineTo(cx+BW*0.50,spY); ctx.lineTo(cx-BW*0.50,spY); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1.2*s;
  ctx.beginPath(); ctx.moveTo(cx-BW*0.51,spY-11*s); ctx.lineTo(cx+BW*0.51,spY-11*s); ctx.stroke();
  ctx.fillStyle = '#1a1a1a';
  [[cx-BW*0.51, cx-BW*0.42],[cx+BW*0.42, cx+BW*0.51]].forEach(([x1,x2]) => {
    ctx.beginPath(); ctx.moveTo(x1,y+BH*0.08); ctx.lineTo(x1,spY-11*s); ctx.lineTo(x2,spY-11*s); ctx.lineTo(x2,y+BH*0.08); ctx.closePath(); ctx.fill();
  });

  // ── License plate ──
  if (skin && skin.plate) {
    ctx.fillStyle = '#eeeeee';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(cx - BW*0.14, y + BH*0.78, BW*0.28, BH*0.13, 2*s);
    else ctx.rect(cx - BW*0.14, y + BH*0.78, BW*0.28, BH*0.13);
    ctx.fill();
    ctx.fillStyle = '#111111';
    ctx.font = `bold ${Math.round(7*s)}px 'Courier New'`;
    ctx.textAlign = 'center';
    ctx.fillText(skin.plate, cx, y + BH*0.875);
  }

  ctx.restore();
}

// Attach custom draw functions to skin entries
CAR_SKINS[0].drawFn = drawFerrari;
CAR_SKINS[1].drawFn = drawLamborghini;
CAR_SKINS[3].drawFn = drawPorsche;

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
  const scale = Math.max(0.45, Math.min(1.0, W / 800));

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

  if (skin.drawFn) skin.drawFn(ctx, cx, cy, scale, skin);
  else drawCar(ctx, cx, cy, scale, skin, false);
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
