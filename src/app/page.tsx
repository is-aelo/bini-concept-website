import { Star, Disc, Heart } from "@phosphor-icons/react/dist/ssr";

export default function Home() {
  return (
    <main className="min-h-screen p-8 md:p-24 flex flex-col gap-16">
      
      {/* Hero Section Test */}
      <section className="space-y-6 text-center md:text-left">
        <div className="inline-block px-4 py-1 rounded-pill bg-bini-sky text-bini-teal font-mono text-sm font-bold uppercase tracking-widest">
          The Nation's Girl Group
        </div>
        <h1 className="text-7xl md:text-9xl font-heading leading-none">
          <span className="text-bini-teal">BI</span><span className="text-bini-pink">NI</span>
        </h1>
        <p className="max-w-xl text-xl font-sans text-slate-500 leading-relaxed">
          Welcome to the <span className="text-bini-teal font-semibold">Digital Flagship</span>. 
          Fresh, tropical, and always in bloom.
        </p>
      </section>

      {/* Aesthetic Cards Test */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bini-glass p-10 space-y-4 bini-glow-hover group">
          <Heart size={40} weight="fill" className="text-bini-pink group-hover:scale-110 transition-transform" />
          <h2 className="text-3xl font-heading">Sky White</h2>
          <p className="text-slate-500 font-sans">
            Checking if the #F8FBFF background feels "Sky Blue" enough for the BINI vibe.
          </p>
        </div>

        <div className="bg-white p-10 rounded-bini-lg border border-slate-100 shadow-sm space-y-4 bini-glow-hover">
          <Star size={40} weight="duotone" className="text-bini-yellow" />
          <h2 className="text-3xl font-heading">Bloom Era</h2>
          <p className="text-slate-500 font-sans">
            Clean white surfaces with subtle shadows to maintain high-end polish.
          </p>
        </div>

        <div className="bg-bini-teal text-white p-10 rounded-bini-lg shadow-xl shadow-bini-teal/20 space-y-4">
          <Disc size={40} weight="bold" className="animate-spin-slow" />
          <h2 className="text-3xl font-heading text-white">Full Teal</h2>
          <p className="text-white/80 font-sans">
            High-contrast accent card to test the vibrancy of the BINI Teal.
          </p>
        </div>
      </section>

    </main>
  );
}