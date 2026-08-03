"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Heading from "@/components/Heading";
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

/* ── Helpers ─────────────────────────────────────────────────────────── */

const isLocal = (location: string) => {
  const loc = location.toLowerCase();
  const phKeywords = [
    "ph","philippines","manila","quezon city","qc","pasay","makati",
    "taguig","ortigas","quezon","bulacan","philippine arena","new clark city",
    "clark","pampanga","cebu","davao","iloilo","bacolod","cagayan de oro",
    "baguio","laguna","sta. rosa","antipolo",
  ];
  return phKeywords.some((k) => loc.includes(k));
};

const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  return {
    month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
    day:   d.getDate().toString().padStart(2, "0"),
    year:  d.getFullYear(),
  };
};

/* ── Styles ──────────────────────────────────────────────────────────── */
const STYLES = `
  .tour-scroll {
    scrollbar-width: thin;
    scrollbar-color: var(--c-surface-3) transparent;
  }
  .tour-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
  .tour-scroll::-webkit-scrollbar-track { background: transparent; }
  .tour-scroll::-webkit-scrollbar-thumb {
    background: var(--c-surface-3);
    border-radius: 99px;
  }
  .tour-scroll::-webkit-scrollbar-thumb:hover { background: var(--c-teal-dark); }

  .tour-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
  @media (max-width: 640px) {
    .tour-grid {
      grid-template-columns: 1fr;
    }
  }

  .ticket-outer {
    height: 100%;
    min-width: 0;
  }
  .ticket-inner {
    height: 100%;
    display: flex;
    min-height: 120px;
  }

  .ticket-stub {
    width: 88px;
    flex-shrink: 0;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    padding: 18px 10px;
  }

  .ticket-body {
    flex: 1;
    min-width: 0;
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .ticket-event-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--c-ink);
    line-height: 1.35;
    word-break: break-word;
    margin-bottom: 4px;
  }

  @media (min-width: 641px) {
    .ticket-event-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .ticket-location {
    font-family: var(--f-mono);
    font-size: 10px;
    color: var(--c-ink);
    opacity: 0.45;
    line-height: 1.4;
    word-break: break-word;
    margin-bottom: 5px;
  }

  @media (min-width: 641px) {
    .ticket-location {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .ticket-badge {
    font-family: var(--f-mono);
    font-size: 8px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .ticket-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 34px;
    padding: 8px 18px;
    border-radius: 999px;
    font-size: 10px;
    font-family: var(--f-mono);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
    cursor: pointer;
    border: 1.5px solid transparent;
    box-sizing: border-box;
    line-height: 1;
    transition: background 0.2s ease, color 0.2s ease;
    align-self: flex-start;
    white-space: normal;
    word-break: break-word;
    min-width: 0;
  }
  .ticket-cta:focus-visible {
    outline: 2px solid var(--c-teal-dark);
    outline-offset: 3px;
  }
  .ticket-cta--buy {
    background: var(--c-ink);
    color: #fff;
    border-color: var(--c-ink);
  }
  .ticket-cta--buy:hover {
    background: var(--c-teal-dark);
    border-color: var(--c-teal-dark);
  }
  .ticket-cta--sold {
    background: transparent;
    color: var(--c-mikha);
    border-color: var(--c-mikha);
    cursor: default;
    opacity: 0.8;
  }
  .ticket-cta--past {
    background: transparent;
    color: var(--c-ink);
    border-color: var(--c-surface-3);
    cursor: default;
    opacity: 0.4;
  }
  .ticket-cta--free {
    background: transparent;
    color: var(--c-teal-dark);
    border-color: var(--c-teal-dark);
  }

  .tour-page-btn:focus-visible {
    outline: 2px solid var(--c-teal-dark);
    outline-offset: 3px;
  }

  .tour-filter-btn:focus-visible {
    outline: 2px solid var(--c-teal-dark);
    outline-offset: 3px;
  }
`;

