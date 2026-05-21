"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
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

  const [activeCategory, setActiveCategory] = useState<CategoryType>("all");
  const [selectedRelease, setSelectedRelease] = useState<DiscographyItem | null>(items[0] || null);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);

  const getNormalizedType = (item: DiscographyItem): string => {
    const nameLower = item.name.toLowerCase();
    const typeLower = item.type?.toLowerCase();

    if (nameLower.includes("talaarawan") || nameLower.includes("ep")) {
      return "ep";
    }

    if (item.total_tracks >= 4 && item.total_tracks <= 6 && typeLower === "single") {
      return "ep";
    }

    return typeLower;
  };

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return items;
    return items.filter((item) => getNormalizedType(item) === activeCategory);
  }, [items, activeCategory]);

  useEffect(() => {
    if (filteredItems.length > 0) {
      const exists = filteredItems.some((item) => item.id === selectedRelease?.id);
      if (!exists) {
        setSelectedRelease(filteredItems[0]);
        setActiveTrackId(null);
      }
    }
  }, [filteredItems, selectedRelease]);

  if (!selectedRelease) return null;

  const selectedIndex = items.findIndex((i) => i.id === selectedRelease.id);

  const selectedColor =
    memberColors[
      selectedIndex >= 0
        ? selectedIndex % memberColors.length
        : 0
    ];

  // Modified embed source logic: focus exclusively on playing the selected track cleanly
  const getEmbedUrl = (albumId: string, trackId: string | null) => {
    const targetId = trackId || selectedRelease.tracks[0]?.id || albumId;
    return `https://open.spotify.com/embed/track/${targetId}?utm_source=generator&theme=0`;
  };

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = direction === "left" ? -400 : 400;

    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth"
    });
  };

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto relative overflow-hidden">
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.15);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${selectedColor || 'rgba(0, 0, 0, 0.3)'};
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.15) rgba(0, 0, 0, 0.05);
        }
      `}} />

      {/* ambient */}
      <div
        className="
        absolute
        right-[-120px]
        top-[180px]
        w-[500px]
        h-[500px]
        rounded-full
        blur-[140px]
        animate-mvBloom
        pointer-events-none
        "
        style={{
          background: selectedColor,
          opacity: .18
        }}
      />

      {/* header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 relative z-10">
        <div>
          <p className="text-label-mono text-[var(--c-teal-dark)] mb-2">
            BINI OFFICIAL MUSIC
          </p>

          <h3 className="text-left text-5xl md:text-7xl text-[var(--c-teal-dark)] leading-none">
            Discography
          </h3>
        </div>

        {/* navigation arrows */}
        <div className="flex gap-2 self-end sm:self-auto mb-1">
          <button
            onClick={() => handleScroll("left")}
            className="p-3 rounded-full border border-[var(--c-teal-dark)]/20 hover:border-[var(--c-teal-dark)] bg-[var(--c-surface-2)]/50 hover:bg-[var(--c-surface-2)] text-[var(--c-teal-dark)] transition-all duration-300 active:scale-95"
            aria-label="Scroll left"
          >
            <CaretLeft size={20} weight="bold" />
          </button>
          <button
            onClick={() => handleScroll("right")}
            className="p-3 rounded-full border border-[var(--c-teal-dark)]/20 hover:border-[var(--c-teal-dark)] bg-[var(--c-surface-2)]/50 hover:bg-[var(--c-surface-2)] text-[var(--c-teal-dark)] transition-all duration-300 active:scale-95"
            aria-label="Scroll right"
          >
            <CaretRight size={20} weight="bold" />
          </button>
        </div>
      </div>

      {/* category filter tabs */}
      <div className="flex flex-wrap gap-2 mb-10 relative z-10 border-b border-[var(--c-teal-dark)]/10 pb-4">
        {(["all", "album", "ep", "single"] as CategoryType[]).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`
              px-5 py-2 rounded-full font-[var(--f-mono)] text-xs uppercase tracking-wider transition-all duration-300
              ${
                activeCategory === category
                  ? "bg-[var(--c-teal-dark)] text-white font-bold"
                  : "bg-[var(--c-surface-2)]/60 text-[var(--c-ink)] opacity-70 hover:opacity-100 hover:bg-[var(--c-surface-2)]"
              }
            `}
          >
            {category === "all" ? "All Releases" : `${category}s`}
          </button>
        ))}
      </div>

      {/* album strip carousel wrapper */}
      <div
        ref={scrollContainerRef}
        className="
        flex
        gap-5
        overflow-x-auto
        snap-x
        snap-mandatory
        pb-2
        relative
        z-10
        hide-scrollbar
        "
      >
        {filteredItems.map((item) => {
          const isSelected = item.id === selectedRelease.id;
          const globalIndex = items.findIndex((i) => i.id === item.id);
          const color = memberColors[globalIndex % memberColors.length];

          return (
            <button
              key={item.id}
              onClick={() => {
                setSelectedRelease(item);
                setActiveTrackId(null);
              }}
              className="
              snap-center
              shrink-0
              text-left
              group
              w-[155px]
              md:w-[190px]
              "
            >
              <div
                className={`
                hero-image-wrapper
                !aspect-square
                !w-full
                transition-all
                duration-700
                overflow-hidden
                ${
                  isSelected
                  ? "scale-100"
                  : "scale-[.95] opacity-70 hover:opacity-100 hover:scale-[.98]"
                }
                `}
                style={{
                  boxShadow: isSelected
                  ? `0 0 45px ${color}`
                  : "var(--shadow-tactile)"
                }}
              >
                {item.art && (
                  <img src={item.art} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                )}
                <div className="shine-overlay"/>
              </div>

              <div className="mt-4 px-1">
                <p className="text-label-mono mb-1">{item.year}</p>
                <h4
                  className="leading-tight text-sm font-semibold"
                  style={{ color: isSelected ? color : "var(--c-ink)" }}
                >
                  {item.name}
                </h4>
              </div>
            </button>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="text-sm opacity-50 py-8 font-[var(--f-mono)]">
            No releases found under this category.
          </div>
        )}
      </div>

      {/* consolidated display container */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-8 mt-10 relative z-10 items-start">
        
        {/* left column: album metadata + player */}
        <div className="space-y-6">
          <div className="rounded-[var(--r-lg)] bg-[var(--c-surface-2)] shadow-[var(--shadow-float)] overflow-hidden relative p-6 md:p-8">
            <div
              className="absolute top-[-100px] right-[-100px] w-[320px] h-[320px] rounded-full blur-[120px] animate-mvBloom pointer-events-none"
              style={{ background: selectedColor, opacity: .22 }}
            />

            <div className="flex flex-col gap-6 relative z-10">
              <div className="hero-image-wrapper !mx-0 !w-40 md:!w-48 !aspect-square">
                {selectedRelease.art && (
                  <img src={selectedRelease.art} alt={selectedRelease.name} className="w-full h-full object-cover" />
                )}
                <div className="shine-overlay"/>
              </div>

              <div className="flex flex-col justify-center">
                <p className="text-label-mono text-xs mb-2">
                  Released {selectedRelease.release_date}
                </p>

                <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-3" style={{ color: selectedColor }}>
                  {selectedRelease.name}
                </h2>

                <div className="flex flex-wrap gap-3 text-xs opacity-60 mb-6">
                  <span className="capitalize">{getNormalizedType(selectedRelease)}</span>
                  <span>•</span>
                  <span>{selectedRelease.total_tracks} Tracks</span>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <a
                    href={selectedRelease.spotify_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full text-white font-[var(--f-mono)] text-[10px] uppercase font-bold tracking-wider bg-[var(--c-teal-dark)] hover:bg-[var(--c-teal)] transition-all duration-500 text-center"
                  >
                    Listen on Spotify
                  </a>

                  {activeTrackId && (
                    <button
                      onClick={() => setActiveTrackId(null)}
                      className="px-5 py-2.5 rounded-full bg-white/50 hover:bg-white transition text-[10px] uppercase font-bold font-[var(--f-mono)]"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Spotify Compact Streamlined Player View */}
          <div className="overflow-hidden rounded-[var(--r-md)] shadow-[var(--shadow-tactile)] bg-[var(--c-ink)]">
            <iframe
              src={getEmbedUrl(selectedRelease.id, activeTrackId)}
              width="100%"
              height="80"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="block"
            />
          </div>
        </div>

        {/* right column: wider tracklist section */}
        <div className="bg-[var(--c-surface-2)]/40 rounded-[var(--r-lg)] p-6 md:p-8 shadow-[var(--shadow-tactile)]">
          <h4 className="text-label-mono mb-5 tracking-wider">TRACKLIST</h4>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {selectedRelease.tracks?.map((track, idx) => {
              const active = activeTrackId === track.id;
              const color = memberColors[idx % memberColors.length];

              return (
                <button
                  key={track.id}
                  onClick={() => setActiveTrackId(track.id)}
                  className={`
                  w-full relative overflow-hidden rounded-[var(--r-md)] px-5 py-3.5 text-left transition-all duration-500
                  ${active ? "translate-x-1 scale-[1.005]" : "hover:translate-x-1"}
                  `}
                  style={{
                    background: active ? "rgba(255,255,255,.75)" : "rgba(255,255,255,.35)",
                    boxShadow: active ? `0 4px 20px rgba(0,0,0,0.05), 0 0 15px ${color}33` : "none"
                  }}
                >
                  {active && (
                    <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: color }} />
                  )}

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="text-xs opacity-50 font-[var(--f-mono)]">
                        {(idx + 1).toString().padStart(2, "0")}
                      </span>
                      <span className="truncate font-medium text-sm">{track.name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {active && (
                        <span className="w-2 h-2 rounded-full animate-mvGlow" style={{ background: color }} />
                      )}
                      <span className="text-xs opacity-50 font-[var(--f-mono)]">{track.duration}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}