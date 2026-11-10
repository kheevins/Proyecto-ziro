import { useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useVideoScrub } from '../../hooks/useVideoScrub';
import { useLagFreeHeroCanvas, useIsDesktop } from '../../hooks/useLagFreeHeroCanvas';

const GOLD = '#D4AF37';
const S = (i: number) => ({ transitionDelay: `${i * 120}ms` });
const HIDDEN = { opacity: 0, visibility: 'hidden' as const };

export default function HeroSequence() {
  const track = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const s1 = useRef<HTMLElement>(null), s2 = useRef<HTMLElement>(null), s3 = useRef<HTMLElement>(null);
  const desktop = useIsDesktop();
  const pRef = useLagFreeHeroCanvas({ track, canvasRef: canvas, sections: [s1, s2, s3], desktop });
  const mode = useVideoScrub(canvas, video, pRef, desktop);
  const canvasOn = desktop ? mode === 'webcodecs' : true;

  // Opacity / visibility / "on" are written straight to the DOM by useLagFreeHeroCanvas.
  const sec = (ref: React.RefObject<HTMLElement>, extra: string, style?: object) => ({
    ref, className: `absolute inset-0 flex items-center px-6 sm:px-8 md:px-20 lg:px-32 ${extra}`, style: style ?? HIDDEN,
  });
  const card = 'liquid-glass stagger p-7 md:p-12';

  return (
    <div id="home" ref={track} className="relative h-[500vh]">
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-[#1A2538]" style={{ willChange: 'transform', transform: 'translate3d(0,0,0)' }}>
        {desktop && <video ref={video} src="/assets/hero/hero-video.mp4" muted playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover" />}
        <canvas ref={canvas} width={1920} height={1080} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${canvasOn ? 'opacity-100' : 'opacity-0'}`} />

        <section {...sec(s1, 'justify-start', { opacity: 1 })}>
          <div className={`${card} max-w-2xl`}>
            <span style={S(0)} className="block text-[#D4AF37] font-semibold tracking-widest text-xs uppercase mb-4">UN COPILOTO EN LA FE</span>
            <h1 style={{ ...S(1), fontSize: 'clamp(1.9rem, 4vw, 3.6rem)' }} className="font-poppins font-bold uppercase leading-[1.1] text-[#FBF7EC]">Sembrando chispas de luz en la formación catequética</h1>
            <p style={S(2)} className="text-sm md:text-base font-poppins tracking-wide text-[#FBF7EC]/90 mt-6">Una experiencia interactiva que une el aula, el hogar y el corazón de los niños.</p>
          </div>
        </section>

        <section {...sec(s2, 'justify-center text-center')}>
          <div className={`${card} max-w-3xl`}>
            <h2 style={{ ...S(0), fontSize: 'clamp(1.8rem, 4.5vw, 3.8rem)' }} className="font-poppins font-light tracking-tight leading-[1.2] text-[#FBF7EC]">
              Ziro no digitaliza la catequesis.
              <span className="font-lora italic block mt-2" style={{ color: GOLD }}>La hace memorable.</span>
            </h2>
            <div style={S(1)} className="mt-8 flex flex-wrap justify-center gap-3">
              {['Misiones reales', 'Progreso visible', 'Copiloto pedagógico'].map((t) => (
                <span key={t} className="bg-[#263149] text-[#FBF7EC] font-poppins text-sm rounded-full px-5 py-2 border border-white/10">{t}</span>
              ))}
            </div>
          </div>
        </section>

        <section {...sec(s3, 'justify-end')}>
          <div className={`${card} max-w-2xl text-left`}>
            <p style={S(0)} className="text-[#D4AF37] font-poppins text-sm tracking-[0.25em] mb-4">HOJA DE RUTA</p>
            <h2 style={{ ...S(1), fontSize: 'clamp(2rem, 4vw, 3.5rem)' }} className="font-poppins font-semibold uppercase leading-[1.2] text-[#FBF7EC] mb-6">El camino hacia la Primera Comunión, renovado</h2>
            <p style={S(2)} className="text-white/80 font-poppins text-sm">Preparando alianzas parroquiales y catequistas piloto para transformar el aprendizaje.</p>
            <a href="#desafio" aria-label="Ir a la siguiente sección" style={S(3)} className="mt-6 inline-flex w-11 h-11 items-center justify-center rounded-full border border-[#D4AF37]/50 text-[#D4AF37] animate-bounce pointer-events-auto"><ChevronDown size={20} /></a>
          </div>
        </section>
      </div>
    </div>
  );
}
