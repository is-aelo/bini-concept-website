"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

interface Member {
  _id: string;
  stageName: string;
  fullName: string;
  birthday?: string;
  zodiac?: string;
  roles?: string[];
  signatureColor?: string;
  profileImage?: string | null;
  galleryImage?: string | null;
}

interface ProfileProps {
  members: Member[];
}

const ZODIAC_ICONS: Record<string, string> = {
  aries: "mingcute:aries-line",
  taurus: "mingcute:taurus-line",
  gemini: "mingcute:gemini-line",
  cancer: "mingcute:cancer-line",
  leo: "mingcute:leo-line",
  virgo: "mingcute:virgo-line",
  libra: "mingcute:libra-line",
  scorpio: "mingcute:scorpio-line",
  sagittarius: "mingcute:sagittarius-line",
  capricorn: "mingcute:capricorn-line",
  aquarius: "mingcute:aquarius-line",
  pisces: "mingcute:pisces-line",
};

function ZodiacSymbol({ sign, color }: { sign?: string; color: string }) {
  const iconName = ZODIAC_ICONS[sign?.toLowerCase().trim() ?? ""] ?? "mingcute:star-line";
  return (
    <span
      aria-label={sign}
      className="inline-flex items-center justify-center shrink-0 w-[var(--meta-icon-size)] h-[var(--meta-icon-size)]"
      style={{ color }}
    >
      <Icon icon={iconName} className="w-full h-full" />
    </span>
  );
}

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return { r, g, b };
}

