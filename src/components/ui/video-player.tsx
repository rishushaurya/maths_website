"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, Volume1, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const formatTime = (seconds: number) => {
  if (!isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const CustomSlider = ({
  value,
  onChange,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}) => {
  return (
    <motion.div
      className={cn(
        "relative w-full h-[2px] bg-[var(--border)] rounded-none cursor-pointer hover:h-[4px] transition-all",
        className
      )}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        onChange(Math.min(Math.max(percentage, 0), 100));
      }}
    >
      <motion.div
        className="absolute top-0 left-0 h-full bg-[var(--accent)] rounded-none"
        style={{ width: `${value}%`, boxShadow: '0 0 5px var(--accent-glow)' }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </motion.div>
  );
};

export const VideoPlayer = ({ src, className }: { src: string, className?: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleVolumeChange = (value: number) => {
    if (videoRef.current) {
      const newVolume = value / 100;
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(isFinite(p) ? p : 0);
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (value: number) => {
    if (videoRef.current && videoRef.current.duration) {
      const time = (value / 100) * videoRef.current.duration;
      if (isFinite(time)) {
        videoRef.current.currentTime = time;
        setProgress(value);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      if (!isMuted) {
        setVolume(0);
      } else {
        setVolume(1);
        videoRef.current.volume = 1;
      }
    }
  };

  const setSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  };

  return (
    <motion.div
      className={cn("relative w-full max-w-5xl mx-auto rounded-none overflow-hidden bg-black border border-[var(--border)]", className)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-auto object-cover max-h-[80vh] cursor-pointer"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        src={src}
        controls={false}
        onClick={togglePlay}
        playsInline
      />

      <AnimatePresence>
        {showControls && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--border)] pointer-events-auto"
            style={{ backgroundColor: 'var(--nav-bg)', backdropFilter: 'blur(10px)' }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-4 mb-2">
              <span className="text-[var(--text-primary)] font-mono text-xs w-12 text-center select-none">
                {formatTime(currentTime)}
              </span>
              <CustomSlider
                value={progress}
                onChange={handleSeek}
                className="flex-1"
              />
              <span className="text-[var(--text-primary)] font-mono text-xs w-12 text-center select-none">
                {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                  variant="ghost"
                  size="icon"
                  className="rounded-none hover:bg-[var(--accent)] hover:text-[#000] cursor-pointer pointer-events-auto"
                >
                  {isPlaying ? <Pause className="h-5 w-5 pointer-events-none" /> : <Play className="h-5 w-5 pointer-events-none" />}
                </Button>

                <div className="flex items-center gap-2 ml-2">
                  <Button
                    onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                    variant="ghost"
                    size="icon"
                    className="rounded-none hover:bg-[var(--accent)] hover:text-[#000] cursor-pointer pointer-events-auto"
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5 pointer-events-none" />
                    ) : volume > 0.5 ? (
                      <Volume2 className="h-5 w-5 pointer-events-none" />
                    ) : (
                      <Volume1 className="h-5 w-5 pointer-events-none" />
                    )}
                  </Button>
                  <div className="w-20 hidden sm:block">
                    <CustomSlider
                      value={volume * 100}
                      onChange={handleVolumeChange}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {[0.5, 1, 1.5, 2].map((speed) => (
                  <Button
                    key={speed}
                    onClick={(e) => { e.stopPropagation(); setSpeed(speed); }}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "font-mono text-xs rounded-none transition-colors cursor-pointer pointer-events-auto",
                      playbackSpeed === speed 
                        ? "bg-[var(--accent)] text-[#000]" 
                        : "hover:bg-[var(--bg-surface-hover)]"
                    )}
                  >
                    {speed}x
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
