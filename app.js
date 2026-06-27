const sounds = {};

function preload() {
  ['this-is','start','ear','hand','feet','nose','tummy','byebye','quit'].forEach(name => {
    const a = new Audio(`assets/sounds/${name}.wav`);
    a.preload = 'auto';
    sounds[name] = a;
  });
}

function playSound(name) {
  return new Promise(resolve => {
    const a = sounds[name];
    if (!a) { resolve(); return; }
    a.currentTime = 0;
    a.onended = resolve;
    a.onerror = resolve;
    a.play().catch(resolve);
  });
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ── Splash ──
async function initSplash() {
  const btn = document.getElementById('start-btn');
  btn.classList.add('hidden');

  await playSound('this-is');
  btn.classList.remove('hidden');
  playSound('start');

  btn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    showScreen('game-screen');
  }, { once: true, passive: false });

  btn.addEventListener('click', () => {
    showScreen('game-screen');
  }, { once: true });
}

// ── Game ──
function initGame() {
  const bubble   = document.getElementById('bubble');
  const bubbleTxt = document.getElementById('bubble-text');
  let hideTimer  = null;
  let busy       = false;

  function showBubble(label) {
    clearTimeout(hideTimer);
    bubbleTxt.textContent = label;
    bubble.classList.remove('hidden');
    // Re-trigger pop animation
    bubble.style.animation = 'none';
    bubble.offsetHeight;
    bubble.style.animation = '';
    hideTimer = setTimeout(() => bubble.classList.add('hidden'), 2800);
  }

  document.querySelectorAll('.hotspot').forEach(hs => {
    async function onTap(e) {
      e.preventDefault();
      if (busy) return;
      busy = true;
      showBubble(hs.dataset.label);
      await playSound(hs.dataset.sound);
      busy = false;
    }
    hs.addEventListener('click', onTap);
    hs.addEventListener('touchstart', onTap, { passive: false });
  });

  // Quit button — hover plays quit sound, click/touch plays byebye and returns
  const quitBtn = document.getElementById('quit-btn');
  quitBtn.addEventListener('mouseenter', () => playSound('quit'));

  quitBtn.addEventListener('touchstart', async (e) => {
    e.preventDefault();
    await playSound('quit');
    await playSound('byebye');
    showScreen('splash-screen');
    setTimeout(initSplash, 400);
  }, { passive: false });

  quitBtn.addEventListener('click', async () => {
    await playSound('byebye');
    showScreen('splash-screen');
    setTimeout(initSplash, 400);
  });
}

// ── Service Worker ──
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

// ── Boot ──
preload();
initSplash();
initGame();
