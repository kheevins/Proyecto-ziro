import { useState, FormEvent } from 'react';
import { Check } from 'lucide-react';
import { enviarContacto, type Contacto } from '@/services/contact.service';

const ROLES = ['Catequista', 'Párroco', 'Padre de Familia', 'Otro'];
const field = 'w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-[#FBF7EC] placeholder:text-[#FBF7EC]/50 focus:outline-none focus:border-[#D4AF37] transition-colors';
const label = 'block text-sm font-medium text-[#FBF7EC] mb-1.5';
export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const [thanks, setThanks] = useState<string | null>(null); // name of the person → shows the modal

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const g = (k: string) => String(f.get(k) ?? '').trim();
    const data: Contacto = { name: g('name'), email: g('email'), rol: g('rol'), parroquia: g('parroquia'), message: g('message') };
    setSending(true); setError(false);

    try {
      await enviarContacto(data);
      form.reset();
      setThanks(data.name);
    } catch (submitError) {
      console.error('[ContactForm] No se pudo enviar el mensaje:', submitError);
      setError(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} className="liquid-glass p-7 md:p-10 grid gap-5 text-left">
        <div className="grid gap-5 md:grid-cols-2">
          <div><label htmlFor="name" className={label}>Nombre completo</label><input id="nombre" name="name" required maxLength={100} autoComplete="name" className={field} placeholder="Tu nombre" /></div>
          <div><label htmlFor="email" className={label}>Correo electrónico</label><input id="email" name="email" type="email" required maxLength={120} autoComplete="email" className={field} placeholder="tucorreo@ejemplo.com" /></div>
          <div>
            <label htmlFor="rol" className={label}>¿Cuál es tu rol?</label>
            <select id="rol" name="rol" required defaultValue="" className={`${field} [&>option]:text-[#1A2538]`}>
              <option value="" disabled>Elige una opción</option>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div><label htmlFor="parroquia" className={label}>Parroquia / Ciudad</label><input id="parroquia" name="parroquia" required maxLength={120} className={field} placeholder="Ej. San José, Lima" /></div>
        </div>
        <div><label htmlFor="message" className={label}>Mensaje</label><textarea id="mensaje" name="message" required rows={5} maxLength={1500} className={field} placeholder="Cuéntanos qué te gustaría saber o cómo te gustaría sumarte." /></div>
        {error && <p role="alert" className="text-sm text-[#FBF7EC] bg-white/10 border border-[#D4AF37]/50 rounded-xl px-4 py-3">No pudimos enviar tu mensaje. Revisa tu conexión e inténtalo de nuevo en un momento.</p>}
        <button type="submit" disabled={sending} className="btn-golden-shimmer justify-self-start bg-[#D4AF37] text-[#1A2538] rounded-full px-8 py-4 font-bold hover:scale-105 transition-transform disabled:opacity-60 disabled:hover:scale-100">
          {sending ? 'Enviando…' : 'Enviar mensaje'}
        </button>
      </form>

      {thanks !== null && (
        <div role="dialog" aria-modal="true" aria-labelledby="gracias" onClick={() => setThanks(null)} className="fixed inset-0 z-[200] bg-[#1A2538]/70 backdrop-blur-sm flex items-center justify-center px-6">
          <div onClick={(e) => e.stopPropagation()} className="fade-in max-w-md w-full rounded-3xl bg-[#FBF7EC] border-2 border-[#D4AF37] p-8 text-center shadow-[0_0_40px_rgba(212,175,55,0.35)]">
            <span className="mx-auto mb-4 w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center"><Check size={24} className="text-[#1A2538]" /></span>
            <h3 id="gracias" className="font-poppins font-semibold text-xl text-[#1A2538]">¡Mensaje enviado con éxito!</h3>
            <p className="text-[#4A4A4A] text-sm mt-2">Nos pondremos en contacto contigo pronto.</p>
            <button autoFocus onClick={() => setThanks(null)} className="mt-6 bg-[#D4AF37] text-[#1A2538] rounded-full px-6 py-3 font-bold text-sm hover:scale-105 transition-transform">Cerrar</button>
          </div>
        </div>
      )}
    </>
  );
}
