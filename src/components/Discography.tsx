'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

interface Track {
  id: string;
  name: string;
  duration: string;
  spotify_url: string;
}

interface Album {
  id: string;
  name: string;
  year: string;
  art: string;
  tracks: Track[];
  spotify_album_url?: string;
}

const ACCENT_COLORS = [
  '#E8739A', '#EC7FA3', '#F2A234', '#8BB8D4',
  '#9B72CF', '#4BBFCF', '#E8C840', '#D94040',
];

export default function Discography() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [nowPlaying, setNowPlaying] = useState<{ track: Track; album: Album } | null>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  useEffect(() => {
    fetch('/api/bini')
      .then((r) => r.json())
      .then((data) => {
        if (data.items) {
          const sorted = [...data.items].sort(
            (a: Album, b: Album) => parseInt(b.year) - parseInt(a.year)
          );
          setAlbums(sorted);
        }
      });
  }, []);

  const handleTrackClick = useCallback(
    (track: Track, album: Album) => {
      if (selectedTrackId === track.id) {
        return;
      }
      setSelectedTrackId(track.id);
      setNowPlaying({ track, album });
    },
    [selectedTrackId]
  );

  const goTo = useCallback(
    (index: number) => {
      const total = albums.length;
      if (!total) return;
      setActiveIndex(((index % total) + total) % total);
    },
    [albums.length]
  );

  const accent = ACCENT_COLORS[activeIndex % ACCENT_COLORS.length];
  const album = albums[activeIndex];

  if (!albums.length) {
    return (
      <div
        className="flex items-center justify-center h-64"
        style={{
          fontFamily: 'var(--f-mono)',
          fontSize: '0.65rem',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          opacity: 0.5,
          color: 'var(--c-ink)',
          width: '100%'
        }}
      >
        Loading Archive...
      </div>
    );
  }

  const indexLabel = String(activeIndex + 1).padStart(2, '0');

  return (
    <>
      <style>{`
        @keyframes vinylSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes trackSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .track-item { animation: trackSlideIn 0.24s var(--ease-smooth) both; }
        
        .disc-nav-btn {
          transition: background 0.2s var(--ease-smooth), transform 0.15s var(--ease-smooth);
        }
        @media (hover: hover) {
          .disc-nav-btn:hover { background: rgba(12,12,10,0.06); transform: scale(1.04); }
        }
        .disc-nav-btn:active { transform: scale(0.96); }
        
        .track-btn { 
          transition: background 0.2s var(--ease-smooth);
          -webkit-tap-highlight-color: transparent;
        }
        .track-btn .track-icon-bg,
        .track-btn .track-num,
        .track-btn .track-name,
        .track-btn .track-time,
        .track-btn .select-icon {
          transition: color 0.2s var(--ease-smooth), background 0.2s var(--ease-smooth), transform 0.2s var(--ease-smooth);
        }
        
        @media (hover: hover) {
          .track-btn:hover { 
            background: var(--track-accent) !important; 
          }
          .track-btn:hover .track-name { 
            color: #ffffff !important; 
            opacity: 1 !important;
          }
          .track-btn:hover .track-time { 
            color: #ffffff !important; 
            opacity: 0.7 !important;
          }
          .track-btn:hover .track-num { 
            color: #ffffff !important; 
            opacity: 0.6 !important;
          }
          .track-btn:hover .track-icon-bg { 
            background: #ffffff !important;
          }
          .track-btn:hover .select-icon {
            color: var(--track-accent) !important;
            transform: translateX(1px);
          }
        }

        .track-btn.track-active {
          background: var(--track-accent) !important; 
        }
        .track-btn.track-active .track-name { 
          color: #ffffff !important; 
          opacity: 1 !important;
        }
        .track-btn.track-active .track-time { 
          color: #ffffff !important; 
          opacity: 0.7 !important;
        }
        .track-btn.track-active .track-num { 
          color: #ffffff !important; 
          opacity: 0.6 !important;
        }
        .track-btn.track-active .track-icon-bg { 
          background: #ffffff !important;
        }
        .track-btn.track-active .select-icon {
          color: var(--track-accent) !important;
        }
        
        .track-btn:active { 
          opacity: 0.85; 
        }
        
        .spotify-pill {
          transition: background 0.2s var(--ease-smooth), transform 0.2s var(--ease-smooth), box-shadow 0.2s var(--ease-smooth);
          -webkit-tap-highlight-color: transparent;
        }
        @media (hover: hover) {
          .spotify-pill:hover { 
            background: var(--track-accent) !important; 
            transform: translateY(-1px); 
            box-shadow: 0 6px 20px var(--track-accent-alpha) !important;
          }
        }
        .spotify-pill:active { 
          background: var(--track-accent) !important;
          transform: scale(0.98); 
        }
        
        .scroller-balanced::-webkit-scrollbar {
          width: 4px;
        }
        .scroller-balanced::-webkit-scrollbar-track {
          background: transparent;
        }
        .scroller-balanced::-webkit-scrollbar-thumb {
          background: rgba(12,12,10,0.1);
          border-radius: 2px;
        }
        .scroller-balanced::-webkit-scrollbar-thumb:hover {
          background: rgba(12,12,10,0.2);
        }
      `}</style>

      <section
        className="relative overflow-hidden w-full min-h-screen flex items-start lg:items-center"
        style={{ background: 'var(--c-surface)', paddingBlock: 'clamp(1.5rem, 5vw, 4rem)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            opacity: 0.02,
          }}
        />

        <div
          className="absolute pointer-events-none z-0"
          style={{
            width: '70vw',
            height: '70vw',
            maxWidth: 900,
            maxHeight: 900,
            top: '-10%',
            right: '-10%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${accent}12 0%, transparent 70%)`,
            transition: 'background 0.8s var(--ease-smooth)',
          }}
        />

        <div
          className="relative z-10 mx-auto w-full flex flex-col justify-center"
          style={{ maxWidth: 1200, paddingInline: 'clamp(1rem, 4vw, 4.5rem)' }}
        >
          {/* Header Area */}
          <div className="w-full flex items-end justify-between mb-6 lg:mb-10 pb-4" style={{ borderBottom: '1px solid rgba(12,12,10,0.08)' }}>
            <div className="flex flex-col">
              <p
                className="mb-1"
                style={{
                  fontFamily: 'var(--f-mono)',
                  fontSize: '0.65rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: 'var(--c-ink)',
                  opacity: 0.5,
                }}
              >
                Music Archive
              </p>
              <h3
                style={{
                  fontFamily: 'var(--f-display)',
                  fontSize: 'clamp(2rem, 5vw, 4.5rem)',
                  lineHeight: 0.9,
                  color: 'var(--c-teal-dark)',
                  letterSpacing: '-0.02em',
                }}
              >
                DISCOGRAPHY
              </h3>
            </div>

            <div className="flex items-baseline gap-1" style={{ paddingBottom: '0.2rem' }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={`header-idx-${activeIndex}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    fontFamily: 'var(--f-display)',
                    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                    lineHeight: 1,
                    color: accent,
                    fontWeight: 400,
                  }}
                >
                  {indexLabel}
                </motion.span>
              </AnimatePresence>
              <span
                style={{
                  fontFamily: 'var(--f-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--c-ink)',
                  opacity: 0.3,
                }}
              >
                / {String(albums.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Master Responsive Grid */}
          <div 
            className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-6 lg:gap-8 items-start w-full"
            style={{
              ['--track-accent' as any]: accent,
              ['--track-accent-alpha' as any]: `${accent}33`,
            }}
          >
            
            {/* LEFT SIDE: Artwork, Meta Controls & Mobile Player (Sticky on Mobile) */}
            <div 
              className="flex flex-col w-full gap-4 lg:gap-6 sticky top-0 lg:relative bg-transparent z-30 lg:z-10"
              onTouchStart={(e) => {
                touchStartX.current = e.touches[0].clientX;
                touchStartY.current = e.touches[0].clientY;
              }}
              onTouchEnd={(e) => {
                const dx = touchStartX.current - e.changedTouches[0].clientX;
                const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY);
                if (Math.abs(dx) > 45 && dy < 55) goTo(activeIndex + (dx > 0 ? 1 : -1));
              }}
            >
              {/* Art + Meta card for mobile backdrop insulation */}
              <div className="flex flex-row lg:flex-col gap-4 items-center lg:items-stretch bg-[var(--c-surface)] lg:bg-transparent p-3 lg:p-0 rounded-[var(--r-lg)] lg:rounded-none border border-[rgba(12,12,10,0.04)] lg:border-none shadow-sm lg:shadow-none">
                
                {/* Artwork (Scaled down beautifully on mobile) */}
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-full lg:h-auto lg:aspect-square shrink-0">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`art-${activeIndex}`}
                      initial={{ opacity: 0, scale: 0.99 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.99 }}
                      transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
                      className="relative overflow-hidden w-full h-full"
                      style={{
                        borderRadius: 'var(--r-md)',
                        background: 'var(--c-surface-2)',
                        border: `1px solid rgba(12,12,10,0.06)`,
                        boxShadow: `var(--shadow-float)`,
                      }}
                    >
                      <img
                        src={album.art}
                        alt={album.name}
                        className="w-full h-full object-cover object-center block"
                        draggable={false}
                      />

                      {album.tracks.some((t) => t.id === selectedTrackId) && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px]"
                        >
                          <div
                            className="relative overflow-hidden rounded-full"
                            style={{
                              width: '65%',
                              aspectRatio: '1 / 1',
                              background: 'var(--c-ink)',
                              animation: 'vinylSpin 6s linear infinite',
                            }}
                          >
                            {[32, 41, 50, 59, 68].map((r) => (
                              <div
                                key={r}
                                className="absolute rounded-full"
                                style={{
                                  width: `${r}%`,
                                  height: `${r}%`,
                                  top: `${50 - r / 2}%`,
                                  left: `${50 - r / 2}%`,
                                  border: '1px solid rgba(255,255,255,0.035)',
                                }}
                              />
                            ))}
                            <div
                              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                              style={{
                                width: '32%',
                                aspectRatio: '1 / 1',
                                backgroundImage: `url(${album.art})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                              }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Typography metadata info wrapper */}
                <div className="flex-1 min-w-0 lg:mt-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`meta-${activeIndex}`}
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h4
                        className="uppercase truncate font-medium"
                        style={{
                          fontFamily: 'var(--f-display)',
                          fontSize: 'clamp(1.1rem, 2.5vw, 1.8rem)',
                          lineHeight: 1.1,
                          color: 'var(--c-ink)',
                        }}
                      >
                        {album.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <p
                          style={{
                            fontFamily: 'var(--f-mono)',
                            fontSize: '0.6rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.12em',
                            color: 'var(--c-ink)',
                            opacity: 0.5,
                          }}
                        >
                          {album.year} · {album.tracks.length} Tracks
                        </p>
                        
                        {/* Conditional Latest Release Tag */}
                        {activeIndex === 0 && (
                          <span
                            style={{
                              fontFamily: 'var(--f-mono)',
                              fontSize: '0.55rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.08em',
                              color: '#ffffff',
                              background: accent,
                              padding: '2px 6px',
                              borderRadius: '2px',
                              display: 'inline-block',
                              lineHeight: 1,
                              transition: 'background 0.3s ease'
                            }}
                          >
                            Latest Release
                          </span>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation slide nodes directly below metadata on mobile */}
                  <div className="flex lg:hidden items-center gap-3 mt-3">
                    <button
                      onClick={() => goTo(activeIndex - 1)}
                      className="disc-nav-btn flex items-center justify-center shrink-0"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 'var(--r-full)',
                        border: '1px solid rgba(12,12,10,0.1)',
                        color: 'var(--c-ink)',
                        background: 'transparent',
                      }}
                    >
                      <Icon icon="mingcute:left-line" style={{ width: 14, height: 14 }} />
                    </button>
                    <button
                      onClick={() => goTo(activeIndex + 1)}
                      className="disc-nav-btn flex items-center justify-center shrink-0"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 'var(--r-full)',
                        border: '1px solid rgba(12,12,10,0.1)',
                        color: 'var(--c-ink)',
                        background: 'transparent',
                      }}
                    >
                      <Icon icon="mingcute:right-line" style={{ width: 14, height: 14 }} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop Only Extra Controls */}
              <div className="hidden lg:flex flex-col gap-4 w-full">
                <div className="flex items-center gap-3 w-full">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => goTo(activeIndex - 1)}
                      className="disc-nav-btn flex items-center justify-center shrink-0"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 'var(--r-full)',
                        border: '1px solid rgba(12,12,10,0.1)',
                        color: 'var(--c-ink)',
                        background: 'transparent',
                      }}
                    >
                      <Icon icon="mingcute:left-line" style={{ width: 16, height: 16 }} />
                    </button>
                    <button
                      onClick={() => goTo(activeIndex + 1)}
                      className="disc-nav-btn flex items-center justify-center shrink-0"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 'var(--r-full)',
                        border: '1px solid rgba(12,12,10,0.1)',
                        color: 'var(--c-ink)',
                        background: 'transparent',
                      }}
                    >
                      <Icon icon="mingcute:right-line" style={{ width: 16, height: 16 }} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 ml-auto">
                    {albums.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goTo(i)}
                        style={{
                          height: 5,
                          width: i === activeIndex ? 16 : 5,
                          borderRadius: 2.5,
                          background: i === activeIndex ? accent : 'rgba(12,12,10,0.1)',
                          border: 'none',
                          padding: 0,
                          transition: 'width 0.3s var(--ease-smooth), background 0.3s ease',
                        }}
                      />
                    ))}
                  </div>
                </div>

                <a
                  href={album.spotify_album_url || `https://open.spotify.com/search/${encodeURIComponent(album.name + ' BINI')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="spotify-pill flex items-center justify-center gap-2 w-full text-center"
                  style={{
                    background: 'var(--c-teal-dark)',
                    color: '#fff',
                    borderRadius: 'var(--r-full)',
                    padding: '0.8rem 1.5rem',
                    fontFamily: 'var(--f-mono)',
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  <Icon icon="mdi:spotify" style={{ width: 16, height: 16 }} />
                  Listen on Spotify
                </a>
              </div>

              {/* Mobile Only Sticky Player Module */}
              <div className="block lg:hidden w-full bg-[var(--c-surface)] pb-2">
                <AnimatePresence mode="wait">
                  {nowPlaying ? (
                    <motion.div
                      key={`mob-play-${nowPlaying.track.id}`}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      style={{
                        borderRadius: 'var(--r-md)',
                        overflow: 'hidden',
                        border: `1px solid rgba(12,12,10,0.06)`,
                        padding: 4,
                        background: 'var(--c-surface)',
                      }}
                    >
                      <iframe
                        src={`https://open.spotify.com/embed/track/${nowPlaying.track.id}?utm_source=generator&theme=0`}
                        width="100%"
                        height="80"
                        style={{ border: 'none', borderRadius: 6, display: 'block' }}
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      />
                    </motion.div>
                  ) : (
                    <div 
                      className="w-full flex items-center justify-center text-center p-4 border border-dashed border-[rgba(12,12,10,0.1)]"
                      style={{ borderRadius: 'var(--r-md)', height: 80 }}
                    >
                      <p style={{ fontFamily: 'var(--f-mono)', fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--c-ink)', opacity: 0.5 }}>
                        Select a track below to stream
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* RIGHT SIDE: Tracklist Panel Container */}
            <div
              className="flex flex-col w-full h-full lg:h-[540px] bg-[rgba(12,12,10,0.01)] border border-[rgba(12,12,10,0.04)] rounded-[var(--r-lg)] p-4 lg:p-6"
            >
              <div className="flex flex-col min-h-0 w-full h-full">
                <div 
                  className="flex items-center justify-between mb-3 pb-2 shrink-0"
                  style={{ borderBottom: `1px solid rgba(12,12,10,0.05)` }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--f-mono)',
                      fontSize: '0.65rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      color: 'var(--c-ink)',
                      opacity: 0.5,
                    }}
                  >
                    Tracklist
                  </p>
                </div>

                {/* Scrollable Area */}
                <div className="scroller-balanced overflow-y-auto w-full flex-1" style={{ paddingRight: '2px' }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`tracks-${activeIndex}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col w-full"
                    >
                      {album.tracks.map((track, i) => {
                        const isSelected = selectedTrackId === track.id;
                        return (
                          <button
                            key={track.id}
                            onClick={() => handleTrackClick(track, album)}
                            className={`track-btn track-item w-full flex items-center gap-3.5 text-left ${isSelected ? 'track-active' : ''}`}
                            style={{
                              animationDelay: `${i * 12}ms`,
                              padding: '0.75rem 0.5rem',
                              borderRadius: 'var(--r-sm)',
                              cursor: 'pointer',
                              background: 'transparent',
                              border: 'none',
                              borderBottom: i < album.tracks.length - 1 ? '1px solid rgba(12,12,10,0.03)' : 'none',
                            }}
                          >
                            <span
                              className="track-icon-bg flex items-center justify-center shrink-0"
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                background: isSelected ? '#ffffff' : 'rgba(12,12,10,0.05)',
                              }}
                            >
                              <Icon
                                icon={isSelected ? 'mingcute:check-fill' : 'mingcute:right-line'}
                                className="select-icon"
                                style={{ width: 10, height: 10, color: isSelected ? accent : 'rgba(12,12,10,0.4)' }}
                              />
                            </span>

                            <span
                              className="track-num"
                              style={{
                                fontFamily: 'var(--f-mono)',
                                fontSize: '0.65rem',
                                color: isSelected ? '#ffffff' : 'rgba(12,12,10,0.3)',
                                width: 18,
                                textAlign: 'right',
                              }}
                            >
                              {String(i + 1).padStart(2, '0')}
                            </span>

                            <span
                              className="track-name flex-1 truncate"
                              style={{
                                fontFamily: 'var(--f-mono)',
                                fontSize: '0.65rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.02em',
                                color: isSelected ? '#ffffff' : 'var(--c-ink)',
                                fontWeight: isSelected ? 700 : 400,
                              }}
                            >
                              {track.name}
                            </span>

                            <span
                              className="track-time"
                              style={{
                                fontFamily: 'var(--f-mono)',
                                fontSize: '0.65rem',
                                color: isSelected ? '#ffffff' : 'var(--c-ink)',
                                opacity: isSelected ? 0.7 : 0.4,
                              }}
                            >
                              {track.duration}
                            </span>
                          </button>
                        );
                      })}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Desktop Only Embedded Player Base */}
              <div className="hidden lg:flex shrink-0 min-h-[88px] flex-col justify-end mt-4 relative z-20 w-full">
                <AnimatePresence mode="wait">
                  {nowPlaying && (
                    <motion.div
                      key={`desk-play-${nowPlaying.track.id}`}
                      initial={{ opacity: 0, y: 4, scale: 0.99 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.99 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        borderRadius: 'var(--r-md)',
                        overflow: 'hidden',
                        border: `1px solid rgba(12,12,10,0.06)`,
                        boxShadow: `var(--shadow-tactile)`,
                        padding: 4,
                        background: 'var(--c-surface)',
                        width: '100%',
                      }}
                    >
                      <iframe
                        src={`https://open.spotify.com/embed/track/${nowPlaying.track.id}?utm_source=generator&theme=0`}
                        width="100%"
                        height="80"
                        style={{ border: 'none', borderRadius: 6, display: 'block' }}
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}