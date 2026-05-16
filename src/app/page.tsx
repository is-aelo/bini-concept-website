import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';

export default function BiniPage() {
  const members = [
    { stageName: 'Aiah', fullName: 'Maraiah Queen Arceta', symbol: '♒', color: 'var(--c-aiah)' },
    { stageName: 'Colet', fullName: 'Ma. Nicolette Vergara', symbol: '♍', color: 'var(--c-colet)' },
    { stageName: 'Maloi', fullName: 'Mary Loi Yves Ricalde', symbol: '♊', color: 'var(--c-maloi)' },
    { stageName: 'Gwen', fullName: 'Gweneth L. APULI', symbol: '♊', color: 'var(--c-gwen)' },
    { stageName: 'Stacey', fullName: 'Stacey Aubrey Sevilleja', symbol: '♋', color: 'var(--c-stacey)' },
    { stageName: 'Mikha', fullName: 'Mikhaela Janna Lim', symbol: '♏', color: 'var(--c-mikha)' },
    { stageName: 'Jhoanna', fullName: 'Jhoanna Robles', symbol: '♐', color: 'var(--c-jhoanna)' },
    { stageName: 'Sheena', fullName: 'Sheena Mae Catacutan', symbol: '♉', color: 'var(--c-sheena)' },
  ];

  const albums = [
    { title: 'Signals', type: 'EP', year: '2026' },
    { title: 'FLAMES', type: 'Album', year: '2025' },
    { title: 'Talaarawan', type: 'EP', year: '2024' },
    { title: 'Feel Good', type: 'Album', year: '2022' },
  ];

  const tours = [
    { event: 'Summer Sonic 2026', city: 'Tokyo', status: 'Upcoming' },
    { event: 'Signals World Tour', city: 'Manila', status: 'Upcoming' },
    { event: 'Coachella 2026', city: 'California', status: 'Past' },
    { event: 'Grand BINIverse', city: 'Bulacan', status: 'Past' },
    { event: 'Signals World Tour', city: 'Singapore', status: 'Upcoming' },
  ];

  return (
    <div className="relative">
      <Header />

      <Hero />

      <section className="bg-coachella py-32 px-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-6">
            <span className="text-label-mono bg-white/20 px-4 py-1 rounded-full">Historical Milestone</span>
            <h2 className="text-display-xl !text-6xl md:!text-8xl leading-none">COACHELLA 2026</h2>
          </div>
          <div className="flex flex-col justify-center space-y-6">
            <p className="text-xl font-medium leading-relaxed">
              Making history as the first-ever P-Pop group to perform at Coachella. 
              A monumental leap for Filipino talent on the global stage.
            </p>
            <div className="h-[1px] w-full bg-current opacity-20"></div>
            <p className="text-label-mono font-bold italic">Mojave Stage • April 2026</p>
          </div>
        </div>
      </section>

      <section id="profile" className="py-32 px-10 bg-[var(--c-surface-2)]">
        <h2 className="text-5xl mb-20 text-center font-serif italic lowercase">the members</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {members.map((member) => (
            <div 
              key={member.stageName}
              className="aspect-[3/4] bg-[var(--c-surface-3)] relative overflow-hidden group cursor-pointer transition-transform hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-[var(--c-surface-3)]" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent">
                <span className="text-4xl mb-2" style={{ color: member.color }}>{member.symbol}</span>
                <h3 className="text-white text-3xl font-display uppercase tracking-tighter">{member.stageName}</h3>
                <p className="text-label-mono text-white/70">{member.fullName}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="disco" className="py-32 bg-[var(--c-ink)] overflow-hidden">
        <div className="max-w-7xl mx-auto px-10">
          <h2 className="text-display-xl !text-6xl text-[var(--c-surface)] mb-20">Discography</h2>
          <div className="flex flex-wrap justify-center gap-16 cd-stack-container">
            {albums.map((album) => (
              <div key={album.title} className="group relative">
                <div className="cd-case relative flex flex-col items-center justify-center p-8 text-center text-[var(--c-surface)]">
                  <div className="absolute top-4 right-4 text-label-mono opacity-40">{album.type}</div>
                  <div className="w-12 h-12 rounded-full border border-white/20 mb-4 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-white/10"></div>
                  </div>
                  <h3 className="text-2xl font-serif italic">{album.title}</h3>
                  <p className="text-label-mono mt-4 opacity-60">{album.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tour" className="py-32 px-10 bg-[var(--c-surface)]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-display-xl !text-6xl mb-16">Tour</h2>
          <div className="space-y-4">
            {tours.map((tour, i) => (
              <div key={i} className="flex justify-between items-center py-8 border-b border-[var(--c-surface-3)] group">
                <div className="space-y-1">
                  <h3 className="text-3xl font-display uppercase tracking-tighter group-hover:text-[var(--c-teal)] transition-colors">{tour.event}</h3>
                  <p className="text-label-mono opacity-60">{tour.city}</p>
                </div>
                <div className={`px-6 py-2 rounded-full text-label-mono border ${tour.status === 'Upcoming' ? 'border-[var(--c-teal)] text-[var(--c-teal)]' : 'border-[var(--c-surface-3)] opacity-40'}`}>
                  {tour.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-[var(--c-surface-3)] flex flex-col items-center">
        <p className="text-label-mono opacity-50 mb-10">Designed for Portfolio Purposes • 2026</p>
        <h2 className="text-display-xl !text-[15vw] opacity-[0.03] select-none leading-none">BINICORE</h2>
      </footer>
    </div>
  );
}