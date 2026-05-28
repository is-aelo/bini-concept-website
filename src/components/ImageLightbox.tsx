"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  CaretLeft,
  CaretRight,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
  X,
} from "@phosphor-icons/react";

export type LightboxImage = {
  src: string;
  alt?: string;
};

type ImageLightboxProps = {
  open: boolean;
  image?: string;
  alt?: string;
  images?: LightboxImage[];
  index?: number;
  onIndexChange?: (index: number) => void;
  onClose: () => void;
};

export default function ImageLightbox({
  open,
  image,
  alt,
  images,
  index = 0,
  onIndexChange,
  onClose,
}: ImageLightboxProps) {
  const activeImages = useMemo(
    () =>
      images?.length
        ? images
        : image
        ? [{ src: image, alt }]
        : [],
    [alt, image, images]
  );
  const activeIndex = activeImages.length
    ? Math.min(Math.max(index, 0), activeImages.length - 1)
    : 0;
  const activeImage = activeImages[activeIndex];
  const activeSrc = activeImage?.src || "";
  const activeAlt = activeImage?.alt || alt || "BINI";
  const canNavigate = activeImages.length > 1;

  const [zoomState, setZoomState] = useState({ image: activeSrc, value: 1 });
  const pinchStartDistance = useRef<number | null>(null);
  const pinchStartZoom = useRef(1);

  const clampZoom = (value: number) => Math.min(3, Math.max(0.8, value));
  const zoom = open && zoomState.image === activeSrc ? zoomState.value : 1;

  const updateZoom = (getNextZoom: (currentZoom: number) => number) => {
    setZoomState((current) => ({
      image: activeSrc,
      value: clampZoom(getNextZoom(current.image === activeSrc ? current.value : 1)),
    }));
  };

  const goTo = useCallback((nextIndex: number) => {
    if (!canNavigate) return;
    onIndexChange?.((nextIndex + activeImages.length) % activeImages.length);
  }, [activeImages.length, canNavigate, onIndexChange]);

  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  const getTouchDistance = (touches: React.TouchList) => {
    const [first, second] = [touches[0], touches[1]];
    return Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, onClose, open, prev]);

  useEffect(() => {
    if (!open) return;

    const preventNativeZoom = (e: Event) => e.preventDefault();
    const preventMultiTouchZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    const preventTrackpadZoom = (e: WheelEvent) => {
      if (e.ctrlKey) e.preventDefault();
    };

    document.addEventListener("gesturestart", preventNativeZoom, { passive: false });
    document.addEventListener("gesturechange", preventNativeZoom, { passive: false });
    document.addEventListener("touchmove", preventMultiTouchZoom, { passive: false });
    document.addEventListener("wheel", preventTrackpadZoom, { passive: false });

    return () => {
      document.removeEventListener("gesturestart", preventNativeZoom);
      document.removeEventListener("gesturechange", preventNativeZoom);
      document.removeEventListener("touchmove", preventMultiTouchZoom);
      document.removeEventListener("wheel", preventTrackpadZoom);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 2) return;

    e.preventDefault();
    e.stopPropagation();
    pinchStartDistance.current = getTouchDistance(e.touches);
    pinchStartZoom.current = zoom;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const startDistance = pinchStartDistance.current;
    if (e.touches.length !== 2 || startDistance === null) return;

    e.preventDefault();
    e.stopPropagation();
    const nextDistance = getTouchDistance(e.touches);
    updateZoom(() => pinchStartZoom.current * (nextDistance / startDistance));
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length >= 2) return;
    pinchStartDistance.current = null;
  };

  if (!activeSrc) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[999] flex flex-col justify-between"
          style={{
            background: "rgba(12,12,10,.94)",
            backdropFilter: "blur(18px)",
            touchAction: "none",
            overscrollBehavior: "contain",
          }}
          onClick={onClose}
          onTouchStartCapture={(e) => {
            if (e.touches.length > 1) e.preventDefault();
          }}
          onTouchMoveCapture={(e) => {
            if (e.touches.length > 1) e.preventDefault();
          }}
        >
          <div
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 md:p-6 pointer-events-none"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            style={{ touchAction: "none" }}
          >
            <div className="flex gap-4 pointer-events-auto bg-black/20 backdrop-blur-md p-2 rounded-xl border border-white/5">
              <button
                onClick={() => updateZoom((v) => v - 0.25)}
                className="p-1 opacity-70 hover:opacity-100 transition-opacity dynamic-icon-button"
                aria-label="Zoom out"
              >
                <MagnifyingGlassMinus size={24} color="white" />
              </button>
              <button
                onClick={() => updateZoom((v) => v + 0.25)}
                className="p-1 opacity-70 hover:opacity-100 transition-opacity dynamic-icon-button"
                aria-label="Zoom in"
              >
                <MagnifyingGlassPlus size={24} color="white" />
              </button>
            </div>

            <button
              className="pointer-events-auto p-1 opacity-70 hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-md rounded-xl border border-white/5"
              onClick={onClose}
              aria-label="Close lightbox"
            >
              <X size={28} color="white" />
            </button>
          </div>

          <div
            className="relative w-full flex-1 overflow-hidden flex items-center justify-center p-4 md:p-12 min-h-0"
            onClick={onClose}
            style={{ touchAction: "none" }}
          >
            <motion.div
              key={activeSrc}
              initial={{ scale: 0.92, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 20,
              }}
              className="w-full max-w-[1500px] h-full flex items-center justify-center pointer-events-none"
            >
              <motion.div
                animate={{ scale: zoom }}
                transition={{ type: "spring", stiffness: 150, damping: 25 }}
                className="relative w-full h-full max-h-[75vh] md:max-h-[80vh] pointer-events-auto origin-center"
                style={{ touchAction: "none" }}
                onClick={(e) => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
              >
                <Image
                  src={activeSrc}
                  alt={activeAlt}
                  fill
                  className="object-contain select-none"
                  draggable={false}
                  sizes="(max-width: 768px) 100vw, 1500px"
                  priority
                />
              </motion.div>
            </motion.div>

            {canNavigate && (
              <>
                <button
                  className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 h-11 w-11 md:h-12 md:w-12 rounded-full bg-black/25 border border-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-75 hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  aria-label="Previous image"
                >
                  <CaretLeft size={22} weight="bold" />
                </button>

                <button
                  className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 h-11 w-11 md:h-12 md:w-12 rounded-full bg-black/25 border border-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-75 hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  aria-label="Next image"
                >
                  <CaretRight size={22} weight="bold" />
                </button>
              </>
            )}
          </div>

          <div className="h-4 md:h-6 pointer-events-none w-full" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
