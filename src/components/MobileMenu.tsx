"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { X, ArrowUpRight } from '@phosphor-icons/react';
import { Icon } from '@iconify/react';

interface MobileMenuProps {
  onClose: () => void;
  navLinks: { name: string; href: string }[];
  activeSection?: string;
  logoUrl?: string;
  siteTitle?: string;
}

const MobileMenu = ({
  onClose,
  navLinks = [],
  activeSection = "",
  logoUrl,
  siteTitle,
}: MobileMenuProps) => {
  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%', transition: { duration: 0.15, ease: 'easeInOut' } }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] bg-[var(--c-surface)] flex flex-col p-10"
    >
      <div className="flex justify-between items-center mb-20">
        <div className="flex items-center">
          {logoUrl ? (
            <div className="relative h-8 w-[120px]">
              <Image
                src={logoUrl}
                alt={siteTitle || "Logo"}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <span className="text-xl font-bold tracking-tighter uppercase">{siteTitle || "BINI"}</span>
          )}
        </div>
        <button 
          onClick={onClose}
          className="w-12 h-12 flex items-center justify-center border border-[var(--c-surface-3)] rounded-full text-[var(--c-ink)]"
        >
          <X size={24} weight="light" />
        </button>
      </div>

      <nav className="flex flex-col gap-6">
        {navLinks.map((link, idx) => {
          const sectionId = link.href.replace("#", "");
          const isActive = activeSection === sectionId;

          return (
          <motion.a
            key={link.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + idx * 0.1 }}
            href={link.href}
            onClick={onClose}
            aria-current={isActive ? "page" : undefined}
            className={`text-5xl font-display uppercase tracking-tighter flex items-center justify-between group transition-colors ${
              isActive
                ? "text-[var(--c-teal)]"
                : "text-[var(--c-ink)] hover:text-[var(--c-teal)]"
            }`}
            >
            <span className="relative inline-flex items-center">
              {link.name}
              {isActive && (
                <span className="absolute -bottom-1 left-0 h-[2px] w-full bg-[var(--c-teal)]" />
              )}
            </span>
            <ArrowUpRight
              size={32}
              weight="light"
              className={`transition-opacity ${
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
            />
          </motion.a>
          );
        })}
      </nav>

      <div className="mt-auto pt-10 border-t border-[var(--c-surface-3)]">
        <a
          href="https://shop.weverse.io/en/shop/USD/artists/285/sales/55705"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-community w-full justify-center py-5 text-sm gap-3 inline-flex items-center"
        >
          <Icon icon="mingcute:diamond-2-line" width="24" height="24" />
          EXCLUSIVE ACCESS
        </a>
        <div className="mt-10 flex flex-col text-label-mono opacity-50 gap-1">
          <span>WEBSITE CONCEPT BY ELOISA JANE TALINGTING</span>
          <span>© 2026</span>
        </div>
      </div>
    </motion.div>
  );
};

export default MobileMenu;
