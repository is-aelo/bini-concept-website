"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Track {
  id: string;
  name: string;
  uri: string;
  duration: string;
}

interface TrackListProps {
  tracks: Track[];
  activeTrackId: string | null;
  onSelectTrack: (trackId: string) => void;
  isOpen: boolean;
  tracklistId: string;
  accentColor: string;
}

function trackUriToId(uri: string): string | null {
  const match = uri?.match(/spotify:track:([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

export const TrackList: React.FC<TrackListProps> = ({
  tracks,
  activeTrackId,
  onSelectTrack,
  isOpen,
  tracklistId,
  accentColor,
}) => {
  const handleTrackClick = (uri: string) => {
    const id = trackUriToId(uri);

    if (!id) return;

    onSelectTrack(id);
  };

  if (!tracks?.length) {
    return (
      <p
        style={{
          fontSize: "13px",
          color: "var(--c-ink)",
          opacity: 0.35,
          padding: "1rem 0",
        }}
      >
        No tracks available.
      </p>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        marginTop: "clamp(14px,3vw,24px)",
      }}
    >
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            id={tracklistId}
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.25,
              ease: "easeInOut",
            }}
            style={{
              overflow: "hidden",
            }}
          >
            <div
              style={{
                maxHeight: "360px",
                overflowY: "auto",
                scrollbarWidth: "thin",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {tracks.map((track, index) => {
                const trackId = trackUriToId(track.uri);

                const isActive =
                  !!trackId &&
                  activeTrackId === trackId;

                const hasUri = !!trackId;

                return (
                  <motion.button
                    key={track.id}
                    onClick={() =>
                      hasUri &&
                      handleTrackClick(track.uri)
                    }
                    disabled={!hasUri}
                    aria-pressed={isActive}
                    initial={false}
                    animate={{
                      backgroundColor: isActive
                        ? `${accentColor}10`
                        : "transparent",
                    }}
                    transition={{
                      duration: 0.18,
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      border: "none",
                      padding: 0,
                      background: "transparent",
                      cursor: hasUri
                        ? "pointer"
                        : "default",
                      textAlign: "left",
                      borderBottom: `1px solid ${
                        isActive
                          ? accentColor + "18"
                          : "var(--c-surface-2)"
                      }`,
                    }}
                  >
                    <div
                      style={{
                        width: "2px",
                        flexShrink: 0,
                        background: isActive
                          ? accentColor
                          : "transparent",
                        transition:
                          "all .2s ease",
                      }}
                    />

                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding:
                          "11px 12px",
                        minWidth: 0,
                      }}
                    >
                      <span
                        style={{
                          width: "24px",
                          flexShrink: 0,
                          textAlign: "right",
                          fontSize: "11px",
                          fontFamily:
                            "var(--f-mono)",
                          color: isActive
                            ? accentColor
                            : "var(--c-ink)",
                          opacity: isActive
                            ? 1
                            : 0.28,
                        }}
                      >
                        {isActive ? (
                          <span
                            style={{
                              display:
                                "inline-flex",
                              alignItems:
                                "flex-end",
                              gap: "2px",
                              height:
                                "13px",
                            }}
                          >
                            {[
                              {
                                h: "9px",
                                d: "0s",
                              },
                              {
                                h: "13px",
                                d: ".15s",
                              },
                              {
                                h: "6px",
                                d: ".3s",
                              },
                            ].map(
                              (
                                bar,
                                i
                              ) => (
                                <span
                                  key={i}
                                  style={{
                                    width:
                                      "2px",
                                    height:
                                      bar.h,
                                    background:
                                      accentColor,
                                    borderRadius:
                                      "2px",
                                    animation: `eqBar .7s ease-in-out ${bar.d} infinite alternate`,
                                  }}
                                />
                              )
                            )}
                          </span>
                        ) : (
                          String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )
                        )}
                      </span>

                      <span
                        style={{
                          flex: 1,
                          overflow:
                            "hidden",
                          textOverflow:
                            "ellipsis",
                          whiteSpace:
                            "nowrap",
                          fontSize:
                            "13px",
                          color:
                            isActive
                              ? accentColor
                              : "var(--c-ink)",
                          fontWeight:
                            isActive
                              ? 500
                              : 400,
                        }}
                      >
                        {track.name}
                      </span>

                      <span
                        style={{
                          fontSize:
                            "11px",
                          flexShrink: 0,
                          fontFamily:
                            "var(--f-mono)",
                          color:
                            isActive
                              ? accentColor
                              : "var(--c-ink)",
                          opacity:
                            isActive
                              ? .7
                              : .3,
                        }}
                      >
                        {track.duration}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes eqBar {
          from {
            transform: scaleY(.4);
          }

          to {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  );
};