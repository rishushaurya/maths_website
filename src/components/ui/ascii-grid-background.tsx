"use client";

import React, { useEffect, useRef } from 'react';

export default function AsciiParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    
    // Mouse interaction targeting
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let scrollY = 0;
    let targetScrollY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    
    const onScroll = () => {
      targetScrollY = window.scrollY;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
    };
    
    window.addEventListener('resize', resize);
    resize();

    // 3D Terrain Configuration
    const cols = 60;
    const rows = 40;
    const spacing = 120;
    const focalLength = 800; // perspective
    
    const render = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      
      ctx.clearRect(0, 0, W, H);
      
      time += 0.005;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      scrollY += (targetScrollY - scrollY) * 0.1;
      
      const centerX = W / 2;
      const centerY = H / 2;
      
      // Calculate continuous offset for endless forward movement
      const zOffset = (time * 200) % spacing;

      // Read theme accent color dynamically
      const computedStyle = getComputedStyle(document.documentElement);
      const accentColor = computedStyle.getPropertyValue('--accent').trim() || '#ffffff';
      ctx.fillStyle = accentColor;

      for (let zIndex = 1; zIndex < rows; zIndex++) {
        // True depth Z coordinate
        const z = zIndex * spacing - zOffset;
        if (z < 10) continue; // Don't render behind camera
        
        for (let xIndex = -cols/2; xIndex < cols/2; xIndex++) {
          const x = xIndex * spacing;
          
          // Create mathematical wave terrain
          // Mix sine waves for organic mathematical surface
          const wave1 = Math.sin(x * 0.005 + time) * 100;
          const wave2 = Math.cos(z * 0.008 - time * 2) * 150;
          const wave3 = Math.sin((x * 0.01) * (z * 0.01)) * 50;
          
          // Add reactive mouse and scroll distortion
          const mouseDistortion = mouseX * 200 * (z / 2000);
          const scrollDistortion = scrollY * 0.2;
          
          // Base Y is below camera
          const y = 300 + wave1 + wave2 + wave3 - scrollDistortion;
          
          // 3D Projection
          const scale = focalLength / (focalLength + z);
          
          const px = centerX + (x + mouseDistortion) * scale;
          
          // Radius scales with depth
          const radius = Math.max(0.7, 2.5 * scale);
          
          // Alpha fades in distance and pulses slightly
          const distanceAlpha = Math.max(0, 1 - (z / (rows * spacing)));
          const baseAlpha = distanceAlpha * 0.7;
          const twinkle = Math.sin(time * 10 + xIndex + zIndex) * 0.3;
          
          ctx.globalAlpha = Math.max(0.1, Math.min(0.9, baseAlpha + twinkle));
          
          // Draw Floor Dot
          const pyFloor = centerY + y * scale + (mouseY * 100);
          if (!(px < -20 || px > W + 20 || pyFloor < -20 || pyFloor > H + 20)) {
            ctx.beginPath();
            ctx.arc(px, pyFloor, radius, 0, Math.PI * 2);
            ctx.fill();
          }
          
          // Draw Ceiling Dot (mirrored y)
          const pyCeiling = centerY - y * scale + (mouseY * 100);
          if (!(px < -20 || px > W + 20 || pyCeiling < -20 || pyCeiling > H + 20)) {
            ctx.beginPath();
            ctx.arc(px, pyCeiling, radius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
