let audioCtx = null;
let engine = null; // holds all engine nodes so we can stop them cleanly

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

// Soft-clip waveshaper for gritty engine texture
function makeDistortionCurve(amount) {
  const n = 512;
  const curve = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

function startEngine() {
  const ac = getAudioCtx();
  if (engine) return;

  // ── Master output gain ────────────────────────────────────────────────
  const masterGain = ac.createGain();
  masterGain.gain.value = 0.55;
  masterGain.connect(ac.destination);

  // ── Lowpass filter — warms up the tone, cuts mosquito harshness ──────
  const filter = ac.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 280;
  filter.Q.value = 2.5;
  filter.connect(masterGain);

  // ── Soft-clip distortion — adds engine grit ──────────────────────────
  const shaper = ac.createWaveShaper();
  shaper.curve = makeDistortionCurve(180);
  shaper.oversample = '2x';
  shaper.connect(filter);

  // ── Main sawtooth — the core engine tone ─────────────────────────────
  const mainOsc = ac.createOscillator();
  mainOsc.type = 'sawtooth';
  mainOsc.frequency.value = 55;
  mainOsc.connect(shaper);
  mainOsc.start();

  // ── Sub-bass sine — chest-thumping low end ───────────────────────────
  const subGain = ac.createGain();
  subGain.gain.value = 0.4;
  const subOsc = ac.createOscillator();
  subOsc.type = 'sine';
  subOsc.frequency.value = 28; // half the fundamental
  subOsc.connect(subGain);
  subGain.connect(masterGain);
  subOsc.start();

  // ── LFO amplitude modulation — simulates cylinder firing "chug" ──────
  // The LFO modulates the overall volume at the cylinder pulse rate.
  // A 4-cyl engine at idle (~800 RPM) fires at ~27Hz.
  const lfoGain = ac.createGain();
  lfoGain.gain.value = 0.35; // depth of the pulse (0 = none, 1 = full cut)
  const lfo = ac.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 27; // cylinder pulse rate at idle
  lfo.connect(lfoGain);
  lfoGain.connect(masterGain.gain); // modulate master volume
  lfo.start();

  engine = { mainOsc, subOsc, lfo, filter, masterGain };
}

function stopEngine() {
  if (!engine) return;
  // Disconnect master output first — silences everything immediately
  try { engine.masterGain.disconnect(); } catch(e) {}
  ['mainOsc', 'subOsc', 'lfo'].forEach(k => {
    try { engine[k].stop(); } catch(e) {}
  });
  engine = null;
}

function updateEngineRev(speedNormalized) {
  if (!engine || !audioCtx) return;
  const t = audioCtx.currentTime;
  const smooth = 0.15;

  // Fundamental: 55Hz idle → 160Hz at top speed
  const fundamental = 55 + speedNormalized * 105;
  engine.mainOsc.frequency.setTargetAtTime(fundamental, t, smooth);

  // Sub-bass tracks at half the fundamental
  engine.subOsc.frequency.setTargetAtTime(fundamental * 0.5, t, smooth);

  // Cylinder pulse rate tracks RPM (≈ 0.5× fundamental for 4-cyl feel)
  engine.lfo.frequency.setTargetAtTime(fundamental * 0.5, t, smooth);

  // Open up the filter as speed increases — engine gets brighter/harsher
  engine.filter.frequency.setTargetAtTime(180 + speedNormalized * 350, t, smooth);
}

function playCrash() {
  const ac = getAudioCtx();
  const duration = 0.5;
  const bufferSize = Math.floor(ac.sampleRate * duration);
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const source = ac.createBufferSource();
  source.buffer = buffer;

  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.7, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);

  // Low-pass to make it boom-y
  const filter = ac.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 600;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ac.destination);
  source.start();
}

function playPowerUp() {
  const ac = getAudioCtx();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, ac.currentTime);
  osc.frequency.exponentialRampToValueAtTime(880, ac.currentTime + 0.25);
  gain.gain.setValueAtTime(0.35, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.4);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + 0.4);
}

function playShieldHit() {
  const ac = getAudioCtx();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(600, ac.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, ac.currentTime + 0.2);
  gain.gain.setValueAtTime(0.4, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.25);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + 0.25);
}

function playTierUp() {
  const ac = getAudioCtx();
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  notes.forEach((freq, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    const t = ac.currentTime + i * 0.12;
    osc.type = 'square';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0, t);
    gain.gain.linearRampToValueAtTime(0.25, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(t);
    osc.stop(t + 0.18);
  });
}

function playCountdownBeep(isGo) {
  const ac = getAudioCtx();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = 'sine';
  osc.frequency.value = isGo ? 880 : 440;
  gain.gain.setValueAtTime(0.4, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + (isGo ? 0.5 : 0.15));
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + (isGo ? 0.5 : 0.15));
}
