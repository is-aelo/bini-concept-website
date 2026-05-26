"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SpotifyLogo, CaretLeft, CaretRight } from "@phosphor-icons/react";
import discographyData from "../../bini_discography.json";
import { ReleaseArt } from "./ReleaseArt";
import DiscographyBackground from "./DiscographyBackground";

interface Track {
  id: string;
  name: string;
  preview_url: string | null;
  uri: string;
  duration: string;
}

interface DiscographyItem {
  id: string;
  name: string;
  type: string;
  release_date: string;
  year: string;
  total_tracks: number;
  art: string | null;
  spotify_url: string;
  tracks: Track[];
}

type CategoryType = "all" | "album" | "ep" | "single";

const TYPE_LABELS: Record<CategoryType, string> = {
  all: "All",
  album: "Albums",
  ep: "EPs",
  single: "Singles",
};

function getNormalizedType(item: DiscographyItem): string {
  const nameLower = item.name.toLowerCase();
  const typeLower = item.type?.toLowerCase();
  if (nameLower.includes("talaarawan") || nameLower.includes("ep")) return "ep";
  if (item.total_tracks >= 4 && item.total_tracks <= 6 && typeLower === "single") return "ep";
  return typeLower;
}

const SCROLL_STYLE = `
  .disc-scroll {
    scrollbar-width: thin;
    scrollbar-color: var(--c-surface-3) transparent;
  }
  .disc-scroll::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  .disc-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .disc-scroll::-webkit-scrollbar-thumb {
    background: var(--c-surface-3);
    border-radius: 99px;
  }
  .disc-scroll::-webkit-scrollbar-thumb:hover {
    background: var(--c-teal-dark);
  }
`;

