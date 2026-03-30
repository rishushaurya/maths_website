import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/local-db";

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

const FILE = "team.json";

export async function GET() {
  const data = await readData<TeamMember[]>(FILE, []);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const members = await readData<TeamMember[]>(FILE, []);

    if (body.action === "create") {
      members.push({ ...body.data, id: `m-${Date.now()}` });
    } else if (body.action === "update") {
      const idx = members.findIndex((m) => m.id === body.id);
      if (idx !== -1) members[idx] = { ...members[idx], ...body.data };
    } else if (body.action === "delete") {
      const filtered = members.filter((m) => m.id !== body.id);
      const ok = await writeData(FILE, filtered);
      if (!ok) return NextResponse.json({ error: "Write failed" }, { status: 503 });
      return NextResponse.json({ success: true });
    } else if (body.action === "save_all") {
      const ok = await writeData(FILE, body.members);
      if (!ok) return NextResponse.json({ error: "Write failed" }, { status: 503 });
      return NextResponse.json({ success: true });
    }

    const ok = await writeData(FILE, members);
    if (!ok) return NextResponse.json({ error: "Write failed" }, { status: 503 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
