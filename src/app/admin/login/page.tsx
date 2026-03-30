"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin");
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center font-mono px-4"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <motion.div
        className="w-full max-w-md p-8 border"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--border)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <h1
            className="text-2xl font-bold tracking-[0.3em] uppercase mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Admin Panel
          </h1>
          <div className="h-px w-16 mx-auto" style={{ backgroundColor: "var(--accent)" }} />
          <p
            className="mt-3 text-xs tracking-wider uppercase"
            style={{ color: "var(--text-muted)" }}
          >
            Brahmagupta Mathematics Club
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              className="block text-[10px] tracking-[0.2em] uppercase mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 text-sm font-mono border outline-none transition-colors focus:border-[var(--accent)]"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
              placeholder="admin@brahmagupta.club"
            />
          </div>

          <div>
            <label
              className="block text-[10px] tracking-[0.2em] uppercase mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 text-sm font-mono border outline-none transition-colors focus:border-[var(--accent)]"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <motion.p
              className="text-xs font-mono px-3 py-2 border"
              style={{ color: "#f43f5e", borderColor: "#f43f5e30", backgroundColor: "#f43f5e08" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ✕ {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-xs font-mono tracking-[0.3em] uppercase transition-all duration-300 border cursor-pointer disabled:opacity-50"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--bg-primary)",
              borderColor: "var(--accent)",
            }}
          >
            {loading ? "Authenticating..." : "Access Panel"}
          </button>
        </form>

        <p
          className="text-center text-[10px] mt-6 tracking-wider"
          style={{ color: "var(--text-muted)" }}
        >
          Unauthorized access is logged and monitored
        </p>
      </motion.div>
    </main>
  );
}
