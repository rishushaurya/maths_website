"use client";

import React, { useState, useEffect } from "react";
import { Save, Plus, X, Loader2 } from "lucide-react";

interface ContentSection {
  id: string;
  title: string;
  paragraphs: string[];
}

export default function ContentEditor() {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/content").then((r) => r.json()).then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setSections(data);
      } else {
        // Default content
        setSections([{
          id: "about",
          title: "About - Brahmagupta Mathematics Club",
          paragraphs: [
            "Established by the Department of Mathematics, Dayananda Sagar School of Engineering (DSU), serving as a bridge between young engineering minds and advanced research in mathematics and Artificial Intelligence.",
            "As Dayananda Sagar University proudly positions itself as India's AI-first university, the club aligns its activities with this forward-looking vision.",
            "Inspired by the legacy of the great Indian mathematician Brahmagupta, the club fosters analytical thinking, computational skills, and research-oriented learning.",
          ],
        }]);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const updateParagraph = (sectionId: string, paraIdx: number, value: string) => {
    setSections(sections.map((s) =>
      s.id === sectionId ? { ...s, paragraphs: s.paragraphs.map((p, i) => (i === paraIdx ? value : p)) } : s
    ));
    setSaved(false);
  };

  const addParagraph = (sectionId: string) => {
    setSections(sections.map((s) =>
      s.id === sectionId ? { ...s, paragraphs: [...s.paragraphs, ""] } : s
    ));
  };

  const removeParagraph = (sectionId: string, paraIdx: number) => {
    setSections(sections.map((s) =>
      s.id === sectionId ? { ...s, paragraphs: s.paragraphs.filter((_, i) => i !== paraIdx) } : s
    ));
  };

  const addSection = () => {
    setSections([...sections, { id: `section-${Date.now()}`, title: "New Section", paragraphs: [""] }]);
  };

  const updateSectionTitle = (sectionId: string, title: string) => {
    setSections(sections.map((s) => s.id === sectionId ? { ...s, title } : s));
    setSaved(false);
  };

  const deleteSection = (sectionId: string) => {
    if (confirm("Delete this content section?")) {
      setSections(sections.filter((s) => s.id !== sectionId));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // Error
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-32"><Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--accent)" }} /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-[0.2em] uppercase" style={{ color: "var(--text-primary)" }}>Content Editor</h1>
          <p className="text-xs mt-1 tracking-wider" style={{ color: "var(--text-muted)" }}>Edit page content — changes appear directly on the website</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={addSection} className="flex items-center gap-2 px-3 py-2 text-xs tracking-wider uppercase border cursor-pointer hover:border-[var(--accent)]"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}><Plus className="w-3.5 h-3.5" /> Add Section</button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-xs tracking-wider uppercase cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: saved ? "#10b981" : "var(--accent)", color: "var(--bg-primary)" }}>
            {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</> : saved ? "✓ Saved" : <><Save className="w-3.5 h-3.5" /> Save All</>}
          </button>
        </div>
      </div>

      {sections.map((section) => (
        <div key={section.id} className="border p-5 space-y-4" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between">
            <input value={section.title} onChange={(e) => updateSectionTitle(section.id, e.target.value)}
              className="text-sm font-bold tracking-wider uppercase bg-transparent outline-none flex-1 focus:border-b focus:border-[var(--accent)]"
              style={{ color: "var(--text-primary)" }} />
            <button onClick={() => deleteSection(section.id)} className="p-1 cursor-pointer hover:text-red-500 ml-3" style={{ color: "var(--text-muted)" }}>
              <X className="w-4 h-4" />
            </button>
          </div>

          {section.paragraphs.map((para, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-[10px] mt-2 shrink-0 w-6 text-right tabular-nums" style={{ color: "var(--text-muted)" }}>{i + 1}.</span>
              <textarea value={para} onChange={(e) => updateParagraph(section.id, i, e.target.value)} rows={3}
                className="flex-1 px-3 py-2 text-sm font-mono border outline-none bg-transparent resize-none focus:border-[var(--accent)]"
                style={{ borderColor: "var(--border)", color: "var(--text-primary)" }} />
              <button onClick={() => removeParagraph(section.id, i)} className="p-1 self-start mt-1 cursor-pointer hover:text-red-500"
                style={{ color: "var(--text-muted)" }}><X className="w-3.5 h-3.5" /></button>
            </div>
          ))}

          <button onClick={() => addParagraph(section.id)}
            className="flex items-center gap-1.5 text-[10px] tracking-wider uppercase cursor-pointer"
            style={{ color: "var(--accent)" }}><Plus className="w-3 h-3" /> Add Paragraph</button>
        </div>
      ))}
    </div>
  );
}
