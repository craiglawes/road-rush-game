// ─── UI Module ───────────────────────────────────────────────────────────────

let skinPreviewCtx = null;

function initUI() {
  const previewCanvas = document.getElementById('skin-preview');
  skinPreviewCtx = previewCanvas.getContext('2d');
  drawSkinPreview();

  document.getElementById('skin-prev').addEventListener('click', () => {
    gameState.selectedSkin = (gameState.selectedSkin - 1 + CAR_SKINS.length) % CAR_SKINS.length;
    drawSkinPreview();
  });
  document.getElementById('skin-next').addEventListener('click', () => {
    gameState.selectedSkin = (gameState.selectedSkin + 1) % CAR_SKINS.length;
    drawSkinPreview();
  });

  // Name input — sync to gameState and force uppercase display
  const nameInput = document.getElementById('player-name-input');
  nameInput.addEventListener('input', () => {
    nameInput.value = nameInput.value.toUpperCase();
    gameState.playerName = nameInput.value.trim();
  });
  // Allow keyboard events to reach the input without triggering game controls
  nameInput.addEventListener('keydown', e => e.stopPropagation());
  nameInput.addEventListener('keyup',   e => e.stopPropagation());

  document.getElementById('btn-start').addEventListener('click', () => {
    const name = document.getElementById('player-name-input').value.trim();
    if (!name) {
      document.getElementById('player-name-input').focus();
      document.getElementById('player-name-input').style.borderColor = '#ff2200';
      setTimeout(() => document.getElementById('player-name-input').style.borderColor = '', 800);
      return;
    }
    gameState.playerName = name;
    startCountdown();
  });

  document.getElementById('btn-restart').addEventListener('click', () => {
    showScreen('screen-menu');
    renderLeaderboard('menu-lb-rows');
  });
}

// ─── Leaderboard rendering ───────────────────────────────────────────────────
async function renderLeaderboard(containerId) {
  const container = document.getElementById(containerId);
  const currentPlayer = gameState.playerName.trim();

  // Show loading state immediately
  container.innerHTML = '<p class="lb-empty lb-loading">LOADING...</p>';

  // Try Supabase with a 3-second timeout, fall back to localStorage
  let board = null;
  if (typeof fetchLeaderboard === 'function') {
    const timeout = new Promise(resolve => setTimeout(() => resolve(null), 3000));
    board = await Promise.race([fetchLeaderboard(), timeout]);
  }
  if (!board || board.length === 0) board = getLeaderboard();

  if (!board || board.length === 0) {
    container.innerHTML = '<p class="lb-empty">NO SCORES YET — BE THE FIRST!</p>';
    return;
  }

  const medals = ['🥇', '🥈', '🥉'];
  const rankLabels = ['gold', 'silver', 'bronze'];
  container.innerHTML = board.map((entry, i) => {
    const rankClass = rankLabels[i] || '';
    const medal = medals[i] || `${i + 1}.`;
    const isYou = entry.name === currentPlayer;
    return `
      <div class="lb-row">
        <span class="lb-rank ${rankClass}">${medal}</span>
        <span class="lb-name ${isYou ? 'current-player' : ''}">${entry.name}${isYou ? ' ◀' : ''}</span>
        <span class="lb-score">${entry.score.toString().padStart(7, '0')}</span>
      </div>`;
  }).join('');
}

// ─── Skin carousel ───────────────────────────────────────────────────────────
function drawSkinPreview() {
  const pc = document.getElementById('skin-preview');
  const pctx = pc.getContext('2d');
  pctx.clearRect(0, 0, pc.width, pc.height);
  pctx.fillStyle = '#1a1a2e';
  pctx.fillRect(0, 0, pc.width, pc.height);

  const skin = CAR_SKINS[gameState.selectedSkin];
  if (skin.drawFn) skin.drawFn(pctx, pc.width / 2, pc.height - 6, 0.62, skin);
  else drawCar(pctx, pc.width / 2, pc.height - 6, 0.62, skin, false);
  document.getElementById('skin-name').textContent = skin.name.toUpperCase();

  const dotsEl = document.getElementById('skin-dots');
  dotsEl.innerHTML = '';
  for (let i = 0; i < CAR_SKINS.length; i++) {
    const dot = document.createElement('span');
    dot.className = 'skin-dot' + (i === gameState.selectedSkin ? ' active' : '');
    dotsEl.appendChild(dot);
  }
}

// ─── Screen management ───────────────────────────────────────────────────────
function showScreen(id) {
  ['screen-menu', 'screen-gameover'].forEach(s => {
    document.getElementById(s).style.display = 'none';
  });
  if (id) document.getElementById(id).style.display = 'flex';
}

async function showGameOver() {
  const isPersonalBest = submitScore(gameState.playerName, gameState.score);
  gameState.newHighScore = isPersonalBest;

  document.getElementById('go-score').textContent =
    Math.floor(gameState.score).toString().padStart(7, '0');
  document.getElementById('go-best').textContent =
    getPersonalBest(gameState.playerName).toString().padStart(7, '0');

  document.getElementById('go-newhigh').style.display = isPersonalBest ? 'block' : 'none';

  // Show screen first so player isn't staring at a blank — leaderboard fills in async
  showScreen('screen-gameover');
  await renderLeaderboard('go-lb-rows');
}

function startCountdown() {
  showScreen(null);
  resetGameState();
  initObstacles();
  initPowerups();
  buildSegments();
  initScenery(W, H);
  gameState.current        = STATE.COUNTDOWN;
  gameState.countdownValue = 3;
  gameState.countdownTimer = 1.0;
  startEngine();
}

function endGame() {
  gameState.current = STATE.GAME_OVER;
  stopEngine();
  setTimeout(showGameOver, 600);
}

// ─── Canvas countdown ────────────────────────────────────────────────────────
function drawCountdown(ctx, W, H) {
  const val = gameState.countdownValue;
  const label = val > 0 ? String(val) : 'GO!';
  const color = val > 0 ? '#ffffff' : '#ffdd00';
  ctx.save();
  ctx.fillStyle    = color;
  ctx.font         = `bold ${Math.round(H * 0.18)}px 'Courier New', monospace`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor  = color;
  ctx.shadowBlur   = 30;
  ctx.fillText(label, W / 2, H / 2);
  ctx.restore();
}
