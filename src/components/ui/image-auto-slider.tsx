"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play } from 'lucide-react';
import { VideoPlayer } from '@/components/ui/video-player';

export type MediaItem = {
  id: string;
  type: 'image' | 'video';
  src: string;
  alt?: string;
};

interface ImageAutoSliderProps {
  items: MediaItem[];
  eventName: string;
}

export const ImageAutoSlider = ({ items, eventName }: ImageAutoSliderProps) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Duplicate items to ensure a seamless infinite loop
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div className="w-full relative py-6 sm:py-12 flex flex-col items-start justify-center border-b border-dashed border-[var(--border)]">
      
      {/* Event Header */}
      <div className="w-full max-w-7xl mx-auto px-4 mb-4 sm:mb-8">
        <h3 className="text-lg sm:text-2xl md:text-3xl font-mono uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>
          <span className="text-[var(--accent)] mr-2 sm:mr-3">&gt;_</span>{eventName}
        </h3>
      </div>

      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            /* Since we duplicated it 3 times, scroll by 1/3 of the total width */
            transform: translateX(-33.333333%);
          }
        }

        .infinite-scroll-track {
          animation: scroll-left 40s linear infinite;
          /* Stop scrolling when hovered */
        }
        
        .infinite-scroll-track:hover {
          animation-play-state: paused;
        }

        .scroll-mask {
          mask: linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%);
          -webkit-mask: linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%);
        }
      `}</style>
      
      <div className="w-full relative overflow-hidden">
        {/* Scrolling images container */}
        <div className="scroll-mask w-full">
          <div className="infinite-scroll-track flex gap-4 w-max px-4">
            {duplicatedItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                onClick={() => setSelectedMedia(item)}
                className="group relative flex-shrink-0 w-48 h-36 sm:w-64 sm:h-48 md:w-80 md:h-56 cursor-pointer overflow-hidden border border-[var(--border)] transition-all duration-300 hover:border-[var(--accent)]"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                {item.type === 'video' ? (
                  <>
                    {/* Video Placeholder/Thumbnail - Just the first frame or a cover but we'll use a silent video object or just an icon over the video frame if thumbnail provided. Without a thumbnail, we'll try to just preload the video without playing it. */}
                    <video 
                      src={item.src} 
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500" 
                      preload="metadata"
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                      <Play className="w-12 h-12 text-[var(--accent)] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform" />
                    </div>
                  </>
                ) : (
                  <img
                    src={item.src}
                    alt={item.alt || `Media ${index}`}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 hover:scale-[1.03]"
                    loading="lazy"
                  />
                )}
                
                {/* ASCII corner decoration */}
                <div className="absolute bottom-2 left-2 text-[10px] font-mono text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.type === 'video' ? '[VID.MP4]' : '[IMG.JPG]'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox / Modal Modal for large viewing via Portal */}
      {mounted && createPortal(
        <AnimatePresence>
          {selectedMedia && (
            <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Click-away backdrop correctly placed BEHIND content */}
            <div 
              className="absolute inset-0 z-40 bg-black/90 backdrop-blur-sm" 
              onClick={() => setSelectedMedia(null)} 
            />

            <motion.div
              className="relative z-50 w-full max-w-6xl max-h-[90vh] flex flex-col items-center justify-center pointer-events-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()} // Prevent close on clicking media
            >
              {/* Close Button - Pulled into active click zone */}
              <div className="w-full flex justify-end mb-4 pr-2">
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="p-2 bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors cursor-pointer"
                  style={{ pointerEvents: 'auto' }}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {selectedMedia.type === 'video' ? (
                <VideoPlayer src={selectedMedia.src} className="w-full" />
              ) : (
                <div className="relative border border-[var(--border)] bg-black p-2 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                   <img
                    src={selectedMedia.src}
                    alt={selectedMedia.alt || 'Enlarged media'}
                    className="w-full h-auto max-h-[85vh] object-contain"
                  />
                  <div className="absolute bottom-4 left-4 bg-black/80 px-3 py-1 text-xs font-mono text-[var(--accent)] border border-[var(--border)]">
                    &gt;_ VIEWING ASSET: {selectedMedia.id}
                  </div>
                </div>
              )}
            </motion.div>
            
          </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
