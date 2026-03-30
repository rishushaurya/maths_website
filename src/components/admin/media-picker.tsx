"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Film, ImageIcon, Loader2, Upload, FolderOpen } from "lucide-react";

interface MediaFile {
  name: string;
  url: string;
  folder: string;
  type: string;
  size: number;
  createdAt: number;
}

interface MediaPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (file: MediaFile) => void;
  typeFilter?: "image" | "video" | "all";
}

export function MediaPicker({ isOpen, onClose, onSelect, typeFilter = "all" }: MediaPickerProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (data.files) {
        setFiles(data.files);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const list = event.target.files;
    if (!list || list.length === 0) return;
    setUploading(true);

    const formData = new FormData();
    Array.from(list).forEach((f) => formData.append("files", f));
    formData.append("subfolder", "media"); 

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (res.ok) {
        await fetchMedia(); // Reload
      }
    } catch {
      // ignore
    }
    setUploading(false);
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const filteredFiles = files.filter(f => typeFilter === "all" || f.type === typeFilter);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl max-h-[85vh] flex flex-col border shadow-2xl overflow-hidden"
            style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              <h2 className="text-lg font-bold tracking-widest uppercase" style={{ color: "var(--text-primary)" }}>Select Media</h2>
              <div className="flex items-center gap-4">
                <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*,video/*" onChange={handleFiles} />
                <button onClick={handleUploadClick} disabled={uploading} className="flex items-center gap-2 px-3 py-1.5 text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer" style={{ backgroundColor: "var(--accent)", color: "var(--bg-primary)" }}>
                  {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  {uploading ? "Uploading..." : "Upload New"}
                </button>
                <button onClick={onClose} className="p-1 hover:bg-black/10 rounded cursor-pointer" style={{ color: "var(--text-muted)" }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto p-4 custom-scroll">
              {loading ? (
                <div className="flex items-center justify-center py-24">
                  <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--accent)" }} />
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="text-center p-12 border border-dashed rounded" style={{ borderColor: "var(--border)" }}>
                   <FolderOpen className="w-8 h-8 mx-auto mb-4 opacity-50" style={{ color: "var(--text-muted)" }} />
                   <p className="text-sm uppercase tracking-wider font-mono mb-2" style={{ color: "var(--text-secondary)" }}>No Media Found</p>
                   <p className="text-[10px] font-mono mb-6" style={{ color: "var(--text-muted)" }}>Upload files or select a different filter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredFiles.map((file) => (
                    <div 
                      key={file.url} 
                      onClick={() => onSelect(file)}
                      className="group cursor-pointer border overflow-hidden relative flex flex-col"
                      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}
                    >
                      <div className="aspect-square w-full relative bg-black/30 overflow-hidden flex items-center justify-center">
                        {file.type === "video" ? (
                          <>
                            <video src={file.url} className="object-cover w-full h-full opacity-60 group-hover:opacity-100 transition-opacity" />
                            <Film className="absolute w-8 h-8 shadow-md" style={{ color: "white" }} />
                          </>
                        ) : (
                          <img src={file.url} className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" loading="lazy" alt="" />
                        )}
                        
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-[var(--accent)] text-[var(--bg-primary)] text-xs tracking-wider uppercase transform translate-y-4 group-hover:translate-y-0 transition-all font-bold">
                            Select
                          </div>
                        </div>
                        
                        {/* Type badge */}
                        <div className="absolute top-1 left-1">
                          {file.type === "video" ? (
                            <Film className="w-3.5 h-3.5 drop-shadow-md text-white" />
                          ) : (
                            <ImageIcon className="w-3.5 h-3.5 drop-shadow-md text-white" />
                          )}
                        </div>
                      </div>
                      <div className="p-2 border-t" style={{ borderColor: "var(--border)" }}>
                        <p className="text-[9px] truncate max-w-full font-mono font-bold" style={{ color: "var(--text-primary)" }}>{file.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
