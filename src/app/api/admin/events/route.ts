import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/local-db";

export interface EventLink { label: string; url: string; }
export interface EventDownload { name: string; url: string; }

export interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  image: string;
  images?: string[];
  icon: string;
  showOnHome: boolean;
  links: EventLink[];
  downloads: EventDownload[];
}

const FILE = "events.json";

export async function GET() {
  const data = await readData<EventData[]>(FILE, []);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const events = await readData<EventData[]>(FILE, []);

    if (body.action === "create") {
      events.push({ ...body.data, id: `e-${Date.now()}` });
    } else if (body.action === "update") {
      const idx = events.findIndex((e) => e.id === body.id);
      if (idx !== -1) events[idx] = { ...events[idx], ...body.data };
    } else if (body.action === "delete") {
      const filtered = events.filter((e) => e.id !== body.id);
      const ok = await writeData(FILE, filtered);
      if (!ok) return NextResponse.json({ error: "Write failed" }, { status: 503 });
      return NextResponse.json({ success: true });
    } else if (body.action === "save_all") {
      const ok = await writeData(FILE, body.events);
      if (!ok) return NextResponse.json({ error: "Write failed" }, { status: 503 });
      return NextResponse.json({ success: true });
    }

    const ok = await writeData(FILE, events);
    if (!ok) return NextResponse.json({ error: "Write failed" }, { status: 503 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
