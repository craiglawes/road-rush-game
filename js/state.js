const STATE = {
  MENU:       'MENU',
  COUNTDOWN:  'COUNTDOWN',
  PLAYING:    'PLAYING',
  PAUSED:     'PAUSED',
  GAME_OVER:  'GAME_OVER',
};

const gameState = {
  current:          STATE.MENU,
  selectedSkin:     0,
  playerName:       '',

  // Game session
  gameTime:         0,
  score:            0,
  lives:            PLAYER_LIVES,
  currentTierIndex: 0,

  // Difficulty / speed (managed by DifficultyManager)
  speed:            INITIAL_SPEED,
  spawnInterval:    INITIAL_SPAWN_INT,
  curveIntensity:   0,

  // Camera
  cameraZ:          0,

  // Player
  player: {
    lane:           1,       // 0=left 1=center 2=right
    laneProgress:   0,       // 0..1 smooth transition
    targetLane:     1,
    shieldActive:   false,
    shieldHits:     0,
    invincible:     false,
    invincibleTimer:0,
    boostActive:    false,
    boostTimer:     0,
    boostMult:      1,
    scoreMultiplier:1,
  },

  // Flash / announce
  flashTimer:       0,
  flashColor:       'rgba(255,0,0,0)',
  tierAnnounce:     null,   // { text, color, timer }
  nearMissText:     null,   // { timer }
  newHighScore:     false,

  // Countdown
  countdownValue:   3,
  countdownTimer:   0,

  // Power-up timers [{type, remaining}]
  activePowerUps:   [],

  // Next power-up spawn timer
  powerupSpawnTimer: POWERUP_SPAWN_BASE + Math.random() * POWERUP_SPAWN_RAND,
  obstacleSpawnTimer: INITIAL_SPAWN_INT,
};

function resetGameState() {
  gameState.gameTime         = 0;
  gameState.score            = 0;
  gameState.lives            = PLAYER_LIVES;
  gameState.currentTierIndex = 0;
  gameState.speed            = INITIAL_SPEED;
  gameState.spawnInterval    = INITIAL_SPAWN_INT;
  gameState.curveIntensity   = 0;
  gameState.cameraZ          = 0;
  gameState.flashTimer       = 0;
  gameState.flashColor       = 'rgba(255,0,0,0)';
  gameState.tierAnnounce     = null;
  gameState.nearMissText     = null;
  gameState.newHighScore     = false;
  gameState.activePowerUps   = [];
  gameState.powerupSpawnTimer = POWERUP_SPAWN_BASE + Math.random() * POWERUP_SPAWN_RAND;
  gameState.obstacleSpawnTimer = INITIAL_SPAWN_INT;

  const p = gameState.player;
  p.lane            = 1;
  p.laneProgress    = 0;
  p.targetLane      = 1;
  p.shieldActive    = false;
  p.shieldHits      = 0;
  p.invincible      = false;
  p.invincibleTimer = 0;
  p.boostActive     = false;
  p.boostTimer      = 0;
  p.boostMult       = 1;
  p.scoreMultiplier = 1;
}
