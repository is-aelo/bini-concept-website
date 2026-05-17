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
          className="fixed inset-0 z-[999]"
          style={{
            background: "rgba(12,12,10,.94)",
            backdropFilter: "blur(18px)"
          }}
          onClick={onClose}
        >
          <div className="absolute top-6 left-6 z-50 flex gap-2">
            <button onClick={(e) => { e.stopPropagation(); setZoom(v => Math.max(.8, v - .25)); }}>
              <MagnifyingGlassMinus size={24} color="white" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); setZoom(v => Math.min(3, v + .25)); }}>
              <MagnifyingGlassPlus size={24} color="white" />
            </button>
          </div>

          <button
            className="absolute top-6 right-6 z-50"
            onClick={onClose}
          >
            <X size={28} color="white" />
          </button>

          <motion.div
            initial={{ scale: .92, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: .92, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 110
            }}
            className="w-full h-full flex items-center justify-center p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              animate={{ scale: zoom }}
              transition={{ type: "spring", stiffness: 120 }}
              className="relative w-full max-w-[1500px] h-[85vh]"
            >
              <Image
                src={image}
                alt={alt || "BINICHELLA"}
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}