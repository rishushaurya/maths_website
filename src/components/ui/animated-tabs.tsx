"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface AnimatedTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

export const AnimatedTabs = ({
  tabs,
  defaultTab,
  className,
}: AnimatedTabsProps) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0]?.id);

  if (!tabs?.length) return null;

  return (
    <div className={cn("w-full flex flex-col gap-y-4", className)}>
      {/* Tab bar — scrollable on mobile */}
      <div 
        className="flex gap-1 sm:gap-2 items-center justify-start sm:justify-center p-1 w-full sm:w-fit mx-auto overflow-x-auto no-scrollbar"
        style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative px-3 sm:px-4 py-2 text-xs sm:text-sm font-mono uppercase tracking-widest outline-none transition-all cursor-pointer whitespace-nowrap shrink-0",
            )}
            style={{
              color: activeTab === tab.id ? 'var(--bg-primary)' : 'var(--text-muted)'
            }}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 z-0"
                style={{
                  background: 'var(--accent)',
                  boxShadow: '0 0 10px var(--accent-glow)'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10 font-bold">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="w-full mt-2 sm:mt-4 min-h-[300px] sm:min-h-[400px]">
        {tabs.map(
          (tab) =>
            activeTab === tab.id && (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="h-full"
              >
                {tab.content}
              </motion.div>
            )
        )}
      </div>
    </div>
  );
};