export default function Discography() {
  const items = (discographyData.items || []) as DiscographyItem[];

  const [activeCategory, setActiveCategory] = useState<CategoryType>("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const shelfRef = useRef<HTMLDivElement>(null);

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return items;
    return items.filter((item) => getNormalizedType(item) === activeCategory);
  }, [items, activeCategory]);

  useEffect(() => {
    setActiveIndex(0);
    setActiveTrackId(null);
  }, [activeCategory]);

  const selectedRelease = filteredItems[activeIndex] ?? null;

  const goTo = (idx: number) => {
    const clamped = Math.max(0, Math.min(filteredItems.length - 1, idx));
    setActiveIndex(clamped);
    setActiveTrackId(null);

    setTimeout(() => {
      const shelf = shelfRef.current;
      if (!shelf) return;
      const btn = shelf.querySelectorAll<HTMLButtonElement>("[data-shelf-item]")[clamped];
      if (btn) btn.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" });
    }, 50);
  };

  if (!selectedRelease) return null;

  const prevRelease = filteredItems[activeIndex - 1] ?? null;
  const nextRelease = filteredItems[activeIndex + 1] ?? null;

  const embedUrl = `https://open.spotify.com/embed/track/${
    activeTrackId || selectedRelease.tracks?.[0]?.id || selectedRelease.id
  }?utm_source=generator&theme=0`;

  const nType = getNormalizedType(selectedRelease);

  return (
    <section className="w-full relative overflow-hidden" style={{ background: "var(--c-surface)" }}>
      <DiscographyBackground />
      <style>{SCROLL_STYLE}</style>

      {/* ── HERO: teal full-bleed ──────────────────────────────────── */}
      <div
        className="relative z-10 w-full flex flex-col items-center"
        style={{ background: "var(--c-teal)", paddingTop: "56px" }}
      >
        {/* Section eyebrow */}
        <p
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: "10px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--c-teal-pale)",
            opacity: 0.75,
            marginBottom: "8px",
          }}
        >
          BINI Official Music
        </p>

        {/* Section title */}
        <h2
          style={{
            fontFamily: "var(--f-display)",
            fontSize: "clamp(56px, 14vw, 120px)",
            letterSpacing: "-0.04em",
            lineHeight: 0.88,
            color: "var(--c-teal-pale)",
            textTransform: "uppercase",
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          Discography
        </h2>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap justify-center" style={{ marginBottom: "40px" }}>
          {(["all", "album", "ep", "single"] as CategoryType[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: "10px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "6px 16px",
                borderRadius: "999px",
                border: activeCategory === cat
                  ? "1.5px solid var(--c-teal-pale)"
                  : "1.5px solid rgba(229,248,250,0.35)",
                background: activeCategory === cat ? "var(--c-teal-pale)" : "transparent",
                color: activeCategory === cat ? "var(--c-teal-dark)" : "var(--c-teal-pale)",
                opacity: activeCategory === cat ? 1 : 0.7,
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
            >
              {TYPE_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* ── CAROUSEL ─────────────────────────────────────────────── */}
        <div
          className="w-full flex items-end justify-center"
          style={{ gap: "clamp(12px, 3vw, 28px)", padding: "0 16px" }}
        >
          {/* Prev album */}
          <AnimatePresence mode="wait">
            {prevRelease ? (
              <motion.button
                key={prevRelease.id}
                onClick={() => goTo(activeIndex - 1)}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  opacity: 0.42,
                  transform: "scale(0.78)",
                  transformOrigin: "bottom center",
                  flexShrink: 0,
                }}
              >
                <ReleaseArt
                  src={prevRelease.art}
                  alt={prevRelease.name}
                  size={100}
                  radius={12}
                />
                <p style={{ fontFamily: "var(--f-mono)", fontSize: "9px", color: "var(--c-teal-pale)", letterSpacing: "0.05em", textAlign: "center", maxWidth: "90px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {prevRelease.name}
                </p>
              </motion.button>
            ) : (
              <div style={{ width: "100px", flexShrink: 0, opacity: 0 }} />
            )}
          </AnimatePresence>

          {/* Active (center) album */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedRelease.id}
              initial={{ opacity: 0, y: 12, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                flexShrink: 0,
              }}
            >
              <ReleaseArt
                src={selectedRelease.art}
                alt={selectedRelease.name}
                size={160}
                radius={18}
                selected
              />
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontFamily: "var(--f-display)",
                    fontSize: "clamp(18px, 5vw, 26px)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    color: "var(--c-teal-pale)",
                    textTransform: "uppercase",
                    marginBottom: "3px",
                    maxWidth: "200px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selectedRelease.name}
                </p>
                <p style={{ fontFamily: "var(--f-mono)", fontSize: "10px", color: "var(--c-teal-pale)", opacity: 0.65, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {nType} · {selectedRelease.year} · {selectedRelease.total_tracks} tracks
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Next album */}
          <AnimatePresence mode="wait">
            {nextRelease ? (
              <motion.button
                key={nextRelease.id}
                onClick={() => goTo(activeIndex + 1)}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  opacity: 0.42,
                  transform: "scale(0.78)",
                  transformOrigin: "bottom center",
                  flexShrink: 0,
                }}
              >
                <ReleaseArt
                  src={nextRelease.art}
                  alt={nextRelease.name}
                  size={100}
                  radius={12}
                />
                <p style={{ fontFamily: "var(--f-mono)", fontSize: "9px", color: "var(--c-teal-pale)", letterSpacing: "0.05em", textAlign: "center", maxWidth: "90px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {nextRelease.name}
                </p>
              </motion.button>
            ) : (
              <div style={{ width: "100px", flexShrink: 0, opacity: 0 }} />
            )}
          </AnimatePresence>
        </div>

        {/* Nav dots + arrows */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "24px", marginBottom: "28px" }}>
          <button
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous release"
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              border: "1.5px solid rgba(229,248,250,0.4)",
              background: "transparent",
              color: "var(--c-teal-pale)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: activeIndex === 0 ? "not-allowed" : "pointer",
              opacity: activeIndex === 0 ? 0.3 : 0.8,
              transition: "opacity 0.15s",
            }}
          >
            <CaretLeft size={14} weight="bold" />
          </button>

          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            {filteredItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                aria-label={`Go to release ${idx + 1}`}
                style={{
                  width: idx === activeIndex ? "20px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  background: idx === activeIndex ? "var(--c-teal-pale)" : "rgba(229,248,250,0.35)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "width 0.25s var(--ease-smooth), background 0.2s",
                }}
              />
            ))}
          </div>

          <button
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex === filteredItems.length - 1}
            aria-label="Next release"
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              border: "1.5px solid rgba(229,248,250,0.4)",
              background: "transparent",
              color: "var(--c-teal-pale)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: activeIndex === filteredItems.length - 1 ? "not-allowed" : "pointer",
              opacity: activeIndex === filteredItems.length - 1 ? 0.3 : 0.8,
              transition: "opacity 0.15s",
            }}
          >
            <CaretRight size={14} weight="bold" />
          </button>
        </div>
      </div>

      {/* ── MINI SHELF ────────────────────────────────────────────── */}
      <div
        className="relative z-10 w-full"
        style={{ background: "var(--c-surface-2)", borderTop: "1px solid var(--c-surface-3)" }}
      >
        <div style={{ padding: "16px 20px 4px" }}>
          <p style={{ fontFamily: "var(--f-mono)", fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--c-ink)", opacity: 0.4 }}>
            All releases
          </p>
        </div>
        <div
          ref={shelfRef}
          className="disc-scroll"
          style={{ display: "flex", gap: "10px", overflowX: "auto", padding: "10px 20px 18px" }}
        >
          {filteredItems.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={item.id}
                data-shelf-item
                onClick={() => goTo(idx)}
                style={{
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "5px",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                <ReleaseArt
                  src={item.art}
                  alt={item.name}
                  size={56}
                  radius={8}
                  selected={isActive}
                />
                <span
                  style={{
                    fontFamily: "var(--f-mono)",
                    fontSize: "8px",
                    color: isActive ? "var(--c-teal-dark)" : "var(--c-ink)",
                    opacity: isActive ? 1 : 0.4,
                    maxWidth: "56px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    transition: "color 0.15s, opacity 0.15s",
                  }}
                >
                  {item.year}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── DETAIL + SPOTIFY EMBED ────────────────────────────────── */}
      <div
        className="relative z-10 w-full max-w-[680px] mx-auto"
        style={{ padding: "32px 20px 56px" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedRelease.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {/* Release header */}
            <div>
              <p style={{ fontFamily: "var(--f-mono)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--c-teal-dark)", marginBottom: "4px" }}>
                {nType} · {selectedRelease.year}
              </p>
              <h3
                style={{
                  fontFamily: "var(--f-display)",
                  fontSize: "clamp(28px, 8vw, 48px)",
                  letterSpacing: "-0.04em",
                  lineHeight: 0.92,
                  color: "var(--c-ink)",
                  textTransform: "uppercase",
                }}
              >
                {selectedRelease.name}
              </h3>
            </div>

            {/* Spotify embed */}
            <div style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid var(--c-surface-3)" }}>
              <iframe
                src={embedUrl}
                width="100%"
                height="152"
                style={{ display: "block", border: "none" }}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>

            {/* Tracklist */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: "8px",
                  borderBottom: "1px solid var(--c-ink)",
                  marginBottom: "2px",
                }}
              >
                <span style={{ fontFamily: "var(--f-mono)", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--c-ink)", opacity: 0.4 }}>Track</span>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--c-ink)", opacity: 0.4 }}>Duration</span>
              </div>

              {selectedRelease.tracks.map((track, idx) => {
                const isActive = activeTrackId === track.id || (!activeTrackId && idx === 0);
                return (
                  <button
                    key={track.id}
                    onClick={() => setActiveTrackId(track.id)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "9px 0",
                      borderBottom: "0.5px solid var(--c-surface-3)",
                      background: "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--f-mono)",
                        fontSize: "9px",
                        color: isActive ? "var(--c-teal-dark)" : "var(--c-ink)",
                        opacity: isActive ? 1 : 0.3,
                        width: "22px",
                        flexShrink: 0,
                        textAlign: "right",
                        transition: "color 0.15s",
                      }}
                    >
                      {isActive ? "▶" : String(idx + 1).padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        flex: 1,
                        fontSize: "13px",
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? "var(--c-teal-dark)" : "var(--c-ink)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        transition: "color 0.15s",
                      }}
                    >
                      {track.name}
                    </span>
                    <span style={{ fontFamily: "var(--f-mono)", fontSize: "10px", color: "var(--c-ink)", opacity: 0.35, flexShrink: 0 }}>
                      {track.duration}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Spotify CTA */}
            <a
              href={selectedRelease.spotify_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{
                alignSelf: "flex-start",
                fontFamily: "var(--f-mono)",
                fontSize: "11px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              <SpotifyLogo size={14} weight="fill" />
              Stream on Spotify
            </a>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}