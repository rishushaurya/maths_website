"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit3, Save, X, Calendar, MapPin, Link2, Download, ChevronDown, ChevronUp, Eye, EyeOff, Loader2, ImageIcon } from "lucide-react";
import { MediaPicker } from "@/components/admin/media-picker";

interface EventLink { label: string; url: string; }
interface EventDownload { name: string; url: string; }

interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  image: string;
  images?: string[];
  icon: string;
  status: "upcoming" | "ongoing" | "ended";
  showOnHome: boolean;
  showOnEventPage: boolean;
  isCountdownEvent: boolean;
  links: EventLink[];
  downloads: EventDownload[];
}

const iconOptions = ["Infinity", "FunctionSquare", "Divide", "Variable", "Hexagon", "Activity", "Network", "Cpu"];

export default function EventsManager() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<EventData>>({});
  const [loading, setLoading] = useState(true);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<"cover" | "gallery">("cover");

  // Load from API
  useEffect(() => {
    fetch("/api/admin/events").then((r) => r.json()).then((data) => {
      if (Array.isArray(data)) setEvents(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Auto-save
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoSave = useCallback((updated: EventData[]) => {
    setEvents(updated);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/admin/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "save_all", events: updated }),
        });
        if (!res.ok) {
            alert("Database Error! Failed to save changes permanently. Please avoid uploading massive base64 images, or check Redis limits.");
        }
      } catch {
        alert("Network Error! Failed to save changes to the database.");
      }
    }, 500);
  }, []);

  const startNew = () => {
    setForm({ 
      title: "", description: "", date: "", venue: "", image: "", images: [], icon: "Infinity", 
      status: "upcoming", showOnHome: false, showOnEventPage: true, isCountdownEvent: false, 
      links: [], downloads: [] 
    });
    setShowNew(true);
    setEditingId(null);
  };

  const startEdit = (event: EventData) => {
    setForm({ ...event });
    setEditingId(event.id);
    setShowNew(false);
    setExpandedId(event.id);
  };

  const saveEvent = () => {
    if (!form.title?.trim()) return;

    if (editingId) {
      // If this is set as the countdown event, unset others
      let updatedList = events.map((e) => (e.id === editingId ? { ...e, ...(form as EventData) } : e));
      if (form.isCountdownEvent) {
        updatedList = updatedList.map(e => (e.id === editingId ? e : { ...e, isCountdownEvent: false }));
      }
      autoSave(updatedList);
      setEditingId(null);
    } else {
      const newEvent: EventData = {
        id: `e-${Date.now()}`, title: form.title || "", description: form.description || "",
        date: form.date || "", venue: form.venue || "", image: form.image || "",
        images: form.images || [],
        icon: form.icon || "Infinity", 
        status: form.status || "upcoming",
        showOnHome: form.showOnHome || false, 
        showOnEventPage: form.showOnEventPage !== undefined ? form.showOnEventPage : true,
        isCountdownEvent: form.isCountdownEvent || false,
        links: form.links || [], downloads: form.downloads || [],
      };
      
      // If this is set as the countdown event, unset others
      const updatedEvents = newEvent.isCountdownEvent 
        ? events.map(e => ({ ...e, isCountdownEvent: false }))
        : events;

      autoSave([...updatedEvents, newEvent]);
      setShowNew(false);
    }
    setForm({});
  };

  const deleteEvent = (id: string) => {
    if (confirm("Delete this event permanently?")) {
      autoSave(events.filter((e) => e.id !== id));
    }
  };

  const addLink = () => setForm({ ...form, links: [...(form.links || []), { label: "", url: "" }] });
  const addDownload = () => setForm({ ...form, downloads: [...(form.downloads || []), { name: "", url: "" }] });
  const updateLink = (idx: number, field: "label" | "url", value: string) => {
    const links = [...(form.links || [])];
    links[idx] = { ...links[idx], [field]: value };
    setForm({ ...form, links });
  };
  const updateDownload = (idx: number, field: "name" | "url", value: string) => {
    const downloads = [...(form.downloads || [])];
    downloads[idx] = { ...downloads[idx], [field]: value };
    setForm({ ...form, downloads });
  };
  const removeLink = (idx: number) => setForm({ ...form, links: (form.links || []).filter((_, i) => i !== idx) });
  const removeDownload = (idx: number) => setForm({ ...form, downloads: (form.downloads || []).filter((_, i) => i !== idx) });
  const removeGalleryImage = (idx: number) => setForm({ ...form, images: (form.images || []).filter((_, i) => i !== idx) });

  const renderForm = () => (
    <div className="space-y-4 p-4 border" style={{ borderColor: "var(--accent)", backgroundColor: "var(--bg-surface)" }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>Title *</label>
          <input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2 text-sm font-mono border outline-none bg-transparent focus:border-[var(--accent)]"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }} />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>Date</label>
          <input type="date" value={form.date || ""} onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full px-3 py-2 text-sm font-mono border outline-none bg-transparent focus:border-[var(--accent)]"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }} />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>Venue</label>
          <input value={form.venue || ""} onChange={(e) => setForm({ ...form, venue: e.target.value })}
            className="w-full px-3 py-2 text-sm font-mono border outline-none bg-transparent focus:border-[var(--accent)]"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }} />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>Icon</label>
          <select value={form.icon || "Infinity"} onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className="w-full px-3 py-2 text-sm font-mono border outline-none bg-transparent cursor-pointer"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)", backgroundColor: "var(--bg-secondary)" }}>
            {iconOptions.map((ico) => <option key={ico} value={ico}>{ico}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>Description</label>
        <textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
          className="w-full px-3 py-2 text-sm font-mono border outline-none bg-transparent resize-none focus:border-[var(--accent)]"
          style={{ borderColor: "var(--border)", color: "var(--text-primary)" }} />
      </div>
      <div>
        <label className="block text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>Cover Image URL</label>
        <div className="flex items-center gap-2">
            <input value={form.image || ""} onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="flex-1 px-3 py-2 text-sm font-mono border outline-none bg-transparent focus:border-[var(--accent)]"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }} placeholder="https://..." />
            <button 
                type="button"
                onClick={() => { setMediaPickerTarget("cover"); setShowMediaPicker(true); }}
                className="px-3 py-2 text-[10px] tracking-wider uppercase border whitespace-nowrap cursor-pointer flex items-center gap-1.5"
                style={{ borderColor: "var(--border)", color: "var(--text-primary)", backgroundColor: "var(--bg-secondary)" }}>
                <ImageIcon className="w-3 h-3" /> Browse Library
            </button>
        </div>
        {form.image && (
          <div className="mt-2 text-xs font-mono">
            <img src={form.image} alt="Preview" className="w-32 h-16 object-cover border" style={{borderColor: "var(--border)"}}/>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
            <label className="block text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--text-muted)" }}>Event Gallery Images</label>
            <button type="button" onClick={() => { setMediaPickerTarget("gallery"); setShowMediaPicker(true); }}
                className="text-[10px] flex items-center gap-1 cursor-pointer" style={{ color: "var(--accent)" }}>
                <ImageIcon className="w-3 h-3" /> Add Image
            </button>
        </div>
        {form.images && form.images.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {form.images.map((img, i) => (
               <div key={i} className="relative w-20 h-20 border group" style={{ borderColor: 'var(--border)' }}>
                 <img src={img} alt="" className="w-full h-full object-cover" />
                 <button onClick={() => removeGalleryImage(i)} type="button" className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                 </button>
               </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)" }}>
         <div>
           <label className="block text-[10px] tracking-[0.2em] uppercase mb-2 font-bold" style={{ color: "var(--text-primary)" }}>Event Status</label>
           <select value={form.status || "upcoming"} onChange={(e) => setForm({ ...form, status: e.target.value as "upcoming" | "ongoing" | "ended" })}
            className="w-full px-3 py-2 text-sm font-mono border outline-none bg-transparent cursor-pointer"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="ended">Ended</option>
           </select>
         </div>

         <div className="space-y-3 pt-4">
            <button onClick={() => setForm({ ...form, showOnHome: !form.showOnHome })}
              className="flex items-center gap-2 text-xs tracking-wider uppercase cursor-pointer"
              style={{ color: form.showOnHome ? "var(--accent)" : "var(--text-muted)" }}>
              {form.showOnHome ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              Show on Home Page
            </button>
            <button onClick={() => setForm({ ...form, showOnEventPage: !form.showOnEventPage })}
              className="flex items-center gap-2 text-xs tracking-wider uppercase cursor-pointer"
              style={{ color: form.showOnEventPage !== false ? "var(--accent)" : "var(--text-muted)" }}>
              {form.showOnEventPage !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              Show on Events Page
            </button>
            <button onClick={() => setForm({ ...form, isCountdownEvent: !form.isCountdownEvent })}
              className="flex items-center gap-2 text-xs tracking-wider uppercase font-bold cursor-pointer"
              style={{ color: form.isCountdownEvent ? "#10b981" : "var(--text-muted)" }}>
              {form.isCountdownEvent ? <Calendar className="w-3.5 h-3.5 text-[#10b981]" /> : <Calendar className="w-3.5 h-3.5" />}
              {form.isCountdownEvent ? "ACTIVE HOME PAGE COUNTDOWN" : "Make Home Page Countdown"}
            </button>
         </div>
      </div>
      {/* Links */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--text-muted)" }}>Links</span>
          <button onClick={addLink} className="text-[10px] flex items-center gap-1 cursor-pointer" style={{ color: "var(--accent)" }}><Plus className="w-3 h-3" /> Add Link</button>
        </div>
        {(form.links || []).map((link, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input value={link.label} onChange={(e) => updateLink(i, "label", e.target.value)} placeholder="Label"
              className="flex-1 px-2 py-1.5 text-xs font-mono border outline-none bg-transparent" style={{ borderColor: "var(--border)", color: "var(--text-primary)" }} />
            <input value={link.url} onChange={(e) => updateLink(i, "url", e.target.value)} placeholder="URL"
              className="flex-1 px-2 py-1.5 text-xs font-mono border outline-none bg-transparent" style={{ borderColor: "var(--border)", color: "var(--text-primary)" }} />
            <button onClick={() => removeLink(i)} className="cursor-pointer" style={{ color: "var(--text-muted)" }}><X className="w-3.5 h-3.5" /></button>
          </div>
        ))}
      </div>
      {/* Downloads */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--text-muted)" }}>Downloads</span>
          <button onClick={addDownload} className="text-[10px] flex items-center gap-1 cursor-pointer" style={{ color: "var(--accent)" }}><Plus className="w-3 h-3" /> Add Download</button>
        </div>
        {(form.downloads || []).map((dl, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input value={dl.name} onChange={(e) => updateDownload(i, "name", e.target.value)} placeholder="File Name"
              className="flex-1 px-2 py-1.5 text-xs font-mono border outline-none bg-transparent" style={{ borderColor: "var(--border)", color: "var(--text-primary)" }} />
            <input value={dl.url} onChange={(e) => updateDownload(i, "url", e.target.value)} placeholder="URL"
              className="flex-1 px-2 py-1.5 text-xs font-mono border outline-none bg-transparent" style={{ borderColor: "var(--border)", color: "var(--text-primary)" }} />
            <button onClick={() => removeDownload(i)} className="cursor-pointer" style={{ color: "var(--text-muted)" }}><X className="w-3.5 h-3.5" /></button>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button onClick={saveEvent} className="flex items-center gap-2 px-4 py-2 text-xs tracking-wider uppercase cursor-pointer"
          style={{ backgroundColor: "var(--accent)", color: "var(--bg-primary)" }}><Save className="w-3.5 h-3.5" /> Save Event</button>
        <button onClick={() => { setShowNew(false); setEditingId(null); setForm({}); }}
          className="px-4 py-2 text-xs tracking-wider uppercase border cursor-pointer" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>Cancel</button>
      </div>
    </div>
  );

  if (loading) {
    return <div className="flex items-center justify-center py-32"><Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--accent)" }} /></div>;
  }

  return (
    <div className="space-y-6">
      <MediaPicker 
        isOpen={showMediaPicker} 
        onClose={() => setShowMediaPicker(false)} 
        onSelect={(file) => { 
            if (mediaPickerTarget === "cover") {
                setForm({ ...form, image: file.url }); 
            } else {
                setForm({ ...form, images: [...(form.images || []), file.url] });
            }
            setShowMediaPicker(false); 
        }}
        typeFilter="image"
      />

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-[0.2em] uppercase" style={{ color: "var(--text-primary)" }}>Events Manager</h1>
          <p className="text-xs mt-1 tracking-wider" style={{ color: "var(--text-muted)" }}>Create, edit, and manage all events</p>
        </div>
        <button onClick={startNew} className="flex items-center gap-2 px-4 py-2 text-xs tracking-wider uppercase border transition-colors hover:bg-[var(--bg-surface-hover)] cursor-pointer"
          style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><Plus className="w-4 h-4" /> New Event</button>
      </div>

      {showNew && renderForm()}

      {events.length === 0 && !showNew && (
        <div className="border border-dashed p-12 text-center" style={{ borderColor: "var(--border)" }}>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>No events yet. Create your first event!</p>
          <button onClick={startNew} className="px-4 py-2 text-xs tracking-wider uppercase cursor-pointer"
            style={{ backgroundColor: "var(--accent)", color: "var(--bg-primary)" }}><Plus className="w-4 h-4 inline mr-2" />Create Event</button>
        </div>
      )}

      <div className="space-y-3">
        {events.map((event) => (
          <motion.div key={event.id} className="border" style={{ borderColor: editingId === event.id ? "var(--accent)" : "var(--border)" }} layout>
            <div className="flex items-center justify-between px-4 py-3 cursor-pointer" onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border overflow-hidden shrink-0 relative" style={{ borderColor: "var(--border)" }}>
                  {event.image && <img src={event.image} alt="" className="w-full h-full object-cover" />}
                  {event.images && event.images.length > 0 && <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[8px] px-1 font-mono">+{event.images.length}</span>}
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-wider uppercase" style={{ color: "var(--text-primary)" }}>{event.title}</h3>
                  <div className="flex items-center gap-3 text-[10px]" style={{ color: "var(--text-muted)" }}>
                    {event.date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{event.date}</span>}
                    {event.venue && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.venue}</span>}
                    {event.links.length > 0 && <span className="flex items-center gap-1"><Link2 className="w-3 h-3" />{event.links.length}</span>}
                    {event.downloads.length > 0 && <span className="flex items-center gap-1"><Download className="w-3 h-3" />{event.downloads.length}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {event.status === "upcoming" && <span className="text-[9px] px-1.5 py-0.5 border text-blue-400 border-blue-400/30 bg-blue-400/10">UPCOMING</span>}
                {event.status === "ongoing" && <span className="text-[9px] px-1.5 py-0.5 border text-green-400 border-green-400/30 bg-green-400/10">ONGOING</span>}
                {event.status === "ended" && <span className="text-[9px] px-1.5 py-0.5 border text-gray-500 border-gray-500/30 bg-gray-500/10">ENDED</span>}
                
                {event.isCountdownEvent && <span className="text-[9px] px-1.5 py-0.5 border text-[#10b981] border-[#10b981]" title="Active Countdown">⏱ CM</span>}
                {event.showOnHome && <span className="text-[9px] px-1.5 py-0.5 border" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>HOME</span>}
                {event.showOnEventPage !== false && <span className="text-[9px] px-1.5 py-0.5 border text-yellow-500 border-yellow-500/50">EVT</span>}
                
                <button onClick={(e) => { e.stopPropagation(); startEdit(event); }} className="p-1.5 cursor-pointer ml-2" style={{ color: "var(--text-muted)" }}><Edit3 className="w-3.5 h-3.5" /></button>
                <button onClick={(e) => { e.stopPropagation(); deleteEvent(event.id); }} className="p-1.5 cursor-pointer hover:text-red-500" style={{ color: "var(--text-muted)" }}><Trash2 className="w-3.5 h-3.5" /></button>
                {expandedId === event.id ? <ChevronUp className="w-4 h-4" style={{ color: "var(--text-muted)" }} /> : <ChevronDown className="w-4 h-4" style={{ color: "var(--text-muted)" }} />}
              </div>
            </div>
            <AnimatePresence>
              {expandedId === event.id && editingId === event.id && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">{renderForm()}</motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
