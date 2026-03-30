'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/lib/theme-context';

export default function HeroAsciiOne() {
  const { appearance } = useTheme();
  const isLight = appearance === 'light';
  useEffect(() => {
    const initUnicorn = () => {
      const w = window as any;
      if (w.UnicornStudio && w.UnicornStudio.init) {
        // If it's already loaded, just re-initialize the canvas search
        w.UnicornStudio.init();
      } else {
        if (!document.getElementById('js-unicorn-init')) {
          const embedScript = document.createElement('script');
          embedScript.type = 'text/javascript';
          embedScript.id = 'js-unicorn-init';
          embedScript.textContent = `
            !function(){
              if(!window.UnicornStudio){
                window.UnicornStudio={isInitialized:!1};
                var i=document.createElement("script");
                i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.33/dist/unicornStudio.umd.js";
                i.onload=function(){
                  window.UnicornStudio.isInitialized||(UnicornStudio.init(),window.UnicornStudio.isInitialized=!0)
                };
                (document.head || document.body).appendChild(i)
              }
            }();
          `;
          document.head.appendChild(embedScript);
        }
      }
    };

    initUnicorn();

    const style = document.createElement('style');
    style.id = 'us-style';
    style.textContent = `
      [data-us-project] {
        position: relative !important;
        overflow: hidden !important;
      }
      
      [data-us-project] canvas {
        clip-path: inset(0 0 10% 0) !important;
      }
      
      [data-us-project] * {
        pointer-events: none !important;
      }
      [data-us-project] a[href*="unicorn"],
      [data-us-project] button[title*="unicorn"],
      [data-us-project] div[title*="Made with"],
      [data-us-project] .unicorn-brand,
      [data-us-project] [class*="brand"],
      [data-us-project] [class*="credit"],
      [data-us-project] [class*="watermark"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        position: absolute !important;
        left: -9999px !important;
        top: -9999px !important;
      }
    `;
    document.head.appendChild(style);

    // Aggressive branding hide
    const hideBranding = () => {
      const selectors = [
        '[data-us-project]',
        '[data-us-project="OMzqyUv6M3kSnv0JeAtC"]',
        '.unicorn-studio-container',
        'canvas[aria-label*="Unicorn"]'
      ];
      
      selectors.forEach(selector => {
        const containers = document.querySelectorAll(selector);
        containers.forEach(container => {
          const allElements = container.querySelectorAll('*');
          allElements.forEach(el => {
            const text = (el.textContent || '').toLowerCase();
            const title = (el.getAttribute('title') || '').toLowerCase();
            const href = (el.getAttribute('href') || '').toLowerCase();
            
            if (
              text.includes('made with') || 
              text.includes('unicorn') ||
              title.includes('made with') ||
              title.includes('unicorn') ||
              href.includes('unicorn.studio')
            ) {
              (el as HTMLElement).style.display = 'none';
              (el as HTMLElement).style.visibility = 'hidden';
              (el as HTMLElement).style.opacity = '0';
              (el as HTMLElement).style.pointerEvents = 'none';
              (el as HTMLElement).style.position = 'absolute';
              (el as HTMLElement).style.left = '-9999px';
              (el as HTMLElement).style.top = '-9999px';
              try { el.remove(); } catch(e) {}
            }
          });
        });
      });
    };

    hideBranding();
    const interval = setInterval(hideBranding, 50);
    
    setTimeout(hideBranding, 500);
    setTimeout(hideBranding, 1000);
    setTimeout(hideBranding, 2000);
    setTimeout(hideBranding, 5000);
    setTimeout(hideBranding, 10000);

    return () => {
      clearInterval(interval);
      document.head.querySelector('#js-unicorn-init')?.remove();
      document.head.querySelector('#us-style')?.remove();
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Background Animation — original UnicornStudio embed */}
      <div 
        className="absolute inset-0 w-full h-full hidden lg:block transition-all duration-500"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, black 75%, transparent 95%)",
          maskImage: "linear-gradient(to bottom, black 75%, transparent 95%)",
        }}
      >
        <div 
          data-us-project="OMzqyUv6M3kSnv0JeAtC" 
          className="transition-all duration-500"
          style={{ 
            width: '100%', 
            height: '100%', 
            minHeight: '100vh',
            filter: isLight ? 'invert(1) grayscale(100%)' : 'grayscale(100%)',
            mixBlendMode: isLight ? 'multiply' : 'screen',
          }}
        />
        {/* Accent color overlay — tints the statue and particles */}
        <div 
          className="absolute inset-0 pointer-events-none transition-all duration-500"
          style={{ 
            background: 'var(--accent)', 
            mixBlendMode: isLight ? 'screen' : 'multiply',
            opacity: 0.6,
          }} 
        />
        {/* Accent color vignette glow */}
        <div 
          className="absolute inset-0 pointer-events-none transition-all duration-500"
          style={{ 
            background: 'radial-gradient(ellipse at 30% 50%, var(--accent-glow) 0%, transparent 60%)',
            opacity: isLight ? 0.3 : 1, // subtle glow in light mode
          }} 
        />
      </div>

      {/* CTA Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-end pt-16 lg:pt-0" style={{ marginTop: '5vh' }}>
        <div className="w-full lg:w-1/2 px-6 lg:px-16 lg:pr-[10%]">
          <div className="max-w-lg relative lg:ml-auto">
            {/* Logos */}
            <div 
              className="flex items-center gap-6 mb-8 lg:-ml-[5%] transition-all duration-500"
              style={{ 
                // In dark mode: invert(1) turns white backgrounds black, hue-rotate(180deg) restores the brand colors
                filter: isLight ? 'none' : 'invert(1) hue-rotate(180deg) brightness(1.2)',
                // Light mode: multiply makes white transparent. Dark mode (inverted): screen makes black transparent
                mixBlendMode: isLight ? 'multiply' : 'screen',
                opacity: 0.9
              }}
            >
              <img 
                src="/dsu-logo.png" 
                alt="Dayananda Sagar University" 
                className="h-12 md:h-16 w-auto object-contain"
              />
              <img 
                src="/soe-logo.png" 
                alt="School of Engineering" 
                className="h-12 md:h-16 w-auto object-contain"
              />
            </div>

            {/* Title */}
            <div className="relative">
              <h1 className="text-2xl lg:text-5xl font-bold mb-3 lg:mb-4 leading-tight font-mono tracking-wider whitespace-nowrap lg:-ml-[5%]" style={{ letterSpacing: '0.1em', color: 'var(--text-primary)' }}>
                DEPARTMENT OF<br />ENG. MATHEMATICS
              </h1>
            </div>

            {/* Description */}
            <div className="relative">
              <p className="text-xs lg:text-base mb-5 lg:mb-6 leading-relaxed font-mono opacity-80" style={{ color: 'var(--text-secondary)' }}>
                Push past boundaries. We model the abstract universe of logic to 
                drive the concrete engineering breakthroughs of tomorrow.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
              <button className="relative px-5 lg:px-6 py-2 lg:py-2.5 bg-transparent font-mono text-xs lg:text-sm transition-all duration-200 group hover:opacity-80" style={{ color: 'var(--text-primary)', border: '1px solid var(--accent)' }}>
                EXPLORE COURSES
              </button>
              
              <Link href="#team" className="relative px-5 lg:px-6 py-2 lg:py-2.5 bg-transparent font-mono text-xs lg:text-sm transition-all duration-200 hover:opacity-80 text-center" style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                MEET FACULTY
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
