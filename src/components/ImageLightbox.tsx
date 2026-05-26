"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlassMinus, MagnifyingGlassPlus, X } from "@phosphor-icons/react";

interface ImageLightboxProps {
  open: boolean;
  image: string;
  alt?: string;
  onClose: () => void;
}

export default function ImageLightbox({
  open,
  image,
  alt,
  onClose,
}: ImageLightboxProps) {
  const [zoomState, setZoomState] = useState({ image, value: 1 });
  const pinchStartDistance = useRef<number | null>(null);
  const pinchStartZoom = useRef(1);

  const clampZoom = (value: number) => Math.min(3, Math.max(.8, value));
  const zoom = open && zoomState.image === image ? zoomState.value : 1;
  const updateZoom = (getNextZoom: (currentZoom: number) => number) => {
    setZoomState((current) => ({
      image,
      value: clampZoom(getNextZoom(current.image === image ? current.value : 1)),
    }));
  };

  const getTouchDistance = (touches: React.TouchList) => {
    const [first, second] = [touches[0], touches[1]];
    return Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
  };

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", esc);

    return () =>
      window.removeEventListener("keydown", esc);
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const preventNativeZoom = (e: Event) => e.preventDefault();

    document.addEventListener("gesturestart", preventNativeZoom, { passive: false });
    document.addEventListener("gesturechange", preventNativeZoom, { passive: false });

    return () => {
      document.removeEventListener("gesturestart", preventNativeZoom);
      document.removeEventListener("gesturechange", preventNativeZoom);
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
    if (e.touches.length !== 2 || !pinchStartDistance.current) return;

    e.preventDefault();
    e.stopPropagation();
    const nextDistance = getTouchDistance(e.touches);
    updateZoom(() => pinchStartZoom.current * (nextDistance / pinchStartDistance.current));
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length >= 2) return;

    pinchStartDistance.current = null;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: .35 }}
          className="fixed inset-0 z-[999] flex flex-col justify-between"
          style={{
            background: "rgba(12,12,10,.94)",
            backdropFilter: "blur(18px)",
            touchAction: "none",
          }}
          onClick={onClose}
        >
          <div 
            className="sticky top-0 left-0 right-0 z-50 flex items-center justify-between p-4 md:p-6 pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-4 pointer-events-auto bg-black/20 backdrop-blur-md p-2 rounded-xl border border-white/5">
              <button 
                onClick={() => updateZoom((v) => v - .25)}
                className="p-1 opacity-70 hover:opacity-100 transition-opacity dynamic-icon-button"
                aria-label="Zoom out"
              >
                <MagnifyingGlassMinus size={24} color="white" />
              </button>
              <button 
                onClick={() => updateZoom((v) => v + .25)}
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
            className="w-full flex-1 overflow-auto flex items-center justify-center p-4 md:p-12 min-h-0"
            onClick={onClose}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            style={{ touchAction: "none" }}
          >
            <motion.div
              initial={{ scale: .92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: .92, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 20
              }}
              className="w-full max-w-[1500px] h-full flex items-center justify-center pointer-events-none"
            >
              <motion.div
                animate={{ scale: zoom }}
                transition={{ type: "spring", stiffness: 150, damping: 25 }}
                className="relative w-full h-full max-h-[75vh] md:max-h-[80vh] pointer-events-auto origin-center"
                style={{ touchAction: "none" }}
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={image}
                  alt={alt || "BINICHELLA"}
                  fill
                  className="object-contain select-none"
                  draggable={false}
                  sizes="(max-width: 768px) 100vw, 1500px"
                  priority
                />
              </motion.div>
            </motion.div>
          </div>
          
          <div className="h-4 md:h-6 pointer-events-none w-full" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
