"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SpotifyLogo } from "@phosphor-icons/react";
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
  const [selectedRelease, setSelectedRelease] = useState<DiscographyItem | null>(items[0] || null);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [drawerExpanded, setDrawerExpanded] = useState(true);

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return items;
    return items.filter((item) => getNormalizedType(item) === activeCategory);
  }, [items, activeCategory]);

  if (!selectedRelease) return null;

  const selectRelease = (item: DiscographyItem) => {
    setSelectedRelease(item);
    setActiveTrackId(null);
    setDrawerExpanded(true);
    setMobileDetailOpen(true);
  };

  const embedUrl = `https://open.spotify.com/embed/track/${
    activeTrackId || selectedRelease.tracks?.[0]?.id || selectedRelease.id
  }?utm_source=generator&theme=0`;

  return (
    <section className="w-full py-20 relative" style={{ background: "var(--c-surface)" }}>

      {/* ── Blob gradient background ──────────────────────────────── */}
      <DiscographyBackground />

      <style>{SCROLL_STYLE}</style>

      <div className="relative z-10 w-full max-w-[1320px] mx-auto px-4 sm:px-8 md:px-16">

        {/* ── HEADER ─────────────────────────────────────────────────── */}
        <div className="mb-10 flex flex-col gap-1">
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
            BINI Official Music
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
              }}
            >
              Disco<br />graphy
            </h2>

            {/* Filters — desktop */}
            <div className="hidden sm:flex items-center gap-2 pb-2 flex-wrap">
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
                      ? "1.5px solid var(--c-teal-dark)"
                      : "1.5px solid var(--c-surface-3)",
                    background: activeCategory === cat ? "var(--c-teal-dark)" : "transparent",
                    color: activeCategory === cat ? "#fff" : "var(--c-ink)",
                    opacity: activeCategory === cat ? 1 : 0.6,
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                >
                  {TYPE_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filters — mobile */}
        <div className="flex sm:hidden gap-2 mb-6 overflow-x-auto pb-1 disc-scroll">
          {(["all", "album", "ep", "single"] as CategoryType[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: "10px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "5px 14px",
                borderRadius: "999px",
                border: activeCategory === cat
                  ? "1.5px solid var(--c-teal-dark)"
                  : "1.5px solid var(--c-surface-3)",
                background: activeCategory === cat ? "var(--c-teal-dark)" : "transparent",
                color: activeCategory === cat ? "#fff" : "var(--c-ink)",
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
            >
              {TYPE_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: "1.5px", background: "var(--c-ink)" }} />

        {/* ── DESKTOP LAYOUT ─────────────────────────────────────────── */}
        <div className="hidden lg:grid lg:grid-cols-[340px_1fr] lg:items-start">

          {/* LEFT: scrollable release list */}
          <div className="border-r" style={{ borderColor: "var(--c-ink)" }}>
            <div
              className="pr-6 py-3 border-b flex justify-between items-center"
              style={{ borderColor: "var(--c-surface-3)" }}
            >
              <span style={{ fontFamily: "var(--f-mono)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--c-ink)", opacity: 0.4 }}>
                Release
              </span>
              <span style={{ fontFamily: "var(--f-mono)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--c-ink)", opacity: 0.4 }}>
                Year
              </span>
            </div>

            <div
              className="disc-scroll"
              style={{ height: "560px", overflowY: "auto", paddingRight: "6px" }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  {filteredItems.map((item, idx) => {
                    const isSelected = selectedRelease.id === item.id;
                    const nType = getNormalizedType(item);
                    return (
                      <button
                        key={item.id}
                        onClick={() => selectRelease(item)}
                        className="w-full text-left"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "10px 0",
                          paddingRight: "18px",
                          borderBottom: "0.5px solid var(--c-surface-3)",
                          background: isSelected ? "rgba(58,170,182,0.07)" : "transparent",
                          transition: "background 0.15s ease",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ width: "3px", alignSelf: "stretch", background: isSelected ? "var(--c-teal-dark)" : "transparent", transition: "background 0.15s ease", flexShrink: 0 }} />
                        <span style={{ fontFamily: "var(--f-mono)", fontSize: "9px", color: "var(--c-ink)", opacity: 0.3, width: "18px", flexShrink: 0 }}>
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <ReleaseArt src={item.art} alt={item.name} size={40} radius={4} selected={isSelected} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: "13px", fontWeight: isSelected ? 700 : 500, color: "var(--c-ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "2px" }}>
                            {item.name}
                          </p>
                          <span style={{ fontFamily: "var(--f-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: nType === "album" ? "var(--c-teal-dark)" : nType === "ep" ? "var(--c-gwen)" : "var(--c-mikha)", opacity: 0.85 }}>
                            {nType} · {item.total_tracks} tracks
                          </span>
                        </div>
                        <span style={{ fontFamily: "var(--f-mono)", fontSize: "10px", color: "var(--c-ink)", opacity: 0.4, flexShrink: 0 }}>
                          {item.year}
                        </span>
                      </button>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT: detail panel */}
          <div className="pl-10 pt-6 pb-6">
            <DetailPanel
              release={selectedRelease}
              activeTrackId={activeTrackId}
              setActiveTrackId={setActiveTrackId}
              embedUrl={embedUrl}
            />
          </div>
        </div>

        {/* ── MOBILE LAYOUT ──────────────────────────────────────────── */}
        <div className="lg:hidden">

          {/* Horizontal thumbnail strip */}
          <div className="disc-scroll" style={{ overflowX: "auto" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{ display: "flex", gap: "10px", padding: "14px 0 16px" }}
              >
                {filteredItems.map((item) => {
                  const isSelected = selectedRelease.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => selectRelease(item)}
                      style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", background: "none", border: "none", padding: 0, cursor: "pointer" }}
                    >
                      <ReleaseArt src={item.art} alt={item.name} size={64} radius={6} selected={isSelected} />
                      <span style={{ fontFamily: "var(--f-mono)", fontSize: "8px", color: isSelected ? "var(--c-teal-dark)" : "var(--c-ink)", opacity: isSelected ? 1 : 0.45, maxWidth: "64px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", transition: "color 0.15s, opacity 0.15s" }}>
                        {item.year}
                      </span>
                    </button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Selected release name + View button */}
          <div style={{ borderTop: "0.5px solid var(--c-surface-3)", paddingTop: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontFamily: "var(--f-mono)", fontSize: "8px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--c-teal-dark)", marginBottom: "2px" }}>
                {getNormalizedType(selectedRelease)} · {selectedRelease.year}
              </p>
              <p style={{ fontFamily: "var(--f-display)", fontSize: "22px", letterSpacing: "-0.03em", lineHeight: 1, color: "var(--c-ink)", textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {selectedRelease.name}
              </p>
            </div>
            <button
              onClick={() => { setDrawerExpanded(true); setMobileDetailOpen(true); }}
              style={{ flexShrink: 0, fontFamily: "var(--f-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", padding: "7px 14px", borderRadius: "999px", border: "1.5px solid var(--c-ink)", background: "transparent", color: "var(--c-ink)", cursor: "pointer" }}
            >
              View ↗
            </button>
          </div>
        </div>

        {/* ── MOBILE: Collapsible bottom drawer ──────────────────────── */}
        <AnimatePresence>
          {mobileDetailOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-40 lg:hidden"
                style={{ background: "rgba(12,12,10,0.4)", pointerEvents: drawerExpanded ? "auto" : "none" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: drawerExpanded ? 1 : 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setDrawerExpanded(false)}
              />

              <motion.div
                className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
                style={{
                  background: "var(--c-surface)",
                  borderRadius: "18px 18px 0 0",
                  boxShadow: "0 -8px 40px rgba(12,12,10,0.12)",
                  paddingBottom: "env(safe-area-inset-bottom, 12px)",
                  overflow: "hidden",
                }}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 34 }}
              >
                <button
                  onClick={() => setDrawerExpanded((v) => !v)}
                  style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "stretch", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  aria-label={drawerExpanded ? "Collapse drawer" : "Expand drawer"}
                >
                  <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 6px" }}>
                    <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "var(--c-surface-3)" }} />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "6px 20px 12px", borderBottom: drawerExpanded ? "0.5px solid var(--c-surface-3)" : "none" }}>
                    <ReleaseArt src={selectedRelease.art} alt={selectedRelease.name} size={44} radius={6} />
                    <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                      <p style={{ fontFamily: "var(--f-mono)", fontSize: "8px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--c-teal-dark)", marginBottom: "2px" }}>
                        {getNormalizedType(selectedRelease)} · {selectedRelease.year}
                      </p>
                      <p style={{ fontFamily: "var(--f-display)", fontSize: "18px", letterSpacing: "-0.02em", lineHeight: 1, color: "var(--c-ink)", textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {selectedRelease.name}
                      </p>
                    </div>
                    <motion.span
                      animate={{ rotate: drawerExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ flexShrink: 0, color: "var(--c-ink)", opacity: 0.4, fontSize: "16px", lineHeight: 1, display: "block" }}
                    >
                      ↑
                    </motion.span>
                  </div>
                </button>

                <motion.div
                  initial={false}
                  animate={{ height: drawerExpanded ? "auto" : 0, opacity: drawerExpanded ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 320, damping: 36 }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="disc-scroll" style={{ maxHeight: "58vh", overflowY: "auto", padding: "16px 20px 24px" }}>
                    <DetailPanel
                      release={selectedRelease}
                      activeTrackId={activeTrackId}
                      setActiveTrackId={setActiveTrackId}
                      embedUrl={embedUrl}
                      compact
                    />
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}

/* ── DETAIL PANEL ──────────────────────────────────────────────────── */
interface DetailPanelProps {
  release: DiscographyItem;
  activeTrackId: string | null;
  setActiveTrackId: (id: string) => void;
  embedUrl: string;
  compact?: boolean;
}

function DetailPanel({ release, activeTrackId, setActiveTrackId, embedUrl, compact }: DetailPanelProps) {
  return (
    <motion.div
      key={release.id}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col gap-6"
    >
      {/* Release meta — no cover art (embed has it). Hidden in compact/drawer mode. */}
      {!compact && (
        <div style={{ paddingTop: "4px" }}>
          <p style={{ fontFamily: "var(--f-mono)", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--c-teal-dark)", marginBottom: "6px" }}>
            {getNormalizedType(release)} · {release.year}
          </p>
          <h3 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(22px, 5vw, 36px)", letterSpacing: "-0.03em", lineHeight: 0.95, color: "var(--c-ink)", textTransform: "uppercase", marginBottom: "8px" }}>
            {release.name}
          </h3>
          <p style={{ fontFamily: "var(--f-mono)", fontSize: "10px", color: "var(--c-ink)", opacity: 0.45 }}>
            {release.total_tracks} tracks
          </p>
        </div>
      )}

      {/* Spotify embed */}
      <div style={{ borderRadius: "8px", overflow: "hidden" }}>
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
        <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid var(--c-ink)", marginBottom: "2px" }}>
          <span style={{ fontFamily: "var(--f-mono)", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--c-ink)", opacity: 0.4 }}>Track</span>
          <span style={{ fontFamily: "var(--f-mono)", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--c-ink)", opacity: 0.4 }}>Duration</span>
        </div>

        <div>
          {release.tracks.map((track, idx) => {
            const isActive = activeTrackId === track.id || (!activeTrackId && idx === 0);
            return (
              <button
                key={track.id}
                onClick={() => setActiveTrackId(track.id)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "9px 0", borderBottom: "0.5px solid var(--c-surface-3)", background: "transparent", cursor: "pointer", textAlign: "left" }}
              >
                <span style={{ fontFamily: "var(--f-mono)", fontSize: "9px", color: isActive ? "var(--c-teal-dark)" : "var(--c-ink)", opacity: isActive ? 1 : 0.3, width: "22px", flexShrink: 0, textAlign: "right" }}>
                  {isActive ? "▶" : String(idx + 1).padStart(2, "0")}
                </span>
                <span style={{ flex: 1, fontSize: "13px", fontWeight: isActive ? 600 : 400, color: isActive ? "var(--c-teal-dark)" : "var(--c-ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", transition: "color 0.15s" }}>
                  {track.name}
                </span>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: "10px", color: "var(--c-ink)", opacity: 0.35, flexShrink: 0 }}>
                  {track.duration}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Spotify CTA */}
      <a
        href={release.spotify_url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "11px 20px", borderRadius: "999px", background: "var(--c-ink)", color: "#fff", fontSize: "11px", fontFamily: "var(--f-mono)", letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", alignSelf: "flex-start", transition: "background 0.2s" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--c-teal-dark)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--c-ink)")}
      >
        <SpotifyLogo size={14} weight="fill" />
        Stream on Spotify
      </a>
    </motion.div>
  );
}