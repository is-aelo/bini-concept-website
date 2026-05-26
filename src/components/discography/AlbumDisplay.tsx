"use client";

import React, { useCallback } from "react";
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

  if (!selected) return null;

  return (
    <div
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="group"
      aria-label="Album carousel"
      style={{ outline: "none", width: "100%" }}
    >
      {/* ── Big sleeve layout ──────────────────────────── */}
      <div style={{ position: "relative", width: "100%" }}>

        {/* Ambient wash — bleeds behind the art */}
        <AnimatePresence>
          <motion.div
            key={accentColor}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: "absolute",
              inset: "-40px -20px",
              background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${accentColor}28 0%, transparent 70%)`,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        </AnimatePresence>

        {/* Art + side nav row */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            gap: "clamp(12px, 3vw, 20px)",
            justifyContent: "center",
          }}
        >
          {/* Prev */}
          <button
            onClick={handlePrev}
            disabled={!canPrev}
            aria-label="Previous album"
            style={{
              flexShrink: 0,
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: `1px solid ${canPrev ? accentColor + "60" : "transparent"}`,
              background: canPrev ? `${accentColor}10` : "transparent",
              color: canPrev ? accentColor : "var(--c-surface-3)",
              cursor: canPrev ? "pointer" : "not-allowed",
              opacity: canPrev ? 1 : 0.2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Album sleeve — card flip on change */}
          <div
            style={{
              flex: "0 0 auto",
              width: "clamp(200px, 52vw, 260px)",
              aspectRatio: "1 / 1",
              perspective: "800px",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ rotateY: -25, opacity: 0, scale: 0.96 }}
                animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                exit={{ rotateY: 15, opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: [
                    `0 0 0 1px ${accentColor}25`,
                    `0 6px 20px -4px ${accentColor}45`,
                    `0 20px 50px -10px ${accentColor}30`,
                    "0 2px 8px rgba(0,0,0,0.12)",
                  ].join(", "),
                  transformStyle: "preserve-3d",
                }}
              >
                <img
                  src={selected.art}
                  alt={selected.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  draggable={false}
                />
                {/* Bottom tint for depth */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "45%",
                    background: `linear-gradient(to top, ${accentColor}30, transparent)`,
                    pointerEvents: "none",
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next */}
          <button
            onClick={handleNext}
            disabled={!canNext}
            aria-label="Next album"
            style={{
              flexShrink: 0,
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: `1px solid ${canNext ? accentColor + "60" : "transparent"}`,
              background: canNext ? `${accentColor}10` : "transparent",
              color: canNext ? accentColor : "var(--c-surface-3)",
              cursor: canNext ? "pointer" : "not-allowed",
              opacity: canNext ? 1 : 0.2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* ── Album meta ─────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id + "-meta"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position: "relative",
              zIndex: 1,
              marginTop: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
              textAlign: "center",
            }}
          >
            {/* Type badge */}
            <span
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: "9px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: accentColor,
                background: `${accentColor}15`,
                padding: "3px 10px",
                borderRadius: "999px",
                border: `1px solid ${accentColor}30`,
              }}
            >
              {selected.type} · {selected.year}
            </span>

            {/* Title */}
            <h3
              style={{
                fontFamily: "var(--f-display)",
                fontSize: "clamp(22px, 6vw, 32px)",
                letterSpacing: "-0.03em",
                lineHeight: 1,
                color: "var(--c-ink)",
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              {selected.name}
            </h3>

            {/* Track count */}
            <span
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: "10px",
                color: "var(--c-ink)",
                opacity: 0.35,
                letterSpacing: "0.06em",
              }}
            >
              {selected.total_tracks} {selected.total_tracks === 1 ? "track" : "tracks"}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* ── Dot strip ──────────────────────────────── */}
        {albums.length > 1 && (
          <div
            style={{
              position: "relative",
              zIndex: 1,
              marginTop: "16px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "5px",
            }}
            role="tablist"
            aria-label="Album pages"
          >
            {albums.map((album, i) => (
              <button
                key={album.id}
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={album.name}
                onClick={() => onSelectAlbum(album)}
                style={{
                  width: i === activeIndex ? "22px" : "5px",
                  height: "5px",
                  borderRadius: "999px",
                  background: i === activeIndex ? accentColor : `${accentColor}35`,
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};