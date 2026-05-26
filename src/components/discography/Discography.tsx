"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaretDown } from "@phosphor-icons/react";
import { AlbumDisplay } from "./AlbumDisplay";
import { TrackList } from "./TrackList";
import discographyData from "@/app/data/bini_discography.json";

type Album = (typeof discographyData.items)[0];
type FilterType = "All" | "Albums" | "EPs" | "Singles";

const IS_SINGLE = (n: number) => n <= 2;
const IS_EP = (n: number) => n >= 3 && n <= 6;
const IS_ALBUM = (n: number) => n >= 7;
const FILTERS: FilterType[] = ["All", "Albums", "EPs", "Singles"];
const PLAYER_WIDTH = "min(100%, 520px)";

const MEMBER_ACCENTS = [
  "#008691", "#B5E550", "#FFC40C", "#FFA500", 
  "#FF69B4", "#D94040", "#016795", "#DDA0DD",
];

function trackUriToId(uri: string): string | null {
  const m = uri?.match(/spotify:track:([a-zA-Z0-9]+)/);
  return m ? m[1] : null;
}

function trackEmbedSrc(trackId: string): string {
  return `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
}

export const Discography: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>("All");
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<{ albumId: string; trackId: string | null } | null>(null);
  const [isTracklistOpen, setIsTracklistOpen] = useState(true);
  const tracklistId = React.useId();

  const filteredAlbums = useMemo(() => {
    return discographyData.items.filter((item) => {
      const n = item.total_tracks || 0;
      if (filter === "All") return true;
      if (filter === "Singles") return IS_SINGLE(n);
      if (filter === "EPs") return IS_EP(n);
      if (filter === "Albums") return IS_ALBUM(n);
      return false;
    });
  }, [filter]);

  const activeAlbum = useMemo(() => {
    if (selectedAlbum && filteredAlbums.some((a) => a.id === selectedAlbum.id)) {
      return selectedAlbum;
    }

    return filteredAlbums[0] ?? null;
  }, [filteredAlbums, selectedAlbum]);

  const selectedIndex = filteredAlbums.findIndex((a) => a.id === activeAlbum?.id);
  const accentColor = MEMBER_ACCENTS[(selectedIndex < 0 ? 0 : selectedIndex) % MEMBER_ACCENTS.length];
  const defaultTrackId = activeAlbum?.tracks.map((track) => trackUriToId(track.uri)).find(Boolean) ?? null;
  const activeTrackId =
    selectedTrack?.albumId === activeAlbum?.id ? selectedTrack.trackId ?? defaultTrackId : defaultTrackId;
  const embedSrc = activeTrackId ? trackEmbedSrc(activeTrackId) : null;

  const handleSelectTrack = (trackId: string) => {
    if (!activeAlbum) return;
    setSelectedTrack({ albumId: activeAlbum.id, trackId });
  };

  return (
    <section
      style={{
        background: "var(--c-surface)",
        position: "relative",
        overflowX: "clip",
        overflowY: "visible",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "80px 0",
      }}
    >
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
        className="max-w-[1320px] w-full px-4 sm:px-8 md:px-16"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div
          style={{
            position: "sticky",
            top: "clamp(76px, 9vw, 104px)",
            zIndex: 5,
            background: "var(--c-surface)",
            paddingBottom: "clamp(14px, 3vw, 24px)",
          }}
        >
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

                <div className="hidden sm:flex items-center gap-2 pb-2">
                  {FILTERS.map((f) => (
                    <FilterPill
                      key={f}
                      label={f}
                      active={filter === f}
                      onClick={() => setFilter(f)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex sm:hidden gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none", marginBottom: "1.5rem" }}>
            {FILTERS.map((f) => (
              <FilterPill
                key={f}
                label={f}
                active={filter === f}
                onClick={() => setFilter(f)}
              />
            ))}
          </div>

          <motion.div
            animate={{ background: `linear-gradient(90deg, ${accentColor}, var(--c-ink) 40%)` }}
            transition={{ duration: 0.5 }}
            style={{ height: "1.5px", marginBottom: "clamp(24px, 5vw, 40px)" }}
          />

          <AlbumDisplay
            albums={filteredAlbums}
            selectedId={activeAlbum?.id ?? null}
            onSelectAlbum={setSelectedAlbum}
            accentColor={accentColor}
          />

          {activeAlbum?.spotify_url && (
            <SpotifyCta
              href={activeAlbum.spotify_url}
              accentColor={accentColor}
              width={PLAYER_WIDTH}
            />
          )}

          <AnimatePresence mode="wait">
            {embedSrc && (
              <motion.div
                key={embedSrc}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{
                  width: PLAYER_WIDTH,
                  margin: "14px auto 0",
                  borderRadius: "14px",
                  overflow: "hidden",
                  border: `1.5px solid ${accentColor}45`,
                  boxShadow: `0 4px 24px -4px ${accentColor}30, 0 2px 8px rgba(0,0,0,0.08)`,
                }}
              >
                <iframe
                  title="30s track preview"
                  src={embedSrc}
                  width="100%"
                  height="80"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  style={{ display: "block", border: "none" }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <TracklistToggle
            isOpen={isTracklistOpen}
            onToggle={() => setIsTracklistOpen((prev) => !prev)}
            tracklistId={tracklistId}
          />
        </div>

        {activeAlbum && (
          <TrackList
            tracks={activeAlbum.tracks}
            activeTrackId={activeTrackId}
            onSelectTrack={handleSelectTrack}
            isOpen={isTracklistOpen}
            tracklistId={tracklistId}
            accentColor={accentColor}
          />
        )}
      </div>
    </section>
  );
};

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      aria-pressed={active}
      animate={{
        background: active ? "var(--c-teal-dark)" : "transparent",
        color: active ? "#fff" : "var(--c-ink)",
        borderColor: active ? "var(--c-teal-dark)" : "var(--c-surface-3)",
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
      }}
      whileTap={{ scale: 0.96 }}
    >
      {label}
    </motion.button>
  );
}

function TracklistToggle({
  isOpen,
  onToggle,
  tracklistId,
}: {
  isOpen: boolean;
  onToggle: () => void;
  tracklistId: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls={tracklistId}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginTop: "16px",
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <span style={{ fontFamily: "var(--f-mono)", fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--c-ink)", opacity: 0.35 }}>
        Tracklist
      </span>
      <div style={{ flex: 1, height: "1px", background: "var(--c-surface-3)" }} />
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.18 }}
        style={{ color: "var(--c-ink)", opacity: 0.35, lineHeight: 1 }}
      >
        <CaretDown size={14} weight="bold" />
      </motion.span>
    </button>
  );
}

function SpotifyCta({ href, accentColor, width }: { href: string; accentColor: string; width: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        width,
        margin: "clamp(14px, 3vw, 20px) auto 0",
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
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: accentColor, flexShrink: 0 }}>
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
      Listen on Spotify
    </a>
  );
}
