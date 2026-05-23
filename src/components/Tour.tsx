"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";

interface TourItem {
  _id: string;
  eventName: string;
  location: string;
  date: string;
  status: string;
  ticketLink?: string;
  memberKey?: string;
}

interface TourProps {
  tours?: TourItem[];
}

const MEMBER_THEMES: Record<string, { accent: string; label: string; textOnAccent: string }> = {
  aiah:    { accent: "#008691", label: "AIAH",    textOnAccent: "#fff" },
  colet:   { accent: "#8db800", label: "COLET",   textOnAccent: "#fff" },
  maloi:   { accent: "#cc9a00", label: "MALOI",   textOnAccent: "#fff" },
  gwen:    { accent: "#d97706", label: "GWEN",    textOnAccent: "#fff" },
  stacey:  { accent: "#db2777", label: "STACEY",  textOnAccent: "#fff" },
  mikha:   { accent: "#D94040", label: "MIKHA",   textOnAccent: "#fff" },
  jhoanna: { accent: "#016795", label: "JHOANNA", textOnAccent: "#fff" },
  sheena:  { accent: "#9b5c9b", label: "SHEENA",  textOnAccent: "#fff" },
};

const STATUS_ACCENT: Record<string, { accent: string }> = {
  "sold out": { accent: "#D94040" },
  "on sale":  { accent: "#63CBD6" },
  "soon":     { accent: "#cc9a00" },
  "free":     { accent: "#db2777" },
};

const getTheme = (memberKey?: string, status?: string) => {
  const key = (memberKey || "").toLowerCase();
  if (MEMBER_THEMES[key]) return { ...MEMBER_THEMES[key] };
  const s = STATUS_ACCENT[(status || "").toLowerCase()];
  return {
    accent: s?.accent || "#63CBD6",
    label: "",
    textOnAccent: "#fff",
  };
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return {
    month: date.toLocaleString("en-US", { month: "short" }).toUpperCase(),
    day:   date.getDate().toString().padStart(2, "0"),
    year:  date.getFullYear(),
  };
};

const NR = 12;
const TEAR_X = 0.72;

function buildTicketPath(): string {
  const nrx = NR / 1000;
  const nry = NR / 200;
  const tx  = TEAR_X;
  const my  = 0.5;
  return [`M 0,0`, `L ${tx - nrx},0`, `A ${nrx},${nry} 0 0,0 ${tx + nrx},0`, `L 1,0`, `L 1,${my - nry}`, `A ${nrx},${nry} 0 0,0 1,${my + nry}`, `L 1,1`, `L ${tx + nrx},1`, `A ${nrx},${nry} 0 0,0 ${tx - nrx},1`, `L 0,1`, `L 0,${my + nry}`, `A ${nrx},${nry} 0 0,0 0,${my - nry}`, `Z`].join(" ");
}

const TICKET_PATH = buildTicketPath();

function PerforationLine({ accent }: { accent: string }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "10%",
        bottom: "10%",
        left: `${TEAR_X * 100}%`,
        width: 0,
        borderLeft: `2px dotted ${accent}40`,
        pointerEvents: "none",
        zIndex: 2,
      }}
    />
  );
}

function TicketTexture({ accent }: { accent: string }) {
  return (
    <svg aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }} preserveAspectRatio="none">
      <defs>
        <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke={accent} strokeWidth="0.4" strokeOpacity="0.07" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hatch)" />
    </svg>
  );
}

function TicketShape({ children, accent, isActive, isPast, clipId }: { children: React.ReactNode; accent: string; isActive: boolean; isPast: boolean; clipId: string; }) {
  return (
    <div
      style={{
        position: "relative",
        background: isPast ? "var(--c-surface-3)" : "var(--c-surface-2)",
        border: `1.5px solid ${isActive ? accent : "var(--c-surface-3)"}`,
        overflow: "visible",
        opacity: isPast ? 0.7 : 1,
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        boxShadow: isActive ? `0 10px 36px -10px ${accent}55` : "var(--shadow-tactile)",
        clipPath: `url(#${clipId})`,
      }}
    >
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs><clipPath id={clipId} clipPathUnits="objectBoundingBox"><path d={TICKET_PATH} /></clipPath></defs>
      </svg>
      <TicketTexture accent={accent} />
      <PerforationLine accent={accent} />
      <div style={{ position: "relative", zIndex: 3 }}>{children}</div>
    </div>
  );
}

