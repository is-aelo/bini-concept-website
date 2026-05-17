"use client";

import { useState, useEffect } from "react";
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
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!open) setZoom(1);
  }, [open]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", esc);

    return () =>
      window.removeEventListener("keydown", esc);
  }, [onClose]);

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
            backdropFilter: "blur(18px)"
          }}
          onClick={onClose}
        >
          <div 
            className="sticky top-0 left-0 right-0 z-50 flex items-center justify-between p-4 md:p-6 pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-4 pointer-events-auto bg-black/20 backdrop-blur-md p-2 rounded-xl border border-white/5 md:bg-transparent md:backdrop-blur-none md:p-0 md:border-none">
              <button 
                onClick={() => setZoom(v => Math.max(.8, v - .25))}
                className="p-1 opacity-70 hover:opacity-100 transition-opacity dynamic-icon-button"
                aria-label="Zoom out"
              >
                <MagnifyingGlassMinus size={24} color="white" />
              </button>
              <button 
                onClick={() => setZoom(v => Math.min(3, v + .25))}
                className="p-1 opacity-70 hover:opacity-100 transition-opacity dynamic-icon-button"
                aria-label="Zoom in"
              >
                <MagnifyingGlassPlus size={24} color="white" />
              </button>
            </div>

            <button
              className="pointer-events-auto p-1 opacity-70 hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-md rounded-xl border border-white/5 md:bg-transparent md:backdrop-blur-none md:p-0 md:border-none"
              onClick={onClose}
              aria-label="Close lightbox"
            >
              <X size={28} color="white" />
            </button>
          </div>

          <div 
            className="w-full flex-1 overflow-auto flex items-center justify-center p-4 md:p-12 min-h-0"
            onClick={onClose}
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