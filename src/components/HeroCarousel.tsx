"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion, useMotionValue, animate, PanInfo } from "framer-motion";

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

type SlotKey = "left" | "center" | "right";

interface CardSlot {
  id: string;
  slot: SlotKey;
}

export default function HeroCarousel({ images }: { images: HeroImage[] }) {
  const safeImages = useMemo(() => images.filter(i => i.imageUrl).slice(0, 8), [images]);

  const [cardDims, setCardDims] = useState(() => getCardDimensions());
  const resizeFrame = useRef<number | null>(null);

  useEffect(() => {
    function update() {
      const next = getCardDimensions();
      setCardDims((prev) => (prev.w === next.w && prev.h === next.h ? prev : next));
    }

    const scheduleUpdate = () => {
      if (resizeFrame.current !== null) return;
      resizeFrame.current = window.requestAnimationFrame(() => {
        resizeFrame.current = null;
        update();
      });
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", scheduleUpdate);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", scheduleUpdate);
      if (resizeFrame.current !== null) {
        window.cancelAnimationFrame(resizeFrame.current);
      }
    };
  }, []);

  const [slots, setSlots] = useState<CardSlot[]>(() => {
    if (safeImages.length === 0) return [];
    return [
      { id: safeImages[0]._id, slot: "center" },
      { id: safeImages[1]?._id ?? safeImages[0]._id, slot: "right" },
      { id: safeImages[safeImages.length - 1]?._id ?? safeImages[0]._id, slot: "left" },
    ];
  });

  const [isInitial, setIsInitial] = useState(true);

  const imageMap = useMemo(
    () => Object.fromEntries(safeImages.map(i => [i._id, i])),
    [safeImages]
  );

  const handleSwiped = useCallback((direction: "left" | "right") => {
    if (isInitial) setIsInitial(false);

    setSlots(prevSlots => {
      return prevSlots.map(s => {
        if (s.slot === "center") return { ...s, slot: direction === "left" ? "left" : "right" };
        if (s.slot === "right")  return { ...s, slot: direction === "left" ? "center" : "left" };
        return { ...s, slot: direction === "left" ? "right" : "center" };
      }) as CardSlot[];
    });
  }, [isInitial]);

  if (safeImages.length === 0) return null;

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
  onSwiped,
}: {
  img: HeroImage;
  slot: SlotKey;
  slotData: { x: number; y: number; rotate: number; zIndex: number };
  w: number;
  h: number;
  isCenter: boolean;
  onSwiped: (dir: "left" | "right") => void;
}) {
  const dragX = useMotionValue(0);
  const isCommitted = useRef(false);

  useEffect(() => {
    isCommitted.current = false;
    animate(dragX, 0, { duration: 0 });
  }, [slot, dragX]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (isCommitted.current || !isCenter) return;
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
      drag={isCenter ? "x" : false}
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
        cursor: isCenter ? "grab" : "default",
        originX: 0.5,
        originY: 0.5,
      }}
      transition={{
        duration: 0.35,
        ease: [0.25, 1, 0.5, 1],
      }}
      whileDrag={isCenter ? { cursor: "grabbing" } : {}}
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
