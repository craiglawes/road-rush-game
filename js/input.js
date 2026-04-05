const input = {
  left:      false,
  right:     false,
  leftTap:   false, // true for one frame only — the moment key is first pressed
  rightTap:  false,
};

(function initInput() {
  document.addEventListener('keydown', e => {
    if (e.repeat) return; // ignore held-key auto-repeat
    if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') { input.left  = true; input.leftTap  = true; }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { input.right = true; input.rightTap = true; }
  });
  document.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') input.left  = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') input.right = false;
  });

  // Touch: each tap on left/right half counts as one lane change
  const canvas = document.getElementById('game');
  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    for (const t of e.changedTouches) {
      if (t.clientX < window.innerWidth / 2) { input.left  = true; input.leftTap  = true; }
      else                                    { input.right = true; input.rightTap = true; }
    }
  }, { passive: false });
  canvas.addEventListener('touchend', e => {
    e.preventDefault();
    input.left  = false;
    input.right = false;
  }, { passive: false });
})();
