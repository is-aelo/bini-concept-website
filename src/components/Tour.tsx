"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import TourBackground from "./TourBackground";

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

const ITEMS_PER_PAGE = 4;

const isLocal = (location: string) => {
  const loc = location.toLowerCase();
  const phKeywords = [
    "ph", "philippines", "manila", "quezon city", "qc", "pasay", "makati",
    "taguig", "ortigas", "quezon", "bulacan", "philippine arena", "new clark city",
    "clark", "pampanga", "cebu", "davao", "iloilo", "bacolod", "cagayan de oro",
    "baguio", "laguna", "sta. rosa", "antipolo",
  ];
  return phKeywords.some((keyword) => loc.includes(keyword));
};

const MEMBER_CSS_VARS: Record<string, string> = {
  aiah:    "var(--c-aiah)",
  colet:   "var(--c-colet)",
  maloi:   "var(--c-maloi)",
  gwen:    "var(--c-gwen)",
  stacey:  "var(--c-stacey)",
  mikha:   "var(--c-mikha)",
  jhoanna: "var(--c-jhoanna)",
  sheena:  "var(--c-sheena)",
};

const STATUS_CSS_VARS: Record<string, string> = {
  "sold out": "var(--c-mikha)",
  "on sale":  "var(--c-teal)",
  "soon":     "var(--c-maloi)",
  "free":     "var(--c-stacey)",
};

const getAccent = (memberKey?: string, status?: string): string => {
  const key = (memberKey || "").toLowerCase();
  if (MEMBER_CSS_VARS[key]) return MEMBER_CSS_VARS[key];
  return STATUS_CSS_VARS[(status || "").toLowerCase()] || "var(--c-teal)";
};

const getStubColors = (
  memberKey?: string,
  status?: string,
  isPast?: boolean
): { bg: string; textPrimary: string; textSecondary: string } => {
  if (isPast) {
    return {
      bg: "var(--c-surface-3)",
      textPrimary: "var(--c-ink)",
      textSecondary: "var(--c-ink)",
    };
  }
  const isSoldOut = (status || "").toLowerCase() === "sold out";
  if (isSoldOut) {
    return {
      bg: "var(--c-mikha)",
      textPrimary: "#fff",
      textSecondary: "rgba(255,255,255,0.7)",
    };
  }
  const key = (memberKey || "").toLowerCase();
  if (MEMBER_CSS_VARS[key]) {
    return {
      bg: MEMBER_CSS_VARS[key],
      textPrimary: "#fff",
      textSecondary: "rgba(255,255,255,0.7)",
    };
  }
  return {
    bg: "var(--c-teal)",
    textPrimary: "var(--c-ink)",
    textSecondary: "rgba(12,12,10,0.6)",
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

function buildPath(): string {
  const tx  = 0.72;
  const nrx = NR / 1000;
  const nry = NR / 200;
  return [
    `M 0,0`,
    `L ${tx - nrx},0`,
    `A ${nrx},${nry} 0 0,0 ${tx + nrx},0`,
    `L 1,0`,
    `L 1,${0.5 - nry}`,
    `A ${nrx},${nry} 0 0,0 1,${0.5 + nry}`,
    `L 1,1`,
    `L ${tx + nrx},1`,
    `A ${nrx},${nry} 0 0,0 ${tx - nrx},1`,
    `L 0,1`,
    `L 0,${0.5 + nry}`,
    `A ${nrx},${nry} 0 0,0 0,${0.5 - nry}`,
    `Z`,
  ].join(" ");
}

const listVariants: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.06 } },
  exit:   { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show:   { opacity: 1, y: 0,  scale: 1,   transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as any } },
  exit:   { opacity: 0, y: -10, scale: 0.97, transition: { duration: 0.2,  ease: [0.65, 0, 0.35, 1] as any } },
};

const FILTER_OPTIONS = [
  { id: "all",  label: "All" },
  { id: "PH",   label: "PH"  },
  { id: "INTL", label: "Intl" },
];

