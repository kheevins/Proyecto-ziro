import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../layout/Navbar';

export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div aria-hidden={!open} className={`fixed inset-0 z-[100] bg-[#1A2538] flex flex-col px-6 pt-6 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <button aria-label="Cerrar menú" onClick={onClose} className="self-end liquid-glass !rounded-full w-11 h-11 flex items-center justify-center text-[#FBF7EC]"><X size={22} /></button>
      <ul className="flex flex-col gap-4 mt-10">
        {NAV_LINKS.map((l, i) => (
          <li key={l.href} style={{ transitionDelay: open ? `${120 + i * 90}ms` : '0ms' }}
              className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <Link to={l.href} onClick={onClose} className="liquid-glass flex items-center justify-between px-6 py-5 font-poppins text-lg font-semibold text-[#FBF7EC]">
              {l.label}
              {l.live && <span className="text-[10px] tracking-widest uppercase text-[#1A2538] bg-[#D4AF37] rounded-full px-2.5 py-1">¡En Vivo!</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