export default function Tour({ tours = [] }: TourProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const processedTours = useMemo(() => {
    const now = new Date();
    const sorted = [...tours].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return [...sorted.filter((t) => new Date(t.date) >= now), ...sorted.filter((t) => new Date(t.date) < now)];
  }, [tours]);

  return (
    <section style={{ padding: "clamp(2rem, 5vw, 5rem) clamp(1rem, 4vw, 4rem)", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: "clamp(2rem, 4vw, 3rem)" }}>
        <h2 style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", margin: 0, lineHeight: 0.9 }}>Tour Dates</h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(0.75rem, 2vw, 1.25rem)" }}>
        {processedTours.map((tour) => {
          const theme = getTheme(tour.memberKey, tour.status);
          const d = formatDate(tour.date);
          const isPast = new Date(tour.date) < new Date();
          const isExpanded = expandedId === tour._id;
          const isSoldOut = tour.status.toLowerCase() === "sold out";
          const canBuy = !isPast && !isSoldOut && !!tour.ticketLink;

          return (
            <motion.div key={tour._id} onClick={() => setExpandedId(isExpanded ? null : tour._id)} style={{ cursor: "pointer" }}>
              <TicketShape accent={theme.accent} isActive={isExpanded} isPast={isPast} clipId={`tclip-${tour._id}`}>
                <div style={{ display: "flex", alignItems: "center", minHeight: "clamp(80px, 12vh, 120px)" }}>
                  <div style={{ width: "clamp(60px, 10vw, 90px)", marginLeft: "clamp(0.5rem, 2vw, 1.5rem)", padding: "1rem 0.5rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRight: `1px solid ${theme.accent}28` }}>
                    <span style={{ fontFamily: "var(--f-mono)", fontSize: "clamp(0.5rem, 1vw, 0.65rem)", color: theme.accent }}>{d.month}</span>
                    <span style={{ fontSize: "clamp(1.5rem, 4vw, 2.75rem)", lineHeight: 1 }}>{d.day}</span>
                  </div>
                  <div style={{ flex: 1, padding: "1rem clamp(1rem, 2vw, 2rem)", display: "flex", flexDirection: "column", justifyContent: "center", gap: "0.25rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        {theme.label && <span style={{ fontFamily: "var(--f-mono)", fontSize: "clamp(0.4rem, 0.8vw, 0.5rem)", padding: "2px 6px", background: theme.accent, color: "#fff", borderRadius: 3 }}>{theme.label}</span>}
                        <span style={{ fontFamily: "var(--f-mono)", fontSize: "clamp(0.4rem, 0.8vw, 0.5rem)", padding: "2px 6px", border: `1px solid ${theme.accent}80`, color: theme.accent, borderRadius: 999 }}>{isPast ? "PAST" : tour.status.toUpperCase()}</span>
                    </div>
                    <h3 style={{ fontSize: "clamp(0.9rem, 2vw, 1.4rem)", margin: 0, fontWeight: 400 }}>{tour.eventName}</h3>
                    <p style={{ fontSize: "clamp(0.7rem, 1.2vw, 0.85rem)", opacity: 0.5, margin: 0 }}>{tour.location}</p>
                  </div>
                  <div style={{ width: "clamp(80px, 20vw, 200px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
                    {canBuy ? (
                      <motion.a 
                        href={tour.ticketLink} 
                        target="_blank" 
                        initial={{ backgroundColor: "var(--c-teal-dark)", color: "var(--c-ink)" }}
                        whileHover={{ backgroundColor: "var(--c-teal)" }}
                        transition={{ duration: 0.1, ease: "linear" }}
                        style={{ 
                          padding: "clamp(0.4rem, 1vw, 0.75rem) clamp(0.8rem, 2vw, 1.5rem)", 
                          fontSize: "clamp(0.7rem, 1vw, 0.875rem)", 
                          fontWeight: 600, 
                          borderRadius: 4, 
                          textDecoration: "none",
                          display: "inline-block",
                          whiteSpace: "nowrap"
                        }}
                      >
                        Get Tickets
                      </motion.a>
                    ) : (
                      <span style={{ fontFamily: "var(--f-mono)", fontSize: "clamp(0.5rem, 1vw, 0.6rem)", opacity: 0.5 }}>{isPast ? "ENDED" : isSoldOut ? "SOLD OUT" : ""}</span>
                    )}
                  </div>
                </div>
              </TicketShape>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}