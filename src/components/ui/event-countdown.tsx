"use client";

import React, { useState, useEffect } from "react";
import { Timer, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { EventData } from "@/lib/data";

export function EventCountdown({ event }: { event: EventData }) {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    if (!event.date) return;
    
    // Parse the date. Assuming "April 15, 2026" or similar format.
    // If it's just a date, we assume 10:00 AM local time for drama, unless time is specified
    const targetDate = new Date(event.date);
    if (targetDate.getHours() === 0) {
      targetDate.setHours(10, 0, 0, 0);
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }

      setTimeLeft({
        d: Math.floor(distance / (1000 * 60 * 60 * 24)),
        h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [event.date]);

  if (!timeLeft) return null;

  const isLive = timeLeft.d === 0 && timeLeft.h === 0 && timeLeft.m === 0 && timeLeft.s === 0;

  return (
    <div className="w-full border p-6 md:p-12 relative overflow-hidden group" style={{ borderColor: "var(--accent)", backgroundColor: "var(--bg-secondary)" }}>
      {/* Background flair */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: `repeating-linear-gradient(45deg, var(--accent) 0, var(--accent) 1px, transparent 1px, transparent 10px)` }} />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 border text-xs tracking-[0.2em] font-bold uppercase mb-4"
            style={{ borderColor: isLive ? "#10b981" : "var(--accent)", color: isLive ? "#10b981" : "var(--accent)", backgroundColor: isLive ? "rgba(16, 185, 129, 0.1)" : "transparent" }}>
            {isLive ? <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" /> : <Timer className="w-3.5 h-3.5" />}
            {isLive ? "LIVE NOW" : "UPCOMING MAJOR EVENT"}
          </div>
          <h3 className="text-3xl md:text-5xl font-bold tracking-wider uppercase" style={{ color: "var(--text-primary)" }}>{event.title}</h3>
          <p className="font-mono text-sm max-w-xl mx-auto md:mx-0 opacity-80" style={{ color: "var(--text-secondary)" }}>{event.description}</p>
          <div className="pt-4 flex items-center justify-center md:justify-start gap-4 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
             <Calendar className="w-4 h-4" /> {event.date}
          </div>
        </div>

        <div className="flex-shrink-0 flex flex-col items-center gap-6">
          <div className="flex gap-4">
            {[
              { label: "DAYS", value: timeLeft.d },
              { label: "HRS", value: timeLeft.h },
              { label: "MIN", value: timeLeft.m },
              { label: "SEC", value: timeLeft.s },
            ].map((unit, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center border text-2xl md:text-3xl font-bold bg-black/40 backdrop-blur-sm shadow-inner transition-colors duration-500"
                  style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
                  {unit.value.toString().padStart(2, '0')}
                </div>
                <span className="text-[10px] tracking-[0.2em] uppercase mt-2 font-bold" style={{ color: "var(--text-muted)" }}>{unit.label}</span>
              </div>
            ))}
          </div>

          <Link href="/events" className="flex items-center gap-2 px-6 py-3 text-xs tracking-[0.2em] font-bold uppercase border w-full justify-center transition-all hover:gap-4"
             style={{ backgroundColor: "var(--text-primary)", color: "var(--bg-primary)", borderColor: "var(--text-primary)" }}>
            View Event Details <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
