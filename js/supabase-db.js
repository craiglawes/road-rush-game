// ─── Supabase Configuration ───────────────────────────────────────────────────
const SUPABASE_URL  = 'https://bwxnwzwdmagonvyghbna.supabase.co';
const SUPABASE_ANON = 'sb_publishable_mbm8MHkYpcj6niMqFAj_Xw_thiGnISx';

// ─── Client ───────────────────────────────────────────────────────────────────
let _sbClient = null;
function getClient() {
  if (!_sbClient) {
    if (typeof supabase === 'undefined' || typeof supabase.createClient !== 'function') return null;
    _sbClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
  }
  return _sbClient;
}

// ─── fetchLeaderboard ─────────────────────────────────────────────────────────
// Returns top-10 [{ name, score }] from Supabase, or null on any error.
async function fetchLeaderboard() {
  const client = getClient();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from('leaderboard')
      .select('name, score')
      .order('score', { ascending: false })
      .limit(10);
    if (error) { console.warn('[Supabase] fetch error:', error.message); return null; }
    return data;
  } catch (e) { console.warn('[Supabase] fetch exception:', e); return null; }
}

// ─── upsertScore ──────────────────────────────────────────────────────────────
// Calls a server-side Postgres function that only updates if the new score
// is strictly higher than the existing one. Safe to call fire-and-forget.
async function upsertScore(name, score) {
  const client = getClient();
  if (!client) return false;
  try {
    const { error } = await client.rpc('upsert_score_if_higher', {
      p_name:  (name || '').trim().toUpperCase() || 'UNKNOWN',
      p_score: Math.floor(score),
    });
    if (error) { console.warn('[Supabase] upsert error:', error.message); return false; }
    return true;
  } catch (e) { console.warn('[Supabase] upsert exception:', e); return false; }
}
