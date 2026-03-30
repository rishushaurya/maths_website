"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Image, CalendarDays, Users, FileText, Settings,
  LogOut, Search, X, ChevronRight, Menu, Library
} from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Gallery", href: "/admin/gallery", icon: Image },
  { label: "Media Library", href: "/admin/media", icon: Library },
  { label: "Events", href: "/admin/events", icon: CalendarDays },
  { label: "Team", href: "/admin/team", icon: Users },
  { label: "Content", href: "/admin/content", icon: FileText },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const searchableItems = [
  { label: "Dashboard", href: "/admin", category: "Pages" },
  { label: "Gallery Manager", href: "/admin/gallery", category: "Pages" },
  { label: "Upload Images", href: "/admin/gallery", category: "Actions" },
  { label: "Media Library", href: "/admin/media", category: "Pages" },
  { label: "Upload Media", href: "/admin/media", category: "Actions" },
  { label: "Events Manager", href: "/admin/events", category: "Pages" },
  { label: "Create Event", href: "/admin/events", category: "Actions" },
  { label: "Team Manager", href: "/admin/team", category: "Pages" },
  { label: "Add Team Member", href: "/admin/team", category: "Actions" },
  { label: "Edit About Page", href: "/admin/content", category: "Actions" },
  { label: "Content Editor", href: "/admin/content", category: "Pages" },
  { label: "Site Settings", href: "/admin/settings", category: "Pages" },
  { label: "Change Theme", href: "/admin/settings", category: "Actions" },
  { label: "Logout", href: "#logout", category: "Actions" },
];

function CommandSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const filtered = searchableItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = async (href: string) => {
    if (href === "#logout") {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } else {
      router.push(href);
    }
    onClose();
    setQuery("");
  };

  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-start justify-center pt-[20vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-lg mx-4 border overflow-hidden"
            style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border)" }}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
              <Search className="w-4 h-4 shrink-0" style={{ color: "var(--text-muted)" }} />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages, actions..."
                className="flex-1 bg-transparent outline-none text-sm font-mono"
                style={{ color: "var(--text-primary)" }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") onClose();
                  if (e.key === "Enter" && filtered.length > 0) handleSelect(filtered[0].href);
                }}
              />
              <kbd className="text-[10px] px-1.5 py-0.5 border font-mono" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                ESC
              </kbd>
            </div>
            <div className="max-h-64 overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <p className="px-4 py-6 text-center text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                  No results found
                </p>
              ) : (
                filtered.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(item.href)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-left text-sm font-mono transition-colors hover:bg-[var(--bg-surface-hover)] cursor-pointer"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] tracking-wider uppercase" style={{ color: "var(--text-muted)" }}>
                      {item.category}
                    </span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  // Don't show admin shell on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen font-mono" style={{ backgroundColor: "var(--bg-primary)" }}>
      <CommandSearch open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 border-r flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border)" }}
      >
        <div className="p-6 border-b" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase" style={{ color: "var(--text-primary)" }}>
            Admin Panel
          </h2>
          <p className="text-[10px] mt-1 tracking-wider" style={{ color: "var(--text-muted)" }}>
            Brahmagupta CMS
          </p>
        </div>

        {/* Search trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className="mx-4 mt-4 flex items-center gap-2 px-3 py-2 text-xs border transition-colors hover:bg-[var(--bg-surface-hover)] cursor-pointer"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          <Search className="w-3.5 h-3.5" />
          <span className="flex-1 text-left">Search...</span>
          <kbd className="text-[10px] px-1 border" style={{ borderColor: "var(--border)" }}>⌘K</kbd>
        </button>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-xs tracking-wider uppercase transition-all duration-200 ${
                  isActive ? "border-l-2" : "border-l-2 border-transparent hover:bg-[var(--bg-surface)]"
                }`}
                style={{
                  color: isActive ? "var(--accent)" : "var(--text-secondary)",
                  borderLeftColor: isActive ? "var(--accent)" : "transparent",
                  backgroundColor: isActive ? "var(--bg-surface)" : "transparent",
                }}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t" style={{ borderColor: "var(--border)" }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 text-xs tracking-wider uppercase w-full transition-colors hover:bg-[var(--bg-surface)] cursor-pointer"
            style={{ color: "var(--text-muted)" }}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar (mobile) */}
        <header
          className="lg:hidden flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}
        >
          <button onClick={() => setSidebarOpen(true)} className="p-2 cursor-pointer" style={{ color: "var(--text-primary)" }}>
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-xs tracking-[0.2em] uppercase font-bold" style={{ color: "var(--text-primary)" }}>
            Admin
          </span>
          <button onClick={() => setSearchOpen(true)} className="p-2 cursor-pointer" style={{ color: "var(--text-muted)" }}>
            <Search className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
