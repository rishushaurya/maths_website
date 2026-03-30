import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/local-db";

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
  items: GalleryItem[];
}

const FILE = "gallery.json";

export async function GET() {
  const data = await readData<GallerySection[]>(FILE, []);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sections = await readData<GallerySection[]>(FILE, []);

    if (body.action === "create_section") {
      sections.push({ id: `s-${Date.now()}`, name: body.name, showOnHome: false, items: [] });
    } else if (body.action === "update_section") {
      const idx = sections.findIndex((s) => s.id === body.id);
      if (idx !== -1) Object.assign(sections[idx], body.data);
    } else if (body.action === "delete_section") {
      const filtered = sections.filter((s) => s.id !== body.id);
      const ok = await writeData(FILE, filtered);
      if (!ok) return NextResponse.json({ error: "Write failed" }, { status: 503 });
      return NextResponse.json({ success: true });
    } else if (body.action === "add_items") {
      const sec = sections.find((s) => s.id === body.sectionId);
      if (sec) sec.items.push(...body.items);
    } else if (body.action === "delete_item") {
      const sec = sections.find((s) => s.id === body.sectionId);
      if (sec) sec.items = sec.items.filter((i) => i.id !== body.itemId);
    } else if (body.action === "save_all") {
      const ok = await writeData(FILE, body.sections);
      if (!ok) return NextResponse.json({ error: "Write failed" }, { status: 503 });
      return NextResponse.json({ success: true });
    }

    const ok = await writeData(FILE, sections);
    if (!ok) return NextResponse.json({ error: "Write failed" }, { status: 503 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
