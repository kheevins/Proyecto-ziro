
let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    const Ctor = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctor) return null;
    if (!ctx) ctx = new Ctor();
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  } catch (e) {
    console.warn('[audio] could not create AudioContext', e);
    return null;
  }
}

function tone(freq: number, start: number, dur: number, gainPeak: number, type: OscillatorType, c: AudioContext) {
  try {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(gainPeak, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.connect(gain).connect(c.destination);
    osc.start(start);
    osc.stop(start + dur + 0.05);
  } catch (e) {
    console.warn('[audio] tone failed', e);
  }
}

function sweep(c: AudioContext, type: OscillatorType, from: number, to: number, dur: number, gainPeak: number) {
  try {
    const t = c.currentTime;
    const osc = c.createOscillator(), gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), t + dur * 0.8);
    gain.gain.setValueAtTime(gainPeak, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain).connect(c.destination);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  } catch (e) {
    console.warn('[audio] sweep failed', e);
  }
}

function chord(freqs: number[], type: OscillatorType, dur: number, gainPeak: number, stagger = 0.03) {
  const c = getCtx();
  if (!c) return;
  try {
    const t = c.currentTime;
    freqs.forEach((f, i) => tone(f, t + i * stagger, dur - i * 0.02, gainPeak, type, c));
  } catch (e) {
    console.warn('[audio] chord failed', e);
  }
}

/* ── Legacy timing-game sounds (kept for backward compatibility) ── */
export function playHarp() { chord([523.25, 659.25, 783.99], 'triangle', 0.5, 0.12); }
export function playBell() { chord([880, 1318.5, 1760], 'sine', 0.9, 0.1); }
export function playFrenzy() { chord([523.25, 659.25, 783.99, 987.77, 1174.66], 'triangle', 1.1, 0.11); }
export function playMiss() { const c = getCtx(); if (c) tone(140, c.currentTime, 0.25, 0.15, 'sawtooth', c); }

/* ── Arcade runner sounds ── */
export function playJump() { const c = getCtx(); if (c) sweep(c, 'square', 300, 650, 0.15, 0.1); }
export function playPickupSpark() { const c = getCtx(); if (c) tone(880, c.currentTime, 0.18, 0.12, 'sine', c); }
/** Alias kept for naming-convention compatibility. */
export function playSpark() { playPickupSpark(); }
export function playPickupGem() { chord([660, 990, 1320], 'triangle', 0.35, 0.11); }
/** Unified pickup helper: pass gem=true for the richer gem chime, otherwise the plain spark tone. */
export function playPickup(gem = false) { gem ? playPickupGem() : playPickupSpark(); }
export function playPowerUp() { chord([440, 554, 659, 880], 'sine', 0.4, 0.1, 0.05); }
export function playShieldBlock() { const c = getCtx(); if (c) tone(220, c.currentTime, 0.3, 0.14, 'square', c); }
export function playDamage() { const c = getCtx(); if (c) sweep(c, 'sawtooth', 180, 60, 0.32, 0.18); }
export function playChestOpen() { chord([392, 523.25, 659.25, 987.77], 'triangle', 1.2, 0.13, 0.06); }

export function vibrate(pattern: number | number[]) {
  try {
    if ('vibrate' in navigator) navigator.vibrate(pattern);
  } catch (e) {
    console.warn('[audio] vibrate failed', e);
  }
}