/* ── Animation variants ──────────────────────────────────────────────── */
const listVariants: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07 } },
  exit:   { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show:   {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit:   {
    opacity: 0, y: -8, scale: 0.97,
    transition: { duration: 0.18, ease: [0.65, 0, 0.35, 1] as const },
  },
};

/* ── Component ───────────────────────────────────────────────────────── */
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
      ...sorted.filter((t) => new Date(t.date) <  now),
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
    <section
      className="w-full py-20 relative overflow-hidden"
      style={{ background: "var(--c-surface)" }}
      aria-label="BINI SIGNALS World Tour"
    >
      <TourBackground />
      <style>{STYLES}</style>

      <div className="relative z-10 w-full max-w-[1320px] mx-auto px-4 sm:px-8 md:px-16">

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
            WORLD TOUR
          </p>

          <div className="flex items-end justify-between gap-6 flex-wrap">
            <Heading level="section" style={{ color: "var(--c-teal-dark)" }}>
              SIGNALS
            </Heading>

            <div
              className="hidden sm:flex items-center gap-2 pb-2 flex-wrap"
              role="group"
              aria-label="Filter tour dates"
            >
              {(["all", "PH", "INTL"] as const).map((cat) => (
                <button
                  key={cat}
                  className="tour-filter-btn"
                  onClick={() => handleFilterChange(cat)}
                  aria-pressed={activeFilter === cat}
                  style={{
                    fontFamily: "var(--f-mono)",
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "6px 16px",
                    borderRadius: "999px",
                    border: activeFilter === cat
                      ? "1.5px solid var(--c-teal-dark)"
                      : "1.5px solid var(--c-surface-3)",
                    background: activeFilter === cat ? "var(--c-teal-dark)" : "transparent",
                    color: activeFilter === cat ? "#fff" : "var(--c-ink)",
                    opacity: activeFilter === cat ? 1 : 0.6,
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                >
                  {cat === "all" ? "All" : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="flex sm:hidden gap-2 mb-6 overflow-x-auto pb-1 tour-scroll"
          role="group"
          aria-label="Filter tour dates"
        >
          {(["all", "PH", "INTL"] as const).map((cat) => (
            <button
              key={cat}
              className="tour-filter-btn"
              onClick={() => handleFilterChange(cat)}
              aria-pressed={activeFilter === cat}
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: "10px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "5px 14px",
                borderRadius: "999px",
                border: activeFilter === cat
                  ? "1.5px solid var(--c-teal-dark)"
                  : "1.5px solid var(--c-surface-3)",
                background: activeFilter === cat ? "var(--c-teal-dark)" : "transparent",
                color: activeFilter === cat ? "#fff" : "var(--c-ink)",
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>

        <div
          style={{ height: "1.5px", background: "var(--c-ink)", marginBottom: "24px" }}
          role="separator"
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeFilter}-${currentPage}`}
            className="tour-grid"
            variants={listVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {currentList.length === 0 ? (
              <div
                style={{ gridColumn: "1 / -1", padding: "48px 0", textAlign: "center" }}
                role="status"
                aria-live="polite"
              >
                <p style={{
                  fontFamily: "var(--f-mono)",
                  fontSize: "11px",
                  color: "var(--c-ink)",
                  opacity: 0.35,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}>
                  No dates found
                </p>
              </div>
            ) : (
              currentList.map((tour) => (
                <TicketCard key={tour._id} tour={tour} />
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {totalPages > 1 && (
          <nav
            aria-label="Tour dates pagination"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
              marginTop: "2.5rem",
            }}
          >
            <button
              className="tour-page-btn"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "1.5px solid var(--c-surface-3)",
                borderRadius: "999px",
                width: 36,
                height: 36,
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                color: currentPage === 1 ? "var(--c-surface-3)" : "var(--c-ink)",
                transition: "all 0.2s ease",
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div style={{ display: "flex", gap: "6px", alignItems: "center" }} role="list">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className="tour-page-btn"
                  onClick={() => setCurrentPage(i + 1)}
                  aria-label={`Page ${i + 1}`}
                  aria-current={currentPage === i + 1 ? "page" : undefined}
                  role="listitem"
                  style={{
                    width: currentPage === i + 1 ? 20 : 8,
                    height: 8,
                    borderRadius: "999px",
                    background: currentPage === i + 1
                      ? "var(--c-teal-dark)"
                      : "var(--c-surface-3)",
                    border: "none",
                    cursor: "pointer",
                    transition: "width 0.25s ease, background 0.2s ease",
                    padding: 0,
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>

            <button
              className="tour-page-btn"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "1.5px solid var(--c-surface-3)",
                borderRadius: "999px",
                width: 36,
                height: 36,
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                color: currentPage === totalPages ? "var(--c-surface-3)" : "var(--c-ink)",
                transition: "all 0.2s ease",
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}

/* ── TICKET CARD ─────────────────────────────────────────────────────── */
function TicketCard({ tour }: { tour: TourItem }) {
  const now       = new Date();
  const isPast    = new Date(tour.date) < now;
  const isSoldOut = tour.status.toLowerCase() === "sold out";
  const isFree    = tour.status.toLowerCase() === "free";
  const canBuy    = !isPast && !isSoldOut && !!tour.ticketLink;
  const local     = isLocal(tour.location);
  const d         = formatDate(tour.date);

  const clipId    = `ticket-clip-${tour._id}`;
  const NOTCH_R   = 3.8;

  const ctaLabel = isPast
    ? "Ended"
    : isSoldOut
    ? "Sold out"
    : isFree
    ? "Free · RSVP"
    : "Get tickets";

  const ctaClass = canBuy
    ? "ticket-cta ticket-cta--buy"
    : isPast
    ? "ticket-cta ticket-cta--past"
    : isSoldOut
    ? "ticket-cta ticket-cta--sold"
    : isFree
    ? "ticket-cta ticket-cta--free"
    : "ticket-cta ticket-cta--past";

  const badgeColor = local ? "var(--c-teal-dark)" : "var(--c-gwen)";

  const ariaLabel = `${tour.eventName}, ${tour.location}, ${d.month} ${d.day} ${d.year}${isPast ? ", past event" : isSoldOut ? ", sold out" : ""}`;

  return (
    <motion.div
      variants={cardVariants}
      className="ticket-outer"
      style={{ opacity: isPast ? 0.55 : 1 }}
    >
      <article
        aria-label={ariaLabel}
        style={{
          height: "100%",
          transition: "opacity 0.2s",
        }}
      >
        <div
          className="ticket-inner"
          style={{
            background: "var(--c-surface-2)",
            border: "1px solid var(--c-surface-3)",
            borderRadius: "10px",
            clipPath: `url(#${clipId})`,
          }}
        >
          <svg
            width="0"
            height="0"
            style={{ position: "absolute", overflow: "visible" }}
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <clipPath id={clipId} clipPathUnits="objectBoundingBox">
                <path
                  d={`M 0,0 L 1,0 L 1,${0.5 - NOTCH_R / 100} A 0.028,${NOTCH_R / 100} 0 0,0 1,${0.5 + NOTCH_R / 100} L 1,1 L 0,1 L 0,${0.5 + NOTCH_R / 100} A 0.028,${NOTCH_R / 100} 0 0,0 0,${0.5 - NOTCH_R / 100} Z`}
                />
              </clipPath>
            </defs>
          </svg>

          <div className="ticket-stub" aria-hidden="true">
            <span
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: "9px",
                color: "var(--c-teal-dark)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              {d.month}
            </span>
            <span
              style={{
                fontFamily: "var(--f-display)",
                fontSize: "clamp(28px, 4vw, 38px)",
                color: "var(--c-ink)",
                lineHeight: 1,
                textTransform: "uppercase",
              }}
            >
              {d.day}
            </span>
            <span
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: "8px",
                color: "var(--c-ink)",
                opacity: 0.35,
              }}
            >
              {d.year}
            </span>

            <svg
              style={{
                position: "absolute",
                right: -1,
                top: 0,
                bottom: 0,
                width: "2px",
                height: "100%",
                overflow: "visible",
                pointerEvents: "none",
              }}
              aria-hidden="true"
              focusable="false"
            >
              <line
                x1="1" y1="0%"
                x2="1" y2="100%"
                stroke="var(--c-surface-3)"
                strokeWidth="1.5"
                strokeDasharray="3 5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="ticket-body">
            <div style={{ marginBottom: "14px" }}>
              <p className="ticket-event-name">
                {tour.eventName}
              </p>
              <p className="ticket-location">
                {tour.location}
              </p>
              <span
                className="ticket-badge"
                style={{ color: badgeColor }}
              >
                {local ? "PH" : "INTL"}
              </span>
            </div>

            {canBuy ? (
              <a
                href={tour.ticketLink}
                target="_blank"
                rel="noopener noreferrer"
                className={ctaClass}
                aria-label={`Get tickets for ${tour.eventName}`}
              >
                {ctaLabel}
              </a>
            ) : (
              <span
                className={ctaClass}
                aria-label={ctaLabel}
                role="status"
              >
                {ctaLabel}
              </span>
            )}
          </div>
        </div>
      </article>
    </motion.div>
  );
}
