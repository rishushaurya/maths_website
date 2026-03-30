"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Image, CalendarDays, Users, FileText, ArrowRight } from "lucide-react";

const quickLinks = [
  { label: "Gallery", desc: "Upload images & videos, manage sections", href: "/admin/gallery", icon: Image },
  { label: "Events", desc: "Create & edit events, add downloads", href: "/admin/events", icon: CalendarDays },
  { label: "Team", desc: "Manage faculty, students & developers", href: "/admin/team", icon: Users },
  { label: "Content", desc: "Edit About page, footer & static text", href: "/admin/content", icon: FileText },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-[0.2em] uppercase" style={{ color: "var(--text-primary)" }}>
          Dashboard
        </h1>
        <p className="text-xs mt-2 tracking-wider" style={{ color: "var(--text-muted)" }}>
          Welcome to the Brahmagupta CMS. Manage your entire website from here.
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickLinks.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={item.href}
                className="group flex items-start gap-4 p-6 border transition-all duration-300 hover:border-[var(--accent)]"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
              >
                <div
                  className="p-3 border"
                  style={{ borderColor: "var(--border)", color: "var(--accent)" }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold tracking-wider uppercase" style={{ color: "var(--text-primary)" }}>
                    {item.label}
                  </h3>
                  <p className="text-xs mt-1 normal-case tracking-normal" style={{ color: "var(--text-secondary)" }}>
                    {item.desc}
                  </p>
                </div>
                <ArrowRight
                  className="w-4 h-4 mt-1 transition-transform group-hover:translate-x-1"
                  style={{ color: "var(--text-muted)" }}
                />
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Info section */}
      <div className="border p-6 mt-8" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "var(--text-secondary)" }}>
          Quick Tip
        </h3>
        <p className="text-xs leading-relaxed normal-case tracking-normal" style={{ color: "var(--text-muted)" }}>
          Press <kbd className="px-1.5 py-0.5 border text-[10px] mx-1" style={{ borderColor: "var(--border)" }}>Ctrl + K</kbd>
          to open the command palette and quickly navigate to any section. All changes are saved to the database instantly.
        </p>
      </div>
    </div>
  );
}