function formatBirthday(raw?: string) {
  if (!raw) return "—";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function sortByBirthdayEldestToYoungest(members: Member[]): Member[] {
  return [...members].sort((a, b) => {
    if (!a.birthday) return 1;
    if (!b.birthday) return -1;
    return new Date(a.birthday).getTime() - new Date(b.birthday).getTime();
  });
}

function TickerTape({ members }: { members: Member[] }) {
  const items = [...members, ...members];
  const credits = items
    .map((m) => `${m.stageName.toUpperCase()} · ${(m.roles?.[0] ?? "MEMBER").toUpperCase()}`)
    .join("   /   ");

  return (
    <div
      className="border-t border-b overflow-hidden relative"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        paddingTop: "var(--ticker-py)",
        paddingBottom: "var(--ticker-py)",
        marginBottom: "var(--ticker-mb)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "3rem",
          whiteSpace: "nowrap",
          animation: "bini-ticker 28s linear infinite",
          willChange: "transform",
        }}
      >
        {[credits, credits].map((c, i) => (
          <span
            key={i}
            className="tracking-widest uppercase shrink-0"
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: "var(--ticker-fs)",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

function PhotoCard({ member, index }: { member: Member; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const accent = member.signatureColor || "#63CBD6";
  const { r, g, b } = hexToRgb(accent);
  const hasProfileImg = !!member.profileImage?.startsWith("http");
  const hasGalleryImg = !!member.galleryImage?.startsWith("http");

  const BASE_ROTATION = (index % 2 === 0 ? -1 : 1) * (0.6 + (index % 3) * 0.4);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") {
      setIsFlipped(!isFlipped);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isFlipped) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: -dy * 6, y: dx * 6 });
  };

  const handleMouseEnter = () => setIsFlipped(true);
  const handleMouseLeave = () => {
    setIsFlipped(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onPointerDown={handlePointerDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className="relative cursor-pointer select-none touch-manipulation w-full aspect-[2/3]"
      style={{
        perspective: "1500px",
        transform: `rotate(${BASE_ROTATION}deg)`,
        transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
          rotateX: isFlipped ? 0 : tilt.x,
          rotateZ: isFlipped ? 0 : tilt.y * 0.15,
          scale: isFlipped ? 1.03 : 1,
          z: isFlipped ? 20 : 0,
        }}
        transition={{
          opacity: { duration: 0.5, delay: (index % 4) * 0.06 },
          y: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: (index % 4) * 0.06 },
          rotateY: { duration: 0.72, ease: [0.4, 0, 0.2, 1] },
          rotateX: { duration: 0.12, ease: "linear" },
          scale: { duration: 0.35, ease: [0.25, 1, 0.5, 1] },
        }}
        className="w-full h-full"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* ── FRONT ── */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: 16,
            boxShadow: `0 12px 32px -12px rgba(${r},${g},${b},0.25), 0 4px 16px rgba(0,0,0,0.18)`,
          }}
        >
          <div
            className="absolute inset-0 z-[3] pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.018) 3px, rgba(0,0,0,0.018) 4px)",
              mixBlendMode: "multiply",
            }}
          />

          {hasProfileImg ? (
            <Image
              src={member.profileImage!}
              alt={member.stageName}
              fill
              sizes="(max-width: 480px) 50vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover object-top"
              priority={index < 4}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(160deg, rgba(${r},${g},${b},0.38), rgba(${r},${g},${b},0.10))`,
              }}
            />
          )}

          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background: `linear-gradient(to top, rgba(${r},${g},${b},0.72) 0%, rgba(10,10,8,0.22) 42%, transparent 65%)`,
            }}
          />

          <div
            className="absolute inset-0 z-[4] pointer-events-none"
            style={{
              borderRadius: 16,
              border: `1px solid rgba(${r},${g},${b},0.55)`,
              boxShadow: `inset 0 0 18px rgba(${r},${g},${b},0.12), inset 0 1px 0 rgba(255,255,255,0.18)`,
            }}
          />

          <div
            className="absolute top-0 inset-x-0 h-[48%] z-[2] pointer-events-none"
            style={{
              background:
                "linear-gradient(175deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.04) 40%, transparent 100%)",
            }}
          />

          <div
            className="absolute top-0 right-0 w-[2px] h-full z-[5] pointer-events-none"
            style={{
              background: `rgba(${r},${g},${b},0.45)`,
            }}
          />

          <div 
            className="absolute bottom-0 inset-x-0 z-[5] card-pad"
          >
            <div
              className="card-bini-label"
              style={{
                fontFamily: "var(--f-mono)",
                textTransform: "uppercase",
                color: "var(--c-surface, #F5F3EE)",
                opacity: 0.8,
              }}
            >
              BINI
            </div>
            <div
              className="card-name"
              style={{
                fontFamily: "var(--f-display)",
                lineHeight: 0.88,
                letterSpacing: "0.01em",
                color: "#fff",
              }}
            >
              {member.stageName}
            </div>
          </div>

          <div
            className="absolute z-[5] card-serial"
            style={{
              fontFamily: "var(--f-mono)",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            {String(index + 1).padStart(2, "0")} / 08
          </div>

          <div className="mv-light-sweep" style={{ borderRadius: 16 }} />
        </div>

        {/* ── BACK ── */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: 16,
            background: "var(--c-surface, #F5F3EE)",
            boxShadow: `0 14px 36px -12px rgba(${r},${g},${b},0.25), 0 4px 14px rgba(0,0,0,0.16)`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            className="absolute inset-0 z-[3] pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.015) 3px, rgba(0,0,0,0.015) 4px)",
              mixBlendMode: "multiply",
            }}
          />

          <div
            className="absolute top-0 right-0 w-[2px] h-full z-[6] pointer-events-none"
            style={{
              background: `rgba(${r},${g},${b},0.25)`,
            }}
          />

          <div className="relative w-full h-[58%] shrink-0 overflow-hidden">
            {hasGalleryImg ? (
              <Image
                src={member.galleryImage!}
                alt={`${member.stageName} gallery`}
                fill
                sizes="(max-width: 480px) 50vw, 20vw"
                className="object-cover object-top"
              />
            ) : (
              <div
                className="w-full h-full"
                style={{
                  background: `linear-gradient(160deg, ${accent}33, ${accent}0a)`,
                }}
              />
            )}

            <div
              className="absolute inset-0 z-[1] pointer-events-none"
              style={{
                background: `linear-gradient(to top, rgba(${r},${g},${b},0.68) 0%, rgba(12,12,10,0.18) 42%, transparent 65%)`,
              }}
            />

            <div className="absolute bottom-0 inset-x-0 z-[2] card-back-header">
              <div
                className="card-back-name"
                style={{
                  fontFamily: "var(--f-display)",
                  lineHeight: 0.9,
                  color: "var(--c-surface, #F5F3EE)",
                  letterSpacing: "0.01em",
                }}
              >
                {member.stageName}
              </div>
              <div
                className="card-fullname"
                style={{
                  fontFamily: "var(--f-mono)",
                  textTransform: "uppercase",
                  color: "var(--c-surface, #F5F3EE)",
                  opacity: 0.85,
                }}
              >
                {member.fullName}
              </div>
            </div>
          </div>

          <div 
            className="card-meta-pad flex flex-col grow justify-between relative z-[4]"
          >
            <div className="flex flex-col container-gap">
              <div className="flex items-center justify-between">
                <span className="meta-label" style={{ fontFamily: "var(--f-mono)", textTransform: "uppercase", opacity: 0.5, color: "var(--c-ink, #0C0C0A)" }}>
                  Zodiac
                </span>
                <span className="meta-value inline-flex items-center value-gap" style={{ fontFamily: "var(--f-mono)", textTransform: "uppercase", color: "var(--c-ink, #0C0C0A)" }}>
                  <ZodiacSymbol sign={member.zodiac} color="var(--c-ink, #0C0C0A)" />
                  {member.zodiac || "—"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="meta-label" style={{ fontFamily: "var(--f-mono)", textTransform: "uppercase", opacity: 0.5, color: "var(--c-ink, #0C0C0A)" }}>
                  Birthday
                </span>
                <span className="meta-value" style={{ fontFamily: "var(--f-mono)", color: "var(--c-ink, #0C0C0A)", opacity: 0.9 }}>
                  {formatBirthday(member.birthday)}
                </span>
              </div>

              {member.roles?.length ? (
                <div className="flex items-start justify-between gap-2">
                  <span className="meta-label shrink-0 mt-[2px]" style={{ fontFamily: "var(--f-mono)", textTransform: "uppercase", opacity: 0.5, color: "var(--c-ink, #0C0C0A)" }}>
                    Role
                  </span>
                  <div className="flex flex-wrap badge-gap justify-end max-w-[72%]">
                    {member.roles.map((role) => (
                      <span
                        key={role}
                        className="role-badge"
                        style={{
                          fontFamily: "var(--f-mono)",
                          textTransform: "uppercase",
                          borderRadius: 3,
                          background: "rgba(12, 12, 10, 0.06)",
                          border: "1px solid rgba(12, 12, 10, 0.12)",
                          color: "var(--c-ink, #0C0C0A)",
                          lineHeight: 1.2,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="card-back-footer" style={{ borderTop: "1px solid rgba(12, 12, 10, 0.08)" }}>
              <span
                style={{
                  fontFamily: "var(--f-mono)",
                  textTransform: "uppercase",
                  color: "var(--c-ink, #0C0C0A)",
                  opacity: 0.4,
                }}
              >
                BINI · {String(index + 1).padStart(2, "0")} / 08
              </span>
            </div>
          </div>

          <div
            className="absolute inset-0 pointer-events-none z-[6]"
            style={{
              borderRadius: 16,
              border: `1px solid rgba(${r},${g},${b},0.25)`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.4)`,
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

export default function Profile({ members }: ProfileProps) {
  if (!members?.length) return null;

  const sorted = sortByBirthdayEldestToYoungest(members);
  const row1 = sorted.slice(0, 4);
  const row2 = sorted.slice(4, 8);

  return (
    <>
      <style>{`
        @keyframes bini-ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        :root {
          --ticker-fs: 7px;
          --ticker-py: 6px;
          --ticker-mb: 24px;
        }

        @media (min-width: 360px) {
          :root {
            --ticker-fs: 8px;
            --ticker-py: 8px;
            --ticker-mb: 32px;
          }
        }

        @media (min-width: 768px) {
          :root {
            --ticker-fs: 9px;
            --ticker-py: 9px;
            --ticker-mb: 52px;
          }
        }

        .card-pad { padding: 8px 10px; }
        .card-bini-label { font-size: 6.5px; margin-bottom: 1px; }
        .card-name { font-size: 0.9rem; }
        .card-serial { top: 8px; left: 8px; font-size: 6.5px; }
        
        .card-back-header { padding: 0 10px 5px; }
        .card-back-name { font-size: 0.95rem; }
        .card-fullname { font-size: 5.5px; margin-top: 1px; letter-spacing: 0.04em; }
        
        .card-meta-pad { padding: 6px 10px 8px; }
        .container-gap { gap: 3px; }
        .value-gap { gap: 3px; }
        .badge-gap { gap: 2px; }
        
        .meta-label { font-size: 6px; letter-spacing: 0.04em; }
        .meta-value { font-size: 6px; letter-spacing: 0.02em; }
        .role-badge { font-size: 5px; padding: 0.5px 3px; }
        --meta-icon-size: 8px;
        
        .card-back-footer { padding-top: 4px; margin-top: 2px; font-size: 5.5px; letter-spacing: 0.06em; }

        @media (min-width: 375px) {
          .card-pad { padding: 10px 11px; }
          .card-bini-label { font-size: 7px; }
          .card-name { font-size: 1.05rem; }
          .card-serial { top: 10px; left: 10px; font-size: 7px; }
          
          .card-back-header { padding: 0 11px 6px; }
          .card-back-name { font-size: 1.1rem; }
          .card-fullname { font-size: 6.5px; }
          
          .card-meta-pad { padding: 7px 11px 9px; }
          .container-gap { gap: 4px; }
          .meta-label { font-size: 6.5px; }
          .meta-value { font-size: 6.5px; }
          .role-badge { font-size: 5.5px; padding: 0.5px 4px; }
          --meta-icon-size: 9px;
          .card-back-footer { font-size: 6px; }
        }

        @media (min-width: 425px) {
          .card-pad { padding: 12px 12px 10px; }
          .card-name { font-size: 1.2rem; }
          .card-back-header { padding: 0 12px 8px; }
          .card-back-name { font-size: 1.25rem; }
          .card-fullname { font-size: 7px; }
          .card-meta-pad { padding: 8px 12px 10px; }
          .container-gap { gap: 5px; }
          .value-gap { gap: 4px; }
          .badge-gap { gap: 3px; }
          .meta-label { font-size: 7px; }
          .meta-value { font-size: 7px; }
          .role-badge { font-size: 6px; padding: 1px 4.5px; }
          --meta-icon-size: 10px;
          .card-back-footer { font-size: 6.5px; }
        }

        @media (min-width: 768px) {
          .card-pad { padding: 16px 13px 14px; }
          .card-bini-label { font-size: 7.5px; margin-bottom: 3px; }
          .card-name { font-size: clamp(1.05rem, 2.4vw, 1.55rem); }
          .card-serial { top: 12px; left: 12px; font-size: 7px; }
          
          .card-back-header { padding: 0 14px 10px; }
          .card-back-name { font-size: clamp(1.2rem, 2.8vw, 1.65rem); }
          .card-fullname { font-size: 7px; margin-top: 4px; letter-spacing: 0.08em; }
          
          .card-meta-pad { padding: 10px 14px 12px; }
          .container-gap { gap: 5px; }
          .value-gap { gap: 5px; }
          .badge-gap { gap: 3px; }
          
          .meta-label { font-size: 7.5px; letter-spacing: 0.1em; }
          .meta-value { font-size: 7.5px; letter-spacing: 0.08em; }
          .role-badge { font-size: 6.5px; padding: 1px 5px; }
          --meta-icon-size: 11px;
          
          .card-back-footer { padding-top: 6px; margin-top: 4px; font-size: 7px; letter-spacing: 0.12em; }
        }
      `}</style>

      <section
        className="relative py-12 sm:py-20 md:py-28 overflow-hidden"
        style={{ background: "var(--c-surface, #F5F3EE)" }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: "absolute", top: 0, left: "10%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,115,154,0.07) 0%, transparent 70%)", filter: "blur(50px)" }} />
          <div style={{ position: "absolute", bottom: "10%", right: "8%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(155,114,207,0.07) 0%, transparent 70%)", filter: "blur(50px)" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <div className="mb-6">
            <p className="mb-2 sm:mb-4 text-xs tracking-widest opacity-80" style={{ fontFamily: "var(--f-mono)", color: "var(--c-ink, #0C0C0A)" }}>
              THE NATION&apos;S GIRL GROUP
            </p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-5">
              <h2
                style={{
                  fontFamily: "var(--f-display)",
                  fontSize: "clamp(2.4rem, 7vw, 8rem)",
                  lineHeight: 0.85,
                  letterSpacing: "-0.03em",
                  color: "var(--c-ink, #0C0C0A)",
                }}
              >
                MEET<br />THE 8
              </h2>
              <p
                style={{
                  fontFamily: "var(--f-mono)",
                  fontSize: "0.72rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  opacity: 0.6,
                  maxWidth: 240,
                  lineHeight: 1.4,
                  color: "var(--c-ink, #0C0C0A)",
                }}
              >
                Tap or hover to get to know your bias.
              </p>
            </div>
          </div>

          <TickerTape members={sorted} />

          {/* ── DESKTOP: stacked offset rows ── */}
          <div className="hidden md:flex flex-col gap-5">
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
            >
              {row1.map((member, i) => (
                <PhotoCard key={member._id} member={member} index={i} />
              ))}
            </div>

            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: "repeat(4, 1fr)",
                marginLeft: "calc((100% + 1rem) / 4 / 2)",
                marginRight: 0,
                width: "calc(100% - (100% + 1rem) / 4 / 2)",
              }}
            >
              {row2.map((member, i) => (
                <PhotoCard key={member._id} member={member} index={i + 4} />
              ))}
            </div>
          </div>

          {/* ── MOBILE/TABLET: 2-col uniform precise grid ── */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:hidden">
            {sorted.map((member, i) => (
              <PhotoCard key={member._id} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}