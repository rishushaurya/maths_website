import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/local-db";

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

const FILE = "settings.json";
const DEFAULTS: SiteSettings = {
  siteTitle: "Brahmagupta Mathematics Club | DSU",
  defaultTheme: "default",
  defaultAppearance: "light",
  adminEmail: "admin@brahmagupta.club",
  facultyHeading: "FACULTY",
  studentHeading: "OPERATIONS TEAM",
  developerHeading: "DEVELOPERS",
  facultyGridCols: 3,
  studentGridCols: 4,
};

export async function GET() {
  const data = await readData<SiteSettings>(FILE, DEFAULTS);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const current = await readData<SiteSettings>(FILE, DEFAULTS);
    const updated = { ...current, ...body };
    const ok = await writeData(FILE, updated);
    if (!ok) return NextResponse.json({ error: "Write failed — no Redis or filesystem available." }, { status: 503 });
    return NextResponse.json({ success: true, settings: updated });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
