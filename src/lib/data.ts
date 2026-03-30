import { readData } from "@/lib/local-db";

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

export async function getGallerySections(): Promise<GallerySection[]> {
  return readData<GallerySection[]>("gallery.json", []);
}

export async function getHomeGallerySections(): Promise<GallerySection[]> {
  const sections = await getGallerySections();
  return sections.filter((s) => s.showOnHome && s.items.length > 0);
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
  showOnHome: boolean;
  showOnEventPage: boolean;
  isCountdownEvent: boolean;
  
  links: EventLink[];
  downloads: EventDownload[];
}

export async function getEvents(): Promise<EventData[]> {
  return readData<EventData[]>("events.json", []);
}

export async function getHomeEvents(): Promise<EventData[]> {
  const events = await getEvents();
  return events.filter((e) => e.showOnHome);
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

export async function getTeamMembers(): Promise<TeamMember[]> {
  return readData<TeamMember[]>("team.json", []);
}

export async function getFaculty(): Promise<TeamMember[]> {
  const members = await getTeamMembers();
  return members.filter((m) => m.category === "faculty");
}

export async function getStudents(): Promise<TeamMember[]> {
  const members = await getTeamMembers();
  return members.filter((m) => m.category === "student");
}

export async function getDevelopers(): Promise<TeamMember[]> {
  const members = await getTeamMembers();
  return members.filter((m) => m.category === "developer");
}

// ---- Content ----
export interface ContentSection {
  id: string;
  title: string;
  paragraphs: string[];
}

export async function getContent(): Promise<ContentSection[]> {
  return readData<ContentSection[]>("content.json", []);
}

export async function getAboutContent(): Promise<ContentSection | null> {
  const content = await getContent();
  return content.find((s) => s.id === "about") || null;
}

// ---- Settings ----
export interface SiteSettings {
  siteTitle: string;
  defaultTheme: string;
  defaultAppearance: string;
  adminEmail: string;
  facultyHeading: string;
  studentHeading: string;
  developerHeading: string;
  facultyGridCols: number;
  studentGridCols: number;
}

export async function getSettings(): Promise<SiteSettings> {
  return readData<SiteSettings>("settings.json", {
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
