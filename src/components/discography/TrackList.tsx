"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Track {
  id: string;
  name: string;
  uri: string;
  duration: string;
}

interface TrackListProps {
  tracks: Track[];
  spotifyAlbumUrl: string;
  accentColor: string;
}

function trackUriToId(uri: string): string | null {
  const m = uri?.match(/spotify:track:([a-zA-Z0-9]+)/);
  return m ? m[1] : null;
}

function albumUrlToId(urlOrUri: string): string | null {
  if (!urlOrUri) return null;
  const url = urlOrUri.match(/spotify\.com\/album\/([a-zA-Z0-9]+)/);
  if (url) return url[1];
  const uri = urlOrUri.match(/spotify:album:([a-zA-Z0-9]+)/);
  return uri ? uri[1] : null;
}

function trackEmbedSrc(trackId: string): string {
  return `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
}

export const TrackList: React.FC<TrackListProps> = ({
  tracks,
  spotifyAlbumUrl,
  accentColor,
}) => {
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);

  useEffect(() => {
    setActiveTrackId(null);
  }, [spotifyAlbumUrl]);

  const albumId = albumUrlToId(spotifyAlbumUrl);
  const embedSrc = activeTrackId ? trackEmbedSrc(activeTrackId) : null;

  const handleTrackClick = (uri: string) => {
    const id = trackUriToId(uri);
    if (!id) return;
    setActiveTrackId((prev) => (prev === id ? null : id));
  };

  if (!tracks || tracks.length === 0) {
    return (
      <p style={{ fontSize: "13px", color: "var(--c-ink)", opacity: 0.35, padding: "1rem 0" }}>
        No tracks available.
      </p>
    );
  }

  return (
    <div style={{ width: "100%" }}>

      {/* ── Section label ──────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <span
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: "9px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--c-ink)",
            opacity: 0.35,
          }}
        >
          Tracklist
        </span>
        <div style={{ flex: 1, height: "1px", background: "var(--c-surface-3)" }} />
      </div>

      {/* ── Track rows ─────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {tracks.map((track, index) => {
          const trackId = trackUriToId(track.uri);
          const isActive = !!trackId && activeTrackId === trackId;
          const hasUri = !!trackId;

          return (
            <motion.button
              key={track.id}
              onClick={() => hasUri && handleTrackClick(track.uri)}
              disabled={!hasUri}
              aria-pressed={isActive}
              initial={false}
              animate={{ backgroundColor: isActive ? `${accentColor}10` : "rgba(0,0,0,0)" }}
              transition={{ duration: 0.18 }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                border: "none",
                borderBottom: `1px solid ${isActive ? accentColor + "18" : "var(--c-surface-2)"}`,
                borderRadius: "0",
                cursor: hasUri ? "pointer" : "default",
                textAlign: "left",
                outline: "none",
                background: "transparent",
                padding: "0",
              }}
            >
              {/* Active left bar */}
              <div
                style={{
                  width: "2px",
                  alignSelf: "stretch",
                  flexShrink: 0,
                  background: isActive ? accentColor : "transparent",
                  transition: "background 0.18s ease",
                  borderRadius: "0 2px 2px 0",
                }}
              />

              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  padding: "11px 10px 11px 12px",
                  gap: "12px",
                  minWidth: 0,
                }}
              >
                {/* Number / equalizer */}
                <span
                  style={{
                    fontFamily: "var(--f-mono)",
                    fontSize: "11px",
                    width: "22px",
                    textAlign: "right",
                    flexShrink: 0,
                    color: isActive ? accentColor : "var(--c-ink)",
                    opacity: isActive ? 1 : 0.28,
                    transition: "color 0.18s ease",
                  }}
                >
                  {isActive ? (
                    <span style={{ display: "inline-flex", alignItems: "flex-end", gap: "1.5px", height: "13px", verticalAlign: "middle" }}>
                      {[{ h: "9px", d: "0s" }, { h: "13px", d: "0.14s" }, { h: "6px", d: "0.28s" }].map((bar, bi) => (
                        <span
                          key={bi}
                          style={{
                            width: "2px",
                            height: bar.h,
                            background: accentColor,
                            borderRadius: "1px",
                            animation: `eqBar 0.7s ease-in-out ${bar.d} infinite alternate`,
                          }}
                        />
                      ))}
                    </span>
                  ) : (
                    String(index + 1).padStart(2, "0")
                  )}
                </span>

                {/* Track name */}
                <span
                  style={{
                    fontSize: "13px",
                    fontFamily: "var(--f-body)",
                    color: isActive ? accentColor : "var(--c-ink)",
                    fontWeight: isActive ? 500 : 400,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                    transition: "color 0.18s ease",
                    letterSpacing: isActive ? "-0.01em" : "0",
                  }}
                >
                  {track.name}
                </span>

                {/* Duration */}
                <span
                  style={{
                    fontFamily: "var(--f-mono)",
                    fontSize: "11px",
                    color: isActive ? accentColor : "var(--c-ink)",
                    opacity: isActive ? 0.75 : 0.3,
                    flexShrink: 0,
                    transition: "color 0.18s ease, opacity 0.18s ease",
                  }}
                >
                  {track.duration}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* ── Inline preview player ──────────────────────── */}
      <AnimatePresence>
        {embedSrc && (
          <motion.div
            key={activeTrackId}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden", marginTop: "16px" }}
          >
            <div
              style={{
                borderRadius: "14px",
                overflow: "hidden",
                border: `1.5px solid ${accentColor}45`,
                boxShadow: `0 4px 24px -4px ${accentColor}30, 0 2px 8px rgba(0,0,0,0.08)`,
              }}
            >
              {/* Label row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "7px 14px 5px",
                  background: `${accentColor}0e`,
                  borderBottom: `1px solid ${accentColor}25`,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--f-mono)",
                    fontSize: "9px",
                    letterSpacing: "0.13em",
                    textTransform: "uppercase",
                    color: accentColor,
                  }}
                >
                  ▶ 30s preview
                </span>
                <button
                  onClick={() => setActiveTrackId(null)}
                  aria-label="Close preview"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--c-ink)",
                    opacity: 0.35,
                    fontSize: "16px",
                    lineHeight: 1,
                    padding: "2px 4px",
                  }}
                >
                  ×
                </button>
              </div>

              {/* Accent top gradient bar */}
              <div
                style={{
                  height: "2px",
                  background: `linear-gradient(90deg, ${accentColor}, ${accentColor}40)`,
                }}
              />

              {/* Iframe */}
              <iframe
                key={activeTrackId}
                title="30s track preview"
                src={embedSrc}
                width="100%"
                height="80"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                style={{ display: "block", border: "none" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Listen on Spotify ──────────────────────────── */}
      {albumId && (
        <a
          href={spotifyAlbumUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            width: "100%",
            marginTop: "20px",
            padding: "14px",
            borderRadius: "12px",
            border: `1.5px solid ${accentColor}40`,
            background: `${accentColor}08`,
            color: "var(--c-ink)",
            textDecoration: "none",
            fontFamily: "var(--f-mono)",
            fontSize: "11px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            transition: "background 0.2s ease, border-color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = `${accentColor}18`;
            (e.currentTarget as HTMLAnchorElement).style.borderColor = `${accentColor}80`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = `${accentColor}08`;
            (e.currentTarget as HTMLAnchorElement).style.borderColor = `${accentColor}40`;
          }}
        >
          {/* Spotify logo SVG */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: accentColor, flexShrink: 0 }}>
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          Listen on Spotify
        </a>
      )}

      <style>{`
        @keyframes eqBar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
};