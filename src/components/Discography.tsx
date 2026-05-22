"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import discographyData from "../../bini_discography.json";

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

const memberColors = [
  "var(--c-aiah)",
  "var(--c-colet)",
  "var(--c-maloi)",
  "var(--c-gwen)",
  "var(--c-stacey)",
  "var(--c-mikha)",
  "var(--c-jhoanna)",
  "var(--c-sheena)"
];

type CategoryType = "all" | "album" | "ep" | "single";

export default function Discography() {
  const items = (discographyData.items || []) as DiscographyItem[];
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const albumRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [activeCategory, setActiveCategory] = useState<CategoryType>("all");
  const [selectedRelease, setSelectedRelease] = useState<DiscographyItem | null>(items[0] || null);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const getNormalizedType = (item: DiscographyItem): string => {
    const nameLower = item.name.toLowerCase();
    const typeLower = item.type?.toLowerCase();

    if (nameLower.includes("talaarawan") || nameLower.includes("ep")) return "ep";

    if (item.total_tracks >= 4 && item.total_tracks <= 6 && typeLower === "single") {
      return "ep";
    }

    return typeLower;
  };

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return items;
    return items.filter((item) => getNormalizedType(item) === activeCategory);
  }, [items, activeCategory]);

  const checkScrollPosition = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScrollLeft = scrollWidth - clientWidth;
    const epsilon = 1;

    setCanScrollLeft(scrollLeft > epsilon);
    setCanScrollRight(scrollLeft < maxScrollLeft - epsilon);
  };

  const safeCheckScroll = () => {
    requestAnimationFrame(() => {
      checkScrollPosition();
    });
  };

  useEffect(() => {
    if (filteredItems.length > 0) {
      const exists = filteredItems.some((item) => item.id === selectedRelease?.id);
      if (!exists) {
        setSelectedRelease(filteredItems[0]);
        setActiveTrackId(null);
      }
    }
    safeCheckScroll();
  }, [filteredItems]);

  useEffect(() => {
    if (selectedRelease && scrollContainerRef.current) {
      const index = filteredItems.findIndex(i => i.id === selectedRelease.id);
      const activeEl = albumRefs.current[index];
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center"
        });
      }
    }
  }, [selectedRelease, filteredItems]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const onScroll = () => checkScrollPosition();

    container.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);

    safeCheckScroll();

    return () => {
      container.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [filteredItems]);

  if (!selectedRelease) return null;

  const selectedIndex = items.findIndex((i) => i.id === selectedRelease.id);
  const selectedColor = memberColors[selectedIndex >= 0 ? selectedIndex % memberColors.length : 0];

  const getEmbedUrl = (albumId: string, trackId: string | null) => {
    const targetId = trackId || selectedRelease.tracks[0]?.id || albumId;
    return `https://open.spotify.com/embed/track/${targetId}?utm_source=generator&theme=0`;
  };

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = direction === "left" ? -200 : 200;

    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth"
    });

    setTimeout(safeCheckScroll, 150);
    setTimeout(safeCheckScroll, 400);
  };

  return (
    <section className="w-full py-20 relative overflow-hidden">
      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.15); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${selectedColor || "rgba(0,0,0,0.3)"}; }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(0, 0, 0, 0.15) rgba(0, 0, 0, 0.05); }
        .track-item { transition: all 0.3s var(--ease-smooth); }
        .track-item.active { background-color: ${selectedColor} !important; color: #F5F3EE !important; }
        .track-item.active .opacity-50 { opacity: 1 !important; color: #F5F3EE !important; }
        `
      }} />

      <div
        className="absolute right-[-120px] top-[180px] w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: selectedColor, opacity: 0.18 }}
      />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="text-label-mono text-[var(--c-ink)] mb-2">BINI OFFICIAL MUSIC</p>
            <h3 className="text-5xl md:text-7xl text-[var(--c-teal-dark)] leading-none">Discography</h3>
          </div>
        </div>

        <div className="flex gap-2 mb-10 border-b border-[var(--c-teal-dark)]/10 pb-4 overflow-x-auto hide-scrollbar whitespace-nowrap">
          {(["all", "album", "ep", "single"] as CategoryType[]).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-[10px] sm:text-xs uppercase tracking-wider transition-all shrink-0
                ${activeCategory === category
                  ? "bg-[#E8739A] text-white font-bold"
                  : "bg-[var(--c-surface-2)]/60 text-[var(--c-ink)] opacity-70 hover:opacity-100"
                }`}
            >
              {category === "all" ? "All Releases" : `${category}s`}
            </button>
          ))}
        </div>

        <div className="relative -mx-4 sm:-mx-8 md:-mx-16">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[var(--c-surface)] via-[var(--c-surface)]/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[var(--c-surface)] via-[var(--c-surface)]/80 to-transparent z-20 pointer-events-none" />
          
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pt-4 pb-6 px-16 sm:px-24 md:px-32 hide-scrollbar items-center"
          >
            {filteredItems.map((item, index) => {
              const isSelected = item.id === selectedRelease.id;
              const globalIndex = items.findIndex((i) => i.id === item.id);
              const color = memberColors[globalIndex % memberColors.length];

              return (
                <button
                  key={item.id}
                  ref={(el) => { albumRefs.current[index] = el; }}
                  onClick={() => {
                    setSelectedRelease(item);
                    setActiveTrackId(null);
                  }}
                  className={`snap-center shrink-0 w-[140px] sm:w-[190px] text-left group transition-all duration-500 ${
                    isSelected ? "scale-110 md:scale-100" : "scale-90 opacity-50"
                  }`}
                >
                  <div
                    className={`aspect-square overflow-hidden transition-all duration-300 rounded-xl ${
                      isSelected ? "scale-[1.02]" : ""
                    }`}
                    style={{
                      border: isSelected ? "3px solid #fff" : "3px solid transparent",
                      outline: isSelected ? `2px solid ${color}` : "none",
                      boxShadow: isSelected ? `0 10px 25px -5px ${color}` : "none"
                    }}
                  >
                    {item.art && (
                      <img src={item.art} alt={item.name} className="w-full h-full object-cover" />
                    )}
                  </div>

                  <div className="mt-4 px-1">
                    <span
                      className="text-[9px] px-2 py-0.5 rounded-full font-mono"
                      style={{
                        backgroundColor: isSelected ? color : "rgba(0,0,0,0.05)",
                        color: isSelected ? "#fff" : "var(--c-ink)"
                      }}
                    >
                      {item.year}
                    </span>
                    <h4 className="text-sm font-bold mt-2 leading-none text-[var(--c-teal-dark)] truncate">
                      {item.name}
                    </h4>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-2">
          <motion.button
            disabled={!canScrollLeft}
            onClick={() => handleScroll("left")}
            className={`h-12 w-12 rounded-full flex items-center justify-center border ${!canScrollLeft ? "opacity-30" : ""}`}
          >
            <CaretLeft size={18} weight="bold" />
          </motion.button>

          <motion.button
            disabled={!canScrollRight}
            onClick={() => handleScroll("right")}
            className={`h-12 w-12 rounded-full flex items-center justify-center text-white ${!canScrollRight ? "opacity-30" : ""}`}
            style={{ background: `linear-gradient(135deg, var(--c-teal), var(--c-teal-dark))` }}
          >
            <CaretRight size={18} weight="bold" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[420px_1fr] gap-10 mt-12 items-start">
          <div className="space-y-6 md:sticky md:top-24">
            {/* Spotify Embed Player - now first */}
            <div className="rounded-md overflow-hidden shadow-md">
              <iframe
                src={getEmbedUrl(selectedRelease.id, activeTrackId)}
                width="100%"
                height="152"
                className="block"
              />
            </div>

            {/* Album Info - now second */}
            <div className="relative rounded-lg bg-[var(--c-surface-2)] p-4 sm:p-7 overflow-hidden border-2" style={{ borderColor: selectedColor }}>
              <div
                className="absolute w-[340px] h-[340px] blur-[120px] top-[-120px] right-[-120px]"
                style={{ background: selectedColor, opacity: 0.2 }}
              />

              <div className="flex gap-5 relative z-10">
                <div className="flex flex-col justify-between min-w-0 w-full">
                  <div>
                    <p className="text-[10px] sm:text-xs opacity-60 mb-1">
                      Released {selectedRelease.release_date}
                    </p>
                    <h2 className="text-xl sm:text-3xl font-bold leading-tight" style={{ color: selectedColor }}>
                      {selectedRelease.name}
                    </h2>
                    <p className="text-[10px] sm:text-xs opacity-60 mt-1">
                      {selectedRelease.total_tracks} {selectedRelease.total_tracks === 1 ? "Track" : "Tracks"}
                    </p>
                  </div>
                  <a
                    href={selectedRelease.spotify_url}
                    target="_blank"
                    className="btn-primary mt-2 w-full justify-center text-[11px] whitespace-nowrap"
                  >
                    Listen on Spotify
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--c-surface-2)]/40 rounded-lg p-6 md:p-8">
            <div className="flex justify-between mb-5">
              <h4 className="text-xs uppercase tracking-wider">Tracklist</h4>
              <span className="text-xs opacity-50 font-mono">
                {selectedRelease.tracks?.length} {selectedRelease.tracks?.length === 1 ? "track" : "tracks"}
              </span>
            </div>

            <div className="max-h-[520px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {selectedRelease.tracks?.map((track, idx) => {
                const isActive = activeTrackId === track.id || (!activeTrackId && idx === 0);

                return (
                  <button
                    key={track.id}
                    onClick={() => setActiveTrackId(track.id)}
                    className={`track-item w-full px-5 py-3 rounded-md text-left flex items-center justify-between ${
                      isActive ? "active" : "hover:translate-x-1"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs opacity-50 font-mono w-6 text-right">
                        {(idx + 1).toString().padStart(2, "0")}
                      </span>
                      <span className="truncate text-sm">{track.name}</span>
                    </div>
                    <span className="text-xs opacity-50 font-mono shrink-0">{track.duration}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}