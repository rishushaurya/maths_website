"use client";

import React, { useState, useEffect } from "react";
import { MathLoader } from "@/components/ui/math-loader";
import { PageTransition } from "@/components/ui/page-transition";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // Check if this is first visit in this session
  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("app-loaded");
    if (hasLoaded) {
      setIsInitialLoad(false);
      setShowContent(true);
    }
  }, []);

  const handleLoadComplete = () => {
    sessionStorage.setItem("app-loaded", "true");
    setIsInitialLoad(false);
    // Small delay to let exit animation play
    setTimeout(() => setShowContent(true), 100);
  };

  return (
    <>
      {isInitialLoad && <MathLoader onLoadComplete={handleLoadComplete} />}
      <div style={{ opacity: showContent ? 1 : 0, transition: "opacity 0.5s ease" }}>
        <PageTransition>
          {children}
        </PageTransition>
      </div>
    </>
  );
}
