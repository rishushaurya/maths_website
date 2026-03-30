"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme-context";

interface FacultyCardProps {
  name: string;
  role: string;
  imageSrc: string;
  className?: string;
}

export function FacultyCard({ name, role, imageSrc, className }: FacultyCardProps) {
  const { appearance } = useTheme();
  const isLight = appearance === 'light';

  return (
    <div
      className={cn(
        "relative rounded-none overflow-hidden flex flex-col items-center p-8 transition-transform duration-300 hover:scale-[1.02]",
        "border backdrop-blur-md",
        className
      )}
      style={{
        background: 'transparent',
        border: '1px solid var(--border)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="w-48 h-48 rounded-none overflow-hidden mb-6 border border-dashed border-[var(--border)] mt-2 shadow-inner bg-transparent p-1">
        <img 
          src={imageSrc} 
          alt={name}
          className="w-full h-full object-cover object-top"
        />
      </div>
      
      <div className="text-center w-full z-10 flex flex-col gap-2">
        <h3 
          className="text-lg md:text-xl font-bold uppercase tracking-widest leading-tight"
          style={{ fontFamily: "Space font, monospace, sans-serif", color: 'var(--text-primary)' }}
        >
          {name}
        </h3>
        <p className="text-sm md:text-base font-mono tracking-wider opacity-90" style={{ color: 'var(--text-secondary)' }}>
          {role}
        </p>
      </div>
    </div>
  );
}
