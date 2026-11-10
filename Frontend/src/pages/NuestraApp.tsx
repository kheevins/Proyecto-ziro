import { Layers, Palette, HardDrive, Users, BookOpen, Headphones } from 'lucide-react';

const H2 = 'font-poppins font-semibold leading-[1.2]';
const size = { fontSize: 'clamp(1.8rem, 4vw, 3rem)' };

const RESUMEN = [
  { Icon: Layers, t: 'Arquitectura Modular', d: 'Carga ultra rápida (< 1.5 segundos), organizada en módulos limpios (components/, hooks/, pages/).' },
  { Icon: Palette, t: 'Sistema de Diseño Unificado', d: 'Uso estricto de Azul Noche (#1A2538), Dorado Cátedra (#D4AF37) y Crema Santo (#FBF7EC) para que todo se vea coherente en cualquier dispositivo.' },
  { Icon: HardDrive, t: 'Guardado Local y Persistencia', d: 'Los niños pueden usar la app con autonomía: su progreso, sus trivias y sus insignias se guardan en el dispositivo.' },
];

const VERSIONES = [
  { v: '1.2.0', label: 'Versión actual · Experiencia Visual y Rendimiento', actual: true, items: [
    ['Rediseño de Interfaz (UI)', 'Integración del sistema visual Liquid Glass con tarjetas translúcidas y efectos backdrop blur.'],
    ['Gamificación Visual', 'Efectos de Golden Shimmer y Glow Pulse en botones y medallas.'],
    ['Control de Video Interactivo', 'Sincronización de video por scroll-scrubbing cuadro a cuadro.'],
    ['Ajuste de Renderizado Móvil', 'Corrección de resets CSS para navegar perfecto, sin desplazamientos horizontales.'],
  ] },
  { v: '1.1.0', label: 'Módulo de Trivias y Progreso', items: [
    ['Sistema de Evaluación Interactiva', 'Quizzes de opción múltiple con retroalimentación instantánea.'],
    ['Mecánica de Vidas y Recompensas', 'Contador de intentos para incentivar la lectura atenta.'],
    ['Medallero y Logros', 'Insignias desbloqueables: "Maestro de la Oración", "Experto en Sacramentos" y "Fidelidad Semanal".'],
    ['Contador de Racha', 'Registro de días consecutivos de aprendizaje para formar el hábito diario.'],
  ] },
  { v: '1.0.0', label: 'Lanzamiento del Núcleo Doctrinal', items: [
    ['Camino de Fe (Mapa de Ruta)', 'Recorrido secuencial por Oraciones Básicas, Mandamientos, Sacramentos y la Misa.'],
    ['Módulo de Oraciones Guiadas', 'Visor de textos bíblicos y oraciones tradicionales adaptado para lectura infantil.'],
    ['Perfil de Usuario', 'Visualización de Puntos de Experiencia (XP), nivel actual y porcentaje de avance.'],
  ] },
];

const PROXIMOS = [
  { Icon: Users, t: 'Portal de Consulta', d: 'Una herramienta pensada para que catequistas y párrocos den seguimiento a sus grupos.' },
  { Icon: BookOpen, t: 'Expansión Doctrinal', d: 'Nuevas lecciones interactivas para el segundo año de preparación.' },
  { Icon: Headphones, t: 'Repaso por Audio', d: 'Un módulo narrado para acompañar a los niños que aún se les dificulta la lectura.' },
];

export default function NuestraApp() {
  return (
    <main>
      {/* 1 · Cream 1 */}
      <section className="bg-[#FBF7EC] pt-36 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="inline-block bg-[#D4AF37] text-[#1A2538] text-[11px] font-bold tracking-widest rounded-full px-3 py-1.5 mb-5">VERSIÓN 1.2.0 ACTIVA — NÚCLEO DOCTRINAL OPERATIVO</span>
          <h1 className={`${H2} text-[#1A2538]`} style={{ fontSize: 'clamp(2rem, 4.5vw, 3.4rem)' }}>Evolución e Implementación de la Aplicación Ziro</h1>
          <div className="grid gap-6 md:grid-cols-3 mt-12">
            {RESUMEN.map(({ Icon, t, d }) => (
              <div key={t} className="glass-light p-7">
                <span className="w-11 h-11 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center mb-4"><Icon size={20} color="#D4AF37" /></span>
                <h2 className="font-poppins font-semibold text-lg text-[#1A2538] mb-2">{t}</h2>
                <p className="text-[#4A4A4A] text-sm leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2 · Slate */}
      <section className="bg-[#263149] py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className={`${H2} text-[#FBF7EC] text-center mb-12`} style={size}>Historial de Versiones</h2>
          <div className="space-y-6">
            {VERSIONES.map((r) => (
              <article key={r.v} className="liquid-glass !border-[#D4AF37]/60 p-7 md:p-9">
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <h3 className="font-poppins font-bold text-xl text-[#D4AF37]">Versión {r.v}</h3>
                  {r.actual && <span className="bg-[#D4AF37] text-[#1A2538] text-[10px] font-bold tracking-widest uppercase rounded-full px-2.5 py-1">Actual</span>}
                </div>
                <p className="text-[#FBF7EC] font-medium mb-4">{r.label}</p>
                <ul className="space-y-3 text-sm text-[#FBF7EC]/85 leading-relaxed">
                  {r.items.map(([t, d]) => (
                    <li key={t} className="flex gap-3"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0" /><span><strong className="text-[#FBF7EC]">{t}:</strong> {d}</span></li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3 · Cream 2 */}
      <section className="bg-[#FFF0DB] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className={`${H2} text-[#1A2538] text-center mb-12`} style={size}>En Desarrollo: Próximas Mejoras Planificadas</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {PROXIMOS.map(({ Icon, t, d }) => (
              <div key={t} className="glass-light p-7">
                <span className="w-11 h-11 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center mb-4"><Icon size={20} color="#D4AF37" /></span>
                <h3 className="font-poppins font-semibold text-lg text-[#1A2538] mb-2">{t}</h3>
                <p className="text-[#4A4A4A] text-sm leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
