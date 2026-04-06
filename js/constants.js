// ─── Road ────────────────────────────────────────────────────────────────────
const SEGMENT_LENGTH  = 200;   // world units per segment
const NUM_SEGMENTS    = 200;   // total segments in the loop
const DRAW_DISTANCE   = 100;   // how many segments to draw ahead
const ROAD_WIDTH      = 2000;  // world units, full road width
const NUM_LANES       = 3;
const LANE_WIDTH      = ROAD_WIDTH / NUM_LANES;
const CAMERA_HEIGHT   = 1000;  // world units above road
const FOV_DEGREES     = 100;
const CAMERA_DEPTH    = 1 / Math.tan((FOV_DEGREES / 2) * Math.PI / 180);

// ─── Difficulty ──────────────────────────────────────────────────────────────
const INITIAL_SPEED         = 420;   // world units / second
const MAX_SPEED             = 1500;  // ceiling reached ~75s
const SPEED_RAMP_RATE       = 18;    // ramp up faster through medium/hard
const INITIAL_SPAWN_INT     = 1.4;   // seconds between obstacle spawns
const MIN_SPAWN_INT         = 0.25;  // dense traffic at INSANE
const SPAWN_RAMP_RATE       = 0.015; // faster spawn ramp — hits minimum ~75s
const CURVE_START_TIME      = 55;    // seconds before curves appear
const MAX_CURVE_INTENSITY   = 0.8;

const DIFFICULTY_TIERS = [
  { time:   0, name: 'EASY',   color: '#44ee44' },
  { time:  15, name: 'MEDIUM', color: '#ffee00' },
  { time:  35, name: 'HARD',   color: '#ff8800' },
  { time:  65, name: 'INSANE', color: '#ff2222' },
];

// ─── Player ──────────────────────────────────────────────────────────────────
const PLAYER_LIVES          = 3;
const LANE_CHANGE_SPEED     = 4.5; // lanes per second
const INVINCIBILITY_TIME    = 1.8; // seconds after a crash
const COLLISION_Z_THRESHOLD = SEGMENT_LENGTH * 2;   // start checking this far ahead
const COLLISION_Z_MIN       = SEGMENT_LENGTH * 1.2;  // stop checking once car has visually passed player
const COLLISION_LANE_THRESH = 0.72;

// ─── Score ───────────────────────────────────────────────────────────────────
const SCORE_RATE            = 0.01;  // score per (speed * dt)
const SCORE_NEAR_MISS       = 50;
const SCORE_TIER_BONUS      = 250;
const SCORE_BOOST_MULT      = 1.5;
const NEAR_MISS_THRESH      = 1.2;   // lane distance for near-miss

// ─── Power-ups ───────────────────────────────────────────────────────────────
const POWERUP_SPAWN_BASE    = 18;    // base seconds between power-up spawns
const POWERUP_SPAWN_RAND    = 10;    // random extra seconds (0..this)
const POWERUP_POOL_SIZE     = 5;

const POWERUP_TYPES = {
  SPEED_BOOST: {
    id:       'SPEED_BOOST',
    label:    'BOOST',
    symbol:   '⚡',
    color:    '#ffdd00',
    glow:     '#ffaa00',
    duration: 5,
    scoreMultiplier: SCORE_BOOST_MULT,
    speedMultiplier: 1.55,
  },
  SHIELD: {
    id:       'SHIELD',
    label:    'SHIELD',
    symbol:   '🛡',
    color:    '#44aaff',
    glow:     '#0088ff',
    duration: 8,
    hits:     2,
  },
  EXTRA_LIFE: {
    id:       'EXTRA_LIFE',
    label:    '+LIFE',
    symbol:   '❤',
    color:    '#ff4488',
    glow:     '#cc0055',
    duration: 0, // instant
  },
};

