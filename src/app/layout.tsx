import type { Metadata } from "next";
import { MinimalFooter } from "@/components/ui/minimal-footer";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";
import AsciiParticleBackground from "@/components/ui/ascii-grid-background";
import { LiquidGlassNav } from "@/components/ui/liquid-glass-nav";
import { AppShell } from "@/components/ui/app-shell";
import { getSettings } from "@/lib/data";
import { themeTokens, type ColorTheme, type AppearanceMode } from "@/lib/theme-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brahmagupta Mathematics Club | DSU",
  description: "Department of Engineering Mathematics — Dayananda Sagar University",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const theme = (settings.defaultTheme || 'default') as ColorTheme;
  const appearance = (settings.defaultAppearance || 'dark') as AppearanceMode;
  
  const tokens = themeTokens[theme]?.[appearance] ?? themeTokens.default.dark;
  
  // Create inline CSS string for the root variables
  const cssVars = Object.entries(tokens)
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ');

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased ${appearance}`}
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: `:root { ${cssVars} }` }} />
      </head>
      <body 
        className="min-h-full flex flex-col transition-colors duration-400"
        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
      >
        <ThemeProvider initialAppearance={appearance} initialColorTheme={theme}>
          <AsciiParticleBackground />
          <LiquidGlassNav />
          <AppShell>
            <div className="relative z-10 w-full flex-grow bg-transparent">
              {children}
            </div>
            <MinimalFooter />
          </AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}

