'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

interface Track {
  id: string;
  name: string;
  duration: string;
  preview_url: string | null;
  spotify_url: string;
}

interface Album {
  id: string;
  name: string;
  year: string;
  art: string;
  tracks: Track[];
}

const ACCENT_COLORS = [
  '#E8739A', '#EC7FA3', '#F2A234', '#8BB8D4',
  '#9B72CF', '#4BBFCF', '#E8C840', '#D94040',
];

export default function Discography() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [nowPlaying, setNowPlaying] = useState<{ track: Track; album: Album } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const touchStartX = useRef(0);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    fetch('/api/bini')
      .then((r) => r.json())
      .then((data) => {
        if (data.items) setAlbums(data.items);
      });
  }, []);

  const startProgressTimer = useCallback(() => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    startTimeRef.current = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const pct = Math.min((elapsed / 30) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        setIsPlaying(false);
        setPlayingTrackId(null);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      }
    }, 100);
  }, []);

  const handleTrackClick = useCallback((track: Track, album: Album) => {
    if (playingTrackId === track.id) {
      if (isPlaying) {
        setIsPlaying(false);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      } else {
        setIsPlaying(true);
        startProgressTimer();
      }
      return;
    }

    setPlayingTrackId(track.id);
    setNowPlaying({ track, album });
    setIsPlaying(true);
    setProgress(0);
    startProgressTimer();
  }, [playingTrackId, isPlaying, startProgressTimer]);

  const togglePlayerPlayPause = useCallback(() => {
    if (!nowPlaying) return;
    if (isPlaying) {
      setIsPlaying(false);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    } else {
      setIsPlaying(true);
      startProgressTimer();
    }
  }, [isPlaying, nowPlaying, startProgressTimer]);

  const goTo = useCallback((index: number) => {
    const total = albums.length;
    if (!total) return;
    setActiveIndex(((index % total) + total) % total);
  }, [albums.length]);

  const accent = ACCENT_COLORS[activeIndex % ACCENT_COLORS.length];
  
  const getVisibleCards = () => {
    if (!albums.length) return [];
    return [-1, 0, 1].map((offset) => {
      const idx = ((activeIndex + offset) % albums.length + albums.length) % albums.length;
      return { album: albums[idx], offset };
    });
  };

  if (!albums.length) return <div className="flex items-center justify-center h-64">Loading...</div>;

  return (
    <>
      <style>{`
        @keyframes vinylSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bloomPulse { 0%, 100% { opacity: 0.12; transform: scale(1); } 50% { opacity: 0.22; transform: scale(1.08); } }
        .track-row:hover { background: rgba(12,12,10,0.05); }
      `}</style>
      <div style={{ position: 'relative', userSelect: 'none' }}>
        <div style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)', width: '560px', height: '560px', borderRadius: '50%', background: `radial-gradient(circle, ${accent} 0%, transparent 68%)`, animation: 'bloomPulse 4s ease-in-out infinite', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '20px', paddingBottom: '32px' }} onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }} onTouchEnd={(e) => { const diff = touchStartX.current - e.changedTouches[0].clientX; if (Math.abs(diff) > 40) goTo(activeIndex + (diff > 0 ? 1 : -1)); }}>
          <button onClick={() => goTo(activeIndex - 1)} style={{ alignSelf: 'flex-start', marginTop: '140px', width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(12,12,10,0.06)', border: '1px solid rgba(12,12,10,0.12)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon icon="mingcute:left-line" /></button>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            {getVisibleCards().map(({ album, offset }) => {
              const isCenter = offset === 0;
              const isAlbumActive = album.tracks.some((t) => t.id === playingTrackId);
              return (
                <motion.div key={album.id} layout animate={{ scale: isCenter ? 1 : 0.86, opacity: isCenter ? 1 : 0.5 }} transition={{ type: 'spring', stiffness: 320, damping: 30 }} onClick={!isCenter ? () => goTo(activeIndex + offset) : undefined} style={{ flexShrink: 0, width: isCenter ? '300px' : '210px', borderRadius: '20px', background: isCenter ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.45)', backdropFilter: 'blur(24px)', border: isCenter ? `1.5px solid ${accent}66` : '1.5px solid rgba(12,12,10,0.08)', cursor: isCenter ? 'default' : 'pointer', overflow: 'hidden' }}>
                  <div style={{ position: 'relative', background: '#111' }}>
                    <img src={album.art} alt={album.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />
                    {isCenter && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', opacity: isAlbumActive && isPlaying ? 1 : 0, transition: 'opacity 0.35s ease' }}>
                        <div style={{ width: '70%', aspectRatio: '1', borderRadius: '50%', background: '#0a0a0a', animation: isAlbumActive && isPlaying ? 'vinylSpin 3s linear infinite' : 'none', position: 'relative', overflow: 'hidden' }}>
                          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '36%', aspectRatio: '1', borderRadius: '50%', backgroundImage: `url(${album.art})`, backgroundSize: 'cover' }} />
                        </div>
                      </div>
                    )}
                  </div>
                  {isCenter && (
                    <div style={{ padding: '16px' }}>
                      <p style={{ margin: '0 0 2px', fontSize: '20px', textTransform: 'uppercase' }}>{album.name}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {album.tracks.slice(0, 3).map((track) => (
                          <button key={track.id} onClick={() => handleTrackClick(track, album)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', cursor: 'pointer' }}>
                            <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: playingTrackId === track.id ? accent : 'rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Icon icon={playingTrackId === track.id && isPlaying ? 'mingcute:pause-fill' : 'mingcute:play-fill'} style={{ fontSize: '9px', color: '#fff' }} />
                            </span>
                            <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.name}</span>
                            <span style={{ fontSize: '11px', opacity: 0.5 }}>{track.duration}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
          <button onClick={() => goTo(activeIndex + 1)} style={{ alignSelf: 'flex-start', marginTop: '140px', width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(12,12,10,0.06)', border: '1px solid rgba(12,12,10,0.12)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon icon="mingcute:right-line" /></button>
        </div>

        {/* Hidden Embedded Music Engine for Native Site Playback */}
        {nowPlaying && isPlaying && (
          <iframe
            ref={iframeRef}
            src={`https://open.spotify.com/embed/track/${nowPlaying.track.id}?utm_source=generator&autoplay=1`}
            width="0"
            height="0"
            style={{ display: 'none', border: 'none' }}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        )}

        <AnimatePresence>
          {nowPlaying && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} style={{ position: 'relative', zIndex: 1, maxWidth: '480px', margin: '0 auto', background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(24px)', border: `1.5px solid ${accent}55`, borderRadius: '16px', padding: '12px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', animation: isPlaying ? 'vinylSpin 3s linear infinite' : 'none' }}><img src={nowPlaying.album.art} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>{nowPlaying.track.name}</p>
                <div style={{ height: '3px', borderRadius: '2px', background: 'rgba(0,0,0,0.1)', marginTop: '6px' }}><div style={{ height: '100%', width: `${progress}%`, background: accent, borderRadius: '2px' }} /></div>
              </div>
              <button onClick={togglePlayerPlayPause} style={{ width: '40px', height: '40px', borderRadius: '50%', background: accent, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon icon={isPlaying ? 'mingcute:pause-fill' : 'mingcute:play-fill'} style={{ color: '#fff' }} /></button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}