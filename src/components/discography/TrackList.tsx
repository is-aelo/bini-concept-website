"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Track {
  id: string;
  name: string;
  uri?: string;
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

export const TrackList: React.FC<TrackListProps> = ({
  tracks,
  activeTrackId,
  onSelectTrack,
  isOpen,
  tracklistId,
  accentColor,
}) => {
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
              duration: .25,
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
                const isActive =
                  activeTrackId === track.id;

                return (
                  <motion.button
                    key={track.id}
                    onClick={() =>
                      onSelectTrack(track.id)
                    }
                    initial={false}
                    animate={{
                      backgroundColor:
                        isActive
                          ? `${accentColor}10`
                          : "transparent",
                    }}
                    transition={{
                      duration: .18,
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      border: "none",
                      padding: 0,
                      background:
                        "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      borderBottom:
                        `1px solid ${
                          isActive
                            ? accentColor +
                              "18"
                            : "var(--c-surface-2)"
                        }`,
                    }}
                  >
                    <div
                      style={{
                        width: "2px",
                        flexShrink: 0,
                        background:
                          isActive
                            ? accentColor
                            : "transparent",
                      }}
                    />

                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems:
                          "center",
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
                          textAlign:
                            "right",
                          fontSize:
                            "11px",
                          fontFamily:
                            "var(--f-mono)",
                          color:
                            isActive
                              ? accentColor
                              : "var(--c-ink)",
                          opacity:
                            isActive
                              ? 1
                              : .28,
                        }}
                      >
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
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
                          fontFamily:
                            "var(--f-body)",
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
                            "var(--c-ink)",
                          opacity: .35,
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
    </div>
  );
};