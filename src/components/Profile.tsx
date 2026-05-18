"use client";

import Image from "next/image";
import { motion } from "framer-motion";

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

const ZODIAC_SYMBOLS: Record<string, string> = {
  aries: "♈", taurus: "♉", gemini: "♊", cancer: "♋",
  leo: "♌", virgo: "♍", libra: "♎", scorpio: "♏",
  sagittarius: "♐", capricorn: "♑", aquarius: "♒", pisces: "♓",
};

function ZodiacSymbol({ sign, color, size = 11 }: { sign?: string; color: string; size?: number }) {
  const symbol = ZODIAC_SYMBOLS[sign?.toLowerCase().trim() ?? ""] ?? "✦";
  return (
    <span
      aria-label={sign}
      style={{
        fontSize: size,
        lineHeight: 1,
        fontFamily: "'Playfair Display', serif",
        color,
        display: "inline-block",
        flexShrink: 0,
      }}
    >
      {symbol}
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
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function sortByBirthday(members: Member[]): Member[] {
  return [...members].sort((a, b) => {
    if (!a.birthday) return 1;
    if (!b.birthday) return -1;
    return new Date(a.birthday).getTime() - new Date(b.birthday).getTime();
  });
}

function PhotoCard({ member, index }: { member: Member; index: number }) {
  const accent = member.signatureColor || "#63CBD6";
  const { r, g, b } = hexToRgb(accent);
  const hasProfileImg = !!member.profileImage?.startsWith("http");
  const hasGalleryImg = !!member.galleryImage?.startsWith("http");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group"
      style={{ perspective: "1000px", width: "100%", aspectRatio: "2 / 3" }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform 0.72s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        className="group-hover:[transform:rotateY(180deg)]"
      >

        {/* ── FRONT ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: `0 16px 48px -16px rgba(${r},${g},${b},0.35), 0 4px 20px rgba(12,12,10,0.14)`,
          }}
        >
          {hasProfileImg ? (
            <Image
              src={member.profileImage!}
              alt={member.stageName}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover object-top"
            />
          ) : (
            <div
              style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(160deg, rgba(${r},${g},${b},0.22), rgba(${r},${g},${b},0.06))`,
              }}
            />
          )}

          {/* bottom gradient */}
          <div
            style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: `linear-gradient(to top, rgba(${r},${g},${b},0.68) 0%, rgba(12,12,10,0.18) 42%, transparent 65%)`,
            }}
          />

          {/* card border */}
          <div
            style={{
              position: "absolute", inset: 0, borderRadius: 16,
              border: `1px solid rgba(${r},${g},${b},0.42)`,
              pointerEvents: "none",
            }}
          />

          {/* top-left serial */}
          <div
            style={{
              position: "absolute", top: 11, left: 13,
              fontFamily: "var(--f-mono)", fontSize: 8,
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: `rgba(${r},${g},${b},0.9)`, lineHeight: 1,
            }}
          >
            BINI · {String(index + 1).padStart(2, "0")}
          </div>

          {/* top-right zodiac */}
          <div style={{ position: "absolute", top: 9, right: 12 }}>
            <ZodiacSymbol sign={member.zodiac} color={`rgba(${r},${g},${b},0.95)`} size={13} />
          </div>

          {/* bottom name block */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 13px 14px" }}>
            <div
              style={{
                fontFamily: "var(--f-mono)", fontSize: 7.5,
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: "var(--c-surface)", opacity: 0.8, marginBottom: 3,
              }}
            >
              {member.roles?.[0] || "Member"}
            </div>
            <div
              style={{
                fontFamily: "var(--f-display)",
                fontSize: "clamp(1.05rem, 2.4vw, 1.55rem)",
                lineHeight: 0.88, letterSpacing: "0.01em", color: "#fff",
              }}
            >
              {member.stageName}
            </div>
          </div>

          <div className="mv-light-sweep" style={{ borderRadius: 16 }} />
        </div>

        {/* ── BACK ── */}
        <div
          style={{
            position: "absolute", inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: 16, overflow: "hidden",
            background: "var(--c-surface)",
            boxShadow: `0 20px 52px -14px rgba(${r},${g},${b},0.4), 0 4px 16px rgba(12,12,10,0.12)`,
          }}
        >
          {/* gallery image */}
          <div style={{ position: "relative", width: "100%", height: "50%", overflow: "hidden" }}>
            {hasGalleryImg ? (
              <Image
                src={member.galleryImage!}
                alt={`${member.stageName} gallery`}
                fill
                sizes="(max-width: 640px) 45vw, 20vw"
                className="object-cover object-top"
              />
            ) : (
              <div
                style={{
                  width: "100%", height: "100%",
                  background: `linear-gradient(160deg, ${accent}33, ${accent}0a)`,
                }}
              />
            )}

            {/* fade into card using ONLY their hex */}
            <div
              style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: "60%",
                background: `linear-gradient(to top, var(--c-surface) 0%, ${accent}00 100%)`,
                pointerEvents: "none",
              }}
            />
          </div>

          {/* info */}
          <div style={{ padding: "2px 14px 14px", display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: 8 }}>
              <div
                style={{
                  fontFamily: "var(--f-display)",
                  fontSize: "clamp(1.1rem, 2.6vw, 1.55rem)",
                  lineHeight: 0.88, color: "var(--c-ink)", letterSpacing: "0.01em",
                }}
              >
                {member.stageName}
              </div>
              <div
                style={{
                  fontFamily: "var(--f-mono)", fontSize: 7.5,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "var(--c-ink)", opacity: 0.4, marginTop: 3,
                }}
              >
                {member.fullName}
              </div>
            </div>

            {/* accent rule — hex only */}
            <div
              style={{
                height: 1, marginBottom: 9, opacity: 0.5,
                background: `linear-gradient(90deg, ${accent}, transparent)`,
              }}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 7.5, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.38, color: "var(--c-ink)" }}>
                  Zodiac
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--f-mono)", fontSize: 8, textTransform: "uppercase", letterSpacing: "0.08em", color: accent }}>
                  <ZodiacSymbol sign={member.zodiac} color={accent} size={10} />
                  {member.zodiac || "—"}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 7.5, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.38, color: "var(--c-ink)", flexShrink: 0 }}>
                  Birthday
                </span>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 7.5, letterSpacing: "0.06em", color: "var(--c-ink)", opacity: 0.65, textAlign: "right" }}>
                  {formatBirthday(member.birthday)}
                </span>
              </div>

              {member.roles?.length ? (
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 6 }}>
                  <span style={{ fontFamily: "var(--f-mono)", fontSize: 7.5, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.38, color: "var(--c-ink)", flexShrink: 0 }}>
                    Role
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "flex-end" }}>
                    {member.roles.map((role) => (
                      <span
                        key={role}
                        style={{
                          fontFamily: "var(--f-mono)", fontSize: 7,
                          textTransform: "uppercase", letterSpacing: "0.08em",
                          padding: "2px 6px", borderRadius: 999,
                          border: `1px solid ${accent}55`, color: accent, lineHeight: 1.6,
                        }}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div
              style={{
                marginTop: 10, paddingTop: 9,
                borderTop: "1px solid rgba(12,12,10,0.07)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--f-mono)", fontSize: 7,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  color: "var(--c-ink)", opacity: 0.28,
                }}
              >
                BINI · {String(index + 1).padStart(2, "0")} / 08
              </span>
            </div>
          </div>

          <div
            style={{
              position: "absolute", inset: 0, borderRadius: 16,
              border: `1px solid ${accent}3a`, pointerEvents: "none",
            }}
          />
        </div>

      </div>
    </motion.div>
  );
}

export default function Profile({ members }: ProfileProps) {
  if (!members?.length) return null;

  const sorted = sortByBirthday(members);
  const row1 = sorted.slice(0, 4);
  const row2 = sorted.slice(4, 8);

  return (
    <section
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ background: "var(--c-surface)" }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div style={{ position: "absolute", top: 0, left: "10%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,115,154,0.07) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "8%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(155,114,207,0.07) 0%, transparent 70%)", filter: "blur(50px)" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">

        {/* header */}
        <div className="mb-14">
          <p className="text-label-mono mb-4">P-Pop · Philippines · Est. 2021</p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <h2
              style={{
                fontFamily: "var(--f-display)",
                fontSize: "clamp(3.2rem, 8vw, 8rem)",
                lineHeight: 0.85, letterSpacing: "-0.03em",
              }}
            >
              MEET<br />THE 8
            </h2>
            <p
              style={{
                fontFamily: "var(--f-serif)", fontStyle: "italic",
                fontSize: "clamp(0.9rem, 1.8vw, 1.1rem)",
                opacity: 0.6, maxWidth: 320, lineHeight: 1.65,
              }}
            >
              Eight girls. Eight colors. One sound that's taking the world.{" "}
              <span
                style={{
                  display: "block", marginTop: 6,
                  fontFamily: "var(--f-mono)", fontStyle: "normal",
                  fontSize: "0.68rem", letterSpacing: "0.1em",
                  textTransform: "uppercase", opacity: 0.55,
                }}
              >
                Flip each card to reveal
              </span>
            </p>
          </div>
        </div>

        {/* ── DESKTOP: stacked offset rows ── */}
        <div className="hidden md:flex flex-col gap-5">

          {/* Row 1 — flush left */}
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
          >
            {row1.map((member, i) => (
              <PhotoCard key={member._id} member={member} index={i} />
            ))}
          </div>

          {/* Row 2 — offset right by half a card + half a gap */}
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

        {/* ── MOBILE: 2-col uniform grid ── */}
        <div className="grid grid-cols-2 gap-4 md:hidden">
          {sorted.map((member, i) => (
            <PhotoCard key={member._id} member={member} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}