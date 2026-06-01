"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import ProfileGridShader from "./ProfileGridShader";

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
  socials?: {
    instagram?: string;
    tiktok?: string;
  };
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
      className="inline-flex items-center justify-center shrink-0"
      style={{ color, width: 8, height: 8 }}
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

function CardFront({
  member,
  index,
  r,
  g,
  b,
}: {
  member: Member;
  index: number;
  r: number;
  g: number;
  b: number;
}) {
  const hasProfileImg = !!member.profileImage?.startsWith("http");
  return (
    <div
      className="absolute inset-0 overflow-hidden bg-zinc-900"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        borderRadius: 16,
        pointerEvents: "none",
      }}
    >
      <div
        className="absolute inset-0 z-3"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.02) 3px, rgba(0,0,0,0.02) 4px)",
          mixBlendMode: "multiply",
        }}
      />

      {hasProfileImg ? (
        <Image
          src={member.profileImage!}
          alt={member.stageName}
          fill
          sizes="(max-width: 1024px) 100vw, 210px"
          className="object-cover object-top"
          priority={index < 2}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(160deg, rgba(${r},${g},${b},0.35), rgba(${r},${g},${b},0.06))`,
          }}
        />
      )}

      <div
        className="absolute inset-0 z-1"
        style={{
          background: `linear-gradient(to top, rgba(${r},${g},${b},0.85) 0%, rgba(12,12,10,0.2) 48%, transparent 72%)`,
        }}
      />

      <div
        className="absolute inset-0 z-4"
        style={{
          borderRadius: 16,
          border: `1px solid rgba(${r},${g},${b},0.45)`,
          boxShadow: `inset 0 0 16px rgba(${r},${g},${b},0.12), inset 0 1px 0 rgba(255,255,255,0.18)`,
        }}
      />

      <div className="absolute bottom-0 inset-x-0 z-5 px-4 pb-4">
        <div
          className="text-[7px] tracking-widest opacity-70 mb-1"
          style={{ fontFamily: "var(--f-mono)", color: "#F5F3EE" }}
        >
          BINI
        </div>
        <div
          className="font-normal tracking-wide"
          style={{ fontFamily: "var(--f-display)", fontSize: "1.75rem", lineHeight: 0.88, color: "#fff" }}
        >
          {member.stageName}
        </div>
        <div
          className="text-[7px] tracking-widest mt-1 uppercase"
          style={{ fontFamily: "var(--f-mono)", color: "#fff" }}
        >
          {member.fullName}
        </div>
      </div>

      <div
        className="absolute top-4 left-4 z-5 text-[7px]"
        style={{ fontFamily: "var(--f-mono)", color: "rgba(255,255,255,0.35)" }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>
    </div>
  );
}

function CardBack({
  member,
  index,
  accent,
  r,
  g,
  b,
  total,
}: {
  member: Member;
  index: number;
  accent: string;
  r: number;
  g: number;
  b: number;
  total: number;
}) {
  const hasGalleryImg = !!member.galleryImage?.startsWith("http");
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
        borderRadius: 16,
        background: "var(--c-surface, #F5F3EE)",
        display: "flex",
        flexDirection: "column",
        pointerEvents: "none",
      }}
    >
      <div className="relative w-full h-[52%] shrink-0 overflow-hidden bg-zinc-200">
        {hasGalleryImg ? (
          <Image
            src={member.galleryImage!}
            alt={`${member.stageName} gallery`}
            fill
            sizes="(max-width: 1024px) 100vw, 210px"
            className="object-cover object-top"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: `linear-gradient(160deg, ${accent}25, ${accent}05)` }}
          />
        )}
        <div
          className="absolute inset-0 z-1"
          style={{
            background: `linear-gradient(to top, rgba(${r},${g},${b},0.75) 0%, rgba(12,12,10,0.1) 52%, transparent 80%)`,
          }}
        />
      </div>

      <div className="px-3 py-3 flex flex-col grow justify-between bg-[#F5F3EE]">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-0.5">
            <div
              className="text-base font-normal tracking-wide"
              style={{ fontFamily: "var(--f-display)", lineHeight: 0.9, color: "#0C0C0A" }}
            >
              {member.stageName}
            </div>
            <div
              className="text-[6px] tracking-widest uppercase opacity-60"
              style={{ fontFamily: "var(--f-mono)", color: "#0C0C0A" }}
            >
              {member.fullName}
            </div>
          </div>
          <div className="flex flex-col gap-0.5 text-[8px] tracking-wide">
            <span className="opacity-40 uppercase" style={{ fontFamily: "var(--f-mono)", color: "rgba(12,12,10,0.65)" }}>Birthday</span>
            <span className="inline-flex items-center gap-1 font-medium" style={{ fontFamily: "var(--f-mono)", color: "#0C0C0A" }}>
              {formatBirthday(member.birthday)}
              <span className="opacity-40">/</span>
              <ZodiacSymbol sign={member.zodiac} color="#0C0C0A" />
              <span className="uppercase">{member.zodiac || "—"}</span>
            </span>
          </div>
          {member.roles?.length ? (
            <div className="flex flex-col gap-0.5 text-[8px] tracking-wide">
              <span className="opacity-40 uppercase" style={{ fontFamily: "var(--f-mono)", color: "rgba(12,12,10,0.65)" }}>Role</span>
              <div className="flex flex-wrap gap-1">
                {member.roles.slice(0, 2).map((role) => (
                  <span
                    key={role}
                    className="text-[7px] px-1 py-0.5 rounded-xs bg-black/5 border border-black/10 uppercase font-medium"
                    style={{ fontFamily: "var(--f-mono)", color: "#0C0C0A" }}
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        <div
          className="pt-2 border-t border-black/5 flex items-center justify-between"
          style={{ fontFamily: "var(--f-mono)", color: "rgba(12,12,10,0.55)" }}
        >
          <div className="text-[7px] tracking-widest uppercase">
            BINI · {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>
          {(member.socials?.instagram || member.socials?.tiktok) && (
            <div
              className="flex gap-1.5 items-center"
              style={{ pointerEvents: "auto", position: "relative", zIndex: 20 }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              {member.socials?.instagram && (
                <a
                  href={member.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center transition-colors hover:text-teal-600"
                  style={{ width: 20, height: 20, color: "inherit" }}
                  aria-label="Instagram"
                >
                  <Icon icon="mingcute:instagram-line" style={{ width: 12, height: 12 }} />
                </a>
              )}
              {member.socials?.tiktok && (
                <a
                  href={member.socials.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center transition-colors hover:text-teal-600"
                  style={{ width: 20, height: 20, color: "inherit" }}
                  aria-label="TikTok"
                >
                  <Icon icon="mingcute:tiktok-line" style={{ width: 12, height: 12 }} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div
        className="absolute inset-0"
        style={{
          borderRadius: 16,
          border: `1px solid rgba(${r},${g},${b},0.18)`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.35)`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

function DesktopPhotoCard({
  member,
  index,
  total,
  isDeckHovered,
}: {
  member: Member;
  index: number;
  total: number;
  isDeckHovered: boolean;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const tiltX = useMotionValue(0);
  const tiltZ = useMotionValue(0);
  const rafRef = useRef<number | null>(null);
  const pendingTilt = useRef({ x: 0, z: 0 });

  const accent = member.signatureColor || "#63CBD6";
  const { r, g, b } = hexToRgb(accent);

  const midIndex = (total - 1) / 2;
  const distanceFromCenter = index - midIndex;
  const stackedX = distanceFromCenter * 30;
  const stackedRotate = distanceFromCenter * 3;
  const fannedX = distanceFromCenter * 140;
  const fannedRotate = distanceFromCenter * 5;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    pendingTilt.current = { x: -dy * 2, z: dx * 0.4 };

    if (rafRef.current !== null) return;

    rafRef.current = window.requestAnimationFrame(() => {
      tiltX.set(pendingTilt.current.x);
      tiltZ.set(pendingTilt.current.z);
      rafRef.current = null;
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    tiltX.set(0);
    tiltZ.set(0);
  };

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="absolute select-none touch-none origin-bottom"
      style={{
        perspective: "1500px",
        width: "210px",
        height: "315px",
        bottom: "10%",
        left: "calc(50% - 105px)",
        zIndex: isFlipped ? 50 : 10 + index,
      }}
      animate={{
        x: isFlipped ? 0 : isDeckHovered ? fannedX : stackedX,
        rotate: isFlipped ? 0 : isDeckHovered ? fannedRotate : stackedRotate,
        y: isFlipped ? -40 : isDeckHovered ? -15 : 0,
      }}
      transition={{ type: "spring", stiffness: 120, damping: 24, mass: 0.6 }}
    >
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: "84%",
          height: "90%",
          left: "8%",
          bottom: 0,
          borderRadius: 24,
          backgroundColor: "rgba(12, 12, 10, 0.9)",
          transformOrigin: "bottom center",
        }}
        animate={{
          y: isFlipped ? 36 : isDeckHovered ? 14 : 6,
          scaleX: isFlipped ? 0.86 : isDeckHovered ? 0.92 : 0.95,
          scaleY: isFlipped ? 0.80 : isDeckHovered ? 0.88 : 0.92,
          filter: isFlipped
            ? `blur(12px) drop-shadow(0 6px 12px rgba(${r}, ${g}, ${b}, 0.12))`
            : isDeckHovered
            ? `blur(6px) drop-shadow(0 3px 6px rgba(${r}, ${g}, ${b}, 0.06))`
            : "blur(2.5px)",
          opacity: isFlipped ? 0.12 : isDeckHovered ? 0.22 : 0.65,
        }}
        transition={{ type: "spring", stiffness: 120, damping: 24, mass: 0.6 }}
      />

      <motion.div
        animate={{
          rotateY: isFlipped ? 180 : 0,
          scale: isFlipped ? 1.15 : 1,
        }}
        transition={{
          rotateY: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
          scale: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
        }}
        style={{
          transformStyle: "preserve-3d",
          rotateX: tiltX,
          rotateZ: tiltZ,
        }}
        className="w-full h-full relative"
        onClick={() => setIsFlipped((f) => !f)}
      >
        <CardFront member={member} index={index} r={r} g={g} b={b} />
        <CardBack member={member} index={index} accent={accent} r={r} g={g} b={b} total={total} />
      </motion.div>
    </motion.div>
  );
}

const STACK_TILTS = [-3.5, 1.8, -1.2, 2.6, -0.8, 3.1, -2.3, 0.9];
const STACK_OFFSETS = [
  { x: 0, y: 0 },
  { x: 3, y: 5 },
  { x: -2, y: 10 },
  { x: 4, y: 15 },
  { x: -1, y: 18 },
];
const SWIPE_THRESHOLD = 90;
const MAX_VISIBLE_STACK = 4;

function MobileDeckCard({
  member,
  index,
  stackPosition,
  total,
  onSwiped,
}: {
  member: Member;
  index: number;
  stackPosition: number;
  total: number;
  onSwiped: () => void;
}) {
  const accent = member.signatureColor || "#63CBD6";
  const { r, g, b } = hexToRgb(accent);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-14, STACK_TILTS[index % STACK_TILTS.length], 14]);
  const opacity = useTransform(x, [-200, -140, 0, 140, 200], [0, 1, 1, 1, 0]);

  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const isTopCard = stackPosition === 0;
  const stackTilt = STACK_TILTS[index % STACK_TILTS.length];
  const offset = STACK_OFFSETS[Math.min(stackPosition, STACK_OFFSETS.length - 1)];

  const handleDragEnd = async (_event: any, info: any) => {
    if (!isTopCard) return;
    if (Math.abs(info.offset.x) > SWIPE_THRESHOLD) {
      const direction = info.offset.x > 0 ? 1 : -1;
      await animate(x, direction * 420, { duration: 0.22, ease: [0.16, 1, 0.3, 1] });
      onSwiped();
      x.set(0);
      setIsFlipped(false);
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 28 });
    }
  };

  const handleFlip = () => {
    if (!isTopCard) return;
    if (Math.abs(x.get()) > 10) return;
    setIsAnimating(true);
    setIsFlipped((f) => !f);
    setTimeout(() => setIsAnimating(false), 250);
  };

  if (stackPosition >= MAX_VISIBLE_STACK) return null;

  const scale = 1 - stackPosition * 0.04;
  const yShift = stackPosition * 14;

  return (
    <motion.div
      drag={isTopCard ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.45}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      style={{
        x: isTopCard ? x : 0,
        rotate: isTopCard ? rotate : stackTilt + offset.x * 0.3,
        opacity: isTopCard ? opacity : 1,
        position: "absolute",
        width: "100%",
        height: "100%",
        top: yShift,
        left: 0,
        zIndex: MAX_VISIBLE_STACK - stackPosition,
        scale,
        touchAction: "pan-y",
        transformOrigin: "bottom center",
        perspective: "1200px",
      }}
      className="select-none"
      transition={{ type: "spring", stiffness: 220, damping: 24, mass: 0.6 }}
    >
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: "86%",
          height: "90%",
          left: "7%",
          bottom: 0,
          borderRadius: 20,
          backgroundColor: "rgba(12, 12, 10, 0.9)",
          transformOrigin: "bottom center",
        }}
        animate={{
          y: isTopCard ? 8 : 4,
          scaleX: isTopCard ? 0.92 : 0.95,
          filter: isTopCard
            ? `blur(5px) drop-shadow(0 2px 4px rgba(${r}, ${g}, ${b}, 0.08))`
            : "blur(2px)",
          opacity: isTopCard ? 0.25 : 0.65,
        }}
      />

      <motion.div
        className="w-full h-full relative"
        style={{
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        onClick={handleFlip}
      >
        <CardFront member={member} index={index} r={r} g={g} b={b} />
        <CardBack member={member} index={index} accent={accent} r={r} g={g} b={b} total={total} />
      </motion.div>

      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={{ opacity: 0.6, scale: 0.95 }}
            animate={{ opacity: 0, scale: 1.05 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: 16,
              border: `2px solid rgba(${r},${g},${b},0.6)`,
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MobileDeckViewer({ members }: { members: Member[] }) {
  const [queue, setQueue] = useState<number[]>(members.map((_, i) => i));

  const handleSwiped = useCallback(() => {
    setQueue((q) => {
      const [first, ...rest] = q;
      return [...rest, first];
    });
  }, []);

  const topIndex = queue[0];
  const topMember = members[topIndex];
  const accentColor = topMember?.signatureColor || "#63CBD6";

  return (
    <div className="flex flex-col items-center gap-6 py-6 px-4">
      <div
        className="relative w-full select-none"
        style={{ maxWidth: 220, height: 360, touchAction: "pan-y" }}
      >
        {[...queue].reverse().map((memberIndex, reversedPos) => {
          const stackPosition = queue.length - 1 - reversedPos;
          return (
            <MobileDeckCard
              key={memberIndex}
              member={members[memberIndex]}
              index={memberIndex}
              stackPosition={stackPosition}
              total={members.length}
              onSwiped={handleSwiped}
            />
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-2 mt-2">
        <div className="flex items-center gap-2">
          {members.map((_, i) => (
            <div
              key={i}
              className="transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                width: i === topIndex ? 18 : 5,
                height: 5,
                borderRadius: 3,
                background: i === topIndex ? accentColor : "rgba(12,12,10,0.12)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Profile({ members }: ProfileProps) {
  const [isDeckHovered, setIsDeckHovered] = useState(false);
  if (!members?.length) return null;

  const sorted = sortByBirthdayEldestToYoungest(members);

  return (
    <section
      className="relative py-12 sm:py-16 lg:py-24 overflow-hidden w-full"
      style={{ background: "var(--c-surface, #F5F3EE)" }}
    >
      <ProfileGridShader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mt-4 flex flex-col items-center lg:items-start text-center lg:text-left gap-2">
          <div>
            <span
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: 10,
                letterSpacing: ".12em",
                color: "var(--c-ink)",
                opacity: 0.75,
              }}
            >
              THE NATION'S GIRL GROUP
            </span>

            <h3
              style={{
                fontFamily: "var(--f-display)",
                fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                lineHeight: 0.95,
                color: "var(--c-teal-dark)",
                marginTop: 8,
              }}
            >
              MEET THE 8
            </h3>

            <p
              className="hidden lg:block mt-3"
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: "0.68rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                opacity: 0.5,
                color: "var(--c-ink)",
              }}
            >
              Hover to expand deck · Click card to flip
            </p>

            <p
              className="block lg:hidden mt-3"
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: "0.62rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                opacity: 0.5,
                color: "var(--c-ink)",
              }}
            >
              Tap to flip · Swipe for next
            </p>
          </div>
        </div>

        <div
          className="hidden lg:flex relative w-full items-center justify-center select-none mt-6"
          style={{ height: "460px" }}
          onMouseEnter={() => setIsDeckHovered(true)}
          onMouseLeave={() => setIsDeckHovered(false)}
        >
          <div className="relative w-full h-full max-w-4xl mx-auto">
            {sorted.map((member, i) => (
              <DesktopPhotoCard
                key={member._id}
                member={member}
                index={i}
                total={sorted.length}
                isDeckHovered={isDeckHovered}
              />
            ))}
          </div>
        </div>

        <div className="block lg:hidden mt-4">
          <MobileDeckViewer members={sorted} />
        </div>
      </div>
    </section>
  );
}