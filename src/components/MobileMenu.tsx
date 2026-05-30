"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { X, Infinity, ArrowUpRight } from '@phosphor-icons/react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: { name: string; href: string }[];
  logoUrl?: string;
  siteTitle?: string;
}

const MobileMenu = ({ isOpen, onClose, navLinks = [], logoUrl, siteTitle }: MobileMenuProps) => {
  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] bg-[var(--c-surface)] flex flex-col p-10"
    >
      <div className="flex justify-between items-center mb-20">
        <div className="flex items-center">
          {logoUrl ? (
            <img src={logoUrl} alt={siteTitle || "Logo"} className="h-8 w-auto object-contain" />
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
        {navLinks.map((link, idx) => (
          <motion.a
            key={link.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + idx * 0.1 }}
            href={link.href}
            onClick={onClose}
            className="text-5xl font-display uppercase tracking-tighter flex items-center justify-between group hover:text-[var(--c-teal)] transition-colors"
          >
            {link.name}
            <ArrowUpRight size={32} weight="light" className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.a>
        ))}
      </nav>

      <div className="mt-auto pt-10 border-t border-[var(--c-surface-3)]">
        <a
          href="https://shop.weverse.io/en/shop/USD/artists/285/sales/55705"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-community w-full justify-center py-5 text-sm gap-3 inline-flex items-center"
        >
          <Infinity size={24} weight="bold" />
          JOIN COMMUNITY
        </a>
        <div className="mt-10 flex justify-between text-label-mono opacity-50">
          <span>BINI CORE CONCEPT</span>
          <span>© 2026</span>
        </div>
      </div>
    </motion.div>
  );
};

export default MobileMenu;