// ─── Car Skins ───────────────────────────────────────────────────────────────
const CAR_SKINS = [
  { name: 'Ferrari',     body: '#CC2200', bodyDark: '#881400', roofColor: '#770e00', bodyHighlight: 'rgba(255,140,100,0.3)', tailLight: '#ff2200', wingColor: '#CC2200', wingAccentColor: '#ffffff',  stripe: 'rgba(255,255,255,0.9)', plate: 'FXX' },
  { name: 'Lamborghini', body: '#FFB800', bodyDark: '#996600', roofColor: '#664400', bodyHighlight: 'rgba(255,230,80,0.3)',  tailLight: '#ff6600', wingColor: '#111111', wingAccentColor: '#FFB800',  stripe: null,                    plate: 'SV'  },
  { name: 'Bugatti',     body: '#1133CC', bodyDark: '#001188', roofColor: '#000d66', bodyHighlight: 'rgba(80,130,255,0.3)',  tailLight: '#ff2200', wingColor: '#C0C0C0', wingAccentColor: '#1133CC',  stripe: 'rgba(192,192,192,0.75)',  plate: 'EB110' },
  { name: 'Porsche',     body: '#D8D8D8', bodyDark: '#909090', roofColor: '#707070', bodyHighlight: 'rgba(255,255,255,0.3)', tailLight: '#ff2200', wingColor: '#cc4400', wingAccentColor: '#D8D8D8',  stripe: null,                    plate: 'GT911' },
  { name: 'McLaren',     body: '#FF6600', bodyDark: '#993300', roofColor: '#552200', bodyHighlight: 'rgba(255,180,80,0.3)',  tailLight: '#ff4400', wingColor: '#111111', wingAccentColor: '#FF6600',  stripe: null,                    plate: 'P1'  },
  { name: 'Aston',       body: '#004422', bodyDark: '#002211', roofColor: '#001a0d', bodyHighlight: 'rgba(0,180,80,0.2)',    tailLight: '#ff2200', wingColor: '#C0C0C0', wingAccentColor: '#004422',  stripe: 'rgba(192,192,192,0.6)',  plate: 'DB12' },
];

// Obstacle car palettes (muted so they don't compete with player)
const OBSTACLE_PALETTES = [
  { name: '', body: '#787878', bodyDark: '#484848', roofColor: '#383838', bodyHighlight: 'rgba(255,255,255,0.08)', tailLight: '#bb1100', wingColor: '#484848', wingAccentColor: null, stripe: null, plate: '' },
  { name: '', body: '#664422', bodyDark: '#442211', roofColor: '#331a0d', bodyHighlight: 'rgba(255,200,150,0.08)', tailLight: '#bb1100', wingColor: '#442211', wingAccentColor: null, stripe: null, plate: '' },
  { name: '', body: '#224433', bodyDark: '#112211', roofColor: '#0d1a0d', bodyHighlight: 'rgba(100,200,150,0.08)', tailLight: '#bb1100', wingColor: '#112211', wingAccentColor: null, stripe: null, plate: '' },
  { name: '', body: '#443355', bodyDark: '#221133', roofColor: '#1a0d22', bodyHighlight: 'rgba(150,100,200,0.08)', tailLight: '#bb1100', wingColor: '#221133', wingAccentColor: null, stripe: null, plate: '' },
  { name: '', body: '#554433', bodyDark: '#332211', roofColor: '#221a0d', bodyHighlight: 'rgba(200,180,100,0.08)', tailLight: '#bb1100', wingColor: '#332211', wingAccentColor: null, stripe: null, plate: '' },
];

// ─── Colors ──────────────────────────────────────────────────────────────────
const COLOR = {
  SKY_TOP:     '#1a1a2e',
  SKY_MID:     '#16213e',
  SKY_HORIZON: '#e85d04',
  GRASS_LIGHT: '#2d5a27',
  GRASS_DARK:  '#1e3d1a',
  ROAD_LIGHT:  '#555566',
  ROAD_DARK:   '#444455',
  RUMBLE_RED:  '#cc2200',
  RUMBLE_WHITE:'#ffffff',
  LANE_DASH:   '#ccccaa',
};
