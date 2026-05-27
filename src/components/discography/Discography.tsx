"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaretDown } from "@phosphor-icons/react";
import { Icon } from "@iconify/react";
import { AlbumDisplay } from "./AlbumDisplay";
import { TrackList } from "./TrackList";
import discographyData from "@/app/data/bini_discography.json";

type Album = (typeof discographyData.items)[0];
type FilterType = "All" | "Albums" | "EPs" | "Singles";

const IS_SINGLE = (n: number) => n <= 2;
const IS_EP = (n: number) => n >= 3 && n <= 6;
const IS_ALBUM = (n: number) => n >= 7;

const FILTERS: FilterType[] = [
  "All",
  "Albums",
  "EPs",
  "Singles",
];

const PLAYER_WIDTH = "min(100%, 520px)";

const MEMBER_ACCENTS = [
  "#008691",
  "#B5E550",
  "#FFC40C",
  "#FFA500",
  "#FF69B4",
  "#D94040",
  "#016795",
  "#DDA0DD",
];

function trackUriToId(
  uri: string
): string | null {
  const m =
    uri?.match(
      /spotify:track:([a-zA-Z0-9]+)/
    );

  return m
    ? m[1]
    : null;
}

function trackEmbedSrc(
  trackId: string
) {
  return `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
}

export const Discography: React.FC =
  () => {
    const [filter, setFilter] =
      useState<FilterType>(
        "All"
      );

    const [
      selectedAlbum,
      setSelectedAlbum,
    ] =
      useState<Album | null>(
        null
      );

    const [
      selectedTrack,
      setSelectedTrack,
    ] =
      useState<{
        albumId: string;
        trackId: string | null;
      } | null>(null);

    const [
      isTracklistOpen,
      setIsTracklistOpen,
    ] =
      useState(true);

    const tracklistId =
      React.useId();

    const filteredAlbums =
      useMemo(() => {
        return discographyData.items.filter(
          (
            item
          ) => {
            const n =
              item.total_tracks ||
              0;

            if (
              filter ===
              "All"
            )
              return true;

            if (
              filter ===
              "Singles"
            )
              return IS_SINGLE(
                n
              );

            if (
              filter ===
              "EPs"
            )
              return IS_EP(
                n
              );

            if (
              filter ===
              "Albums"
            )
              return IS_ALBUM(
                n
              );

            return false;
          }
        );
      }, [filter]);

    const activeAlbum =
      useMemo(() => {
        if (
          selectedAlbum &&
          filteredAlbums.some(
            (
              a
            ) =>
              a.id ===
              selectedAlbum.id
          )
        ) {
          return selectedAlbum;
        }

        return (
          filteredAlbums[0] ??
          null
        );
      }, [
        filteredAlbums,
        selectedAlbum,
      ]);

    const selectedIndex =
      filteredAlbums.findIndex(
        (
          a
        ) =>
          a.id ===
          activeAlbum?.id
      );

    const accentColor =
      MEMBER_ACCENTS[
        (
          selectedIndex <
          0
            ? 0
            : selectedIndex
        ) %
          MEMBER_ACCENTS.length
      ];

    const defaultTrackId =
      activeAlbum?.tracks
        ?.map(
          (
            track
          ) =>
            trackUriToId(
              track.uri
            )
        )
        .find(
          Boolean
        ) ??
      null;

    const activeTrackId =
      selectedTrack?.albumId ===
      activeAlbum?.id
        ? selectedTrack.trackId ??
          defaultTrackId
        : defaultTrackId;

    const embedSrc =
      activeTrackId
        ? trackEmbedSrc(
            activeTrackId
          )
        : null;

    const handleSelectTrack =
      (
        trackId: string
      ) => {
        if (
          !activeAlbum
        )
          return;

        setSelectedTrack(
          {
            albumId:
              activeAlbum.id,
            trackId,
          }
        );
      };

    return (
      <section
        style={{
          background:
            "var(--c-surface)",
          position:
            "relative",
          overflowX:
            "clip",
          overflowY:
            "visible",
          minHeight:
            "100vh",
          display:
            "flex",
          flexDirection:
            "column",
          alignItems:
            "center",
          padding:
            "80px 0",
        }}
      >
        <AnimatePresence>
          <motion.div
            key={
              accentColor +
              "-bg"
            }
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.9,
            }}
            style={{
              position:
                "absolute",
              top: 0,
              left:
                "50%",
              transform:
                "translateX(-50%)",
              width:
                "120%",
              height:
                "320px",
              background: `radial-gradient(ellipse 70% 100% at 50% 0%, ${accentColor}12 0%, transparent 70%)`,
              pointerEvents:
                "none",
              zIndex: 0,
            }}
          />
        </AnimatePresence>

        <div
          className="max-w-[1320px] w-full px-4 sm:px-8 md:px-16"
          style={{
            position:
              "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              marginBottom:
                "clamp(24px,5vw,40px)",
            }}
          >
            <div
              style={{
                display:
                  "flex",
                flexDirection:
                  "column",
                gap: "4px",
              }}
            >
              <p
                className="text-label-mono"
                style={{
                  display:
                    "inline-block",
                  alignSelf:
                    "flex-start",
                  color:
                    "var(--c-surface)",
                  background:
                    "var(--c-teal-dark)",
                  padding:
                    "3px 10px",
                  borderRadius:
                    "2px",
                }}
              >
                Discography
              </p>

              <div className="flex items-end justify-between gap-6 flex-wrap">
                <h2
                  style={{
                    fontFamily:
                      "var(--f-display)",
                    fontSize:
                      "clamp(56px,9vw,120px)",
                    letterSpacing:
                      "-0.04em",
                    lineHeight:
                      0.88,
                    color:
                      "var(--c-teal-dark)",
                    margin: 0,
                  }}
                >
                  Music
                </h2>

                <div className="hidden sm:flex items-center gap-2 pb-2">
                  {FILTERS.map(
                    (
                      f
                    ) => (
                      <FilterPill
                        key={
                          f
                        }
                        label={
                          f
                        }
                        active={
                          filter ===
                          f
                        }
                        onClick={() =>
                          setFilter(
                            f
                          )
                        }
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          <AlbumDisplay
            albums={
              filteredAlbums
            }
            selectedId={
              activeAlbum?.id ??
              null
            }
            onSelectAlbum={
              setSelectedAlbum
            }
            accentColor={
              accentColor
            }
          />

          {activeAlbum?.spotify_url && (
            <SpotifyCta
              href={
                activeAlbum.spotify_url
              }
              accentColor={
                accentColor
              }
              width={
                PLAYER_WIDTH
              }
            />
          )}

          <div
            style={{
              width: PLAYER_WIDTH,
              margin: "14px auto 0",
              height: "82px",
              borderRadius: "14px",
              overflow: "hidden",
              border: `1.5px solid ${accentColor}45`,
              boxShadow: `0 4px 24px -4px ${accentColor}30`,
              position: "relative",
              background: `${accentColor}05`,
            }}
          >
            <iframe
              title="preview"
              src={embedSrc || ""}
              width="100%"
              height="80"
              style={{
                border: "none",
                position: "absolute",
                top: 0,
                left: 0,
                opacity: embedSrc ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
            />
          </div>

          <div
            style={{
              position:
                "sticky",
              top: "0",
              zIndex: 10,
              background:
                "var(--c-surface)",
              paddingTop:
                "12px",
              paddingBottom:
                "12px",
              margin: "0 -4px",
              paddingLeft: "4px",
              paddingRight: "4px",
            }}
          >
            <TracklistToggle
              isOpen={
                isTracklistOpen
              }
              onToggle={() =>
                setIsTracklistOpen(
                  (
                    prev
                  ) =>
                    !prev
                )
              }
              tracklistId={
                tracklistId
              }
            />
          </div>

          {activeAlbum && (
            <TrackList
              tracks={
                activeAlbum.tracks
              }
              activeTrackId={
                activeTrackId
              }
              onSelectTrack={
                handleSelectTrack
              }
              isOpen={
                isTracklistOpen
              }
              tracklistId={
                tracklistId
              }
              accentColor={
                accentColor
              }
            />
          )}
        </div>
      </section>
    );
  };

function FilterPill({
  label,
  active,
  onClick,
}: any) {
  return (
    <motion.button
      onClick={onClick}
      aria-pressed={active}
      animate={{
        background: active
          ? "var(--c-teal-dark)"
          : "transparent",
        color: active
          ? "#fff"
          : "var(--c-ink)",
        borderColor: active
          ? "var(--c-teal-dark)"
          : "var(--c-surface-3)",
        opacity: active
          ? 1
          : 0.55,
      }}
      style={{
        fontFamily:
          "var(--f-mono)",
        fontSize:
          "10px",
        letterSpacing:
          "0.1em",
        textTransform:
          "uppercase",
        padding:
          "6px 16px",
        borderRadius:
          "999px",
        border:
          "1.5px solid",
      }}
    >
      {label}
    </motion.button>
  );
}

function TracklistToggle({
  isOpen,
  onToggle,
  tracklistId,
}: any) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls={
        tracklistId
      }
      style={{
        width: "100%",
        display:
          "flex",
        alignItems:
          "center",
        gap: "10px",
        marginTop:
          "16px",
        padding: 0,
        border:
          "none",
        background:
          "transparent",
        cursor:
          "pointer",
      }}
    >
      <span
        style={{
          fontFamily:
            "var(--f-mono)",
          fontSize:
            "9px",
          letterSpacing:
            "0.14em",
          textTransform:
            "uppercase",
          color:
            "var(--c-ink)",
          opacity:
            0.35,
        }}
      >
        Tracklist
      </span>

      <div
        style={{
          flex: 1,
          height:
            "1px",
          background:
            "var(--c-surface-3)",
        }}
      />

      <motion.span
        animate={{
          rotate:
            isOpen
              ? 180
              : 0,
        }}
      >
        <CaretDown
          size={14}
          weight="bold"
        />
      </motion.span>
    </button>
  );
}

function SpotifyCta({
  href,
  accentColor,
  width,
}: any) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display:
          "flex",
        alignItems:
          "center",
        justifyContent:
          "center",
        gap: "10px",
        width,
        margin:
          "clamp(14px,3vw,20px) auto 0",
        padding:
          "14px",
        borderRadius:
          "12px",
        border: `1.5px solid ${accentColor}40`,
        background: `${accentColor}08`,
        color:
          "var(--c-ink)",
        textDecoration:
          "none",
        fontFamily:
          "var(--f-mono)",
        fontSize:
          "11px",
        letterSpacing:
          "0.1em",
        textTransform:
          "uppercase",
      }}
    >
      <Icon
        icon="mingcute:spotify-line"
        style={{ fontSize: "16px" }}
      />
      Listen on Spotify
    </a>
  );
}
