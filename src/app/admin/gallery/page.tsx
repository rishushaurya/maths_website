"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Plus, Trash2, Eye, EyeOff, GripVertical, X, Check, FolderOpen, Film, ImageIcon, Loader2 } from "lucide-react";

interface MediaFile {
  id: string;
  type: "image" | "video";
  url: string;
  name: string;
}

interface GallerySection {
  id: string;
  name: string;
  showOnHome: boolean;
  showOnGalleryPage: boolean;
  items: MediaFile[];
}

export default function GalleryManager() {
  const [sections, setSections] = useState<GallerySection[]>([]);
  const [newSectionName, setNewSectionName] = useState("");
  const [showNewSection, setShowNewSection] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [dragOver, setDragOver] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load data from API
  useEffect(() => {
    fetch("/api/admin/gallery").then((r) => r.json()).then((data) => {
      if (Array.isArray(data) && data.length > 0) setSections(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Auto-save after any state change (debounced)
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoSave = useCallback((updatedSections: GallerySection[]) => {
    setSections(updatedSections);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_all", sections: updatedSections }),
      });
    }, 500);
  }, []);

  const addSection = () => {
    if (!newSectionName.trim()) return;
    const newSection: GallerySection = { 
      id: `s-${Date.now()}`, 
      name: newSectionName.trim(), 
      showOnHome: false, 
      showOnGalleryPage: true,
      items: [] 
    };
    autoSave([...sections, newSection]);
    setNewSectionName("");
    setShowNewSection(false);
  };

  const deleteSection = (sectionId: string) => {
    if (confirm("Delete this entire gallery section? This cannot be undone.")) {
      autoSave(sections.filter((s) => s.id !== sectionId));
    }
  };

  const toggleHomeVisibility = (sectionId: string) => {
    autoSave(sections.map((s) => (s.id === sectionId ? { ...s, showOnHome: !s.showOnHome } : s)));
  };

  const toggleGalleryVisibility = (sectionId: string) => {
    autoSave(sections.map((s) => (s.id === sectionId ? { ...s, showOnGalleryPage: s.showOnGalleryPage === false ? true : false } : s)));
  };

  const startRename = (section: GallerySection) => {
    setEditingSection(section.id);
    setEditName(section.name);
  };

  const confirmRename = () => {
    if (!editName.trim() || !editingSection) return;
    autoSave(sections.map((s) => (s.id === editingSection ? { ...s, name: editName.trim() } : s)));
    setEditingSection(null);
  };

  const deleteItem = (sectionId: string, itemId: string) => {
    autoSave(sections.map((s) => s.id === sectionId ? { ...s, items: s.items.filter((i) => i.id !== itemId) } : s));
  };

  const handleUploadClick = (sectionId: string) => {
    setUploadTarget(sectionId);
    fileInputRef.current?.click();
  };

  const handleFiles = async (files: FileList | null, sectionId: string) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("files", f));
    formData.append("subfolder", "gallery");

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.files && data.files.length > 0) {
        autoSave(sections.map((s) => s.id === sectionId ? { ...s, items: [...s.items, ...data.files] } : s));
      }
    } catch {
      // Fallback: use blob URLs for preview
      const newItems: MediaFile[] = Array.from(files).map((file, i) => ({
        id: `upload-${Date.now()}-${i}`, type: file.type.startsWith("video") ? "video" as const : "image" as const,
        url: URL.createObjectURL(file), name: file.name,
      }));
      autoSave(sections.map((s) => s.id === sectionId ? { ...s, items: [...s.items, ...newItems] } : s));
    }
    setUploading(false);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent, sectionId: string) => {
      e.preventDefault();
      setDragOver(null);
      handleFiles(e.dataTransfer.files, sectionId);
    },
    [sections]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--accent)" }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-[0.2em] uppercase" style={{ color: "var(--text-primary)" }}>
            Gallery Manager
          </h1>
          <p className="text-xs mt-1 tracking-wider" style={{ color: "var(--text-muted)" }}>
            Upload images & videos, organize sections, toggle home page visibility
          </p>
        </div>
        <button
          onClick={() => setShowNewSection(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs tracking-wider uppercase border transition-colors hover:bg-[var(--bg-surface-hover)] cursor-pointer"
          style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
        >
          <Plus className="w-4 h-4" /> New Section
        </button>
      </div>

      {/* Hidden file input for mass upload */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => uploadTarget && handleFiles(e.target.files, uploadTarget)}
      />

      {/* New Section Form */}
      <AnimatePresence>
        {showNewSection && (
          <motion.div
            className="flex items-center gap-3 p-4 border"
            style={{ borderColor: "var(--accent)", backgroundColor: "var(--bg-surface)" }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <FolderOpen className="w-4 h-4 shrink-0" style={{ color: "var(--accent)" }} />
            <input
              autoFocus
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSection()}
              placeholder="Section name (e.g. 'Annual Fest 2026')"
              className="flex-1 bg-transparent outline-none text-sm font-mono"
              style={{ color: "var(--text-primary)" }}
            />
            <button onClick={addSection} className="p-1.5 hover:bg-[var(--bg-surface-hover)] cursor-pointer" style={{ color: "var(--accent)" }}>
              <Check className="w-4 h-4" />
            </button>
            <button onClick={() => setShowNewSection(false)} className="p-1.5 hover:bg-[var(--bg-surface-hover)] cursor-pointer" style={{ color: "var(--text-muted)" }}>
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section) => (
          <motion.div
            key={section.id}
            className="border overflow-hidden"
            style={{ borderColor: "var(--border)" }}
            layout
          >
            {/* Section header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
            >
              <div className="flex items-center gap-3">
                <GripVertical className="w-4 h-4 cursor-grab" style={{ color: "var(--text-muted)" }} />
                {editingSection === section.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && confirmRename()}
                      className="bg-transparent outline-none text-sm font-mono font-bold"
                      style={{ color: "var(--text-primary)" }}
                    />
                    <button onClick={confirmRename} className="cursor-pointer" style={{ color: "var(--accent)" }}>
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startRename(section)}
                    className="text-sm font-bold tracking-wider uppercase cursor-pointer hover:underline"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {section.name}
                  </button>
                )}
                <span className="text-[10px] px-2 py-0.5 border" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                  {section.items.length} items
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleHomeVisibility(section.id)}
                  className="flex items-center gap-1.5 px-2 py-1 text-[10px] tracking-wider uppercase border transition-colors cursor-pointer"
                  style={{
                    borderColor: section.showOnHome ? "var(--accent)" : "var(--border)",
                    color: section.showOnHome ? "var(--accent)" : "var(--text-muted)",
                    backgroundColor: section.showOnHome ? "var(--bg-surface-hover)" : "transparent",
                  }}
                  title={section.showOnHome ? "Visible on home page" : "Hidden from home page"}
                >
                  {section.showOnHome ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  Home
                </button>
                <button
                  onClick={() => toggleGalleryVisibility(section.id)}
                  className="flex items-center gap-1.5 px-2 py-1 text-[10px] tracking-wider uppercase border transition-colors cursor-pointer"
                  style={{
                    borderColor: section.showOnGalleryPage !== false ? "var(--accent)" : "var(--border)",
                    color: section.showOnGalleryPage !== false ? "var(--accent)" : "var(--text-muted)",
                    backgroundColor: section.showOnGalleryPage !== false ? "var(--bg-surface-hover)" : "transparent",
                  }}
                  title={section.showOnGalleryPage !== false ? "Visible on gallery page" : "Hidden from gallery page"}
                >
                  {section.showOnGalleryPage !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  Gallery
                </button>
                <button
                  onClick={() => handleUploadClick(section.id)}
                  className="flex items-center gap-1.5 px-2 py-1 text-[10px] tracking-wider uppercase border transition-colors hover:border-[var(--accent)] cursor-pointer"
                  style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                >
                  <Upload className="w-3 h-3" /> Upload
                </button>
                <button
                  onClick={() => deleteSection(section.id)}
                  className="p-1 hover:bg-red-500/10 cursor-pointer transition-colors"
                  style={{ color: "var(--text-muted)" }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Drop zone / Items grid */}
            <div
              className={`p-4 min-h-[120px] transition-colors ${dragOver === section.id ? "bg-[var(--bg-surface-hover)]" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(section.id); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => handleDrop(e, section.id)}
            >
              {section.items.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-12 border border-dashed cursor-pointer"
                  style={{ borderColor: "var(--border)" }}
                  onClick={() => handleUploadClick(section.id)}
                >
                  <Upload className="w-8 h-8 mb-3" style={{ color: "var(--text-muted)" }} />
                  <p className="text-xs tracking-wider" style={{ color: "var(--text-muted)" }}>
                    Drag & drop files or click to upload
                  </p>
                  <p className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>
                    Supports images (JPG, PNG, WebP) and videos (MP4, MOV)
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      className="group relative aspect-square border overflow-hidden"
                      style={{ borderColor: "var(--border)" }}
                    >
                      {item.type === "video" ? (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "var(--bg-secondary)" }}>
                          <Film className="w-8 h-8" style={{ color: "var(--text-muted)" }} />
                        </div>
                      ) : (
                        <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                      )}
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => deleteItem(section.id, item.id)}
                          className="p-2 bg-red-600/80 text-white cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {/* Type badge */}
                      <div className="absolute top-1 left-1">
                        {item.type === "video" ? (
                          <Film className="w-3 h-3" style={{ color: "var(--accent)" }} />
                        ) : (
                          <ImageIcon className="w-3 h-3" style={{ color: "var(--accent)" }} />
                        )}
                      </div>
                    </div>
                  ))}
                  {/* Add more button */}
                  <button
                    onClick={() => handleUploadClick(section.id)}
                    className="aspect-square border border-dashed flex items-center justify-center transition-colors hover:bg-[var(--bg-surface-hover)] cursor-pointer"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <Plus className="w-6 h-6" style={{ color: "var(--text-muted)" }} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
