"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { GripHorizontal, RefreshCcw, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeSwitch } from "./theme-switch-button";
import { useTheme, type ColorTheme } from "@/lib/theme-context";

// Types
interface GlassEffectProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// Global SVG Filter Component
const GlassFilter: React.FC = () => (
  <svg style={{ display: "none" }}>
    <filter
      id="glass-distortion"
      x="0%"
      y="0%"
      width="100%"
      height="100%"
      filterUnits="objectBoundingBox"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.001 0.005"
        numOctaves="1"
        seed="17"
        result="turbulence"
      />
      <feComponentTransfer in="turbulence" result="mapped">
        <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
        <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
        <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
      </feComponentTransfer>
      <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
      <feSpecularLighting
        in="softMap"
        surfaceScale="5"
        specularConstant="1"
        specularExponent="100"
        lightingColor="white"
        result="specLight"
      >
        <fePointLight x="-200" y="-200" z="300" />
      </feSpecularLighting>
      <feComposite
        in="specLight"
        operator="arithmetic"
        k1="0"
        k2="1"
        k3="1"
        k4="0"
        result="litImage"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="softMap"
        scale="100"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </svg>
);

// Glass Effect Wrapper Component
const GlassEffect: React.FC<GlassEffectProps> = ({
  children,
  className = "",
  style = {},
}) => {
  const glassStyle = {
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 255, 255, 0.05)",
    transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
    background: "var(--nav-bg)",
    ...style,
  };

  return (
    <div
      className={`relative flex items-center justify-center font-semibold overflow-hidden transition-all duration-700 ${className}`}
      style={glassStyle}
    >
      <div
        className="absolute inset-0 z-0 overflow-hidden rounded-inherit"
        style={{
          backdropFilter: "blur(6px)",
          filter: "url(#glass-distortion)",
          isolation: "isolate",
        }}
      />
      <div
        className="absolute inset-0 z-10 rounded-inherit"
        style={{ background: "var(--bg-surface)" }}
      />
      <div
        className="absolute inset-0 z-20 rounded-inherit overflow-hidden"
        style={{
          boxShadow:
            "inset 1px 1px 2px 0 rgba(255, 255, 255, 0.15), inset -1px -1px 2px 0 rgba(0, 0, 0, 0.5)",
        }}
      />
      <div className="relative z-30 flex items-center">{children}</div>
    </div>
  );
};

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

export const LiquidGlassNav = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const { colorTheme, setColorTheme, appearance, toggleAppearance } = useTheme();
  
  // Customizability States powered by the Options Menu
  const [showOptions, setShowOptions] = useState(false);
  const [navScale, setNavScale] = useState(0); 
  const [navGap, setNavGap] = useState(0);
  const [navFlexMode, setNavFlexMode] = useState<"row" | "column">("row");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // When column mode → nav moves to the left side
  const isColumn = navFlexMode === "column";

  return (
    <>
      <GlassFilter />
      <div 
        className={`fixed z-50 transition-all duration-500 ${
          isColumn 
            ? "top-0 left-0 bottom-0 flex flex-col items-start py-6 pl-4" 
            : `top-0 left-0 right-0 flex flex-col items-center ${isScrolled ? "py-4" : "py-6"}`
        }`}
      >
        <GlassEffect className={`${isColumn ? "rounded-2xl px-3 py-4" : "rounded-[2rem] px-2 py-2"}`}>
          {/* Framer Motion powers the layout morphing! */}
          <motion.nav 
            className={`flex items-center ${isColumn ? "flex-col" : ""}`}
            animate={{
              gap: navGap ? `${navGap}px` : "4px",
            }}
            transition={{ duration: 0.35 }}
          >
            {/* Logo at the start of the nav */}
            <motion.div layout className={`flex items-center justify-center ${isColumn ? "mb-2" : "mr-1"}`}>
              <Link href="/" className="flex items-center justify-center">
                <Image 
                  src="/logo.png" 
                  alt="Brahmagupta Mathematics Club" 
                  width={40} 
                  height={40} 
                  className="rounded-full object-contain transition-all duration-300"
                  style={{ width: `${40 + (navScale * 0.4)}px`, height: `${40 + (navScale * 0.4)}px` }}
                />
              </Link>
            </motion.div>

            {/* Separator after logo */}
            <motion.div layout 
              className={`bg-[var(--border)] transition-all ${isColumn ? "h-px w-16 my-1" : "w-px h-6 mx-1"}`} 
            />

            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
              <motion.div layout key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    relative font-medium transition-colors duration-300 rounded-full flex items-center justify-center whitespace-nowrap
                    ${isActive 
                      ? "text-[var(--text-primary)]" 
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]"
                    }
                  `}
                  style={{
                    fontSize: `${0.85 + (navScale * 0.005)}rem`,
                    padding: `${0.6 + (navScale * 0.01)}rem ${1.0 + (navScale * 0.015)}rem`,
                    letterSpacing: '0.1em'
                  }}
                >
                  {/* Active Indicator Glow */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-full blur-md -z-10" style={{ background: 'var(--accent-glow)' }} />
                  )}
                  {item.name}
                </Link>
              </motion.div>
            )})}
            
            {/* Separator */}
            <motion.div layout 
              className={`bg-[var(--border)] transition-all ${isColumn ? "h-px w-16 my-1" : "w-px h-6 mx-1"}`} 
            />
            
            <motion.div layout className={`flex items-center gap-2 ${isColumn ? "flex-col" : ""}`}>
              {/* Dark/Light mode switch (Sun/Moon) */}
              <div style={{ transform: `scale(${1 + (navScale * 0.01)})`, transformOrigin: 'center' }}>
                <ThemeSwitch className="size-8" />
              </div>

              {/* The "6 Dots" Toggle Button for Options */}
              <button 
                onClick={() => setShowOptions(!showOptions)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] rounded-full p-2 transition-all duration-300 active:scale-95 flex items-center justify-center"
                style={{ transform: `scale(${1 + (navScale * 0.01)})`, transformOrigin: 'center' }}
              >
                <GripHorizontal className="size-5" />
              </button>
            </motion.div>
          </motion.nav>
        </GlassEffect>

        {/* The Options Panel Dropdown */}
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

                <p>
                  <button
                    onClick={() => {
                      setNavScale(0);
                      setNavGap(0);
                      setNavFlexMode("row");
                      setColorTheme('default');
                      if (appearance !== 'dark') toggleAppearance();
                    }}
                    className="group flex cursor-pointer items-center justify-center gap-2 rounded-lg px-2 py-1 text-xs hover:bg-[var(--bg-surface-hover)] transition-all w-full text-right"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    RESET
                    <span className="cursor-pointer transition-all duration-300 group-hover:rotate-90">
                      <RefreshCcw className="size-3" />
                    </span>
                  </button>
                </p>
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
                        className={`group relative flex flex-col items-center gap-1.5 transition-all duration-200`}
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
    </>
  );
};
