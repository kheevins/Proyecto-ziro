import { Link } from 'react-router-dom';
import { Mail, Instagram, Award } from 'lucide-react';
import { NAV_LINKS, ZiroLogo } from './Navbar';

const SPONSORS = ['SkyBrill', 'Aromacielo', 'Mini Nonitas', 'Petzuki'];

export default function Footer() {
  return (
    <footer className="bg-[#1A2538] text-[#FBF7EC] border-t border-[#D4AF37]/30">
      <div className="max-w-6xl mx-auto py-14 px-6 grid gap-10 md:grid-cols-3 items-start">
        <div>
          <Link to="/" className="flex items-center gap-2"><ZiroLogo /><span className="font-poppins font-bold tracking-wider text-lg">ZIRO</span></Link>
          <p className="mt-4 text-sm text-[#FBF7EC]/70 max-w-xs">Ziro no digitaliza la catequesis. La hace memorable.</p>
          <div className="flex items-center gap-4 mt-5">
            <a href="mailto:zirooprimeracomunion@gmail.com" aria-label="Escríbenos por correo" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D4AF37]/20 transition-colors"><Mail size={16} /></a>
            <a href="https://www.instagram.com/ziromicomunion/" aria-label="Instagram de Ziro" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D4AF37]/20 transition-colors"><Instagram size={16} /></a>
          </div>
        </div>
        <nav aria-label="Pie de página">
          <h2 className="text-xs tracking-widest uppercase text-[#D4AF37] font-semibold mb-4">Explora</h2>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.map((l) => <li key={l.href}><Link to={l.href} className="hover:text-[#D4AF37] transition-colors">{l.label}</Link></li>)}
          </ul>
        </nav>
        <div>
          <h2 className="text-xs tracking-widest uppercase text-[#D4AF37] font-semibold mb-4">Premios del evento, gracias a</h2>
          <div className="flex flex-wrap gap-2">
            {SPONSORS.map((s) => (
              <span key={s} className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5 text-xs"><Award size={12} color="#D4AF37" />{s}</span>
            ))}
          </div>
        </div>
      </div>
      <p className="max-w-6xl mx-auto px-6 py-6 border-t border-white/10 text-xs text-[#FBF7EC]/50">© 2026 ZIRO - Todos los derechos reservados.</p>
    </footer>
  );
}
