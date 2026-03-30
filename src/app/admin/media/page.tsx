"use client";

import React, { useState, useEffect, useRef } from "react";
import { FolderOpen, Upload, Trash2, Camera, Film, Copy, Check, Loader2, Link } from "lucide-react";

interface MediaFile {
  name: string;
  url: string;
  folder: string;
  type: string;
  size: number;
  createdAt: number;
}

export default function MediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (data.files) setFiles(data.files);
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
    formData.append("subfolder", "media"); // Central location for ad-hoc uploads

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

  const deleteFile = async (url: string) => {
    if (!confirm("Are you sure you want to permanently delete this file? This will break any existing references.")) return;
    try {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (res.ok) {
        setFiles(files.filter(f => f.url !== url));
      }
    } catch {
      // ignore
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + "B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + "KB";
    return (bytes / (1024 * 1024)).toFixed(1) + "MB";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--accent)" }} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-[0.2em] uppercase" style={{ color: "var(--text-primary)" }}>Media Library</h1>
          <p className="text-xs mt-1 tracking-wider" style={{ color: "var(--text-muted)" }}>Global repository for all site imagery and videos</p>
        </div>
        
        <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*,video/*" onChange={handleFiles} />
        
        <button onClick={handleUploadClick} disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 text-xs tracking-wider uppercase cursor-pointer disabled:opacity-50"
          style={{ backgroundColor: "var(--accent)", color: "var(--bg-primary)" }}>
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          {uploading ? "Uploading..." : "Upload Files"}
        </button>
      </div>

      {files.length === 0 ? (
        <div className="text-center p-12 border border-dashed rounded" style={{ borderColor: "var(--border)" }}>
           <FolderOpen className="w-8 h-8 mx-auto mb-4 opacity-50" style={{ color: "var(--text-muted)" }} />
           <p className="text-sm uppercase tracking-wider font-mono mb-2" style={{ color: "var(--text-secondary)" }}>No Media Files Found</p>
           <p className="text-[10px] font-mono mb-6" style={{ color: "var(--text-muted)" }}>Upload images or videos to use them globally across your site.</p>
           <button onClick={handleUploadClick} className="px-4 py-2 text-xs uppercase tracking-wider mx-auto" style={{ border: "1px solid var(--accent)", color: "var(--accent)" }}>
             Upload Now
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <div key={file.url} className="border group relative overflow-hidden flex flex-col" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}>
              {/* Preview */}
              <div className="h-32 w-full relative bg-black/50 overflow-hidden flex items-center justify-center border-b" style={{ borderColor: "var(--border)" }}>
                {file.type === "video" ? (
                  <>
                    <video src={file.url} className="object-cover w-full h-full opacity-50" />
                    <Film className="absolute w-6 h-6 shadow-md" style={{ color: "white" }} />
                  </>
                ) : (
                  <img src={file.url} className="object-contain w-full h-full p-2" alt={file.name} loading="lazy" />
                )}
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-sm z-10">
                  <button onClick={() => copyToClipboard(file.url)} className="flex items-center gap-2 px-3 py-1.5 text-[10px] uppercase border cursor-pointer hover:bg-white/10" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
                    {copiedUrl === file.url ? <Check className="w-3 h-3" /> : <Link className="w-3 h-3" />}
                    {copiedUrl === file.url ? "Copied!" : "Copy URL"}
                  </button>
                  <button onClick={() => deleteFile(file.url)} className="flex items-center gap-2 px-3 py-1.5 text-[10px] uppercase border cursor-pointer hover:bg-red-500/20 text-red-400 border-red-500">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-2 space-y-1">
                <p className="text-[10px] truncate max-w-full font-bold" style={{ color: "var(--text-primary)" }} title={file.name}>{file.name}</p>
                <div className="flex items-center justify-between text-[9px] font-mono opacity-60" style={{ color: "var(--text-muted)" }}>
                  <span className="uppercase">{file.folder}</span>
                  <span>{formatSize(file.size)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
