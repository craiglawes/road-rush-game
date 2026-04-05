const LEADERBOARD_KEY = 'roadRush_leaderboard';
const MAX_ENTRIES = 8;

function getLeaderboard() {
  try {
    const val = localStorage.getItem(LEADERBOARD_KEY);
    return val ? JSON.parse(val) : [];
  } catch(e) { return []; }
}

// Returns true if this is a personal best for the player
function submitScore(name, score) {
  const board = getLeaderboard();
  const trimmed = name.trim() || 'UNKNOWN';
  const existing = board.find(e => e.name === trimmed);
  let isPersonalBest = false;

  if (existing) {
    if (Math.floor(score) > existing.score) {
      existing.score = Math.floor(score);
      isPersonalBest = true;
    }
  } else {
    board.push({ name: trimmed, score: Math.floor(score) });
    isPersonalBest = true;
  }

  board.sort((a, b) => b.score - a.score);
  if (board.length > MAX_ENTRIES) board.length = MAX_ENTRIES;
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(board));
  return isPersonalBest;
}

// Overall best score (top of leaderboard) — used by HUD
function getHighScore() {
  const board = getLeaderboard();
  return board.length > 0 ? board[0].score : 0;
}

// Personal best for a named player
function getPersonalBest(name) {
  const trimmed = (name || '').trim();
  const entry = getLeaderboard().find(e => e.name === trimmed);
  return entry ? entry.score : 0;
}
