import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MobileMenu from '../navigation/MobileMenu';

export const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Sobre Ziro', href: '/sobre-ziro' },
  { label: 'Nuestra App', href: '/nuestra-app' },
  { label: 'Juego', href: '/juego', live: true },
  { label: 'Contacto', href: '/sobre-ziro#contacto' },
];

/* Replace with custom SVG logo */
export function ZiroLogo({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="16" cy="16" r="13" />
      <path d="M10 11h12l-12 10h12" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  return (
    <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl z-50 px-6 py-3 flex items-center justify-between rounded-full border border-white/20 backdrop-blur-xl bg-[#1A2538]/60 shadow-2xl">
        <Link to="/" className="flex items-center gap-2">
          <ZiroLogo />
          <span className="font-poppins font-bold tracking-wider text-[#FBF7EC] text-lg">ZIRO</span>
        </Link>
        <ul className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((l) => {
            const active = pathname === l.href.split('#')[0] && !l.href.includes('#');
            return (
              <li key={l.href}>
                <Link to={l.href} aria-current={active ? 'page' : undefined}
                  className={`relative flex items-center gap-2 font-poppins text-sm font-medium transition-colors hover:text-[#D4AF37] ${active ? 'text-[#D4AF37]' : 'text-[#FBF7EC]'}`}>
                  {l.label}
                  {l.live && <span className="text-[9px] tracking-widest uppercase text-[#1A2538] bg-[#D4AF37] rounded-full px-2 py-0.5">¡En Vivo!</span>}
                  {active && <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-[#D4AF37]" />}
                </Link>
              </li>
            );
          })}
        </ul>
        <button aria-label="Abrir menú" onClick={() => setOpen(true)} className="lg:hidden flex flex-col gap-[5px] p-1">
          {[0, 1, 2].map((i) => <span key={i} className="block h-[2px] w-6 bg-[#FBF7EC]" />)}
        </button>
      </nav>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
