"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlbumDisplay } from "./AlbumDisplay";
import { TrackList } from "./TrackList";
import discographyData from "@/app/data/bini_discography.json";

type Album = (typeof discographyData.items)[0];
type FilterType = "All" | "Albums" | "EPs" | "Singles";

const IS_SINGLE = (n: number) => n <= 2;
const IS_EP     = (n: number) => n >= 3 && n <= 6;
const IS_ALBUM  = (n: number) => n >= 7;
const FILTERS: FilterType[] = ["All", "Albums", "EPs", "Singles"];

// Synced with AlbumDisplay order
const MEMBER_ACCENTS = [
  "#008691", // aiah
  "#B5E550", // colet
  "#FFC40C", // maloi
  "#FFA500", // gwen
  "#FF69B4", // stacey
  "#D94040", // mikha
  "#016795", // jhoanna
  "#DDA0DD", // sheena
];

export const Discography: React.FC = () => {
  const [filter, setFilter]               = useState<FilterType>("All");
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  const filteredAlbums = useMemo(() => {
    return discographyData.items.filter((item) => {
      const n = item.total_tracks || 0;
      if (filter === "All")     return true;
      if (filter === "Singles") return IS_SINGLE(n);
      if (filter === "EPs")     return IS_EP(n);
      if (filter === "Albums")  return IS_ALBUM(n);
      return false;
    });
  }, [filter]);

  // Keep selection valid
  React.useEffect(() => {
    if (!selectedAlbum || !filteredAlbums.find((a) => a.id === selectedAlbum.id)) {
      setSelectedAlbum(filteredAlbums[0] ?? null);
    }
  }, [filteredAlbums]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedIndex = filteredAlbums.findIndex((a) => a.id === selectedAlbum?.id);
  const accentColor   = MEMBER_ACCENTS[(selectedIndex < 0 ? 0 : selectedIndex) % MEMBER_ACCENTS.length];

  return (
    <section
      className="w-full py-16 sm:py-20"
      style={{ background: "var(--c-surface)", position: "relative", overflow: "hidden" }}
    >
      {/* Full-section ambient glow — very subtle */}
      <AnimatePresence>
        <motion.div
          key={accentColor + "-bg"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "120%",
            height: "320px",
            background: `radial-gradient(ellipse 70% 100% at 50% 0%, ${accentColor}12 0%, transparent 70%)`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      </AnimatePresence>

      <div
        className="max-w-[1320px] mx-auto px-4 sm:px-8 md:px-16"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* ── Header ───────────────────────────────────── */}
        <div style={{ marginBottom: "clamp(24px, 5vw, 40px)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <p
              className="text-label-mono"
              style={{
                display: "inline-block",
                alignSelf: "flex-start",
                color: "var(--c-surface)",
                background: "var(--c-teal-dark)",
                padding: "3px 10px",
                borderRadius: "2px",
              }}
            >
              Discography
            </p>

            <div className="flex items-end justify-between gap-6 flex-wrap">
              <h2
                style={{
                  fontFamily: "var(--f-display)",
                  fontSize: "clamp(56px, 9vw, 120px)",
                  letterSpacing: "-0.04em",
                  lineHeight: 0.88,
                  color: "var(--c-teal-dark)",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                Music
              </h2>

              {/* Desktop filters */}
              <div
                className="hidden sm:flex items-center gap-2 pb-2"
                role="group"
                aria-label="Filter discography"
              >
                {FILTERS.map((f) => (
                  <FilterPill
                    key={f}
                    label={f}
                    active={filter === f}
                    accentColor={accentColor}
                    onClick={() => setFilter(f)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile filters */}
        <div
          className="flex sm:hidden gap-2 mb-6 overflow-x-auto pb-1"
          role="group"
          aria-label="Filter discography"
          style={{ scrollbarWidth: "none" }}
        >
          {FILTERS.map((f) => (
            <FilterPill
              key={f}
              label={f}
              active={filter === f}
              accentColor={accentColor}
              onClick={() => setFilter(f)}
            />
          ))}
        </div>

        {/* Divider — accent-tinted */}
        <motion.div
          animate={{ background: `linear-gradient(90deg, ${accentColor}, var(--c-ink) 40%)` }}
          transition={{ duration: 0.5 }}
          style={{ height: "1.5px", marginBottom: "clamp(24px, 5vw, 40px)" }}
        />

        {/* ── Carousel ─────────────────────────────────── */}
        <AlbumDisplay
          albums={filteredAlbums}
          selectedId={selectedAlbum?.id ?? null}
          onSelectAlbum={setSelectedAlbum}
          accentColor={accentColor}
        />

        {/* ── Tracklist ────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {selectedAlbum && (
            <motion.div
              key={selectedAlbum.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              style={{ marginTop: "clamp(32px, 6vw, 56px)" }}
            >
              <TrackList
                tracks={selectedAlbum.tracks}
                spotifyAlbumUrl={selectedAlbum.spotify_url}
                accentColor={accentColor}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom spacer so floating player doesn't cover last track */}
        <div style={{ height: "100px" }} />
      </div>
    </section>
  );
};

// ── Sub-component: filter pill ──────────────────────────
function FilterPill({
  label,
  active,
  accentColor,
  onClick,
}: {
  label: string;
  active: boolean;
  accentColor: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      aria-pressed={active}
      animate={{
        background: active ? accentColor : "transparent",
        color: active ? "#fff" : "var(--c-ink)",
        borderColor: active ? accentColor : "var(--c-surface-3)",
        opacity: active ? 1 : 0.55,
      }}
      transition={{ duration: 0.2 }}
      style={{
        fontFamily: "var(--f-mono)",
        fontSize: "10px",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        padding: "6px 16px",
        borderRadius: "999px",
        border: "1.5px solid",
        cursor: "pointer",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
      whileTap={{ scale: 0.96 }}
    >
      {label}
    </motion.button>
  );
}