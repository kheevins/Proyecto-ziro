import { useEffect, useRef, useState } from 'react';
import { Heart, Sparkles, Award, Magnet, ShieldCheck, WifiOff } from 'lucide-react';
import { useCazadorEstrellas } from '@/hooks/useCazadorEstrellas';
import { reclamarPremio, yaGanoPremioFisico, UMBRAL_PREMIO_XP, type Resultado } from '@/services/prizes';
import { guardarPuntaje, obtenerTop10, type Puntaje } from '@/services/leaderboard';
import { playChestOpen } from '@/utils/audio';

const SPONSORS = ['SkyBrill', 'Aromacielo', 'Mini Nonitas', 'Petzuki'];
const CANVAS_W = 380, CANVAS_H = 620;

/** "ZIRO: Cazador de Estrellas" — arcade runner/catcher + Bóveda de la Gracia + ranking en vivo. */
export default function Juego() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { phase, hud, start, dash, moveTo, nudge, release } = useCazadorEstrellas(canvasRef);

  const [chestOpen, setChestOpen] = useState(false);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [chestError, setChestError] = useState(false);
  const [nombre, setNombre] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [rankingError, setRankingError] = useState(false);
  const [top10, setTop10] = useState<Puntaje[] | null>(null);
  const eligible = hud.xp >= UMBRAL_PREMIO_XP;

  // Canvas sizing: only touch the element if it actually mounted, and never assume a 2D
  // context is available (some embedded/WebViews can return null for getContext).
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) { console.warn('[Juego] Canvas 2D context unavailable; game will not render.'); return; }
    c.width = CANVAS_W;
    c.height = CANVAS_H;
  }, []);

  useEffect(() => {
    if (phase !== 'over') return;
    setChestOpen(false); setResultado(null); setChestError(false);
    setGuardado(false); setNombre(''); setRankingError(false);
  }, [phase]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const top = await obtenerTop10();
        if (alive) setTop10(top);
      } catch (e) {
        console.warn('[Juego] no se pudo cargar el ranking', e);
        if (alive) { setTop10([]); setRankingError(true); }
      }
    })();
    return () => { alive = false; };
  }, []);

  async function abrirCofre() {
    if (chestOpen || claiming) return;
    setChestOpen(true); setClaiming(true); setChestError(false);
    try {
      const r = await reclamarPremio(hud.xp);
      setResultado(r);
      playChestOpen();
    } catch (e) {
      console.warn('[Juego] no se pudo abrir el Cofre de Luz', e);
      setChestError(true);
    } finally {
      setClaiming(false);
    }
  }

  async function enviarPuntaje() {
    if (!nombre.trim() || guardando) return;
    setGuardando(true); setRankingError(false);
    try {
      await guardarPuntaje({ nombre: nombre.trim(), puntaje: hud.xp });
      setGuardado(true);
      try { setTop10(await obtenerTop10()); } catch { }
    } catch (e) {
      console.warn('[Juego] no se pudo guardar el puntaje', e);
      setRankingError(true);
    } finally {
      setGuardando(false);
    }
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (phase !== 'playing') return;
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    moveTo((e.clientX - rect.left) / rect.width);
  }

  return (
    <main className="bg-[#263149]">
      {/* Hero / juego */}
      <section className="min-h-screen pt-28 pb-16 px-6 flex flex-col items-center">
        <span className="inline-block bg-[#D4AF37] text-[#1A2538] text-xs font-bold tracking-widest uppercase rounded-full px-4 py-1.5 mb-4">¡En Vivo!</span>
        <h1 className="font-poppins font-bold text-[#FBF7EC] text-center leading-[1.2]" style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3rem)' }}>Ziro: Cazador de Estrellas</h1>
        <p className="text-[#FBF7EC]/75 text-center max-w-lg mt-3">Mueve a Ziro para atrapar Chispas de Fe y Gemas del Espíritu, esquiva las Sombras de Duda y aprovecha los poderes de luz. En escritorio usa las flechas ← →, en el móvil desliza el dedo. Toca o presiona espacio para dar un salto.</p>

        <div ref={wrapRef} onPointerDown={onPointerMove} onPointerMove={onPointerMove}
          className="relative mt-8 rounded-[2rem] overflow-hidden liquid-glass !border-[#D4AF37]/50 select-none touch-none"
          style={{ width: CANVAS_W, maxWidth: '92vw' }}>
          <canvas ref={canvasRef} onClick={dash} className="block w-full h-auto cursor-pointer" style={{ aspectRatio: `${CANVAS_W}/${CANVAS_H}` }} />

          {phase === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#1A2538]/70 backdrop-blur-sm px-6 text-center">
              <p className="text-[#FBF7EC] text-sm">Consigue {UMBRAL_PREMIO_XP} Puntos de Fe para abrir la Bóveda de la Gracia con premio garantizado.</p>
              <button onClick={start} className="btn-golden-shimmer bg-[#D4AF37] text-[#1A2538] rounded-full px-7 py-3 font-bold hover:scale-105 transition-transform">Comenzar</button>
            </div>
          )}

          {phase === 'playing' && (
            <>
              <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                <div className="flex gap-1">
                  {Array.from({ length: 3 }).map((_, i) => <Heart key={i} size={18} className={i < hud.lives ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-[#FBF7EC]/25'} />)}
                </div>
                <span className="text-[#FBF7EC] text-xs font-mono bg-[#1A2538]/60 rounded-full px-2.5 py-1">{hud.timeLeft}s</span>
              </div>
              <div className="absolute top-11 inset-x-3 flex items-center justify-between pointer-events-none">
                <span className="text-[#D4AF37] font-bold text-sm bg-[#1A2538]/60 rounded-full px-3 py-1">{hud.xp} XP · x{hud.multiplier.toFixed(1)}</span>
                <div className="flex gap-1.5">
                  {hud.magnet && <span className="bg-[#D4AF37]/90 text-[#1A2538] rounded-full p-1.5"><Magnet size={13} /></span>}
                  {hud.shield && <span className="bg-[#FBF7EC]/90 text-[#1A2538] rounded-full p-1.5"><ShieldCheck size={13} /></span>}
                </div>
              </div>
              <div className="lg:hidden absolute bottom-3 inset-x-3 flex justify-between pointer-events-auto">
                <button onPointerDown={() => nudge(-1)} onPointerUp={() => release(-1)} onPointerLeave={() => release(-1)} aria-label="Izquierda" className="w-14 h-14 rounded-full bg-[#1A2538]/60 text-[#FBF7EC] text-xl flex items-center justify-center">←</button>
                <button onPointerDown={() => nudge(1)} onPointerUp={() => release(1)} onPointerLeave={() => release(1)} aria-label="Derecha" className="w-14 h-14 rounded-full bg-[#1A2538]/60 text-[#FBF7EC] text-xl flex items-center justify-center">→</button>
              </div>
            </>
          )}
        </div>

        {phase === 'over' && (
          <div className="mt-8 w-full max-w-md">
            <div className="glass-light !bg-white/10 !border-[#D4AF37]/40 p-6 text-center">
              <p className="text-[#FBF7EC]">Puntaje final</p>
              <p className="text-4xl font-bold text-[#D4AF37] my-2">{hud.xp} XP</p>

              {!chestOpen ? (
                eligible ? (
                  <button onClick={abrirCofre} className="btn-golden-shimmer mt-4 bg-[#D4AF37] text-[#1A2538] rounded-full px-7 py-3 font-bold hover:scale-105 transition-transform">Abrir la Bóveda de la Gracia</button>
                ) : (
                  <p className="text-[#FBF7EC]/70 text-sm mt-4">Te faltaron {Math.max(0, UMBRAL_PREMIO_XP - hud.xp)} Puntos de Fe para desbloquear la Bóveda de la Gracia.</p>
                )
              ) : (
                <div className="mt-5">
                  {claiming && (
                    <>
                      <div className="animate-glow-pulse mx-auto w-20 h-20 rounded-2xl bg-gradient-to-b from-[#D4AF37] to-[#8a6a1f] flex items-center justify-center text-3xl">🎁</div>
                      <p className="text-[#FBF7EC]/80 text-sm mt-3">Abriendo la Bóveda de la Gracia…</p>
                    </>
                  )}

                  {!claiming && chestError && (
                    <div className="rounded-2xl border border-[#D4AF37]/40 bg-white/5 p-5">
                      <WifiOff className="mx-auto mb-2" size={22} color="#D4AF37" />
                      <p className="text-[#FBF7EC] text-sm">No pudimos conectar con la bóveda en este momento.</p>
                      <button onClick={abrirCofre} className="mt-3 text-[#D4AF37] text-sm underline">Intentar de nuevo</button>
                    </div>
                  )}

                  {!claiming && !chestError && resultado && (
                    <div className="rounded-2xl border-2 border-[#D4AF37] bg-[#1A2538] p-5 animate-glow-pulse">
                      {resultado.tipo === 'fisico' ? (
                        <>
                          <Award className="mx-auto mb-2" size={28} color="#D4AF37" />
                          <p className="text-[#FBF7EC] font-semibold">¡Ganaste un premio físico!</p>
                          <p className="text-[#D4AF37] font-bold mt-1">{resultado.premio?.nombre}</p>
                        </>
                      ) : (
                        <>
                          <Sparkles className="mx-auto mb-2" size={28} color="#D4AF37" />
                          <p className="text-[#FBF7EC] font-semibold">Carta de Virtud desbloqueada</p>
                          <p className="text-[#D4AF37] font-bold mt-1">{resultado.carta}</p>
                          {eligible && yaGanoPremioFisico() && <p className="text-[#FBF7EC]/60 text-xs mt-2">Ya reclamaste un premio físico antes, así que esta vez te toca una carta.</p>}
                        </>
                      )}
                      <p className="text-[#FBF7EC]/60 text-xs mt-3">Código de verificación</p>
                      <p className="text-[#FBF7EC] font-mono tracking-widest text-sm">{resultado.codigo}</p>
                      <p className="text-[#FBF7EC]/60 text-xs mt-3">Presenta este código en el punto Ziro del evento.</p>
                    </div>
                  )}
                </div>
              )}

              {!guardado ? (
                <div className="mt-6">
                  <div className="flex gap-2">
                    <input value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={40} placeholder="Tu nombre para el ranking"
                      className="flex-1 rounded-xl bg-white/10 border border-white/20 px-3 py-2.5 text-sm text-[#FBF7EC] placeholder:text-[#FBF7EC]/50 focus:outline-none focus:border-[#D4AF37]" />
                    <button onClick={enviarPuntaje} disabled={!nombre.trim() || guardando} className="bg-[#D4AF37] text-[#1A2538] rounded-xl px-4 py-2.5 text-sm font-bold disabled:opacity-50">
                      {guardando ? '...' : 'Enviar'}
                    </button>
                  </div>
                  {rankingError && <p className="text-[#FBF7EC]/60 text-xs mt-2">No pudimos guardar tu puntaje. Revisa tu conexión e inténtalo de nuevo.</p>}
                </div>
              ) : (
                <p className="text-[#D4AF37] text-sm mt-6">¡Tu puntaje ya está en el Ranking Global!</p>
              )}
              <button onClick={start} className="mt-4 text-[#FBF7EC]/70 text-sm underline hover:text-[#FBF7EC]">Jugar de nuevo</button>
            </div>
          </div>
        )}
      </section>

      {/* Ranking */}
      <section className="bg-[#1A2538] py-20 px-6">
        <div className="max-w-lg mx-auto">
          <h2 className="font-poppins font-semibold text-[#FBF7EC] text-center mb-8" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}>Top 10 Guardianes de Luz</h2>
          <div className="liquid-glass !border-[#D4AF37]/40 p-3">
            {top10 === null ? (
              <p className="text-[#FBF7EC]/60 text-center py-6 text-sm">Cargando ranking…</p>
            ) : top10.length === 0 ? (
              <p className="text-[#FBF7EC]/60 text-center py-6 text-sm">{rankingError ? 'No pudimos cargar el ranking. Vuelve a intentarlo más tarde.' : 'Sé el primero en aparecer aquí.'}</p>
            ) : (
              <ol className="divide-y divide-white/10">
                {top10.map((p, i) => (
                  <li key={i} className="flex items-center justify-between px-4 py-3">
                    <span className="flex items-center gap-3 text-[#FBF7EC]"><span className="w-6 text-[#D4AF37] font-bold">{i + 1}</span>{p.nombre}</span>
                    <span className="text-[#D4AF37] font-semibold">{p.puntaje} XP</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <section className="bg-[#FFF0DB] py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#D4AF37] font-semibold text-xs tracking-widest uppercase mb-6">Premios del evento, gracias a</p>
          <div className="flex flex-wrap justify-center gap-4">
            {SPONSORS.map((s) => (
              <span key={s} className="glass-light !bg-white/80 flex items-center gap-2 px-5 py-3 text-[#1A2538] font-semibold"><Award size={16} color="#D4AF37" />{s}</span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
