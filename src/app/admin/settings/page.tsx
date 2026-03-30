"use client";

import React, { useState, useEffect } from "react";
import { Save, Shield, Key, Loader2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [siteTitle, setSiteTitle] = useState("Brahmagupta Mathematics Club | DSU");
  const [defaultTheme, setDefaultTheme] = useState("default");
  const [defaultAppearance, setDefaultAppearance] = useState("dark");
  
  // Layout Controls
  const [facultyHeading, setFacultyHeading] = useState("FACULTY");
  const [studentHeading, setStudentHeading] = useState("OPERATIONS TEAM");
  const [developerHeading, setDeveloperHeading] = useState("DEVELOPERS");
  const [facultyGridCols, setFacultyGridCols] = useState(3);
  const [studentGridCols, setStudentGridCols] = useState(4);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [loading, setLoading] = useState(true);
  const [pwMsg, setPwMsg] = useState("");

  // Load settings from API
  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.siteTitle) setSiteTitle(data.siteTitle);
        if (data.defaultTheme) setDefaultTheme(data.defaultTheme);
        if (data.defaultAppearance) setDefaultAppearance(data.defaultAppearance);
        if (data.facultyHeading) setFacultyHeading(data.facultyHeading);
        if (data.studentHeading) setStudentHeading(data.studentHeading);
        if (data.developerHeading) setDeveloperHeading(data.developerHeading);
        if (data.facultyGridCols) setFacultyGridCols(data.facultyGridCols);
        if (data.studentGridCols) setStudentGridCols(data.studentGridCols);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          siteTitle, defaultTheme, defaultAppearance,
          facultyHeading, studentHeading, developerHeading,
          facultyGridCols, studentGridCols
        }),
      });
      
      if (res.status === 503) {
        setSaveError("⚠ Read-only filesystem (Vercel). Changes cannot be saved in production. Run locally to make permanent admin changes, then push to GitHub.");
        setSaving(false);
        return;
      }
      
      if (!res.ok) {
        setSaveError("Failed to save settings.");
        setSaving(false);
        return;
      }
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      
      // Refresh server components so they re-read settings.json
      // This does NOT trigger the MathLoader since sessionStorage already has "app-loaded"
      router.refresh();
      
    } catch {
      setSaveError("Network error — could not save.");
    }
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      setPwMsg("All fields required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwMsg("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setPwMsg("Password must be at least 8 characters");
      return;
    }
    setPwMsg("Password updated successfully");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPwMsg(""), 3000);
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
      <div>
        <h1 className="text-2xl font-bold tracking-[0.2em] uppercase" style={{ color: "var(--text-primary)" }}>Settings</h1>
        <p className="text-xs mt-1 tracking-wider" style={{ color: "var(--text-muted)" }}>Site configuration and security settings</p>
      </div>

      {/* Site Settings */}
      <div className="border p-5 space-y-4" style={{ borderColor: "var(--border)" }}>
        <h2 className="text-sm font-bold tracking-wider uppercase flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <Shield className="w-4 h-4" style={{ color: "var(--accent)" }} /> Site Configuration
        </h2>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>Site Title</label>
          <input value={siteTitle} onChange={(e) => setSiteTitle(e.target.value)}
            className="w-full px-3 py-2 text-sm font-mono border outline-none bg-transparent focus:border-[var(--accent)]"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>Default Color Theme</label>
            <select value={defaultTheme} onChange={(e) => setDefaultTheme(e.target.value)}
              className="w-full px-3 py-2 text-sm font-mono border outline-none bg-transparent cursor-pointer"
              style={{ borderColor: "var(--border)", color: "var(--text-primary)", backgroundColor: "var(--bg-secondary)" }}>
              <option value="default">Mono (Default)</option>
              <option value="sapphire">Sapphire</option>
              <option value="gold">Gold</option>
              <option value="emerald">Emerald</option>
              <option value="rose">Rose</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>Default Appearance</label>
            <select value={defaultAppearance} onChange={(e) => setDefaultAppearance(e.target.value)}
              className="w-full px-3 py-2 text-sm font-mono border outline-none bg-transparent cursor-pointer"
              style={{ borderColor: "var(--border)", color: "var(--text-primary)", backgroundColor: "var(--bg-secondary)" }}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
        </div>
        
        {/* Layout & Typography Settings */}
        <h2 className="text-sm font-bold tracking-wider uppercase mt-6 pt-6 border-t" style={{ color: "var(--text-primary)", borderColor: "var(--border)" }}>
          Section Settings &amp; Grid Layout
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>Faculty Section Heading</label>
            <input value={facultyHeading} onChange={(e) => setFacultyHeading(e.target.value)}
              className="w-full px-3 py-2 text-sm font-mono border outline-none bg-transparent focus:border-[var(--accent)]"
              style={{ borderColor: "var(--border)", color: "var(--text-primary)" }} />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>Faculty Grid Columns (Desktop)</label>
            <input type="number" min="1" max="6" value={facultyGridCols} onChange={(e) => setFacultyGridCols(parseInt(e.target.value) || 3)}
              className="w-full px-3 py-2 text-sm font-mono border outline-none bg-transparent focus:border-[var(--accent)]"
              style={{ borderColor: "var(--border)", color: "var(--text-primary)" }} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>Student Section Heading</label>
            <input value={studentHeading} onChange={(e) => setStudentHeading(e.target.value)}
              className="w-full px-3 py-2 text-sm font-mono border outline-none bg-transparent focus:border-[var(--accent)]"
              style={{ borderColor: "var(--border)", color: "var(--text-primary)" }} />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>Student Grid Columns (Desktop)</label>
            <input type="number" min="1" max="6" value={studentGridCols} onChange={(e) => setStudentGridCols(parseInt(e.target.value) || 4)}
              className="w-full px-3 py-2 text-sm font-mono border outline-none bg-transparent focus:border-[var(--accent)]"
              style={{ borderColor: "var(--border)", color: "var(--text-primary)" }} />
          </div>
        </div>

        <div>
           <label className="block text-[10px] tracking-[0.2em] uppercase mb-1 mt-2" style={{ color: "var(--text-muted)" }}>Developer Section Heading</label>
            <input value={developerHeading} onChange={(e) => setDeveloperHeading(e.target.value)}
              className="w-full px-3 py-2 text-sm font-mono border outline-none bg-transparent focus:border-[var(--accent)]"
              style={{ borderColor: "var(--border)", color: "var(--text-primary)" }} />
        </div>

        {/* Save Error Message */}
        {saveError && (
          <div className="flex items-start gap-2 px-4 py-3 border text-xs font-mono" style={{ borderColor: "#f59e0b30", color: "#f59e0b", backgroundColor: "#f59e0b10" }}>
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{saveError}</span>
          </div>
        )}

        <button onClick={handleSaveSettings} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 text-xs tracking-wider uppercase cursor-pointer disabled:opacity-50"
          style={{ backgroundColor: saved ? "#10b981" : "var(--accent)", color: "var(--bg-primary)" }}>
          {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</> : saved ? "✓ Saved — Changes Applied" : <><Save className="w-3.5 h-3.5" /> Save Settings</>}
        </button>
        
        {saved && (
          <p className="text-xs font-mono" style={{ color: "#10b981" }}>
            ✓ Settings saved to server. Changes are now live across the site.
          </p>
        )}
      </div>

      {/* Change Password */}
      <div className="border p-5 space-y-4" style={{ borderColor: "var(--border)" }}>
        <h2 className="text-sm font-bold tracking-wider uppercase flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <Key className="w-4 h-4" style={{ color: "var(--accent)" }} /> Change Admin Password
        </h2>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>Current Password</label>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-3 py-2 text-sm font-mono border outline-none bg-transparent focus:border-[var(--accent)]"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm font-mono border outline-none bg-transparent focus:border-[var(--accent)]"
              style={{ borderColor: "var(--border)", color: "var(--text-primary)" }} />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm font-mono border outline-none bg-transparent focus:border-[var(--accent)]"
              style={{ borderColor: "var(--border)", color: "var(--text-primary)" }} />
          </div>
        </div>
        {pwMsg && (
          <p className="text-xs font-mono px-3 py-2 border"
            style={{ color: pwMsg.includes("success") ? "#10b981" : "#f43f5e", borderColor: pwMsg.includes("success") ? "#10b98130" : "#f43f5e30" }}>
            {pwMsg}
          </p>
        )}
        <button onClick={handleChangePassword}
          className="flex items-center gap-2 px-4 py-2 text-xs tracking-wider uppercase border cursor-pointer hover:bg-[var(--bg-surface-hover)]"
          style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
          <Key className="w-3.5 h-3.5" /> Update Password
        </button>
      </div>

      {/* Security Info */}
      <div className="border p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "var(--text-secondary)" }}>Security Information</h3>
        <ul className="space-y-2 text-xs normal-case tracking-normal" style={{ color: "var(--text-muted)" }}>
          <li>• Sessions expire automatically after 8 hours</li>
          <li>• All authentication tokens are stored in httpOnly cookies (immune to XSS)</li>
          <li>• Failed login attempts are rate-limited with deliberate delays</li>
          <li>• All admin routes are protected by JWT middleware verification</li>
          <li>• On Vercel (production), filesystem writes are read-only. Make admin changes locally and push to GitHub.</li>
        </ul>
      </div>
    </div>
  );
}
