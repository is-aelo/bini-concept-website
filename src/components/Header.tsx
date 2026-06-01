"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { List } from '@phosphor-icons/react';
import { Icon } from '@iconify/react';
import MobileMenu from './MobileMenu';
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

interface SiteSettings {
  logoUrl?: string;
  title?: string;
}

const headerLogoSrc = "/BINI-logo.png";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [conceptVisible, setConceptVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await sanityFetch<SiteSettings>({
          query: SITE_SETTINGS_QUERY,
        });
        setSettings(data);
      } catch (error) {
        console.error("Error loading header settings:", error);
      }
    };
    fetchSettings();

    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) {
        return;
      }

      rafId = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50);
        rafId = null;
      });
    };

    const conceptSection = document.getElementById("concept-section");
    const observer = conceptSection
      ? new IntersectionObserver(([entry]) => {
          setConceptVisible(entry.isIntersecting);
        })
      : null;

    window.addEventListener('scroll', handleScroll);
    if (conceptSection && observer) {
      observer.observe(conceptSection);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer?.disconnect();

      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 768px)');
    const handleDesktopResize = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMobileMenuOpen(false);
      }
    };

    desktopQuery.addEventListener('change', handleDesktopResize);
    return () => desktopQuery.removeEventListener('change', handleDesktopResize);
  }, []);

  const navLinks = [
    { name: 'Profile', href: '#profile' },
    { name: 'Discography', href: '#disco' },
    { name: 'Tour', href: '#tour' },
    { name: 'Gallery', href: '#gallery' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-[60] transition-all duration-500 px-6 md:px-10 ${
          !conceptVisible
            ? scrolled 
              ? 'py-4 bg-[var(--c-surface)]/80 backdrop-blur-lg border-b border-[var(--c-surface-3)] opacity-100 translate-y-0'
              : 'py-8 bg-transparent opacity-100 translate-y-0'
            : 'py-8 bg-transparent opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="max-w-[1800px] mx-auto flex justify-between items-center">
          <a href="#" className="group relative flex items-center">
            <Image
              src={headerLogoSrc}
              alt={settings?.title || "BINI"}
              width={180}
              height={40}
              className="h-8 w-auto md:h-10 object-contain"
              priority
            />
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
            <a
              href="https://shop.weverse.io/en/shop/USD/artists/285/sales/55705"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-community text-[10px] whitespace-nowrap gap-2 inline-flex items-center"
            >
              <Icon icon="mingcute:diamond-2-line" width="20" height="20" />
              EXCLUSIVE ACCESS
            </a>
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
            logoUrl={headerLogoSrc}
            siteTitle={settings?.title}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
