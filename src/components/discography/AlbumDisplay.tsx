"use client";

import React, { useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Track {
  id: string;
  name: string;
  uri: string;
  duration: string;
}

interface Album {
  id: string;
  name: string;
  type: string;
  release_date: string;
  year: string;
  total_tracks: number;
  art: string;
  spotify_url: string;
  tracks: Track[];
}

interface AlbumDisplayProps {
  albums: Album[];
  selectedId: string | null;
  onSelectAlbum: (album: Album) => void;
  accentColor: string;
}

// How many neighbours to show on each side
const SIDE_COUNT = 2;

function getReleaseBadge(album: Album) {
  if (album.total_tracks <= 2) return "Single";
  if (album.total_tracks <= 6) return "EP";
  return "Album";
}

function getTransform(offset: number): {
  rotateY: number;
  translateX: number;
  translateZ: number;
  scale: number;
  opacity: number;
  zIndex: number;
} {
  if (offset === 0) {
    return { rotateY: 0, translateX: 0, translateZ: 0, scale: 1, opacity: 1, zIndex: 10 };
  }
  const sign = offset > 0 ? 1 : -1;
  const abs = Math.abs(offset);
  // Each step fans out by ~54% of card width; rotate 38deg per step
  const rotateY = sign * 38 * abs;
  const translateX = sign * 54 * abs;   // % of container, applied via calc in style
  const translateZ = -80 * abs;
  const scale = Math.max(0.52, 1 - 0.22 * abs);
  const opacity = abs > SIDE_COUNT ? 0 : Math.max(0, 1 - 0.32 * abs);
  const zIndex = 10 - abs;
  return { rotateY, translateX, translateZ, scale, opacity, zIndex };
}

export const AlbumDisplay: React.FC<AlbumDisplayProps> = ({
  albums,
  selectedId,
  onSelectAlbum,
  accentColor,
}) => {
  const selectedIndex = albums.findIndex((a) => a.id === selectedId);
  const activeIndex = selectedIndex === -1 ? 0 : selectedIndex;
  const selected = albums[activeIndex];

  const canPrev = activeIndex > 0;
  const canNext = activeIndex < albums.length - 1;

  const handlePrev = useCallback(() => {
    if (canPrev) onSelectAlbum(albums[activeIndex - 1]);
  }, [canPrev, activeIndex, albums, onSelectAlbum]);

  const handleNext = useCallback(() => {
    if (canNext) onSelectAlbum(albums[activeIndex + 1]);
  }, [canNext, activeIndex, albums, onSelectAlbum]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
  };

  // Touch / swipe support
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  if (!selected) return null;

  // Visible range: activeIndex ± SIDE_COUNT, clamped
  const startIdx = Math.max(0, activeIndex - SIDE_COUNT);
  const endIdx = Math.min(albums.length - 1, activeIndex + SIDE_COUNT);
  const visibleAlbums = albums.slice(startIdx, endIdx + 1);

  // Card dimensions (responsive via CSS custom property)
  // We use a 1:1 aspect ratio. Width is set via the wrapper.
  const CARD_W = "clamp(190px, 52vw, 290px)";

  return (
    <div
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      role="group"
      aria-label="Album carousel"
      style={{ outline: "none", width: "100%" }}
    >
      {/* Ambient glow behind the whole carousel */}
      <AnimatePresence>
        <motion.div
          key={accentColor + "-glow"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: "absolute",
            inset: "-80px -40px",
            background: `radial-gradient(ellipse 70% 55% at 50% 45%, ${accentColor}22 0%, transparent 68%)`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      </AnimatePresence>

      {/* ─── Coverflow stage ─────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          width: "100%",
          // Height = card height + overflow for side cards
          height: `calc(${CARD_W} + 16px)`,
          perspective: "900px",
          perspectiveOrigin: "50% 48%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        {visibleAlbums.map((album) => {
          const globalIdx = albums.indexOf(album);
          const offset = globalIdx - activeIndex;
          const t = getTransform(offset);
          const isActive = offset === 0;

          return (
            <motion.div
              key={album.id}
              onClick={() => onSelectAlbum(album)}
              animate={{
                rotateY: t.rotateY,
                x: `${t.translateX}%`,
                z: t.translateZ,
                scale: t.scale,
                opacity: t.opacity,
              }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "absolute",
                width: CARD_W,
                aspectRatio: "1 / 1",
                transformStyle: "preserve-3d",
                zIndex: t.zIndex,
                cursor: isActive ? "default" : "pointer",
                // Side reflection / gloss overlay
                willChange: "transform, opacity",
              }}
              whileHover={!isActive ? { scale: t.scale * 1.04 } : undefined}
              whileTap={!isActive ? { scale: t.scale * 0.97 } : undefined}
              aria-label={album.name}
            >
              {/* Album art */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "clamp(10px, 2vw, 16px)",
                  overflow: "hidden",
                  boxShadow: isActive
                    ? [
                        `0 0 0 1.5px ${accentColor}35`,
                        `0 8px 32px -4px ${accentColor}55`,
                        `0 32px 72px -12px ${accentColor}35`,
                        "0 4px 16px rgba(0,0,0,0.18)",
                      ].join(", ")
                    : [
                        "0 4px 18px rgba(0,0,0,0.22)",
                        `0 0 0 1px rgba(255,255,255,0.04)`,
                      ].join(", "),
                  transition: "box-shadow 0.4s ease",
                  position: "relative",
                }}
              >
                <img
                  src={album.art}
                  alt={album.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                  draggable={false}
                />

                {/* Tinted overlay on non-active cards for depth */}
                {!isActive && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.28)",
                      borderRadius: "inherit",
                    }}
                  />
                )}

                {/* Active card: bottom gradient */}
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "40%",
                      background: `linear-gradient(to top, ${accentColor}2a, transparent)`,
                      pointerEvents: "none",
                    }}
                  />
                )}

                {/* Gloss sheen on side cards */}
                {!isActive && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        offset < 0
                          ? "linear-gradient(to right, rgba(255,255,255,0.07) 0%, transparent 60%)"
                          : "linear-gradient(to left, rgba(255,255,255,0.07) 0%, transparent 60%)",
                      borderRadius: "inherit",
                      pointerEvents: "none",
                    }}
                  />
                )}
              </div>


            </motion.div>
          );
        })}
      </div>

      {/* ─── Meta below ──────────────────────────────────────── */}
      <div style={{ marginTop: "clamp(36px, 8vw, 52px)", textAlign: "center" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id + "-meta"}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}
          >
            {/* Type + year pill */}
            <span
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: "9px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--c-ink)",
                background: `${accentColor}15`,
                padding: "3px 12px",
                borderRadius: "999px",
                border: `1px solid ${accentColor}30`,
              }}
            >
              {getReleaseBadge(selected)} · {selected.year}
            </span>

            {/* Album title */}
            <h3
              style={{
                fontFamily: "var(--f-display)",
                fontSize: "clamp(22px, 6vw, 32px)",
                color: "var(--c-ink)",
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {selected.name}
            </h3>

            {/* ─── Nav row: prev arrow · dots · next arrow ─── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "6px",
              }}
            >
              {/* Prev */}
              <button
                onClick={handlePrev}
                disabled={!canPrev}
                aria-label="Previous album"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  border: `1px solid ${canPrev ? accentColor + "55" : "transparent"}`,
                  background: canPrev ? `${accentColor}10` : "transparent",
                  color: canPrev ? accentColor : "var(--c-surface-3)",
                  cursor: canPrev ? "pointer" : "not-allowed",
                  opacity: canPrev ? 1 : 0.2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  flexShrink: 0,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Dot indicators */}
              <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                {albums.map((_, i) => {
                  const dist = Math.abs(i - activeIndex);
                  const isActive = i === activeIndex;
                  // Show max 7 dots, compress far ones
                  if (albums.length > 7 && dist > 3) return null;
                  return (
                    <button
                      key={i}
                      onClick={() => onSelectAlbum(albums[i])}
                      aria-label={`Go to album ${i + 1}`}
                      style={{
                        width: isActive ? "18px" : dist === 1 ? "6px" : "4px",
                        height: isActive ? "4px" : dist === 1 ? "6px" : "4px",
                        borderRadius: "999px",
                        background: isActive ? accentColor : `${accentColor}40`,
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        transition: "all 0.25s ease",
                        flexShrink: 0,
                      }}
                    />
                  );
                })}
              </div>

              {/* Next */}
              <button
                onClick={handleNext}
                disabled={!canNext}
                aria-label="Next album"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  border: `1px solid ${canNext ? accentColor + "55" : "transparent"}`,
                  background: canNext ? `${accentColor}10` : "transparent",
                  color: canNext ? accentColor : "var(--c-surface-3)",
                  cursor: canNext ? "pointer" : "not-allowed",
                  opacity: canNext ? 1 : 0.2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  flexShrink: 0,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
