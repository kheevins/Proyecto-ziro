import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Eye, Rocket, Target } from 'lucide-react';
import ContactForm from '../components/contact/ContactForm';

const VIDEO_ID = 'Urv2BfoavfE';
const H2 = 'font-poppins font-semibold leading-[1.2]';
const size = { fontSize: 'clamp(1.8rem, 4vw, 3rem)' };

const HORIZONTE = [
  { Icon: Eye, t: 'Visión', d: 'Ser una herramienta digital referente que transforme la forma en que los niños viven su formación en la fe, conectando tradición y tecnología de manera cercana y significativa.' },
  { Icon: Rocket, t: 'Misión', d: 'Acercar a los niños a la fe de forma divertida e interactiva, usando tecnología y juegos que les permitan aprender y vivir su camino hacia la Primera Comunión junto a sus familias.' },
  { Icon: Target, t: 'Objetivo', d: 'Fortalecer el aprendizaje y la vivencia de la fe en los niños, mediante una experiencia digital que los motive a participar activamente en su proceso de Primera Comunión.' },
];

export default function SobreZiro() {
  const location = useLocation();

  useEffect(() => {
    if (window.location.hash === '#contacto') {
      // Small delay lets the page's sections render/layout before we measure scroll position.
      const t = setTimeout(() => {
        document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
      return () => clearTimeout(t);
    }
  }, [location.pathname, location.hash]);

  return (
    <main>
      {/* 1 · Cream 1 */}
      <section className="bg-[#FBF7EC] pt-36 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className={`${H2} text-[#1A2538]`} style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)' }}>La historia</h1>
          <div className="glass-light mt-8 p-8 md:p-10">
            <h2 className="font-poppins font-semibold text-xl text-[#D4AF37] mb-4">Ziro: Una Semilla de Luz en el Mundo Digital</h2>
            <p className="text-[#4A4A4A] leading-relaxed">Cuenta la historia que, al terminar el universo, Dios guardó una chispa de inspiración que tomó la forma de un pequeño zorro: Ziro, cuyo nombre significa 'Semilla de Luz'. Enviado a la Tierra con una misión especial, Ziro decidió quedarse en los senderos invisibles de la imaginación y el mundo digital. Su propósito es encender la chispa de la fe en los más jóvenes, recordándoles en cada reto y aventura que nunca están solos y que toda buena idea viene de la Luz.</p>
          </div>
        </div>
      </section>

      {/* 2 · Slate */}
      <section className="bg-[#263149] py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className={`${H2} text-[#FBF7EC] text-center mb-8`} style={size}>El origen de Ziro</h2>
          <div className="liquid-glass !border-[#D4AF37]/60 p-3 md:p-4">
            <div className="w-full aspect-video rounded-2xl overflow-hidden">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}`}
                title="El origen de Ziro"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3 · Cream 2 */}
      <section className="bg-[#FFF0DB] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className={`${H2} text-[#1A2538] text-center mb-12`} style={size}>Nuestro Horizonte</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {HORIZONTE.map(({ Icon, t, d }) => (
              <div key={t} className="glass-light p-7">
                <span className="w-11 h-11 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center mb-4"><Icon size={20} color="#D4AF37" /></span>
                <h3 className="font-poppins font-semibold text-lg text-[#1A2538] mb-2">{t}</h3>
                <p className="text-[#4A4A4A] text-sm leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 · Slate */}
      <section id="contacto" className="bg-[#263149] py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className={`${H2} text-[#FBF7EC] text-center`} style={size}>Escríbenos</h2>
          <p className="text-[#FBF7EC]/80 text-center mt-3 mb-10">Cuéntanos de tu parroquia o de tu grupo. Nos encantará conocerte y caminar juntos.</p>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
