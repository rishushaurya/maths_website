import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function readJSON<T>(filename: string, defaultValue: T): T {
  try {
    const filePath = path.join(DATA_DIR, filename);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
    }
  } catch {
    // Return default
  }
  return defaultValue;
}

// ---- Gallery ----
export interface GalleryItem {
  id: string;
  type: "image" | "video";
  url: string;
  name: string;
}

export interface GallerySection {
  id: string;
  name: string;
  showOnHome: boolean;
  showOnGalleryPage?: boolean;
  items: GalleryItem[];
}

export function getGallerySections(): GallerySection[] {
  return readJSON<GallerySection[]>("gallery.json", []);
}

export function getHomeGallerySections(): GallerySection[] {
  return getGallerySections().filter((s) => s.showOnHome && s.items.length > 0);
}

// ---- Events ----
export interface EventLink { label: string; url: string; }
export interface EventDownload { name: string; url: string; }

export interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  image: string;
  icon: string;
  
  // Visibility & State
  status: "upcoming" | "ongoing" | "ended";
  showOnHome: boolean;                 // Controls if it appears in Home Page general list
  showOnEventPage: boolean;            // Controls if it appears in Events Page list
  isCountdownEvent: boolean;           // If true, this is the event shown in the Home Page Countdown Hero
  
  links: EventLink[];
  downloads: EventDownload[];
}

export function getEvents(): EventData[] {
  return readJSON<EventData[]>("events.json", []);
}

export function getHomeEvents(): EventData[] {
  return getEvents().filter((e) => e.showOnHome);
}

// ---- Team ----
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: "faculty" | "student" | "developer";
  cardType: "faculty-card" | "avatar-hover" | "testimonial";
  image: string;
  email?: string;
  quote?: string;
  affiliation?: string;
}

export function getTeamMembers(): TeamMember[] {
  return readJSON<TeamMember[]>("team.json", []);
}

export function getFaculty(): TeamMember[] {
  return getTeamMembers().filter((m) => m.category === "faculty");
}

export function getStudents(): TeamMember[] {
  return getTeamMembers().filter((m) => m.category === "student");
}

export function getDevelopers(): TeamMember[] {
  return getTeamMembers().filter((m) => m.category === "developer");
}

// ---- Content ----
export interface ContentSection {
  id: string;
  title: string;
  paragraphs: string[];
}

export function getContent(): ContentSection[] {
  return readJSON<ContentSection[]>("content.json", []);
}

export function getAboutContent(): ContentSection | null {
  return getContent().find((s) => s.id === "about") || null;
}

// ---- Settings ----
export interface SiteSettings {
  siteTitle: string;
  defaultTheme: string;        // 'default', 'sapphire', 'gold', 'emerald', 'rose'
  defaultAppearance: string;   // 'dark', 'light'
  adminEmail: string;

  // Global Layout Overrides
  facultyHeading: string;
  studentHeading: string;
  developerHeading: string;
  facultyGridCols: number;
  studentGridCols: number;
}

export function getSettings(): SiteSettings {
  return readJSON<SiteSettings>("settings.json", {
    siteTitle: "Brahmagupta Mathematics Club | DSU",
    defaultTheme: "default",
    defaultAppearance: "dark",
    adminEmail: "admin@brahmagupta.club",
    facultyHeading: "FACULTY",
    studentHeading: "OPERATIONS TEAM",
    developerHeading: "DEVELOPERS",
    facultyGridCols: 3,
    studentGridCols: 4,
  });
}
