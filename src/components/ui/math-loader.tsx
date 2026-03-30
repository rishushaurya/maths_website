"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EQUATIONS = [
  "∫₀^∞ e^(-x²) dx = √π/2",
  "∇ × E = -∂B/∂t",
  "eiπ + 1 = 0",
  "∑ₙ₌₁^∞ 1/n² = π²/6",
  "F = ma",
  "∂²u/∂t² = c²∇²u",
  "det(A - λI) = 0",
  "lim_{h→0} [f(x+h) - f(x)]/h",
  "∮ B·dl = μ₀I",
  "P(A|B) = P(B|A)·P(A)/P(B)",
  "∇²φ = -ρ/ε₀",
  "x = [-b ± √(b²-4ac)] / 2a",
];

interface MathLoaderProps {
  onLoadComplete?: () => void;
  minDuration?: number;
}

export function MathLoader({ onLoadComplete, minDuration = 2800 }: MathLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [activeEquations, setActiveEquations] = useState<number[]>([]);
  const [isExiting, setIsExiting] = useState(false);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Ease-in-out progress curve
        const elapsed = Date.now() - startTimeRef.current;
        const ratio = Math.min(elapsed / minDuration, 1);
        const eased = ratio < 0.5 
          ? 4 * ratio * ratio * ratio 
          : 1 - Math.pow(-2 * ratio + 2, 3) / 2;
        return Math.floor(eased * 100);
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [minDuration]);

  // Sequentially reveal equations
  useEffect(() => {
    const revealEquation = (index: number) => {
      if (index >= 6) return; // Show max 6 at a time
      const timeout = setTimeout(() => {
        setActiveEquations((prev) => [...prev, index]);
        revealEquation(index + 1);
      }, 300 + Math.random() * 200);
      return timeout;
    };
    revealEquation(0);
  }, []);

  // Trigger exit when progress reaches 100
  useEffect(() => {
    if (progress >= 100 && !isExiting) {
      const exitTimeout = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          onLoadComplete?.();
        }, 800);
      }, 400);
      return () => clearTimeout(exitTimeout);
    }
  }, [progress, isExiting, onLoadComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: "var(--bg-primary)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Floating equations background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {EQUATIONS.map((eq, i) => (
              <motion.div
                key={i}
                className="absolute font-mono text-xs md:text-sm whitespace-nowrap select-none"
                style={{ color: "var(--text-muted)", opacity: 0.15 }}
                initial={{
                  x: `${10 + (i * 17) % 80}%`,
                  y: `${5 + (i * 13) % 85}%`,
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                  opacity: activeEquations.includes(i % 6) ? 0.15 : 0,
                  scale: 1,
                  y: `${5 + (i * 13) % 85 - 2}%`,
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.15,
                  ease: "easeOut",
                }}
              >
                {eq}
              </motion.div>
            ))}
          </div>

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Solving animation */}
            <div className="w-72 md:w-96 space-y-3">
              {[0, 1, 2].map((lineIdx) => {
                const eqIndex = (lineIdx + Math.floor(progress / 35)) % EQUATIONS.length;
                return (
                  <motion.div
                    key={`${lineIdx}-${eqIndex}`}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: lineIdx * 0.2, duration: 0.5 }}
                  >
                    <motion.span
                      className="font-mono text-xs tracking-wider"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {String(lineIdx + 1).padStart(2, "0")}
                    </motion.span>
                    <motion.span
                      className="font-mono text-sm md:text-base tracking-wide"
                      style={{ color: "var(--accent)" }}
                      initial={{ width: 0 }}
                      animate={{ width: "auto" }}
                      transition={{ duration: 1.2, delay: lineIdx * 0.3, ease: "easeOut" }}
                    >
                      <span className="inline-block overflow-hidden whitespace-nowrap">
                        {EQUATIONS[eqIndex]}
                      </span>
                    </motion.span>
                    {progress > (lineIdx + 1) * 30 && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="font-mono text-xs"
                        style={{ color: "var(--accent)" }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="w-72 md:w-96 mt-4">
              <div
                className="h-px w-full"
                style={{ backgroundColor: "var(--border)" }}
              >
                <motion.div
                  className="h-full"
                  style={{ backgroundColor: "var(--accent)" }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span
                  className="font-mono text-[10px] tracking-[0.3em] uppercase"
                  style={{ color: "var(--text-muted)" }}
                >
                  Initializing
                </span>
                <span
                  className="font-mono text-[10px] tabular-nums"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {progress}%
                </span>
              </div>
            </div>

            {/* Club name */}
            <motion.p
              className="font-mono text-[10px] tracking-[0.5em] uppercase mt-6"
              style={{ color: "var(--text-muted)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1 }}
            >
              Brahmagupta Mathematics Club
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
