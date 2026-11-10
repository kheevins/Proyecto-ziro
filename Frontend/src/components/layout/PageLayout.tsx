import { Link } from 'react-router-dom';

interface Props {
  eyebrow: string; title: string; intro: string;
  cards: { t: string; d: string }[];
  closing: { title: string; text: string; to: string; label: string };
}

/** Rhythm: intro on Cream 1 (#FBF7EC) → cards on Cream 2 (#FFF0DB) → closing on Slate (#263149). */
export default function PageLayout({ eyebrow, title, intro, cards, closing }: Props) {
  return (
    <main>
      <section className="bg-[#FBF7EC] pt-36 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="text-[#D4AF37] font-semibold text-xs tracking-widest uppercase">{eyebrow}</span>
          <h1 className="font-poppins font-bold text-4xl md:text-5xl text-[#1A2538] mt-3">{title}</h1>
          <p className="font-poppins text-[#4A4A4A] mt-4 max-w-xl">{intro}</p>
        </div>
      </section>
      <section className="bg-[#FFF0DB] py-16 px-6">
        <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
          {cards.map((c) => (
            <div key={c.t} className="glass-light p-7">
              <h2 className="font-poppins font-semibold text-lg text-[#1A2538] mb-2">{c.t}</h2>
              <p className="text-[#4A4A4A] text-sm leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-[#263149] py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-poppins font-semibold text-2xl md:text-3xl text-[#FBF7EC]">{closing.title}</h2>
          <p className="text-[#FBF7EC]/80 mt-3 mb-8">{closing.text}</p>
          <Link to={closing.to} className="inline-block bg-[#D4AF37] text-[#1A2538] rounded-full px-8 py-4 font-bold hover:scale-105 transition-transform">{closing.label}</Link>
        </div>
      </section>
    </main>
  );
}