export default function Tour({ tours = [] }: TourProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage,  setCurrentPage]  = useState(1);

  const processedTours = useMemo(() => {
    const now = new Date();
    const filtered = tours.filter((t) => {
      if (activeFilter === "all") return true;
      const local = isLocal(t.location);
      return activeFilter === "PH" ? local : !local;
    });
    const sorted = [...filtered].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return [
      ...sorted.filter((t) => new Date(t.date) >= now),
      ...sorted.filter((t) => new Date(t.date) < now),
    ];
  }, [tours, activeFilter]);

  const totalPages  = Math.ceil(processedTours.length / ITEMS_PER_PAGE);
  const currentList = processedTours.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (id: string) => {
    setActiveFilter(id);
    setCurrentPage(1);
  };

  return (
    <div style={{ position: "relative" }}>
      <TourBackground />
      <section
        style={{
          padding: "clamp(2rem, 5vw, 5rem) clamp(1rem, 4vw, 4rem)",
          maxWidth: 1100,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ marginBottom: "clamp(2rem, 4vw, 3rem)", textAlign: "center" }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              margin: 0,
              lineHeight: 0.9,
              color: "var(--c-teal-dark)",
            }}
          >
            Tour Dates
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "inline-flex",
              flexWrap: "nowrap",
              alignItems: "center",
              gap: "4px",
              marginTop: "2.5rem",
              background: "var(--c-surface-2)",
              borderRadius: 9999,
              padding: "4px",
              border: "1.5px solid var(--c-surface-3)",
            }}
          >
            {FILTER_OPTIONS.map((f) => {
              const isActive = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => handleFilterChange(f.id)}
                  style={{
                    padding: "0.4rem 1.1rem",
                    borderRadius: 9999,
                    fontSize: "clamp(9px, 1.5vw, 11px)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontFamily: "var(--f-mono)",
                    fontWeight: isActive ? 700 : 400,
                    background: isActive ? "var(--c-stacey)" : "transparent",
                    color: isActive ? "#fff" : "var(--c-ink)",
                    opacity: isActive ? 1 : 0.5,
                    border: "none",
                    cursor: "pointer",
                    transition: "background 0.22s ease, color 0.22s ease",
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeFilter}-${currentPage}`}
            variants={listVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}
          >
            {currentList.map((tour) => {
              const accent   = getAccent(tour.memberKey, tour.status);
              const stub     = getStubColors(tour.memberKey, tour.status, new Date(tour.date) < new Date());
              const d        = formatDate(tour.date);
              const isPast   = new Date(tour.date) < new Date();
              const isSoldOut = tour.status.toLowerCase() === "sold out";
              const canBuy    = !isPast && !isSoldOut && !!tour.ticketLink;
              const clipId    = `clip-${tour._id}`;
              const path      = buildPath();

              return (
                <motion.div
                  key={tour._id}
                  variants={itemVariants}
                  style={{ filter: isPast ? "none" : `drop-shadow(0 8px 20px ${accent}33)` }}
                >
                  <div
                    style={{
                      position: "relative",
                      background: isPast ? "var(--c-surface-3)" : "var(--c-surface-2)",
                      border: `1.5px solid ${accent}`,
                      clipPath: `url(#${clipId})`,
                      opacity: isPast ? 0.6 : 1,
                      minHeight: "116px",
                      display: "flex",
                      alignItems: "stretch",
                    }}
                  >
                    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
                      <defs>
                        <clipPath id={clipId} clipPathUnits="objectBoundingBox">
                          <path d={path} />
                        </clipPath>
                      </defs>
                    </svg>

                    <div
                      style={{
                        width: "20%",
                        background: stub.bg,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "1rem",
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ fontFamily: "var(--f-mono)", fontSize: "0.55rem", color: stub.textSecondary }}>{d.month}</span>
                      <span style={{ fontFamily: "var(--f-mono)", fontSize: "clamp(1.5rem, 3vw, 2.6rem)", color: stub.textPrimary, lineHeight: 1, fontWeight: 700 }}>{d.day}</span>
                      <span style={{ fontFamily: "var(--f-mono)", fontSize: "0.52rem", color: stub.textSecondary }}>{d.year}</span>
                    </div>

                    <div style={{ flex: 1, padding: "1rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <h3 style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.2rem)", margin: 0, fontFamily: "var(--f-display)" }}>{tour.eventName}</h3>
                      <p style={{ fontSize: "0.75rem", opacity: 0.5, margin: "2px 0 0 0" }}>{tour.location}</p>
                    </div>

                    <div style={{ width: "30%", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
                      {canBuy ? (
                        <a
                          href={tour.ticketLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: "0.5rem 1rem",
                            borderRadius: 9999,
                            background: accent,
                            color: stub.bg === "var(--c-teal)" ? "var(--c-ink)" : "#fff",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            textDecoration: "none",
                            fontFamily: "var(--f-mono)",
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Tickets
                        </a>
                      ) : (
                        <span style={{ fontFamily: "var(--f-mono)", fontSize: "0.5rem", opacity: 0.5, textTransform: "uppercase" }}>
                          {isPast ? "Ended" : isSoldOut ? "Sold Out" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: totalPages > 1 ? 1 : 0 }}
          style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "2rem" }}
        >
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--c-surface-2)",
              border: `1.5px solid ${currentPage === 1 ? "var(--c-surface-3)" : "var(--c-surface-3)"}`,
              borderRadius: 9999,
              width: 36,
              height: 36,
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              color: currentPage === 1 ? "var(--c-surface-3)" : "var(--c-ink)",
              transition: "all 0.2s ease",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                style={{
                  width: currentPage === i + 1 ? 20 : 8,
                  height: 8,
                  borderRadius: 9999,
                  background: currentPage === i + 1 ? "var(--c-stacey)" : "var(--c-surface-3)",
                  border: "none",
                  cursor: "pointer",
                  transition: "width 0.3s ease",
                }}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--c-surface-2)",
              border: `1.5px solid ${currentPage === totalPages ? "var(--c-surface-3)" : "var(--c-surface-3)"}`,
              borderRadius: 9999,
              width: 36,
              height: 36,
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              color: currentPage === totalPages ? "var(--c-surface-3)" : "var(--c-ink)",
              transition: "all 0.2s ease",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </motion.div>
      </section>
    </div>
  );
}