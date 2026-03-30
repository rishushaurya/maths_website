"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit3, Save, X, Users, GraduationCap, Code, User, Loader2 } from "lucide-react";

type MemberCategory = "faculty" | "student" | "developer";
type CardType = "faculty-card" | "avatar-hover" | "testimonial";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: MemberCategory;
  cardType: CardType;
  image: string;
  email?: string;
  quote?: string;
  affiliation?: string;
}

const categoryIcons = { faculty: GraduationCap, student: Users, developer: Code };
const categoryLabels = { faculty: "Faculty", student: "Student", developer: "Developer" };
const cardTypeLabels: Record<CardType, string> = { "faculty-card": "Faculty Card", "avatar-hover": "Avatar Hover Card", "testimonial": "Testimonial Slider" };

export default function TeamManager() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState<Partial<TeamMember>>({});
  const [filterCategory, setFilterCategory] = useState<MemberCategory | "all">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/team").then((r) => r.json()).then((data) => {
      if (Array.isArray(data)) setMembers(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoSave = useCallback((updated: TeamMember[]) => {
    setMembers(updated);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_all", members: updated }),
      });
    }, 500);
  }, []);

  const startNew = (category: MemberCategory = "student") => {
    setForm({
      name: "", role: "", category,
      cardType: category === "faculty" ? "faculty-card" : category === "developer" ? "testimonial" : "avatar-hover",
      image: "", email: "", quote: "", affiliation: "",
    });
    setShowNew(true);
    setEditingId(null);
  };

  const startEdit = (member: TeamMember) => {
    setForm({ ...member });
    setEditingId(member.id);
    setShowNew(false);
  };

  const saveMember = () => {
    if (!form.name?.trim()) return;
    if (editingId) {
      autoSave(members.map((m) => (m.id === editingId ? { ...m, ...(form as TeamMember) } : m)));
      setEditingId(null);
    } else {
      autoSave([...members, { ...(form as TeamMember), id: `m-${Date.now()}` }]);
      setShowNew(false);
    }
    setForm({});
  };

  const deleteMember = (id: string) => {
    if (confirm("Remove this team member?")) {
      autoSave(members.filter((m) => m.id !== id));
    }
  };

  const cancel = () => { setShowNew(false); setEditingId(null); setForm({}); };
  const filtered = filterCategory === "all" ? members : members.filter((m) => m.category === filterCategory);

  const renderForm = () => (
    <motion.div className="p-5 border space-y-4" style={{ borderColor: "var(--accent)", backgroundColor: "var(--bg-surface)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>Name *</label>
          <input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 text-sm font-mono border outline-none bg-transparent focus:border-[var(--accent)]"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }} />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>Role / Position</label>
          <input value={form.role || ""} onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full px-3 py-2 text-sm font-mono border outline-none bg-transparent focus:border-[var(--accent)]"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }} />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>Category</label>
          <select value={form.category || "student"} onChange={(e) => {
            const cat = e.target.value as MemberCategory;
            setForm({ ...form, category: cat, cardType: cat === "faculty" ? "faculty-card" : cat === "developer" ? "testimonial" : "avatar-hover" });
          }}
            className="w-full px-3 py-2 text-sm font-mono border outline-none bg-transparent cursor-pointer"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)", backgroundColor: "var(--bg-secondary)" }}>
            <option value="faculty">Faculty</option>
            <option value="student">Student</option>
            <option value="developer">Developer</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>Card Type</label>
          <select value={form.cardType || "avatar-hover"} onChange={(e) => setForm({ ...form, cardType: e.target.value as CardType })}
            className="w-full px-3 py-2 text-sm font-mono border outline-none bg-transparent cursor-pointer"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)", backgroundColor: "var(--bg-secondary)" }}>
            {Object.entries(cardTypeLabels).map(([val, label]) => <option key={val} value={val}>{label}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>Profile Image URL</label>
        <input value={form.image || ""} onChange={(e) => setForm({ ...form, image: e.target.value })}
          className="w-full px-3 py-2 text-sm font-mono border outline-none bg-transparent focus:border-[var(--accent)]"
          style={{ borderColor: "var(--border)", color: "var(--text-primary)" }} placeholder="https://..." />
      </div>
      {form.category === "faculty" && (
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>Email</label>
          <input value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2 text-sm font-mono border outline-none bg-transparent focus:border-[var(--accent)]"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }} />
        </div>
      )}
      {form.category === "developer" && (
        <>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>Affiliation</label>
            <input value={form.affiliation || ""} onChange={(e) => setForm({ ...form, affiliation: e.target.value })}
              className="w-full px-3 py-2 text-sm font-mono border outline-none bg-transparent focus:border-[var(--accent)]"
              style={{ borderColor: "var(--border)", color: "var(--text-primary)" }} />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>Quote</label>
            <textarea value={form.quote || ""} onChange={(e) => setForm({ ...form, quote: e.target.value })} rows={2}
              className="w-full px-3 py-2 text-sm font-mono border outline-none bg-transparent resize-none focus:border-[var(--accent)]"
              style={{ borderColor: "var(--border)", color: "var(--text-primary)" }} />
          </div>
        </>
      )}
      <div className="flex items-center gap-3 pt-2">
        <button onClick={saveMember} className="flex items-center gap-2 px-4 py-2 text-xs tracking-wider uppercase cursor-pointer"
          style={{ backgroundColor: "var(--accent)", color: "var(--bg-primary)" }}><Save className="w-3.5 h-3.5" /> Save Member</button>
        <button onClick={cancel} className="px-4 py-2 text-xs tracking-wider uppercase border cursor-pointer"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>Cancel</button>
      </div>
    </motion.div>
  );

  if (loading) {
    return <div className="flex items-center justify-center py-32"><Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--accent)" }} /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-[0.2em] uppercase" style={{ color: "var(--text-primary)" }}>Team Manager</h1>
          <p className="text-xs mt-1 tracking-wider" style={{ color: "var(--text-muted)" }}>Manage faculty, students, and developer team members</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => startNew("faculty")} className="flex items-center gap-1.5 px-3 py-2 text-[10px] tracking-wider uppercase border cursor-pointer hover:border-[var(--accent)]"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}><GraduationCap className="w-3.5 h-3.5" /> Faculty</button>
          <button onClick={() => startNew("student")} className="flex items-center gap-1.5 px-3 py-2 text-[10px] tracking-wider uppercase border cursor-pointer hover:border-[var(--accent)]"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}><Users className="w-3.5 h-3.5" /> Student</button>
          <button onClick={() => startNew("developer")} className="flex items-center gap-1.5 px-3 py-2 text-[10px] tracking-wider uppercase border cursor-pointer hover:border-[var(--accent)]"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}><Code className="w-3.5 h-3.5" /> Developer</button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {(["all", "faculty", "student", "developer"] as const).map((cat) => (
          <button key={cat} onClick={() => setFilterCategory(cat)}
            className="px-3 py-1.5 text-[10px] tracking-wider uppercase border transition-colors cursor-pointer"
            style={{
              borderColor: filterCategory === cat ? "var(--accent)" : "var(--border)",
              color: filterCategory === cat ? "var(--accent)" : "var(--text-muted)",
              backgroundColor: filterCategory === cat ? "var(--bg-surface-hover)" : "transparent",
            }}>
            {cat === "all" ? "All" : categoryLabels[cat]} {cat !== "all" && `(${members.filter((m) => m.category === cat).length})`}
          </button>
        ))}
      </div>

      {showNew && renderForm()}

      {filtered.length === 0 && !showNew && (
        <div className="border border-dashed p-12 text-center" style={{ borderColor: "var(--border)" }}>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>No team members yet. Add your first member!</p>
          <button onClick={() => startNew()} className="px-4 py-2 text-xs tracking-wider uppercase cursor-pointer"
            style={{ backgroundColor: "var(--accent)", color: "var(--bg-primary)" }}><Plus className="w-4 h-4 inline mr-2" />Add Member</button>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((member) => {
          const CatIcon = categoryIcons[member.category];
          return (
            <div key={member.id}>
              <div className="flex items-center justify-between px-4 py-3 border transition-colors"
                style={{ borderColor: editingId === member.id ? "var(--accent)" : "var(--border)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border shrink-0" style={{ borderColor: "var(--border)" }}>
                    {member.image ? <img src={member.image} alt="" className="w-full h-full object-cover" /> :
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "var(--bg-secondary)" }}>
                        <User className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
                      </div>}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-wider" style={{ color: "var(--text-primary)" }}>{member.name}</h3>
                    <div className="flex items-center gap-2 text-[10px]" style={{ color: "var(--text-muted)" }}>
                      <CatIcon className="w-3 h-3" /><span className="uppercase tracking-wider">{categoryLabels[member.category]}</span><span>·</span><span>{member.role}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-1.5 py-0.5 border hidden sm:inline-block" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                    {cardTypeLabels[member.cardType]}
                  </span>
                  <button onClick={() => startEdit(member)} className="p-1.5 cursor-pointer" style={{ color: "var(--text-muted)" }}><Edit3 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => deleteMember(member.id)} className="p-1.5 cursor-pointer hover:text-red-500" style={{ color: "var(--text-muted)" }}><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              {editingId === member.id && renderForm()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
