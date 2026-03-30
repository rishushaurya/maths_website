import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/local-db";

interface ContentSection {
  id: string;
  title: string;
  paragraphs: string[];
}

const FILE = "content.json";

export async function GET() {
  const data = readData<ContentSection[]>(FILE, []);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ok = writeData(FILE, body.sections);
    if (!ok) return NextResponse.json({ error: "Write failed — read-only filesystem. Run locally to make changes." }, { status: 503 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
