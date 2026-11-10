import { useEffect, useRef, useState } from 'react';
import { playJump, playPickupSpark, playPickupGem, playPowerUp, playShieldBlock, playDamage, vibrate } from '@/utils/audio';

const GOLD = '#D4AF37', NAVY = '#1A2538', CREAM = '#FBF7EC', GEM = '#8FD9E8', SHADOW = '#0D1420';
const LIVES = 3, RUN_SECONDS = 90;
const MAGNET_MS = 5000, MAGNET_RADIUS = 130;
const SHADOW_CHASE_RADIUS = 200, SHADOW_CHASE_ACCEL = 90, HIT_INVULN_MS = 1200;

type Kind = 'spark' | 'gem' | 'magnet' | 'shield' | 'shadow';
interface Falling { x: number; y: number; r: number; vy: number; kind: Kind; wobble: number }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; color: string }
interface Popup { x: number; y: number; text: string; life: number }
type Phase = 'idle' | 'playing' | 'over';

export function useCazadorEstrellas(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [hud, setHud] = useState({ xp: 0, lives: LIVES, multiplier: 1, timeLeft: RUN_SECONDS, magnet: false, shield: false });

  const heroXRef = useRef(0.5); // 0..1 across the canvas width
  const heroVXRef = useRef(0);
  const jumpRef = useRef(0); // visual bounce offset
  const fallingRef = useRef<Falling[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const popupsRef = useRef<Popup[]>([]);
  const xpRef = useRef(0), livesRef = useRef(LIVES), dodgeStreakRef = useRef(0), multiplierRef = useRef(1);
  const magnetUntilRef = useRef(0), shieldRef = useRef(false), invulnUntilRef = useRef(0);
  const shakeRef = useRef(0), spawnTimerRef = useRef(0), elapsedRef = useRef(0);
  const runningRef = useRef(false);
  const rafRef = useRef(0);
  const keysRef = useRef({ left: false, right: false });

  const syncHud = () => setHud({
    xp: xpRef.current, lives: livesRef.current, multiplier: multiplierRef.current,
    timeLeft: Math.max(0, Math.ceil(RUN_SECONDS - elapsedRef.current)),
    magnet: performance.now() < magnetUntilRef.current, shield: shieldRef.current,
  });

  function start() {
    heroXRef.current = 0.5; heroVXRef.current = 0; jumpRef.current = 0;
    fallingRef.current = []; particlesRef.current = []; popupsRef.current = [];
    xpRef.current = 0; livesRef.current = LIVES; dodgeStreakRef.current = 0; multiplierRef.current = 1;
    magnetUntilRef.current = 0; shieldRef.current = false; invulnUntilRef.current = 0;
    shakeRef.current = 0; spawnTimerRef.current = 0; elapsedRef.current = 0;
    runningRef.current = true;
    setPhase('playing');
    syncHud();
  }

  function endRun() {
    runningRef.current = false;
    setPhase('over');
  }

  function dash() {
    if (!runningRef.current) return;
    jumpRef.current = 1;
    invulnUntilRef.current = performance.now() + 220;
    playJump();
    vibrate(15);
  }

  function moveTo(clientRatio: number) {
    heroXRef.current = Math.min(0.94, Math.max(0.06, clientRatio));
  }
  function nudge(dir: -1 | 1) { keysRef.current[dir < 0 ? 'left' : 'right'] = true; }
  function release(dir: -1 | 1) { keysRef.current[dir < 0 ? 'left' : 'right'] = false; }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') keysRef.current.left = true;
      if (e.key === 'ArrowRight') keysRef.current.right = true;
      if (e.key === ' ' || e.key === 'ArrowUp') dash();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') keysRef.current.left = false;
      if (e.key === 'ArrowRight') keysRef.current.right = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => { window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp); };
  }, []);

  function spawnFalling(w: number) {
    const roll = Math.random();
    let kind: Kind = 'shadow';
    if (roll < 0.5) kind = 'spark';
    else if (roll < 0.75) kind = 'gem';
    else if (roll < 0.85) kind = 'magnet';
    else if (roll < 0.93) kind = 'shield';
    fallingRef.current.push({
      x: 0.08 + Math.random() * 0.84 * w, y: -20,
      r: kind === 'gem' ? 16 : kind === 'shadow' ? 20 : 13,
      vy: 2.1 + Math.min(2.5, elapsedRef.current / 40) + Math.random() * 0.6,
      kind, wobble: Math.random() * Math.PI * 2,
    });
  }

  function burst(x: number, y: number, color: string, n = 10) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, s = 1 + Math.random() * 2.5;
      particlesRef.current.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, color });
    }
  }

  function collect(f: Falling, hero: { x: number; y: number }) {
    if (f.kind === 'spark' || f.kind === 'gem') {
      const base = f.kind === 'gem' ? 150 : 50;
      const gained = Math.round(base * multiplierRef.current);
      xpRef.current += gained;
      popupsRef.current.push({ x: f.x, y: f.y, text: `+${gained} XP!`, life: 1 });
      burst(f.x, f.y, f.kind === 'gem' ? GEM : GOLD);
      f.kind === 'gem' ? playPickupGem() : playPickupSpark();
      vibrate(f.kind === 'gem' ? [20, 30] : 12);
      dodgeStreakRef.current += 1;
      if (dodgeStreakRef.current > 0 && dodgeStreakRef.current % 8 === 0) {
        multiplierRef.current = Math.min(3, multiplierRef.current + 0.5);
        shakeRef.current = 10;
      }
    } else if (f.kind === 'magnet') {
      magnetUntilRef.current = performance.now() + MAGNET_MS;
      popupsRef.current.push({ x: f.x, y: f.y, text: 'Imán de Luz', life: 1 });
      burst(f.x, f.y, GOLD, 16); playPowerUp(); vibrate([20, 40]);
    } else if (f.kind === 'shield') {
      shieldRef.current = true;
      popupsRef.current.push({ x: f.x, y: f.y, text: 'Escudo de Fe', life: 1 });
      burst(f.x, f.y, CREAM, 16); playPowerUp(); vibrate([20, 40]);
    }
  }

  function hitShadow(f: Falling) {
    if (performance.now() < invulnUntilRef.current) return; // dashing through, no damage
    if (shieldRef.current) {
      shieldRef.current = false;
      playShieldBlock(); burst(f.x, f.y, CREAM, 14); vibrate([15, 15, 15]);
    } else {
      livesRef.current -= 1;
      dodgeStreakRef.current = 0; multiplierRef.current = 1;
      shakeRef.current = 16;
      invulnUntilRef.current = performance.now() + HIT_INVULN_MS; // brief i-frames + blink so 1 hit can't chain into 3
      playDamage(); burst(f.x, f.y, '#7a2b2b', 14); vibrate([30, 20, 30]);
      if (livesRef.current <= 0) { syncHud(); endRun(); return; }
    }
    syncHud();
  }

  useEffect(() => {
    let last = performance.now();
    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const c = canvasRef.current;
      if (!c) { rafRef.current = requestAnimationFrame(draw); return; }
      const ctx = c.getContext('2d');
      if (!ctx) { rafRef.current = requestAnimationFrame(draw); return; }
      const w = c.width, h = c.height;

      if (runningRef.current) {
        elapsedRef.current += dt;
        if (elapsedRef.current >= RUN_SECONDS) { syncHud(); endRun(); }

        // Movement: keys give velocity, drag/tap sets position directly (handled by moveTo).
        const accel = (keysRef.current.left ? -1 : 0) + (keysRef.current.right ? 1 : 0);
        heroVXRef.current = heroVXRef.current * 0.85 + accel * 0.9 * dt;
        heroXRef.current = Math.min(0.94, Math.max(0.06, heroXRef.current + heroVXRef.current));
        jumpRef.current = Math.max(0, jumpRef.current - dt * 3.2);

        spawnTimerRef.current -= dt;
        if (spawnTimerRef.current <= 0) {
          spawnFalling(w);
          spawnTimerRef.current = Math.max(0.35, 0.95 - elapsedRef.current / 140);
        }

        const heroPx = { x: heroXRef.current * w, y: h - 70 - jumpRef.current * 40 };
        const magnetOn = now < magnetUntilRef.current;
        fallingRef.current = fallingRef.current.filter((f) => {
          f.wobble += dt * 3;
          f.x += Math.sin(f.wobble) * (f.kind === 'shadow' ? 0.6 : 0.3);
          if (magnetOn && f.kind !== 'shadow') {
            const dx = heroPx.x - f.x, dy = heroPx.y - f.y, d = Math.hypot(dx, dy);
            if (d < MAGNET_RADIUS) { f.x += (dx / d) * 4; f.y += (dy / d) * 4; }
          }
          if (f.kind === 'shadow') {
            // Magnetic shadows: within 200px they gradually bend their fall toward Ziro instead of falling straight.
            const dx = heroPx.x - f.x, dy = heroPx.y - f.y, d = Math.hypot(dx, dy);
            if (d < SHADOW_CHASE_RADIUS && d > 1) {
              const pull = (1 - d / SHADOW_CHASE_RADIUS) * SHADOW_CHASE_ACCEL * dt;
              f.x += (dx / d) * pull;
              f.y += (dy / d) * pull;
            }
          }
          f.y += f.vy;
          const d = Math.hypot(f.x - heroPx.x, f.y - heroPx.y);
          if (d < f.r + 22) {
            f.kind === 'shadow' ? hitShadow(f) : collect(f, heroPx);
            return false;
          }
          if (f.y - f.r > h) {
            if (f.kind === 'shadow') { dodgeStreakRef.current += 1; }
            return false;
          }
          return true;
        });

        particlesRef.current = particlesRef.current.filter((p) => {
          p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.life -= dt * 1.6;
          return p.life > 0;
        });
        popupsRef.current = popupsRef.current.filter((p) => { p.y -= 40 * dt; p.life -= dt * 0.8; return p.life > 0; });
        if (Math.floor(elapsedRef.current * 2) !== Math.floor((elapsedRef.current - dt) * 2)) syncHud();
      }

      // ── render ──
      ctx.save();
      if (shakeRef.current > 0.2) { ctx.translate((Math.random() - 0.5) * shakeRef.current, (Math.random() - 0.5) * shakeRef.current); shakeRef.current *= 0.88; }
      ctx.fillStyle = NAVY; ctx.fillRect(-20, -20, w + 40, h + 40);
      const grad = ctx.createRadialGradient(w / 2, h * 0.3, 10, w / 2, h * 0.3, w);
      grad.addColorStop(0, 'rgba(212,175,55,0.12)'); grad.addColorStop(1, 'rgba(26,37,56,0)');
      ctx.fillStyle = grad; ctx.fillRect(-20, -20, w + 40, h + 40);
      // parallax stars
      ctx.fillStyle = 'rgba(251,247,236,0.5)';
      for (let i = 0; i < 40; i++) {
        const sx = (i * 53) % w, sy = ((i * 97 + elapsedRef.current * 26) % (h + 20));
        ctx.globalAlpha = 0.25 + (i % 4) * 0.15;
        ctx.fillRect(sx, sy, 1.6, 1.6);
      }
      ctx.globalAlpha = 1;

      for (const f of fallingRef.current) {
        if (f.kind === 'shadow') {
          ctx.beginPath(); ctx.fillStyle = SHADOW; ctx.shadowColor = '#000'; ctx.shadowBlur = 12;
          ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
        } else {
          const color = f.kind === 'gem' ? GEM : f.kind === 'magnet' ? GOLD : f.kind === 'shield' ? CREAM : GOLD;
          ctx.beginPath(); ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 14;
          ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
        }
      }
      for (const p of particlesRef.current) { ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2); ctx.fill(); }
      ctx.globalAlpha = 1;
      for (const p of popupsRef.current) { ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = GOLD; ctx.font = 'bold 13px Poppins, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(p.text, p.x, p.y); }
      ctx.globalAlpha = 1;

      // hero (Ziro): simple fox silhouette
      const hx = heroXRef.current * w, hy = h - 70 - jumpRef.current * 40;
      const isInvuln = now < invulnUntilRef.current;
      const heroAlpha = isInvuln ? (Math.floor(now / 90) % 2 === 0 ? 1 : 0.25) : 1; // ~11Hz blink while invulnerable
      ctx.globalAlpha = heroAlpha;
      const glow = now < magnetUntilRef.current ? GOLD : shieldRef.current ? CREAM : 'transparent';
      if (glow !== 'transparent') { ctx.beginPath(); ctx.strokeStyle = glow; ctx.globalAlpha = 0.6 * heroAlpha; ctx.lineWidth = 3; ctx.arc(hx, hy, 30, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = heroAlpha; }
      ctx.fillStyle = GOLD;
      ctx.beginPath(); ctx.ellipse(hx, hy, 20, 16, 0, 0, Math.PI * 2); ctx.fill(); // body
      ctx.beginPath(); ctx.moveTo(hx - 26, hy + 6); ctx.quadraticCurveTo(hx - 40, hy - 4, hx - 22, hy - 2); ctx.fill(); // tail
      ctx.beginPath(); ctx.moveTo(hx - 12, hy - 14); ctx.lineTo(hx - 20, hy - 26); ctx.lineTo(hx - 4, hy - 18); ctx.fill(); // ear L
      ctx.beginPath(); ctx.moveTo(hx + 12, hy - 14); ctx.lineTo(hx + 20, hy - 26); ctx.lineTo(hx + 4, hy - 18); ctx.fill(); // ear R
      ctx.fillStyle = NAVY; ctx.beginPath(); ctx.arc(hx - 6, hy - 2, 2, 0, Math.PI * 2); ctx.arc(hx + 6, hy - 2, 2, 0, Math.PI * 2); ctx.fill(); // eyes
      ctx.globalAlpha = 1;

      ctx.restore();
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return { phase, hud, start, dash, moveTo, nudge, release };
}
