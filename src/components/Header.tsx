"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, Infinity } from '@phosphor-icons/react';
import MobileMenu from './MobileMenu';
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await sanityFetch<any>({
          query: SITE_SETTINGS_QUERY,
        });
        setSettings(data);
      } catch (error) {
        console.error("Error loading header settings:", error);
      }
    };
    fetchSettings();

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Profile', href: '#profile' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Discography', href: '#disco' },
    { name: 'Tour', href: '#tour' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-[60] transition-all duration-500 px-6 md:px-10 ${
          scrolled 
            ? 'py-4 bg-[var(--c-surface)]/80 backdrop-blur-lg border-b border-[var(--c-surface-3)]' 
            : 'py-8 bg-transparent'
        }`}
      >
        <div className="max-w-[1800px] mx-auto flex justify-between items-center">
          <a href="#" className="group relative flex items-center">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings?.title || "Logo"} 
                className="h-8 w-auto md:h-10 object-contain"
              />
            ) : (
              <span className="text-2xl font-bold tracking-tighter uppercase text-[var(--c-ink)]">
                {settings?.title || "BINI"}
              </span>
            )}
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[var(--c-teal)] transition-all duration-300 group-hover:w-full"></span>
          </a>

          <nav className="hidden md:flex items-center gap-10">
            <ul className="flex gap-10">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-label-mono text-[var(--c-ink)] hover:text-[var(--c-teal)] transition-colors relative group"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            <button className="btn-community text-[10px] whitespace-nowrap gap-2">
              <Infinity size={20} weight="bold" />
              COMMUNITY
            </button>
          </nav>

          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-[var(--c-ink)]"
            aria-label="Open Menu"
          >
            <List size={32} weight="light" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu 
            isOpen={isMobileMenuOpen} 
            onClose={() => setIsMobileMenuOpen(false)} 
            navLinks={navLinks} 
            logoUrl={settings?.logoUrl}
            siteTitle={settings?.title}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;