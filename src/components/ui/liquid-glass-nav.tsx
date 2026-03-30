"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { GripHorizontal, RefreshCcw, Palette, X, Menu } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
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

// Navigation links
const navItems = [
  { name: "HOME", href: "/" },
  { name: "EVENTS", href: "/events" },
  { name: "ABOUT", href: "/about" },
  { name: "TEAM", href: "/team" },
  { name: "GALLERY", href: "/gallery" },
];

// Original Glass effect wrapper
const GlassEffect = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`flex items-center rounded-[2rem] backdrop-blur-xl shadow-lg ${className}`}
    style={{ background: "var(--nav-bg)", border: "1px solid var(--border)" }}
  >
    {children}
  </div>
);

// SVG filter
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
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const { colorTheme, setColorTheme, appearance, toggleAppearance, resetToDefault } = useTheme();

  // Nav customization (Scale, Gap, Layout)
  const [navScale, setNavScale] = useState(0);
  const [navGap, setNavGap] = useState(0);
  const [navFlexMode, setNavFlexMode] = useState<"row" | "column">("row");

  const [showOptions, setShowOptions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isColumn = navFlexMode === "column";

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
        <GlassEffect className="px-2 py-2">
          <LayoutGroup>
            <motion.nav
              layout
              className={`flex items-center ${isColumn ? "flex-col" : ""}`}
              style={{ gap: `${4 + navGap * 0.2}px` }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              {/* Logo */}
              <motion.div layout>
                <Link href="/" className="flex items-center justify-center" style={{ transform: `scale(${1 + (navScale * 0.01)})`, transformOrigin: 'center' }}>
                  <Image src="/logo.png" alt="Brahmagupta" width={38} height={38} className="rounded-full object-contain" />
                </Link>
              </motion.div>

              {/* Separator */}
              <motion.div layout
                className={`bg-[var(--border)] transition-all ${isColumn ? "h-px w-16 my-1" : "w-px h-6 mx-1"}`}
              />

              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div key={item.href} layout style={{ transform: `scale(${1 + (navScale * 0.01)})`, transformOrigin: 'center' }}>
                    <Link
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
                  </motion.div>
                );
              })}

              {/* Separator */}
              <motion.div layout
                className={`bg-[var(--border)] transition-all ${isColumn ? "h-px w-16 my-1" : "w-px h-6 mx-1"}`}
              />

              <motion.div layout className={`flex items-center gap-2 ${isColumn ? "flex-col" : ""}`}>
                {/* Dark/Light mode switch */}
                <div style={{ transform: `scale(${1 + (navScale * 0.01)})`, transformOrigin: 'center' }}>
                  <ThemeSwitch className="size-8" />
                </div>

                {/* The "6 Dots" Toggle Button for Options */}
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] rounded-full p-2 transition-all duration-300 active:scale-95 flex items-center justify-center cursor-pointer"
                  style={{ transform: `scale(${1 + (navScale * 0.01)})`, transformOrigin: 'center' }}
                >
                  <GripHorizontal className="size-5" />
                </button>
              </motion.div>
            </motion.nav>
          </LayoutGroup>
        </GlassEffect>

        {/* Desktop Options Panel — Restored with Scale, Gap, Layout + Themes */}
        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className={`mt-4 flex w-[280px] flex-col gap-4 rounded-3xl border p-4 shadow-xl backdrop-blur-xl relative ${
                isColumn ? "ml-4" : ""
              }`}
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                  <span className="size-4 opacity-50"><GripHorizontal className="size-4" /></span>
                  <span className="text-sm font-mono tracking-widest uppercase">Options</span>
                </div>
                <button
                  onClick={() => {
                    setNavScale(0);
                    setNavGap(0);
                    setNavFlexMode("row");
                    resetToDefault();
                  }}
                  className="group flex cursor-pointer items-center justify-center gap-2 rounded-lg px-2 py-1 text-xs hover:bg-[var(--bg-surface-hover)] transition-all w-full text-right"
                  style={{ color: 'var(--text-muted)' }}
                >
                  RESET
                  <span className="cursor-pointer transition-all duration-300 group-hover:rotate-90">
                    <RefreshCcw className="size-3" />
                  </span>
                </button>
              </div>

              <div className="flex flex-col gap-3 font-mono text-xs">
                {/* Scale Slider */}
                <div className="flex items-center justify-between">
                  <p className="uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Scale</p>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={navScale}
                    onChange={(e) => setNavScale(Number(e.target.value))}
                    className="h-1.5 w-[140px] appearance-none rounded-lg bg-[var(--bg-surface)] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:bg-[var(--accent)] [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
                  />
                </div>
                {/* Gap Slider */}
                <div className="flex items-center justify-between">
                  <p className="uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Gap</p>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={navGap}
                    onChange={(e) => setNavGap(Number(e.target.value))}
                    className="h-1.5 w-[140px] appearance-none rounded-lg bg-[var(--bg-surface)] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:bg-[var(--accent)] [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
                  />
                </div>

                {/* Flex Toggle */}
                <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: 'var(--border)' }}>
                  <p className="uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Layout</p>
                  <div className="flex items-center gap-3">
                    <button
                      className={`cursor-pointer transition-all text-xs ${navFlexMode === "column" ? "scale-110" : "hover:opacity-100"}`}
                      style={{ color: navFlexMode === "column" ? 'var(--accent)' : 'var(--text-muted)' }}
                      onClick={() => setNavFlexMode("column")}
                    >
                      COLUMN
                    </button>
                    <button
                      className={`cursor-pointer transition-all text-xs ${navFlexMode === "row" ? "scale-110" : "hover:opacity-100"}`}
                      style={{ color: navFlexMode === "row" ? 'var(--accent)' : 'var(--text-muted)' }}
                      onClick={() => setNavFlexMode("row")}
                    >
                      ROW
                    </button>
                  </div>
                </div>

                {/* Themes Section */}
                <div className="flex flex-col gap-3 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <Palette className="size-3.5" />
                    <p className="uppercase tracking-wider">Themes</p>
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
                            colorTheme === swatch.id
                              ? 'ring-2 ring-offset-1 scale-110'
                              : 'hover:scale-105 opacity-70 hover:opacity-100'
                          }`}
                          style={{
                            background: swatch.gradient,
                            boxShadow: colorTheme === swatch.id
                              ? `0 0 0 2px var(--bg-primary), 0 0 0 4px ${swatch.color}, 0 0 12px ${swatch.color}40`
                              : 'none',
                          }}
                        />
                        <span
                          className="text-[9px] uppercase tracking-wider"
                          style={{ color: colorTheme === swatch.id ? 'var(--accent)' : 'var(--text-muted)' }}
                        >
                          {swatch.label}
                        </span>
                      </button>
                    ))}
                  </div>
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
