"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, PanInfo } from "framer-motion";

interface HeroImage {
  _id: string;
  title: string;
  imageUrl: string | null;
}

const SWIPE_THRESHOLD = 80;
const VELOCITY_THRESHOLD = 400;

function getCardDimensions() {
  if (typeof window === "undefined") return { w: 220, h: 320 };
  const vw = window.innerWidth;
  if (vw < 400) return { w: 160, h: 240 };
  if (vw < 640) return { w: 190, h: 280 };
  if (vw < 768) return { w: 220, h: 320 };
  return { w: 260, h: 380 };
}

function getSlotOffsets(w: number) {
  const spread = Math.round(w * 1.24);
  return {
    initial: {
      left:   { x: 0, y: 15, rotate: -6, zIndex: 1 },
      center: { x: 0, y: 0,  rotate: 0,  zIndex: 3 },
      right:  { x: 0, y: 10, rotate: 6,  zIndex: 2 },
    },
    active: {
      left:   { x: -spread, y: 0, rotate: -7, zIndex: 1 },
      center: { x: 0,       y: 0, rotate: 0,  zIndex: 3 },
      right:  { x: spread,  y: 0, rotate: 7,  zIndex: 1 },
    },
  };
}

function ShineLayer() {
  return (
    <div style={{ position: "absolute", inset: 0, borderRadius: "inherit", overflow: "hidden", pointerEvents: "none", zIndex: 10 }}>
      <motion.div
        animate={{ x: ["-160%", "220%"] }}
        transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 5, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: "absolute", top: 0, left: 0, width: "50%", height: "100%",
          background: "linear-gradient(105deg, transparent 15%, rgba(255,255,255,0.15) 40%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.15) 60%, transparent 85%)",
          skewX: "-12deg",
        }}
      />
    </div>
  );
}

function HolographicLayer() {
  return (
    <motion.div
      animate={{ opacity: [0.06, 0.16, 0.06] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      style={{
        position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none", zIndex: 9,
        background: "linear-gradient(135deg, rgba(255,192,220,0.18) 0%, rgba(192,220,255,0.18) 33%, rgba(220,255,192,0.18) 66%, rgba(255,220,192,0.18) 100%)",
      }}
    />
  );
}

function RibbonUnboxing({ onComplete }: { onComplete: () => void }) {
  return (
    <div style={{ position: "absolute", width: "100%", height: "100%", zIndex: 30, pointerEvents: "none", overflow: "hidden", borderRadius: 28 }}>
      <motion.div
        initial="wrapped"
        animate="unboxed"
        onAnimationComplete={onComplete}
        style={{ position: "absolute", inset: 0 }}
      >
        <motion.div
          variants={{
            wrapped: { y: 0, opacity: 1 },
            unboxed: { y: "-100%", opacity: 0, transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99], delay: 1.2 } }
          }}
          style={{
            position: "absolute", left: "calc(50% - 24px)", top: 0, width: 48, height: "100%",
            background: "linear-gradient(90deg, #d4145a 0%, #ff5e62 100%)",
            boxShadow: "0 0 12px rgba(0,0,0,0.3)", zIndex: 32
          }}
        />
        <motion.div
          variants={{
            wrapped: { x: 0, opacity: 1 },
            unboxed: { x: "-100%", opacity: 0, transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99], delay: 1.2 } }
          }}
          style={{
            position: "absolute", top: "calc(50% - 24px)", left: 0, width: "100%", height: 48,
            background: "linear-gradient(180deg, #d4145a 0%, #ff5e62 100%)",
            boxShadow: "0 0 12px rgba(0,0,0,0.3)", zIndex: 31
          }}
        />
        <motion.div
          variants={{
            wrapped: { scale: 0, opacity: 0 },
            unboxed: {
              scale: [0, 1.2, 0],
              opacity: [0, 1, 0],
              rotate: [0, 45, 90],
              transition: { times: [0, 0.4, 1], duration: 1.4, ease: "easeInOut", delay: 0.2 }
            }
          }}
          style={{
            position: "absolute", top: "calc(50% - 40px)", left: "calc(50% - 40px)",
            width: 80, height: 80, zIndex: 33, display: "flex", alignItems: "center", justifyContent: "center"
          }}
        >
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 50 C30 20, 10 30, 35 50 C10 70, 30 80, 50 50 Z" fill="#ff7b90" stroke="#d4145a" strokeWidth="3" />
            <path d="M50 50 C70 20, 90 30, 65 50 C90 70, 70 80, 50 50 Z" fill="#ff7b90" stroke="#d4145a" strokeWidth="3" />
            <circle cx="50" cy="50" r="12" fill="#d4145a" />
            <circle cx="50" cy="50" r="6" fill="#fff" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}

type SlotKey = "left" | "center" | "right";

interface CardSlot {
  id: string;
  slot: SlotKey;
}

