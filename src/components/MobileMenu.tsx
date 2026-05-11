// src/components/MobileMenu.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react";

interface MobileMenuProps {
  links: {
    name: string;
    href: string;
  }[];
  logo?: string;
  siteTitle?: string;
}

export default function MobileMenu({
  links,
  logo,
  siteTitle,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* TOGGLE BUTTON */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close Menu" : "Open Menu"}
        className="relative z-[10001] flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-white/50 text-slate-800 backdrop-blur-md transition-all duration-300 hover:bg-white/80"
      >
        <div className="relative h-5 w-5">
          <List
            size={22}
            weight="bold"
            className={`absolute inset-0 transition-all duration-300 ${
              isOpen
                ? "rotate-90 opacity-0 scale-75"
                : "rotate-0 opacity-100 scale-100"
            }`}
          />

          <X
            size={20}
            weight="bold"
            className={`absolute inset-0 transition-all duration-300 ${
              isOpen
                ? "rotate-0 opacity-100 scale-100"
                : "-rotate-90 opacity-0 scale-75"
            }`}
          />
        </div>
      </button>

      {/* OVERLAY */}
      <div
        className={`fixed inset-0 z-[9999] h-screen w-screen overflow-hidden bg-[linear-gradient(135deg,#F8FBFF_0%,#F2F8FF_45%,#FFF5F8_100%)] transition-all duration-500 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {/* BACKGROUND BLOBS */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute right-[-120px] top-[-80px] h-[260px] w-[260px] rounded-full bg-bini-pink/10 blur-3xl" />
          <div className="absolute bottom-[-100px] left-[-80px] h-[220px] w-[220px] rounded-full bg-bini-teal/10 blur-3xl" />
        </div>

        {/* CONTENT */}
        <div className="relative flex h-full flex-col px-5 pt-5 pb-8">
          
          {/* TOP BAR */}
          <div className="flex items-center justify-start">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center"
            >
              {logo ? (
                <img
                  src={logo}
                  alt="Logo"
                  className="h-8 w-auto object-contain"
                />
              ) : (
                <span className="font-heading text-xl font-bold tracking-[-0.04em] text-bini-teal">
                  {siteTitle}
                </span>
              )}
            </Link>
          </div>

          {/* CENTERED NAVIGATION */}
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-md px-1 space-y-3">
              {links.map((link, index) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center rounded-[1.75rem] border border-white/50 bg-white/45 px-6 py-5 backdrop-blur-md transition-all duration-500 hover:bg-white/70 ${
                    isOpen
                      ? "translate-y-0 opacity-100"
                      : "translate-y-5 opacity-0"
                  }`}
                  style={{
                    transitionDelay: `${index * 70}ms`,
                  }}
                >
                  <div className="flex w-full items-center justify-between gap-5">
                    
                    {/* LEFT */}
                    <div className="flex items-center gap-4">
                      <span className="min-w-[24px] font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400">
                        0{index + 1}
                      </span>

                      <span
                        className={`font-heading text-[1.85rem] font-bold uppercase tracking-[-0.05em] transition-transform duration-300 group-hover:translate-x-[2px] ${
                          link.name === "Community"
                            ? "text-bini-teal"
                            : "text-slate-900"
                        }`}
                      >
                        {link.name}
                      </span>
                    </div>

                    {/* ARROW */}
                    <span className="text-lg text-slate-300 transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* FOOTER */}
          <div className="border-t border-white/40 pt-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-400">
              BINI Nation Archive
            </p>

            <p className="mt-2 max-w-[240px] text-sm leading-relaxed text-slate-500">
              Soft tropical minimalism inspired by modern Filipino pop culture.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}