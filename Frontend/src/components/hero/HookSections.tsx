import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const tab = (on: boolean) =>
  `px-5 py-3 rounded-full font-poppins text-sm transition-all duration-300 ${
    on ? 'bg-[#D4AF37] text-[#1A2538] font-bold shadow-lg shadow-[#D4AF37]/40' : 'opacity-50 text-[#4A4A4A]/60 font-medium hover:opacity-80'
  }`;
const H2 = 'font-poppins font-semibold text-[#1A2538] leading-[1.2]';
const h2Size = { fontSize: 'clamp(1.8rem, 4vw, 3.2rem)' };

/* ───────── Hook 1: método tradicional vs. Ziro ───────── */
function MethodSwitch() {
  const [mode, setMode] = useState<'trad' | 'ziro'>('trad');
  return (
    <section id="desafio" className="bg-[#FBF7EC] py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-[#D4AF37] font-semibold text-xs tracking-widest uppercase">¿Por qué Ziro?</span>
        <h2 className={`${H2} mt-4`} style={h2Size}>Los niños de hoy son nativos digitales. La catequesis tradicional no puede quedarse en papel.</h2>

        <div role="tablist" aria-label="Comparar métodos" className="glass-light !rounded-full inline-flex p-1.5 gap-1 mt-10">
          <button role="tab" aria-selected={mode === 'trad'} onClick={() => setMode('trad')} className={tab(mode === 'trad')}>Método Tradicional</button>
          <button role="tab" aria-selected={mode === 'ziro'} onClick={() => setMode('ziro')} className={tab(mode === 'ziro')}>Experiencia con Ziro</button>
        </div>

        <div key={mode} className="fade-in mt-8 text-left">
          {mode === 'trad' ? (
            <div className="rounded-3xl bg-white/50 border border-[#4A4A4A]/15 p-8 md:p-10">
              <h3 className="font-poppins font-semibold text-xl text-[#1A2538] mb-4">El Problema</h3>
              <ul className="space-y-3 text-[#4A4A4A] text-sm md:text-base">
                {['Materiales físicos pesados y desorganizados.', 'Aprendizaje pasivo: escuchar y copiar.', 'Poco compromiso fuera de la clase.'].map((t) => (
                  <li key={t} className="flex gap-3"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#4A4A4A]/40 shrink-0" />{t}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="relative rounded-3xl bg-white/70 backdrop-blur-md border-2 border-[#D4AF37] shadow-[0_0_40px_rgba(212,175,55,0.35)] p-8 md:p-10">
              <span className="inline-block bg-[#D4AF37] text-[#1A2538] text-[11px] font-bold tracking-widest rounded-full px-3 py-1 mb-4">GAMIFICACIÓN CON PROPÓSITO</span>
              <h3 className="font-poppins font-semibold text-xl text-[#1A2538] mb-4">Nuestra Respuesta</h3>
              <ul className="space-y-3 text-[#4A4A4A] text-sm md:text-base">
                {['Misiones cotidianas que llevan la fe a la vida real.', 'Progreso visible y recompensas que motivan.', 'Familia y catequista conectados en un mismo camino.'].map((t) => (
                  <li key={t} className="flex gap-3"><Check size={18} className="text-[#D4AF37] shrink-0 mt-0.5" />{t}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ───────── Hook 2: simulador de misión por rol ───────── */
type Role = 'nino' | 'familia' | 'catequista';
const ROLES: { id: Role; label: string }[] = [
  { id: 'nino', label: '🧒 El Niño' }, { id: 'familia', label: '🏠 La Familia' }, { id: 'catequista', label: '✝️ El Catequista' },
];
const DASH = [['Misiones completadas', 72], ['Asistencia', 88], ['Participación familiar', 64]] as const;

function MissionSimulator() {
  const [role, setRole] = useState<Role>('nino');
  const [done, setDone] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  return (
    <section id="experiencia" className="bg-[#FFF0DB] py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className={H2} style={h2Size}>Una experiencia que une a niños, familias y catequistas.</h2>
        <div role="tablist" aria-label="Elige un rol" className="glass-light !rounded-full inline-flex flex-wrap justify-center p-1.5 gap-1 mt-10">
          {ROLES.map((r) => (
            <button key={r.id} role="tab" aria-selected={role === r.id} onClick={() => setRole(r.id)} className={tab(role === r.id)}>{r.label}</button>
          ))}
        </div>

        <div key={role} className="fade-in glass-light relative mt-8 p-8 md:p-10 text-left">
          {role === 'nino' && (
            <>
              <span className={`absolute -top-4 right-6 bg-[#D4AF37] text-[#1A2538] font-bold text-sm rounded-full px-4 py-2 shadow-lg shadow-[#D4AF37]/50 transition-all duration-500 ${done ? 'opacity-100 scale-100 -translate-y-1' : 'opacity-0 scale-75 translate-y-2 pointer-events-none'}`}>+50 Puntos de Fe</span>
              <p className="text-[#D4AF37] font-semibold text-xs tracking-widest uppercase mb-2">Vista previa · Misión</p>
              <h3 className="font-poppins font-semibold text-xl text-[#1A2538]">Misión: Cadena de Favores</h3>
              <p className="text-[#4A4A4A] text-sm mt-2 mb-6">Haz un favor a alguien de tu casa hoy, sin que te lo pidan.</p>
              <button role="checkbox" aria-checked={done} onClick={() => setDone((d) => !d)} className={`w-full flex items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-colors ${done ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-[#4A4A4A]/20 bg-white/60 hover:border-[#D4AF37]'}`}>
                <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${done ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-[#4A4A4A]/40'}`}>{done && <Check size={14} className="text-[#1A2538]" />}</span>
                <span className="text-[#1A2538] text-sm font-medium">Ayudé a alguien de mi familia</span>
              </button>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-3 flex-1 rounded-full bg-[#4A4A4A]/15 overflow-hidden"><div className="h-full rounded-full bg-[#D4AF37] transition-[width] duration-700 ease-out" style={{ width: done ? '100%' : '0%' }} /></div>
                <span className="text-xs font-semibold text-[#1A2538] w-10 text-right">{done ? '100%' : '0%'}</span>
              </div>
            </>
          )}
          {role === 'familia' && (
            <>
              <p className="text-[#D4AF37] font-semibold text-xs tracking-widest uppercase mb-2">Vista previa · Reto familiar</p>
              <h3 className="font-poppins font-semibold text-xl text-[#1A2538]">Momento de Oración Nocturna</h3>
              <p className="text-[#4A4A4A] text-sm mt-2 mb-6">Antes de dormir, reúnanse cinco minutos y agradezcan juntos por el día.</p>
              <button role="switch" aria-checked={confirmed} onClick={() => setConfirmed((c) => !c)} className={`inline-flex items-center gap-3 rounded-full px-6 py-3 font-poppins text-sm font-bold transition-all ${confirmed ? 'bg-[#D4AF37] text-[#1A2538] shadow-lg shadow-[#D4AF37]/40' : 'border-2 border-[#D4AF37] text-[#1A2538] hover:bg-[#D4AF37]/10'}`}>
                {confirmed && <Check size={16} />}{confirmed ? 'Confirmado en familia' : 'Confirmar en Familia'}
              </button>
            </>
          )}
          {role === 'catequista' && (
            <>
              <p className="text-[#D4AF37] font-semibold text-xs tracking-widest uppercase mb-2">Vista previa · Panel del copiloto</p>
              <h3 className="font-poppins font-semibold text-xl text-[#1A2538] mb-1">Grupo de Primera Comunión</h3>
              <p className="text-[#4A4A4A]/70 text-xs mb-6">Datos de ejemplo</p>
              <div className="space-y-4">
                {DASH.map(([l, v]) => (
                  <div key={l}>
                    <div className="flex justify-between text-sm text-[#4A4A4A] mb-1"><span>{l}</span><span className="font-semibold text-[#1A2538]">{v}%</span></div>
                    <div className="h-2.5 rounded-full bg-[#4A4A4A]/15 overflow-hidden"><div className="h-full rounded-full bg-[#D4AF37]" style={{ width: `${v}%` }} /></div>
                  </div>
                ))}
              </div>
              <p className="mt-6 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-4 py-3 text-sm text-[#1A2538]"><strong>Copiloto:</strong> 3 niños podrían necesitar refuerzo esta semana.</p>
            </>
          )}
        </div>

        <div className="glass-light mt-16 mx-auto max-w-2xl p-10 text-center">
          <p className="font-poppins text-xl text-[#1A2538] mb-6">¿Quieres descubrir la plataforma completa?</p>
          <Link to="/nuestra-app" className="inline-block bg-[#D4AF37] text-[#1A2538] rounded-full px-8 py-4 font-bold hover:scale-105 transition-transform">Conocer Acerca de la App</Link>
        </div>
      </div>
    </section>
  );
}

export default function HookSections() {
  return (
    <>
      <MethodSwitch />
      <MissionSimulator />
    </>
  );
}