export default function HeroCarousel({ images }: { images: HeroImage[] }) {
  const safeImages = useMemo(() => images.filter(i => i.imageUrl).slice(0, 8), [images]);

  const [cardDims, setCardDims] = useState({ w: 220, h: 320 });

  useEffect(() => {
    function update() {
      setCardDims(getCardDimensions());
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const [slots, setSlots] = useState<CardSlot[]>(() => {
    if (safeImages.length === 0) return [];
    return [
      { id: safeImages[0]._id, slot: "center" },
      { id: safeImages[1]?._id ?? safeImages[0]._id, slot: "right" },
      { id: safeImages[safeImages.length - 1]?._id ?? safeImages[0]._id, slot: "left" },
    ];
  });

  const [deck, setDeck] = useState<string[]>(() => safeImages.map(i => i._id));
  const [isUnboxingActive, setIsUnboxingActive] = useState(false);
  const [isInitial, setIsInitial] = useState(true);

  useEffect(() => {
    const hasUnboxed = localStorage.getItem("hero_deck_unboxed");
    if (!hasUnboxed) setIsUnboxingActive(true);
  }, []);

  const handleUnboxingComplete = useCallback(() => {
    localStorage.setItem("hero_deck_unboxed", "true");
    setIsUnboxingActive(false);
  }, []);

  const imageMap = useMemo(
    () => Object.fromEntries(safeImages.map(i => [i._id, i])),
    [safeImages]
  );

  const handleSwiped = useCallback((direction: "left" | "right") => {
    if (isInitial) setIsInitial(false);

    setDeck(prev => {
      const next = [...prev];
      if (direction === "left") {
        const first = next.shift()!;
        next.push(first);
      } else {
        const last = next.pop()!;
        next.unshift(last);
      }
      return next;
    });

    setSlots(prevSlots => {
      return prevSlots.map(s => {
        if (s.slot === "center") return { ...s, slot: direction === "left" ? "left" : "right" };
        if (s.slot === "right")  return { ...s, slot: direction === "left" ? "center" : "left" };
        return { ...s, slot: direction === "left" ? "right" : "center" };
      }) as CardSlot[];
    });
  }, [isInitial]);

  if (safeImages.length === 0) return null;

  const centerSlot = slots.find(s => s.slot === "center");
  const slotOffsets = getSlotOffsets(cardDims.w);

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: cardDims.h + 60,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      touchAction: "pan-y",
      userSelect: "none",
    }}>
      {isUnboxingActive && centerSlot && (
        <div style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 40,
          width: cardDims.w,
          height: cardDims.h,
        }}>
          <RibbonUnboxing onComplete={handleUnboxingComplete} />
        </div>
      )}

      {slots.map(({ id, slot }) => {
        const img = imageMap[id];
        if (!img?.imageUrl) return null;
        const isCenter = slot === "center";
        const slotData = isInitial ? slotOffsets.initial[slot] : slotOffsets.active[slot];

        return (
          <CardItem
            key={id}
            img={img}
            slot={slot}
            slotData={slotData}
            w={cardDims.w}
            h={cardDims.h}
            isCenter={isCenter}
            isLocked={isUnboxingActive}
            onSwiped={handleSwiped}
          />
        );
      })}
    </div>
  );
}

function CardItem({
  img,
  slot,
  slotData,
  w,
  h,
  isCenter,
  isLocked,
  onSwiped,
}: {
  img: HeroImage;
  slot: SlotKey;
  slotData: { x: number; y: number; rotate: number; zIndex: number };
  w: number;
  h: number;
  isCenter: boolean;
  isLocked: boolean;
  onSwiped: (dir: "left" | "right") => void;
}) {
  const dragX = useMotionValue(0);
  const isCommitted = useRef(false);

  useEffect(() => {
    isCommitted.current = false;
    animate(dragX, 0, { duration: 0 });
  }, [slot, dragX]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (isCommitted.current || isLocked || !isCenter) return;
    const committed =
      Math.abs(info.offset.x) > SWIPE_THRESHOLD ||
      Math.abs(info.velocity.x) > VELOCITY_THRESHOLD;

    if (committed) {
      isCommitted.current = true;
      const dir = info.offset.x > 0 ? "right" : "left";
      const flyX = dir === "right" ? 500 : -500;

      animate(dragX, flyX, {
        duration: 0.18,
        ease: "easeOut",
        onComplete: () => onSwiped(dir),
      });
    } else {
      animate(dragX, 0, { type: "tween", duration: 0.18, ease: "easeOut" });
    }
  }

  const borderRadius = Math.round(w * 0.092);

  return (
    <motion.div
      drag={isCenter && !isLocked ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.4}
      onDragEnd={handleDragEnd}
      animate={{
        x: slotData.x,
        y: slotData.y,
        rotate: slotData.rotate,
        scale: 1,
        opacity: 1,
        zIndex: slotData.zIndex,
      }}
      style={{
        position: "absolute",
        width: w,
        height: h,
        x: isCenter ? dragX : undefined,
        cursor: isCenter && !isLocked ? "grab" : "default",
        originX: 0.5,
        originY: 0.5,
      }}
      transition={{
        duration: 0.35,
        ease: [0.25, 1, 0.5, 1],
      }}
      whileDrag={isCenter && !isLocked ? { cursor: "grabbing" } : {}}
    >
      <div style={{
        width: "100%",
        height: "100%",
        borderRadius,
        overflow: "hidden",
        position: "relative",
        boxShadow: isCenter
          ? "0 24px 48px rgba(0,0,0,0.22)"
          : "0 8px 20px rgba(0,0,0,0.15)",
      }}>
        <img
          src={img.imageUrl!}
          alt={img.title}
          style={{
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "50% 15%",
            display: "block", userSelect: "none", pointerEvents: "none",
          }}
          draggable={false}
        />
        {isCenter && <HolographicLayer />}
        {isCenter && <ShineLayer />}
        <div style={{
          position: "absolute", inset: 0, borderRadius,
          background: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 50%, rgba(0,0,0,0.18) 100%)",
          pointerEvents: "none", zIndex: 8,
        }} />
        <div style={{
          position: "absolute", inset: 0, borderRadius,
          border: "1px solid rgba(255,255,255,0.18)",
          pointerEvents: "none", zIndex: 11,
        }} />
      </div>
    </motion.div>
  );
}