"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { GripHorizontal, RefreshCcw, Palette, X, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeSwitch } from "./theme-switch-button";
import { useTheme, type ColorTheme } from "@/lib/theme-context";

// Theme color swatches
const themeSwatches: { id: ColorTheme; label: string; color: string; gradient: string }[] = [
  { id: 'default', label: 'Mono', color: '#ffffff', gradient: 'linear-gradient(135deg, #ffffff, #888888)' },
  { id: 'gold', label: 'Gold', color: '#d4af37', gradient: 'linear-gradient(135deg, #d4af37, #8b6d14)' },
  { id: 'sapphire', label: 'Sapphire', color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
  { id: 'emerald', label: 'Emerald', color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #047857)' },
  { id: 'rose', label: 'Rose', color: '#f43f5e', gradient: 'linear-gradient(135deg, #f43f5e, #be123c)' },
];

// Navigation Component
const navItems = [
  { name: "HOME", href: "/" },
  { name: "EVENTS", href: "/events" },
  { name: "ABOUT", href: "/about" },
  { name: "TEAM", href: "/team" },
  { name: "GALLERY", href: "/gallery" },
];

// Global SVG Filter Component
const GlassFilter: React.FC = () => (
  <svg style={{ display: "none" }}>
    <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
      <feTurbulence type="fractalNoise" baseFrequency="0.001 0.005" numOctaves="1" seed="17" result="turbulence" />
      <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
      <feSpecularLighting in="softMap" surfaceScale="5" specularConstant="1" specularExponent="100" lightingColor="white" result="specLight">
        <fePointLight x="-200" y="-200" z="300" />
      </feSpecularLighting>
      <feDisplacementMap in="SourceGraphic" in2="softMap" scale="100" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>
);

export const LiquidGlassNav = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const { colorTheme, setColorTheme, resetToDefault } = useTheme();
  
  const [showOptions, setShowOptions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowOptions(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  return (
    <>
      <GlassFilter />

      {/* ===== DESKTOP NAV ===== */}
      <div className={`fixed z-50 top-0 left-0 right-0 hidden md:flex flex-col items-center transition-all duration-500 ${isScrolled ? "py-3" : "py-5"}`}>
        <div
          className="flex items-center rounded-[2rem] px-2 py-2 backdrop-blur-xl shadow-lg"
          style={{ background: "var(--nav-bg)", border: "1px solid var(--border)" }}
        >
          <nav className="flex items-center gap-1">
            {/* Logo */}
            <Link href="/" className="flex items-center justify-center mr-1">
              <Image src="/logo.png" alt="Brahmagupta" width={38} height={38} className="rounded-full object-contain" />
            </Link>

            <div className="w-px h-6 mx-1" style={{ background: "var(--border)" }} />

            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative font-medium transition-colors duration-300 rounded-full flex items-center justify-center whitespace-nowrap px-4 py-2.5 text-[0.85rem] tracking-[0.1em] ${
                    isActive
                      ? "text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]"
                  }`}
                >
                  {isActive && <div className="absolute inset-0 rounded-full blur-md -z-10" style={{ background: 'var(--accent-glow)' }} />}
                  {item.name}
                </Link>
              );
            })}

            <div className="w-px h-6 mx-1" style={{ background: "var(--border)" }} />

            <ThemeSwitch className="size-8" />

            <button
              onClick={() => setShowOptions(!showOptions)}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] rounded-full p-2 transition-all duration-300 cursor-pointer"
            >
              <GripHorizontal className="size-5" />
            </button>
          </nav>
        </div>

        {/* Desktop Options Panel */}
        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="mt-3 flex w-[280px] flex-col gap-4 rounded-2xl border p-4 shadow-xl backdrop-blur-xl"
              style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--border)' }}>
                <span className="text-sm font-mono tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>Options</span>
                <button
                  onClick={resetToDefault}
                  className="group flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-xs hover:bg-[var(--bg-surface-hover)] transition-all"
                  style={{ color: 'var(--text-muted)' }}
                >
                  RESET
                  <span className="transition-all duration-300 group-hover:rotate-90"><RefreshCcw className="size-3" /></span>
                </button>
              </div>

              {/* Themes */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                  <Palette className="size-3.5" />
                  <span className="uppercase tracking-wider text-xs">Themes</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  {themeSwatches.map((swatch) => (
                    <button
                      key={swatch.id}
                      onClick={() => setColorTheme(swatch.id)}
                      className="group relative flex flex-col items-center gap-1.5 transition-all duration-200"
                      title={swatch.label}
                    >
                      <div
                        className={`size-7 rounded-full transition-all duration-200 ${
                          colorTheme === swatch.id ? 'ring-2 ring-offset-1 scale-110' : 'hover:scale-105 opacity-70 hover:opacity-100'
                        }`}
                        style={{
                          background: swatch.gradient,
                          boxShadow: colorTheme === swatch.id ? `0 0 0 2px var(--bg-primary), 0 0 0 4px ${swatch.color}, 0 0 12px ${swatch.color}40` : 'none',
                        }}
                      />
                      <span className="text-[9px] uppercase tracking-wider" style={{ color: colorTheme === swatch.id ? 'var(--accent)' : 'var(--text-muted)' }}>
                        {swatch.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===== MOBILE NAV ===== */}
      <div className="fixed z-50 top-0 left-0 right-0 md:hidden">
        <div
          className={`flex items-center justify-between px-4 transition-all duration-300 ${isScrolled ? "py-2" : "py-3"}`}
          style={{ background: "var(--nav-bg)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)" }}
        >
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Brahmagupta" width={32} height={32} className="rounded-full object-contain" />
            <span className="text-xs font-bold tracking-[0.15em] uppercase" style={{ color: "var(--text-primary)" }}>BMC</span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeSwitch className="size-7" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg transition-colors cursor-pointer"
              style={{ color: "var(--text-primary)" }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-[53px] flex flex-col"
              style={{ background: "var(--bg-primary)", zIndex: 49 }}
            >
              <nav className="flex flex-col flex-1 px-6 py-8 gap-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 py-4 text-lg font-mono tracking-[0.2em] uppercase transition-all border-b"
                      style={{
                        color: isActive ? "var(--accent)" : "var(--text-secondary)",
                        borderColor: "var(--border)",
                      }}
                    >
                      {isActive && <div className="w-2 h-2 rounded-full" style={{ background: "var(--accent)" }} />}
                      {item.name}
                    </Link>
                  );
                })}

                {/* Theme swatches in mobile menu */}
                <div className="mt-8 pt-6 border-t" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                      <Palette className="size-4" />
                      <span className="text-xs font-mono uppercase tracking-widest">Theme</span>
                    </div>
                    <button
                      onClick={resetToDefault}
                      className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider cursor-pointer"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Reset <RefreshCcw className="size-3" />
                    </button>
                  </div>
                  <div className="flex items-center justify-around gap-3">
                    {themeSwatches.map((swatch) => (
                      <button
                        key={swatch.id}
                        onClick={() => setColorTheme(swatch.id)}
                        className="flex flex-col items-center gap-2 transition-all"
                        title={swatch.label}
                      >
                        <div
                          className={`size-10 rounded-full transition-all duration-200 ${
                            colorTheme === swatch.id ? 'ring-2 ring-offset-2 scale-110' : 'opacity-60'
                          }`}
                          style={{
                            background: swatch.gradient,
                            boxShadow: colorTheme === swatch.id ? `0 0 0 2px var(--bg-primary), 0 0 0 4px ${swatch.color}` : 'none',
                          }}
                        />
                        <span className="text-[10px] uppercase tracking-wider font-mono" style={{ color: colorTheme === swatch.id ? 'var(--accent)' : 'var(--text-muted)' }}>
                          {swatch.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
